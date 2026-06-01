import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate';

const Settings = ({ setAppMenu }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <PageTemplate
      title="Settings"
      icon="⚙️"
      subtitle="Preferences & Configuration"
      showMLBBanner={false}
    >
      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-900">Notifications</p>
            <p className="text-xs text-gray-600 mt-1">Receive betting alerts and updates</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              notifications
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {notifications ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Auto Refresh */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-900">Auto-Refresh Data</p>
            <p className="text-xs text-gray-600 mt-1">Update odds and games every 5 minutes</p>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              autoRefresh
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {autoRefresh ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-900">Dark Mode</p>
            <p className="text-xs text-gray-600 mt-1">Coming soon</p>
          </div>
          <button
            disabled
            className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Off
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Account</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-600 font-medium">Email</p>
            <p className="text-gray-900 mt-1">user@example.com</p>
          </div>
          <div className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-600 font-medium">Member Since</p>
            <p className="text-gray-900 mt-1">June 1, 2026</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Plan</p>
            <p className="text-gray-900 mt-1">Pro • MLB Model</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3">About</h3>
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Version</p>
            <p className="font-bold text-gray-900">1.0</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Build</p>
            <p className="font-bold text-gray-900">2026.06.01</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Environment</p>
            <p className="font-bold text-gray-900">Production</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-medium rounded-lg transition-all">
        Logout
      </button>
    </PageTemplate>
  );
};

export default Settings;
