/**
 * Subscription Controller
 * Handles subscription management, billing, and Stripe webhooks
 */

const TierManager = require('../lib/tier-manager');

class SubscriptionController {
  /**
   * GET /api/subscriptions/current
   * Get current org's subscription details
   */
  static async getCurrentSubscription(req, res) {
    try {
      const { orgId } = req.user;

      const subscription = await req.db.query(
        `SELECT * FROM subscriptions WHERE org_id = $1`,
        [orgId]
      );

      if (subscription.rows.length === 0) {
        return res.json({
          subscription: null,
          status: 'no_subscription',
          message: 'Start your free trial'
        });
      }

      const sub = subscription.rows[0];
      const status = TierManager.getSubscriptionStatus(sub);

      return res.json({
        subscription: sub,
        ...status
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  }

  /**
   * POST /api/subscriptions/start-trial
   * Start free 7-day trial for new user
   */
  static async startTrial(req, res) {
    try {
      const { orgId } = req.user;

      // Check if trial already started
      const existing = await req.db.query(
        `SELECT id FROM subscriptions WHERE org_id = $1`,
        [orgId]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          error: 'Trial already started',
          subscription: existing.rows[0]
        });
      }

      // Create trial subscription
      const trialStarted = new Date();
      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 7);

      const subscription = await req.db.query(
        `INSERT INTO subscriptions 
         (org_id, tier, billing_cycle, started_at, trial_ends_at, status) 
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [orgId, 'free_trial', 'trial', trialStarted, trialEnds, 'active']
      );

      // Log audit event
      await req.db.query(
        `INSERT INTO audit_log (org_id, user_id, action, resource_type, details) 
         VALUES ($1, $2, $3, $4, $5)`,
        [orgId, req.user.id, 'trial_started', 'subscription', JSON.stringify({ trial_ends_at: trialEnds })]
      );

      res.json({
        success: true,
        subscription: subscription.rows[0],
        message: '7-day trial started. Upgrade anytime.'
      });
    } catch (error) {
      console.error('Error starting trial:', error);
      res.status(500).json({ error: 'Failed to start trial' });
    }
  }

  /**
   * POST /api/subscriptions/create-checkout
   * Create Stripe checkout session
   */
  static async createCheckout(req, res) {
    try {
      const { orgId } = req.user;
      const { billingCycle } = req.body; // 'monthly', 'yearly', 'lifetime'

      // Get org details
      const org = await req.db.query(
        `SELECT * FROM organizations WHERE id = $1`,
        [orgId]
      );

      if (org.rows.length === 0) {
        return res.status(404).json({ error: 'Organization not found' });
      }

      // Determine tier and price
      let tierKey, priceId, amount, successUrl;

      if (billingCycle === 'monthly') {
        tierKey = 'pro_monthly';
        priceId = process.env.STRIPE_PRICE_MONTHLY;
        amount = 8800;
      } else if (billingCycle === 'yearly') {
        tierKey = 'pro_yearly';
        priceId = process.env.STRIPE_PRICE_YEARLY;
        amount = 79200;
      } else if (billingCycle === 'lifetime') {
        tierKey = 'pro_lifetime';
        priceId = process.env.STRIPE_PRICE_LIFETIME;
        amount = 383750;
      } else {
        return res.status(400).json({ error: 'Invalid billing cycle' });
      }

      const tier = TierManager.getTierConfig(tierKey);

      // Create Stripe checkout session
      const stripe = req.stripe;
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: org.rows[0].email,
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        metadata: {
          orgId: orgId.toString(),
          tier: tierKey,
          billingCycle: billingCycle
        },
        success_url: `${process.env.FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`
      });

      res.json({
        sessionId: session.id,
        tier: tier.name,
        amount: amount / 100,
        billingCycle: billingCycle
      });
    } catch (error) {
      console.error('Error creating checkout:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  }

  /**
   * POST /api/webhooks/stripe
   * Handle Stripe webhook events
   */
  static async handleStripeWebhook(req, res) {
    const stripe = req.stripe;
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      const { type, data } = event;

      switch (type) {
        case 'checkout.session.completed':
          await SubscriptionController.handleCheckoutCompleted(req.db, data.object);
          break;

        case 'invoice.paid':
          await SubscriptionController.handleInvoicePaid(req.db, data.object);
          break;

        case 'invoice.payment_failed':
          await SubscriptionController.handlePaymentFailed(req.db, data.object);
          break;

        case 'customer.subscription.deleted':
          await SubscriptionController.handleSubscriptionCancelled(req.db, data.object);
          break;

        default:
          console.log(`Unhandled event type: ${type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  /**
   * Handle checkout completed
   */
  static async handleCheckoutCompleted(db, session) {
    const { metadata, customer, id } = session;
    const { orgId, tier, billingCycle } = metadata;

    const tierConfig = TierManager.getTierConfig(tier);
    const renewsAt = TierManager.calculateRenewalDate(billingCycle);

    // Create or update subscription
    const subscription = await db.query(
      `INSERT INTO subscriptions 
       (org_id, tier, billing_cycle, stripe_customer_id, status, started_at, renews_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (org_id) DO UPDATE SET
         tier = $2,
         billing_cycle = $3,
         stripe_customer_id = $4,
         status = $5,
         started_at = $6,
         renews_at = $7
       RETURNING *`,
      [orgId, tier, billingCycle, customer, 'active', new Date(), renewsAt]
    );

    // Log payment event
    await db.query(
      `INSERT INTO payment_events (org_id, event_type, stripe_event_id, details)
       VALUES ($1, $2, $3, $4)`,
      [orgId, 'payment_succeeded', id, JSON.stringify({ tier, billingCycle, amount: session.amount_total })]
    );

    console.log(`Subscription created for org ${orgId}, tier ${tier}`);
  }

  /**
   * Handle invoice paid
   */
  static async handleInvoicePaid(db, invoice) {
    const { customer, id } = invoice;

    // Find org by Stripe customer ID
    const sub = await db.query(
      `UPDATE subscriptions 
       SET stripe_invoice_id = $1, status = 'active'
       WHERE stripe_customer_id = $2
       RETURNING org_id`,
      [id, customer]
    );

    if (sub.rows.length > 0) {
      console.log(`Invoice paid for org ${sub.rows[0].org_id}`);
    }
  }

  /**
   * Handle payment failed
   */
  static async handlePaymentFailed(db, invoice) {
    const { customer, id } = invoice;

    // Find and update subscription
    const sub = await db.query(
      `UPDATE subscriptions 
       SET status = 'past_due'
       WHERE stripe_customer_id = $1
       RETURNING org_id`,
      [customer]
    );

    if (sub.rows.length > 0) {
      console.log(`Payment failed for org ${sub.rows[0].org_id}`);
      // TODO: Send email notification to user
    }
  }

  /**
   * Handle subscription cancelled
   */
  static async handleSubscriptionCancelled(db, subscription) {
    const { customer, id } = subscription;

    const sub = await db.query(
      `UPDATE subscriptions 
       SET status = 'cancelled', cancelled_at = NOW()
       WHERE stripe_customer_id = $1
       RETURNING org_id`,
      [customer]
    );

    if (sub.rows.length > 0) {
      console.log(`Subscription cancelled for org ${sub.rows[0].org_id}`);
    }
  }

  /**
   * GET /api/subscriptions/pricing
   * Get all pricing tiers (public endpoint)
   */
  static async getPricing(req, res) {
    const tiers = TierManager.getPricingTiers();

    const pricing = {
      monthly: {
        tier: tiers.pro_monthly.name,
        price: '$88/month',
        price_cents: 8800,
        billing_cycle: 'monthly',
        description: tiers.pro_monthly.description,
        features: tiers.pro_monthly.features
      },
      yearly: {
        tier: tiers.pro_yearly.name,
        price: '$792/year (save $264)',
        price_cents: 79200,
        billing_cycle: 'yearly',
        description: tiers.pro_yearly.description,
        features: tiers.pro_yearly.features,
        savings_percent: 11
      },
      lifetime: {
        tier: tiers.pro_lifetime.name,
        price: '$3,837.50 (one-time)',
        price_cents: 383750,
        billing_cycle: 'lifetime',
        description: tiers.pro_lifetime.description,
        features: tiers.pro_lifetime.features
      }
    };

    res.json(pricing);
  }

  /**
   * POST /api/subscriptions/cancel
   * Cancel subscription
   */
  static async cancelSubscription(req, res) {
    try {
      const { orgId } = req.user;
      const { reason } = req.body;

      // Update subscription
      await req.db.query(
        `UPDATE subscriptions 
         SET status = 'cancelled', cancelled_at = NOW(), cancellation_reason = $1
         WHERE org_id = $2`,
        [reason || 'User cancelled', orgId]
      );

      // Log audit event
      await req.db.query(
        `INSERT INTO audit_log (org_id, user_id, action, resource_type, details)
         VALUES ($1, $2, $3, $4, $5)`,
        [orgId, req.user.id, 'subscription_cancelled', 'subscription', JSON.stringify({ reason })]
      );

      res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  }
}

module.exports = SubscriptionController;
