import { Endpoints } from "@/lib/endpoints";
import axiosService from "../config/axios.service";
import { AxiosError } from "axios";
import { FormValues } from "@/components/common/modal/add-class";

export const addClass = async (values:FormValues) => {
    try {
        const response = await axiosService.getAxiosInstance().post(`${Endpoints.Class.ADD_CLASS}`,{
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
export const updateClass = async (values:FormValues,id:string) => {
    try {
        const response = await axiosService.getAxiosInstance().put(`${Endpoints.Class.UPDATE_CLASS(id)}`,{
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

export const removeClass = async (id:string) => {
    try {
        const response = await axiosService.getAxiosInstance().delete(`${Endpoints.Class.DELETE_CLASS(id)}`)

        return response.data
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return error.response?.data;
        }
        return { success: false, message: "Lỗi không xác định" };
    }
}
