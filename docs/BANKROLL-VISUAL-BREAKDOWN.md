# 🏦 Bankroll Page — Visual Component Breakdown

## Page Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HEADER SECTION                          │
│          "Bankroll Management" + Subtitle                   │
│          Gradient bg: Terminal Navy → Market Black          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  PRIMARY METRICS (4 Cards)                  │
├──────────────────┬──────────────────┬──────────────────────┤
│ Total Bankroll   │ Available Balance │ Currently at Risk    │
│    $50,000       │    $42,350 (84%) │    $7,650 (15%)      │
│   Data Blue      │  Signal Green    │      Amber           │
├──────────────────┴──────────────────┴──────────────────────┤
│ Lifetime ROI                                                │
│    +12.4% (156 sessions)                                    │
│  Dynamic Color (Green for positive)                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           TAB NAVIGATION (5 Tabs with underline)            │
│  Overview | Allocation | History | Performance | Analytics  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ACTIVE TAB CONTENT                        │
│                                                             │
│  [Content changes based on selected tab]                    │
│  [Smooth transitions between tabs]                          │
│  [Scrollable area for long content]                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      FOOTER                                 │
│  Last updated: [TIME]    Export | Settings | Help           │
└─────────────────────────────────────────────────────────────┘
```

---

## Tab 1: OVERVIEW — Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Active Sessions                          [+ New Session]    │
│ 2 sessions currently running                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ Session S_001 (MLB) ──────────────────────────────────┐ │
│ │ 🟢 ACTIVE                                              │ │
│ │                                                        │ │
│ │ Sport: MLB          Time: 7:00 PM ET                 │ │
│ │                                                        │ │
│ │ ┌─ Quick Stats ──────────────────────────────────────┐ │
│ │ │ Allocation: $2,500  |  Bets: 12 (8/4)             │ │
│ │ │ Profit: +$420       |  ROI: +16.8%                │ │
│ │ │ Confidence: 85%     |  Notes: Strong signals...   │ │
│ │ └────────────────────────────────────────────────────┘ │
│ │                                                        │ │
│ │ [Click to expand ▼]                                  │ │
│ │                                                        │ │
│ │ ┌─ Expanded Details (if clicked) ────────────────────┐ │
│ │ │ Win Rate: 66.7%  |  Avg Bet: $208                 │ │
│ │ │ Duration: Ongoing  |  Notes: Strong signals...    │ │
│ │ └────────────────────────────────────────────────────┘ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─ Session S_002 (NBA) ──────────────────────────────────┐ │
│ │ 🟢 ACTIVE                                              │ │
│ │ [Similar layout to S_001]                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Recent Closed Sessions                                      │
│ Last 5 completed sessions                                   │
├─────────────────────────────────────────────────────────────┤
│ S_003 (NFL)    Jun 1    +$210    55% WR                     │
│ S_004 (NHL)    May 31   -$150    42% WR                     │
│ S_005 (Soccer) May 30   +$75     60% WR                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tab 2: ALLOCATION — Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Allocation Strategy (Select One)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ◉ Kelly Criterion                                          │
│   Formula: (Win Rate × CLV - Loss Rate) / CLV              │
│   Current: 5.2%  |  Recommended: 2.5%                     │
│   [Read more details...]                                   │
│                                                             │
│ ○ Flat Betting                                             │
│   Formula: Fixed 3% per session                            │
│   Current: 3.0%  |  Recommended: 2-3%                     │
│   [Read more details...]                                   │
│                                                             │
│ ○ Custom Allocation                                        │
│   Formula: Manual assignment                               │
│   Current: Varies  |  Recommended: Based on confidence     │
│   [Read more details...]                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Risk Limits (6 Boxes in 2x3 Grid)                           │
├─────────────────────────────────────────────────────────────┤
│ Min Bet          Max Bet          Recommended              │
│   $50            $5,000              $500                  │
│                                                             │
│ Per Session Min  Per Session Max  Per Session Rec          │
│   $500           $10,000             $2,500                │
│                                                             │
│ Daily Max        Weekly Max                                │
│  $15,000         $75,000                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Current Allocations (Table)                                 │
├──────────┬────────┬──────────┬──────────┬────────┬─────────┤
│ Session  │ Sport  │ Amount   │ % Bank   │ Status │Progress │
├──────────┼────────┼──────────┼──────────┼────────┼─────────┤
│ S_001    │ MLB    │ $2,500   │ 5.0%     │ ACTIVE │ ████▓▓▓ │
│ S_002    │ NBA    │ $1,800   │ 3.6%     │ ACTIVE │ ███▓▓▓▓ │
│ S_003    │ NFL    │ $1,200   │ 2.4%     │ ACTIVE │ ██▓▓▓▓▓ │
│ S_004    │ NHL    │ $900     │ 1.8%     │ PAUSED │ █▓▓▓▓▓▓ │
│ S_005    │ Soccer │ $250     │ 0.5%     │ CLOSED │ ▓▓▓▓▓▓▓ │
└──────────┴────────┴──────────┴──────────┴────────┴─────────┘
```

