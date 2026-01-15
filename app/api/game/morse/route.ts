import { NextRequest, NextResponse } from 'next/server';
import { submitMorseAnswer } from '@/lib/gameSessionStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerToken, answer } = body;

    if (!playerToken || !answer) {
      return NextResponse.json(
        { error: 'Player token and answer are required' },
        { status: 400 }
      );
    }

    const result = submitMorseAnswer(playerToken, answer);

    return NextResponse.json(
      {
        success: true,
        correct: result.correct,
        attempts: result.attempts,
        maxAttempts: result.maxAttempts,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (error) {
    console.error('Morse answer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }
}
