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
      const response = await this.axiosInstance.post('/applications', data);
      return response.data?.data ?? response.data; // unwrap { data }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy đơn của sinh viên hiện tại
   */
  async getMyApplications(): Promise<Application[]> {
    try {
      const response = await this.axiosInstance.get('/applications/my-applications');
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết đơn theo ID
   */
  async getApplicationById(id: string): Promise<Application> {
    try {
      const response = await this.axiosInstance.get(`/applications/${id}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật đơn
   */
  async updateApplication(id: string, data: Partial<CreateApplicationRequest>): Promise<Application> {
    try {
      const response = await this.axiosInstance.put(`/applications/${id}`, data);
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa đơn
   */
  async deleteApplication(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/applications/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy tất cả loại đơn
   */
  async getApplicationTypes(): Promise<ApplicationType[]> {
    try {
      const response = await this.axiosInstance.get('/applications/types/all');
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy loại đơn theo category
   */
  async getApplicationTypesByCategory(category: string): Promise<ApplicationType[]> {
    try {
      const response = await this.axiosInstance.get(`/applications/types/category/${category}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy tất cả categories và loại đơn
   */
  async getApplicationCategories(): Promise<ApplicationCategory[]> {
    try {
      const response = await this.axiosInstance.get('/applications/types/categories');
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thống kê đơn (Admin only)
   */
  async getApplicationStats(): Promise<ApplicationStats[]> {
    try {
      const response = await this.axiosInstance.get('/applications/stats/overview');
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thống kê theo loại đơn (Admin only)
   */
  async getApplicationTypeStats(): Promise<ApplicationStats[]> {
    try {
      const response = await this.axiosInstance.get('/applications/stats/by-type');
      return response.data?.data ?? response.data;
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
      const response = await this.axiosInstance.get(`/applications?${params.toString()}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy đơn theo student ID (Admin/Teacher only)
   */
  async getApplicationsByStudent(studentId: string): Promise<Application[]> {
    try {
      const response = await this.axiosInstance.get(`/applications/student/${studentId}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xử lý đơn (approve/reject) - Admin/Teacher only
   */
  async processApplication(id: string, status: 'approved' | 'rejected'): Promise<Application> {
    try {
      const response = await this.axiosInstance.put(`/applications/${id}/process`, { status });
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error;
    }
  }
}

const applicationService = new ApplicationService();
export default applicationService;
