import { NextRequest, NextResponse } from 'next/server';
import { createSpaceshipGameSession } from '@/lib/spaceshipGameSession';
import { GameConfig } from '@/lib/gameConfig';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, config } = body;

    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 });
    }

    // Validate config
    if (config && typeof config === 'object') {
      // Validate game name
      if (config.name && typeof config.name !== 'string') {
        return NextResponse.json({ error: 'Invalid game name' }, { status: 400 });
      }

      // Validate difficulty
      if (config.difficulty && !['NORMAL', 'HARD', 'NIGHTMARE', 'EXTREME'].includes(config.difficulty)) {
        return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
      }

      // Validate max players
      if (config.maxPlayers && (config.maxPlayers < 1 || config.maxPlayers > 4)) {
        return NextResponse.json({ error: 'Max players must be between 1-4' }, { status: 400 });
      }

      // Validate oxygen time
      if (config.oxygenTime && (config.oxygenTime < 5 || config.oxygenTime > 60)) {
        return NextResponse.json({ error: 'Oxygen time must be between 5-60 minutes' }, { status: 400 });
      }

      // Validate max monster tier
      if (config.maxMonsterTier && (config.maxMonsterTier < 1 || config.maxMonsterTier > 5)) {
        return NextResponse.json({ error: 'Max monster tier must be between 1-5' }, { status: 400 });
      }

      // Validate multipliers
      const multipliers = ['healthMultiplier', 'speedMultiplier', 'damageMultiplier', 'spawnRateMultiplier'];
      for (const mult of multipliers) {
        if (config[mult] && (config[mult] < 0.5 || config[mult] > 2.0)) {
          return NextResponse.json({ error: `${mult} must be between 0.5-2.0` }, { status: 400 });
        }
      }
    }

    const session = createSpaceshipGameSession(adminId, config);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        gameCode: session.gameCode,
        config: session.config,
        status: session.status,
        oxygenRemaining: session.oxygenRemaining,
        players: session.players.length
      }
    });

  } catch (error) {
    console.error('Error creating spaceship game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}