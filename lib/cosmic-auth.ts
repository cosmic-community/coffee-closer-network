import { createBucketClient } from '@cosmicjs/sdk'

// Create a separate client with write permissions for authentication operations
const cosmicAuth = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
  readKey: process.env.COSMIC_READ_KEY!,
  writeKey: process.env.COSMIC_WRITE_KEY!
})

export { cosmicAuth }