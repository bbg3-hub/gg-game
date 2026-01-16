'use client';

import { Question } from '@/lib/gameSession';
import { useState, useEffect, useCallback } from 'react';

interface QuestionRendererProps {
  question: Question;
  onSubmit: (answer: string) => Promise<{ correct: boolean; feedback?: string }>;
  attempts: number;
  completed: boolean;
}

export default function QuestionRenderer({ question, onSubmit, attempts, completed }: QuestionRendererProps) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(question.timeLimit || null);
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || completed) return;
    if (!answer.trim() && question.type !== 'multiple-choice') return;

    setIsSubmitting(true);
    try {
      const result = await onSubmit(answer);
      setFeedback(result.correct ? 'Correct!' : result.feedback || 'Incorrect, try again.');
      if (result.correct) {
        setAnswer('');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, completed, answer, question.type, onSubmit]);

  useEffect(() => {
    if (!question.timeLimit || completed) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question.timeLimit, completed]);

  useEffect(() => {
    if (timeLeft === 0 && !completed) {
      handleSubmit();
    }
  }, [timeLeft, completed, handleSubmit]);

  const showHint = () => {
    if (!question.hints || hintsUsed >= question.hints.length) return;
    setHintsUsed(hintsUsed + 1);
  };

  const attemptsRemaining = question.maxAttempts ? question.maxAttempts - attempts : null;

  if (completed) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded p-6">
        <div className="text-green-400 font-bold text-xl mb-2">✓ Completed</div>
        <div className="text-gray-300">{question.title}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-cyan-700 rounded p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">{question.title}</h3>
          {question.content && <p className="text-gray-300 mb-4 whitespace-pre-wrap">{question.content}</p>}
        </div>
        <div className="text-right">
          <div className="text-cyan-400 font-bold">{question.points} pts</div>
          <div className="text-xs text-gray-500">{question.difficulty}</div>
        </div>
      </div>

      {timeLeft !== null && (
        <div className="bg-red-900/20 border border-red-700 rounded p-3">
          <div className="text-red-400 font-mono">
            Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
      )}

      {attemptsRemaining !== null && (
        <div className="text-sm text-gray-400">
          Attempts remaining: {attemptsRemaining} / {question.maxAttempts}
        </div>
      )}

      {hintsUsed > 0 && question.hints && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3 space-y-2">
          {question.hints.slice(0, hintsUsed).map((hint, idx) => (
            <div key={idx} className="text-yellow-400 text-sm">
              💡 Hint {idx + 1}: {hint}
            </div>
          ))}
        </div>
      )}

      {question.type === 'text' && (
        <div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white font-mono"
            placeholder="Type your answer..."
            disabled={isSubmitting || (attemptsRemaining !== null && attemptsRemaining <= 0)}
          />
        </div>
      )}

      {question.type === 'open-response' && (
        <div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white font-mono h-32"
            placeholder="Type your response..."
            disabled={isSubmitting || (attemptsRemaining !== null && attemptsRemaining <= 0)}
          />
        </div>
      )}

      {question.type === 'multiple-choice' && question.options && (
        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAnswer(option.text);
                onSubmit(option.text);
              }}
              className="w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-600 rounded px-4 py-3 text-white transition-colors"
              disabled={isSubmitting || (attemptsRemaining !== null && attemptsRemaining <= 0)}
            >
              {String.fromCharCode(65 + idx)}. {option.text}
            </button>
          ))}
        </div>
      )}

      {feedback && (
        <div
          className={`border rounded p-3 ${
            feedback.includes('Correct') ? 'bg-green-900/20 border-green-700 text-green-400' : 'bg-red-900/20 border-red-700 text-red-400'
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="flex gap-2">
        {question.type !== 'multiple-choice' && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim() || (attemptsRemaining !== null && attemptsRemaining <= 0)}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded font-mono font-bold"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        )}

        {question.hints && hintsUsed < question.hints.length && (
          <button
            onClick={showHint}
            className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white rounded font-mono"
          >
            Use Hint ({hintsUsed}/{question.hints.length})
          </button>
        )}
      </div>
    </div>
  );
}
