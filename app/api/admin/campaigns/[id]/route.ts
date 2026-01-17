import { NextRequest, NextResponse } from 'next/server';
import { type Campaign } from '@/lib/campaigns';

// In-memory storage (in a real app, this would be a database)
let campaigns: Campaign[] = [];

// GET /api/admin/campaigns/[id] - Get campaign details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const campaign = campaigns.find(c => c.id === id);
    
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Failed to get campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve campaign' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/campaigns/[id] - Update campaign
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
    const campaignIndex = campaigns.findIndex(c => c.id === id);
    
    if (campaignIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    const existingCampaign = campaigns[campaignIndex];
    
    // Update allowed fields
    const updatedCampaign = {
      ...existingCampaign,
      name: body.name ?? existingCampaign.name,
      description: body.description ?? existingCampaign.description,
      theme: body.theme ?? existingCampaign.theme,
      levels: body.levels ?? existingCampaign.levels,
      difficulty: body.difficulty ?? existingCampaign.difficulty,
      isActive: body.isActive ?? existingCampaign.isActive,
      tags: body.tags ?? existingCampaign.tags,
      preview: body.preview ?? existingCampaign.preview,
      updatedAt: Date.now(),
    };
    
    // Recalculate total duration if levels changed
    if (body.levels) {
      updatedCampaign.totalDuration = updatedCampaign.levels.reduce(
        (total: number, level: any) => total + (level.estimatedDuration || 0), 
        0
      );
    }
    
    campaigns[campaignIndex] = updatedCampaign;
    
    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
    });
  } catch (error) {
    console.error('Failed to update campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/campaigns/[id] - Delete campaign
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
    const campaignIndex = campaigns.findIndex(c => c.id === id);
    
    if (campaignIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    campaigns.splice(campaignIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}