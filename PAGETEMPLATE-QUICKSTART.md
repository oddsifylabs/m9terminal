# M9 TERMINAL — PAGETEMPLATE QUICK START

**File:** `frontend/src/components/PageTemplate.jsx`  
**Status:** ✅ Ready to use  
**Date:** June 1, 2026

---

## ⚡ QUICK START

### Minimal Page
```jsx
import PageTemplate from '../components/PageTemplate';

export default function MyPage() {
  return (
    <PageTemplate
      title="My Page"
      icon="🎯"
      subtitle="Page description"
    >
      <div>Your content here</div>
    </PageTemplate>
  );
}
```

### Page with Tabs
```jsx
import { useState } from 'react';
import PageTemplate from '../components/PageTemplate';

export default function Markets() {
  const [tab, setTab] = useState('signals');

  return (
    <PageTemplate
      title="Markets"
      icon="⚾"
      subtitle="MLB Live Data"
      tabs={[
        { id: 'signals', label: 'Signals' },
        { id: 'props', label: 'Props' }
      ]}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === 'signals' && <SignalsList />}
      {tab === 'props' && <PropsList />}
    </PageTemplate>
  );
}
```

---

## 📋 PROPS REFERENCE

| Prop | Required | Type | Example |
|------|----------|------|---------|
| `title` | ✅ | string | `"Markets"` |
| `icon` | ✅ | string | `"⚾"` |
| `subtitle` | ❌ | string | `"MLB Live Data"` |
| `tabs` | ❌ | array | `[{id: 'a', label: 'A'}]` |
| `activeTab` | ❌ | string | `"signals"` |
| `onTabChange` | ❌ | function | `(id) => setTab(id)` |
| `children` | ✅ | element | `<YourContent />` |
| `showMLBBanner` | ❌ | boolean | `true` (default) |

---

## 🎯 EXAMPLES

### Example 1: Dashboard
```jsx
<PageTemplate title="Dashboard" icon="📊" subtitle="Overview">
  <StatCards />
  <ActiveBets />
  <ChatBox />
</PageTemplate>
```

### Example 2: Markets with Tabs
```jsx
<PageTemplate
  title="Markets"
  icon="⚾"
  subtitle="MLB Live Data"
  tabs={[
    { id: 'signals', label: 'Signals' },
    { id: 'props', label: 'Props' },
    { id: 'games', label: 'Games' }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  {activeTab === 'signals' && <Signals />}
  {activeTab === 'props' && <Props />}
  {activeTab === 'games' && <Games />}
</PageTemplate>
```

### Example 3: Settings (No Banner)
```jsx
<PageTemplate
  title="Settings"
  icon="⚙️"
  subtitle="Preferences"
  showMLBBanner={false}
>
  <SettingsForm />
</PageTemplate>
```

---

## 🏗️ STRUCTURE

```
PageTemplate
├── Global Header
│   └── M9 Terminal | ⚾ Tagline
├── Page Title
│   ├── Icon
│   ├── Title
│   └── Subtitle
├── Tabs (optional)
│   └── [Tab 1] [Tab 2] [Tab 3]...
├── MLB Banner (optional)
│   └── ⚾ MLB Model Only
├── Content
│   └── {children}
└── (Bottom Navigation handled by App)
```

---

## 🎨 COLORS

- **Primary:** Green (#16a34a)
- **Background:** White (#ffffff)
- **Text Dark:** #111827
- **Text Light:** #6b7280
- **Borders:** #e5e7eb

---

## ✅ BEST PRACTICES

1. **Always set `title`** - Identifies page
2. **Always set `icon`** - Visual indicator
3. **Use descriptive `subtitle`** - Explains page purpose
4. **Keep tab labels short** - Mobile friendly (< 15 chars)
5. **Implement `onTabChange`** - Must update `activeTab`
6. **Use `children` for content** - Keep pages clean
7. **Test responsive** - Mobile, tablet, desktop
8. **Follow naming convention** - PascalCase for component

---

## 🚀 CREATE NEW PAGE

1. Create file: `frontend/src/pages/YourPage.jsx`
2. Copy template above
3. Update title, icon, subtitle
4. Add content
5. Import in `App.jsx`
6. Add to BottomNav menu
7. Commit: `git add . && git commit -m "Add YourPage"`
8. Push: `git push origin main`
9. Done! 🎉

---

## 📝 CHECKLIST

- [ ] Import PageTemplate
- [ ] Set required props (title, icon, children)
- [ ] Set optional props (subtitle, tabs, etc.)
- [ ] Add page content in children
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1440px width)
- [ ] Verify tabs work (if used)
- [ ] Check colors match design
- [ ] Verify responsive layout
- [ ] Add to App.jsx
- [ ] Add to BottomNav
- [ ] Commit to GitHub
- [ ] Test live on Railway

---

**Version:** 1.0  
**Created:** June 1, 2026  
**Deployed:** ✅ Production
