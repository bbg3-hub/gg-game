import { NextRequest, NextResponse } from 'next/server';
import { 
  generateMiniGameId, 
  type MiniGameConfig,
  type MiniGameType 
} from '@/lib/mini-games';

// In-memory storage (in a real app, this would be a database)
let miniGames: MiniGameConfig[] = [];

// GET /api/admin/mini-games - List mini-games
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const type = searchParams.get('type') as MiniGameType | null;
    const difficulty = searchParams.get('difficulty');
    const published = searchParams.get('published');
    
    let filtered = [...miniGames];
    
    // Apply filters
    if (type) {
      filtered = filtered.filter(game => game.type === type);
    }
    
    if (difficulty) {
      const diff = parseInt(difficulty);
      filtered = filtered.filter(game => game.difficulty === diff);
    }
    
    if (published !== null) {
      const isPublished = published === 'true';
      filtered = filtered.filter(game => game.published === isPublished);
    }
    
    // Sort by updated date (newest first)
    filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    
    return NextResponse.json({
      success: true,
      miniGames: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Failed to list mini-games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve mini-games' },
      { status: 500 }
    );
  }
}

// POST /api/admin/mini-games - Create mini-game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      difficulty = 5,
      timeLimit,
      maxAttempts,
      scoringSystem,
      visualTheme,
      sounds,
      assets = [],
      successThreshold,
      failureThreshold,
      config,
      adminId,
    } = body;
    
    // Validation
    if (!title || !description || !type || !adminId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const validTypes: MiniGameType[] = [
      'click-targets',
      'memory-match', 
      'sequence-puzzle',
      'timing-challenge',
      'pattern-recognition',
      'math-mini-game',
      'sorting-game',
      'reaction-test',
    ];
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mini-game type' },
        { status: 400 }
      );
    }
    
    if (difficulty < 1 || difficulty > 10) {
      return NextResponse.json(
        { success: false, error: 'Difficulty must be between 1 and 10' },
        { status: 400 }
      );
    }
    
    const now = Date.now();
    const newMiniGame: MiniGameConfig = {
      id: generateMiniGameId(),
      title,
      description,
      type,
      difficulty,
      timeLimit,
      maxAttempts,
      scoringSystem: scoringSystem || {
        basePoints: 10,
        timeMultiplier: true,
        difficultyBonus: true,
      },
      visualTheme: visualTheme || {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF', 
        backgroundColor: '#F8FAFC',
        textColor: '#1E293B',
        accentColor: '#F59E0B',
      },
      sounds: sounds || {},
      assets,
      successThreshold: successThreshold || 80,
      failureThreshold,
      config: config || {},
      createdAt: now,
      updatedAt: now,
      published: false,
    } as MiniGameConfig;
    
    miniGames.push(newMiniGame);
    
    return NextResponse.json({
      success: true,
      miniGame: newMiniGame,
    });
  } catch (error) {
    console.error('Failed to create mini-game:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create mini-game' },
      { status: 500 }
    );
  }
}