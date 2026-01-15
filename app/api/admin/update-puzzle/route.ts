import { NextRequest, NextResponse } from 'next/server';
import { updateSessionPuzzleSettings } from '@/lib/gameSessionStore';
import type { GreekWord } from '@/lib/gameSession';

function isIntInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function normalizeMorseWords(value: unknown): string[] {
  if (!Array.isArray(value)) throw new Error('customMorseWords must be an array');
  const normalized = value.map((w) => String(w).trim().toUpperCase()).filter(Boolean);
  if (normalized.length < 1) throw new Error('Provide at least 1 morse word');
  if (normalized.some((w) => w.length > 20)) throw new Error('Morse words must be 20 characters or less');
  return normalized;
}

function normalizeGreekWords(value: unknown): GreekWord[] {
  if (!Array.isArray(value)) throw new Error('customGreekWords must be an array');
  const normalized: GreekWord[] = value
    .map((item) => {
      const word = String((item as GreekWord).word ?? '').trim().toUpperCase();
      const meaning = String((item as GreekWord).meaning ?? '').trim();
      return { word, meaning };
    })
    .filter((w) => w.word.length > 0 && w.meaning.length > 0);

  if (normalized.length < 4) throw new Error('Provide at least 4 Greek words for multiple-choice options');
  return normalized;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const adminId = body?.adminId;
    const sessionId = body?.sessionId;

    if (!adminId || !sessionId) {
      return NextResponse.json({ error: 'Admin ID and session ID are required' }, { status: 400 });
    }

    const update: {
      customMorseWords?: string[];
      customGreekWords?: GreekWord[];
      customMaxMorseAttempts?: number;
      customMaxMeaningAttempts?: number;
      customOxygenMinutes?: number;
    } = {};

    if ('customMorseWords' in body) {
      update.customMorseWords = body.customMorseWords === null ? undefined : normalizeMorseWords(body.customMorseWords);
    }

    if ('customGreekWords' in body) {
      update.customGreekWords = body.customGreekWords === null ? undefined : normalizeGreekWords(body.customGreekWords);
    }

    if ('customMaxMorseAttempts' in body) {
      if (body.customMaxMorseAttempts === null) {
        update.customMaxMorseAttempts = undefined;
      } else if (!isIntInRange(body.customMaxMorseAttempts, 1, 20)) {
        return NextResponse.json({ error: 'customMaxMorseAttempts must be an integer between 1 and 20' }, { status: 400 });
      } else {
        update.customMaxMorseAttempts = body.customMaxMorseAttempts;
      }
    }

    if ('customMaxMeaningAttempts' in body) {
      if (body.customMaxMeaningAttempts === null) {
        update.customMaxMeaningAttempts = undefined;
      } else if (!isIntInRange(body.customMaxMeaningAttempts, 1, 20)) {
        return NextResponse.json({ error: 'customMaxMeaningAttempts must be an integer between 1 and 20' }, { status: 400 });
      } else {
        update.customMaxMeaningAttempts = body.customMaxMeaningAttempts;
      }
    }

    if ('customOxygenMinutes' in body) {
      if (body.customOxygenMinutes === null) {
        update.customOxygenMinutes = undefined;
      } else if (!isIntInRange(body.customOxygenMinutes, 1, 240)) {
        return NextResponse.json({ error: 'customOxygenMinutes must be an integer between 1 and 240' }, { status: 400 });
      } else {
        update.customOxygenMinutes = body.customOxygenMinutes;
      }
    }

    const session = updateSessionPuzzleSettings(adminId, sessionId, update);

    if (!session) {
      return NextResponse.json({ error: 'Session not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        session,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'Content-Disposition': 'inline',
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : null;

    if (message && (message.startsWith('Provide') || message.includes('must be') || message.includes('custom'))) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error('Update puzzle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
