import { NextRequest, NextResponse } from 'next/server';
import { createBucketClient } from '@cosmicjs/sdk';

// Validate bucket configuration
const bucketSlug = process.env.COSMIC_BUCKET_SLUG;
const readKey = process.env.COSMIC_READ_KEY;
const writeKey = process.env.COSMIC_WRITE_KEY;

if (bucketSlug !== 'coffee-closers-production') {
  console.warn(`Warning: Expected bucket slug "coffee-closers-production" but got "${bucketSlug}"`);
}

const cosmic = createBucketClient({
  bucketSlug: bucketSlug || '',
  readKey: readKey || '',
  writeKey: writeKey || '',
});

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();

    console.log('Setting up profile in bucket:', bucketSlug);

    // Create user profile in Cosmic
    const response = await cosmic.objects.insertOne({
      title: profileData.full_name,
      type: 'user-profiles',
      slug: profileData.full_name.toLowerCase().replace(/\s+/g, '-'),
      metadata: {
        full_name: profileData.full_name,
        email: profileData.email || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        coffee_preference: profileData.coffee_preference || '',
        expertise: profileData.expertise || [],
        communication_style: profileData.communication_style || '',
        availability: profileData.availability || '',
        phone: profileData.phone || '',
        linkedin: profileData.linkedin || '',
        twitter: profileData.twitter || '',
        website: profileData.website || '',
        interests: profileData.interests || [],
        preferred_meeting_location: profileData.preferred_meeting_location || '',
        years_experience: profileData.years_experience || '',
        company: profileData.company || '',
        role: profileData.role || '',
        seeking_mentor: profileData.seeking_mentor || false,
        willing_to_mentor: profileData.willing_to_mentor || false,
        open_to_collaborations: profileData.open_to_collaborations || false,
        async_communication: profileData.async_communication || false,
        status: 'Active',
        profile_complete: true
      },
    });

    console.log('Profile created successfully in coffee-closers-production bucket:', {
      id: response.object?.id,
      slug: response.object?.slug
    });

    return NextResponse.json({ 
      success: true, 
      profileId: response.object?.id 
    });

  } catch (error) {
    console.error('Profile setup error:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}