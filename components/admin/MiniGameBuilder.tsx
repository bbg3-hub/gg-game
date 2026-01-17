'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { MiniGameConfig, MiniGameType, ClickTargetsConfig } from '@/lib/mini-games';
import { DEFAULT_MINI_GAME_CONFIGS } from '@/lib/mini-games';

interface MiniGameBuilderProps {
  adminId: string;
  onSave?: (game: MiniGameConfig) => void;
  initialData?: Partial<MiniGameConfig>;
  mode: 'create' | 'edit';
}

const MINI_GAME_TYPES: { value: MiniGameType; label: string; description: string }[] = [
  {
    value: 'click-targets',
    label: 'Click Targets',
    description: 'Click on moving or static targets within time limit'
  },
  {
    value: 'memory-match',
    label: 'Memory Match',
    description: 'Match pairs of cards by remembering their positions'
  },
  {
    value: 'sequence-puzzle',
    label: 'Sequence Puzzle',
    description: 'Follow and reproduce a sequence of colors, numbers, or shapes'
  },
  {
    value: 'timing-challenge',
    label: 'Timing Challenge',
    description: 'React at the precise right moment within timing windows'
  },
  {
    value: 'pattern-recognition',
    label: 'Pattern Recognition',
    description: 'Identify patterns in grids or sequences'
  },
  {
    value: 'math-mini-game',
    label: 'Math Mini-Game',
    description: 'Quick math calculations under time pressure'
  },
  {
    value: 'sorting-game',
    label: 'Sorting Game',
    description: 'Sort items according to specific rules'
  },
  {
    value: 'reaction-test',
    label: 'Reaction Test',
    description: 'Measure and improve reaction times'
  },
];

const DIFFICULTY_LEVELS = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: i + 1,
  description: i < 3 ? 'Very Easy' : i < 5 ? 'Easy' : i < 7 ? 'Medium' : i < 9 ? 'Hard' : 'Expert'
}));

