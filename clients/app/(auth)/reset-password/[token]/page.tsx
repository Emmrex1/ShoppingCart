"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/service/authService";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token as string, password);
      toast.success("Password reset successful. Please log in.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset password failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-gray-400">Forgot Password</span>
          <span className="text-gray-400">Verify Email</span>
          <span className="text-blue-600">Reset Password</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div className="bg-blue-600 h-2 rounded w-full"></div>
        </div>
      </div>

      <h1 className="text-xl font-bold mb-4 text-center">Reset Your Password</h1>
      <form onSubmit={handleReset} className="space-y-4">
        {/* New Password */}
        <div>
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
