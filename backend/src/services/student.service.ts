import studentRepository from '../repositories/student.repository';
import { AppError } from '../utils/appError';
import {
  IStudent,
  ISkill,
  IProject,
  ICertification,
  ResumeData,
} from '../types/student.types';
import { AuthUser, UserRole } from '../types/user.types';
import {
  UpdateProfileInput,
  CreateProjectInput,
  UpdateProjectInput,
  CreateCertificationInput,
  UpdateCertificationInput,
} from '../validations/student.validation';

export class StudentService {
  /**
   * Get student profile for current authenticated user
   */
  async getStudentProfile(userId: string, name: string = '', email: string = ''): Promise<IStudent> {
    return studentRepository.getOrCreate(userId, name, email);
  }

  /**
   * Update student profile
   */
  async updateStudentProfile(
    userId: string,
    data: UpdateProfileInput,
    name?: string,
    email?: string
  ): Promise<IStudent> {
    return studentRepository.updateProfile(userId, data, name, email);
  }

  /**
   * Get student skills
   */
  async getSkills(userId: string): Promise<ISkill[]> {
    const student = await studentRepository.getOrCreate(userId);
    return student.skills;
  }

  /**
   * Replace or update student skills
   */
  async updateSkills(
    userId: string,
    skills: Array<{ id?: string; name: string; category?: string; proficiency: ISkill['proficiency'] }>
  ): Promise<ISkill[]> {
    return studentRepository.updateSkills(userId, skills);
  }

  /**
   * Get all student projects
   */
  async getProjects(userId: string): Promise<IProject[]> {
    const student = await studentRepository.getOrCreate(userId);
    return student.projects;
  }

  /**
   * Add a project to student portfolio
   */
  async addProject(userId: string, data: CreateProjectInput): Promise<IProject> {
    return studentRepository.addProject(userId, data);
  }

  /**
   * Update an existing project
   */
  async updateProject(
    userId: string,
    projectId: string,
    data: UpdateProjectInput
  ): Promise<IProject> {
    const updated = await studentRepository.updateProject(userId, projectId, data);
    if (!updated) {
      throw AppError.notFound(`Project with ID '${projectId}' not found`);
    }
    return updated;
  }

  /**
   * Delete a project
   */
  async deleteProject(userId: string, projectId: string): Promise<void> {
    const deleted = await studentRepository.deleteProject(userId, projectId);
    if (!deleted) {
      throw AppError.notFound(`Project with ID '${projectId}' not found`);
    }
  }

  /**
   * Get all student certifications
   */
  async getCertifications(userId: string): Promise<ICertification[]> {
    const student = await studentRepository.getOrCreate(userId);
    return student.certifications;
  }

  /**
   * Add a certification
   */
  async addCertification(
    userId: string,
    data: CreateCertificationInput
  ): Promise<ICertification> {
    return studentRepository.addCertification(userId, data);
  }

  /**
   * Update an existing certification
   */
  async updateCertification(
    userId: string,
    certId: string,
    data: UpdateCertificationInput
  ): Promise<ICertification> {
    const updated = await studentRepository.updateCertification(userId, certId, data);
    if (!updated) {
      throw AppError.notFound(`Certification with ID '${certId}' not found`);
    }
    return updated;
  }

  /**
   * Delete a certification
   */
  async deleteCertification(userId: string, certId: string): Promise<void> {
    const deleted = await studentRepository.deleteCertification(userId, certId);
    if (!deleted) {
      throw AppError.notFound(`Certification with ID '${certId}' not found`);
    }
  }

  /**
   * Get structured resume data
   */
  async getResume(userId: string): Promise<ResumeData> {
    return studentRepository.getResume(userId);
  }

  /**
   * Retrieve a student by student ID or user ID (Role-protected: TNP, ADMIN, or student themselves)
   */
  async getStudentById(
    identifier: string,
    requestingUser: { id: string; role: string }
  ): Promise<IStudent> {
    // Check by student.id or student.userId
    let student = await studentRepository.findById(identifier);
    if (!student) {
      student = await studentRepository.findByUserId(identifier);
    }

    if (!student) {
      throw AppError.notFound(`Student with identifier '${identifier}' not found`);
    }

    // Role security check
    if (requestingUser.role === 'STUDENT' && student.userId !== requestingUser.id) {
      throw AppError.forbidden("Access forbidden: You cannot access another student's private data");
    }

    return student;
  }
}

export const studentService = new StudentService();
export default studentService;
