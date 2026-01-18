import { NextRequest, NextResponse } from 'next/server';
import type { MiniGameAsset } from '@/lib/mini-games';

// In-memory storage
let assets: MiniGameAsset[] = [];

// DELETE /api/admin/assets/[assetId] - Delete asset
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ assetId: string }> }
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
    
    const { assetId } = await context.params;
    const assetIndex = assets.findIndex(asset => asset.id === assetId);
    
    if (assetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    // In a real application, you would also:
    // 1. Delete the actual file from storage
    // 2. Clean up any references in other systems
    
    assets.splice(assetIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}