import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().trim().min(1, 'ID is required'),
});

export const internshipIdParamSchema = z.object({
  internshipId: z.string().trim().min(1, 'Internship ID is required'),
});

export const internshipStudentParamsSchema = z.object({
  id: z.string().trim().min(1, 'Internship ID is required'),
  studentId: z.string().trim().min(1, 'Student ID is required'),
});

export type IdParam = z.infer<typeof idParamSchema>;
export type InternshipIdParam = z.infer<typeof internshipIdParamSchema>;
export type InternshipStudentParams = z.infer<typeof internshipStudentParamsSchema>;
