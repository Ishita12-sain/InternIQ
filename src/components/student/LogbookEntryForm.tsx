import React, { useState, useEffect } from 'react';
import { X, Save, Send } from 'lucide-react';
import type { LogbookEntryItem, LogbookStatus } from './LogbookEntryCard';

interface LogbookEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<LogbookEntryItem, 'id' | 'facultyReview'> & { id?: string }) => void;
  editingEntry?: LogbookEntryItem | null;
}

export const LogbookEntryForm: React.FC<LogbookEntryFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEntry,
}) => {
  const [date, setDate] = useState('2026-08-19');
  const [workCompleted, setWorkCompleted] = useState('');
  const [skillsGained, setSkillsGained] = useState('');
  const [challengesFaced, setChallengesFaced] = useState('');
  const [hoursWorked, setHoursWorked] = useState(8);

  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setWorkCompleted(editingEntry.workCompleted);
      setSkillsGained(editingEntry.skillsGained.join(', '));
      setChallengesFaced(editingEntry.challengesFaced || '');
      setHoursWorked(editingEntry.hoursWorked);
    } else {
      setDate('2026-08-19');
      setWorkCompleted('');
      setSkillsGained('');
      setChallengesFaced('');
      setHoursWorked(8);
    }
  }, [editingEntry, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (status: LogbookStatus) => {
    if (!workCompleted.trim()) return;

    onSave({
      id: editingEntry ? editingEntry.id : undefined,
      date,
      workCompleted: workCompleted.trim(),
      skillsGained: skillsGained
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      challengesFaced: challengesFaced.trim() || undefined,
      hoursWorked: Number(hoursWorked) || 1,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl relative text-left space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-[#0f172a]">
            {editingEntry ? 'Edit Logbook Entry' : 'Add New Logbook Entry'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Hours Worked *</label>
              <input
                type="number"
                min="1"
                max="16"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Work Completed *</label>
            <textarea
              rows={3}
              placeholder="Describe the tasks, modules, or features completed..."
              value={workCompleted}
              onChange={(e) => setWorkCompleted(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Learning / Skills Gained (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, TypeScript, Tailwind CSS"
              value={skillsGained}
              onChange={(e) => setSkillsGained(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Challenges Faced</label>
            <textarea
              rows={2}
              placeholder="Any technical obstacles encountered and solutions attempted..."
              value={challengesFaced}
              onChange={(e) => setChallengesFaced(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('Draft')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('Submitted')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-semibold shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
