import { Endpoints } from "@/lib/endpoints";
import axiosService from "../config/axios.service";

export interface UserProfile {
  _id: string;
  email: string;
  fullName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface ProfileResponse {
  status: string;
  message: string;
  data: UserProfile;
}

class ProfileService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .get("user/profile");
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .put("user/profile", data);
    return response.data;
  }
}

export default new ProfileService();
