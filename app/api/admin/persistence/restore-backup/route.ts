import { NextRequest, NextResponse } from 'next/server';
import {
  PersistenceManager,
  type SavedGameState,
} from '@/lib/persistence';

// POST /api/admin/persistence/restore-backup - Restore from backup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { backupId, adminId } = body;

    if (!backupId || !adminId) {
      return NextResponse.json(
        { success: false, error: 'Backup ID and Admin ID required' },
        { status: 400 }
      );
    }

    const result = PersistenceManager.restoreFromBackup(backupId, adminId);

    return NextResponse.json({
      success: result.success,
      restoredGames: result.restoredGames,
      restoredSessions: result.restoredSessions,
      error: result.error,
      message: result.success 
        ? `Backup restored successfully! Restored ${result.restoredGames} games and ${result.restoredSessions} sessions.`
        : `Failed to restore backup: ${result.error}`,
    });
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}