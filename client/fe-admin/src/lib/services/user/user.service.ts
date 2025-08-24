import { Endpoints } from '@/lib/endpoints';
import { FormValues } from '../../../components/common/modal/add-user';
import axiosService from '../config/axios.service';
import { AxiosError } from 'axios';
export const addUser = async (values: FormValues) => {
    try {
        const response = await axiosService.getAxiosInstance().post(`${Endpoints.User.ADD_USER}`, {
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