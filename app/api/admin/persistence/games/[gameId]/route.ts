import { NextRequest, NextResponse } from 'next/server';
import {
  PersistenceManager,
  type SavedGameState,
} from '@/lib/persistence';

// DELETE /api/admin/persistence/games/[gameId] - Delete saved game
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin ID required' },
        { status: 400 }
      );
    }
    
    const { gameId } = await context.params;
    const success = PersistenceManager.deleteSavedGame(gameId, adminId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Saved game not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Saved game deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete saved game:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete saved game' },
      { status: 500 }
    );
  }
}