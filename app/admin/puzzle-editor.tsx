'use client';

import { useState } from 'react';
import type { GameSession, GreekWord } from '@/lib/gameSession';
import { DEFAULT_GREEK_WORDS, DEFAULT_MORSE_WORDS, DEFAULT_MAX_MORSE_ATTEMPTS, DEFAULT_MAX_MEANING_ATTEMPTS, DEFAULT_OXYGEN_MINUTES } from '@/lib/gameSession';

type PuzzleEditorProps = {
  session: GameSession;
  onClose: () => void;
  onSave: () => void;
  adminId: string;
};

export default function PuzzleEditor({ session, onClose, onSave, adminId }: PuzzleEditorProps) {
  const [morseWords, setMorseWords] = useState<string[]>(session.customMorseWords || [...DEFAULT_MORSE_WORDS]);
  const [greekWords, setGreekWords] = useState<GreekWord[]>(session.customGreekWords || [...DEFAULT_GREEK_WORDS]);
  const [maxMorseAttempts, setMaxMorseAttempts] = useState<number>(session.customMaxMorseAttempts ?? DEFAULT_MAX_MORSE_ATTEMPTS);
  const [maxMeaningAttempts, setMaxMeaningAttempts] = useState<number>(session.customMaxMeaningAttempts ?? DEFAULT_MAX_MEANING_ATTEMPTS);
  const [oxygenMinutes, setOxygenMinutes] = useState<number>(session.customOxygenMinutes ?? DEFAULT_OXYGEN_MINUTES);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const normalizeMorseWords = (words: string[]) => words.map((w) => w.trim().toUpperCase()).filter(Boolean);

  const normalizeGreekWords = (words: GreekWord[]) =>
    words
      .map((w) => ({ word: w.word.trim().toUpperCase(), meaning: w.meaning.trim() }))
      .filter((w) => w.word.length > 0 && w.meaning.length > 0);

  const arraysEqual = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

  const greekEqual = (a: GreekWord[], b: GreekWord[]) =>
    a.length === b.length && a.every((v, i) => v.word === b[i].word && v.meaning === b[i].meaning);

  const handleSave = async () => {
    const normalizedMorse = normalizeMorseWords(morseWords);
    const normalizedGreek = normalizeGreekWords(greekWords);

    if (normalizedMorse.length < 1) {
      setError('Provide at least 1 morse word');
      return;
    }

    if (normalizedMorse.some((w) => w.length > 20)) {
      setError('Morse words must be 20 characters or less');
      return;
    }

    if (normalizedGreek.length < 4) {
      setError('Provide at least 4 Greek words for multiple-choice options');
      return;
    }

    const morseAttempts = Math.floor(maxMorseAttempts);
    const meaningAttempts = Math.floor(maxMeaningAttempts);
    const oxygen = Math.floor(oxygenMinutes);

    if (!Number.isFinite(morseAttempts) || morseAttempts < 1 || morseAttempts > 20) {
      setError('Max Morse attempts must be between 1 and 20');
      return;
    }

    if (!Number.isFinite(meaningAttempts) || meaningAttempts < 1 || meaningAttempts > 20) {
      setError('Max Meaning attempts must be between 1 and 20');
      return;
    }

    if (!Number.isFinite(oxygen) || oxygen < 1 || oxygen > 240) {
      setError('Oxygen timer must be between 1 and 240 minutes');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/admin/update-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId,
          sessionId: session.id,
          customMorseWords: arraysEqual(normalizedMorse, DEFAULT_MORSE_WORDS) ? null : normalizedMorse,
          customGreekWords: greekEqual(normalizedGreek, DEFAULT_GREEK_WORDS) ? null : normalizedGreek,
          customMaxMorseAttempts: morseAttempts === DEFAULT_MAX_MORSE_ATTEMPTS ? null : morseAttempts,
          customMaxMeaningAttempts: meaningAttempts === DEFAULT_MAX_MEANING_ATTEMPTS ? null : meaningAttempts,
          customOxygenMinutes: oxygen === DEFAULT_OXYGEN_MINUTES ? null : oxygen,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save puzzle settings');
      }

      onSave();
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddMorseWord = () => {
    setMorseWords([...morseWords, '']);
  };

  const handleRemoveMorseWord = (index: number) => {
    if (morseWords.length <= 1) return;
    setMorseWords(morseWords.filter((_, i) => i !== index));
  };

  const handleUpdateMorseWord = (index: number, value: string) => {
    const updated = [...morseWords];
    updated[index] = value.toUpperCase();
    setMorseWords(updated);
  };

  const handleAddGreekWord = () => {
    setGreekWords([...greekWords, { word: '', meaning: '' }]);
  };

  const handleRemoveGreekWord = (index: number) => {
    if (greekWords.length <= 1) return;
    setGreekWords(greekWords.filter((_, i) => i !== index));
  };

  const handleUpdateGreekWord = (index: number, field: 'word' | 'meaning', value: string) => {
    const updated = [...greekWords];
    updated[index] = { ...updated[index], [field]: field === 'word' ? value.toUpperCase() : value };
    setGreekWords(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="bg-black border-2 border-yellow-400 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-[0_0_30px_rgba(255,255,0,0.5)]">
        <div className="flex justify-between items-center border-b border-yellow-400 pb-4">
          <div className="text-2xl font-bold text-yellow-400">PUZZLE EDITOR: {session.gameCode}</div>
          <button onClick={onClose} className="text-red-500 hover:text-red-400 text-xl">
            [X]
          </button>
        </div>

        {error && (
          <div className="border border-red-500 p-3 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="border border-cyan-400 p-4 space-y-4">
            <div className="text-xl font-bold text-cyan-400">MORSE CODE WORDS</div>
            <div className="space-y-2">
              {morseWords.map((word, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => handleUpdateMorseWord(index, e.target.value)}
                    className="flex-1 bg-black border border-cyan-400 px-3 py-2 text-cyan-400 uppercase focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                    placeholder="MORSE WORD"
                  />
                  <button
                    onClick={() => handleRemoveMorseWord(index)}
                    disabled={morseWords.length <= 1}
                    className={`border px-3 py-2 ${morseWords.length <= 1 ? 'border-gray-600 text-gray-600 cursor-not-allowed' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black'}`}
                  >
                    [REMOVE]
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddMorseWord}
              className="border border-green-400 px-4 py-2 text-green-400 hover:bg-green-400 hover:text-black transition-all w-full"
            >
              [+ ADD MORSE WORD]
            </button>
          </div>

          <div className="border border-cyan-400 p-4 space-y-4">
            <div className="text-xl font-bold text-cyan-400">GREEK WORDS & MEANINGS</div>
            <div className="space-y-3">
              {greekWords.map((greek, index) => (
                <div key={index} className="border border-cyan-600 p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={greek.word}
                      onChange={(e) => handleUpdateGreekWord(index, 'word', e.target.value)}
                      className="flex-1 bg-black border border-cyan-400 px-3 py-2 text-cyan-400 uppercase focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                      placeholder="GREEK WORD"
                    />
                    <button
                      onClick={() => handleRemoveGreekWord(index)}
                      disabled={greekWords.length <= 1}
                      className={`border px-3 py-2 ${greekWords.length <= 1 ? 'border-gray-600 text-gray-600 cursor-not-allowed' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black'}`}
                    >
                      [REMOVE]
                    </button>
                  </div>
                  <input
                    type="text"
                    value={greek.meaning}
                    onChange={(e) => handleUpdateGreekWord(index, 'meaning', e.target.value)}
                    className="w-full bg-black border border-cyan-400 px-3 py-2 text-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                    placeholder="Meaning (e.g., word, reason, principle)"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleAddGreekWord}
              className="border border-green-400 px-4 py-2 text-green-400 hover:bg-green-400 hover:text-black transition-all w-full"
            >
              [+ ADD GREEK WORD]
            </button>
          </div>

          <div className="border border-cyan-400 p-4 space-y-4">
            <div className="text-xl font-bold text-cyan-400">ATTEMPT LIMITS</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm opacity-70">Max Morse Attempts</div>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={maxMorseAttempts}
                  onChange={(e) => setMaxMorseAttempts(parseInt(e.target.value) || 1)}
                  className="w-full bg-black border border-cyan-400 px-3 py-2 text-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm opacity-70">Max Meaning Attempts</div>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={maxMeaningAttempts}
                  onChange={(e) => setMaxMeaningAttempts(parseInt(e.target.value) || 1)}
                  className="w-full bg-black border border-cyan-400 px-3 py-2 text-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                />
              </div>
            </div>
          </div>

          <div className="border border-cyan-400 p-4 space-y-4">
            <div className="text-xl font-bold text-cyan-400">OXYGEN TIMER</div>
            <div className="space-y-2">
              <div className="text-sm opacity-70">Duration (minutes)</div>
              <input
                type="number"
                min="1"
                max="999"
                value={oxygenMinutes}
                onChange={(e) => setOxygenMinutes(parseInt(e.target.value) || 1)}
                className="w-full bg-black border border-cyan-400 px-3 py-2 text-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-yellow-400">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 border-2 border-green-400 px-8 py-3 font-bold text-green-400 hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'SAVING...' : '[SAVE CHANGES]'}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="border border-red-500 px-8 py-3 text-red-500 hover:bg-red-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            [CANCEL]
          </button>
        </div>
      </div>
    </div>
  );
}
