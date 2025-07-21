import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'ai-kids-story-gen',
    },
  },
});

// Server-side client for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Auth helpers
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Photo upload helpers
export const uploadChildPhoto = async (file: File, userId?: string) => {
  try {
    // Validate file
    if (!file || file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return { data: null, error: new Error('File too large or invalid') };
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `child-photos/${fileName}`;

    // console.log('Uploading file:', {
    //   fileName,
    //   size: file.size,
    //   type: file.type,
    // });

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('aikidsstorygen')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error details:', error);
      return { data: null, error };
    }

    // Get signed URL that expires in 1 day (86400 seconds)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('aikidsstorygen')
      .createSignedUrl(filePath, 86400);

    if (urlError) {
      console.error('Signed URL creation error:', urlError);
      return { data: null, error: urlError };
    }

    const signedUrl = signedUrlData?.signedUrl;
    if (!signedUrl) {
      return { data: null, error: new Error('Failed to create signed URL') };
    }

    console.log('Upload successful:', { path: filePath, signedUrl });

    return {
      data: {
        path: filePath,
        publicUrl: signedUrl,
        fileName,
      },
      error: null,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { data: null, error };
  }
};

export const deleteChildPhoto = async (filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from('aikidsstorygen')
      .remove([filePath]);

    return { error };
  } catch (error) {
    console.error('Delete error:', error);
    return { error };
  }
};

export const createSignedUrlForPhoto = async (
  filePath: string,
  expiresInSeconds: number = 86400
) => {
  try {
    const { data, error } = await supabase.storage
      .from('aikidsstorygen')
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      console.error('Signed URL creation error:', error);
      return { data: null, error };
    }

    return {
      data: {
        signedUrl: data?.signedUrl,
        expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
      },
      error: null,
    };
  } catch (error) {
    console.error('Signed URL error:', error);
    return { data: null, error };
  }
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
};

// Story image storage helpers
export const storeStoryImage = async (
  imageData: string,
  storyId: string,
  pageNumber: number
) => {
  try {
    // Validate image data
    if (!imageData || !storyId) {
      return { data: null, error: new Error('Missing image data or story ID') };
    }

    // Convert base64 to blob
    const base64Response = await fetch(`data:image/jpeg;base64,${imageData}`);
    const blob = await base64Response.blob();

    // Validate blob size (10MB limit)
    if (blob.size > 10 * 1024 * 1024) {
      return { data: null, error: new Error('Image too large (max 10MB)') };
    }

    // Generate filename with story ID and page number
    const fileName = `page-${pageNumber.toString().padStart(2, '0')}.jpg`;
    const filePath = `story-images/${storyId}/${fileName}`;

    console.log('Storing story image:', {
      storyId,
      pageNumber,
      fileName,
      size: blob.size,
      path: filePath,
    });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('aikids-public')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting if image already exists
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Story image upload error:', error);
      return { data: null, error };
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = await supabase.storage
      .from('aikids-public')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
      return {
        data: null,
        error: new Error('Failed to create signed URL for story image'),
      };
    }

    console.log('Story image upload successful:', {
      path: filePath,
      publicUrl,
    });

    return {
      data: {
        path: filePath,
        publicUrl,
        fileName,
        storyId,
        pageNumber,
      },
      error: null,
    };
  } catch (error) {
    console.error('Story image storage error:', error);
    return { data: null, error };
  }
};

export const deleteStoryImages = async (storyId: string) => {
  try {
    // List all files in the story folder
    const { data: files, error: listError } = await supabase.storage
      .from('aikidsstorygen')
      .list(`story-images/${storyId}`);

    if (listError) {
      console.error('Error listing story images:', listError);
      return { error: listError };
    }

    if (!files || files.length === 0) {
      return { error: null }; // No files to delete
    }

    // Delete all files in the story folder
    const filePaths = files.map(file => `story-images/${storyId}/${file.name}`);
    const { error } = await supabase.storage
      .from('aikidsstorygen')
      .remove(filePaths);

    if (error) {
      console.error('Error deleting story images:', error);
    }

    return { error };
  } catch (error) {
    console.error('Story image deletion error:', error);
    return { error };
  }
};

// =============================================================================
// DATABASE PERSISTENCE FUNCTIONS
// =============================================================================

// Onboarding Sessions
export const saveOnboardingSession = async (sessionData: {
  session_token: string;
  onboarding_data: any;
  current_step?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('onboarding_sessions')
      .upsert([sessionData], {
        onConflict: 'session_token',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving onboarding session:', error);
      return { data: null, error };
    }

    console.log('Onboarding session saved successfully:', data.id);
    return { data, error: null };
  } catch (error) {
    console.error('Onboarding session save error:', error);
    return { data: null, error };
  }
};

export const getOnboardingSession = async (sessionToken: string) => {
  try {
    const { data, error } = await supabase
      .from('onboarding_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single();

    if (error && error.code !== 'PGRST116') {
      // Ignore "not found" errors
      console.error('Error getting onboarding session:', error);
      return { data: null, error };
    }

    return { data: data || null, error: null };
  } catch (error) {
    console.error('Get onboarding session error:', error);
    return { data: null, error };
  }
};

// Characters
export const saveCharacterAnalysis = async (characterData: {
  character_name: string;
  character_age: string;
  character_gender: string;
  physical_characteristics: any;
  description: string;
  generation_params?: any;
  avatar_data?: any;
}) => {
  try {
    const { data, error } = await supabase
      .from('characters')
      .insert([characterData])
      .select()
      .single();

    if (error) {
      console.error('Error saving character analysis:', error);
      return { data: null, error };
    }

    console.log('Character analysis saved successfully:', data.id);
    return { data, error: null };
  } catch (error) {
    console.error('Character analysis save error:', error);
    return { data: null, error };
  }
};

export const getCharacterById = async (characterId: string) => {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single();

    if (error) {
      console.error('Error getting character:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Get character error:', error);
    return { data: null, error };
  }
};

// Stories
export const saveStory = async (storyData: {
  story_title: string;
  generation_params: any;
  photo_generation_stats?: any;
  generation_state?: any;
}) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .insert([storyData])
      .select()
      .single();

    if (error) {
      console.error('Error saving story:', error);
      return { data: null, error };
    }

    console.log('Story saved successfully:', data.id);
    return { data, error: null };
  } catch (error) {
    console.error('Story save error:', error);
    return { data: null, error };
  }
};

