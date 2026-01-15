import { NextRequest } from 'next/server';
import { exportAdminSessions } from '@/lib/gameSessionStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId } = body;

    if (!adminId) {
      return new Response(JSON.stringify({ error: 'Admin ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessions = exportAdminSessions(adminId);
    const payload = {
      exportedAt: Date.now(),
      adminId,
      sessions,
    };

    const filename = `sessions-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    return new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Export sessions error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
