'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { MathMiniGameConfig } from '@/lib/mini-games';

interface MathGameProps {
  config: MathMiniGameConfig;
  onComplete: (score: number, details: Record<string, any>) => void;
  onTimeUpdate?: (timeRemaining: number) => void;
}

interface MathProblem {
  id: string;
  question: string;
  answer: number;
  options?: number[];
  userAnswer?: number;
  isCorrect?: boolean;
}

export default function MathMiniGame({ config, onComplete, onTimeUpdate }: MathGameProps) {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit || 60);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);

  const gameConfig = config.config;
  const { visualTheme } = config;

  // Generate math problems
  const generateProblems = useCallback((): MathProblem[] => {
    const problems: MathProblem[] = [];
    const { operations, numberRange, problemCount } = gameConfig;
    
    for (let i = 0; i < problemCount; i++) {
      let problem: MathProblem = {
        id: `problem-${i}`,
        question: '',
        answer: 0,
      };
      
      if (gameConfig.customProblems && gameConfig.customProblems[i]) {
        // Use custom problem
        const customProblem = gameConfig.customProblems[i];
        problem = {
          id: `problem-${i}`,
          question: customProblem.question,
          answer: customProblem.answer,
          options: customProblem.options,
        };
      } else {
        // Generate random problem
        const operation = operations[Math.floor(Math.random() * operations.length)];
        const num1 = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min;
        const num2 = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min;
        
        switch (operation) {
          case 'addition':
            problem.question = `${num1} + ${num2} = ?`;
            problem.answer = num1 + num2;
            break;
          case 'subtraction':
            // Ensure positive result
            const subNum1 = Math.max(num1, num2);
            const subNum2 = Math.min(num1, num2);
            problem.question = `${subNum1} - ${subNum2} = ?`;
            problem.answer = subNum1 - subNum2;
            break;
          case 'multiplication':
            problem.question = `${num1} × ${num2} = ?`;
            problem.answer = num1 * num2;
            break;
          case 'division':
            // Ensure clean division
            const divisor = Math.max(1, num2);
            const dividend = divisor * (Math.floor(Math.random() * 10) + 1);
            problem.question = `${dividend} ÷ ${divisor} = ?`;
            problem.answer = dividend / divisor;
            break;
          case 'percentage':
            problem.question = `${num1}% of ${num2 * 10} = ?`;
            problem.answer = (num1 / 100) * (num2 * 10);
            break;
          case 'square-root':
            const root = Math.floor(Math.random() * 15) + 1;
            problem.question = `√${root * root} = ?`;
            problem.answer = root;
            break;
        }
        
        // Generate multiple choice options
        if (Math.random() > 0.5) {
          const options = [problem.answer];
          while (options.length < 4) {
            const wrongAnswer = problem.answer + Math.floor(Math.random() * 20) - 10;
            if (wrongAnswer >= 0 && !options.includes(wrongAnswer)) {
              options.push(wrongAnswer);
            }
          }
          problem.options = options.sort(() => Math.random() - 0.5);
        }
      }
      
      problems.push(problem);
    }
    
    return problems;
  }, [gameConfig]);

  // Start game
  const startGame = () => {
    const newProblems = generateProblems();
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalAttempts(0);
    setTimeRemaining(config.timeLimit || 60);
    setStartTime(Date.now());
    setGameState('playing');
  };

  // Handle answer submission
  const handleAnswer = (answer: number) => {
    if (gameState !== 'playing') return;
    
    const currentProblem = problems[currentProblemIndex];
    const isCorrect = answer === currentProblem.answer;
    
    // Update problem with user answer
    const updatedProblems = problems.map((problem, index) =>
      index === currentProblemIndex
        ? { ...problem, userAnswer: answer, isCorrect }
        : problem
    );
    setProblems(updatedProblems);
    
    setTotalAttempts(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      
      // Calculate points
      let points = config.scoringSystem.basePoints;
      
      // Time bonus
      if (config.scoringSystem.timeMultiplier) {
        const timeBonus = Math.max(0, Math.floor(timeRemaining / 10));
        points += timeBonus;
      }
      
      // Difficulty bonus
      if (config.scoringSystem.difficultyBonus) {
        const difficultyBonus = config.difficulty * 2;
        points += difficultyBonus;
      }
      
      setScore(prev => prev + points);
    }
    
    // Move to next problem or finish game
    if (currentProblemIndex < problems.length - 1) {
      setTimeout(() => {
        setCurrentProblemIndex(prev => prev + 1);
      }, 1000);
    } else {
      // Game finished
      setTimeout(() => {
        finishGame();
      }, 1000);
    }
  };

  // Finish game
  const finishGame = () => {
    setGameState('finished');
    
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    const accuracy = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;
    
    onComplete(score, {
      totalProblems: problems.length,
      correctAnswers,
      totalAttempts,
      accuracy,
      totalTime,
      avgTimePerProblem: problems.length > 0 ? totalTime / problems.length : 0,
    });
  };

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (onTimeUpdate) onTimeUpdate(newTime);
          if (newTime <= 0) {
            finishGame();
          }
          return newTime;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState, timeRemaining, onTimeUpdate]);

  const currentProblem = problems[currentProblemIndex];

  if (!currentProblem && problems.length === 0) {
    return (
      <div 
        className="p-6 rounded-lg text-center"
        style={{ backgroundColor: visualTheme.backgroundColor }}
      >
        <div className="text-center">
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: visualTheme.primaryColor }}
          >
            Math Mini-Game
          </h2>
          <p className="mb-4" style={{ color: visualTheme.textColor }}>
            Solve math problems as quickly as you can!
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 rounded font-bold transition-all"
            style={{ 
              backgroundColor: visualTheme.primaryColor,
              color: visualTheme.textColor 
            }}
          >
            START GAME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-6 rounded-lg"
      style={{ backgroundColor: visualTheme.backgroundColor }}
    >
      {/* Game UI */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div 
            className="px-3 py-1 rounded font-bold"
            style={{ 
              backgroundColor: visualTheme.primaryColor,
              color: visualTheme.textColor 
            }}
          >
            Score: {score}
          </div>
          <div 
            className="px-3 py-1 rounded font-bold"
            style={{ 
              backgroundColor: timeRemaining < 10 ? '#DC2626' : visualTheme.secondaryColor,
              color: visualTheme.textColor 
            }}
          >
            Time: {timeRemaining}s
          </div>
          <div 
            className="px-3 py-1 rounded font-bold"
            style={{ 
              backgroundColor: visualTheme.accentColor,
              color: visualTheme.textColor 
            }}
          >
            {currentProblemIndex + 1}/{problems.length}
          </div>
        </div>
        
        <div className="text-sm" style={{ color: visualTheme.textColor }}>
          Correct: {correctAnswers}/{totalAttempts}
        </div>
      </div>

      {/* Problem Display */}
      {gameState === 'playing' && currentProblem && (
        <div className="text-center mb-6">
          <div 
            className="text-4xl font-bold mb-6"
            style={{ color: visualTheme.primaryColor }}
          >
            {currentProblem.question}
          </div>
          
          {/* Answer Options */}
          {currentProblem.options ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentProblem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="px-6 py-4 rounded-lg font-bold transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: visualTheme.secondaryColor,
                    color: visualTheme.textColor 
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <input
                type="number"
                placeholder="Enter your answer..."
                className="w-full px-4 py-3 rounded-lg text-center text-xl"
                style={{ 
                  backgroundColor: visualTheme.primaryColor,
                  color: visualTheme.textColor,
                  border: `2px solid ${visualTheme.secondaryColor}`
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const answer = parseFloat(e.currentTarget.value);
                    if (!isNaN(answer)) {
                      handleAnswer(answer);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <p className="text-sm mt-2" style={{ color: visualTheme.textColor }}>
                Press Enter to submit
              </p>
            </div>
          )}
          
          {/* Feedback */}
          {currentProblem.userAnswer !== undefined && (
            <div className="mt-4">
              <div 
                className={`text-lg font-bold ${
                  currentProblem.isCorrect ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {currentProblem.isCorrect ? '✓ Correct!' : `✗ Wrong! The answer was ${currentProblem.answer}`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game Finished Overlay */}
      {gameState === 'finished' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: visualTheme.primaryColor }}
            >
              Game Complete!
            </h2>
            <div className="space-y-2" style={{ color: visualTheme.textColor }}>
              <div>Final Score: {score}</div>
              <div>Correct Answers: {correctAnswers}/{problems.length}</div>
              <div>Accuracy: {totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0}%</div>
              <div>Total Time: {Math.round(((Date.now() - startTime) / 1000))}s</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}