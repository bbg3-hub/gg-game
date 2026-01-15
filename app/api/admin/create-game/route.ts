import { NextRequest, NextResponse } from 'next/server';
import { createGameSession } from '@/lib/gameSession';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId } = body;

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    const session = createGameSession(adminId);

    return NextResponse.json(
      {
        success: true,
        session: {
          id: session.id,
          gameCode: session.gameCode,
          adminId: session.adminId,
          status: session.status,
          oxygenMinutes: session.oxygenMinutes,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'Content-Disposition': 'inline',
        },
      }
    );
  } catch (error) {
    console.error('Create game error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'Content-Disposition': 'inline',
        },
      }
    );
  }
}
