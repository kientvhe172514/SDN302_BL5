import { Filter } from 'lucide-react';
import { ClassListResponse } from '@/models/class/class.model';
import { ClassQuery } from '@/models/class/class.model';
import { AxiosError } from "axios";
import { Endpoints } from "@/lib/endpoints";
import  axiosService from "../config/axios.service";
import {
    SubjectListResponse,
    SubjectQuery,
  } from "@/models/subject";
import { User } from "@/models/user/user.model";

  export interface UserQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
    success: boolean;
    message?: string;
    data: {
        users: User[];
        total: number;
        pages: number;
    };
}
export interface AssignSubjectsPayload {
    studentIds: string[];
    subjectIds: string[];
    semester: string;
}

export const getStudents = async (query?: UserQuery): Promise<UserListResponse> => {
    try {
        const params = new URLSearchParams();
        // Thêm tham số để lọc theo vai trò
        params.append("role", "student"); 
        if (query?.page) params.append("page", query.page.toString());
        if (query?.limit) params.append("limit", query.limit.toString());
        if (query?.search) params.append("search", query.search);
        if (query?.sortBy) params.append("sortBy", query.sortBy);
        if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

        const response = await axiosService
            .getAxiosInstance()
            .get(`${Endpoints.User.GET_ALL}?${params.toString()}`);
            if (response.data.success && Array.isArray(response.data.data.users)) {
                response.data.data.users = response.data.data.users.filter(user => user.role === 'student');
            }
        return response.data;
    } catch (error) {
        console.error("Failed to fetch students:", error);
        return { success: false, message: "Failed to fetch students", data: { users: [], total: 0, pages: 0 } };
    }
};


/**
 * Lấy danh sách người   dùng có vai trò là GIẢNG VIÊN.
 */
export const getTeachers = async (query?: UserQuery): Promise<UserListResponse> => {
    try {
        const params = new URLSearchParams();
        // Thêm tham số để lọc theo vai trò
        params.append("role", "teacher");
        if (query?.page) params.append("page", query.page.toString());
        if (query?.limit) params.append("limit", query.limit.toString());
        if (query?.search) params.append("search", query.search);

        const response = await axiosService
            .getAxiosInstance()
            .get(`${Endpoints.User.GET_ALL}?${params.toString()}`);
        
            if (response.data.success && Array.isArray(response.data.data.users)) {
                response.data.data.users = response.data.data.users.filter(user => user.role === 'teacher');
            }
            
            return response.data;
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        return { success: false, message: "Failed to fetch teachers", data: { users: [], total: 0, pages: 0 } };
    }
};

/**
 * Lấy danh sách các lớp học phần.
 */
export const getClasses = async (query?: ClassQuery): Promise<ClassListResponse> => {
    try {
        const params = new URLSearchParams();
        if (query?.page) params.append("page", query.page.toString());
        if (query?.limit) params.append("limit", query.limit.toString());
        if (query?.search) params.append("search", query.search);

        const response = await axiosService
            .getAxiosInstance()
            .get(`${Endpoints.Class.GET_ALL}?${params.toString()}`);
            
        return response.data;
    } catch (error) {
        console.error("Failed to fetch classes:", error);
        return { success: false, message: "Failed to fetch classes", data: { classes: [], total: 0 } };
    }
};

export const getSubjects = async (query?: SubjectQuery): Promise<SubjectListResponse> => {
    try {
        const params = new URLSearchParams();
        if (query?.page) params.append("page", query.page.toString());
        if (query?.limit) params.append("limit", query.limit.toString());
        if (query?.search) params.append("search", query.search);
        if (query?.sortBy) params.append("sortBy", query.sortBy);
        if (query?.sortOrder) params.append("sortOrder", query.sortOrder);
        const response = await axiosService
            .getAxiosInstance()
            .get(`${Endpoints.Subject.GET_ALL}?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch subjects:", error);
        return { success: false, data: { subjects: [], total: 0, pages: 0 } };
    }
};

export const assignSubjectsToStudents = async (payload: AssignSubjectsPayload) => {
    try {
        // Giả định bạn có một endpoint để xử lý việc này
         const response = await axiosService.getAxiosInstance().post(`${Endpoints.Timeshchedule.ASSIGN_SUBJECTS}`, payload);
        // --- Giả lập API thành công để test ---
        console.log("Đang gửi dữ liệu lên server:", payload);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập độ trễ mạng
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error.response?.data;
        }
        return { success: false, message: "Lỗi không xác định khi gán môn học" };
    }
}


// --- HÀM MỚI ---
export interface CreateSchedulePayload {
    classId: string;
    teacherId: string;
    slotNumber: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string;
}

export const createTimeSchedule = async (payload: CreateSchedulePayload) => {
    try {
        // Giả định endpoint của bạn là /api/schedules/
        const response = await axiosService.getAxiosInstance().post(Endpoints.Timeshchedule.CREATE_TIMESCHEDULE, payload);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error.response?.data;
        }
        return { success: false, message: "Lỗi không xác định khi tạo lịch học" };
    }
}




