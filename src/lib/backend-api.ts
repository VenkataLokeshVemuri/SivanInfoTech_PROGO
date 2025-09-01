// Backend API integration for existing Flask backend
// Based on the existing Flask app.py structure

const API_BASE_URL = 'https://sitcloud.in/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class BackendAPI {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.makeRequest<{ token: string; user: any }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token);
      }
    }

    return response;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(email: string, otp: string): Promise<ApiResponse> {
    return this.makeRequest('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async logout(): Promise<void> {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // User Management APIs
  async getProfile(): Promise<ApiResponse> {
    return this.makeRequest('/profile');
  }

  async updateProfile(profileData: any): Promise<ApiResponse> {
    return this.makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Course APIs
  async getCourses(): Promise<ApiResponse> {
    return this.makeRequest('/courses');
  }

  async getCourse(courseId: string): Promise<ApiResponse> {
    return this.makeRequest(`/courses/${courseId}`);
  }

  async createCourse(courseData: any): Promise<ApiResponse> {
    return this.makeRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  // Enrollment APIs
  async enrollInCourse(courseId: string, batchId?: string): Promise<ApiResponse> {
    return this.makeRequest('/enroll', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId, batch_id: batchId }),
    });
  }

  async getEnrollments(): Promise<ApiResponse> {
    return this.makeRequest('/enrollments');
  }

  // Payment APIs (PhonePe Integration)
  async initiatePayment(paymentData: {
    course_id: string;
    batch_id?: string;
    amount: number;
  }): Promise<ApiResponse<{ payment_url: string; transaction_id: string }>> {
    return this.makeRequest('/payment/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async verifyPayment(transactionId: string): Promise<ApiResponse> {
    return this.makeRequest(`/payment/verify/${transactionId}`);
  }

  // Batch APIs
  async getBatches(courseId?: string): Promise<ApiResponse> {
    const endpoint = courseId ? `/batches?course_id=${courseId}` : '/batches';
    return this.makeRequest(endpoint);
  }

  async createBatch(batchData: any): Promise<ApiResponse> {
    return this.makeRequest('/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  }

  // Certificate APIs
  async getCertificates(): Promise<ApiResponse> {
    return this.makeRequest('/certificates');
  }

  async generateCertificate(courseId: string): Promise<ApiResponse> {
    return this.makeRequest('/certificates/generate', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    });
  }

  async verifyCertificate(certificateId: string): Promise<ApiResponse> {
    return this.makeRequest(`/certificates/verify/${certificateId}`);
  }

  // Contact/Inquiry APIs
  async submitInquiry(inquiryData: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    course_interest?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  }

  async getInquiries(): Promise<ApiResponse> {
    return this.makeRequest('/inquiries');
  }

  // Talk to Counselor
  async requestCounseling(counselingData: {
    name: string;
    email: string;
    phone: string;
    preferred_time?: string;
    course_interest?: string;
    message?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/counseling-request', {
      method: 'POST',
      body: JSON.stringify(counselingData),
    });
  }

  // Admin APIs
  async getUsers(): Promise<ApiResponse> {
    return this.makeRequest('/admin/users');
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse> {
    return this.makeRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const backendAPI = new BackendAPI();
export default backendAPI;