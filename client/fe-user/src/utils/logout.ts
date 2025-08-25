import { Constants } from "@/lib/constants";
import { removeCurrentUser } from "./getCurrentUser";

export const logout = () => {
  localStorage.removeItem(Constants.API_TOKEN_KEY);
  localStorage.removeItem(Constants.API_REFRESH_TOKEN_KEY);
  removeCurrentUser();
  const currrentPath = window.location.pathname;
  if (currrentPath.startsWith("/authentication/login")) return;

  window.location.href = "/";
};
