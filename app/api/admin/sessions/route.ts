import { NextRequest, NextResponse } from 'next/server';
import { getAllAdminSessions } from '@/lib/gameSession';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    const sessions = getAllAdminSessions(adminId);

    return NextResponse.json(
      {
        success: true,
        sessions: sessions.map((session) => ({
          id: session.id,
          gameCode: session.gameCode,
          adminId: session.adminId,
          players: session.players,
          startTime: session.startTime,
          oxygenMinutes: session.oxygenMinutes,
          status: session.status,
          finalEscapeCode: session.finalEscapeCode,
        })),
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
    console.error('Get sessions error:', error);
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
