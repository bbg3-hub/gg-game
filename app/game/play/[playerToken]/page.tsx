import { redirect } from 'next/navigation';
import { getPlayerByToken } from '@/lib/gameSession';
import GameClient from './GameClient';

interface PageProps {
  params: Promise<{ playerToken: string }>
}

export default async function PlayerGamePage({ params }: PageProps) {
  const { playerToken } = await params;

  // This runs on the server, so it should access the shared session memory
  // provided the server process is persistent and centralized.
  const { player } = getPlayerByToken(playerToken);

  if (!player) {
    redirect('/');
  }

  return <GameClient initialPlayer={player} playerToken={playerToken} />;
}
