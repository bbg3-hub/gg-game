import { NextRequest, NextResponse } from 'next/server';
import { 
  getSpaceshipGameSession, 
  getPlayerByToken, 
  updatePlayerPosition,
  updatePlayerAmmo,
  playerShoot,
  updateGameState
} from '@/lib/spaceshipGameSession';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerToken, action, data } = body;

    if (!playerToken) {
      return NextResponse.json(
        { error: 'Player token required' },
        { status: 400 }
      );
    }

    const { player, session } = getPlayerByToken(playerToken);
    if (!player || !session) {
      return NextResponse.json(
        { error: 'Invalid player token' },
        { status: 401 }
      );
    }

    // Update game state first
    updateGameState(session.id);

    let result: any = { success: true };

    switch (action) {
      case 'move':
        if (data && typeof data.position === 'object') {
          const { x, y } = data.position;
          if (typeof x === 'number' && typeof y === 'number') {
            updatePlayerPosition(playerToken, { x, y });
          }
        }
        break;

      case 'shoot':
        if (data && typeof data.targetX === 'number' && typeof data.targetY === 'number') {
          const shootResult = playerShoot(playerToken, data.targetX, data.targetY);
          result.shootResult = shootResult;
        }
        break;

      case 'reload':
        // Simple reload - refill ammo to max
        updatePlayerAmmo(playerToken, 30);
        result.ammo = 30;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Return updated game state
    const updatedSession = getSpaceshipGameSession(session.id);
    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Game session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      player: {
        id: player.id,
        name: player.name,
        health: player.health,
        ammo: player.ammo,
        position: player.position,
        status: player.status,
        kills: player.kills,
        accuracy: player.accuracy,
        totalShots: player.totalShots,
        successfulShots: player.successfulShots,
        damageDealt: player.damageDealt
      },
      game: {
        id: updatedSession.id,
        status: updatedSession.status,
        currentRoom: updatedSession.currentRoom,
        oxygenRemaining: updatedSession.oxygenRemaining,
        roomProgress: updatedSession.roomProgress,
        monsters: updatedSession.monsters.map(m => ({
          id: m.id,
          type: m.type,
          tier: m.tier,
          health: m.health,
          maxHealth: m.maxHealth,
          position: m.position,
          isBoss: m.isBoss,
          bossPhase: m.bossPhase,
          effects: m.effects
        })),
        roomStats: updatedSession.roomStats,
        totalKills: updatedSession.totalKills,
        victory: updatedSession.victory,
        defeat: updatedSession.defeat,
        clueSolved: updatedSession.clueSolved
      },
      ...result
    });

  } catch (error) {
    console.error('Error syncing spaceship game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerToken = searchParams.get('playerToken');

    if (!playerToken) {
      return NextResponse.json(
        { error: 'Player token required' },
        { status: 400 }
      );
    }

    const { player, session } = getPlayerByToken(playerToken);
    if (!player || !session) {
      return NextResponse.json(
        { error: 'Invalid player token' },
        { status: 401 }
      );
    }

    // Update game state
    updateGameState(session.id);
    const updatedSession = getSpaceshipGameSession(session.id);

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Game session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      player: {
        id: player.id,
        name: player.name,
        health: player.health,
        ammo: player.ammo,
        position: player.position,
        status: player.status,
        kills: player.kills,
        accuracy: player.accuracy,
        totalShots: player.totalShots,
        successfulShots: player.successfulShots,
        damageDealt: player.damageDealt
      },
      game: {
        id: updatedSession.id,
        status: updatedSession.status,
        currentRoom: updatedSession.currentRoom,
        oxygenRemaining: updatedSession.oxygenRemaining,
        roomProgress: updatedSession.roomProgress,
        monsters: updatedSession.monsters.map(m => ({
          id: m.id,
          type: m.type,
          tier: m.tier,
          health: m.health,
          maxHealth: m.maxHealth,
          position: m.position,
          isBoss: m.isBoss,
          bossPhase: m.bossPhase,
          effects: m.effects
        })),
        roomStats: updatedSession.roomStats,
        totalKills: updatedSession.totalKills,
        victory: updatedSession.victory,
        defeat: updatedSession.defeat,
        clueSolved: updatedSession.clueSolved
      }
    });

  } catch (error) {
    console.error('Error getting spaceship game state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}