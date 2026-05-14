import { NextRequest, NextResponse } from 'next/server';
import { submitClueAnswer, getSpaceshipGameSession } from '@/lib/spaceshipGameSession';
import { getRoomConfig } from '@/lib/roomConfig';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerToken, sessionId, answer } = body;

    if (!playerToken || !sessionId || answer === undefined) {
      return NextResponse.json(
        { error: 'Player token, session ID, and answer required' },
        { status: 400 }
      );
    }

    // Validate answer
    if (typeof answer !== 'string' || answer.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid answer format' },
        { status: 400 }
      );
    }

    const session = getSpaceshipGameSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Game session not found' },
        { status: 404 }
      );
    }

    // Submit clue answer
    const result = submitClueAnswer(sessionId, playerToken, answer.trim());

    return NextResponse.json({
      success: true,
      correct: result.correct,
      attempts: result.attempts,
      maxAttempts: result.maxAttempts,
      game: {
        status: session.status,
        oxygenRemaining: session.oxygenRemaining,
        clueSolved: session.clueSolved,
        victory: session.victory,
        defeat: session.defeat
      }
    });

  } catch (error) {
    console.error('Error submitting clue answer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}