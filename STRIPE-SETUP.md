# M9 TERMINAL - STRIPE SETUP GUIDE

**Date:** June 1, 2026  
**Purpose:** Configure Stripe products, prices, and webhooks

---

## Step 1: Create Stripe Products

### Product 1: M9 Pro Monthly

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Products** > **Create Product**
3. Fill in:
   - **Name:** M9 Pro
   - **Description:** Full access to M9 Terminal sports betting platform
   - **Type:** Recurring (monthly)
   - **Price:** $88.00 USD
   - **Billing Period:** Monthly

4. Save and note the **Price ID** (e.g., `price_1O9xQ...`)
5. Add to `.env`:
   ```
   STRIPE_PRICE_MONTHLY=price_1O9xQ...
   ```

### Product 2: M9 Pro Yearly

1. **Create Product**
2. Fill in:
   - **Name:** M9 Pro (Annual)
   - **Description:** Full access + 11% discount (save $264)
   - **Type:** Recurring (annual)
   - **Price:** $792.00 USD
   - **Billing Period:** Yearly

3. Note the **Price ID**
4. Add to `.env`:
   ```
   STRIPE_PRICE_YEARLY=price_2O9xQ...
   ```

### Product 3: M9 Pro Lifetime

1. **Create Product**
2. Fill in:
   - **Name:** M9 Pro (Lifetime)
   - **Description:** One-time payment for lifetime access
   - **Type:** One-time purchase
   - **Price:** $3,837.50 USD

3. Note the **Price ID**
4. Add to `.env`:
   ```
   STRIPE_PRICE_LIFETIME=price_3O9xQ...
   ```

---

## Step 2: Collect Stripe API Keys

1. In Stripe Dashboard, click your account icon → **API Keys**
2. Copy **Publishable Key** (starts with `pk_live_`):
   ```
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

3. Copy **Secret Key** (starts with `sk_live_`):
   ```
   STRIPE_SECRET_KEY=sk_live_...
   ```

4. **Keep secret key private!** Never commit to git.

---

## Step 3: Create Webhook Endpoint

1. In Stripe Dashboard, go to **Webhooks** (under Developers)
2. Click **Add endpoint**
3. Fill in:
   - **Endpoint URL:** `https://api.m9terminal.com/api/webhooks/stripe`
   - **Events:** Select:
     - `checkout.session.completed`
     - `invoice.paid`
     - `invoice.payment_failed`
     - `customer.subscription.deleted`

4. Copy **Signing Secret** (starts with `whsec_`):
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. Add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## Step 4: Test in Development (Stripe CLI)

