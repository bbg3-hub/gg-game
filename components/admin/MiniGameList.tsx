'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { MiniGameConfig, MiniGameType } from '@/lib/mini-games';

interface MiniGameListProps {
  adminId: string;
}

const MINI_GAME_TYPE_LABELS: Record<MiniGameType, string> = {
  'click-targets': 'Click Targets',
  'memory-match': 'Memory Match',
  'sequence-puzzle': 'Sequence Puzzle',
  'timing-challenge': 'Timing Challenge',
  'pattern-recognition': 'Pattern Recognition',
  'math-mini-game': 'Math Mini-Game',
  'sorting-game': 'Sorting Game',
  'reaction-test': 'Reaction Test',
};

const DIFFICULTY_COLORS = {
  1: '#10B981', 2: '#22C55E', 3: '#84CC16',
  4: '#EAB308', 5: '#F59E0B', 6: '#F97316',
  7: '#EF4444', 8: '#DC2626', 9: '#B91C1C', 10: '#7F1D1D'
};

export default function MiniGameList({ adminId }: MiniGameListProps) {
  const router = useRouter();
  const [miniGames, setMiniGames] = useState<MiniGameConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all' as MiniGameType | 'all',
    difficulty: 'all' as string,
    published: 'all' as 'all' | 'true' | 'false',
    search: '',
  });
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMiniGames();
  }, [adminId, filter.type, filter.difficulty, filter.published, filter.search]);

  const loadMiniGames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        adminId,
        ...(filter.type !== 'all' && { type: filter.type }),
        ...(filter.difficulty !== 'all' && { difficulty: filter.difficulty }),
        ...(filter.published !== 'all' && { published: filter.published }),
      });

      const response = await fetch(`/api/admin/mini-games?${params}`);
      const data = await response.json();

      if (data.success) {
        let filteredGames = data.miniGames;

        // Apply search filter
        if (filter.search) {
          const searchTerm = filter.search.toLowerCase();
          filteredGames = filteredGames.filter((game: MiniGameConfig) =>
            game.title.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm)
          );
        }

        setMiniGames(filteredGames);
      }
    } catch (error) {
      console.error('Failed to load mini-games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this mini-game?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/mini-games/${gameId}?adminId=${adminId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMiniGames(games => games.filter(game => game.id !== gameId));
        setSelectedGames(selected => {
          const newSet = new Set(selected);
          newSet.delete(gameId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to delete mini-game:', error);
    }
  };

  const handleDuplicate = async (game: MiniGameConfig) => {
    try {
      const duplicatedGame = {
        ...game,
        title: `${game.title} (Copy)`,
        id: undefined, // Will be generated
        createdAt: undefined,
        updatedAt: undefined,
      };

      const response = await fetch('/api/admin/mini-games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...duplicatedGame,
          adminId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMiniGames(games => [data.miniGame, ...games]);
      }
    } catch (error) {
      console.error('Failed to duplicate mini-game:', error);
    }
  };

  const handleTogglePublish = async (game: MiniGameConfig) => {
    try {
      const response = await fetch(`/api/admin/mini-games/${game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...game,
          published: !game.published,
          adminId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMiniGames(games => 
          games.map(g => g.id === game.id ? data.miniGame : g)
        );
      }
    } catch (error) {
      console.error('Failed to update mini-game:', error);
    }
  };

  const handleSelectGame = (gameId: string) => {
    setSelectedGames(prev => {
      const newSet = new Set(prev);
      if (newSet.has(gameId)) {
        newSet.delete(gameId);
      } else {
        newSet.add(gameId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedGames.size === miniGames.length) {
      setSelectedGames(new Set());
    } else {
      setSelectedGames(new Set(miniGames.map(game => game.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedGames.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedGames.size} mini-games?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedGames).map(gameId =>
        fetch(`/api/admin/mini-games/${gameId}?adminId=${adminId}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);
      setMiniGames(games => games.filter(game => !selectedGames.has(game.id)));
      setSelectedGames(new Set());
    } catch (error) {
      console.error('Failed to batch delete mini-games:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-2 border-yellow-400 p-6 shadow-[0_0_20px_rgba(255,255,0,0.3)] mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">MINI-GAME LIBRARY</h1>
              <p className="text-cyan-300 mt-2">Browse, edit, and manage mini-games</p>
            </div>
            <button
              onClick={() => router.push('/admin/mini-games/new')}
              className="border-2 border-yellow-400 px-6 py-3 text-yellow-400 font-bold hover:bg-yellow-400 hover:text-black transition-all duration-200"
            >
              CREATE NEW
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="border border-cyan-400 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-2">SEARCH</label>
              <input
                type="text"
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search mini-games..."
                className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">TYPE</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
              >
                <option value="all">All Types</option>
                {Object.entries(MINI_GAME_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">DIFFICULTY</label>
              <select
                value={filter.difficulty}
                onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
              >
                <option value="all">All Difficulties</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">STATUS</label>
              <select
                value={filter.published}
                onChange={(e) => setFilter(prev => ({ ...prev, published: e.target.value as any }))}
                className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
              >
                <option value="all">All</option>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Batch Actions */}
        {selectedGames.size > 0 && (
          <div className="border border-yellow-400 p-4 mb-6 bg-yellow-900/20">
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">
                {selectedGames.size} mini-game(s) selected
              </span>
              <button
                onClick={handleBatchDelete}
                className="border border-red-500 px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                DELETE SELECTED
              </button>
            </div>
          </div>
        )}

        {/* Mini-Games Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-yellow-400">Loading mini-games...</div>
          </div>
        ) : miniGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-cyan-300">No mini-games found</div>
            <button
              onClick={() => router.push('/admin/mini-games/new')}
              className="mt-4 border-2 border-yellow-400 px-6 py-3 text-yellow-400 font-bold hover:bg-yellow-400 hover:text-black transition-all duration-200"
            >
              CREATE FIRST MINI-GAME
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniGames.map((game) => (
              <div
                key={game.id}
                className={`border-2 p-4 transition-all duration-200 ${
                  selectedGames.has(game.id)
                    ? 'border-yellow-400 bg-yellow-900/20'
                    : 'border-cyan-400 hover:border-yellow-400'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedGames.has(game.id)}
                      onChange={() => handleSelectGame(game.id)}
                      className="w-4 h-4"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-yellow-400">{game.title}</h3>
                      <p className="text-sm text-cyan-300">{MINI_GAME_TYPE_LABELS[game.type]}</p>
                    </div>
                  </div>
                  
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{
                      backgroundColor: DIFFICULTY_COLORS[game.difficulty as keyof typeof DIFFICULTY_COLORS],
                      borderColor: DIFFICULTY_COLORS[game.difficulty as keyof typeof DIFFICULTY_COLORS],
                    }}
                    title={`Difficulty: ${game.difficulty}/10`}
                  />
                </div>

                {/* Description */}
                <p className="text-cyan-300 text-sm mb-4 line-clamp-3">{game.description}</p>

                {/* Stats */}
                <div className="flex justify-between text-xs text-cyan-400 mb-4">
                  <span>Duration: {game.timeLimit || 'N/A'}s</span>
                  <span>Attempts: {game.maxAttempts || '∞'}</span>
                  <span>Success: {game.successThreshold}%</span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2 py-1 text-xs font-bold ${
                      game.published
                        ? 'bg-green-900 text-green-400 border border-green-400'
                        : 'bg-gray-900 text-gray-400 border border-gray-400'
                    }`}
                  >
                    {game.published ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                  
                  <span className="text-xs text-cyan-500">
                    {new Date(game.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/admin/mini-games/${game.id}`)}
                    className="flex-1 border border-cyan-400 px-3 py-2 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-200 text-sm"
                  >
                    EDIT
                  </button>
                  
                  <button
                    onClick={() => handleTogglePublish(game)}
                    className={`flex-1 border px-3 py-2 text-sm transition-all duration-200 ${
                      game.published
                        ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-white'
                        : 'border-green-400 text-green-400 hover:bg-green-400 hover:text-white'
                    }`}
                  >
                    {game.published ? 'UNPUBLISH' : 'PUBLISH'}
                  </button>
                  
                  <button
                    onClick={() => handleDuplicate(game)}
                    className="border border-yellow-400 px-3 py-2 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200 text-sm"
                  >
                    COPY
                  </button>
                  
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="border border-red-400 px-3 py-2 text-red-400 hover:bg-red-400 hover:text-white transition-all duration-200 text-sm"
                  >
                    DEL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Select All Checkbox */}
        {miniGames.length > 0 && (
          <div className="mt-6 flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedGames.size === miniGames.length}
              onChange={handleSelectAll}
              className="w-4 h-4"
            />
            <label className="text-cyan-300">
              Select all mini-games ({miniGames.length})
            </label>
          </div>
        )}
      </div>
    </div>
  );
}