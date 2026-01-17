'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { clearAdminSession, getAdminSession } from '@/lib/adminAuth';
import MiniGameBuilder from '@/components/admin/MiniGameBuilder';
import MiniGameList from '@/components/admin/MiniGameList';
import CampaignBuilder from '@/components/admin/CampaignBuilder';
import PersistenceManager from '@/components/admin/PersistenceManager';
import AssetManager from '@/components/admin/AssetManager';

export default function AdminPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'mini-games' | 'campaigns' | 'levels' | 'game-flows' | 'assets' | 'persistence'>('mini-games');

  const [adminId, setAdminId] = useState<string | null>(null);

  // Check admin session
  React.useEffect(() => {
    const session = getAdminSession();
    if (!session) {
      router.push('/admin');
      return;
    }
    setAdminId(session.adminId);
  }, [router]);

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin');
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setCurrentView('edit');
  };

  const handleSave = (item: any) => {
    setEditingItem(null);
    setCurrentView('list');
    // Refresh the list or handle the save result
  };

  const handleCancel = () => {
    setEditingItem(null);
    setCurrentView('list');
  };

  if (!adminId) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 font-mono flex items-center justify-center">
        <div className="text-yellow-400">Checking admin session...</div>
      </div>
    );
  }

  if (currentView === 'create' || currentView === 'edit') {
    if (activeTab === 'mini-games') {
      return (
        <MiniGameBuilder
          adminId={adminId}
          initialData={editingItem}
          mode={currentView === 'create' ? 'create' : 'edit'}
          onSave={handleSave}
        />
      );
    } else if (activeTab === 'campaigns') {
      return (
        <CampaignBuilder
          adminId={adminId}
          initialData={editingItem}
          mode={currentView === 'create' ? 'create' : 'edit'}
          onSave={handleSave}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono">
      {/* Header */}
      <div className="border-b-2 border-yellow-400 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-yellow-400">PROMETHEUS CONTROL SYSTEM</h1>
            <p className="text-cyan-300 text-sm">Game Builder & Admin Panel</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="border border-cyan-400 px-4 py-2 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-200"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="border border-red-400 px-4 py-2 text-red-400 hover:bg-red-400 hover:text-white transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-cyan-400">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8">
            {[
              { key: 'mini-games', label: 'Mini-Games', icon: '🎮' },
              { key: 'campaigns', label: 'Campaigns', icon: '🏰' },
              { key: 'levels', label: 'Levels', icon: '🏗️' },
              { key: 'game-flows', label: 'Game Flows', icon: '🔄' },
              { key: 'assets', label: 'Assets', icon: '📁' },
              { key: 'persistence', label: 'Persistence', icon: '💾' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-3 border-b-2 transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-cyan-400 hover:text-yellow-400'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'mini-games' && (
          <div>
            {/* Mini-Games Header */}
            <div className="p-6 border-b border-cyan-400">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-yellow-400">Mini-Games Library</h2>
                  <p className="text-cyan-300 text-sm">Create and manage interactive mini-games</p>
                </div>
                <button
                  onClick={() => setCurrentView('create')}
                  className="border-2 border-yellow-400 px-6 py-3 text-yellow-400 font-bold hover:bg-yellow-400 hover:text-black transition-all duration-200"
                >
                  CREATE MINI-GAME
                </button>
              </div>
            </div>
            
            {/* Mini-Games Content */}
            <MiniGameList adminId={adminId} />
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div>
            {/* Campaigns Header */}
            <div className="p-6 border-b border-cyan-400">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-yellow-400">Campaign Builder</h2>
                  <p className="text-cyan-300 text-sm">Create multi-level game campaigns</p>
                </div>
                <button
                  onClick={() => setCurrentView('create')}
                  className="border-2 border-yellow-400 px-6 py-3 text-yellow-400 font-bold hover:bg-yellow-400 hover:text-black transition-all duration-200"
                >
                  CREATE CAMPAIGN
                </button>
              </div>
            </div>
            
            {/* Campaigns Content - Placeholder */}
            <div className="p-6">
              <div className="border border-cyan-400 p-8 text-center">
                <div className="text-cyan-300 mb-4">Campaign management interface coming soon</div>
                <button
                  onClick={() => setCurrentView('create')}
                  className="border border-yellow-400 px-6 py-3 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
                >
                  CREATE FIRST CAMPAIGN
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'levels' && (
          <div className="p-6">
            <div className="border border-cyan-400 p-8 text-center">
              <div className="text-cyan-300 mb-4">Level Designer coming soon</div>
              <div className="text-sm text-cyan-500">Design complete game levels with objectives and progression</div>
            </div>
          </div>
        )}

        {activeTab === 'game-flows' && (
          <div className="p-6">
            <div className="border border-cyan-400 p-8 text-center">
              <div className="text-cyan-300 mb-4">Game Flow Editor coming soon</div>
              <div className="text-sm text-cyan-500">Drag-and-drop interface for arranging puzzles and mini-games</div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="p-6">
            <div className="border border-cyan-400 p-8 text-center">
              <div className="text-cyan-300 mb-4">Asset Manager coming soon</div>
              <div className="text-sm text-cyan-500">Upload and manage images, audio, and other game assets</div>
            </div>
          </div>
        )}

        {activeTab === 'persistence' && (
          <PersistenceManager adminId={adminId} />
        )}

        {activeTab === 'assets' && (
          <AssetManager adminId={adminId} />
        )}
      </div>
    </div>
  );
}