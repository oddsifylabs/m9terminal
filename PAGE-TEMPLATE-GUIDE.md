# PAGE TEMPLATE DOCUMENTATION

**Date:** June 1, 2026  
**Status:** ✅ **DEPLOYED**  
**Component:** `PageTemplate.jsx`

---

## 📋 OVERVIEW

The `PageTemplate` component provides a **unified, reusable layout** for all pages in M9 Terminal. It standardizes:

- **Global Header** - App name & tagline (M9 Terminal | ⚾ Tagline)
- **Page Title** - Icon + Title + Subtitle
- **Tab Navigation** - Optional tab support
- **Content Area** - Scrollable main content
- **MLB Banner** - "MLB Model Only" indicator
- **Responsive Design** - Mobile, tablet, desktop

---

## 🎯 BENEFITS

✅ **DRY Principle** - Write header once, use everywhere  
✅ **Consistency** - All pages look identical  
✅ **Maintainability** - Change header, update entire app  
✅ **Scalability** - Easy to add new pages  
✅ **Flexibility** - Customizable per page  

---

## 📁 FILE LOCATION

```
frontend/src/components/PageTemplate.jsx
```

---

## 🔧 USAGE

### Basic Usage

```jsx
import PageTemplate from '../components/PageTemplate';

const MyPage = () => {
  return (
    <PageTemplate
      title="Markets"
      icon="⚾"
      subtitle="MLB Live Data"
    >
      {/* Page content here */}
      <div>My content</div>
    </PageTemplate>
  );
};
```

### With Tabs

```jsx
const [activeTab, setActiveTab] = useState('signals');

const tabs = [
  { id: 'signals', label: 'Signals' },
  { id: 'props', label: 'Props' },
  { id: 'games', label: 'Games' }
];

return (
  <PageTemplate
    title="Markets"
    icon="⚾"
    subtitle="MLB Live Data"
    tabs={tabs}
    activeTab={activeTab}
    onTabChange={setActiveTab}
  >
    {/* Content rendered based on activeTab */}
    {activeTab === 'signals' && <SignalsContent />}
    {activeTab === 'props' && <PropsContent />}
    {activeTab === 'games' && <GamesContent />}
  </PageTemplate>
);
```

### Without MLB Banner

```jsx
<PageTemplate
  title="Settings"
  icon="⚙️"
  subtitle="Preferences"
  showMLBBanner={false}
>
  {/* Content */}
</PageTemplate>
```

---

## 📊 COMPONENT PROPS

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | ✅ Yes | — | Page title (e.g., "Markets") |
| `icon` | string | ✅ Yes | — | Icon emoji (e.g., "⚾") |
| `subtitle` | string | ❌ Optional | — | Subtitle/description |
| `tabs` | array | ❌ Optional | — | Tab definitions: `[{id, label}, ...]` |
| `activeTab` | string | ❌ Optional | — | Currently active tab ID |
| `onTabChange` | function | ❌ Optional | — | Callback: `(tabId) => {}` |
| `children` | element | ✅ Yes | — | Page content JSX |
| `showMLBBanner` | bool | ❌ Optional | `true` | Show/hide MLB Model banner |

---

## 🎨 STRUCTURE

```
┌──────────────────────────────────────────────────────┐
│                  GLOBAL HEADER                        │
│  [M9 Terminal | ⚾ Tagline]          [v1.0]          │
├──────────────────────────────────────────────────────┤
│                  PAGE TITLE                           │
│  ⚾ Markets | MLB Live Data                           │
├──────────────────────────────────────────────────────┤
│              TAB NAVIGATION (Optional)                │
│  [Signals] [Props] [Game Explorer]                   │
├──────────────────────────────────────────────────────┤
│            MLB MODEL BANNER (Optional)                │
│  ⚾ MLB Model Only                                    │
├──────────────────────────────────────────────────────┤
│                                                        │
│         SCROLLABLE CONTENT AREA                       │
│                                                        │
│  • Cards                                              │
│  • Lists                                              │
│  • Forms                                              │
│  • Custom content                                     │
│                                                        │
├──────────────────────────────────────────────────────┤
│         BOTTOM NAVIGATION (Fixed)                     │
│  [📊] [⚾] [🔍] [📈] [⚙️]                           │
└──────────────────────────────────────────────────────┘
```

