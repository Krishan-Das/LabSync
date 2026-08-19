import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login User
  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", credentials);
      if (response.data.success) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", userData);
      if (response.data.success) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout User
  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };


  // Update Profile
  const updateProfile = async (data) => {
    try {
      const response = await axiosInstance.patch(
        "/api/auth/profile",
        data
      );
      

      if (response.data.success) {
        setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Profile update failed",
      };
    }
  };

  // Update Avatar
  const updateAvatar = async (formData) => {
    try {      
      const response = await axiosInstance.patch(
        "/api/auth/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Avatar update failed",
      };
    }
  };

  // Change Password
  const changePassword = async (data) => {
    try {
      const response = await axiosInstance.patch(
        "/api/auth/password",
        data
      );

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Password change failed",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updateAvatar,
    changePassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};