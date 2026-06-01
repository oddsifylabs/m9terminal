import React from 'react';

/**
 * PageTemplate - Universal layout component for all pages
 * 
 * Features:
 * - Consistent header with app name and tagline
 * - No settings gear icon
 * - Page title and description
 * - Tab navigation support (optional)
 * - MLB Model indicator
 * - Scrollable content area
 * - Fixed bottom navigation
 * 
 * Usage:
 * <PageTemplate
 *   title="Markets"
 *   icon="⚾"
 *   subtitle="MLB Live Data"
 *   tabs={[{id: 'signals', label: 'Signals'}, {id: 'props', label: 'Props'}]}
 *   activeTab="signals"
 *   onTabChange={setActiveTab}
 * >
 *   {/* Page content goes here */}
 * </PageTemplate>
 */

const PageTemplate = ({
  title,           // Page title (e.g., "Markets")
  icon,            // Icon emoji (e.g., "⚾")
  subtitle,        // Subtitle/description (e.g., "MLB Live Data")
  tabs,            // Optional array of tabs: [{id: 'tab1', label: 'Tab 1'}, ...]
  activeTab,       // Currently active tab ID
  onTabChange,     // Callback when tab changes
  children,        // Page content
  showMLBBanner = true // Show MLB Model Only banner
}) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* ========== GLOBAL HEADER ========== */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-green-600">M9</span>
          <div className="border-l border-gray-300 pl-3">
            <p className="text-sm font-semibold text-gray-900">Terminal</p>
            <p className="text-xs text-gray-600">⚾ Tagline</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium">v1.0</p>
        </div>
      </header>

      {/* ========== PAGE TITLE ========== */}
      <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* ========== TAB NAVIGATION (Optional) ========== */}
      {tabs && tabs.length > 0 && (
        <div className="sticky top-0 z-40 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex overflow-x-auto px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`px-4 py-3 font-medium whitespace-nowrap transition-all border-b-2 text-sm ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========== MLB MODEL BANNER ========== */}
      {showMLBBanner && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex-shrink-0">
          <p className="text-xs text-blue-800 font-medium">⚾ MLB Model Only</p>
        </div>
      )}

      {/* ========== SCROLLABLE CONTENT AREA ========== */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 max-w-4xl mx-auto">
          {children}
        </div>
      </div>

      {/* Note: Bottom navigation is handled by App.jsx */}
    </div>
  );
};

export default PageTemplate;
