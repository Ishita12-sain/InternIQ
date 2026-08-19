import crypto from 'crypto';
import {
  IStudent,
  IStudentProfile,
  ISkill,
  IProject,
  ICertification,
  ResumeData,
} from '../types/student.types';

export class StudentRepository {
  private students: Map<string, IStudent> = new Map(); // key: userId

  private generateId(prefix: string = 'id'): string {
    return crypto.randomUUID ? crypto.randomUUID() : `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Find a student record by user ID
   */
  async findByUserId(userId: string): Promise<IStudent | null> {
    const student = this.students.get(userId);
    if (!student) return null;
    return JSON.parse(JSON.stringify(student));
  }

  /**
   * Find a student record by student ID
   */
  async findById(id: string): Promise<IStudent | null> {
    for (const student of this.students.values()) {
      if (student.id === id) {
        return JSON.parse(JSON.stringify(student));
      }
    }
    return null;
  }

  /**
   * Find all student records
   */
  async findAll(): Promise<IStudent[]> {
    return Array.from(this.students.values()).map((s) => JSON.parse(JSON.stringify(s)));
  }

  /**
   * Get an existing student or create a blank one for the given user
   */
  async getOrCreate(userId: string, defaultName: string = '', defaultEmail: string = ''): Promise<IStudent> {
    let student = this.students.get(userId);
    if (!student) {
      const now = new Date();
      student = {
        id: this.generateId('stu'),
        userId,
        name: defaultName,
        email: defaultEmail,
        profile: {
          userId,
          createdAt: now,
          updatedAt: now,
        },
        skills: [],
        projects: [],
        certifications: [],
      };
      this.students.set(userId, student);
    } else {
      if (defaultName && !student.name) student.name = defaultName;
      if (defaultEmail && !student.email) student.email = defaultEmail;
    }
    return JSON.parse(JSON.stringify(student));
  }

  /**
   * Update student profile fields
   */
  async updateProfile(
    userId: string,
    profileData: Partial<IStudentProfile>,
    name?: string,
    email?: string
  ): Promise<IStudent> {
    const student = await this.getOrCreate(userId, name, email);
    const now = new Date();

    const updatedProfile: IStudentProfile = {
      ...student.profile,
      ...profileData,
      userId,
      updatedAt: now,
    };

    const updatedStudent: IStudent = {
      ...student,
      name: name || student.name,
      email: email || student.email,
      profile: updatedProfile,
    };

    this.students.set(userId, updatedStudent);
    return JSON.parse(JSON.stringify(updatedStudent));
  }

  /**
   * Replace or update student skills
   */
  async updateSkills(
    userId: string,
    skills: Array<{ id?: string; name: string; category?: string; proficiency: ISkill['proficiency'] }>
  ): Promise<ISkill[]> {
    const student = await this.getOrCreate(userId);

    const formattedSkills: ISkill[] = skills.map((s) => ({
      id: s.id || this.generateId('sk'),
      name: s.name.trim(),
      category: s.category?.trim(),
      proficiency: s.proficiency,
    }));

    student.skills = formattedSkills;
    student.profile.updatedAt = new Date();
    this.students.set(userId, student);

    return JSON.parse(JSON.stringify(formattedSkills));
  }

  /**
   * Add a new project to student portfolio
   */
  async addProject(userId: string, projectData: Omit<IProject, 'id'>): Promise<IProject> {
    const student = await this.getOrCreate(userId);
    const newProject: IProject = {
      ...projectData,
      id: this.generateId('proj'),
      technologies: projectData.technologies || [],
    };

    student.projects.push(newProject);
    student.profile.updatedAt = new Date();
    this.students.set(userId, student);

    return JSON.parse(JSON.stringify(newProject));
  }

  /**
   * Update an existing project
   */
  async updateProject(
    userId: string,
    projectId: string,
    data: Partial<IProject>
  ): Promise<IProject | null> {
    const student = await this.getOrCreate(userId);
    const index = student.projects.findIndex((p) => p.id === projectId);
    if (index === -1) return null;

    student.projects[index] = {
      ...student.projects[index],
      ...data,
      id: projectId,
    };
    student.profile.updatedAt = new Date();
    this.students.set(userId, student);

    return JSON.parse(JSON.stringify(student.projects[index]));
  }

  /**
   * Delete a project
   */
  async deleteProject(userId: string, projectId: string): Promise<boolean> {
    const student = await this.getOrCreate(userId);
    const initialLen = student.projects.length;
    student.projects = student.projects.filter((p) => p.id !== projectId);
    if (student.projects.length !== initialLen) {
      student.profile.updatedAt = new Date();
      this.students.set(userId, student);
      return true;
    }
    return false;
  }

  /**
   * Add a new certification
   */
  async addCertification(
    userId: string,
    certData: Omit<ICertification, 'id'>
  ): Promise<ICertification> {
    const student = await this.getOrCreate(userId);
    const newCert: ICertification = {
      ...certData,
      id: this.generateId('cert'),
    };

    student.certifications.push(newCert);
    student.profile.updatedAt = new Date();
    this.students.set(userId, student);

    return JSON.parse(JSON.stringify(newCert));
  }

  /**
   * Update an existing certification
   */
  async updateCertification(
    userId: string,
    certId: string,
    data: Partial<ICertification>
  ): Promise<ICertification | null> {
    const student = await this.getOrCreate(userId);
    const index = student.certifications.findIndex((c) => c.id === certId);
    if (index === -1) return null;

    student.certifications[index] = {
      ...student.certifications[index],
      ...data,
      id: certId,
    };
    student.profile.updatedAt = new Date();
    this.students.set(userId, student);

    return JSON.parse(JSON.stringify(student.certifications[index]));
  }

  /**
   * Delete a certification
   */
  async deleteCertification(userId: string, certId: string): Promise<boolean> {
    const student = await this.getOrCreate(userId);
    const initialLen = student.certifications.length;
    student.certifications = student.certifications.filter((c) => c.id !== certId);
    if (student.certifications.length !== initialLen) {
      student.profile.updatedAt = new Date();
      this.students.set(userId, student);
      return true;
    }
    return false;
  }

  /**
   * Compile consolidated resume data
   */
  async getResume(userId: string): Promise<ResumeData> {
    const student = await this.getOrCreate(userId);
    return {
      personalInfo: {
        id: student.id,
        userId: student.userId,
        name: student.name,
        email: student.email,
        phone: student.profile.phone,
        bio: student.profile.bio,
        githubUrl: student.profile.githubUrl,
        linkedinUrl: student.profile.linkedinUrl,
        portfolioUrl: student.profile.portfolioUrl,
        resumeUrl: student.profile.resumeUrl,
      },
      academicInfo: {
        rollNumber: student.profile.rollNumber,
        department: student.profile.department,
        batch: student.profile.batch,
        semester: student.profile.semester,
        cgpa: student.profile.cgpa,
        backlogs: student.profile.backlogs,
      },
      skills: student.skills,
      projects: student.projects,
      certifications: student.certifications,
    };
  }

  /**
   * Clear repository state (testing helper)
   */
  async clear(): Promise<void> {
    this.students.clear();
  }
}

export const studentRepository = new StudentRepository();
export default studentRepository;
