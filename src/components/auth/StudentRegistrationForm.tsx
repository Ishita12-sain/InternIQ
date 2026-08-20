import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Lock, User, Phone, Building2, BookOpen, GraduationCap, ArrowRight, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { registerApi } from '../../services/auth.service';

export const StudentRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    year: '1st Year',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.college.trim()) {
      newErrors.college = 'College/Institute is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
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
      await registerApi({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'STUDENT',
      });

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/dashboard/student');
      }, 1500);
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrors({ general: message });
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900">Student Account Created</h3>
          <p className="text-xs text-slate-600">
            Welcome, <span className="font-semibold text-emerald-700">{formData.fullName}</span>!
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Redirecting to your Student Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {errors.general && (
        <div className="p-3.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span className="font-medium leading-relaxed">{errors.general}</span>
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="e.g. Disha Ubale"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        error={errors.fullName}
        leftIcon={<User className="w-4 h-4 text-slate-400" />}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@institution.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
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
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          required
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          required
        />
      </div>

      <Input
        label="College / Institute"
        type="text"
        placeholder="e.g. ABC Institute of Technology"
        value={formData.college}
        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
        error={errors.college}
        leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Department"
          type="text"
          placeholder="e.g. Computer Engineering"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          error={errors.department}
          leftIcon={<BookOpen className="w-4 h-4 text-slate-400" />}
          required
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide text-slate-700 uppercase">
            Year of Study
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <GraduationCap className="w-4 h-4" />
            </div>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full bg-white text-slate-900 rounded-xl text-sm pl-10 pr-3.5 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-4 py-3.5 text-base font-semibold rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white shadow-sm"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Create Account
      </Button>

      <div className="text-center pt-2 text-xs text-[#64748b]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-[#2563eb] font-semibold hover:underline cursor-pointer focus:outline-none"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};
