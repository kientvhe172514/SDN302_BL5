export class Endpoints {
  static readonly Auth = {
    REFRESH: "auth/refresh",
    LOGIN: "auth/login",
    LOGIN_WITH_GOOGLE: "auth/google-login",
    FORGOT_PASSWORD: "auth/forgot-password",
    CHANGE_PASSWORD: "auth/change-password",
    VERIFY_FORGOT_PASSWORD: "auth/verify-otp-reset-password",

    REGISTER: "auth/register",
    VERIFY_REGISTRATION_OTP: "auth/verify-registration-otp",
    RESEND_REGISTRATION_OTP: "auth/resend-registration-otp",
    SETUP_ACCOUNT: "auth/setup-account",
  };

  static readonly User = {
    GET_ALL: 'user/get-all',
    ADD_USER: 'user/add-user'
  }
}
