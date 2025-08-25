import { Endpoints } from "@/lib/endpoints";
import axiosService from "../config/axios.service";
import { AxiosError } from "axios";
import { FormValues } from "@/app/authentication/login/page";

export const login = async (values: FormValues) => {
    try {
        const response = await axiosService.getAxiosInstance().post(`${Endpoints.Auth.LOGIN}`, {
            values
        })

        return response.data
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error.response?.data;
        }
        return { success: false, message: "Lỗi không xác định" };
    }
}