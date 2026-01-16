'use client';

import { Question, QuestionOption } from '@/lib/gameSession';
import { useState } from 'react';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function QuestionEditor({ question, onUpdate, onDelete, onClose }: QuestionEditorProps) {
  const [localQuestion, setLocalQuestion] = useState<Question>(question);

  const handleChange = (field: keyof Question, value: string | number | QuestionOption[] | string[] | undefined) => {
    setLocalQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(localQuestion);
    onClose();
  };

  const addOption = () => {
    const newOption: QuestionOption = { text: '', isCorrect: false };
    handleChange('options', [...(localQuestion.options || []), newOption]);
  };

  const updateOption = (index: number, updates: Partial<QuestionOption>) => {
    const options = [...(localQuestion.options || [])];
    options[index] = { ...options[index], ...updates };
    handleChange('options', options);
  };

  const removeOption = (index: number) => {
    const options = [...(localQuestion.options || [])];
    options.splice(index, 1);
    handleChange('options', options);
  };

  const addHint = () => {
    handleChange('hints', [...(localQuestion.hints || []), '']);
  };

  const updateHint = (index: number, value: string) => {
    const hints = [...(localQuestion.hints || [])];
    hints[index] = value;
    handleChange('hints', hints);
  };

  const removeHint = (index: number) => {
    const hints = [...(localQuestion.hints || [])];
    hints.splice(index, 1);
    handleChange('hints', hints);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-cyan-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-cyan-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-400">Edit Question</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-cyan-400 mb-2">Title</label>
            <input
              type="text"
              value={localQuestion.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="Question title"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-cyan-400 mb-2">Type</label>
            <select
              value={localQuestion.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            >
              <option value="text">Text Answer</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="open-response">Open Response</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-cyan-400 mb-2">Content</label>
            <textarea
              value={localQuestion.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white h-32"
              placeholder="Question content/description"
            />
          </div>

          {localQuestion.type === 'multiple-choice' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-cyan-400">Options</label>
                <button
                  onClick={addOption}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm"
                >
                  + Add Option
                </button>
              </div>
              <div className="space-y-2">
                {(localQuestion.options || []).map((option, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) => updateOption(idx, { isCorrect: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => updateOption(idx, { text: e.target.value })}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                      placeholder={`Option ${idx + 1}`}
                    />
                    <button
                      onClick={() => removeOption(idx)}
                      className="px-3 py-2 bg-red-900 hover:bg-red-800 text-white rounded"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-cyan-400 mb-2">Solution/Correct Answer</label>
            <input
              type="text"
              value={localQuestion.solution}
              onChange={(e) => handleChange('solution', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="The correct answer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">Difficulty</label>
              <select
                value={localQuestion.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">Points</label>
              <input
                type="number"
                value={localQuestion.points}
                onChange={(e) => handleChange('points', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">Time Limit (seconds)</label>
              <input
                type="number"
                value={localQuestion.timeLimit || ''}
                onChange={(e) => handleChange('timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Optional"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">Max Attempts</label>
              <input
                type="number"
                value={localQuestion.maxAttempts || ''}
                onChange={(e) => handleChange('maxAttempts', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Optional"
                min="1"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-cyan-400">Hints</label>
              <button
                onClick={addHint}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm"
              >
                + Add Hint
              </button>
            </div>
            <div className="space-y-2">
              {(localQuestion.hints || []).map((hint, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-gray-400 text-sm w-16">Hint {idx + 1}</span>
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => updateHint(idx, e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder={`Hint ${idx + 1}`}
                  />
                  <button
                    onClick={() => removeHint(idx)}
                    className="px-3 py-2 bg-red-900 hover:bg-red-800 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-900 border-t border-cyan-700 p-6 flex justify-between gap-4">
          <button
            onClick={onDelete}
            className="px-6 py-2 bg-red-900 hover:bg-red-800 text-white rounded font-mono"
          >
            Delete Question
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-mono"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-mono"
            >
              Save Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
