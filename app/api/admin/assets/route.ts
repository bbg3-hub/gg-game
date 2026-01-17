import { NextRequest, NextResponse } from 'next/server';
import type { MiniGameAsset } from '@/lib/mini-games';

// In-memory storage (in a real app, this would be a database or file system)
let assets: MiniGameAsset[] = [];

// GET /api/admin/assets - List assets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const type = searchParams.get('type') as 'image' | 'audio' | null;
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin ID required' },
        { status: 400 }
      );
    }

    let filtered = [...assets];
    
    // Apply type filter
    if (type) {
      filtered = filtered.filter(asset => asset.type === type);
    }
    
    // Sort by upload date (newest first)
    filtered.sort((a, b) => b.uploadedAt - a.uploadedAt);
    
    return NextResponse.json({
      success: true,
      assets: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Failed to list assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve assets' },
      { status: 500 }
    );
  }
}

// POST /api/admin/assets/upload - Upload new assets
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const adminId = formData.get('adminId') as string | null;
    
    if (!file || !adminId) {
      return NextResponse.json(
        { success: false, error: 'File and Admin ID required' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images and audio files are allowed.' },
        { status: 400 }
      );
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum 10MB allowed.' },
        { status: 400 }
      );
    }
    
    // In a real application, you would:
    // 1. Upload the file to a storage service (AWS S3, Cloudinary, etc.)
    // 2. Get the public URL
    // 3. Save metadata to database
    
    // For this demo, we'll simulate the upload
    const assetType = file.type.startsWith('image/') ? 'image' : 'audio';
    const assetId = generateAssetId();
    const assetUrl = `/admin-uploads/${assetType}s/${assetId}-${file.name}`;
    
    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAsset: MiniGameAsset = {
      id: assetId,
      type: assetType,
      url: assetUrl,
      name: file.name,
      size: file.size,
      uploadedAt: Date.now(),
    };
    
    assets.push(newAsset);
    
    return NextResponse.json({
      success: true,
      asset: newAsset,
      message: 'Asset uploaded successfully',
    });
  } catch (error) {
    console.error('Failed to upload asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload asset' },
      { status: 500 }
    );
  }
}

// Helper function to generate asset ID
function generateAssetId(): string {
  return `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}