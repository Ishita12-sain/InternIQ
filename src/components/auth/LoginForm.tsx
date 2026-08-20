import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RoleType, LoginFormData } from '../../types/auth';
import { RoleSelector } from './RoleSelector';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<RoleType>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'student',
    rememberMe: true,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setFormData((prev: LoginFormData) => ({
      ...prev,
      role,
    }));
    setErrors({});
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string; general?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const authenticatedUser = await login({
        email: formData.email,
        password: formData.password || '',
        role: selectedRole,
      });

      // Navigate to the dashboard corresponding to user's real backend role
      navigate(`/dashboard/${authenticatedUser.role}`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Sign in failed. Please check your credentials.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {/* General Error Banner */}
      {errors.general && (
        <div className="p-3.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span className="font-medium leading-relaxed">{errors.general}</span>
        </div>
      )}

      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
          if (errors.email || errors.general) {
            setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
          }
        }}
        error={errors.email}
        leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
        required
      />

      {/* Password Input & Forgot Password */}
      <div>
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            if (errors.password || errors.general) {
              setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
            }
          }}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          required
        />

        <div className="flex justify-end mt-1.5">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-xs font-medium text-[#2563eb] hover:text-blue-700 transition-colors cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Role Selection */}
      <RoleSelector selectedRole={selectedRole} onSelectRole={handleRoleChange} />

      {/* Login Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full py-3.5 text-base font-semibold rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
        isLoading={isLoading}
      >
        Sign In
      </Button>

      {/* Bottom Security Note */}
      <div className="flex items-center justify-center space-x-1.5 text-xs text-[#64748b] pt-1">
        <ShieldCheck className="w-4 h-4 text-[#64748b] shrink-0" />
        <span>Secure role-based access to your InternIQ portal.</span>
      </div>

      {/* Create Account Link */}
      <div className="text-center pt-2 text-xs text-[#64748b]">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="font-bold text-[#2563eb] hover:text-blue-700 cursor-pointer"
        >
          Create Account
        </button>
      </div>
    </form>
  );
};
