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

    console.log('Uploading file:', {
      fileName,
      size: file.size,
      type: file.type,
    });

    // Note: Bucket should be created manually in Supabase dashboard or via server-side API

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

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('aikidsstorygen').getPublicUrl(filePath);

    console.log('Upload successful:', { path: filePath, publicUrl });

    return {
      data: {
        path: filePath,
        publicUrl,
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

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
};
