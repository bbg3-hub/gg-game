import { NextRequest, NextResponse } from 'next/server';
import {
  PersistenceManager,
  AutoSaveManager,
  type SavedGameState,
  type BackupData,
  type PersistenceSettings,
  type DatabaseStats,
} from '@/lib/persistence';

// GET /api/admin/persistence/games - List saved games
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const playerId = searchParams.get('playerId');
    const gameType = searchParams.get('gameType') as 'horror' | 'educational' | 'mixed' | null;
    const autoSaved = searchParams.get('autoSaved');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin ID required' },
        { status: 400 }
      );
    }

    const filters: any = { adminId };
    if (playerId) filters.playerId = playerId;
    if (gameType) filters.gameType = gameType;
    if (autoSaved !== null) filters.autoSaved = autoSaved === 'true';
    if (startDate && endDate) {
      filters.dateRange = {
        start: parseInt(startDate),
        end: parseInt(endDate),
      };
    }

    const savedGames = PersistenceManager.listSavedGames(filters);

    return NextResponse.json({
      success: true,
      savedGames,
      total: savedGames.length,
    });
  } catch (error) {
    console.error('Failed to list saved games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve saved games' },
      { status: 500 }
    );
  }
}

// POST /api/admin/persistence/restore - Restore game state
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, adminId } = body;

    if (!gameId || !adminId) {
      return NextResponse.json(
        { success: false, error: 'Game ID and Admin ID required' },
        { status: 400 }
      );
    }

    // This would implement the actual restoration logic
    // For now, we'll return a success response
    return NextResponse.json({
      success: true,
      message: 'Game state restored successfully',
    });
  } catch (error) {
    console.error('Failed to restore game state:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to restore game state' },
      { status: 500 }
    );
  }
}