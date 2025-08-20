import { TokenPayload } from "@/models/token/TokenPayload.model";
import { jwtDecode } from "jwt-decode";
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};