'use client';

import React from 'react';
import { GameConfig } from '@/lib/gameConfig';

interface MonsterConfigPanelProps {
  config: any;
  onChange: (config: any) => void;
}

export function MonsterConfigPanel({ config, onChange }: MonsterConfigPanelProps) {
  const updateMultiplier = (key: string, value: number) => {
    onChange({ ...config, [key]: value });
  };

  const updateTierWeight = (tier: number, weight: number) => {
    const newWeights = {
      tier1: tier === 1 ? weight : config.tierSpawnWeights?.tier1 || 50,
      tier2: tier === 2 ? weight : config.tierSpawnWeights?.tier2 || 30,
      tier3: tier === 3 ? weight : config.tierSpawnWeights?.tier3 || 20,
      tier4: tier === 4 ? weight : config.tierSpawnWeights?.tier4 || 0,
      tier5: tier === 5 ? weight : config.tierSpawnWeights?.tier5 || 0
    };
    onChange({ ...config, tierSpawnWeights: newWeights });
  };

  return (
    <div className="space-y-6">
      {/* Tier Spawn Weights */}
      <div>
        <h4 className="text-cyan-400 font-mono text-sm mb-3">Tier Spawn Weights (%)</h4>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map(tier => (
            <div key={tier} className="text-center">
              <label className="block text-xs text-gray-400 font-mono mb-1">
                T{tier}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={(config.tierSpawnWeights as any)?.[`tier${tier}`] || 0}
                onChange={(e) => updateTierWeight(tier, parseInt(e.target.value) || 0)}
                className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white font-mono text-xs text-center focus:border-cyan-400 focus:outline-none"
              />
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 font-mono mt-1">
          Total: {Object.values(config.tierSpawnWeights || {}).reduce((sum: number, weight: any) => sum + (weight || 0), 0)}%
        </div>
      </div>

      {/* Multipliers */}
      <div>
        <h4 className="text-cyan-400 font-mono text-sm mb-3">Monster Multipliers</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 font-mono mb-1">Health</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="2.0"
              value={(config.healthMultiplier as number) || 1.0}
              onChange={(e) => updateMultiplier('healthMultiplier', parseFloat(e.target.value) || 1.0)}
              className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm text-center focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-mono mb-1">Speed</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="2.0"
              value={(config.speedMultiplier as number) || 1.0}
              onChange={(e) => updateMultiplier('speedMultiplier', parseFloat(e.target.value) || 1.0)}
              className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm text-center focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-mono mb-1">Damage</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="2.0"
              value={(config.damageMultiplier as number) || 1.0}
              onChange={(e) => updateMultiplier('damageMultiplier', parseFloat(e.target.value) || 1.0)}
              className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm text-center focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-mono mb-1">Spawn Rate</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="2.0"
              value={(config.spawnRateMultiplier as number) || 1.0}
              onChange={(e) => updateMultiplier('spawnRateMultiplier', parseFloat(e.target.value) || 1.0)}
              className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm text-center focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Difficulty Presets */}
      <div>
        <h4 className="text-cyan-400 font-mono text-sm mb-3">Difficulty Presets</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['NORMAL', 'HARD', 'NIGHTMARE', 'EXTREME'].map(difficulty => (
            <button
              key={difficulty}
              onClick={() => {
                const presets: any = {
                  NORMAL: { health: 1.0, speed: 1.0, damage: 1.0, spawnRate: 1.0 },
                  HARD: { health: 1.25, speed: 1.15, damage: 1.15, spawnRate: 1.2 },
                  NIGHTMARE: { health: 1.5, speed: 1.3, damage: 1.3, spawnRate: 1.5 },
                  EXTREME: { health: 2.0, speed: 1.5, damage: 1.5, spawnRate: 2.0 }
                };
                const preset = presets[difficulty as string];
                onChange({
                  ...config,
                  healthMultiplier: preset.health,
                  speedMultiplier: preset.speed,
                  damageMultiplier: preset.damage,
                  spawnRateMultiplier: preset.spawnRate,
                  difficulty: difficulty
                });
              }}
              className={`px-3 py-2 rounded text-xs font-mono transition-colors ${
                (config.difficulty as string) === difficulty
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Monster Type Info */}
      <div>
        <h4 className="text-cyan-400 font-mono text-sm mb-3">Monster Types</h4>
        <div className="text-xs text-gray-400 font-mono space-y-1">
          <div><span className="text-orange-400">CRAWLER</span> - Slow melee, 50-250 HP</div>
          <div><span className="text-orange-400">CHARGER</span> - Fast melee, 60-300 HP</div>
          <div><span className="text-purple-400">SPITTER</span> - Ranged floater, 35-175 HP</div>
          <div><span className="text-green-400">OOZE_BLOB</span> - Gelatinous mass, 100-400 HP</div>
          <div><span className="text-gray-400">ARMORED_KNIGHT</span> - Heavily armored, 150-350 HP</div>
          <div><span className="text-red-400">MUTANT_ABOMINATION</span> - Grotesque hybrid, 300-500 HP</div>
          <div><span className="text-white">VOID_ENTITY</span> - Cosmic horror, 600 HP (Boss only)</div>
        </div>
      </div>
    </div>
  );
}