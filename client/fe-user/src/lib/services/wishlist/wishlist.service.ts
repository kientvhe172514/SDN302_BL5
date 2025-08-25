import { Endpoints } from "@/lib/endpoints";
import axiosService from "../config/axios.service";
import { AxiosError } from "axios";

// Types
export interface WishlistSubject {
  _id: string;
  subjectCode: string;
  name: string;
  credits: number;
  description?: string;
}

export interface WishlistStudent {
  _id: string;
  email: string;
  fullName: string;
}

export interface Wishlist {
  _id: string;
  student: WishlistStudent;
  subjects: WishlistSubject[];
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWishlistRequest {
  student: string;
  subjects?: string[];
  semester: string;
}

export interface AddSubjectsRequest {
  subjectIds: string[];
}

// Wishlist Service Functions
export const getMyWishlist = async (studentId: string) => {
  try {
    const response = await axiosService.getAxiosInstance().get(Endpoints.Wishlist.GET_MY_WISHLIST(studentId));
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const createOrUpdateWishlist = async (data: CreateWishlistRequest) => {
  try {
    const response = await axiosService.getAxiosInstance().post(Endpoints.Wishlist.CREATE_OR_UPDATE, data);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const addSubjectsToWishlist = async (studentId: string, data: AddSubjectsRequest) => {
  try {
    const response = await axiosService.getAxiosInstance().post(Endpoints.Wishlist.ADD_SUBJECTS(studentId), data);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const removeSubjectFromWishlist = async (studentId: string, subjectId: string) => {
  try {
    const response = await axiosService.getAxiosInstance().delete(Endpoints.Wishlist.REMOVE_SUBJECT(studentId, subjectId));
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

export const deleteWishlist = async (studentId: string) => {
  try {
    const response = await axiosService.getAxiosInstance().delete(Endpoints.Wishlist.DELETE_WISHLIST(studentId));
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
};

// Admin functions
export const getAllWishlists = async (filters?: {
  page?: number;
  limit?: number;
}) => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await axiosService.getAxiosInstance().get(`${Endpoints.Wishlist.GET_ALL}?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return { success: false, message: "Lỗi không xác định" };
  }
}; 
