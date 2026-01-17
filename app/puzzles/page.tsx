'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { EducationalPuzzle, PuzzleCategory, EDUCATIONAL_PUZZLES } from '@/lib/educationalPuzzles';
import { PUZZLE_CATEGORIES, DIFFICULTY_LEVELS, getCategoryInfo, getDifficultyInfo, filterPuzzles, shuffleArray } from '@/lib/puzzleCategories';

export default function PublicPuzzleLibrary() {
  const [selectedCategories, setSelectedCategories] = useState<PuzzleCategory[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPuzzle, setExpandedPuzzle] = useState<string | null>(null);
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set());
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState<{ correct: boolean; message: string } | null>(null);

  const allPuzzles = useMemo(() => {
    return shuffleArray([...EDUCATIONAL_PUZZLES]).slice(0, 50);
  }, []);

  const filteredPuzzles = useMemo(() => {
    const puzzles = filterPuzzles(allPuzzles, {
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      difficulties: selectedDifficulties.length > 0 ? selectedDifficulties as ('easy' | 'medium' | 'hard')[] : undefined,
      search: searchQuery || undefined,
    });
    return puzzles;
  }, [allPuzzles, selectedCategories, selectedDifficulties, searchQuery]);

  const toggleCategory = (category: PuzzleCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleCheckAnswer = (puzzle: EducationalPuzzle) => {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = puzzle.solution.toLowerCase();
    
    // Check for partial matches or key number matches
    const isCorrect = userAnswer === correctAnswer || 
                      userAnswer.includes(correctAnswer) ||
                      correctAnswer.includes(userAnswer);
    
    if (isCorrect) {
      setSolvedPuzzles(prev => new Set([...prev, puzzle.id]));
      setShowResult({ correct: true, message: '✅ Correct! Well done!' });
    } else {
      setShowResult({ correct: false, message: '❌ Not quite. Try again!' });
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-2 border-cyan-400 p-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <div className="text-3xl font-bold text-cyan-400">🧩 PUZZLE CHALLENGE</div>
              <div className="text-sm opacity-70">Practice real-world problem solving</div>
            </div>
            <Link
              href="/"
              className="border border-cyan-400 px-6 py-3 font-bold hover:bg-cyan-400 hover:text-black transition-all"
            >
              ← BACK TO HOME
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="border border-gray-800 p-4 flex flex-wrap gap-6 text-sm">
          <div className="text-yellow-400">
            Total Puzzles: <span className="font-bold">{filteredPuzzles.length}</span>
          </div>
          <div className="text-green-400">
            Solved: <span className="font-bold">{solvedPuzzles.size}</span>
          </div>
          <div className="text-purple-400">
            Categories: <span className="font-bold">{selectedCategories.length || 'All'}</span>
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
            {selectedCategories.length > 0 || selectedDifficulties.length > 0 || searchQuery && (
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
        </div>

        {/* Puzzle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPuzzles.map((puzzle) => {
            const categoryInfo = getCategoryInfo(puzzle.category);
            const difficultyInfo = getDifficultyInfo(puzzle.difficulty);
            const isExpanded = expandedPuzzle === puzzle.id;
            const isSolved = solvedPuzzles.has(puzzle.id);

            return (
              <div
                key={puzzle.id}
                className={`border-2 p-4 transition-all ${
                  isSolved
                    ? 'border-green-400 bg-green-900/20'
                    : 'border-cyan-400 hover:border-yellow-400'
                }`}
              >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{categoryInfo?.icon}</span>
                      <div>
                        <span className="font-bold text-cyan-300">{puzzle.title}</span>
                        <div className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${difficultyInfo.bg} ${difficultyInfo.color}`}>
                          {difficultyInfo.name}
                        </div>
                      </div>
                    </div>
                    {isSolved && <span className="text-green-400 text-xl">✅</span>}
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
                      <div className="bg-gray-900 p-4 rounded">
                        <div className="text-xs text-gray-400 mb-1">Problem</div>
                        <div className="text-sm mb-2">{puzzle.problem}</div>
                        
                        {puzzle.formula && (
                          <>
                            <div className="text-xs text-gray-400 mb-1">Formula</div>
                            <div className="font-mono text-cyan-300 text-sm mb-2">{puzzle.formula}</div>
                          </>
                        )}
                      </div>

                      {/* Interactive Answer Section */}
                      {!isSolved && (
                        <div className="bg-gray-900 p-4 rounded space-y-3">
                          <div className="text-xs text-gray-400">Your Answer</div>
                          <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer..."
                            className="w-full bg-black border border-cyan-400 rounded px-4 py-2 focus:outline-none"
                          />
                          {showResult && (
                            <div className={`text-sm ${showResult.correct ? 'text-green-400' : 'text-red-400'}`}>
                              {showResult.message}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCheckAnswer(puzzle)}
                              disabled={!answer.trim()}
                              className={`px-4 py-2 rounded font-bold transition-all ${
                                answer.trim()
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              Check Answer
                            </button>
                            <button
                              onClick={() => {
                                setAnswer('');
                                setShowResult(null);
                              }}
                              className="px-4 py-2 border border-gray-600 rounded hover:border-gray-400 transition-all"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}

                      {isSolved && (
                        <div className="bg-green-900 p-4 rounded">
                          <div className="text-green-400 font-bold mb-2">✅ Solved!</div>
                          <div className="text-sm">
                            <span className="text-gray-400">Solution: </span>
                            <span className="font-mono">{puzzle.solution}</span>
                          </div>
                        </div>
                      )}

                      {puzzle.steps && puzzle.steps.length > 0 && (
                        <div className="bg-gray-900 p-4 rounded">
                          <div className="text-xs text-gray-400 mb-2">Solution Steps</div>
                          <ol className="text-sm space-y-1">
                            {puzzle.steps.map((step, i) => (
                              <li key={i} className="ml-4 list-decimal">{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <div className="bg-cyan-900 p-4 rounded">
                        <div className="text-xs text-cyan-400 mb-1">Explanation</div>
                        <div className="text-sm">{puzzle.explanation}</div>
                      </div>

                      {puzzle.tips && puzzle.tips.length > 0 && (
                        <div className="bg-yellow-900 p-4 rounded">
                          <div className="text-xs text-yellow-400 mb-1">💡 Tips</div>
                          <ul className="text-sm space-y-1">
                            {puzzle.tips.map((tip, i) => (
                              <li key={i} className="ml-4 list-disc">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setExpandedPuzzle(isExpanded ? null : puzzle.id);
                        setAnswer('');
                        setShowResult(null);
                      }}
                      className="px-3 py-1 text-xs border border-cyan-400 hover:bg-cyan-900 transition-all"
                    >
                      {isExpanded ? 'Show Less' : 'Try It'}
                    </button>
                  </div>
              </div>
            );
          })}
        </div>

        {filteredPuzzles.length === 0 && (
          <div className="text-center py-20 border-2 border-gray-700 p-6">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-xl text-gray-400">No puzzles found</div>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 border border-cyan-400 hover:bg-cyan-900 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm opacity-50 py-4">
          Educational Puzzle Challenge - Practice real-world problem solving
        </div>
      </div>
    </div>
  );
}
