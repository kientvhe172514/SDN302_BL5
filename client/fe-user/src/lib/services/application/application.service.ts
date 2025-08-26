import { Endpoints } from "@/lib/endpoints";
import axiosService from "../config/axios.service";
import { AxiosError } from "axios";

// Types
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

// Application Service Functions
export const createApplication = async (data: CreateApplicationRequest) => {
  try {
    const response = await axiosService.getAxiosInstance().post(Endpoints.Application.CREATE, data);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const getMyApplications = async () => {
  try {
    const response = await axiosService.getAxiosInstance().get(Endpoints.Application.GET_MY_APPLICATIONS);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const getApplicationById = async (id: string) => {
  try {
    const response = await axiosService.getAxiosInstance().get(Endpoints.Application.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const updateApplication = async (id: string, data: Partial<CreateApplicationRequest>) => {
  try {
    const response = await axiosService.getAxiosInstance().put(Endpoints.Application.UPDATE(id), data);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const deleteApplication = async (id: string) => {
  try {
    const response = await axiosService.getAxiosInstance().delete(Endpoints.Application.DELETE(id));
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const getApplicationTypes = async () => {
  try {
    const response = await axiosService.getAxiosInstance().get(Endpoints.Application.GET_TYPES_ALL);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const getApplicationTypesByCategory = async (category: string) => {
  try {
    const response = await axiosService.getAxiosInstance().get(Endpoints.Application.GET_TYPES_BY_CATEGORY(category));
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const getApplicationCategories = async () => {
  try {
    const response = await axiosService.getAxiosInstance().get(Endpoints.Application.GET_CATEGORIES);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

// Admin/Teacher functions
export const getAllApplications = async (filters?: {
  status?: string;
  applicationType?: string;
  student?: string;
  processedBy?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await axiosService.getAxiosInstance().get(`${Endpoints.Application.GET_ALL}?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const getApplicationsByStudent = async (studentId: string) => {
  try {
    const response = await axiosService.getAxiosInstance().get(Endpoints.Application.GET_BY_STUDENT(studentId));
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const processApplication = async (id: string, status: 'approved' | 'rejected') => {
  try {
    const response = await axiosService.getAxiosInstance().put(Endpoints.Application.PROCESS(id), { status });
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const getApplicationStats = async () => {
  try {
    const response = await axiosService.getAxiosInstance().get(Endpoints.Application.GET_STATS_OVERVIEW);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const getApplicationTypeStats = async () => {
  try {
    const response = await axiosService.getAxiosInstance().get(Endpoints.Application.GET_STATS_BY_TYPE);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};
