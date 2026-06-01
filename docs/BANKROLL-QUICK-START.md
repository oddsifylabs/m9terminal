# Bankroll Management — Quick Start Guide

## 🚀 Launch & Navigation

### Access the Bankroll Page
1. Click **"BANKROLL"** in the bottom navigation bar
2. Page loads with **Overview** tab active by default
3. Real-time clock updates in footer

---

## 📊 Primary Metrics (Top Section)

### What You See
Four large cards showing your bankroll status:

```
┌─ Total Bankroll ───┐  ┌─ Available Balance ─┐
│   $50,000          │  │   $42,350 (84.7%)   │
└────────────────────┘  └─────────────────────┘

┌─ Currently at Risk ─┐  ┌─ Lifetime ROI ──────┐
│   $7,650 (15.3%)    │  │   +12.4% (156 sess) │
└────────────────────┘  └─────────────────────┘
```

### Card Colors
- **Blue (Bankroll):** Your total capital
- **Green (Available):** Free capital to allocate
- **Amber (At Risk):** Currently exposed
- **Green (ROI):** Overall performance

---

## 🗂️ Tab Guide

### Tab 1: OVERVIEW (Default)
**Purpose:** Monitor active sessions in real-time

**What to do:**
1. See all active sessions listed
2. Click any row to expand details
3. View allocation, wins/losses, profit, ROI
4. Click "+ New Session" to start tracking

**Key Info:**
- 🟢 **Active** sessions (running now)
- 🔵 **Closed** sessions (completed)
- Confidence % (signal quality)
- Session-specific notes

**Example:**
```
S_001 — MLB
$2,500 allocated
8 wins / 4 losses → 66.7% WR
+$420 profit (+16.8% ROI)
Confidence: 85%
```

---

### Tab 2: ALLOCATION
**Purpose:** Decide how much to risk per session

**3 Methods Explained:**

#### 1️⃣ Kelly Criterion (Mathematical)
- Best for: Optimized long-term growth
- Formula: (Win Rate × CLV - Loss Rate) / CLV
- Current: 5.2%
- Conservative: 2.5% (recommended)
- ✅ Pros: Proven formula, optimal growth
- ❌ Cons: Can be aggressive

**When to use:** When you have accurate metrics

#### 2️⃣ Flat Betting (Simple)
- Best for: Consistency and simplicity
- Formula: Fixed 3% per session
- ✅ Pros: Easy to track, predictable
- ❌ Cons: Doesn't adapt to edge

**When to use:** Starting out or conservative approach

#### 3️⃣ Custom (Flexible)
- Best for: Full control based on confidence
- Formula: You decide
- ✅ Pros: Maximum control, flexible
- ❌ Cons: Requires discipline

**When to use:** When you know your edge varies

**Risk Limits to Know:**
| Limit | Amount |
|-------|--------|
| Min Bet | $50 |
| Max Bet | $5,000 |
| Recommended Bet | $500 |
| Daily Max | $15,000 |
| Weekly Max | $75,000 |

**How to Set Your Allocation:**
1. Click the strategy you want (radio button)
2. Read the formula
3. Review recommended allocation
4. Apply it to your next session

---

### Tab 3: HISTORY
**Purpose:** See long-term bankroll growth

**Charts & Tables:**

**Bankroll Growth Chart (SVG)**
- Shows balance over 6 months
- Jan: $44,500 → Jun: $50,000
- Visualizes your upward trajectory
- Each dot = monthly checkpoint

**Monthly Summary Table:**
```
Date      Balance    Change    Sessions   ROI
Jan 1     $44,500    —         0          0%
Feb 15    $46,200    +$1,700   28         3.8%
Mar 1     $48,100    +$1,900   52         8.1%
Apr 15    $49,800    +$1,700   98         11.9%
May 20    $50,000    +$200     134        12.4%
Jun 1     $50,000    —         156        12.4%
```

**Growth Stats:**
- Starting: $44,500
- Current: $50,000
- Profit: +$5,500
- Profit Factor: 2.15x (wins/losses)

**Key Insight:** Shows you're winning — use this for motivation!

---

### Tab 4: PERFORMANCE
**Purpose:** Analyze what's working by sport

**Performance Table:**

```
Sport    Bets   W/L      WR     Units ROI    CLV
─────────────────────────────────────────────────
MLB      45     27/18    60.0%  +8.3  +18.5% 2.4
NBA      38     22/16    57.9%  +4.7  +12.3% 1.8
NFL      32     18/14    56.3%  +2.9  +8.9%  1.2
NHL      28     16/12    57.1%  +1.8  +6.4%  0.9
Soccer   13     7/6      53.8%  +0.5  +2.1%  0.3
```

**What to Look For:**
1. **Best Sport:** MLB (18.5% ROI) — consider more allocation
2. **Worst Sport:** Soccer (2.1% ROI) — reduce or pause
3. **Confidence:** CLV > 2.0 = excellent, < 1.0 = be careful
4. **Win Rate:** Look for sports above 55%

**How to Use:**
- ✅ Increase allocation to high-ROI sports
- ✅ Reduce allocation to low-ROI sports
- ✅ Maintain only sports with positive ROI
- ❌ Don't abandon sports in slumps yet — get more data

---

### Tab 5: ANALYTICS
**Purpose:** Advanced metrics and AI recommendations

**Risk Metrics (6 Cards):**

