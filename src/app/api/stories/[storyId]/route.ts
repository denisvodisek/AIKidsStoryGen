import { NextRequest, NextResponse } from 'next/server';
import { getStoryById, updateStoryPage } from '@/lib/supabase';

// GET /api/stories/[storyId] - Fetch story with pages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await params;

    console.log('storyId', storyId);

    if (!storyId) {
      return NextResponse.json(
        { error: 'Story ID is required' },
        { status: 400 }
      );
    }

    const { data: story, error } = await getStoryById(storyId);
    console.log('story', story);
    if (error) {
      console.error('Error fetching story:', error);
      return NextResponse.json(
        { error: 'Failed to fetch story' },
        { status: 500 }
      );
    }

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/stories/[storyId] - Update story content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await params;
    const body = await request.json();

    if (!storyId) {
      return NextResponse.json(
        { error: 'Story ID is required' },
        { status: 400 }
      );
    }

    const { pageUpdates, storyUpdates } = body;

    // Validate request body
    if (!pageUpdates && !storyUpdates) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    const results = [];

    // Update individual pages if provided
    if (pageUpdates && Array.isArray(pageUpdates)) {
      for (const update of pageUpdates) {
        const { pageId, content, photo_description, page_metadata } = update;

        if (!pageId) {
          continue; // Skip invalid updates
        }

        const { data, error } = await updateStoryPage(pageId, {
          content,
          photo_description,
          page_metadata,
        });

        if (error) {
          console.error(`Error updating page ${pageId}:`, error);
          results.push({
            pageId,
            success: false,
            error: String(error),
          });
        } else {
          results.push({ pageId, success: true, data });
        }
      }
    }

    // TODO: Add story-level updates if needed (title, metadata, etc.)
    // if (storyUpdates) {
    //   const { data, error } = await updateStory(storyId, storyUpdates);
    //   if (error) {
    //     return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
    //   }
    // }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(
      `Story ${storyId} updates: ${successCount} successful, ${failCount} failed`
    );

    return NextResponse.json({
      message: 'Story updated successfully',
      results,
      stats: {
        successful: successCount,
        failed: failCount,
        total: results.length,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
