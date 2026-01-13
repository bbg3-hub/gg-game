import GameClient from './GameClient';

interface PageProps {
  params: Promise<{ playerToken: string }>
}

export default async function PlayerGamePage({ params }: PageProps) {
  const { playerToken } = await params;

  return <GameClient playerToken={playerToken} />;
}
