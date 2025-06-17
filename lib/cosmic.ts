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

// Validate that we're using the correct bucket
if (process.env.COSMIC_BUCKET_SLUG !== 'coffee-closers-production') {
  console.warn(`WARNING: Expected bucket slug "coffee-closers-production" but got "${process.env.COSMIC_BUCKET_SLUG}"`)
}

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
})

// Test connection function
export async function testCosmicConnection(): Promise<boolean> {
  try {
    console.log('Testing Cosmic connection...')
    const response = await cosmic.objects.find({ type: 'user-profiles' }).limit(1)
    console.log('Cosmic connection successful!')
    return true
  } catch (error: any) {
    console.error('Cosmic connection failed:', {
      message: error.message,
      status: error.status,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
    })
    return false
  }
}

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// User Profiles
export async function getUserProfiles(): Promise<UserProfile[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'user-profiles' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as UserProfile[];
  } catch (error) {
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
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch user profile by email');
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