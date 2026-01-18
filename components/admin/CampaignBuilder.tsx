'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Campaign, CampaignLevel } from '@/lib/campaigns';
import { CAMPAIGN_TEMPLATES } from '@/lib/campaigns';

interface CampaignBuilderProps {
  adminId: string;
  onSave?: (campaign: Campaign) => void;
  initialData?: Partial<Campaign>;
  mode: 'create' | 'edit';
}

const THEME_OPTIONS = [
  { value: 'horror', label: 'Horror', description: 'Scary, dark atmosphere with jumpscares' },
  { value: 'educational', label: 'Educational', description: 'Learning-focused with academic content' },
  { value: 'mixed', label: 'Mixed', description: 'Combines horror and educational elements' },
  { value: 'sci-fi', label: 'Sci-Fi', description: 'Futuristic, technological themes' },
  { value: 'fantasy', label: 'Fantasy', description: 'Magical, mythical environments' },
  { value: 'casual', label: 'Casual', description: 'Light-hearted, accessible content' },
];

const DIFFICULTY_LEVELS = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: i + 1,
  description: i < 3 ? 'Very Easy' : i < 5 ? 'Easy' : i < 7 ? 'Medium' : i < 9 ? 'Hard' : 'Expert'
}));

export default function CampaignBuilder({ adminId, onSave, initialData, mode }: CampaignBuilderProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    theme: 'mixed',
    difficulty: 5,
    levels: [],
    tags: [],
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleTemplateSelect = useCallback((templateKey: string) => {
    const template = CAMPAIGN_TEMPLATES[templateKey as keyof typeof CAMPAIGN_TEMPLATES];
    if (template) {
      setFormData(prev => ({
        ...prev,
        name: template.name,
        description: template.description,
        theme: template.theme,
        difficulty: template.difficulty,
        levels: template.levels,
        tags: template.tags,
      }));
      setSelectedTemplate(templateKey);
    }
  }, []);

  const addLevel = () => {
    const levelCount = formData.levels?.length || 0;
    const newLevel: CampaignLevel = {
      id: `level-${levelCount + 1}`,
      name: `Level ${levelCount + 1}`,
      description: '',
      objectives: [],
      gameFlowId: '',
      difficulty: formData.difficulty || 5,
      estimatedDuration: 20,
      isActive: true,
    };

    setFormData(prev => ({
      ...prev,
      levels: [...(prev.levels || []), newLevel],
    }));
  };

  const updateLevel = (index: number, updates: Partial<CampaignLevel>) => {
    setFormData(prev => ({
      ...prev,
      levels: prev.levels?.map((level, i) => 
        i === index ? { ...level, ...updates } : level
      ) || [],
    }));
  };

  const removeLevel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      levels: prev.levels?.filter((_, i) => i !== index) || [],
    }));
  };

  const moveLevel = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === (formData.levels?.length || 0) - 1)
    ) {
      return;
    }

    setFormData(prev => {
      const newLevels = [...(prev.levels || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newLevels[index], newLevels[targetIndex]] = [newLevels[targetIndex], newLevels[index]];
      
      // Update IDs after reordering
      const reorderedLevels = newLevels.map((level, i) => ({
        ...level,
        id: `level-${i + 1}`,
      }));

      return {
        ...prev,
        levels: reorderedLevels,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'create' 
        ? '/api/admin/campaigns'
        : `/api/admin/campaigns/${formData.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalDuration: formData.levels?.reduce((total, level) => total + level.estimatedDuration, 0) || 0,
          adminId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save campaign');
      }

      if (onSave) {
        onSave(data.campaign);
      }

      if (mode === 'create') {
        router.push('/admin/campaigns');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <div className="max-w-6xl mx-auto">
        <div className="border-2 border-yellow-400 p-6 shadow-[0_0_20px_rgba(255,255,0,0.3)]">
          <h1 className="text-3xl font-bold text-yellow-400 mb-6">
            {mode === 'create' ? 'CREATE CAMPAIGN' : 'EDIT CAMPAIGN'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Template Selection */}
            {mode === 'create' && (
              <div className="border border-cyan-400 p-4 space-y-4">
                <h2 className="text-xl text-yellow-400 font-semibold">START WITH TEMPLATE</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(CAMPAIGN_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTemplateSelect(key)}
                      className={`border p-4 text-left transition-all duration-200 ${
                        selectedTemplate === key
                          ? 'border-yellow-400 bg-yellow-900/20'
                          : 'border-cyan-400 hover:border-yellow-400'
                      }`}
                    >
                      <h3 className="text-yellow-400 font-bold">{template.name}</h3>
                      <p className="text-sm text-cyan-300 mt-1">{template.description}</p>
                      <div className="text-xs text-cyan-500 mt-2">
                        {template.levels.length} levels • Difficulty {template.difficulty}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="border border-cyan-400 p-4 space-y-4">
              <h2 className="text-xl text-yellow-400 font-semibold">CAMPAIGN INFORMATION</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">CAMPAIGN NAME *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter campaign name"
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">THEME</label>
                  <select
                    value={formData.theme || 'mixed'}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value as any }))}
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  >
                    {THEME_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">DESCRIPTION *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the campaign theme, story, and objectives"
                  rows={3}
                  className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">OVERALL DIFFICULTY (1-10)</label>
                  <select
                    value={formData.difficulty || 5}
                    onChange={(e) => {
                      const difficulty = parseInt(e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        difficulty,
                        levels: prev.levels?.map(level => ({
                          ...level,
                          difficulty: level.difficulty || difficulty,
                        })) || [],
                      }));
                    }}
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
                  <label className="block text-sm mb-2">TAGS</label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean),
                    }))}
                    placeholder="tag1, tag2, tag3"
                    className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Campaign Levels */}
            <div className="border border-cyan-400 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-yellow-400 font-semibold">CAMPAIGN LEVELS</h2>
                <button
                  type="button"
                  onClick={addLevel}
                  className="border border-yellow-400 px-4 py-2 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
                >
                  ADD LEVEL
                </button>
              </div>

              {formData.levels?.length === 0 ? (
                <div className="text-center py-8 text-cyan-300">
                  No levels defined. Click "ADD LEVEL" to start building your campaign.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.levels?.map((level, index) => (
                    <div key={level.id} className="border border-cyan-400 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg text-yellow-400">Level {index + 1}</h3>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => moveLevel(index, 'up')}
                            disabled={index === 0}
                            className="border border-cyan-400 px-2 py-1 text-cyan-400 hover:bg-cyan-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveLevel(index, 'down')}
                            disabled={index === (formData.levels?.length || 0) - 1}
                            className="border border-cyan-400 px-2 py-1 text-cyan-400 hover:bg-cyan-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeLevel(index)}
                            className="border border-red-400 px-2 py-1 text-red-400 hover:bg-red-400 hover:text-white"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2">LEVEL NAME</label>
                          <input
                            type="text"
                            value={level.name}
                            onChange={(e) => updateLevel(index, { name: e.target.value })}
                            className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-2">DIFFICULTY</label>
                          <select
                            value={level.difficulty}
                            onChange={(e) => updateLevel(index, { difficulty: parseInt(e.target.value) })}
                            className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                          >
                            {DIFFICULTY_LEVELS.map(diff => (
                              <option key={diff.value} value={diff.value}>
                                {diff.value} - {diff.description}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm mb-2">ESTIMATED DURATION (minutes)</label>
                          <input
                            type="number"
                            value={level.estimatedDuration}
                            onChange={(e) => updateLevel(index, { estimatedDuration: parseInt(e.target.value) })}
                            min="5"
                            max="120"
                            className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-2">GAME FLOW ID</label>
                          <input
                            type="text"
                            value={level.gameFlowId}
                            onChange={(e) => updateLevel(index, { gameFlowId: e.target.value })}
                            placeholder="Enter game flow ID"
                            className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm mb-2">DESCRIPTION</label>
                        <textarea
                          value={level.description}
                          onChange={(e) => updateLevel(index, { description: e.target.value })}
                          placeholder="Describe this level's objectives and atmosphere"
                          rows={2}
                          className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm mb-2">OBJECTIVES (one per line)</label>
                        <textarea
                          value={level.objectives.join('\n')}
                          onChange={(e) => updateLevel(index, { objectives: e.target.value.split('\n').filter(Boolean) })}
                          placeholder={`Objective 1\nObjective 2\nObjective 3`}
                          rows={3}
                          className="w-full bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campaign Summary */}
            {formData.levels && formData.levels.length > 0 && (
              <div className="border border-yellow-400 p-4 bg-yellow-900/20">
                <h2 className="text-xl text-yellow-400 font-semibold mb-4">CAMPAIGN SUMMARY</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-cyan-300">Total Levels:</span>
                    <span className="text-yellow-400 font-bold ml-2">{formData.levels.length}</span>
                  </div>
                  <div>
                    <span className="text-cyan-300">Total Duration:</span>
                    <span className="text-yellow-400 font-bold ml-2">
                      {formData.levels.reduce((total, level) => total + level.estimatedDuration, 0)} minutes
                    </span>
                  </div>
                  <div>
                    <span className="text-cyan-300">Average Difficulty:</span>
                    <span className="text-yellow-400 font-bold ml-2">
                      {formData.levels && formData.levels.length > 0
                        ? Math.round(formData.levels.reduce((total, level) => total + level.difficulty, 0) / formData.levels.length)
                        : 0
                      }/10
                    </span>
                  </div>
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
                onClick={() => router.push('/admin/campaigns')}
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
                  {loading ? 'SAVING...' : mode === 'create' ? 'CREATE CAMPAIGN' : 'UPDATE CAMPAIGN'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}