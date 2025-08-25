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
  success: boolean;
  message: string;
  data: UserProfile;
}
