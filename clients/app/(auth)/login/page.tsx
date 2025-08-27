"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { loginUser } from "@/service/authService";
import { Eye, EyeOff, Mail, Lock, Github, Facebook } from "lucide-react";
import { FaGoogle, FaSpinner } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";

// Zod schema
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof schema>;

interface LoginResponse {
  token: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Explicit type added here
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  // ✅ Explicit SubmitHandler type instead of `any`
  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    try {
      const res: LoginResponse = await loginUser({
        email: data.email,
        password: data.password,
        remember: data.remember,
      });

      if (res?.token) {
        if (data.remember) {
          localStorage.setItem("token", res.token);
        } else {
          sessionStorage.setItem("token", res.token);
        }
      }

      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/oauth/google-auth`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/oauth/github-auth`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/oauth/facebook-auth`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-800">
          emmrexshoppingCart
        </h1>
        <p className="text-center text-gray-500 mb-6">Login to continue</p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="pl-10"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox
                onCheckedChange={(checked) => setValue("remember", !!checked)}
              />
              <span>Remember me</span>
            </div>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-blue-600"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot password?
            </Button>
          </div>

          {/* Login button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? <FaSpinner/> : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or sign up with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social login buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoogleLogin}
            className="p-3 rounded-full border hover:bg-gray-50 transition"
          >
            <FaGoogle size={22} className="text-red-500" />
          </button>
          <button
            onClick={handleGithubLogin}
            className="p-3 rounded-full border hover:bg-gray-50 transition"
          >
            <Github size={22} className="text-gray-800" />
          </button>
          <button
            onClick={handleFacebookLogin}
            className="p-3 rounded-full border hover:bg-gray-50 transition"
          >
            <Facebook size={22} className="text-blue-600" />
          </button>
        </div>

        {/* Signup link */}
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