export const updateStory = async (
  storyId: string,
  updates: {
    story_title?: string;
    generation_params?: any;
    photo_generation_stats?: any;
    generation_state?: any;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .update(updates)
      .eq('id', storyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating story:', error);
      return { data: null, error };
    }

    console.log('Story updated successfully:', data.id);
    return { data, error: null };
  } catch (error) {
    console.error('Story update error:', error);
    return { data: null, error };
  }
};

export const getStoryById = async (storyId: string) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(
        `
        *,
        story_pages (
          id,
          page_number,
          page_type,
          chapter_title,
          content,
          reasoning,
          photo_description,
          photo_data,
          photo_url,
          image_generation_params,
          page_metadata,
          created_at
        )
      `
      )
      .eq('id', storyId)
      .single();

    if (error) {
      console.error('Error getting story:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Get story error:', error);
    return { data: null, error };
  }
};

// Story Pages
export const saveStoryPages = async (
  storyId: string,
  pages: Array<{
    page_number: number;
    page_type: 'cover' | 'table_of_contents' | 'story_page';
    chapter_title?: string;
    content: string;
    reasoning: string;
    photo_description: string;
    photo_data?: string;
    photo_url?: string;
    image_generation_params?: any;
    page_metadata?: any;
  }>
) => {
  try {
    // Add story_id to each page
    const pagesWithStoryId = pages.map(page => ({
      ...page,
      story_id: storyId,
    }));

    const { data, error } = await supabase
      .from('story_pages')
      .insert(pagesWithStoryId)
      .select();

    if (error) {
      console.error('Error saving story pages:', error);
      return { data: null, error };
    }

    console.log(
      `${pages.length} story pages saved successfully for story ${storyId}`
    );
    return { data, error: null };
  } catch (error) {
    console.error('Story pages save error:', error);
    return { data: null, error };
  }
};

export const updateStoryPage = async (
  pageId: string,
  updates: {
    content?: string;
    reasoning?: string;
    photo_description?: string;
    photo_data?: string;
    photo_url?: string;
    image_generation_params?: any;
    page_metadata?: any;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('story_pages')
      .update(updates)
      .eq('id', pageId)
      .select()
      .single();

    if (error) {
      console.error('Error updating story page:', error);
      return { data: null, error };
    }

    console.log('Story page updated successfully:', data.id);
    return { data, error: null };
  } catch (error) {
    console.error('Story page update error:', error);
    return { data: null, error };
  }
};

// Batch update story pages with photo URLs
export const updateStoryPagesWithImages = async (
  storyId: string,
  pageUpdates: Array<{
    page_number: number;
    photo_url: string | null;
    photo_data?: string;
  }>
) => {
  try {
    console.log(
      `📸 Updating ${pageUpdates.length} story pages with image URLs for story ${storyId}`
    );

    const updatePromises = pageUpdates.map(async update => {
      const { data, error } = await supabase
        .from('story_pages')
        .update({
          photo_url: update.photo_url,
          photo_data: update.photo_data || null,
        })
        .eq('story_id', storyId)
        .eq('page_number', update.page_number)
        .select();

      if (error) {
        console.error(`Error updating page ${update.page_number}:`, error);
        return { page_number: update.page_number, success: false, error };
      }

      console.log(
        `✅ Updated page ${update.page_number} with photo_url:`,
        update.photo_url
      );
      return { page_number: update.page_number, success: true, data };
    });

    const results = await Promise.all(updatePromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(
      `📊 Page updates complete: ${successful} successful, ${failed} failed`
    );

    return {
      data: results,
      error: null,
      stats: { successful, failed, total: pageUpdates.length },
    };
  } catch (error) {
    console.error('Batch update story pages error:', error);
    return {
      data: null,
      error,
      stats: {
        successful: 0,
        failed: pageUpdates.length,
        total: pageUpdates.length,
      },
    };
  }
};

// Utility Functions
export const generateSessionToken = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getAllStoriesByUser = async (userId?: string) => {
  try {
    // For now, get all stories since we don't have user auth yet
    const { data, error } = await supabase
      .from('stories')
      .select(
        `
        *,
        story_pages!inner (
          id,
          page_number,
          page_type,
          content,
          photo_url
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting stories:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Get stories error:', error);
    return { data: null, error };
  }
};
