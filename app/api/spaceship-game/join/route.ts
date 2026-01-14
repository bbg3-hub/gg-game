import { NextRequest, NextResponse } from 'next/server';
import { joinSpaceshipGame } from '@/lib/spaceshipGameSession';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameCode, playerName } = body;

    if (!gameCode || !playerName) {
      return NextResponse.json(
        { error: 'Game code and player name required' },
        { status: 400 }
      );
    }

    // Validate game code format (6 characters)
    if (typeof gameCode !== 'string' || gameCode.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid game code format' },
        { status: 400 }
      );
    }

    // Validate player name
    if (typeof playerName !== 'string' || playerName.trim().length < 2 || playerName.trim().length > 20) {
      return NextResponse.json(
        { error: 'Player name must be 2-20 characters' },
        { status: 400 }
      );
    }

    // Join the spaceship game
    const result = joinSpaceshipGame(gameCode, playerName.trim());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      playerToken: result.playerToken,
      gameCode: gameCode,
      redirect: `/game/spaceship/${result.playerToken}`
    });

  } catch (error) {
    console.error('Error joining spaceship game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}