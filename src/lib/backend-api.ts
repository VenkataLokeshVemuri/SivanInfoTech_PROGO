// Backend API integration for existing Flask backend
// Based on the existing Flask app.py structure

const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

interface FlaskResponse {
  Message: string;
  status: number;
  [key: string]: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'admin' | 'counselor';
  verified?: boolean;
  firstName?: string;
  lastName?: string;
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

      const data: FlaskResponse = await response.json();

      if (!response.ok || data.status >= 400) {
        return {
          success: false,
          error: data.Message || 'Request failed',
          status: data.status,
        };
      }

      return {
        success: true,
        data: data as T,
        message: data.Message,
        status: data.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Helper method to decode JWT token
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  // Authentication APIs - matching Flask backend endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any; Message: string; status: number }>> {
    const response = await this.makeRequest<{ token: string; Message: string; status: number }>('/signin', {
      method: 'POST',
      body: JSON.stringify({ email: email.toLowerCase(), password }),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token);
      }
      
      // Decode user data from JWT token
      const decodedToken = this.decodeJWT(response.data.token);
      if (decodedToken) {
        const user = {
          id: decodedToken.email,
          name: `${decodedToken.firstName} ${decodedToken.lastName}`,
          email: decodedToken.email,
          role: decodedToken.role.toLowerCase(),
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          verified: decodedToken.verified
        };
        
        // Return enhanced response with user data
        return {
          success: true,
          data: {
            ...response.data,
            user
          },
          error: undefined
        };
      }
    }