| Metric | Value | What It Means |
|--------|-------|---------------|
| **Sharpe Ratio** | 1.87 | Risk-adjusted return (>1.0 is good) |
| **Profit Factor** | 2.15x | Wins ÷ Losses (>1.5 is solid) |
| **Win Rate** | 57.4% | % of winning bets (>52% beats -110) |
| **Max Drawdown** | -8.5% | Worst decline ever (lower is better) |
| **Current Drawdown** | -2.1% | Current decline from peak |
| **Avg CLV** | 1.65 | Edge quality (higher is better) |

**Alerts & Warnings:**
- ⚠️ Yellow flags (act on caution)
- ℹ️ Blue info (FYI)
- 🚨 Red danger (address immediately)

Example:
```
⚠️ "NBA session confidence at 72%"
   → Action: Review signal quality before adding

ℹ️ "Daily risk limit 30% utilized ($4,500/$15,000)"
   → Action: Can still add $10,500 today
```

**AI Recommendations:**
1. **Optimize Allocation** - Increase MLB to 6%
2. **Monitor Variance** - Volatility high, reduce units
3. **Current Session Review** - NBA at 72% confidence

---

## 🎯 How to Use Bankroll Page

### Daily Workflow

**Morning (Pre-Games):**
1. Open **OVERVIEW** tab
2. Check available balance
3. Review active sessions
4. Plan daily allocation

**During Games:**
1. See live session updates
2. Track wins/losses in real-time
3. Monitor confidence levels

**After Games:**
1. Session auto-closes when complete
2. Review profit/loss
3. Check ROI calculations
4. Note any insights

**Weekly:**
1. Check **HISTORY** tab for growth
2. Review **PERFORMANCE** by sport
3. Adjust allocations if needed

**Monthly:**
1. Review **ANALYTICS** metrics
2. Check for trends
3. Recalibrate strategies
4. Plan next month's focus

---

## 💡 Pro Tips

### Allocation Tips
1. **Start Conservative:** Use 2-3% per session
2. **Build Confidence:** Increase only after 30+ sessions
3. **Diversify:** Spread across sports, not all MLB
4. **Reserve Capital:** Keep 15-20% unallocated

### Risk Management
- Never exceed daily max ($15,000)
- Watch for drawdowns > -5%
- Paused sessions when confidence drops
- Review CLV — avoid negative expected value

### Performance Optimization
- Focus on high-ROI sports (>15%)
- Increase allocation to 6-8% for 60%+ WR sports
- Monitor Sharpe ratio (target: >1.5)
- Maintain profit factor > 2.0x

### Decision Making
- **Positive ROI → Increase allocation**
- **Negative ROI → Pause & analyze**
- **High CLV → More sessions**
- **Low confidence → Reduce units**

---

## 📱 Mobile Tips

**On Smartphone:**
- Tables scroll horizontally
- Swipe to navigate tabs
- Tap to expand sessions
- Full-width cards

**Best Practice:** View on tablet/desktop for tables

---

## 🔄 Real-Time Features

✅ **Live Updates:**
- Clock updates every second (bottom right)
- Session status changes instantly
- Profit/loss calculations real-time
- No page refresh needed

---

## 🎓 Understanding Key Terms

| Term | Meaning | Formula |
|------|---------|---------|
| **Bankroll** | Total betting capital | Starting balance |
| **Allocation** | Risk per session | Bankroll × % |
| **ROI** | Return on investment | Profit ÷ Allocation × 100 |
| **Win Rate** | % of winning bets | Wins ÷ Total Bets × 100 |
| **CLV** | Closing line value | Your odds vs. closing odds |
| **Profit Factor** | Wins vs. losses | Total Wins ÷ Total Losses |
| **Sharpe Ratio** | Risk-adjusted return | Return ÷ Risk std. dev. |
| **Max Drawdown** | Worst peak-to-trough | Lowest point ÷ Peak × 100 |

---

## ⚠️ Common Mistakes to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| Risk > 5% per bet | Risk 1-3% per bet |
| Chase losses with bigger bets | Stick to allocation plan |
| Allocate equally to all sports | Allocate by ROI/confidence |
| Ignore CLV metric | Only bet positive CLV |
| Panic on drawdowns | Review after 30+ sessions |
| Skip allocation strategy | Have written plan |
| Overlook profit factor | Maintain >1.5x ratio |

---

## 🔧 Troubleshooting

**Q: Metrics not updating?**
A: Refresh page (F5) or check connection

**Q: Can't expand session?**
A: Click on session row again (toggle)

**Q: Charts not showing?**
A: Check browser compatibility (Chrome 90+)

**Q: Wrong calculations?**
A: Verify input data in Overview

---

## 📞 Need Help?

1. **Review this guide** — covers 99% of questions
2. **Check data accuracy** — ensure sessions logged correctly
3. **Contact support** — if something is broken

---

## 🎬 Next Steps

### Start Using Bankroll Page
1. ✅ Understand primary metrics (5 min)
2. ✅ Choose allocation strategy (3 min)
3. ✅ Create first session (2 min)
4. ✅ Check daily (2 min)

### Level Up
1. Track 10+ sessions
2. Analyze performance by sport
3. Adjust allocations based on ROI
4. Review analytics weekly
5. Optimize for Sharpe ratio

---

**Version:** 1.0  
**Last Updated:** June 1, 2026  
**Questions?** Check the detailed documentation: BANKROLL-PAGE-DETAILED.md