---

## Tab 3: HISTORY — Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Bankroll Growth Chart (SVG Line Chart)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   $52K                                                      │
│       .                                                     │
│       │     ┌─────────────────                             │
│       │    /                      ╱╲                       │
│       │   /                      ╱  ╲                      │
│       │  /                      ╱    ╲                     │
│       │ /                      ╱      ╲                    │
│       │/                      ╱        ╲                   │
│       └────────────────────────────────────                 │
│   $44K                                                      │
│       Jan                   Mar    May    Jun               │
│                                                             │
│  Green line shows consistent growth from $44,500 to $50k   │
│  Data points marked at each monthly checkpoint             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Growth Statistics (4 Cards in Row)                          │
├──────────────────┬──────────────────┬──────────────┬────────┤
│ Starting Balance │ Current Balance  │ Total Profit │ Ratio  │
│   $44,500        │   $50,000        │ +$5,500      │ 2.15x  │
│                  │ Signal Green     │ Signal Green │        │
└──────────────────┴──────────────────┴──────────────┴────────┘

┌─────────────────────────────────────────────────────────────┐
│ Monthly Summary Table                                       │
├──────────┬──────────┬─────────┬──────────┬──────────┐       │
│ Date     │ Balance  │ Change  │ Sessions │ ROI      │       │
├──────────┼──────────┼─────────┼──────────┼──────────┤       │
│ Jan 1    │ $44,500  │ —       │ 0        │ 0%       │       │
│ Feb 15   │ $46,200  │ +$1,700 │ 28       │ 3.8%     │       │
│ Mar 1    │ $48,100  │ +$1,900 │ 52       │ 8.1%     │       │
│ Apr 15   │ $49,800  │ +$1,700 │ 98       │ 11.9%    │       │
│ May 20   │ $50,000  │ +$200   │ 134      │ 12.4%    │       │
│ Jun 1    │ $50,000  │ —       │ 156      │ 12.4%    │       │
└──────────┴──────────┴─────────┴──────────┴──────────┘
```

---

## Tab 4: PERFORMANCE — Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Performance by Sport (Scrollable Table)                     │
├──────┬──────┬───────┬────────┬────────┬────────┬───────┐   │
│Sport │Bets  │ W/L   │ WR%    │ Units  │ ROI%   │ CLV   │   │
├──────┼──────┼───────┼────────┼────────┼────────┼───────┤   │
│MLB   │ 45   │27/18  │ 60.0%  │ +8.3   │+18.5%✓ │ 2.4   │   │
│      │      │ 🟢/🔴 │ ↑↑     │ GREEN  │ GREEN  │ HIGH  │   │
├──────┼──────┼───────┼────────┼────────┼────────┼───────┤   │
│NBA   │ 38   │22/16  │ 57.9%  │ +4.7   │+12.3%✓ │ 1.8   │   │
│      │      │ 🟢/🔴 │ ↑      │ GREEN  │ GREEN  │ MED   │   │
├──────┼──────┼───────┼────────┼────────┼────────┼───────┤   │
│NFL   │ 32   │18/14  │ 56.3%  │ +2.9   │ +8.9%✓ │ 1.2   │   │
│      │      │ 🟢/🔴 │ →      │ GREEN  │ BLUE   │ LOW   │   │
├──────┼──────┼───────┼────────┼────────┼────────┼───────┤   │
│NHL   │ 28   │16/12  │ 57.1%  │ +1.8   │ +6.4%✓ │ 0.9   │   │
│      │      │ 🟢/🔴 │ →      │ YELLOW │ BLUE   │ LOW   │   │
├──────┼──────┼───────┼────────┼────────┼────────┼───────┤   │
│Soccer│ 13   │ 7/6   │ 53.8%  │ +0.5   │ +2.1%✓ │ 0.3   │   │
│      │      │ 🟢/🔴 │ ↓      │ YELLOW │ BLUE   │ WEAK  │   │
└──────┴──────┴───────┴────────┴────────┴────────┴───────┘

Color Legend:
✓ = Positive ROI (include)
→ = Neutral (maintain)
↓ = Declining (monitor)
🟢 = Wins (green text)
🔴 = Losses (red text)
GREEN = High value (18%+)
BLUE = Medium value (5-15%)
YELLOW = Low value (1-5%)
```

---

