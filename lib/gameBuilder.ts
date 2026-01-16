import { GameSession, GamePhase, Question } from './gameSession';

export function generateQuestionId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generatePhaseId(): string {
  return `ph-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createEmptyQuestion(): Question {
  return {
    id: generateQuestionId(),
    type: 'text',
    title: 'New Question',
    content: '',
    solution: '',
    difficulty: 'medium',
    points: 100,
    hints: [],
  };
}

export function createEmptyPhase(): GamePhase {
  return {
    id: generatePhaseId(),
    name: 'New Phase',
    description: '',
    questions: [],
    order: 0,
  };
}

export function addQuestionToPhase(phase: GamePhase, question: Question): GamePhase {
  return {
    ...phase,
    questions: [...phase.questions, question],
  };
}

export function updateQuestionInPhase(phase: GamePhase, questionId: string, updates: Partial<Question>): GamePhase {
  return {
    ...phase,
    questions: phase.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
  };
}

export function removeQuestionFromPhase(phase: GamePhase, questionId: string): GamePhase {
  return {
    ...phase,
    questions: phase.questions.filter((q) => q.id !== questionId),
  };
}

export function addPhaseToSession(session: GameSession, phase: GamePhase): GameSession {
  const phases = session.phases || [];
  const newPhase = { ...phase, order: phases.length };
  return {
    ...session,
    phases: [...phases, newPhase],
  };
}

export function updatePhaseInSession(session: GameSession, phaseId: string, updates: Partial<GamePhase>): GameSession {
  const phases = session.phases || [];
  return {
    ...session,
    phases: phases.map((p) => (p.id === phaseId ? { ...p, ...updates } : p)),
  };
}

export function removePhaseFromSession(session: GameSession, phaseId: string): GameSession {
  const phases = session.phases || [];
  return {
    ...session,
    phases: phases.filter((p) => p.id !== phaseId).map((p, idx) => ({ ...p, order: idx })),
  };
}

export function reorderPhases(session: GameSession, phaseIds: string[]): GameSession {
  const phases = session.phases || [];
  const phaseMap = new Map(phases.map((p) => [p.id, p]));
  const reordered = phaseIds
    .map((id) => phaseMap.get(id))
    .filter((p): p is GamePhase => p !== undefined)
    .map((p, idx) => ({ ...p, order: idx }));

  return {
    ...session,
    phases: reordered,
  };
}

export function validateQuestion(question: Question): string[] {
  const errors: string[] = [];

  if (!question.title?.trim()) {
    errors.push('Question title is required');
  }

  if (!question.content?.trim()) {
    errors.push('Question content is required');
  }

  if (!question.solution?.trim()) {
    errors.push('Question solution is required');
  }

  if (question.type === 'multiple-choice') {
    if (!question.options || question.options.length < 2) {
      errors.push('Multiple choice questions need at least 2 options');
    }

    if (question.options && !question.options.some((o) => o.isCorrect)) {
      errors.push('Multiple choice questions need at least one correct answer');
    }
  }

  if (question.points < 0) {
    errors.push('Points cannot be negative');
  }

  if (question.timeLimit !== undefined && question.timeLimit <= 0) {
    errors.push('Time limit must be positive');
  }

  if (question.maxAttempts !== undefined && question.maxAttempts <= 0) {
    errors.push('Max attempts must be positive');
  }

  return errors;
}

export function validatePhase(phase: GamePhase): string[] {
  const errors: string[] = [];

  if (!phase.name?.trim()) {
    errors.push('Phase name is required');
  }

  if (phase.questions.length === 0) {
    errors.push('Phase must have at least one question');
  }

  phase.questions.forEach((q, idx) => {
    const qErrors = validateQuestion(q);
    if (qErrors.length > 0) {
      errors.push(`Question ${idx + 1}: ${qErrors.join(', ')}`);
    }
  });

  return errors;
}

export function validateGameSession(session: GameSession): string[] {
  const errors: string[] = [];

  if (!session.phases || session.phases.length === 0) {
    errors.push('Game must have at least one phase');
  }

  session.phases?.forEach((phase, idx) => {
    const phaseErrors = validatePhase(phase);
    if (phaseErrors.length > 0) {
      errors.push(`Phase ${idx + 1} (${phase.name}): ${phaseErrors.join(', ')}`);
    }
  });

  return errors;
}

export function calculateTotalPoints(session: GameSession): number {
  if (!session.phases) return 0;
  return session.phases.reduce((total, phase) => {
    return total + phase.questions.reduce((phaseTotal, q) => phaseTotal + q.points, 0);
  }, 0);
}

export function calculatePhaseProgress(phase: GamePhase, questionProgress: Map<string, boolean>): number {
  if (phase.questions.length === 0) return 0;
  const completed = phase.questions.filter((q) => questionProgress.get(q.id) === true).length;
  return Math.round((completed / phase.questions.length) * 100);
}

const STORAGE_KEY = 'game-builder-sessions';

export function saveToLocalStorage(sessions: GameSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage(): GameSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
}

export function exportGameAsJSON(session: GameSession): string {
  return JSON.stringify(session, null, 2);
}

export function importGameFromJSON(json: string): GameSession | null {
  try {
    const session = JSON.parse(json);
    if (!session.id || !session.gameCode) {
      throw new Error('Invalid game session format');
    }
    return session;
  } catch (error) {
    console.error('Failed to import game:', error);
    return null;
  }
}
