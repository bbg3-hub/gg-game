'use client';

import { useState, useEffect } from 'react';
import { getAdminSession } from '@/lib/adminAuth';
import type { SavedGameState, BackupData, DatabaseStats } from '@/lib/persistence';

interface PersistenceManagerProps {
  adminId: string;
}

export default function PersistenceManager({ adminId }: PersistenceManagerProps) {
  const [savedGames, setSavedGames] = useState<SavedGameState[]>([]);
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'games' | 'backups' | 'settings'>('games');
  const [filters, setFilters] = useState({
    gameType: 'all' as 'all' | 'horror' | 'educational' | 'mixed',
    autoSaved: 'all' as 'all' | 'true' | 'false',
    search: '',
  });

  useEffect(() => {
    loadData();
  }, [adminId, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSavedGames(),
        loadBackups(),
        loadStats(),
      ]);
    } catch (error) {
      console.error('Failed to load persistence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedGames = async () => {
    try {
      const params = new URLSearchParams({
        adminId,
        ...(filters.gameType !== 'all' && { gameType: filters.gameType }),
        ...(filters.autoSaved !== 'all' && { autoSaved: filters.autoSaved }),
      });

      const response = await fetch(`/api/admin/persistence/games?${params}`);
      const data = await response.json();

      if (data.success) {
        let filteredGames = data.savedGames;
        
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredGames = filteredGames.filter((game: SavedGameState) =>
            game.metadata.title.toLowerCase().includes(searchTerm) ||
            game.playerId.toLowerCase().includes(searchTerm) ||
            game.sessionId.toLowerCase().includes(searchTerm)
          );
        }
        
        setSavedGames(filteredGames);
      }
    } catch (error) {
      console.error('Failed to load saved games:', error);
    }
  };

  const loadBackups = async () => {
    try {
      const response = await fetch(`/api/admin/persistence/backups?adminId=${adminId}`);
      const data = await response.json();

      if (data.success) {
        setBackups(data.backups);
      }
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/admin/persistence/stats?adminId=${adminId}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleRestoreGame = async (gameId: string) => {
    if (!confirm('Are you sure you want to restore this game state? This will overwrite the current game.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/persistence/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          adminId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Game state restored successfully!');
        loadSavedGames();
      } else {
        alert(`Failed to restore game: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to restore game:', error);
      alert('Failed to restore game state');
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Are you sure you want to permanently delete this saved game?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/persistence/games/${gameId}?adminId=${adminId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSavedGames(games => games.filter(g => g.id !== gameId));
      }
    } catch (error) {
      console.error('Failed to delete game:', error);
    }
  };

  const handleCreateBackup = async () => {
    const name = prompt('Enter a name for this backup:');
    if (!name) return;

    try {
      const response = await fetch('/api/admin/persistence/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId,
          name,
          description: `Manual backup created on ${new Date().toLocaleString()}`,
          includeSessions: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Backup created successfully!');
        loadBackups();
      } else {
        alert(`Failed to create backup: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup');
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to restore from this backup? This may overwrite existing data.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/persistence/restore-backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backupId,
          adminId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Backup restored successfully! Restored ${data.restoredGames} games and ${data.restoredSessions} sessions.`);
        loadData();
      } else {
        alert(`Failed to restore backup: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to restore backup:', error);
      alert('Failed to restore backup');
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 font-mono flex items-center justify-center">
        <div className="text-yellow-400">Loading persistence data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-2 border-yellow-400 p-6 shadow-[0_0_20px_rgba(255,255,0,0.3)] mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">PERSISTENCE MANAGER</h1>
              <p className="text-cyan-300 mt-2">Save/restore game states and manage backups</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCreateBackup}
                className="border-2 border-yellow-400 px-6 py-3 text-yellow-400 font-bold hover:bg-yellow-400 hover:text-black transition-all duration-200"
              >
                CREATE BACKUP
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="border border-cyan-400 p-4 mb-6">
            <h2 className="text-xl text-yellow-400 font-semibold mb-4">DATABASE STATISTICS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.totalSavedGames}</div>
                <div className="text-sm text-cyan-300">Saved Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.totalSessions}</div>
                <div className="text-sm text-cyan-300">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.totalBackups}</div>
                <div className="text-sm text-cyan-300">Backups</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{formatBytes(stats.storageUsed)}</div>
                <div className="text-sm text-cyan-300">Storage Used</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-cyan-400 mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'games', label: 'Saved Games', count: savedGames.length },
              { key: 'backups', label: 'Backups', count: backups.length },
              { key: 'settings', label: 'Settings' },
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
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-cyan-800 text-cyan-200 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Saved Games Tab */}
        {activeTab === 'games' && (
          <div>
            {/* Filters */}
            <div className="border border-cyan-400 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">SEARCH</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Search by title, player, or session..."
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">GAME TYPE</label>
                  <select
                    value={filters.gameType}
                    onChange={(e) => setFilters(prev => ({ ...prev, gameType: e.target.value as any }))}
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  >
                    <option value="all">All Types</option>
                    <option value="horror">Horror</option>
                    <option value="educational">Educational</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">SAVE TYPE</label>
                  <select
                    value={filters.autoSaved}
                    onChange={(e) => setFilters(prev => ({ ...prev, autoSaved: e.target.value as any }))}
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  >
                    <option value="all">All</option>
                    <option value="true">Auto-saved</option>
                    <option value="false">Manual</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Games List */}
            {savedGames.length === 0 ? (
              <div className="text-center py-12 border border-cyan-400">
                <div className="text-cyan-300">No saved games found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {savedGames.map((game) => (
                  <div key={game.id} className="border border-cyan-400 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-yellow-400">{game.metadata.title}</h3>
                        <p className="text-sm text-cyan-300 mt-1">{game.metadata.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-cyan-400">Player:</span>
                            <span className="text-cyan-200 ml-2">{game.playerId}</span>
                          </div>
                          <div>
                            <span className="text-cyan-400">Type:</span>
                            <span className="text-cyan-200 ml-2 capitalize">{game.metadata.gameType}</span>
                          </div>
                          <div>
                            <span className="text-cyan-400">Difficulty:</span>
                            <span className="text-cyan-200 ml-2">{game.metadata.difficulty}/10</span>
                          </div>
                          <div>
                            <span className="text-cyan-400">Save Type:</span>
                            <span className={`ml-2 ${game.autoSaved ? 'text-yellow-400' : 'text-green-400'}`}>
                              {game.autoSaved ? 'Auto' : 'Manual'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-cyan-500">
                          Saved: {formatDate(game.updatedAt)} • 
                          Session: {game.sessionId}
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleRestoreGame(game.id)}
                          className="border border-yellow-400 px-4 py-2 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
                        >
                          RESTORE
                        </button>
                        <button
                          onClick={() => handleDeleteGame(game.id)}
                          className="border border-red-400 px-4 py-2 text-red-400 hover:bg-red-400 hover:text-white transition-all duration-200"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div>
            {backups.length === 0 ? (
              <div className="text-center py-12 border border-cyan-400">
                <div className="text-cyan-300">No backups created yet</div>
                <button
                  onClick={handleCreateBackup}
                  className="mt-4 border border-yellow-400 px-6 py-3 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
                >
                  CREATE FIRST BACKUP
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div key={backup.id} className="border border-cyan-400 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-yellow-400">{backup.name}</h3>
                        <p className="text-sm text-cyan-300 mt-1">{backup.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-cyan-400">Games:</span>
                            <span className="text-cyan-200 ml-2">{backup.metadata.totalGames}</span>
                          </div>
                          <div>
                            <span className="text-cyan-400">Sessions:</span>
                            <span className="text-cyan-200 ml-2">{backup.metadata.totalSessions}</span>
                          </div>
                          <div>
                            <span className="text-cyan-400">Size:</span>
                            <span className="text-cyan-200 ml-2">{formatBytes(backup.metadata.size)}</span>
                          </div>
                          <div>
                            <span className="text-cyan-400">Created:</span>
                            <span className="text-cyan-200 ml-2">{formatDate(backup.metadata.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleRestoreBackup(backup.id)}
                          className="border border-yellow-400 px-4 py-2 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
                        >
                          RESTORE
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this backup?')) {
                              // Handle delete backup
                            }
                          }}
                          className="border border-red-400 px-4 py-2 text-red-400 hover:bg-red-400 hover:text-white transition-all duration-200"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="border border-cyan-400 p-6">
            <h2 className="text-xl text-yellow-400 font-semibold mb-4">PERSISTENCE SETTINGS</h2>
            <div className="text-cyan-300">
              <p>Settings configuration will be implemented here.</p>
              <p className="mt-2 text-sm">This would include auto-save frequency, retention policies, and backup configuration.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}