import { NextRequest, NextResponse } from 'next/server';
import { getAllAdminSessions } from '@/lib/gameSessionStore';

export async function GET(req: NextRequest) {
  try {
    const adminSession = req.headers.get('x-admin-id');
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = getAllAdminSessions(adminSession);
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Get games error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
