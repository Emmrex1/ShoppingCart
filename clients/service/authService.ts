
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

// Helper function to dispatch auth change event
const dispatchAuthChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("authChange"));
  }
};

// REGISTER
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_URL}/api/auth/register`, data);
  return res.data;
};

// LOGIN
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(
    `${API_URL}/api/auth/login`,
    data,
    { withCredentials: true }
  );

  if (res.data?.accessToken && res.data.user) {
    localStorage.setItem("token", res.data.accessToken);
    localStorage.setItem("user", JSON.stringify({
      userId: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      avatar: res.data.user.avatar || null
    }));
    
    dispatchAuthChange();
  }

  return res.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (email: string) => {
  const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async (token: string, newPassword: string) => {
  const res = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { newPassword });
  return res.data;
};

// LOGOUT
export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatchAuthChange();
};

// GET TOKEN
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// GET USER
export const getUser = (): { 
  userId: string; 
  name: string; 
  email: string; 
  avatar?: string | null 
} | null => {
  if (typeof window === "undefined") return null;
  
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  
  try {
    const user = JSON.parse(userJson);
    return {
      userId: user.userId || "",
      name: user.name || "",
      email: user.email || "",
      avatar: user.avatar || null
    };
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

// VERIFY EMAIL
export const verifyEmail = async (token: string) => {
  const res = await axios.get(`${API_URL}/api/auth/verify-email/${token}`);
  return res.data;
};

// RESEND VERIFICATION EMAIL
export const resendVerificationEmail = async (email: string) => {
  const res = await axios.post(`${API_URL}/api/auth/resend-verification`, { email });
  return res.data;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Get user ID
// SIMPLIFIED USER GETTER
export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("user");
  if (!userData) return null;
  
  try {
    const user = JSON.parse(userData);
    return user.userId || user.id || null;
  } catch {
    return null;
  }
};

// Fetch Profile
export const getProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update Profile
export const updateProfile = async (
  token: string,
  profileData: { name?: string; email?: string }
) => {
  const response = await axios.put(`${API_URL}/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Change Password
export const changePassword = async (
  token: string,
  currentPassword: string,
  newPassword: string
) => {
  const response = await axios.post(
    `${API_URL}/change-password`,
    { currentPassword, newPassword },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Deactivate Account
export const deactivateAccount = async (token: string) => {
  const response = await axios.patch(
    `${API_URL}/deactivate`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Delete Account
export const deleteAccount = async (token: string) => {
  const response = await axios.delete(`${API_URL}/delete`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
