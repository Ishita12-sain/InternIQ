import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .url({ message: 'Must be a valid URL' })
  .or(z.literal(''))
  .optional();

export const updateProfileSchema = z.object({
  rollNumber: z.string().trim().min(1, 'Roll number cannot be empty').optional(),
  department: z.string().trim().min(2, 'Department must be at least 2 characters').optional(),
  batch: z.string().trim().optional(),
  semester: z
    .number({ invalid_type_error: 'Semester must be a number' })
    .int('Semester must be an integer')
    .min(1, 'Semester must be at least 1')
    .max(10, 'Semester cannot exceed 10')
    .optional(),
  cgpa: z
    .number({ invalid_type_error: 'CGPA must be a number' })
    .min(0, 'CGPA cannot be negative')
    .max(10, 'CGPA cannot exceed 10.0')
    .optional(),
  backlogs: z
    .number({ invalid_type_error: 'Backlogs must be a number' })
    .int('Backlogs must be an integer')
    .min(0, 'Backlogs cannot be negative')
    .optional(),
  phone: z.string().trim().optional(),
  gender: z.string().trim().optional(),
  bio: z.string().trim().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  resumeUrl: optionalUrl,
});

export const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Skill name is required'),
  category: z.string().trim().optional(),
  proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], {
    errorMap: () => ({
      message: 'Proficiency must be one of: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT',
    }),
  }),
});

export const updateSkillsSchema = z.object({
  skills: z.array(skillItemSchema, {
    required_error: 'Skills array is required',
  }),
});

export const createProjectSchema = z.object({
  title: z.string().trim().min(2, 'Project title must be at least 2 characters'),
  description: z.string().trim().min(5, 'Project description must be at least 5 characters'),
  technologies: z.array(z.string().trim().min(1)).min(1, 'At least one technology is required'),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
  isOngoing: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createCertificationSchema = z.object({
  title: z.string().trim().min(2, 'Certification title must be at least 2 characters'),
  issuer: z.string().trim().min(2, 'Issuer name must be at least 2 characters'),
  issueDate: z.string().trim().min(1, 'Issue date is required'),
  expiryDate: z.string().trim().optional(),
  credentialId: z.string().trim().optional(),
  credentialUrl: optionalUrl,
});

export const updateCertificationSchema = createCertificationSchema.partial();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateSkillsInput = z.infer<typeof updateSkillsSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateCertificationInput = z.infer<typeof createCertificationSchema>;
export type UpdateCertificationInput = z.infer<typeof updateCertificationSchema>;
