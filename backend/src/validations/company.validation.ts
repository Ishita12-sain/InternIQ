import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .url({ message: 'Must be a valid URL' })
  .or(z.literal(''))
  .optional();

export const updateCompanyProfileSchema = z.object({
  companyName: z.string().trim().min(2, 'Company name must be at least 2 characters').optional(),
  industry: z.string().trim().optional(),
  website: optionalUrl,
  location: z.string().trim().optional(),
  description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters').optional(),
  size: z.string().trim().optional(),
  contactEmail: z.string().trim().email('Must be a valid email').optional(),
  contactPhone: z.string().trim().optional(),
  logoUrl: optionalUrl,
  linkedinUrl: optionalUrl,
});

export const createInternshipSchema = z.object({
  title: z.string().trim().min(3, 'Internship title must be at least 3 characters').max(120),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5000),
  duration: z.string().trim().min(1, 'Duration is required'),
  mode: z.enum(['ON_SITE', 'REMOTE', 'HYBRID'], {
    errorMap: () => ({ message: 'Mode must be ON_SITE, REMOTE, or HYBRID' }),
  }),
  location: z.string().trim().min(2, 'Location is required'),
  stipend: z
    .number({ invalid_type_error: 'Stipend must be a number' })
    .min(0, 'Stipend cannot be negative'),
  currency: z.string().trim().default('INR').optional(),
  vacancies: z
    .number({ invalid_type_error: 'Vacancies must be a number' })
    .int('Vacancies must be an integer')
    .min(1, 'Vacancies must be at least 1'),
  applicationDeadline: z.string().trim().min(1, 'Application deadline is required'),
  minCgpa: z
    .number({ invalid_type_error: 'Minimum CGPA must be a number' })
    .min(0, 'Minimum CGPA cannot be negative')
    .max(10, 'Minimum CGPA cannot exceed 10.0'),
  allowedBranches: z.array(z.string().trim().min(1)).min(1, 'At least one branch is required'),
  requiredSkills: z.array(z.string().trim().min(1)).default([]),
  certifications: z.array(z.string().trim().min(1)).optional(),
  experience: z.string().trim().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'DRAFT']).default('OPEN').optional(),
});

export const updateInternshipSchema = createInternshipSchema.partial();

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['SHORTLISTED', 'SELECTED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status must be SHORTLISTED, SELECTED, or REJECTED' }),
  }),
  comment: z.string().trim().max(500).optional(),
});

export const createEvaluationSchema = z.object({
  studentId: z.string().trim().min(1, 'Student ID is required'),
  performanceRating: z.number().int().min(1, 'Rating must be 1 to 5').max(5, 'Rating must be 1 to 5'),
  technicalSkillsRating: z.number().int().min(1, 'Rating must be 1 to 5').max(5, 'Rating must be 1 to 5'),
  softSkillsRating: z.number().int().min(1, 'Rating must be 1 to 5').max(5, 'Rating must be 1 to 5'),
  workQualityRating: z.number().int().min(1, 'Rating must be 1 to 5').max(5, 'Rating must be 1 to 5'),
  attendanceRating: z.number().int().min(1, 'Rating must be 1 to 5').max(5, 'Rating must be 1 to 5'),
  comments: z.string().trim().min(5, 'Comments must be at least 5 characters').max(2000),
  ppoRecommendation: z.enum(['RECOMMENDED', 'NOT_RECOMMENDED', 'UNDER_REVIEW'], {
    errorMap: () => ({ message: 'PPO recommendation must be RECOMMENDED, NOT_RECOMMENDED, or UNDER_REVIEW' }),
  }),
});

export type UpdateCompanyProfileInput = z.infer<typeof updateCompanyProfileSchema>;
export type CreateInternshipInput = z.infer<typeof createInternshipSchema>;
export type UpdateInternshipInput = z.infer<typeof updateInternshipSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>;