---

## 🎨 STYLING DETAILS

### Global Header

```jsx
<header className="bg-white border-b border-gray-200 px-4 py-3">
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <span className="text-2xl font-bold text-green-600">M9</span>
      <div className="border-l border-gray-300 pl-3">
        <p className="text-sm font-semibold">Terminal</p>
        <p className="text-xs text-gray-600">⚾ Tagline</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs text-gray-500">v1.0</p>
    </div>
  </div>
</header>
```

**Properties:**
- Background: White (#ffffff)
- Border: Light gray bottom
- Padding: 12px 16px
- Height: 56px (compact)
- Flex: Justify-between

---

### Page Title

```jsx
<div className="px-4 py-4 border-b border-gray-200">
  <div className="flex items-center gap-2">
    <span className="text-2xl">{icon}</span>
    <div>
      <h1 className="text-lg font-bold">{title}</h1>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  </div>
</div>
```

**Properties:**
- Icon: 24px (emoji)
- Title: 18px, bold
- Subtitle: 12px, light gray
- Padding: 16px
- Border: Light gray bottom

---

### Tab Navigation

```jsx
<div className="sticky top-0 z-40 bg-gray-50 border-b border-gray-200">
  <div className="flex overflow-x-auto px-4">
    {tabs.map((tab) => (
      <button
        onClick={() => onTabChange?.(tab.id)}
        className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 text-sm ${
          activeTab === tab.id
            ? 'border-green-600 text-green-600'
            : 'border-transparent text-gray-600'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
</div>
```

**Properties:**
- Background: Light gray (#f3f4f6)
- Active tab: Green border bottom + green text
- Inactive tab: Gray text
- Sticky at top
- Scrollable on mobile
- Padding: 12px 16px

---

### Content Area

```jsx
<div className="flex-1 overflow-y-auto pb-20">
  <div className="px-4 py-6 max-w-4xl mx-auto">
    {children}
  </div>
</div>
```

**Properties:**
- Flex: 1 (takes remaining space)
- Overflow: Y-auto (scrollable)
- Padding bottom: 80px (for bottom nav)
- Max width: 56rem (896px, desktop)
- Padding: 16px
- Margin: auto (centered on desktop)

---

### MLB Model Banner

```jsx
<div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
  <p className="text-xs text-blue-800 font-medium">⚾ MLB Model Only</p>
</div>
```

**Properties:**
- Background: Light blue (#eff6ff)
- Border: Light blue
- Text: Small, bold, blue
- Padding: 8px 16px
- Optional (controlled by `showMLBBanner` prop)

---

## 📄 PAGES USING TEMPLATE

### 1. Dashboard
```jsx
<PageTemplate
  title="Dashboard"
  icon="📊"
  subtitle="MLB Model Overview"
>
  {/* Dashboard content */}
</PageTemplate>
```

### 2. Markets
```jsx
<PageTemplate
  title="Markets"
  icon="⚾"
  subtitle="MLB Live Data"
  tabs={[
    { id: 'signals', label: 'Signals' },
    { id: 'props', label: 'Props' },
    { id: 'gameexplorer', label: 'Game Explorer' }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  {/* Content based on activeTab */}
</PageTemplate>
```

### 3. Intel
```jsx
<PageTemplate
  title="Intel"
  icon="🔍"
  subtitle="MLB Information"
  tabs={[
    { id: 'news', label: 'News' },
    { id: 'injuries', label: 'Injuries' },
    { id: 'weather', label: 'Weather' },
    { id: 'stats', label: 'Stats' }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  {/* Content based on activeTab */}
</PageTemplate>
```

### 4. Tracker
```jsx
<PageTemplate
  title="Tracker"
  icon="📈"
  subtitle="Bet Log, CLV & Bankroll"
  tabs={[
    { id: 'betlog', label: 'Bet Log' },
    { id: 'clv', label: 'CLV' },
    { id: 'bankroll', label: 'Bankroll' },
    { id: 'credits', label: 'Credits' }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  {/* Content based on activeTab */}
</PageTemplate>
```

### 5. Settings
```jsx
<PageTemplate
  title="Settings"
  icon="⚙️"
  subtitle="Preferences & Configuration"
  showMLBBanner={false}
>
  {/* Settings content */}
</PageTemplate>
```

---

## 🔄 ADDING NEW PAGES

### Step 1: Create Page File
```jsx
// frontend/src/pages/NewPage.jsx
import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate';

const NewPage = ({ setAppMenu }) => {
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' }
  ];

  return (
    <PageTemplate
      title="New Page"
      icon="🎯"
      subtitle="Page Description"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Content */}
    </PageTemplate>
  );
};

export default NewPage;
```

### Step 2: Import in App.jsx
```jsx
import NewPage from './pages/NewPage';
```

### Step 3: Add to Routes
```jsx
{activeMenu === 'newpage' && <NewPage setAppMenu={setActiveMenu} />}
```

### Step 4: Add to BottomNav
```jsx
{ id: 'newpage', label: 'New Page', icon: '🎯' }
```

---

## ✅ CHECKLIST FOR NEW PAGES

- [ ] Import PageTemplate
- [ ] Set title (e.g., "Markets")
- [ ] Set icon (emoji, e.g., "⚾")
- [ ] Set subtitle (description, optional)
- [ ] Add tabs array if needed (optional)
- [ ] Set activeTab state
- [ ] Add onTabChange handler
- [ ] Add page content
- [ ] Set showMLBBanner (optional, default: true)
- [ ] Export component
- [ ] Add to App.jsx routes
- [ ] Add to BottomNav menu
- [ ] Test responsive design
- [ ] Test tab navigation
- [ ] Deploy to Railway

---

## 🎯 DESIGN CONSISTENCY

All pages now have:

✅ **Unified Header** - Same layout, styling  
✅ **Consistent Title** - Icon + Title + Subtitle  
✅ **Standard Tabs** - Same styling, behavior  
✅ **MLB Banner** - Consistent placement  
✅ **Card Layouts** - Uniform component styling  
✅ **Color Scheme** - Green primary, white background  
✅ **Typography** - Consistent font hierarchy  
✅ **Spacing** - Standard padding/margins  
✅ **Responsive Design** - Mobile-first approach  
✅ **Accessibility** - Clear contrast, readable text  

---

## 🚀 DEPLOYMENT

**Status:** ✅ Deployed to Railway  
**Files:** 
- ✅ `frontend/src/components/PageTemplate.jsx` (new)
- ✅ `frontend/src/pages/Dashboard.jsx` (updated)
- ✅ `frontend/src/pages/Markets.jsx` (updated)
- ✅ `frontend/src/pages/Intel.jsx` (updated)
- ✅ `frontend/src/pages/Settings.jsx` (updated)

**Timeline:** 30-60 seconds rebuild  
**Live:** https://m9terminal-production.up.railway.app/

---

## 📝 FUTURE ENHANCEMENTS

- [ ] Add loading skeleton during content load
- [ ] Add breadcrumb navigation
- [ ] Add page-level animations
- [ ] Add search functionality
- [ ] Add share/export buttons
- [ ] Add dark mode support
- [ ] Add notifications badge
- [ ] Add user avatar in header
- [ ] Add back button for navigation
- [ ] Add keyboard shortcuts

---

**Version:** 1.0  
**Created:** June 1, 2026  
**Status:** ✅ Production Ready
