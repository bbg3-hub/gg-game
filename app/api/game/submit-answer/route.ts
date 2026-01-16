import { NextRequest, NextResponse } from 'next/server';
import { getPlayerByToken, updatePlayerProgress } from '@/lib/gameSessionStore';

export async function POST(req: NextRequest) {
  try {
    const { playerToken, questionId, answer } = await req.json();

    if (!playerToken || !questionId || answer === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { player, session } = getPlayerByToken(playerToken);
    if (!player || !session) {
      return NextResponse.json({ error: 'Invalid player token' }, { status: 404 });
    }

    if (!session.phases || session.phases.length === 0) {
      return NextResponse.json({ error: 'No game phases configured' }, { status: 400 });
    }

    let question = null;
    let phaseIndex = -1;
    let questionIndex = -1;

    for (let i = 0; i < session.phases.length; i++) {
      const phase = session.phases[i];
      const qIdx = phase.questions.findIndex((q) => q.id === questionId);
      if (qIdx !== -1) {
        question = phase.questions[qIdx];
        phaseIndex = i;
        questionIndex = qIdx;
        break;
      }
    }

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const progress = player.questionProgress || [];
    let questionProgress = progress.find((p) => p.questionId === questionId);

    if (!questionProgress) {
      questionProgress = {
        questionId,
        attempts: 0,
        completed: false,
        correct: false,
        score: 0,
      };
      progress.push(questionProgress);
    }

    if (questionProgress.completed) {
      return NextResponse.json({
        correct: true,
        completed: true,
        attempts: questionProgress.attempts,
        score: questionProgress.score,
      });
    }

    if (question.maxAttempts && questionProgress.attempts >= question.maxAttempts) {
      return NextResponse.json({
        correct: false,
        completed: false,
        attempts: questionProgress.attempts,
        maxAttempts: question.maxAttempts,
        feedback: 'Maximum attempts reached',
      });
    }

    questionProgress.attempts++;

    let correct = false;
    if (question.type === 'multiple-choice' && question.options) {
      const selectedOption = question.options.find((o) => o.text === answer);
      correct = selectedOption?.isCorrect || false;
    } else if (question.type === 'text') {
      correct = answer.trim().toLowerCase() === question.solution.trim().toLowerCase();
    } else if (question.type === 'open-response') {
      correct = true;
      questionProgress.score = question.points;
      questionProgress.completed = true;
      questionProgress.correct = true;
    }

    if (correct && question.type !== 'open-response') {
      questionProgress.completed = true;
      questionProgress.correct = true;
      const attemptsUsed = questionProgress.attempts;
      const penaltyPerAttempt = Math.floor(question.points * 0.1);
      questionProgress.score = Math.max(0, question.points - (attemptsUsed - 1) * penaltyPerAttempt);
    }

    const updatedProgress = progress.map((p) => (p.questionId === questionId ? questionProgress : p));

    updatePlayerProgress(playerToken, {
      questionProgress: updatedProgress,
      currentPhaseIndex: phaseIndex,
      currentQuestionIndex: questionIndex,
    });

    return NextResponse.json({
      correct,
      completed: questionProgress.completed,
      attempts: questionProgress.attempts,
      maxAttempts: question.maxAttempts,
      score: questionProgress.score,
      feedback: correct ? 'Correct!' : 'Incorrect, try again.',
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
