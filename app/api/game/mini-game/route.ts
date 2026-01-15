import { NextRequest, NextResponse } from 'next/server';
import { submitMiniGameScore } from '@/lib/gameSessionStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerToken, score } = body;

    if (!playerToken || score === undefined) {
      return NextResponse.json(
        { error: 'Player token and score are required' },
        { status: 400 }
      );
    }

    const success = submitMiniGameScore(playerToken, score);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to submit score' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
          }
        }
      );
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        }
      }
    );
  } catch (error) {
    console.error('Mini-game score error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        }
      }
    );
  }
}
