import { Constants } from "@/lib/constants";

export const logout = () => {
  localStorage.removeItem(Constants.API_TOKEN_KEY);
  localStorage.removeItem('currentUser')
  const currrentPath = window.location.pathname;
  if (currrentPath.startsWith("/authentication/login")) return;

  window.location.href = "/";
};