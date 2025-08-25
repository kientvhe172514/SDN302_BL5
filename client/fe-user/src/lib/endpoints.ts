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

  static readonly Subject = {
    GET_ALL: "subjects",
    GET_BY_ID: (id: string) => `subjects/${id}`,
    GET_BY_CODE: (code: string) => `subjects/code/${code}`,
    GET_STATS: "subjects/stats",
    GET_BY_CREDITS: "subjects/credits",
  };
}
