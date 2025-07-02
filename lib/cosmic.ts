import { createBucketClient } from '@cosmicjs/sdk'
import type { 
  UserProfile, 
  CoffeeChatSession, 
  BlogPost, 
  Testimonial, 
  Announcement, 
  FAQItem, 
  StaticPage,
  CosmicResponse 
} from '@/types'

// Debug environment variables - CRITICAL for debugging signup issues
console.log('=== COSMIC ENVIRONMENT DEBUG ===')
console.log('COSMIC_BUCKET_SLUG:', process.env.COSMIC_BUCKET_SLUG ? `SET (${process.env.COSMIC_BUCKET_SLUG})` : 'MISSING')
console.log('COSMIC_READ_KEY:', process.env.COSMIC_READ_KEY ? `SET (${process.env.COSMIC_READ_KEY.substring(0, 10)}...)` : 'MISSING')
console.log('COSMIC_WRITE_KEY:', process.env.COSMIC_WRITE_KEY ? `SET (${process.env.COSMIC_WRITE_KEY.substring(0, 10)}...)` : 'MISSING')
console.log('================================')

// Validate required environment variables
if (!process.env.COSMIC_BUCKET_SLUG) {
  throw new Error('COSMIC_BUCKET_SLUG environment variable is required')
}

if (!process.env.COSMIC_READ_KEY) {
  throw new Error('COSMIC_READ_KEY environment variable is required')
}

if (!process.env.COSMIC_WRITE_KEY) {
  throw new Error('COSMIC_WRITE_KEY environment variable is required')
}

// The correct bucket ID based on the API responses
const EXPECTED_BUCKET_ID = '68507c30d8593624e0a9fbbb'

if (process.env.COSMIC_BUCKET_SLUG !== EXPECTED_BUCKET_ID) {
  console.warn(`WARNING: Expected bucket ID "${EXPECTED_BUCKET_ID}" but got "${process.env.COSMIC_BUCKET_SLUG}"`)
  console.warn('Make sure your COSMIC_BUCKET_SLUG uses the bucket ID, not the human-readable slug')
}

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
  apiEnvironment: "staging"
})

// Test connection function with detailed error reporting
export async function testCosmicConnection(): Promise<boolean> {
  try {
    console.log('Testing Cosmic connection...')
    console.log('Using bucket slug:', process.env.COSMIC_BUCKET_SLUG)
    const response = await cosmic.objects.find({ type: 'user-profiles' }).limit(1)
    console.log('Cosmic connection successful!')
    return true
  } catch (error: any) {
    console.error('Cosmic connection failed:', {
      message: error.message,
      status: error.status,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG,
      fullError: error
    })
    return false
  }
}

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// User Profiles with enhanced error handling
export async function getUserProfiles(): Promise<UserProfile[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'user-profiles' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as UserProfile[];
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch user profiles');
  }
}

export async function getUserProfile(slug: string): Promise<UserProfile | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'user-profiles',
      slug
    }).depth(1);
    return response.object as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch user profile');
  }
}

export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'user-profiles',
      'metadata.email_address': email
    }).depth(1);
    return response.object as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile by email:', error);
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch user profile by email');
  }
}

// Create user profile with detailed error logging - updated for correct schema
export async function createUserProfile(userData: {
  title: string;
  slug: string;
  metadata: {
    full_name: string;
    email_address: string;
    current_role: string;
    company: string;
    timezone?: {
      key: string;
      value: string;
    };
    seniority_level?: {
      key: string;
      value: string;
    };
    sales_focus?: {
      key: string;
      value: string;
    };
    industry_vertical?: {
      key: string;
      value: string;
    };
    preferred_chat_times?: string[];
    topics_to_discuss?: string[];
    async_communication?: boolean;
    profile_complete?: boolean;
    account_status?: {
      key: string;
      value: string;
    };
    bio?: string;
    fun_fact?: string;
    linkedin_url?: string;
  };
}): Promise<UserProfile> {
  try {
    console.log('Creating user profile for:', userData.metadata.email_address);
    const response = await cosmic.objects.insertOne({
      type: 'user-profiles',
      title: userData.title,
      slug: userData.slug,
      status: 'published',
      metadata: userData.metadata
    });
    console.log('User profile created successfully:', response.object.id);
    return response.object as UserProfile;
  } catch (error: any) {
    console.error('Error creating user profile:', {
      message: error.message,
      status: error.status,
      email: userData.metadata.email_address,
      fullError: error
    });
    throw new Error(`Failed to create user profile: ${error.message}`);
  }
}

// Coffee Chat Sessions
export async function getCoffeeChatSessions(): Promise<CoffeeChatSession[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'coffee-chat-sessions' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as CoffeeChatSession[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch coffee chat sessions');
  }
}

export async function getCoffeeChatSession(slug: string): Promise<CoffeeChatSession | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'coffee-chat-sessions',
      slug
    }).depth(1);
    return response.object as CoffeeChatSession;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch coffee chat session');
  }
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'blog-posts',
        'metadata.published': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as BlogPost[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch blog posts');
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'blog-posts',
      slug
    }).depth(1);
    return response.object as BlogPost;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch blog post');
  }
}

export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'blog-posts',
        'metadata.published': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit);
    return response.objects as BlogPost[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch latest blog posts');
  }
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'testimonials',
        'metadata.approved_public': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as Testimonial[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch testimonials');
  }
}

// Announcements
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'announcements' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as Announcement[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch announcements');
  }
}

// FAQ Items
export async function getFAQItems(): Promise<FAQItem[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'faq-items' })
      .props(['id', 'title', 'slug', 'metadata']);
    return response.objects as FAQItem[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch FAQ items');
  }
}

// Static Pages
export async function getStaticPage(slug: string): Promise<StaticPage | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'static-pages',
      slug
    });
    return response.object as StaticPage;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch static page');
  }
}