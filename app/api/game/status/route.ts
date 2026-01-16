import { NextRequest, NextResponse } from 'next/server';
import { getPlayerByToken } from '@/lib/gameSessionStore';
import { getEffectiveGreekWords, getEffectiveOxygenMinutes } from '@/lib/gameSession';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const playerToken = searchParams.get('playerToken');

    if (!playerToken) {
        return NextResponse.json({ error: 'Missing playerToken' }, { status: 400 });
    }

    const { player, session } = getPlayerByToken(playerToken);

    if (!player || !session) {
        return NextResponse.json(
            { error: 'Player not found' },
            { 
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Content-Type-Options': 'nosniff',
                    'Content-Disposition': 'inline'
                }
            }
        );
    }

    const greekWords = getEffectiveGreekWords(session);
    const greekWordIndex = player.greekWordIndex % greekWords.length;
    const meaningWord = greekWords[greekWordIndex]?.word;
    const meaningOptions = greekWords.map((w) => w.meaning);

    return NextResponse.json(
        {
            player,
            session: {
                id: session.id,
                startTime: session.startTime,
                oxygenMinutes: getEffectiveOxygenMinutes(session),
                status: session.status,
                meaningWord,
                meaningOptions,
                phases: session.phases,
                title: session.title,
                description: session.description,
            },
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Content-Type-Options': 'nosniff',
                'Content-Disposition': 'inline'
            }
        }
    );
}
