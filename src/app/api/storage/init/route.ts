import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(
      bucket => bucket.name === 'aikidsstorygen'
    );

    if (!bucketExists) {
      console.log('Creating aikidsstorygen bucket...');
      const { error: bucketError } = await supabaseAdmin.storage.createBucket(
        'aikidsstorygen',
        {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 10485760, // 10MB
        }
      );

      if (bucketError) {
        console.error('Bucket creation error:', bucketError);
        return NextResponse.json(
          { error: bucketError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'Bucket created successfully' });
    }

    return NextResponse.json({ message: 'Bucket already exists' });
  } catch (error) {
    console.error('Storage initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize storage' },
      { status: 500 }
    );
  }
}
