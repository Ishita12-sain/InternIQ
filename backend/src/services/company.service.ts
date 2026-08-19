import companyRepository from '../repositories/company.repository';
import { ICompanyProfile } from '../types/company.types';
import { UpdateCompanyProfileInput } from '../validations/company.validation';

export class CompanyService {
  /**
   * Get company profile for current authenticated user
   */
  async getProfile(userId: string, name: string = '', email: string = ''): Promise<ICompanyProfile> {
    return companyRepository.getOrCreate(userId, name, email);
  }

  /**
   * Update company profile
   */
  async updateProfile(
    userId: string,
    data: UpdateCompanyProfileInput,
    name?: string,
    email?: string
  ): Promise<ICompanyProfile> {
    return companyRepository.updateProfile(userId, data, name, email);
  }
}

export const companyService = new CompanyService();
export default companyService;
