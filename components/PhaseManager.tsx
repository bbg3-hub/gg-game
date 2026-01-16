'use client';

import { GamePhase } from '@/lib/gameSession';
import { useState } from 'react';

interface PhaseManagerProps {
  phases: GamePhase[];
  onAddPhase: () => void;
  onUpdatePhase: (phaseId: string, updates: Partial<GamePhase>) => void;
  onRemovePhase: (phaseId: string) => void;
  onReorderPhases: (phaseIds: string[]) => void;
  onSelectPhase: (phaseId: string | null) => void;
  selectedPhaseId: string | null;
}

export default function PhaseManager({
  phases,
  onAddPhase,
  onRemovePhase,
  onReorderPhases,
  onSelectPhase,
  selectedPhaseId,
}: PhaseManagerProps) {
  const [draggedPhaseId, setDraggedPhaseId] = useState<string | null>(null);

  const handleDragStart = (phaseId: string) => {
    setDraggedPhaseId(phaseId);
  };

  const handleDragOver = (e: React.DragEvent, targetPhaseId: string) => {
    e.preventDefault();
    if (!draggedPhaseId || draggedPhaseId === targetPhaseId) return;

    const draggedIndex = phases.findIndex((p) => p.id === draggedPhaseId);
    const targetIndex = phases.findIndex((p) => p.id === targetPhaseId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...phases];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    onReorderPhases(newOrder.map((p) => p.id));
  };

  const handleDragEnd = () => {
    setDraggedPhaseId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-cyan-400">Phases</h3>
        <button
          onClick={onAddPhase}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-mono"
        >
          + Add Phase
        </button>
      </div>

      {phases.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border border-dashed border-gray-600 rounded">
          No phases yet. Click &quot;Add Phase&quot; to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {phases
            .sort((a, b) => a.order - b.order)
            .map((phase) => (
              <div
                key={phase.id}
                draggable
                onDragStart={() => handleDragStart(phase.id)}
                onDragOver={(e) => handleDragOver(e, phase.id)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectPhase(phase.id)}
                className={`p-4 border rounded cursor-pointer transition-colors ${
                  selectedPhaseId === phase.id
                    ? 'border-cyan-500 bg-cyan-900/20'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 font-mono">Phase {phase.order + 1}</span>
                      <h4 className="text-lg font-bold text-cyan-300">{phase.name}</h4>
                    </div>
                    {phase.description && <p className="text-sm text-gray-400 mb-2">{phase.description}</p>}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{phase.questions.length} questions</span>
                      <span>
                        {phase.questions.reduce((sum, q) => sum + q.points, 0)} points total
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePhase(phase.id);
                      }}
                      className="px-3 py-1 bg-red-900 hover:bg-red-800 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
