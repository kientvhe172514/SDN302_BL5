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
    CREATE: "subjects",
    UPDATE: (id: string) => `subjects/${id}`,
    DELETE: (id: string) => `subjects/${id}`,
    GET_STATS: "subjects/stats",
    GET_BY_CREDITS: "subjects/credits",
  };
  static readonly User = {
    GET_ALL: 'user/get-all',
    ADD_USER: 'user/add-user'
  }

  static readonly Class = {
    GET_ALL: 'class/get-class',
    ADD_CLASS: 'class/add-class',
    GET_BY_ID: (id:string) => `class/get-class/${id}`,
    UPDATE_CLASS: (id:string) => `class/update-class/${id}`,
    DELETE_CLASS: (id:string) => `class/delete/${id}`
  }

  static readonly Timeshchedule = {
    GET_MY_SCHEDULE: 'timeschedule/my-schedule',
    ASSIGN_SUBJECTS: 'registrations/assign',
    CREATE_TIMESCHEDULE: 'schedules/create'
  }
}
