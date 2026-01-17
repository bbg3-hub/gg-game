'use client';

import { useState, useMemo } from 'react';
import { EducationalPuzzle, PuzzleCategory } from '@/lib/educationalPuzzles';
import {
  PUZZLE_CATEGORIES,
  DIFFICULTY_LEVELS,
  getCategoryInfo,
  getDifficultyInfo,
  filterPuzzles,
  shuffleArray,
} from '@/lib/puzzleCategories';

import { DifficultyLevel } from '@/lib/puzzleCategories';

interface PuzzleLibraryBrowserProps {
  onSelectPuzzle?: (puzzle: EducationalPuzzle) => void;
  onAddToGame?: (puzzles: EducationalPuzzle[]) => void;
  multiSelect?: boolean;
}

export default function PuzzleLibraryBrowser({
  onSelectPuzzle,
  onAddToGame,
  multiSelect = false,
}: PuzzleLibraryBrowserProps) {
  const [selectedCategories, setSelectedCategories] = useState<PuzzleCategory[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<DifficultyLevel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPuzzles, setSelectedPuzzles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedPuzzle, setExpandedPuzzle] = useState<string | null>(null);
  const [shuffledPuzzles, setShuffledPuzzles] = useState<EducationalPuzzle[]>([]);

  const filteredPuzzles = useMemo(() => {
    let puzzles = filterPuzzles(shuffledPuzzles.length > 0 ? shuffledPuzzles : [], {
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      difficulties: selectedDifficulties.length > 0 ? selectedDifficulties as DifficultyLevel[] : undefined,
      search: searchQuery || undefined,
    });
    
    if (puzzles.length === 0 && shuffledPuzzles.length === 0) {
      import('@/lib/educationalPuzzles').then((module) => {
        setShuffledPuzzles(shuffleArray(module.EDUCATIONAL_PUZZLES));
      });
      puzzles = [];
    }
    
    return puzzles;
  }, [selectedCategories, selectedDifficulties, searchQuery, shuffledPuzzles]);

  const toggleCategory = (category: PuzzleCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleDifficulty = (difficulty: DifficultyLevel) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const togglePuzzleSelection = (puzzleId: string) => {
    if (!multiSelect) {
      setSelectedPuzzles(new Set([puzzleId]));
      const puzzle = filteredPuzzles.find(p => p.id === puzzleId);
      if (puzzle && onSelectPuzzle) {
        onSelectPuzzle(puzzle);
      }
    } else {
      setSelectedPuzzles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(puzzleId)) {
          newSet.delete(puzzleId);
        } else {
          newSet.add(puzzleId);
        }
        return newSet;
      });
    }
  };

  const handleAddSelectedToGame = () => {
    if (onAddToGame && selectedPuzzles.size > 0) {
      const selected = filteredPuzzles.filter(p => selectedPuzzles.has(p.id));
      onAddToGame(selected);
      setSelectedPuzzles(new Set());
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedDifficulties.length > 0 || searchQuery;

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-2 border-yellow-400 p-6 shadow-[0_0_20px_rgba(255,255,0,0.5)]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <div className="text-3xl font-bold text-yellow-400">EDUCATIONAL PUZZLE LIBRARY</div>
              <div className="text-sm opacity-70">200+ Real-World Problems</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 border transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyan-400 text-black'
                    : 'border-cyan-400 hover:bg-cyan-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 border transition-all ${
                  viewMode === 'list'
                    ? 'bg-cyan-400 text-black'
                    : 'border-cyan-400 hover:bg-cyan-900'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-2 border-cyan-400 p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search puzzles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-cyan-400 focus:outline-none"
            />
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-red-500 text-red-400 hover:bg-red-500 hover:text-black transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div>
            <div className="text-sm font-bold text-cyan-300 mb-2">Categories</div>
            <div className="flex flex-wrap gap-2">
              {PUZZLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-900 border border-gray-700 hover:border-cyan-400'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filters */}
          <div>
            <div className="text-sm font-bold text-cyan-300 mb-2">Difficulty</div>
            <div className="flex gap-2">
              {DIFFICULTY_LEVELS.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => toggleDifficulty(diff.id)}
                  className={`px-4 py-1 rounded text-sm transition-all ${
                    selectedDifficulties.includes(diff.id)
                      ? `${diff.bg} text-white`
                      : 'bg-gray-900 border border-gray-700 hover:border-cyan-400'
                  }`}
                >
                  {diff.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="text-sm opacity-70">
            Showing {filteredPuzzles.length} puzzles
            {selectedCategories.length > 0 && (
              <span> in {selectedCategories.length} category(s)</span>
            )}
          </div>
        </div>

        {/* Multi-select Actions */}
        {multiSelect && selectedPuzzles.size > 0 && (
          <div className="border-2 border-green-400 p-4 flex justify-between items-center">
            <span className="text-green-400">{selectedPuzzles.size} puzzle(s) selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPuzzles(new Set())}
                className="px-4 py-2 border border-gray-500 hover:border-gray-400 transition-all"
              >
                Clear Selection
              </button>
              <button
                onClick={handleAddSelectedToGame}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-all"
              >
                Add to Game
              </button>
            </div>
          </div>
        )}

        {/* Puzzle Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredPuzzles.map((puzzle) => {
            const categoryInfo = getCategoryInfo(puzzle.category);
            const difficultyInfo = getDifficultyInfo(puzzle.difficulty);
            const isExpanded = expandedPuzzle === puzzle.id;
            const isSelected = selectedPuzzles.has(puzzle.id);

            return (
              <div
                key={puzzle.id}
                className={`border-2 p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]'
                    : 'border-cyan-400 hover:border-yellow-400'
                } ${viewMode === 'list' ? 'flex gap-4' : ''}`}
                onClick={() => togglePuzzleSelection(puzzle.id)}
              >
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{categoryInfo?.icon}</span>
                        <span className="font-bold text-cyan-300">{puzzle.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${difficultyInfo.bg} ${difficultyInfo.color}`}>
                        {difficultyInfo.name}
                      </span>
                    </div>
                    {multiSelect && (
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'bg-green-500 border-green-500' : 'border-gray-500'
                      }`}>
                        {isSelected && <span className="text-black">✓</span>}
                      </div>
                    )}
                  </div>

                  {/* Real World Context */}
                  <div className="text-xs text-yellow-400 mb-2">
                    📍 {puzzle.realWorldContext}
                  </div>

                  {/* Problem (collapsed) */}
                  {!isExpanded && (
                    <p className="text-sm opacity-80 line-clamp-2">{puzzle.problem}</p>
                  )}

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="space-y-4 mt-4">
                      <div className="bg-gray-900 p-3 rounded">
                        <div className="text-xs text-gray-400 mb-1">Problem</div>
                        <div className="text-sm">{puzzle.problem}</div>
                      </div>

                      {puzzle.formula && (
                        <div className="bg-gray-900 p-3 rounded">
                          <div className="text-xs text-gray-400 mb-1">Formula</div>
                          <div className="text-sm font-mono text-cyan-300">{puzzle.formula}</div>
                          {puzzle.formulaExplanation && (
                            <div className="text-xs text-gray-400 mt-1">{puzzle.formulaExplanation}</div>
                          )}
                        </div>
                      )}

                      {puzzle.steps && puzzle.steps.length > 0 && (
                        <div className="bg-gray-900 p-3 rounded">
                          <div className="text-xs text-gray-400 mb-1">Steps</div>
                          <ol className="text-sm space-y-1">
                            {puzzle.steps.map((step, i) => (
                              <li key={i} className="ml-4 list-decimal">{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <div className="bg-green-900 p-3 rounded">
                        <div className="text-xs text-green-400 mb-1">Solution</div>
                        <div className="text-sm font-bold text-green-300">{puzzle.solution}</div>
                      </div>

                      <div className="bg-gray-900 p-3 rounded">
                        <div className="text-xs text-gray-400 mb-1">Explanation</div>
                        <div className="text-sm">{puzzle.explanation}</div>
                      </div>

                      {puzzle.tips && puzzle.tips.length > 0 && (
                        <div className="bg-yellow-900 p-3 rounded">
                          <div className="text-xs text-yellow-400 mb-1">💡 Tips</div>
                          <ul className="text-sm space-y-1">
                            {puzzle.tips.map((tip, i) => (
                              <li key={i} className="ml-4 list-disc">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {puzzle.realWorldUse && (
                        <div className="bg-cyan-900 p-3 rounded">
                          <div className="text-xs text-cyan-400 mb-1">🌍 Real World Use</div>
                          <div className="text-sm">{puzzle.realWorldUse}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPuzzle(isExpanded ? null : puzzle.id);
                      }}
                      className="px-3 py-1 text-xs border border-cyan-400 hover:bg-cyan-900 transition-all"
                    >
                      {isExpanded ? 'Show Less' : 'Show Details'}
                    </button>
                    {onSelectPuzzle && !multiSelect && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPuzzle(puzzle);
                        }}
                        className="px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 transition-all"
                      >
                        Use This Puzzle
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPuzzles.length === 0 && (
          <div className="text-center py-20 border-2 border-gray-700 p-6">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-xl text-gray-400">No puzzles found</div>
            <div className="text-sm text-gray-500 mt-2">Try adjusting your filters or search query</div>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 border border-cyan-400 hover:bg-cyan-900 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
