import { NextRequest, NextResponse } from 'next/server';
import { getAllSpaceshipAdminSessions } from '@/lib/spaceshipGameSession';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID required' },
        { status: 400 }
      );
    }

    const sessions = getAllSpaceshipAdminSessions(adminId);

    const simplifiedSessions = sessions.map(session => ({
      id: session.id,
      gameCode: session.gameCode,
      name: session.config.name,
      difficulty: session.config.difficulty,
      status: session.status,
      currentRoom: session.currentRoom,
      players: session.players.length,
      maxPlayers: session.config.maxPlayers,
      oxygenRemaining: session.oxygenRemaining,
      totalKills: session.totalKills,
      victory: session.victory,
      defeat: session.defeat,
      startTime: session.startTime,
      createdAt: session.config.createdAt
    }));

    return NextResponse.json({
      success: true,
      sessions: simplifiedSessions,
      total: simplifiedSessions.length
    });

  } catch (error) {
    console.error('Error getting admin sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}