'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold tracking-widest text-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.5)]">
            ESCAPE
          </div>
          <div className="text-4xl font-bold tracking-widest text-cyan-600">
            THE SPACE STATION
          </div>
          <div className="text-sm opacity-50 mt-8">
            A collaborative escape experience
          </div>
        </div>

        <div className="border-2 border-cyan-400 p-8 space-y-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="text-center space-y-4">
            <div className="text-xl font-bold">TRANSMISSION RECEIVED</div>
            <div className="text-sm opacity-70">
              Emergency evacuation protocol initiated
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm opacity-70">
              You have received an access code to join the escape mission.
            </div>
            <div className="text-sm opacity-70">
              Each crew member will receive a private transmission channel.
            </div>
            <div className="text-sm opacity-70">
              Work independently. Complete your assigned tasks. Escape together.
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/join"
              className="border-2 border-cyan-400 px-12 py-4 text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all duration-200 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]"
            >
              &gt;&gt; JOIN MISSION &lt;&lt;
            </Link>
            <Link
              href="/puzzles"
              className="border-2 border-purple-400 px-12 py-4 text-xl font-bold hover:bg-purple-400 hover:text-black transition-all duration-200 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]"
            >
              🧩 PRACTICE
            </Link>
          </div>
        </div>

        <div className="text-center text-xs opacity-30">
          PROMETHEUS SPACE STATION - EMERGENCY EVACUATION PROTOCOL
        </div>
      </div>
    </div>
  );
}
