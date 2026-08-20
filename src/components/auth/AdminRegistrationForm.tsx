import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, Mail, Lock, Phone, CheckCircle2, Eye, EyeOff, IdCard } from 'lucide-react';

export const AdminRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminId: '',
    department: 'Computer Science & Engineering',
    designation: 'Head of Department (HOD)',
    phone: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Official Institutional Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.adminId.trim()) {
      newErrors.adminId = 'Employee / Admin ID is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^[+0-9\s-]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 700);
  };

  if (isSuccess) {
    return (
      <div className="p-6 text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900">Admin Account Registered</h3>
          <p className="text-xs text-slate-600">
            Administrative credentials for <span className="font-bold text-[#0f172a]">{formData.fullName}</span> ({formData.designation}) created successfully.
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Full institutional system privileges assigned.
          </p>
        </div>

        <div className="pt-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <Input
        label="Full Name"
        type="text"
        placeholder="e.g. Dr. Sunita Kulkarni"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        error={errors.fullName}
        leftIcon={<User className="w-4 h-4 text-slate-400" />}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Official Institutional Email"
          type="email"
          placeholder="hod.cse@college.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          required
        />

        <Input
          label="Employee / Admin ID"
          type="text"
          placeholder="e.g. ADM-1001"
          value={formData.adminId}
          onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
          error={errors.adminId}
          leftIcon={<IdCard className="w-4 h-4 text-slate-400" />}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Telecom">Electronics & Telecom</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Institutional Administration">Institutional Administration</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">Administrative Title</label>
          <select
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="Head of Department (HOD)">Head of Department (HOD)</option>
            <option value="Dean Academics">Dean Academics</option>
            <option value="Principal / Director">Principal / Director</option>
            <option value="System Administrator">System Administrator</option>
          </select>
        </div>
      </div>

      <Input
        label="Phone Number"
        type="text"
        placeholder="+91 98765 43210"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        error={errors.phone}
        leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
        required
      />

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min 8 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terms & Conditions Checkbox */}
      <div className="space-y-1 pt-1">
        <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>
            I acknowledge administrative responsibility and agree to InternIQ System Governance & Security Policies.
          </span>
        </label>
        {errors.agreeTerms && <p className="text-[11px] text-rose-600">{errors.agreeTerms}</p>}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading}
        className="w-full py-3 text-sm font-semibold rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white shadow-xs transition-all disabled:opacity-60"
      >
        {isLoading ? 'Registering Admin Account...' : 'Register Admin Account'}
      </Button>
    </form>
  );
};
