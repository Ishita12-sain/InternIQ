import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, Mail, Lock, Phone, Briefcase, CheckCircle2, Eye, EyeOff, IdCard } from 'lucide-react';

export const TNPRegistrationForm: React.FC = () => {
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
    employeeId: '',
    department: 'Training & Placement Cell',
    designation: 'Training & Placement Officer (TPO)',
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
      newErrors.email = 'Official College Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
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
          <h3 className="text-xl font-bold text-slate-900">T&P Officer Registered</h3>
          <p className="text-xs text-slate-600">
            Placement officer account for <span className="font-bold text-blue-600">{formData.fullName}</span> created successfully.
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            You can now manage campus recruitment drives and placement statistics.
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
        placeholder="e.g. Vikramaditya Singh"
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
          placeholder="tnp@college.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          required
        />

        <Input
          label="T&P Employee ID"
          type="text"
          placeholder="e.g. TNP-8801"
          value={formData.employeeId}
          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          error={errors.employeeId}
          leftIcon={<IdCard className="w-4 h-4 text-slate-400" />}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Office / Department"
          type="text"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          leftIcon={<Briefcase className="w-4 h-4 text-slate-400" />}
          required
        />

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">T&P Designation</label>
          <select
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="Training & Placement Officer (TPO)">Head TPO</option>
            <option value="Placement Coordinator">Placement Coordinator</option>
            <option value="Corporate Relations Manager">Corporate Relations Manager</option>
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
            I agree to the Placement Cell compliance rules and institutional data security policies.
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
        {isLoading ? 'Registering Placement Officer...' : 'Register T&P Cell Account'}
      </Button>
    </form>
  );
};
