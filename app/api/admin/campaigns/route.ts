import { NextRequest, NextResponse } from 'next/server';
import {
  createCampaignFromTemplate,
  type Campaign,
  generateId
} from '@/lib/campaigns';

// In-memory storage (in a real app, this would be a database)
let campaigns: Campaign[] = [];

// GET /api/admin/campaigns - List campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const theme = searchParams.get('theme');
    const active = searchParams.get('active');
    
    let filtered = [...campaigns];
    
    // Apply filters
    if (theme) {
      filtered = filtered.filter(campaign => campaign.theme === theme);
    }
    
    if (active !== null) {
      const isActive = active === 'true';
      filtered = filtered.filter(campaign => campaign.isActive === isActive);
    }
    
    // Sort by updated date (newest first)
    filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    
    return NextResponse.json({
      success: true,
      campaigns: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Failed to list campaigns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/admin/campaigns - Create campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      theme = 'mixed',
      levels,
      difficulty = 5,
      tags = [],
      preview,
      adminId,
    } = body;
    
    // Validation
    if (!name || !description || !levels || !adminId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, levels, adminId' },
        { status: 400 }
      );
    }
    
    const validThemes = ['horror', 'educational', 'mixed', 'sci-fi', 'fantasy', 'casual'];
    if (!validThemes.includes(theme)) {
      return NextResponse.json(
        { success: false, error: 'Invalid theme' },
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
    const newCampaign: Campaign = {
      id: generateId(),
      name,
      description,
      theme,
      levels,
      totalDuration: levels.reduce((total: number, level: any) => total + (level.estimatedDuration || 0), 0),
      difficulty,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      tags,
      preview,
    };
    
    campaigns.push(newCampaign);
    
    return NextResponse.json({
      success: true,
      campaign: newCampaign,
    });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}