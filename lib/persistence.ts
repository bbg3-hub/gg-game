// Enhanced persistence and backup management system
import type { GameSession } from './gameSession';

export interface SavedGameState {
  id: string;
  sessionId: string;
  playerId: string;
  adminId: string;
  gameData: {
    currentStep: string;
    completedSteps: string[];
    score: number;
    timeRemaining: number;
    sanityLevel?: number;
    hintsUsed: number;
    attempts: Record<string, number>;
    customData?: Record<string, unknown>;
  };
  metadata: {
    title: string;
    description?: string;
    difficulty: number;
    gameType: 'horror' | 'educational' | 'mixed';
    totalDuration: number;
    savePoint: string; // human-readable description of save point
  };
  createdAt: number;
  updatedAt: number;
  autoSaved: boolean;
}

export interface BackupData {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  gameStates: SavedGameState[];
  sessions: GameSession[];
  metadata: {
    totalGames: number;
    totalSessions: number;
    size: number; // bytes
    createdAt: number;
    version: string; // data format version
  };
  integrity: {
    checksum: string;
    encrypted: boolean;
  };
}

export interface PersistenceSettings {
  autoSave: boolean;
  autoSaveInterval: number; // minutes
  maxAutoSaves: number; // per game
  retentionDays: number; // how long to keep auto-saves
  enableBackups: boolean;
  backupFrequency: 'daily' | 'weekly' | 'manual';
  backupLocation: 'local' | 'cloud';
  encryptionEnabled: boolean;
  compressionEnabled: boolean;
}

export interface DatabaseStats {
  totalSavedGames: number;
  totalSessions: number;
  totalBackups: number;
  storageUsed: number; // bytes
  oldestSave: number;
  newestSave: number;
  avgGameDuration: number;
  mostActiveGameTypes: {
    type: string;
    count: number;
  }[];
  gamesByDifficulty: {
    difficulty: number;
    count: number;
  }[];
}

// Default persistence settings
export const DEFAULT_PERSISTENCE_SETTINGS: PersistenceSettings = {
  autoSave: true,
  autoSaveInterval: 5, // every 5 minutes
  maxAutoSaves: 10,
  retentionDays: 30,
  enableBackups: true,
  backupFrequency: 'weekly',
  backupLocation: 'local',
  encryptionEnabled: false,
  compressionEnabled: true,
};

// In-memory storage (in a real app, this would be a database)
const savedGames: SavedGameState[] = [];
const backups: BackupData[] = [];
let persistenceSettings: PersistenceSettings = { ...DEFAULT_PERSISTENCE_SETTINGS };

// Persistence operations
export class PersistenceManager {
  
  // Save game state
  static saveGameState(
    session: GameSession,
    gameData: SavedGameState['gameData'],
    metadata: SavedGameState['metadata'],
    adminId: string,
    autoSaved = false
  ): SavedGameState {
    const now = Date.now();
    const existingIndex = savedGames.findIndex(g => g.sessionId === session.id);
    
    const savedGame: SavedGameState = {
      id: existingIndex >= 0 ? savedGames[existingIndex].id : generateId(),
      sessionId: session.id,
      playerId: session.players[0]?.name || 'unknown',
      adminId,
      gameData,
      metadata,
      createdAt: existingIndex >= 0 ? savedGames[existingIndex].createdAt : now,
      updatedAt: now,
      autoSaved,
    };
    
    if (existingIndex >= 0) {
      savedGames[existingIndex] = savedGame;
    } else {
      savedGames.push(savedGame);
    }
    
    // Cleanup old auto-saves if limit exceeded
    if (autoSaved) {
      this.cleanupAutoSaves(session.id);
    }
    
    return savedGame;
  }
  
  // Load game state
  static loadGameState(sessionId: string): SavedGameState | null {
    return savedGames.find(g => g.sessionId === sessionId) || null;
  }
  
