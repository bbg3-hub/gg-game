import { NextRequest, NextResponse } from 'next/server';
import { getPlayerByToken } from '@/lib/gameSession';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const playerToken = searchParams.get('playerToken');

    if (!playerToken) {
        return NextResponse.json({ error: 'Missing playerToken' }, { status: 400 });
    }

    const { player, session } = getPlayerByToken(playerToken);

    if (!player || !session) {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({ player, session });
}
