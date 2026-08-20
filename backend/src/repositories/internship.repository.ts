import crypto from 'crypto';
import { IInternship, InternshipStatus } from '../types/company.types';

export class InternshipRepository {
  private internships: Map<string, IInternship> = new Map(); // key: internship.id

  private generateId(): string {
    return crypto.randomUUID ? crypto.randomUUID() : `int_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async create(data: Omit<IInternship, 'id' | 'createdAt' | 'updatedAt'>): Promise<IInternship> {
    const id = this.generateId();
    const now = new Date();
    const newInternship: IInternship = {
      ...data,
      id,
      currency: data.currency || 'INR',
      status: data.status || 'OPEN',
      allowedBranches: data.allowedBranches || [],
      requiredSkills: data.requiredSkills || [],
      certifications: data.certifications || [],
      createdAt: now,
      updatedAt: now,
    };

    this.internships.set(id, newInternship);
    return JSON.parse(JSON.stringify(newInternship));
  }

  async findAll(filter?: {
    status?: InternshipStatus;
    companyId?: string;
    search?: string;
  }): Promise<IInternship[]> {
    let result = Array.from(this.internships.values());

    if (filter?.status) {
      result = result.filter((i) => i.status === filter.status);
    }

    if (filter?.companyId) {
      result = result.filter((i) => i.companyId === filter.companyId);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.companyName.toLowerCase().includes(q) ||
          i.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    return JSON.parse(JSON.stringify(result));
  }

  async findById(id: string): Promise<IInternship | null> {
    const internship = this.internships.get(id);
    if (!internship) return null;
    return JSON.parse(JSON.stringify(internship));
  }

  async update(
    id: string,
    companyId: string,
    data: Partial<IInternship>
  ): Promise<IInternship | null> {
    const internship = this.internships.get(id);
    if (!internship) return null;

    // Strict ownership verification
    if (internship.companyId !== companyId) {
      return null;
    }

    const now = new Date();
    const updatedInternship: IInternship = {
      ...internship,
      ...data,
      id,
      companyId, // Ensure companyId cannot be hijacked
      updatedAt: now,
    };

    this.internships.set(id, updatedInternship);
    return JSON.parse(JSON.stringify(updatedInternship));
  }

  async delete(id: string, companyId: string): Promise<boolean> {
    const internship = this.internships.get(id);
    if (!internship) return false;

    // Strict ownership verification
    if (internship.companyId !== companyId) {
      return false;
    }

    this.internships.delete(id);
    return true;
  }

  async clear(): Promise<void> {
    this.internships.clear();
  }
}

export const internshipRepository = new InternshipRepository();
export default internshipRepository;