    return { success: false, data: undefined, error: response.error };
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(data: { email: string; otp: string }): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>('/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmailToken(token: string): Promise<ApiResponse> {
    return this.makeRequest(`/verify?token=${token}`);
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest('/logOut');
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    return response;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.makeRequest<{ token: string }>('/getToken');
    if (response.success && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token);
      }
    }
    return response;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/profile');
  }

  // User Management APIs
  async getStudentsList(): Promise<ApiResponse<{ user: any[] }>> {
    return this.makeRequest('/studentsList');
  }

  async getEnrollments(userid?: string): Promise<ApiResponse<{ user: any }>> {
    const endpoint = userid ? `/enrollmentsList?userid=${userid}` : '/enrollmentsList';
    return this.makeRequest(endpoint);
  }

  async updateEnrollment(enrollmentData: {
    enrollmentID: string;
    status: string;
    userid: string;
    courseShortForm?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/updateEnrollment', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
  }

  // Course APIs
  async getCourseDetails(courseid: string): Promise<ApiResponse<{ details: any }>> {
    return this.makeRequest(`/courseDetails?courseid=${courseid}`);
  }

  async getCourseList(): Promise<ApiResponse<{ courses: any[] }>> {
    return this.makeRequest('/courselist');
  }

  async getCourseDocument(courseid: string): Promise<ApiResponse<{ details: string; courseid: string }>> {
    return this.makeRequest(`/getcourseDoc?courseid=${courseid}`);
  }

  async uploadCourseDocument(courseid: string, syllabus: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('courseid', courseid);
    formData.append('syllabus', syllabus);

    return this.makeRequest('/uploadcourseDoc', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  async getCourseAndBatchDetails(): Promise<ApiResponse<{ details: any[] }>> {
    return this.makeRequest('/getCourseAndBatchDetails');
  }

  // Enrollment APIs
  async enrollInCourse(courseData: {
    courseid: string;
    courseshortform: string;
    coursetitle: string;
    batchtoenroll: any;
  }): Promise<ApiResponse<{ EnrollmentID: string }>> {
    return this.makeRequest('/enroll', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  // Payment APIs (PhonePe Integration)
  async initiatePayment(paymentData: {
    amount: number;
    user_id: string;
  }): Promise<ApiResponse<{ pay_page_url: string }>> {
    return this.makeRequest('/initiate-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async checkPaymentStatus(transactionId: string): Promise<ApiResponse> {
    return this.makeRequest(`/callback/${transactionId}`);
  }

  // Contact/Inquiry APIs
  async submitInquiry(inquiryData: {
    name: string;
    email: string;
    phone: string;
    course: string;
    message: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/enquiry', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  }

  // Talk to Counselor
  async requestCounseling(counselingData: {
    name: string;
    email: string;
    phone: string;
    course_interest?: string;
    preferred_time?: string;
    message?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/counseling-request', {
      method: 'POST',
      body: JSON.stringify(counselingData),
    });
  }

  // Certificate APIs
  async verifyCertificate(certData: {
    enrollmentID: string;
    certificateID: string;
  }): Promise<ApiResponse<{ userName: string; enrollmentDetails: any }>> {
    return this.makeRequest('/verifyCert', {
      method: 'POST',
      body: JSON.stringify(certData),
    });
  }

  async downloadCertificate(userid: string, certificationID: string): Promise<string> {
    return `${API_BASE_URL}/downloadCertificate?userid=${userid}&certificationID=${certificationID}`;
  }

  async emailCertificate(certData: {
    userid: string;
    certificationID: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/emailCert', {
      method: 'POST',
      body: JSON.stringify(certData),
    });
  }

  // Flash Ads APIs
  async saveFlashAds(adsData: {
    flashadslist: string[];
    adsType: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/saveads', {
      method: 'POST',
      body: JSON.stringify(adsData),
    });
  }

  async getFlashAds(): Promise<ApiResponse<{ details: any }>> {
    return this.makeRequest('/getflashads');
  }

  // Quiz System APIs
  async createQuiz(quizData: {
    title: string;
    courseId: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    description?: string;
    instructions?: string;
    settings?: any;
  }): Promise<ApiResponse<{ quizId: string }>> {
    return this.makeRequest('/admin/quiz', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  }

  async getQuiz(quizId: string): Promise<ApiResponse<{ quiz: any }>> {
    return this.makeRequest(`/admin/quiz/${quizId}`);
  }

  async updateQuiz(quizId: string, updateData: any): Promise<ApiResponse> {
    return this.makeRequest(`/admin/quiz/${quizId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteQuiz(quizId: string): Promise<ApiResponse> {
    return this.makeRequest(`/admin/quiz/${quizId}`, {
      method: 'DELETE',
    });
  }

  async listQuizzes(courseId?: string): Promise<ApiResponse<{ quizzes: any[] }>> {
    const endpoint = courseId ? `/admin/quizzes?courseId=${courseId}` : '/admin/quizzes';
    return this.makeRequest(endpoint);
  }

  async addQuestion(quizId: string, questionData: {
    type: string;
    questionText: string;
    marks: number;
    correctAnswer: any;
    options?: any[];
    explanation?: string;
  }): Promise<ApiResponse<{ questionId: string }>> {
    return this.makeRequest(`/admin/quiz/${quizId}/question`, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  async updateQuestion(questionId: string, updateData: any): Promise<ApiResponse> {
    return this.makeRequest(`/admin/question/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteQuestion(questionId: string): Promise<ApiResponse> {
    return this.makeRequest(`/admin/question/${questionId}`, {
      method: 'DELETE',
    });
  }

  async getQuizQuestions(quizId: string): Promise<ApiResponse<{ questions: any[] }>> {
    return this.makeRequest(`/admin/quiz/${quizId}/questions`);
  }

  async assignQuiz(assignmentData: {
    quizId: string;
    dueDate: string;
    assignmentType: 'batch' | 'individual';
    assignedTo: any;
    maxAttempts?: number;
    instructions?: string;
  }): Promise<ApiResponse<{ assignmentId: string }>> {
    return this.makeRequest('/admin/quiz/assign', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async listAssignments(): Promise<ApiResponse<{ assignments: any[] }>> {
    return this.makeRequest('/admin/quiz/assignments');
  }

  async gradeAttempt(attemptId: string, gradingData: any[]): Promise<ApiResponse> {
    return this.makeRequest(`/admin/attempt/${attemptId}/grade`, {
      method: 'PUT',
      body: JSON.stringify(gradingData),
    });
  }

  // Batch Management APIs
  async getAllBatches(): Promise<ApiResponse<{ batches: any[] }>> {
    return this.makeRequest('/admin/batches');
  }

  async createBatch(batchData: {
    batchId: string;
    courseId: string;
    startDate: string;
    endDate: string;
    timing: string;
    mode: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/admin/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  }

  async updateBatch(batchId: string, batchData: {
    startDate: string;
    endDate: string;
    timing: string;
    mode: string;
  }): Promise<ApiResponse> {
    return this.makeRequest(`/admin/batches/${batchId}`, {
      method: 'PUT',
      body: JSON.stringify(batchData),
    });
  }

  async deleteBatch(batchId: string): Promise<ApiResponse> {
    return this.makeRequest(`/admin/batches/${batchId}`, {
      method: 'DELETE',
    });
  }

  // User Management APIs (additional to existing ones)
  async deleteUser(userEmail: string): Promise<ApiResponse> {
    return this.makeRequest(`/admin/users/${userEmail}`, {
      method: 'DELETE',
    });
  }

  async exportUsers(): Promise<ApiResponse<{ users: any[] }>> {
    return this.makeRequest('/admin/users/export');
  }

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    password: string;
    role?: string;
    verified?: boolean;
  }): Promise<ApiResponse> {
    return this.makeRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userEmail: string, userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    password?: string;
    role?: string;
    verified?: boolean;
  }): Promise<ApiResponse> {
    return this.makeRequest(`/admin/users/${userEmail}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserCertificates(userEmail: string): Promise<ApiResponse<{ certificates: any[] }>> {
    return this.makeRequest(`/admin/users/${userEmail}/certificates`);
  }

  async listAttempts(quizId?: string, status?: string): Promise<ApiResponse<{ attempts: any[] }>> {
    let endpoint = '/admin/attempts';
    const params = new URLSearchParams();
    if (quizId) params.append('quizId', quizId);
    if (status) params.append('status', status);
    if (params.toString()) endpoint += `?${params.toString()}`;
    
    return this.makeRequest(endpoint);
  }

  // Quiz Analytics and Export APIs
  async getQuizAnalytics(quizId: string): Promise<ApiResponse<{ 
    quiz: any; 
    statistics: any; 
    recentAttempts: any[] 
  }>> {
    return this.makeRequest(`/admin/quiz/${quizId}/analytics`);
  }

  async exportQuizResults(quizId: string): Promise<ApiResponse<{ 
    quiz: any; 
    results: any[]; 
    summary: any 
  }>> {
    return this.makeRequest(`/admin/quiz/${quizId}/export`);
  }

  async previewQuiz(quizId: string): Promise<ApiResponse<{ 
    quiz: any; 
    questions: any[]; 
    totalQuestions: number; 
    totalMarks: number 
  }>> {
    return this.makeRequest(`/admin/quiz/${quizId}/preview`);
  }

  // Student Quiz APIs
  async getStudentAssignments(): Promise<ApiResponse<{ assignments: any[] }>> {
    return this.makeRequest('/student/assignments');
  }

  async getQuizMetadata(quizId: string): Promise<ApiResponse<{ quiz: any; assignment: any }>> {
    return this.makeRequest(`/student/quiz/${quizId}/metadata`);
  }

  async startQuizAttempt(assignmentId: string, clientInfo?: any): Promise<ApiResponse<{ attemptId: string; dueAt: string; duration: number }>> {
    return this.makeRequest(`/student/quiz/${assignmentId}/start`, {
      method: 'POST',
      body: JSON.stringify(clientInfo || {}),
    });
  }

  async getAttemptQuestions(attemptId: string): Promise<ApiResponse<{ questions: any[]; attempt: any }>> {
    return this.makeRequest(`/student/attempt/${attemptId}/questions`);
  }

  async saveAnswer(attemptId: string, answerData: {
    questionId: string;
    answer: any;
  }): Promise<ApiResponse> {
    return this.makeRequest(`/student/attempt/${attemptId}/answer`, {
      method: 'POST',
      body: JSON.stringify(answerData),
    });
  }

  async submitAttempt(attemptId: string): Promise<ApiResponse<{ result: any }>> {
    return this.makeRequest(`/student/attempt/${attemptId}/submit`, {
      method: 'POST',
    });
  }

  async getAttemptResult(attemptId: string): Promise<ApiResponse<{ result: any }>> {
    return this.makeRequest(`/student/attempt/${attemptId}/result`);
  }

  // Advanced Batch Management APIs
  async getBatchAnalysis(batchId: string): Promise<ApiResponse<{
    analysis: {
      batchInfo: any;
      statistics: any;
      revenue: any;
      students: any[];
      enrollments: any[];
    };
  }>> {
    return this.makeRequest(`/admin/batches/${batchId}/analysis`);
  }

  async getBatchStudents(batchId: string): Promise<ApiResponse<{ students: any[] }>> {
    return this.makeRequest(`/admin/batches/${batchId}/students`);
  }

  async getBatchModules(batchId: string): Promise<ApiResponse<{ modules: any[] }>> {
    return this.makeRequest(`/admin/batches/${batchId}/modules`);
  }

  async createBatchModule(batchId: string, moduleData: {
    title: string;
    description?: string;
    duration?: string;
    order?: number;
    topics?: string[];
    resources?: any[];
    assignments?: any[];
  }): Promise<ApiResponse<{ moduleId: string }>> {
    return this.makeRequest(`/admin/batches/${batchId}/modules`, {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  }

  async updateModule(moduleId: string, updateData: {
    title?: string;
    description?: string;
    duration?: string;
    order?: number;
    topics?: string[];
    resources?: any[];
    assignments?: any[];
  }): Promise<ApiResponse> {
    return this.makeRequest(`/admin/modules/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteModule(moduleId: string): Promise<ApiResponse> {
    return this.makeRequest(`/admin/modules/${moduleId}`, {
      method: 'DELETE',
    });
  }

  async getBatchSchedule(batchId: string): Promise<ApiResponse<{ schedule: any[] }>> {
    return this.makeRequest(`/admin/batches/${batchId}/schedule`);
  }

  async scheduleClass(batchId: string, scheduleData: {
    moduleId?: string;
    topic: string;
    description?: string;
    dateTime: string;
    duration?: number;
    instructor?: string;
    meetingLink?: string;
    resources?: any[];
    type?: string;
  }): Promise<ApiResponse<{ scheduleId: string }>> {
    return this.makeRequest(`/admin/batches/${batchId}/schedule`, {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  async updateSchedule(scheduleId: string, updateData: {
    topic?: string;
    description?: string;
    dateTime?: string;
    duration?: number;
    instructor?: string;
    meetingLink?: string;
    resources?: any[];
    type?: string;
    status?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest(`/admin/schedule/${scheduleId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async cancelSchedule(scheduleId: string): Promise<ApiResponse> {
    return this.makeRequest(`/admin/schedule/${scheduleId}`, {
      method: 'DELETE',
    });
  }

  async getBatchAttendance(batchId: string): Promise<ApiResponse<{ attendance: any[] }>> {
    return this.makeRequest(`/admin/batches/${batchId}/attendance`);
  }

  async markAttendance(batchId: string, attendanceData: {
    scheduleId?: string;
    date: string;
    studentAttendance: Array<{ email: string; status: 'present' | 'absent' }>;
  }): Promise<ApiResponse<{ attendanceId: string }>> {
    return this.makeRequest(`/admin/batches/${batchId}/attendance`, {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }
}

export const backendAPI = new BackendAPI();
export default backendAPI;