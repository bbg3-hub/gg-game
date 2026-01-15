import GameClient from './GameClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ playerToken: string }>
}

export default async function PlayerGamePage(props: PageProps) {
  const params = await props.params;
  const playerToken = params.playerToken;

  if (!playerToken) {
    return (
      <div className="min-h-screen bg-black text-red-500 font-mono flex items-center justify-center">
        INVALID MISSION TOKEN
      </div>
    );
  }

  return <GameClient playerToken={playerToken} />;
}