  // List saved games
  static listSavedGames(filters?: {
    adminId?: string;
    playerId?: string;
    gameType?: 'horror' | 'educational' | 'mixed';
    dateRange?: { start: number; end: number };
    autoSaved?: boolean;
  }): SavedGameState[] {
    let filtered = [...savedGames];
    
    if (filters) {
      if (filters.adminId) {
        filtered = filtered.filter(g => g.adminId === filters.adminId);
      }
      if (filters.playerId) {
        filtered = filtered.filter(g => g.playerId === filters.playerId);
      }
      if (filters.gameType) {
        filtered = filtered.filter(g => g.metadata.gameType === filters.gameType);
      }
      if (filters.dateRange) {
        filtered = filtered.filter(g => 
          g.createdAt >= filters.dateRange!.start && g.createdAt <= filters.dateRange!.end
        );
      }
      if (filters.autoSaved !== undefined) {
        filtered = filtered.filter(g => g.autoSaved === filters.autoSaved);
      }
    }
    
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  
  // Delete saved game
  static deleteSavedGame(gameId: string, adminId: string): boolean {
    const index = savedGames.findIndex(g => g.id === gameId && g.adminId === adminId);
    if (index >= 0) {
      savedGames.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // Create backup
  static createBackup(
    adminId: string,
    name: string,
    description?: string,
    includeSessions = true
  ): BackupData {
    const now = Date.now();
    const backupId = generateId();
    
    const backup: BackupData = {
      id: backupId,
      name,
      description,
      adminId,
      gameStates: [...savedGames.filter(g => g.adminId === adminId)],
      sessions: includeSessions ? this.getAllSessions() : [],
      metadata: {
        totalGames: savedGames.filter(g => g.adminId === adminId).length,
        totalSessions: includeSessions ? this.getAllSessions().length : 0,
        size: 0, // would be calculated in real implementation
        createdAt: now,
        version: '1.0',
      },
      integrity: {
        checksum: this.calculateChecksum([...savedGames]),
        encrypted: persistenceSettings.encryptionEnabled,
      },
    };
    
    backups.push(backup);
    return backup;
  }
  
  // List backups
  static listBackups(adminId: string): BackupData[] {
    return backups
      .filter(b => b.adminId === adminId)
      .sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
  }
  
  // Restore from backup
  static restoreFromBackup(backupId: string, adminId: string): {
    success: boolean;
    restoredGames: number;
    restoredSessions: number;
    error?: string;
  } {
    const backup = backups.find(b => b.id === backupId && b.adminId === adminId);
    if (!backup) {
      return {
        success: false,
        restoredGames: 0,
        restoredSessions: 0,
        error: 'Backup not found',
      };
    }
    
    // In a real implementation, this would validate the backup integrity
    try {
      // Merge saved games (don't overwrite existing)
      const existingSessionIds = new Set(savedGames.map(g => g.sessionId));
      const newGames = backup.gameStates.filter(g => !existingSessionIds.has(g.sessionId));
      savedGames.push(...newGames);
      
      // Merge sessions if included
      if (backup.sessions.length > 0) {
        this.mergeSessions(backup.sessions);
      }
      
      return {
        success: true,
        restoredGames: newGames.length,
        restoredSessions: backup.sessions.length,
      };
    } catch (error) {
      return {
        success: false,
        restoredGames: 0,
        restoredSessions: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  // Delete backup
  static deleteBackup(backupId: string, adminId: string): boolean {
    const index = backups.findIndex(b => b.id === backupId && b.adminId === adminId);
    if (index >= 0) {
      backups.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // Get database statistics
  static getDatabaseStats(adminId?: string): DatabaseStats {
    const relevantGames = adminId ? savedGames.filter(g => g.adminId === adminId) : savedGames;
    
    const gameTypes = relevantGames.reduce((acc, game) => {
      acc[game.metadata.gameType] = (acc[game.metadata.gameType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const difficultyDistribution = relevantGames.reduce((acc, game) => {
      const diff = game.metadata.difficulty;
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const durations = relevantGames.map(g => g.metadata.totalDuration);
    const avgDuration = durations.length > 0 
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
      : 0;
    
    return {
      totalSavedGames: relevantGames.length,
      totalSessions: this.getAllSessions().length,
      totalBackups: adminId ? backups.filter(b => b.adminId === adminId).length : backups.length,
      storageUsed: this.calculateStorageUsed(relevantGames),
      oldestSave: relevantGames.length > 0 ? Math.min(...relevantGames.map(g => g.createdAt)) : 0,
      newestSave: relevantGames.length > 0 ? Math.max(...relevantGames.map(g => g.createdAt)) : 0,
      avgGameDuration: Math.round(avgDuration),
      mostActiveGameTypes: Object.entries(gameTypes)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      gamesByDifficulty: Object.entries(difficultyDistribution)
        .map(([difficulty, count]) => ({ difficulty: parseInt(difficulty), count }))
        .sort((a, b) => a.difficulty - b.difficulty),
    };
  }
  
  // Update persistence settings
  static updateSettings(newSettings: Partial<PersistenceSettings>): void {
    persistenceSettings = { ...persistenceSettings, ...newSettings };
  }
  
  // Get current settings
  static getSettings(): PersistenceSettings {
    return { ...persistenceSettings };
  }
  
  // Cleanup old auto-saves
  private static cleanupAutoSaves(sessionId: string): void {
    const sessionAutoSaves = savedGames
      .filter(g => g.sessionId === sessionId && g.autoSaved)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    
    // Keep only the most recent auto-saves up to the limit
    const toDelete = sessionAutoSaves.slice(persistenceSettings.maxAutoSaves);
    toDelete.forEach(game => {
      const index = savedGames.findIndex(g => g.id === game.id);
      if (index >= 0) {
        savedGames.splice(index, 1);
      }
    });
  }
  
  // Calculate storage used
  private static calculateStorageUsed(games: SavedGameState[]): number {
    // Rough calculation - in real app would use actual byte size
    return games.length * 1024; // assume ~1KB per game
  }
  
  // Calculate checksum for integrity
  private static calculateChecksum(data: any[]): string {
    const jsonString = JSON.stringify(data);
    // Simple hash - in real app would use proper cryptographic hash
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
  
  // Get all sessions (would be from actual session store)
  private static getAllSessions(): GameSession[] {
    // This would integrate with the actual session store
    return [];
  }
  
  // Merge sessions from backup
  private static mergeSessions(backupSessions: GameSession[]): void {
    // This would merge sessions with existing session store
    // Implementation depends on actual session storage mechanism
  }
}

// Helper function to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Auto-save functionality
export class AutoSaveManager {
  private static intervals: Map<string, NodeJS.Timeout> = new Map();
  
  static startAutoSave(
    sessionId: string,
    getGameData: () => SavedGameState['gameData'],
    getMetadata: () => SavedGameState['metadata'],
    adminId: string
  ): void {
    if (!persistenceSettings.autoSave) return;
    
    // Clear existing interval if any
    this.stopAutoSave(sessionId);
    
    const interval = setInterval(() => {
      const gameData = getGameData();
      const metadata = getMetadata();
      
      // Get the session (would need to be passed or retrieved)
      const session: GameSession = {
        id: sessionId,
        gameCode: '',
        adminId: '',
        players: [],
        startTime: 0,
        oxygenMinutes: 120,
        status: 'waiting',
        finalEscapeCode: '',
        createdAt: Date.now(),
        customMorseWords: undefined,
        customGreekWords: undefined,
        customMaxMorseAttempts: undefined,
        customMaxMeaningAttempts: undefined,
        customOxygenMinutes: undefined,
        phases: undefined,
        title: undefined,
        description: undefined,
        settings: undefined,
      };
      
      PersistenceManager.saveGameState(
        session,
        gameData,
        metadata,
        adminId,
        true // auto-saved flag
      );
    }, persistenceSettings.autoSaveInterval * 60 * 1000); // convert minutes to ms
    
    this.intervals.set(sessionId, interval);
  }
  
  static stopAutoSave(sessionId: string): void {
    const interval = this.intervals.get(sessionId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(sessionId);
    }
  }
  
  static stopAllAutoSaves(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
}