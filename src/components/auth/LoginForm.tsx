import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RoleType, LoginFormData } from '../../types/auth';
import { MOCK_USERS } from '../../config/roles';
import { RoleSelector } from './RoleSelector';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<RoleType>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: MOCK_USERS.student.email,
    password: 'password123',
    role: 'student',
    rememberMe: true,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setFormData((prev: LoginFormData) => ({
      ...prev,
      role,
      email: MOCK_USERS[role].email,
    }));
    setErrors({});
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(selectedRole);
      navigate(`/dashboard/${selectedRole}`);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
