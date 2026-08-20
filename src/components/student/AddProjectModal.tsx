import React, { useState, useRef } from 'react';
import { X, FileText, Image as ImageIcon, Trash2, Info, Plus, Code, Globe } from 'lucide-react';
import type { ProjectItem } from '../../types/studentProfile';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectItem) => void;
  editingProject?: ProjectItem | null;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject,
}) => {
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const screenshotsInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(editingProject?.title || '');
  const [description, setDescription] = useState(editingProject?.description || '');
  const [role, setRole] = useState(editingProject?.role || '');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(editingProject?.techStack || []);
  const [startDate, setStartDate] = useState(editingProject?.startDate || '');
  const [endDate, setEndDate] = useState(editingProject?.endDate || '');
  const [githubUrl, setGithubUrl] = useState(editingProject?.githubUrl || '');
  const [liveDemoUrl, setLiveDemoUrl] = useState(editingProject?.liveDemoUrl || '');

  const [thumbnail, setThumbnail] = useState<string | undefined>(editingProject?.thumbnail);
  const [thumbnailFileName, setThumbnailFileName] = useState<string | undefined>(editingProject?.thumbnailFileName);

  const [screenshots, setScreenshots] = useState<Array<{ id: string; url: string; name: string }>>(
    editingProject?.screenshots || []
  );

  const [reportFile, setReportFile] = useState<string | undefined>(editingProject?.reportFile);
  const [reportFileName, setReportFileName] = useState<string | undefined>(editingProject?.reportFileName);

  const [teamSize, setTeamSize] = useState<number | undefined>(editingProject?.teamSize || 1);
  const [memberInput, setMemberInput] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>(editingProject?.teamMembers || []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Add Tag Handlers
  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack((prev) => [...prev, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack((prev) => prev.filter((t) => t !== tech));
  };

  // Thumbnail Select
  const handleThumbnailSelect = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, thumbnail: 'Invalid image format. Upload JPG, PNG or WEBP.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, thumbnail: 'Thumbnail file size must be less than 5 MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnail(e.target?.result as string);
      setThumbnailFileName(file.name);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.thumbnail;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  // Screenshot Multi-Select
  const handleScreenshotSelect = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshots((prev) => [
          ...prev,
          {
            id: String(Date.now() + Math.random()),
            url: e.target?.result as string,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // PDF Report Select
  const handleReportSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrors((prev) => ({ ...prev, reportFile: 'Project documentation must be a PDF file.' }));
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, reportFile: 'PDF documentation size must be under 15 MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setReportFile(e.target?.result as string);
      setReportFileName(file.name);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.reportFile;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Project Title is required';
    if (!description.trim()) newErrors.description = 'Project Description is required';
    if (!thumbnail) newErrors.thumbnail = 'Project Main Image / Thumbnail is required';

    if (githubUrl.trim() && !/^https?:\/\/.+/i.test(githubUrl.trim())) {
      newErrors.githubUrl = 'Enter a valid URL starting with http:// or https://';
    }

    if (liveDemoUrl.trim() && !/^https?:\/\/.+/i.test(liveDemoUrl.trim())) {
      newErrors.liveDemoUrl = 'Enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const projectData: ProjectItem = {
        id: editingProject?.id || String(Date.now()),
        title: title.trim(),
        description: description.trim(),
        role: role.trim() || undefined,
        techStack: techStack.length > 0 ? techStack : ['React', 'TypeScript'],
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        githubUrl: githubUrl.trim() || undefined,
        liveDemoUrl: liveDemoUrl.trim() || undefined,
        thumbnail,
        thumbnailFileName,
        screenshots,
        reportFile,
        reportFileName,
        teamSize,
        teamMembers,
        verificationStatus: editingProject?.verificationStatus || 'pending',
        createdAt: editingProject?.createdAt || new Date().toISOString(),
      };

      onSave(projectData);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingProject ? 'Edit Project Showcase' : 'Add New Project'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add technical projects, screenshots, live demo links and project documentation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Info Banner */}
        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start space-x-3 text-amber-900 text-xs shrink-0">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-950">Review Workflow:</span> Uploaded project code & evidence will be reviewed by Faculty / T&P Officer before receiving verified status.
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. InternIQ Placement & Internship Management System"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.title ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-600 font-medium">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Project Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Detailed summary of problem statement, solution architecture, engineering challenges..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.description ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
              {errors.description && <p className="text-xs text-rose-600 font-medium">{errors.description}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Your Role <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Full Stack Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Team Size */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Team Size <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={teamSize || ''}
                onChange={(e) => setTeamSize(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Team Members Tag Manager */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Team Members / Collaborators <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Enter teammate name & press Add"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (memberInput.trim() && !teamMembers.includes(memberInput.trim())) {
                        setTeamMembers((prev) => [...prev, memberInput.trim()]);
                        setMemberInput('');
                      }
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (memberInput.trim() && !teamMembers.includes(memberInput.trim())) {
                      setTeamMembers((prev) => [...prev, memberInput.trim()]);
                      setMemberInput('');
                    }
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              {teamMembers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {teamMembers.map((mem) => (
                    <span
                      key={mem}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <span>{mem}</span>
                      <button
                        type="button"
                        onClick={() => setTeamMembers((prev) => prev.filter((m) => m !== mem))}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Technologies Tag Manager */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Technologies / Skills Used
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, PostgreSQL (Press Add or Enter)"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200/60 text-blue-700 rounded-lg text-xs font-semibold"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* GitHub Repo URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                <Code className="w-3.5 h-3.5" />
                <span>GitHub Repository URL</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  if (errors.githubUrl) setErrors((prev) => ({ ...prev, githubUrl: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                  errors.githubUrl ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-blue-600'
                }`}
              />
              {errors.githubUrl && <p className="text-xs text-rose-600 font-medium">{errors.githubUrl}</p>}
            </div>

            {/* Live Demo URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Live Demo URL</span>
              </label>
              <input
                type="url"
                placeholder="https://myproject.vercel.app"
                value={liveDemoUrl}
                onChange={(e) => {
                  setLiveDemoUrl(e.target.value);
                  if (errors.liveDemoUrl) setErrors((prev) => ({ ...prev, liveDemoUrl: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                  errors.liveDemoUrl ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-blue-600'
                }`}
              />
              {errors.liveDemoUrl && <p className="text-xs text-rose-600 font-medium">{errors.liveDemoUrl}</p>}
            </div>
          </div>

          {/* Project Main Thumbnail Upload */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700">
              Project Main Image / Cover Thumbnail <span className="text-rose-500">*</span>
            </label>

            {!thumbnail ? (
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  errors.thumbnail ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleThumbnailSelect(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to upload main project image (JPG, PNG or WEBP)
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={thumbnail} alt="Project Thumbnail" className="w-14 h-10 object-cover rounded-lg border border-slate-200" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">{thumbnailFileName || 'Project_Cover_Image'}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Cover Thumbnail Ready</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail(undefined);
                    setThumbnailFileName(undefined);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            {errors.thumbnail && <p className="text-xs text-rose-600 font-medium">{errors.thumbnail}</p>}
          </div>

          {/* Project Screenshots Gallery Upload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Project Screenshots / Gallery <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <button
                type="button"
                onClick={() => screenshotsInputRef.current?.click()}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Screenshots</span>
              </button>
              <input
                ref={screenshotsInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleScreenshotSelect(e.target.files);
                }}
              />
            </div>

            {screenshots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                {screenshots.map((ss) => (
                  <div key={ss.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img src={ss.url} alt={ss.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setScreenshots((prev) => prev.filter((s) => s.id !== ss.id))}
                      className="absolute top-1 right-1 p-1 bg-slate-900/70 hover:bg-rose-600 text-white rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No gallery screenshots added yet.</p>
            )}
          </div>

          {/* Project Report / Documentation PDF */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-700">
              Project Report / Documentation PDF <span className="text-slate-400 font-normal">(Optional)</span>
            </label>

            {!reportFile ? (
              <div
                onClick={() => reportInputRef.current?.click()}
                className="p-3 border border-slate-300 hover:border-blue-400 bg-slate-50/50 rounded-2xl text-center cursor-pointer flex items-center justify-center space-x-2 text-xs text-slate-600"
              >
                <input
                  ref={reportInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleReportSelect(e.target.files[0]);
                    }
                  }}
                />
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Upload Project Synopsis / Report PDF (Max 15 MB)</span>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5 truncate">
                  <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 truncate">{reportFileName || 'Project_Report.pdf'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReportFile(undefined);
                    setReportFileName(undefined);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            {errors.reportFile && <p className="text-xs text-rose-600 font-medium">{errors.reportFile}</p>}
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 inline-flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingProject ? 'Update Project' : 'Save Project'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
