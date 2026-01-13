'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="border-2 border-cyan-400 p-8 space-y-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold mb-4 animate-pulse">
              ╔═══════════════════════════════════╗
            </div>
            <h1 className="text-5xl font-bold tracking-wider mb-2">
              SPACE STATION ESCAPE
            </h1>
            <div className="text-4xl font-bold mb-4 animate-pulse">
              ╚═══════════════════════════════════╝
            </div>
          </div>

          <div className="border border-cyan-400 p-6 space-y-4 bg-black/50">
            <div className="text-xl font-bold mb-4 text-center">
              &gt;&gt; MISSION BRIEFING &lt;&lt;
            </div>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-red-500">[CRITICAL ALERT]</span> Station oxygen system compromised.
              </p>
              <p>
                <span className="text-yellow-400">[MISSION]</span> 4 crew members must complete individual puzzles to unlock escape pods.
              </p>
              <p>
                <span className="text-green-400">[TIME LIMIT]</span> 120 minutes of oxygen remaining.
              </p>
              <p>
                <span className="text-cyan-400">[OBJECTIVES]</span>
              </p>
              <ul className="list-none space-y-1 ml-4">
                <li>→ Decode Morse transmissions</li>
                <li>→ Translate ancient Greek protocols</li>
                <li>→ Neutralize security drones</li>
                <li>→ Answer bonus security questions</li>
                <li>→ Collect escape fragments</li>
                <li>→ Calculate final launch sequence</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link
              href="/game/setup"
              className="border-2 border-cyan-400 px-12 py-4 text-2xl font-bold hover:bg-cyan-400 hover:text-black transition-all duration-200 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]"
            >
              &gt;&gt; INITIALIZE MISSION &lt;&lt;
            </Link>
          </div>

          <div className="text-center text-xs mt-6 opacity-70">
            <p>[SYSTEM ID: SS-ESCAPE-PROTOCOL-4P]</p>
            <p>[CLEARANCE: LEVEL 9 REQUIRED]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
