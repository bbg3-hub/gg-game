import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/gameSession';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const success = deleteSession(sessionId);

    if (!success) {
      return NextResponse.json(
        { error: 'Session not found' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
            'Content-Disposition': 'inline',
          }
        }
      );
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'Content-Disposition': 'inline',
        }
      }
    );
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'Content-Disposition': 'inline',
        }
      }
    );
  }
}
