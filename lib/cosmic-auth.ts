import { createBucketClient } from '@cosmicjs/sdk'

// Validate environment variables
if (!process.env.COSMIC_BUCKET_SLUG) {
  throw new Error('COSMIC_BUCKET_SLUG environment variable is required')
}

if (!process.env.COSMIC_READ_KEY) {
  throw new Error('COSMIC_READ_KEY environment variable is required')
}

if (!process.env.COSMIC_WRITE_KEY) {
  throw new Error('COSMIC_WRITE_KEY environment variable is required')
}

// Create a client with write permissions for authentication operations
const cosmicAuth = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY
})

export { cosmicAuth }