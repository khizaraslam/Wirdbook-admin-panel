import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Eye, EyeOff, BookOpen } from "lucide-react";
import useStore from "@/hooks/useStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { LoginFormDTO } from "@/utils/helpers/models/auth/login";
import { useNavigate } from "react-router-dom";
import useAuth from "../useHook";

const Login = () => {
  const navigate = useNavigate();
  const { isLoading } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormDTO>();

  const onSubmit: SubmitHandler<LoginFormDTO> = (data: any) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {/* Card */}
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 
                      transition-all duration-500 animate-fade-in-up"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 
                          flex items-center justify-center shadow-md"
          >
            <BookOpen size={26} className="text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Sign in to your admin account to continue
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@gmail.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />

          {/* Password */}
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-slate-400 hover:text-primary cursor-pointer transition-colors duration-200 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          {/* Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="rounded-md"
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Footer */}
        {/* <p className="text-center text-xs text-slate-400 mt-8">
          © {new Date().getFullYear()} Wird Book · All rights reserved
        </p> */}
      </div>
    </div>
  );
};

export default Login;
