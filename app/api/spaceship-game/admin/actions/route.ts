import { NextRequest, NextResponse } from 'next/server';
import { 
  getSpaceshipGameSession,
  updateGameState,
  deleteSpaceshipSession,
  spawnRoomMonsters
} from '@/lib/spaceshipGameSession';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, adminId, action, data } = body;

    if (!sessionId || !adminId || !action) {
      return NextResponse.json(
        { error: 'Session ID, admin ID, and action required' },
        { status: 400 }
      );
    }

    const session = getSpaceshipGameSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Game session not found' },
        { status: 404 }
      );
    }

    // Verify admin access
    if (session.adminId !== adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    let result: any = { success: true };

    switch (action) {
      case 'pause':
        session.status = 'setup';
        break;

      case 'resume':
        if (session.status === 'setup') {
          session.status = 'room_clearing';
          session.lastUpdate = Date.now();
        }
        break;

      case 'spawn_monsters':
        if (data && data.monsterType && data.tier) {
          // Admin monster spawning logic would go here
          // This is a simplified version
        }
        break;

      case 'skip_room':
        // Skip to next room
        const rooms = ['CRYO_BAY', 'MED_BAY', 'ENGINEERING', 'BRIDGE', 'COMMAND_CENTER'];
        const currentIndex = rooms.indexOf(session.currentRoom);
        if (currentIndex < rooms.length - 1) {
          session.currentRoom = rooms[currentIndex + 1] as any;
          session.roomProgress.currentRoomIndex = currentIndex + 1;
          session.roomStartTime = Date.now();
          spawnRoomMonsters(session);
        }
        break;

      case 'adjust_oxygen':
        if (data && typeof data.seconds === 'number') {
          session.oxygenRemaining += data.seconds * 1000;
        }
        break;

      case 'reveal_clue':
        session.clueSolved = true;
        break;

      case 'delete_session':
        deleteSpaceshipSession(sessionId);
        return NextResponse.json({
          success: true,
          message: 'Session deleted successfully'
        });

      case 'force_victory':
        session.status = 'victory';
        session.victory = true;
        break;

      case 'force_defeat':
        session.status = 'defeat';
        session.defeat = true;
        session.oxygenRemaining = 0;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update game state after action
    updateGameState(sessionId);
    const updatedSession = getSpaceshipGameSession(sessionId);

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Game session not found after update' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      session: {
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
          bossPhase: m.bossPhase
        })),
        roomStats: updatedSession.roomStats,
        totalKills: updatedSession.totalKills,
        victory: updatedSession.victory,
        defeat: updatedSession.defeat,
        clueSolved: updatedSession.clueSolved,
        players: updatedSession.players.map(p => ({
          id: p.id,
          name: p.name,
          health: p.health,
          ammo: p.ammo,
          position: p.position,
          status: p.status,
          kills: p.kills,
          accuracy: p.accuracy,
          damageDealt: p.damageDealt
        }))
      }
    });

  } catch (error) {
    console.error('Error in admin action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const adminId = searchParams.get('adminId');

    if (!sessionId || !adminId) {
      return NextResponse.json(
        { error: 'Session ID and admin ID required' },
        { status: 400 }
      );
    }

    const session = getSpaceshipGameSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Game session not found' },
        { status: 404 }
      );
    }

    // Verify admin access
    if (session.adminId !== adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const deleted = deleteSpaceshipSession(sessionId);

    if (deleted) {
      return NextResponse.json({
        success: true,
        message: 'Session deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete session' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}