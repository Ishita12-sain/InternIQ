import crypto from 'crypto';
import { IApplication, ApplicationStatus } from '../types/company.types';

export class ApplicationRepository {
  private applications: Map<string, IApplication> = new Map(); // key: application.id

  private generateId(): string {
    return crypto.randomUUID ? crypto.randomUUID() : `app_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async create(
    data: Omit<IApplication, 'id' | 'appliedAt' | 'updatedAt' | 'statusHistory'>
  ): Promise<IApplication> {
    const id = this.generateId();
    const now = new Date();
    const newApplication: IApplication = {
      ...data,
      id,
      status: data.status || 'APPLIED',
      appliedAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: data.status || 'APPLIED',
          changedAt: now,
          changedBy: data.studentName || 'Student',
          comment: 'Initial application submitted',
        },
      ],
    };

    this.applications.set(id, newApplication);
    return JSON.parse(JSON.stringify(newApplication));
  }

  async findByInternshipId(internshipId: string): Promise<IApplication[]> {
    const list = Array.from(this.applications.values()).filter(
      (a) => a.internshipId === internshipId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async findByStudentId(studentId: string): Promise<IApplication[]> {
    const list = Array.from(this.applications.values()).filter(
      (a) => a.studentId === studentId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async findById(id: string): Promise<IApplication | null> {
    const app = this.applications.get(id);
    if (!app) return null;
    return JSON.parse(JSON.stringify(app));
  }

  async findByStudentAndInternship(
    studentId: string,
    internshipId: string
  ): Promise<IApplication | null> {
    for (const app of this.applications.values()) {
      if (app.studentId === studentId && app.internshipId === internshipId) {
        return JSON.parse(JSON.stringify(app));
      }
    }
    return null;
  }

  async updateStatus(
    id: string,
    newStatus: ApplicationStatus,
    changedBy: string,
    comment?: string
  ): Promise<IApplication | null> {
    const app = this.applications.get(id);
    if (!app) return null;

    const now = new Date();
    app.status = newStatus;
    app.updatedAt = now;
    app.statusHistory.push({
      status: newStatus,
      changedAt: now,
      changedBy,
      comment,
    });

    this.applications.set(id, app);
    return JSON.parse(JSON.stringify(app));
  }

  async clear(): Promise<void> {
    this.applications.clear();
  }
}

export const applicationRepository = new ApplicationRepository();
export default applicationRepository;
