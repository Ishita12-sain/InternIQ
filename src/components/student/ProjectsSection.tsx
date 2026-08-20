import React, { useState } from 'react';
import { FolderGit2, Plus, Code, Globe, ShieldCheck, Clock, ShieldAlert, Trash2, Edit2, FileText, X } from 'lucide-react';
import type { ProjectItem } from '../../types/studentProfile';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onAddProject: () => void;
  onEditProject?: (project: ProjectItem) => void;
  onDeleteProject?: (id: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const getStatusBadge = (status: ProjectItem['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Verified</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending Verification</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0f172a]">Projects & Portfolio</h3>
          <p className="text-xs text-slate-500 mt-0.5">Showcase code repositories, live demos & documentation.</p>
        </div>
        <button
          onClick={onAddProject}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] bg-blue-50 hover:bg-blue-100 border border-blue-200/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
          <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-medium text-slate-500">No project showcases added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3 flex flex-col justify-between transition-all hover:bg-white hover:border-blue-200 hover:shadow-2xs"
            >
              <div className="flex items-start space-x-3">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white shadow-2xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FolderGit2 className="w-7 h-7" />
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="text-sm font-bold text-[#0f172a] truncate">{project.title}</h4>
                      {getStatusBadge(project.verificationStatus)}
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {onEditProject && (
                        <button
                          type="button"
                          onClick={() => onEditProject(project)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteProject && (
                        <button
                          type="button"
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {project.role && (
                    <p className="text-[11px] font-semibold text-blue-600">Role: {project.role}</p>
                  )}

                  <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">{project.description}</p>
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-200 text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Project Links & View Details Footer */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center space-x-3 text-[11px]">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-medium"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:underline font-bold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {project.reportFile && (
                    <span className="inline-flex items-center space-x-1 text-rose-600 font-semibold">
                      <FileText className="w-3 h-3" />
                      <span>PDF Doc</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-left max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center space-x-2">
                <FolderGit2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">{selectedProject.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {selectedProject.thumbnail && (
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={selectedProject.thumbnail} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedProject.title}</h3>
                  {selectedProject.role && (
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">Role: {selectedProject.role}</p>
                  )}
                </div>
                {getStatusBadge(selectedProject.verificationStatus)}
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Description</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{selectedProject.description}</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.techStack.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 border text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Screenshots Gallery</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProject.screenshots.map((ss) => (
                      <div key={ss.id} className="rounded-xl overflow-hidden border border-slate-200 aspect-video">
                        <img src={ss.url} alt={ss.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5"
                    >
                      <Code className="w-4 h-4" />
                      <span>View Code</span>
                    </a>
                  )}

                  {selectedProject.liveDemoUrl && (
                    <a
                      href={selectedProject.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                {selectedProject.reportFile && (
                  <button
                    type="button"
                    onClick={() => {
                      const win = window.open();
                      win?.document.write(`<iframe src="${selectedProject.reportFile}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span>Read Report PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
