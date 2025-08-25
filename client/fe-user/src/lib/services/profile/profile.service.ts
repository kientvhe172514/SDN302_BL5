import { Endpoints } from "@/lib/endpoints";
import axiosService from "../config/axios.service";
import {
  ProfileResponse,
  UpdateProfileRequest,
} from "@/models/user/user.model";

class ProfileService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .get(Endpoints.Profile.GET_PROFILE);
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .put(Endpoints.Profile.UPDATE_PROFILE, data);
    return response.data;
  }
}

export default new ProfileService();
