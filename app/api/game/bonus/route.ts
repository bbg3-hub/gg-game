import { NextRequest, NextResponse } from 'next/server';
import { submitBonusAnswers } from '@/lib/gameSessionStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerToken, q1Correct, q2Correct } = body;

    if (!playerToken || q1Correct === undefined || q2Correct === undefined) {
      return NextResponse.json(
        { error: 'Player token and answers are required' },
        { status: 400 }
      );
    }

    const success = submitBonusAnswers(playerToken, q1Correct, q2Correct);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to submit answers' },
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
    console.error('Bonus answers error:', error);
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
