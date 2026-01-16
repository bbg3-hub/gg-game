'use client';

import { useState } from 'react';
import { Player, GameSession } from '@/lib/gameSession';
import QuestionRenderer from './QuestionRenderer';

interface DynamicGamePlayerProps {
  player: Player;
  session: Pick<GameSession, 'phases' | 'title' | 'description'>;
  playerToken: string;
  timeRemaining: number;
}

export default function DynamicGamePlayer({ player, session, playerToken, timeRemaining }: DynamicGamePlayerProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(player.currentPhaseIndex || 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(player.currentQuestionIndex || 0);

  const phases = session.phases || [];
  const currentPhase = phases[currentPhaseIndex];
  const currentQuestion = currentPhase?.questions[currentQuestionIndex];

  const getQuestionProgress = (questionId: string) => {
    return player.questionProgress?.find((p) => p.questionId === questionId);
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (!currentQuestion) return { correct: false };

    try {
      const response = await fetch('/api/game/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerToken,
          questionId: currentQuestion.id,
          answer,
        }),
      });

      const result = await response.json();

      if (result.completed && result.correct) {
        setTimeout(() => {
          if (currentQuestionIndex + 1 < currentPhase.questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else if (currentPhaseIndex + 1 < phases.length) {
            setCurrentPhaseIndex(currentPhaseIndex + 1);
            setCurrentQuestionIndex(0);
          }
        }, 1500);
      }

      return result;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      return { correct: false, feedback: 'Network error' };
    }
  };

  const calculateProgress = () => {
    let totalQuestions = 0;
    let completedQuestions = 0;

    phases.forEach((phase) => {
      totalQuestions += phase.questions.length;
      phase.questions.forEach((q) => {
        const progress = getQuestionProgress(q.id);
        if (progress?.completed) completedQuestions++;
      });
    });

    return totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
  };

  const allQuestionsCompleted = () => {
    return phases.every((phase) =>
      phase.questions.every((q) => {
        const progress = getQuestionProgress(q.id);
        return progress?.completed;
      })
    );
  };

  if (!currentPhase || !currentQuestion) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-cyan-400 mb-4">No questions configured</div>
          <div className="text-gray-400">Contact the game administrator</div>
        </div>
      </div>
    );
  }

  if (allQuestionsCompleted()) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <div className="text-4xl text-green-400 mb-6">🎉 All Questions Completed!</div>
          <div className="text-xl text-gray-300 mb-4">
            Waiting for other players to complete their missions...
          </div>
          <div className="text-cyan-400 font-bold text-2xl">
            Total Score: {player.questionProgress?.reduce((sum, p) => sum + p.score, 0) || 0}
          </div>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const questionProgress = getQuestionProgress(currentQuestion.id);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">{session.title || 'Mission'}</h1>
            {session.description && <p className="text-gray-400">{session.description}</p>}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400 font-mono mb-1">
              {Math.floor(timeRemaining / 60000)}:{Math.floor((timeRemaining % 60000) / 1000).toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-500">OXYGEN REMAINING</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-cyan-400 font-bold">
                Phase {currentPhaseIndex + 1} of {phases.length}:
              </span>
              <span className="text-white ml-2">{currentPhase.name}</span>
            </div>
            <div className="text-gray-400">
              Question {currentQuestionIndex + 1} of {currentPhase.questions.length}
            </div>
          </div>
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{progress}% Complete</div>
        </div>

        {currentPhase.description && (
          <div className="bg-cyan-900/20 border border-cyan-700 rounded p-4 mb-6">
            <div className="text-cyan-400 font-bold mb-1">Phase Objective</div>
            <div className="text-gray-300">{currentPhase.description}</div>
          </div>
        )}

        <QuestionRenderer
          question={currentQuestion}
          onSubmit={handleSubmitAnswer}
          attempts={questionProgress?.attempts || 0}
          completed={questionProgress?.completed || false}
        />

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded p-4">
            <div className="text-cyan-400 font-bold mb-2">Your Progress</div>
            <div className="space-y-1 text-sm">
              {phases.map((phase, idx) => {
                const completed = phase.questions.filter((q) => getQuestionProgress(q.id)?.completed).length;
                const total = phase.questions.length;
                return (
                  <div key={phase.id} className="flex justify-between">
                    <span className={idx === currentPhaseIndex ? 'text-cyan-400' : 'text-gray-400'}>
                      {phase.name}
                    </span>
                    <span className="text-gray-500">
                      {completed}/{total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded p-4">
            <div className="text-cyan-400 font-bold mb-2">Score</div>
            <div className="text-3xl font-bold text-white">
              {player.questionProgress?.reduce((sum, p) => sum + p.score, 0) || 0}
            </div>
            <div className="text-xs text-gray-500">points earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}
