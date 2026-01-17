import { NextRequest, NextResponse } from 'next/server';
import {
  PersistenceManager,
  type SavedGameState,
} from '@/lib/persistence';

// GET /api/admin/persistence/stats - Get database statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin ID required' },
        { status: 400 }
      );
    }
    
    const stats = PersistenceManager.getDatabaseStats(adminId);
    
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Failed to get database stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve statistics' },
      { status: 500 }
    );
  }
}