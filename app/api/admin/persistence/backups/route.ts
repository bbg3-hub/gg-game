import { NextRequest, NextResponse } from 'next/server';
import {
  PersistenceManager,
  type BackupData,
} from '@/lib/persistence';

// GET /api/admin/persistence/backups - List backups
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
    
    const backups = PersistenceManager.listBackups(adminId);
    
    return NextResponse.json({
      success: true,
      backups,
      total: backups.length,
    });
  } catch (error) {
    console.error('Failed to list backups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve backups' },
      { status: 500 }
    );
  }
}

// POST /api/admin/persistence/backup - Create backup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, name, description, includeSessions = true } = body;
    
    if (!adminId || !name) {
      return NextResponse.json(
        { success: false, error: 'Admin ID and name required' },
        { status: 400 }
      );
    }
    
    const backup = PersistenceManager.createBackup(
      adminId,
      name,
      description,
      includeSessions
    );
    
    return NextResponse.json({
      success: true,
      backup,
      message: 'Backup created successfully',
    });
  } catch (error) {
    console.error('Failed to create backup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}