## Tab 5: ANALYTICS — Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Risk Metrics (6 Cards in 3x2 Grid)                          │
├─────────────────┬─────────────────┬─────────────────┐       │
│ Sharpe Ratio    │ Profit Factor   │ Win Rate        │       │
│    1.87         │    2.15x        │    57.4%        │       │
│ Risk-adjusted   │ Wins/Losses     │ % Winning       │       │
│ return (good)   │ ratio (solid)   │ bets (good)     │       │
├─────────────────┼─────────────────┼─────────────────┤       │
│ Max Drawdown    │ Current Drawdown│ Average CLV     │       │
│    -8.5%        │    -2.1%        │    1.65         │       │
│ Worst decline   │ From peak       │ Edge quality    │       │
│ (resilient)     │ (recovering)    │ (excellent)     │       │
└─────────────────┴─────────────────┴─────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Warnings & Alerts                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ⚠️  CAUTION: "NBA session confidence slightly low (72%)"    │
│    Action: Review signal quality before adding units       │
│                                                             │
│ ℹ️  INFO: "Daily risk limit 30% utilized ($4,500/$15,000)"  │
│    Action: Can still add $10,500 today                     │
│                                                             │
│ [No danger alerts at this time]                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ AI Recommendations (3 Cards)                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🎯 Optimize Allocation                                      │
│    MLB shows 18.5% ROI.                                     │
│    Consider increasing allocation to 6% instead of 5%.     │
│                                                             │
│ 📊 Monitor Variance                                         │
│    Volatility at 3.2%.                                      │
│    Consider reducing unit size during high-variance sports.│
│                                                             │
│ ⚡ Current Session Review                                   │
│    NBA session confidence at 72%.                           │
│    Review signal quality before adding units.              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop (1920px+)
```
┌─────────────────────────────────────┐
│  4-Column Grid                      │
│  ┌──┬──┬──┬──┐                     │
│  │  │  │  │  │                     │
│  └──┴──┴──┴──┘                     │
│                                    │
│  Full-width tables visible         │
│  All columns at once               │
│  Side-by-side charts               │
└─────────────────────────────────────┘
```

### Tablet (768px-1919px)
```
┌─────────────────────────────────────┐
│  2-Column Grid                      │
│  ┌──────┬──────┐                   │
│  │      │      │                   │
│  └──────┴──────┘                   │
│                                    │
│  Tables with horizontal scroll     │
│  2x2 metric grids                  │
│  Stacked charts                    │
└─────────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────────────────────┐
│  1-Column Stack                     │
│  ┌─────────────┐                   │
│  │             │                   │
│  ├─────────────┤                   │
│  │             │                   │
│  ├─────────────┤                   │
│  │             │                   │
│  └─────────────┘                   │
│                                    │
│  Full-width cards                  │
│  Vertical scroll                   │
│  Touch-friendly buttons (44px)     │
└─────────────────────────────────────┘
```

---

## Interactive Elements

### Expandable Rows
```
COLLAPSED:
┌─────────────────────────────────┐
│ Session S_001    Status: ACTIVE │ ◀ Click to expand
└─────────────────────────────────┘

EXPANDED:
┌─────────────────────────────────┐
│ Session S_001    Status: ACTIVE │ ◀ Click to collapse
│                                 │
│ Allocation: $2,500              │
│ Bets: 8/12    Profit: +$420     │
│ ROI: 16.8%    Confidence: 85%   │
│                                 │
│ Win Rate: 66.7%                 │
│ Avg Bet: $208                   │
│ Notes: Strong signals...         │
└─────────────────────────────────┘
```

### Hover Effects
```
Before Hover:
┌─────────────────────────────────┐
│ Card Content                    │
│ Border: white/10 opacity        │
└─────────────────────────────────┘

On Hover:
┌─────────────────────────────────┐
│ Card Content                    │
│ Border: [Color]/50 opacity ✨   │
│ Background: white/5 opacity     │
└─────────────────────────────────┘
```

### Tab Navigation
```
Active Tab:
[Overview] [Allocation] ← Green underline & text
[History] [Performance] [Analytics]

Inactive Tab (hover):
[Overview] [Allocation] [History] ← Gray text, lighter
```

---

## Color Application Examples

### Positive Metrics
```
ROI: +18.5%
✓ Text Color: #00D27A (Signal Green)
✓ Icon: ↑ or 🟢

Profit: +$5,500
✓ Text Color: #10B981 (Emerald)
✓ Background: [Color]/10

Win Rate: 60%
✓ Text Color: #00D27A (Signal Green)
```

### Negative Metrics
```
Losses: -$1,500
✗ Text Color: #EF4444 (Red)
✗ Icon: ↓ or 🔴

Max Drawdown: -8.5%
✗ Text Color: #EF4444 (Red)

Session Status: CLOSED
✗ Background: [Color]/20
✗ Border: [Color] left edge
```

### Neutral/Info
```
Available Balance: $42,350
ℹ Text Color: #2B7FFF (Data Blue)

Session Notes: 
ℹ Background: #1a2332
ℹ Border: white/5 opacity

Data Labels:
ℹ Text Color: #94A3B8 (Slate-400)
```

---

**This visual breakdown shows exactly how each section is laid out, styled, and responds to user interaction.**
