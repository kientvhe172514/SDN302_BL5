import axiosService from "../config/axios.service";
import { Endpoints } from "@/lib/endpoints";

export interface Application {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    studentId: string;
  };
  applicationType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  processedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  applicationType: string;
  reason: string;
}

export interface ApplicationType {
  value: string;
  label: string;
}

export interface ApplicationCategory {
  category: string;
  label: string;
  types: ApplicationType[];
}

export interface ApplicationStats {
  _id: string;
  count: number;
}

class ApplicationService {
  private axiosInstance = axiosService.getAxiosInstance();

  /**
   * Tạo đơn mới
   */
  async createApplication(data: CreateApplicationRequest): Promise<Application> {
    try {
      const response = await this.axiosInstance.post('/api/applications', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy đơn của sinh viên hiện tại
   */
  async getMyApplications(): Promise<Application[]> {
    try {
      const response = await this.axiosInstance.get('/api/applications/my-applications');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết đơn theo ID
   */
  async getApplicationById(id: string): Promise<Application> {
    try {
      const response = await this.axiosInstance.get(`/api/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật đơn
   */
  async updateApplication(id: string, data: Partial<CreateApplicationRequest>): Promise<Application> {
    try {
      const response = await this.axiosInstance.put(`/api/applications/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa đơn
   */
  async deleteApplication(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/api/applications/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy tất cả loại đơn
   */
  async getApplicationTypes(): Promise<ApplicationType[]> {
    try {
      const response = await this.axiosInstance.get('/api/applications/types/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy loại đơn theo category
   */
  async getApplicationTypesByCategory(category: string): Promise<ApplicationType[]> {
    try {
      const response = await this.axiosInstance.get(`/api/applications/types/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy tất cả categories và loại đơn
   */
  async getApplicationCategories(): Promise<ApplicationCategory[]> {
    try {
      const response = await this.axiosInstance.get('/api/applications/types/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thống kê đơn (Admin only)
   */
  async getApplicationStats(): Promise<ApplicationStats[]> {
    try {
      const response = await this.axiosInstance.get('/api/applications/stats/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thống kê theo loại đơn (Admin only)
   */
  async getApplicationTypeStats(): Promise<ApplicationStats[]> {
    try {
      const response = await this.axiosInstance.get('/api/applications/stats/by-type');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy tất cả đơn (Admin/Teacher only)
   */
  async getAllApplications(filters?: {
    status?: string;
    applicationType?: string;
    student?: string;
    processedBy?: string;
  }): Promise<Application[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const response = await this.axiosInstance.get(`/api/applications?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy đơn theo student ID (Admin/Teacher only)
   */
  async getApplicationsByStudent(studentId: string): Promise<Application[]> {
    try {
      const response = await this.axiosInstance.get(`/api/applications/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xử lý đơn (approve/reject) - Admin/Teacher only
   */
  async processApplication(id: string, status: 'approved' | 'rejected'): Promise<Application> {
    try {
      const response = await this.axiosInstance.put(`/api/applications/${id}/process`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const applicationService = new ApplicationService();
export default applicationService;
