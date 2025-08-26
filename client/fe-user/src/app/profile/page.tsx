"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import profileService from "@/lib/services/profile/profile.service";
import { getCurrentUser, setCurrentUser } from "@/utils/getCurrentUser";
import { Calendar, Edit, Mail, Phone, Save, User } from "lucide-react";
import { useEffect, useState } from "react";

interface UserProfile {
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

export default function ProfilePage() {
  const { userInfo } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const currentUser = getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        setFormData({
          fullName: currentUser.fullName || "",
          phoneNumber: currentUser.phoneNumber || "",
          dateOfBirth: currentUser.dateOfBirth || "",
        });
      } else if (userInfo) {
        const userFromContext: UserProfile = {
          _id: userInfo.userId,
          email: userInfo.email,
          fullName: userInfo.fullname || "",
          dateOfBirth: "",
          phoneNumber: "",
          avatar: userInfo.avatar || "",
          role: userInfo.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(userFromContext);
        setFormData({
          fullName: userInfo.fullname || "",
          phoneNumber: "",
          dateOfBirth: "",
        });
        // Lưu vào localStorage để lần sau có data
        setCurrentUser(userFromContext);
      }

      try {
        const response = await profileService.getProfile();
        if (response.success && response.data) {
          const apiUser = response.data;
          setUser(apiUser);
          setFormData({
            fullName: apiUser.fullName || "",
            phoneNumber: apiUser.phoneNumber || "",
            dateOfBirth: apiUser.dateOfBirth || "",
          });
          setCurrentUser(apiUser);
        }
      } catch (apiError) {}
    } catch (error) {
      console.error("Error fetching user data:", error);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const updateData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
      };

      const response = await profileService.updateProfile(updateData);

      if (response.success) {
        const updatedUser: UserProfile = {
          ...user!,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
        };
        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        setIsEditing(false);
        setMessage({
          type: "success",
          text: response.message,
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to update profile",
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-red-600">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân</p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback>
                {user?.fullName?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {user?.fullName || "User"}
              </h3>
              <p className="text-gray-600">{user?.role || "User"}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email - Read Only */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName || ""}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label
                htmlFor="dateOfBirth"
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Date of Birth</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              {/* max={new Date().toISOString().split("T")[0]} */}
              <Label>Role</Label>
              <p className="text-gray-600">{user?.role || "N/A"}</p>
            </div>
          </div>
          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleUpdateProfile}
                className="flex items-center space-x-2"
                disabled={loading}
              >
                <Save className="h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
