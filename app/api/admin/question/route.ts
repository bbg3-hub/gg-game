import { NextRequest, NextResponse } from 'next/server';
import { getGameSession, updateSessionWithBuilder } from '@/lib/gameSessionStore';
import { addQuestionToPhase, updateQuestionInPhase, removeQuestionFromPhase } from '@/lib/gameBuilder';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, adminId, phaseId, question } = await req.json();

    if (!sessionId || !adminId || !phaseId || !question) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = getGameSession(sessionId);
    if (!session || session.adminId !== adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const phases = session.phases || [];
    const phaseIndex = phases.findIndex((p) => p.id === phaseId);
    if (phaseIndex === -1) {
      return NextResponse.json({ error: 'Phase not found' }, { status: 404 });
    }

    const updatedPhase = addQuestionToPhase(phases[phaseIndex], question);
    const updatedPhases = [...phases];
    updatedPhases[phaseIndex] = updatedPhase;

    const updated = updateSessionWithBuilder(sessionId, adminId, { phases: updatedPhases });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to add question' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error('Add question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { sessionId, adminId, phaseId, questionId, updates } = await req.json();

    if (!sessionId || !adminId || !phaseId || !questionId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = getGameSession(sessionId);
    if (!session || session.adminId !== adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const phases = session.phases || [];
    const phaseIndex = phases.findIndex((p) => p.id === phaseId);
    if (phaseIndex === -1) {
      return NextResponse.json({ error: 'Phase not found' }, { status: 404 });
    }

    const updatedPhase = updateQuestionInPhase(phases[phaseIndex], questionId, updates);
    const updatedPhases = [...phases];
    updatedPhases[phaseIndex] = updatedPhase;

    const updated = updateSessionWithBuilder(sessionId, adminId, { phases: updatedPhases });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error('Update question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId, adminId, phaseId, questionId } = await req.json();

    if (!sessionId || !adminId || !phaseId || !questionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = getGameSession(sessionId);
    if (!session || session.adminId !== adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const phases = session.phases || [];
    const phaseIndex = phases.findIndex((p) => p.id === phaseId);
    if (phaseIndex === -1) {
      return NextResponse.json({ error: 'Phase not found' }, { status: 404 });
    }

    const updatedPhase = removeQuestionFromPhase(phases[phaseIndex], questionId);
    const updatedPhases = [...phases];
    updatedPhases[phaseIndex] = updatedPhase;

    const updated = updateSessionWithBuilder(sessionId, adminId, { phases: updatedPhases });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error('Delete question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
