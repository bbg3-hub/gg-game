import { NextRequest, NextResponse } from 'next/server';
import { getGameSession, updateSessionWithBuilder } from '@/lib/gameSessionStore';
import { addPhaseToSession, updatePhaseInSession, removePhaseFromSession } from '@/lib/gameBuilder';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, adminId, phase } = await req.json();

    if (!sessionId || !adminId || !phase) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = getGameSession(sessionId);
    if (!session || session.adminId !== adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedSession = addPhaseToSession(session, phase);
    const updated = updateSessionWithBuilder(sessionId, adminId, { phases: updatedSession.phases });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to add phase' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error('Add phase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { sessionId, adminId, phaseId, updates } = await req.json();

    if (!sessionId || !adminId || !phaseId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = getGameSession(sessionId);
    if (!session || session.adminId !== adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedSession = updatePhaseInSession(session, phaseId, updates);
    const updated = updateSessionWithBuilder(sessionId, adminId, { phases: updatedSession.phases });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update phase' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error('Update phase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId, adminId, phaseId } = await req.json();

    if (!sessionId || !adminId || !phaseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = getGameSession(sessionId);
    if (!session || session.adminId !== adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedSession = removePhaseFromSession(session, phaseId);
    const updated = updateSessionWithBuilder(sessionId, adminId, { phases: updatedSession.phases });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to delete phase' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error('Delete phase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
