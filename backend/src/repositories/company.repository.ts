import crypto from 'crypto';
import { ICompanyProfile } from '../types/company.types';

export class CompanyRepository {
  private companies: Map<string, ICompanyProfile> = new Map(); // key: userId

  private generateId(): string {
    return crypto.randomUUID ? crypto.randomUUID() : `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async findByUserId(userId: string): Promise<ICompanyProfile | null> {
    const company = this.companies.get(userId);
    if (!company) return null;
    return JSON.parse(JSON.stringify(company));
  }

  async findById(id: string): Promise<ICompanyProfile | null> {
    for (const company of this.companies.values()) {
      if (company.id === id) {
        return JSON.parse(JSON.stringify(company));
      }
    }
    return null;
  }

  async getOrCreate(userId: string, defaultName: string = '', defaultEmail: string = ''): Promise<ICompanyProfile> {
    let company = this.companies.get(userId);
    if (!company) {
      const now = new Date();
      company = {
        id: this.generateId(),
        userId,
        companyName: defaultName || 'Company',
        contactEmail: defaultEmail,
        verified: true,
        createdAt: now,
        updatedAt: now,
      };
      this.companies.set(userId, company);
    }
    return JSON.parse(JSON.stringify(company));
  }

  async updateProfile(
    userId: string,
    data: Partial<ICompanyProfile>,
    name?: string,
    email?: string
  ): Promise<ICompanyProfile> {
    const company = await this.getOrCreate(userId, name, email);
    const now = new Date();

    const updatedCompany: ICompanyProfile = {
      ...company,
      ...data,
      userId,
      companyName: data.companyName || name || company.companyName,
      contactEmail: data.contactEmail || email || company.contactEmail,
      updatedAt: now,
    };

    this.companies.set(userId, updatedCompany);
    return JSON.parse(JSON.stringify(updatedCompany));
  }

  async clear(): Promise<void> {
    this.companies.clear();
  }
}

export const companyRepository = new CompanyRepository();
export default companyRepository;
