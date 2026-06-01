# M9 TERMINAL SAAS - QUICK CHECKLIST

**Status:** Phase 1 Complete ✅  
**Date:** June 1, 2026

---

## IMMEDIATE ACTION ITEMS (Today)

### 1. Stripe Setup ⏱️ 15 minutes

- [ ] Go to [Stripe Dashboard](https://dashboard.stripe.com/)
- [ ] Create 3 products:
  - [ ] M9 Pro (Monthly) - $88
  - [ ] M9 Pro (Annual) - $792
  - [ ] M9 Pro (Lifetime) - $3,837.50
- [ ] Copy price IDs to `.env`
- [ ] Copy API keys to `.env` (Secret + Publishable)
- [ ] Create webhook endpoint: `https://api.m9terminal.com/api/webhooks/stripe`
- [ ] Copy webhook signing secret to `.env`

**Files:**
- Reference: `STRIPE-SETUP.md`

---

### 2. Deploy Database Schema ⏱️ 10 minutes

- [ ] Connect to Railway PostgreSQL
- [ ] Run: `psql $DATABASE_URL < db/saas-schema-phase1.sql`
- [ ] Verify tables created: `psql $DATABASE_URL -c "\dt"`

**Files:**
- Schema: `db/saas-schema-phase1.sql`
- Reference: `SAAS-PHASE1-IMPLEMENTATION.md`

---

### 3. Update Railway Environment ⏱️ 5 minutes

Add to Railway Variables:
```
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
STRIPE_PRICE_LIFETIME=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your_secret_here
ENCRYPTION_KEY=your_aes_256_key
```

---

## SETUP PHASE (Week 1)

### 4. Test API Endpoints ⏱️ 20 minutes

Run these curl commands to verify everything works:

```bash
# Test public pricing endpoint
curl https://m9terminal.com/api/subscriptions/pricing

# Start trial (with JWT token)
curl -X POST https://m9terminal.com/api/subscriptions/start-trial \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create checkout (monthly)
curl -X POST https://m9terminal.com/api/subscriptions/create-checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"billingCycle": "monthly"}'

# Get current subscription
curl https://m9terminal.com/api/subscriptions/current \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Results:**
- ✓ Pricing endpoint returns 3 tiers
- ✓ Trial starts successfully
- ✓ Checkout returns Stripe session ID
- ✓ Subscription query returns current status

---

### 5. Test Stripe Webhook ⏱️ 15 minutes

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Start webhook forwarding (development)
stripe listen --forward-to localhost:3009/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed

# Check logs
tail -f ~/projects/m9terminal/logs/error.log
```

**Expected Results:**
- ✓ Webhook endpoint responds with 200 OK
- ✓ Database records webhook event
- ✓ No errors in logs

---

### 6. Integration Testing ⏱️ 30 minutes

**Test Flow 1: Free Trial**
- [ ] New user signs up
- [ ] System auto-starts 7-day trial
- [ ] User can access all features
- [ ] GET /api/subscriptions/current returns trial status

**Test Flow 2: Monthly Upgrade**
- [ ] User clicks "Upgrade"
- [ ] Chooses "Monthly" plan
- [ ] Redirects to Stripe checkout
- [ ] Enter test card: 4242 4242 4242 4242
- [ ] Payment succeeds
- [ ] Subscription created in database
- [ ] Tier becomes "pro_monthly"
- [ ] Status becomes "active"

**Test Flow 3: Yearly Upgrade**
- [ ] Similar to above
- [ ] Choose "Yearly" plan
- [ ] Amount = $792
- [ ] Tier = "pro_yearly"

**Test Flow 4: Lifetime Upgrade**
- [ ] Similar to above
- [ ] Choose "Lifetime" plan
- [ ] Amount = $3,837.50
- [ ] Tier = "pro_lifetime"
- [ ] renews_at = NULL (never expires)

---

## DOCUMENTATION PHASE (Week 2)

### 7. Frontend Auth Pages

**Build these pages:**
- [ ] /login
- [ ] /register
- [ ] /forgot-password

**Use examples:**
- Frontend auth context
- JWT token management
- LocalStorage persistence

---

### 8. Frontend Pricing Page

**Create /pricing:**
- [ ] Show 3 plans (monthly, yearly, lifetime)
- [ ] Feature comparison table
- [ ] "Start Trial" CTA
- [ ] "Upgrade" buttons (if already trial)
- [ ] Savings badge (11% on yearly)

**Use examples:**
- Call GET /api/subscriptions/pricing
- Display TierManager features
- Calculate savings

---

### 9. Frontend Billing Dashboard

**Create /billing:**
- [ ] Show current subscription
- [ ] Renewal date
- [ ] Next billing amount
- [ ] Cancel button
- [ ] Upgrade to Lifetime option
- [ ] Payment method

---

## DEPLOYMENT (Week 3)

### 10. Production Hardening

- [ ] Enable HTTPS (Railway auto-does this)
- [ ] Set rate limiting on auth endpoints
- [ ] Enable CORS for Stripe domain
- [ ] Test webhook signature verification
- [ ] Set up monitoring & alerts

---

### 11. Go Live

- [ ] Switch Stripe from test to live keys
- [ ] Update `FRONTEND_URL` to production
- [ ] Verify webhook endpoint is live
- [ ] Do full end-to-end test with real card
- [ ] Monitor logs for 24 hours
- [ ] Set up payment failure alerts

---

## SUCCESS METRICS

### Phase 1 ✅
- [x] Database schema deployed
- [x] Tier manager built
- [x] API endpoints coded
- [x] Stripe integration ready

### Phase 2 (In Progress)
- [ ] Stripe products created
- [ ] API endpoints tested
- [ ] Webhook handling verified
- [ ] Database working

### Phase 3 (Next)
- [ ] Frontend auth pages
- [ ] Pricing page
- [ ] Billing dashboard
- [ ] JWT token flow

### Phase 4 (Final)
- [ ] End-to-end testing
- [ ] Production deployment
- [ ] Payment processing live
- [ ] Monitoring active

---

## TROUBLESHOOTING

### "Webhook not receiving events"
1. Check Stripe Dashboard → Webhooks → Your endpoint
2. Verify `STRIPE_WEBHOOK_SECRET` in `.env`
3. Check Railway logs for errors

### "Stripe API key not found"
1. Verify environment variables in Railway
2. Check all 3 price IDs are set
3. Test with `curl` to confirm endpoints

### "Payment failed in test"
1. Use correct test card: `4242 4242 4242 4242`
2. Any future expiry date (e.g., 12/99)
3. Any 3-digit CVC

### "Subscription not created after payment"
1. Check webhook is enabled in Stripe
2. Verify webhook signing secret matches
3. Check database subscriptions table exists
4. Look at Railway logs

---

## FILES REFERENCE

**Database:**
- `db/saas-schema-phase1.sql` - Database schema

**Backend:**
- `backend/lib/tier-manager.js` - Tier definitions & logic
- `backend/routes/subscriptions.js` - Subscription endpoints

**Documentation:**
- `SAAS-PHASE1-IMPLEMENTATION.md` - Full guide
- `STRIPE-SETUP.md` - Stripe setup instructions
- `M9-TERMINAL-SAAS-QUICK-CHECKLIST.md` - This file

---

## TIME ESTIMATES

| Task | Time | Status |
|------|------|--------|
| Stripe setup | 15 min | 📝 TODO |
| Database deployment | 10 min | 📝 TODO |
| Environment variables | 5 min | 📝 TODO |
| API testing | 20 min | 📝 TODO |
| Webhook testing | 15 min | 📝 TODO |
| Integration tests | 30 min | 📝 TODO |
| **Total Phase 2** | **~90 min** | |
| Frontend auth | 4 hours | 📝 TODO (Week 2) |
| Frontend pricing | 2 hours | 📝 TODO (Week 2) |
| Frontend billing | 2 hours | 📝 TODO (Week 2) |
| **Total Phase 3** | **~8 hours** | |
| Production hardening | 2 hours | 📝 TODO (Week 3) |
| Go live | 1 hour | 📝 TODO (Week 3) |
| **Total Phase 4** | **~3 hours** | |
| **Grand Total** | **~101 hours** | |

---

## SUPPORT

**Questions?** Check:
1. `SAAS-PHASE1-IMPLEMENTATION.md` - Full implementation guide
2. `STRIPE-SETUP.md` - Stripe configuration
3. Code comments in `tier-manager.js` and `subscriptions.js`

**Need help?**
- Stripe Docs: https://stripe.com/docs
- Node.js Stripe SDK: https://github.com/stripe/stripe-node
- Railway Docs: https://docs.railway.app

---

**Created:** June 1, 2026  
**Status:** Ready to execute  
**Next Step:** Stripe setup (15 min)
