<!-- README_START -->
# Coffee Closer Network ☕

A community platform connecting SaaS and software sales professionals for meaningful 15-minute virtual coffee chats. Build your network, share strategies, and accelerate your career through peer-to-peer conversations.

![Coffee Closer Network](https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=400&fit=crop&auto=format,compress)

## Features

- **Smart Matching Algorithm** - Connect with relevant peers based on experience, industry, and interests
- **15-Minute Coffee Chats** - Perfect duration for meaningful exchanges without overwhelming schedules
- **User Profiles** - Comprehensive profiles with role, company, timezone, and discussion topics
- **Coffee Chat Management** - Schedule, reschedule, and track your networking sessions
- **Community Blog** - Share insights, strategies, and success stories
- **Testimonials System** - Rate and review your coffee chat experiences
- **FAQ Support** - Comprehensive help system organized by category
- **Responsive Design** - Optimized for desktop and mobile experiences

## Clone this Bucket

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket to get started instantly:

[![Clone this Bucket](https://img.shields.io/badge/Clone%20this%20Bucket-4F46E5?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=coffee-closers-production)

## Original Prompt

This application was built based on the following request:

> I'm building a community platform called Coffee Closer Network — a place for SaaS and software sales professionals to meet for 15-minute virtual coffee chats, share ideas, and grow their networks. Please generate the full application structure and frontend using Tailwind and React, styled cleanly and clearly.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content Management**: [Cosmic](https://www.cosmicjs.com)
- **TypeScript**: Full type safety with strict mode
- **Runtime**: Bun for fast package management

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Node.js 18+ (for compatibility)

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Cosmic credentials to `.env.local`:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

5. Run the development server:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Coffee Chat Sessions
```typescript
import { cosmic } from '@/lib/cosmic'

const sessions = await cosmic.objects
  .find({ type: 'coffee-chat-sessions' })
  .depth(1)
```

### Creating a New User Profile
```typescript
const newProfile = await cosmic.objects.insertOne({
  type: 'user-profiles',
  title: 'John Doe',
  metadata: {
    full_name: 'John Doe',
    current_role: 'Sales Manager',
    company: 'TechCorp',
    timezone: { key: 'EST', value: 'Eastern Time (EST/EDT)' },
    seniority_level: { key: 'MANAGER', value: 'Sales Manager' },
    // ... other metadata
  }
})
```

### Querying Blog Posts by Tags
```typescript
const salesTipsPosts = await cosmic.objects
  .find({ 
    type: 'blog-posts',
    'metadata.published': true 
  })
  .props(['title', 'slug', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This application leverages [Cosmic](https://www.cosmicjs.com) as a headless CMS with the following content models:

- **User Profiles** - Member information, preferences, and networking details
- **Coffee Chat Sessions** - Scheduled meetings between members
- **Blog Posts** - Community insights and sales strategies
- **Testimonials** - Member feedback and success stories
- **Announcements** - Platform updates and community news
- **FAQ Items** - Categorized help and support content
- **Static Pages** - About, Privacy, Terms, and other static content

Visit the [Cosmic docs](https://www.cosmicjs.com/docs) to learn more about building with Cosmic.

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy automatically on every push

### Netlify
1. Connect your repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `out` (if using static export)
4. Add environment variables in Netlify dashboard

### Environment Variables for Production
Set these in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`
- `COSMIC_WRITE_KEY`

<!-- README_END -->