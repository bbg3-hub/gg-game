import { NextRequest, NextResponse } from 'next/server';
import { updateSessionWithBuilder } from '@/lib/gameSessionStore';

export async function POST(req: NextRequest) {
  try {
    const session = await req.json();

    if (!session.id || !session.adminId) {
      return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
    }

    const updated = updateSessionWithBuilder(session.id, session.adminId, {
      phases: session.phases,
      title: session.title,
      description: session.description,
      settings: session.settings,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error('Save game error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
