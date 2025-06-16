interface UploadedFile {
  url: string
  imgix_url: string
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  if (!file) {
    throw new Error('No file provided')
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPG, PNG, or GIF image.')
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('File too large. Please upload an image smaller than 5MB.')
  }

  // Create FormData for upload
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to upload file')
    }

    const uploadResult = await response.json()
    return uploadResult
  } catch (error) {
    console.error('File upload error:', error)
    throw error instanceof Error ? error : new Error('Failed to upload file')
  }
}

export function getOptimizedImageUrl(imgixUrl: string, options: {
  width?: number
  height?: number
  fit?: 'crop' | 'max' | 'scale' | 'fill'
  auto?: string
} = {}): string {
  if (!imgixUrl) return ''

  const params = new URLSearchParams()
  
  if (options.width) params.set('w', options.width.toString())
  if (options.height) params.set('h', options.height.toString())
  if (options.fit) params.set('fit', options.fit)
  if (options.auto) params.set('auto', options.auto)
  
  // Default optimization
  if (!options.auto) params.set('auto', 'format,compress')
  
  const queryString = params.toString()
  return queryString ? `${imgixUrl}?${queryString}` : imgixUrl
}

export function validateImageDimensions(file: File, maxWidth: number = 2000, maxHeight: number = 2000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img.width <= maxWidth && img.height <= maxHeight)
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(false)
    }
    
    img.src = url
  })
}