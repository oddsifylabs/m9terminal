/**
 * M9 Terminal SaaS - Tier Manager
 * Single-tier model: $88/mo, $792/yr, or $3,837.50 lifetime
 * All paying users get full access to all features
 * Free trial: 7 days, then upgrade required
 */

class TierManager {
  // Define all pricing tiers
  static TIERS = {
    free_trial: {
      name: 'Free Trial',
      price: 0,
      billing_cycle: 'trial',
      duration_days: 7,
      description: '7-day free trial access',
      features: [
        'Full access to all features',
        'Unlimited scans',
        'All sports supported',
        'Real-time odds',
        'Bankroll management',
        '7-day access'
      ],
      limits: {
        scans_per_day: null, // unlimited
        api_calls_per_day: null, // unlimited
        sports: null, // all
        bet_types: null, // all
        data_retention_days: 30
      },
      is_trial: true,
      is_free: true
    },
    pro_monthly: {
      name: 'M9 Pro',
      price: 8800, // $88.00 in cents
      price_formatted: '$88/month',
      billing_cycle: 'monthly',
      stripe_price_id: 'price_m9_88_monthly', // Set in .env
      description: 'Full access to M9 Terminal',
      features: [
        'Unlimited scans & analysis',
        'All 8 sports (MLB, NBA, NFL, NHL, Soccer, Tennis, MMA, Cricket)',
        'Real-time odds & line movement',
        'Bankroll management (full featured)',
        'Advanced analytics & filters',
        'Priority support',
        'Historical data (12+ months)',
        'CSV export & reporting',
        'API access',
        'Multi-user accounts'
      ],
      limits: {
        scans_per_day: null, // unlimited
        api_calls_per_day: null, // unlimited
        sports: null, // all
        bet_types: null, // all
        data_retention_days: 365,
        max_users_per_org: 5
      },
      is_trial: false,
      is_free: false
    },
    pro_yearly: {
      name: 'M9 Pro (Annual)',
      price: 79200, // $792.00 in cents (12 months, saves $264)
      price_formatted: '$792/year',
      billing_cycle: 'yearly',
      stripe_price_id: 'price_m9_792_yearly', // Set in .env
      description: 'Annual plan (save 11%)',
      features: [
        'Unlimited scans & analysis',
        'All 8 sports (MLB, NBA, NFL, NHL, Soccer, Tennis, MMA, Cricket)',
        'Real-time odds & line movement',
        'Bankroll management (full featured)',
        'Advanced analytics & filters',
        'Priority support',
        'Historical data (12+ months)',
        'CSV export & reporting',
        'API access',
        'Multi-user accounts'
      ],
      limits: {
        scans_per_day: null, // unlimited
        api_calls_per_day: null, // unlimited
        sports: null, // all
        bet_types: null, // all
        data_retention_days: 365,
        max_users_per_org: 5
      },
      is_trial: false,
      is_free: false
    },
    pro_lifetime: {
      name: 'M9 Pro (Lifetime)',
      price: 383750, // $3,837.50 in cents (lifetime access, one-time payment)
      price_formatted: '$3,837.50 (lifetime)',
      billing_cycle: 'lifetime',
      stripe_price_id: 'price_m9_3837_lifetime', // Set in .env
      description: 'Lifetime access, one-time payment',
      features: [
        'Unlimited scans & analysis',
        'All 8 sports (MLB, NBA, NFL, NHL, Soccer, Tennis, MMA, Cricket)',
        'Real-time odds & line movement',
        'Bankroll management (full featured)',
        'Advanced analytics & filters',
        'Priority support',
        'Historical data (12+ months)',
        'CSV export & reporting',
        'API access',
        'Multi-user accounts (up to 10)',
        'Free lifetime updates'
      ],
      limits: {
        scans_per_day: null, // unlimited
        api_calls_per_day: null, // unlimited
        sports: null, // all
        bet_types: null, // all
        data_retention_days: 365,
        max_users_per_org: 10 // higher limit for lifetime customers
      },
      is_trial: false,
      is_free: false
    }
  };

  /**
   * Get tier configuration
   */
  static getTierConfig(tierKey) {
    return TierManager.TIERS[tierKey] || null;
  }

  /**
   * Get all pricing tiers (for /pricing page)
   */
  static getAllTiers() {
    return TierManager.TIERS;
  }

  /**
   * Get pricing tiers (excluding free trial)
   */
  static getPricingTiers() {
    return {
      pro_monthly: TierManager.TIERS.pro_monthly,
      pro_yearly: TierManager.TIERS.pro_yearly,
      pro_lifetime: TierManager.TIERS.pro_lifetime
    };
  }

