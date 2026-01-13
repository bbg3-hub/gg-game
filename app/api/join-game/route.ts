import { NextRequest, NextResponse } from 'next/server';
import { joinGame } from '@/lib/gameSession';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameCode, playerName } = body;

    if (!gameCode || !playerName) {
      return NextResponse.json(
        { error: 'Game code and player name are required' },
        { status: 400 }
      );
    }

    const result = joinGame(gameCode.trim().toUpperCase(), playerName.trim());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const playerUrl = `${baseUrl}/game/play/${result.playerToken}`;

    return NextResponse.json({
      success: true,
      playerToken: result.playerToken,
      playerUrl,
    });
  } catch (error) {
    console.error('Join game error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
