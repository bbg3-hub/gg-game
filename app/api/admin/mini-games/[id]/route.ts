import { NextRequest, NextResponse } from 'next/server';
import { type MiniGameConfig } from '@/lib/mini-games';

// In-memory storage (in a real app, this would be a database)
let miniGames: MiniGameConfig[] = [];

// GET /api/admin/mini-games/[id] - Get mini-game details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const miniGame = miniGames.find(game => game.id === id);
    
    if (!miniGame) {
      return NextResponse.json(
        { success: false, error: 'Mini-game not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      miniGame,
    });
  } catch (error) {
    console.error('Failed to get mini-game:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve mini-game' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/mini-games/[id] - Update mini-game
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const adminId = body.adminId;
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin ID required' },
        { status: 400 }
      );
    }
    
    const { id } = await context.params;
    const gameIndex = miniGames.findIndex(game => game.id === id);
    
    if (gameIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Mini-game not found' },
        { status: 404 }
      );
    }
    
    const existingGame = miniGames[gameIndex];
    
    // Update allowed fields
    const updatedGame = {
      ...existingGame,
      title: body.title ?? existingGame.title,
      description: body.description ?? existingGame.description,
      difficulty: body.difficulty ?? existingGame.difficulty,
      timeLimit: body.timeLimit ?? existingGame.timeLimit,
      maxAttempts: body.maxAttempts ?? existingGame.maxAttempts,
      scoringSystem: body.scoringSystem ?? existingGame.scoringSystem,
      visualTheme: body.visualTheme ?? existingGame.visualTheme,
      sounds: body.sounds ?? existingGame.sounds,
      assets: body.assets ?? existingGame.assets,
      successThreshold: body.successThreshold ?? existingGame.successThreshold,
      failureThreshold: body.failureThreshold ?? existingGame.failureThreshold,
      config: body.config ?? existingGame.config,
      updatedAt: Date.now(),
    };
    
    miniGames[gameIndex] = updatedGame;
    
    return NextResponse.json({
      success: true,
      miniGame: updatedGame,
    });
  } catch (error) {
    console.error('Failed to update mini-game:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update mini-game' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/mini-games/[id] - Delete mini-game
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin ID required' },
        { status: 400 }
      );
    }
    
    const { id } = await context.params;
    const gameIndex = miniGames.findIndex(game => game.id === id);
    
    if (gameIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Mini-game not found' },
        { status: 404 }
      );
    }
    
    miniGames.splice(gameIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Mini-game deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete mini-game:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete mini-game' },
      { status: 500 }
    );
  }
}