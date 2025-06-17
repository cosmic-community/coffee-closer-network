interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'An error occurred'
        }
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async signup(signupData: any): Promise<ApiResponse> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData)
    })
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST'
    })
  }

  async verifySession(): Promise<ApiResponse> {
    return this.request('/auth/verify')
  }

  async getSession(): Promise<ApiResponse> {
    return this.request('/auth/session')
  }

  // Profile endpoints
  async getProfile(): Promise<ApiResponse> {
    return this.request('/profile/get')
  }

  async updateProfile(profileData: any): Promise<ApiResponse> {
    return this.request('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }

  async setupProfile(profileData: any): Promise<ApiResponse> {
    return this.request('/profile/setup', {
      method: 'POST',
      body: JSON.stringify(profileData)
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient