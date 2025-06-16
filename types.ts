// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type_slug: string;
  created_at: string;
  modified_at: string;
}

// User Profile interface
export interface UserProfile extends CosmicObject {
  type_slug: 'user-profiles';
  metadata: {
    full_name?: string;
    profile_picture?: {
      url: string;
      imgix_url: string;
    };
    current_role?: string;
    company?: string;
    linkedin_url?: string;
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
    bio?: string;
    fun_fact?: string;
    topics_to_discuss?: string[];
    async_communication?: boolean;
  };
}

// Coffee Chat Session interface
export interface CoffeeChatSession extends CosmicObject {
  type_slug: 'coffee-chat-sessions';
  metadata: {
    user_1?: UserProfile;
    user_2?: UserProfile;
    scheduled_datetime?: string;
    status?: {
      key: ChatStatus;
      value: string;
    };
    meeting_link?: string;
    icebreaker_question?: string;
    internal_notes?: string;
  };
}

// Blog Post interface
export interface BlogPost extends CosmicObject {
  type_slug: 'blog-posts';
  metadata: {
    title?: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    author?: UserProfile;
    body?: string;
    tags?: string[];
    publish_date?: string;
    published?: boolean;
  };
}

// Testimonial interface
export interface Testimonial extends CosmicObject {
  type_slug: 'testimonials';
  metadata: {
    from_user?: UserProfile;
    to_user?: UserProfile;
    quote?: string;
    rating?: {
      key: string;
      value: string;
    };
    approved_public?: boolean;
  };
}

// Announcement interface
export interface Announcement extends CosmicObject {
  type_slug: 'announcements';
  metadata: {
    title?: string;
    body?: string;
    posted_by?: UserProfile;
    category?: {
      key: AnnouncementCategory;
      value: string;
    };
    visible_until?: string;
  };
}

// FAQ Item interface
export interface FAQItem extends CosmicObject {
  type_slug: 'faq-items';
  metadata: {
    question?: string;
    answer?: string;
    category?: {
      key: FAQCategory;
      value: string;
    };
  };
}

// Static Page interface
export interface StaticPage extends CosmicObject {
  type_slug: 'static-pages';
  metadata: {
    page_title?: string;
    body?: string;
    meta_title?: string;
    meta_description?: string;
  };
}

// Type literals for select-dropdown values
export type ChatStatus = 'SCHEDULED' | 'COMPLETED' | 'NEEDS_RESCHEDULE' | 'CANCELLED';
export type AnnouncementCategory = 'TIPS' | 'EVENTS' | 'FEEDBACK' | 'UPDATE' | 'COMMUNITY';
export type FAQCategory = 'ONBOARDING' | 'SCHEDULING' | 'NETWORKING' | 'PLATFORM' | 'COMMUNITY' | 'TECHNICAL';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guards for runtime validation
export function isUserProfile(obj: CosmicObject): obj is UserProfile {
  return obj.type_slug === 'user-profiles';
}

export function isCoffeeChatSession(obj: CosmicObject): obj is CoffeeChatSession {
  return obj.type_slug === 'coffee-chat-sessions';
}

export function isBlogPost(obj: CosmicObject): obj is BlogPost {
  return obj.type_slug === 'blog-posts';
}

export function isTestimonial(obj: CosmicObject): obj is Testimonial {
  return obj.type_slug === 'testimonials';
}

// Utility types
export type CreateUserProfileData = Omit<UserProfile, 'id' | 'created_at' | 'modified_at'>;
export type UpdateUserProfileData = Partial<CreateUserProfileData>;