Install [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
wget -q https://files.stripe.com/stripe-cli/releases/latest/linux/x86_64/stripe_linux_x86_64.tar.gz
tar -xvf stripe_linux_x86_64.tar.gz
```

### Start webhook forwarding

```bash
stripe listen --forward-to localhost:3009/api/webhooks/stripe
```

This gives you a webhook signing secret for testing.

### Trigger test events

```bash
# Test checkout completed
stripe trigger checkout.session.completed

# Test payment succeeded
stripe trigger invoice.paid

# Test payment failed
stripe trigger invoice.payment_failed
```

---

## Step 5: Update .env on Railway

Add to Railway environment variables:

```bash
# Stripe API Keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Products (Price IDs)
STRIPE_PRICE_MONTHLY=price_1O9xQ...
STRIPE_PRICE_YEARLY=price_2O9xQ...
STRIPE_PRICE_LIFETIME=price_3O9xQ...
```

**In Railway Dashboard:**
1. Go to your M9 Terminal service
2. Click **Variables**
3. Add each variable
4. Redeploy

---

## Step 6: Verify Endpoints

### Test checkout creation

```bash
curl -X POST https://api.m9terminal.com/api/subscriptions/create-checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"billingCycle": "monthly"}'

# Expected response:
# {
#   "sessionId": "cs_live_...",
#   "tier": "M9 Pro",
#   "amount": 88,
#   "billingCycle": "monthly"
# }
```

### Test pricing endpoint (public)

```bash
curl https://api.m9terminal.com/api/subscriptions/pricing

# Expected response:
# {
#   "monthly": {...},
#   "yearly": {...},
#   "lifetime": {...}
# }
```

---

## Step 7: Test Payment Flow

### 1. Start trial
```bash
curl -X POST https://api.m9terminal.com/api/subscriptions/start-trial \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Create checkout
```bash
curl -X POST https://api.m9terminal.com/api/subscriptions/create-checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"billingCycle": "monthly"}'
```

### 3. Simulate Stripe payment with test card

Use Stripe's test cards:
- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

Expiry: Any future date
CVC: Any 3 digits

### 4. Verify subscription created

```bash
curl https://api.m9terminal.com/api/subscriptions/current \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected response:
# {
#   "subscription": {
#     "id": 1,
#     "org_id": 1,
#     "tier": "pro_monthly",
#     "status": "active",
#     ...
#   },
#   "status": "active",
#   "message": "M9 Pro - Active"
# }
```

---

## Stripe Test Cards

| Use Case | Card Number | Exp | CVC |
|----------|-------------|-----|-----|
| Success | 4242 4242 4242 4242 | 12/99 | 123 |
| Declined | 4000 0000 0000 0002 | 12/99 | 123 |
| Insufficient funds | 4000 0000 0000 9995 | 12/99 | 123 |
| Visa 3D Secure | 4000 0025 0000 3155 | 12/99 | 123 |

---

## Webhook Payload Examples

### checkout.session.completed

```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_live_...",
      "customer": "cus_...",
      "amount_total": 8800,
      "metadata": {
        "orgId": "1",
        "tier": "pro_monthly",
        "billingCycle": "monthly"
      }
    }
  }
}
```

### invoice.paid

```json
{
  "type": "invoice.paid",
  "data": {
    "object": {
      "id": "in_...",
      "customer": "cus_...",
      "amount_paid": 8800
    }
  }
}
```

### customer.subscription.deleted

```json
{
  "type": "customer.subscription.deleted",
  "data": {
    "object": {
      "id": "sub_...",
      "customer": "cus_..."
    }
  }
}
```

---

## Troubleshooting

### Webhook not receiving events

1. Check Stripe Dashboard → Webhooks → Your endpoint
2. Look at **Logs** tab to see webhook attempts
3. Ensure `STRIPE_WEBHOOK_SECRET` matches in `.env`
4. Check Railway logs for errors

### Webhook signature verification fails

```
Error: No matching version found for...
```

**Fix:** Ensure `req.body` is raw (not parsed):

```javascript
// Express middleware order matters!
app.use(express.raw({type: 'application/json'}), handleWebhook); // Correct
app.use(express.json()); // AFTER raw, not before
```

### Checkout session not creating

1. Verify `STRIPE_PRICE_MONTHLY` etc. exist in Stripe
2. Check JWT token is valid
3. Ensure org_id is set in request context
4. Look at Railway logs for errors

### Payment succeeded but subscription not created

1. Check webhook is enabled in Stripe
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Check database has subscriptions table
4. Check Railway logs for webhook errors

---

## Going Live (Switching from Test to Live)

### 1. Switch to Live Keys
- Stripe Dashboard → API Keys
- Use **Live Key** (starts with `pk_live_`, `sk_live_`)
- Update in Railway environment

### 2. Update URLs
- Set `FRONTEND_URL=https://m9terminal.com`
- Ensure webhook URL is live: `https://api.m9terminal.com/api/webhooks/stripe`

### 3. Test with real card
- Use actual credit card (will charge $0 if using free tier test)
- Or wait for first real customer

### 4. Monitor
- Stripe Dashboard → Payments
- Railroad → Logs
- Check webhook logs for errors

---

## Stripe Dashboard Monitoring

### Daily Tasks
- Check **Payments** → Recent transactions
- Review **Customers** for new signups
- Check **Webhooks** → Recent attempts for errors

### Weekly Tasks
- Review **Revenue** → Total MRR
- Check **Disputes** (chargeback prevention)
- Monitor **Churn** (active subscriptions trend)

### Monthly Tasks
- Analyze **Customer Insights** → LTV, churn rate
- Review **Billing Issues** → Failed payments
- Plan pricing adjustments

---

## Helpful Links

- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Stripe Docs: Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Docs: Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Docs: Test Cards](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

**Created:** June 1, 2026  
**Status:** Ready for implementation
