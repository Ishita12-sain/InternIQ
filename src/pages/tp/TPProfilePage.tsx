import React, { useState } from 'react';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { useSettings } from '../../context/SettingsContext';
import { CheckCircle2 } from 'lucide-react';

export const TPProfilePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, updateAdminProfile } = useSettings();
  const [name, setName] = useState(settings.adminProfile.name || 'Dr. Rajesh Sharma');
  const [email, setEmail] = useState(settings.adminProfile.email || 'tp@interniq.edu');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [dept, setDept] = useState('Training & Placement Cell');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({ name, email });
    setToastMsg('T&P profile updated successfully.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="T&P Officer Profile" subtitle="Officer credentials and contact details." />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl w-full mx-auto text-left">
          {toastMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#2563eb] text-white font-black text-xl flex items-center justify-center border-2 border-blue-400 shadow-2xs">
                TP
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a]">{name}</h2>
                <p className="text-xs text-slate-500">Head — Training & Placement Cell</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Officer Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Department</label>
                  <input type="text" value={dept} onChange={(e) => setDept(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl" />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button type="submit" className="px-5 py-2.5 bg-[#2563eb] text-white font-bold rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export const TPSettingsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewAlerts, setInterviewAlerts] = useState(true);
  const [placementAlerts, setPlacementAlerts] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMsg('T&P preferences saved.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="T&P Settings" subtitle="Configure notification preferences and drive alerts." />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl w-full mx-auto text-left">
          {toastMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <h2 className="text-base font-extrabold text-[#0f172a] border-b pb-3">Notification Preferences</h2>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              {[
                { label: 'Email Notifications', val: emailAlerts, set: setEmailAlerts },
                { label: 'Interview Alerts', val: interviewAlerts, set: setInterviewAlerts },
                { label: 'Placement Alerts', val: placementAlerts, set: setPlacementAlerts },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 border rounded-xl">
                  <span className="font-bold text-slate-800">{item.label}</span>
                  <input type="checkbox" checked={item.val} onChange={(e) => item.set(e.target.checked)} className="w-4 h-4 accent-[#2563eb] cursor-pointer" />
                </div>
              ))}

              <div className="pt-3 flex justify-end">
                <button type="submit" className="px-5 py-2.5 bg-[#2563eb] text-white font-bold rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer">
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
