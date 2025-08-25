import { useState, useEffect } from "react";
import profileService from "@/lib/services/profile/profile.service";
import { UserProfile } from "@/models/user/user.model";

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.getProfile();
      if (response.success) {
        setUser(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch user data");
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
  };
};
