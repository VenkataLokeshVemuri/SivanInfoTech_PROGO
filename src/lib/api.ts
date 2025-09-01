
const API_BASE_URL = 'https://sitcloud.in/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async signup(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    isfromcollege: boolean;
    collagename: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async signin(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/logOut`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    localStorage.removeItem('authToken');
    return response.json();
  }

  async getToken() {
    const response = await fetch(`${API_BASE_URL}/getToken`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  async enroll(enrollmentData: {
    courseid: string;
    courseshortform: string;
    coursetitle: string;
    batchtoenroll: any;
  }) {
    const response = await fetch(`${API_BASE_URL}/enroll`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(enrollmentData),
    });
    return response.json();
  }

  async getEnrollments(userid?: string) {
    const url = userid ? `${API_BASE_URL}/enrollmentsList?userid=${userid}` : `${API_BASE_URL}/enrollmentsList`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getCourseDetails(courseid: string) {
    const response = await fetch(`${API_BASE_URL}/courseDetails?courseid=${courseid}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async getCourseAndBatchDetails() {
    const response = await fetch(`${API_BASE_URL}/getCourseAndBatchDetails`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async submitEnquiry(enquiryData: any) {
    const response = await fetch(`${API_BASE_URL}/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData),
    });
    return response.json();
  }

  async verifyCertificate(enrollmentID: string, certificateID: string) {
    const response = await fetch(`${API_BASE_URL}/verifyCert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentID, certificateID }),
    });
    return response.json();
  }

  async downloadCertificate(userid: string, certificationID: string) {
    const response = await fetch(`${API_BASE_URL}/downloadCertificate?userid=${userid}&certificationID=${certificationID}`, {
      method: 'GET',
    });
    return response;
  }

  async emailCertificate(userid: string, certificationID: string) {
    const response = await fetch(`${API_BASE_URL}/emailCert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid, certificationID }),
    });
    return response.json();
  }

  async initiatePayment(amount: number, user_id: string) {
    const response = await fetch(`${API_BASE_URL}/initiate-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, user_id }),
    });
    return response.json();
  }

  async getFlashAds() {
    const response = await fetch(`${API_BASE_URL}/getflashads`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }
}

export const apiService = new ApiService();