  /**
   * Check if user can perform action (unlimited for pro tiers)
   */
  static canPerformAction(tier, action) {
    const tierConfig = TierManager.getTierConfig(tier);
    if (!tierConfig) return false;

    // All paying tiers have unlimited access
    if (!tierConfig.is_free) {
      return true;
    }

    // Free trial: check limits
    if (tierConfig.is_trial) {
      return true; // Trial users have full access for 7 days
    }

    return false;
  }

  /**
   * Check if subscription is active/valid
   */
  static isSubscriptionActive(subscription) {
    if (!subscription) return false;
    
    // Check if cancelled
    if (subscription.cancelled_at) {
      return false;
    }

    // Check trial expiration
    if (subscription.tier === 'free_trial') {
      return new Date() < new Date(subscription.trial_ends_at);
    }

    // Check if payment failed
    if (subscription.status === 'past_due' || subscription.status === 'failed') {
      return false;
    }

    // Lifetime subscriptions never expire
    if (subscription.billing_cycle === 'lifetime') {
      return true;
    }

    // Check renewal date
    if (subscription.renews_at) {
      return new Date() < new Date(subscription.renews_at);
    }

    return subscription.status === 'active';
  }

  /**
   * Get subscription status message
   */
  static getSubscriptionStatus(subscription) {
    if (!subscription) {
      return { status: 'inactive', message: 'No active subscription', action: 'upgrade' };
    }

    if (subscription.cancelled_at) {
      return { status: 'cancelled', message: 'Subscription cancelled', action: 'reactivate' };
    }

    if (subscription.tier === 'free_trial') {
      const daysLeft = Math.ceil((new Date(subscription.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 0) {
        return { status: 'expired', message: 'Trial expired', action: 'upgrade' };
      }
      return { status: 'trial', message: `${daysLeft} days left in trial`, action: 'upgrade' };
    }

    if (subscription.status === 'past_due') {
      return { status: 'past_due', message: 'Payment overdue', action: 'update_payment' };
    }

    const tier = TierManager.getTierConfig(subscription.tier);
    const tierName = tier ? tier.name : 'Unknown';

    return {
      status: 'active',
      message: `${tierName} - Active`,
      action: 'manage'
    };
  }

  /**
   * Calculate renewal date
   */
  static calculateRenewalDate(billingCycle, startDate = new Date()) {
    const date = new Date(startDate);
    
    if (billingCycle === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    } else if (billingCycle === 'lifetime') {
      return null; // No renewal for lifetime
    } else if (billingCycle === 'trial') {
      date.setDate(date.getDate() + 7);
    }
    
    return date;
  }

  /**
   * Get feature list for tier
   */
  static getFeatures(tierKey) {
    const tier = TierManager.getTierConfig(tierKey);
    return tier ? tier.features : [];
  }

  /**
   * Get limits for tier
   */
  static getLimits(tierKey) {
    const tier = TierManager.getTierConfig(tierKey);
    return tier ? tier.limits : {};
  }

  /**
   * Format price for display
   */
  static formatPrice(priceInCents) {
    return `$${(priceInCents / 100).toFixed(2)}`;
  }

  /**
   * Check if lifetime upgrade available
   */
  static canUpgradeToLifetime(currentTier) {
    // All paying tiers can upgrade to lifetime
    return currentTier === 'pro_monthly' || currentTier === 'pro_yearly';
  }

  /**
   * Get upgrade discount
   */
  static getLifetimeUpgradeCredit(currentTier, monthsRemaining) {
    const tier = TierManager.getTierConfig(currentTier);
    if (!tier) return 0;

    // Pro Monthly: $88/month → $792 lifetime = ~9 months value
    if (currentTier === 'pro_monthly') {
      const monthlyValue = 88 * monthsRemaining;
      const lifetimeValue = 3837.50;
      return Math.max(0, monthlyValue); // Don't credit more than paid
    }

    // Pro Yearly: $792/year
    if (currentTier === 'pro_yearly') {
      return 792; // Full credit of yearly payment
    }

    return 0;
  }

  /**
   * Validate stripe price ID matches tier
   */
  static validateStripePriceId(stripePriceId, tier) {
    const tierConfig = TierManager.getTierConfig(tier);
    if (!tierConfig) return false;
    return tierConfig.stripe_price_id === stripePriceId;
  }
}

module.exports = TierManager;
