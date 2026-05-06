'use client';

import SansFight from '@/components/games/SansFight';
import { useRouter } from 'next/navigation';

export default function SansGamePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black">
      <SansFight onBack={() => router.push('/')} />
    </main>
  );
}
