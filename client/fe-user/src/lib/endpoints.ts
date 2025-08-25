export class Endpoints {
  static readonly Auth = {
    REFRESH: "auth/refresh",
    LOGIN: "user/login",
    LOGIN_WITH_GOOGLE: "auth/google-login",
    FORGOT_PASSWORD: "auth/forgot-password",
    CHANGE_PASSWORD: "auth/change-password",
    VERIFY_FORGOT_PASSWORD: "auth/verify-otp-reset-password",

    REGISTER: "auth/register",
    VERIFY_REGISTRATION_OTP: "auth/verify-registration-otp",
    RESEND_REGISTRATION_OTP: "auth/resend-registration-otp",
    SETUP_ACCOUNT: "auth/setup-account",
  };

  static readonly Application = {
    // Student endpoints
    CREATE: "applications",
    GET_MY_APPLICATIONS: "applications/my-applications",
    GET_BY_ID: (id: string) => `applications/${id}`,
    UPDATE: (id: string) => `applications/${id}`,
    DELETE: (id: string) => `applications/${id}`,
    
    // Admin/Teacher endpoints
    GET_ALL: "applications",
    GET_BY_STUDENT: (studentId: string) => `applications/student/${studentId}`,
    PROCESS: (id: string) => `applications/${id}/process`,
    
    // Statistics endpoints
    GET_STATS_OVERVIEW: "applications/stats/overview",
    GET_STATS_BY_TYPE: "applications/stats/by-type",
    
    // Application types endpoints
    GET_TYPES_ALL: "applications/types/all",
    GET_TYPES_BY_CATEGORY: (category: string) => `applications/types/category/${category}`,
    GET_CATEGORIES: "applications/types/categories",
  };
}
