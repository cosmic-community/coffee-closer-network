export interface UploadedFile {
  url: string
  imgix_url: string
  name: string
  size: number
  type: string
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  try {
    // Create form data for file upload
    const formData = new FormData()
    formData.append('file', file)

    // Upload to Cosmic Media API
    const response = await fetch(`https://api.cosmicjs.com/v3/buckets/${process.env.COSMIC_BUCKET_SLUG}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COSMIC_WRITE_KEY}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Upload failed with status ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.media) {
      throw new Error('Invalid response from upload API')
    }

    return {
      url: data.media.url,
      imgix_url: data.media.imgix_url,
      name: data.media.name,
      size: data.media.size,
      type: data.media.type
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to upload file')
  }
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select an image file' }
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image must be less than 5MB' }
  }

  // Check for common image formats
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please use JPG, PNG, GIF, or WebP format' }
  }

  return { isValid: true }
}