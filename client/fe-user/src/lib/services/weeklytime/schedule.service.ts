import { Endpoints } from "@/lib/endpoints";
import axiosService from "../config/axios.service";
import { AxiosError } from "axios";

// Giả định bạn có một interface TimeSchedule trong thư mục models
import { TimeSchedule } from "@/models/timeschedule"; 

export interface ScheduleResponse {
    success: boolean;
    message?: string;
    data: TimeSchedule[];
}

export const getMySchedule = async (userId: string): Promise<ScheduleResponse> => {
    try {
        // Gửi userId trong body của request POST, hoặc qua params của GET
        // Lưu ý: Backend cũng phải được sửa để nhận tham số này
        const response = await axiosService.getAxiosInstance().get(
            `${Endpoints.SCHEDULE.GET_MY_SCHE}?userId=${userId}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Failed to fetch schedule:", error);
        if (error instanceof AxiosError) {
            return error.response?.data;
        }
        return { success: false, message: "Lỗi không xác định", data: [] };
    }
}