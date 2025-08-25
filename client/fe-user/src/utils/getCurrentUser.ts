import { UserProfile } from "@/models/user/user.model";

export const getCurrentUser = (): UserProfile | null => {
  try {
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) return null;

    const currentUser = JSON.parse(currentUserStr);
    return currentUser;
  } catch (error) {
    console.error("Error parsing currentUser:", error);
    return null;
  }
};

export const setCurrentUser = (user: UserProfile): void => {
  try {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } catch (error) {
    console.error("Error setting currentUser:", error);
  }
};

export const removeCurrentUser = (): void => {
  localStorage.removeItem("currentUser");
};
