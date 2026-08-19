import React from 'react';
import { FolderGit2, Plus } from 'lucide-react';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onAddProject: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onAddProject }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">Projects</h3>
        <button
          onClick={onAddProject}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] bg-blue-50 hover:bg-blue-100 border border-blue-200/60 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <FolderGit2 className="w-4 h-4 text-[#2563eb]" />
                <h4 className="text-sm font-bold text-[#0f172a]">{project.title}</h4>
              </div>
              <p className="text-xs text-[#64748b] leading-relaxed">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-200 text-slate-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