export default function MiniGameBuilder({ adminId, onSave, initialData, mode }: MiniGameBuilderProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<MiniGameConfig>(() => {
    const defaultClickTargetsConfig: ClickTargetsConfig = {
      id: '',
      title: '',
      description: '',
      type: 'click-targets',
      difficulty: 5,
      timeLimit: 30,
      maxAttempts: 3,
      scoringSystem: {
        basePoints: 10,
        timeMultiplier: true,
        difficultyBonus: true,
      },
      visualTheme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        backgroundColor: '#F8FAFC',
        textColor: '#1E293B',
        accentColor: '#F59E0B',
      },
      sounds: {},
      assets: [],
      successThreshold: 80,
      failureThreshold: undefined,
      createdAt: 0,
      updatedAt: 0,
      published: false,
      config: {
        targetCount: 5,
        targetSize: 50,
        moveSpeed: 5,
        targetColor: '#FF0000',
        targetShape: 'circle',
        comboScoring: true,
        movingTargets: true,
        spawnRate: 1,
        wrongClickPenalty: 0,
        perfectHitBonus: 0,
      },
    };

    return { ...defaultClickTargetsConfig, ...initialData } as MiniGameConfig;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTypeChange = useCallback((type: MiniGameType) => {
    const defaultConfig = DEFAULT_MINI_GAME_CONFIGS[type];
    setFormData(prev => ({
      ...prev,
      type,
      difficulty: defaultConfig.difficulty,
      timeLimit: defaultConfig.timeLimit,
      maxAttempts: defaultConfig.maxAttempts,
      scoringSystem: defaultConfig.scoringSystem,
      visualTheme: defaultConfig.visualTheme,
      successThreshold: defaultConfig.successThreshold,
      // Config will be set based on the specific game type
      config: (defaultConfig as any).config || {},
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'create' 
        ? '/api/admin/mini-games'
        : `/api/admin/mini-games/${formData.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          adminId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save mini-game');
      }

      if (onSave) {
        onSave(data.miniGame);
      }

      if (mode === 'create') {
        router.push('/admin/mini-games');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save mini-game');
    } finally {
      setLoading(false);
    }
  };

  const selectedTypeConfig = formData.type ? DEFAULT_MINI_GAME_CONFIGS[formData.type] : null;

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-yellow-400 p-6 shadow-[0_0_20px_rgba(255,255,0,0.3)]">
          <h1 className="text-3xl font-bold text-yellow-400 mb-6">
            {mode === 'create' ? 'CREATE MINI-GAME' : 'EDIT MINI-GAME'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border border-cyan-400 p-4 space-y-4">
              <h2 className="text-xl text-yellow-400 font-semibold">BASIC INFORMATION</h2>
              
              <div>
                <label className="block text-sm mb-2">TITLE *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter mini-game title"
                  className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">DESCRIPTION *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what players will do in this mini-game"
                  rows={3}
                  className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">GAME TYPE *</label>
                <select
                  value={formData.type || 'click-targets'}
                  onChange={(e) => handleTypeChange(e.target.value as MiniGameType)}
                  className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  required
                >
                  {MINI_GAME_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {formData.type && (
                  <div className="mt-2 text-sm text-cyan-300">
                    {MINI_GAME_TYPES.find(t => t.value === formData.type)?.description}
                  </div>
                )}
              </div>
            </div>

            {/* Game Settings */}
            <div className="border border-cyan-400 p-4 space-y-4">
              <h2 className="text-xl text-yellow-400 font-semibold">GAME SETTINGS</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">DIFFICULTY (1-10)</label>
                  <select
                    value={formData.difficulty || 5}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: parseInt(e.target.value) }))}
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  >
                    {DIFFICULTY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.value} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">TIME LIMIT (seconds)</label>
                  <input
                    type="number"
                    value={formData.timeLimit || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    placeholder="30"
                    min="5"
                    max="300"
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">MAX ATTEMPTS</label>
                  <input
                    type="number"
                    value={formData.maxAttempts || 1}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
                    min="1"
                    max="10"
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">SUCCESS THRESHOLD (%)</label>
                  <input
                    type="number"
                    value={formData.successThreshold || 80}
                    onChange={(e) => setFormData(prev => ({ ...prev, successThreshold: parseInt(e.target.value) }))}
                    min="1"
                    max="100"
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Visual Theme */}
            <div className="border border-cyan-400 p-4 space-y-4">
              <h2 className="text-xl text-yellow-400 font-semibold">VISUAL THEME</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">PRIMARY COLOR</label>
                  <input
                    type="color"
                    value={formData.visualTheme?.primaryColor || '#3B82F6'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visualTheme: {
                        ...prev.visualTheme,
                        primaryColor: e.target.value
                      }
                    }))}
                    className="w-full h-10 border border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">SECONDARY COLOR</label>
                  <input
                    type="color"
                    value={formData.visualTheme?.secondaryColor || '#1E40AF'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visualTheme: {
                        ...prev.visualTheme,
                        secondaryColor: e.target.value
                      }
                    }))}
                    className="w-full h-10 border border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">BACKGROUND COLOR</label>
                  <input
                    type="color"
                    value={formData.visualTheme?.backgroundColor || '#F8FAFC'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visualTheme: {
                        ...prev.visualTheme,
                        backgroundColor: e.target.value
                      }
                    }))}
                    className="w-full h-10 border border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">TEXT COLOR</label>
                  <input
                    type="color"
                    value={formData.visualTheme?.textColor || '#1E293B'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visualTheme: {
                        ...prev.visualTheme,
                        textColor: e.target.value
                      }
                    }))}
                    className="w-full h-10 border border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">ACCENT COLOR</label>
                  <input
                    type="color"
                    value={formData.visualTheme?.accentColor || '#F59E0B'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visualTheme: {
                        ...prev.visualTheme,
                        accentColor: e.target.value
                      }
                    }))}
                    className="w-full h-10 border border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Type-Specific Configuration */}
            {selectedTypeConfig && (
              <div className="border border-cyan-400 p-4 space-y-4">
                <h2 className="text-xl text-yellow-400 font-semibold">
                  {MINI_GAME_TYPES.find(t => t.value === formData.type)?.label.toUpperCase()} CONFIGURATION
                </h2>
                <div className="text-sm text-cyan-300">
                  Type-specific configuration options will appear here based on the selected game type.
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="border border-red-500 p-4 bg-red-900/20">
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/admin/mini-games')}
                className="border-2 border-gray-400 px-6 py-3 text-gray-400 hover:bg-gray-400 hover:text-black transition-all duration-200"
              >
                CANCEL
              </button>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`border-2 border-yellow-400 px-8 py-3 text-yellow-400 font-bold transition-all duration-200 ${
                    loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-yellow-400 hover:text-black shadow-[0_0_15px_rgba(255,255,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,0,0.8)]'
                  }`}
                >
                  {loading ? 'SAVING...' : mode === 'create' ? 'CREATE GAME' : 'UPDATE GAME'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}