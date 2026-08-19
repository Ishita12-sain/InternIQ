import { z } from 'zod';

export const createOfferSchema = z.object({
  applicationId: z.string().trim().min(1, 'Application ID is required'),
  startDate: z.string().trim().min(1, 'Start date is required'),
  duration: z.string().trim().min(1, 'Duration is required'),
  stipend: z.number().nonnegative('Stipend must be non-negative'),
  currency: z.string().trim().default('INR'),
  terms: z.string().trim().optional(),
});

export const respondOfferSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT']),
});

export const assignMentorSchema = z.object({
  studentId: z.string().trim().min(1, 'Student ID is required'),
  mentorName: z.string().trim().min(2, 'Mentor name must be at least 2 characters'),
  mentorEmail: z.string().trim().email('Valid mentor email is required'),
  mentorDesignation: z.string().trim().optional(),
  mentorDepartment: z.string().trim().optional(),
});

export const submitProgressSchema = z.object({
  internshipId: z.string().trim().min(1, 'Internship ID is required'),
  milestoneTitle: z.string().trim().min(3, 'Milestone title must be at least 3 characters'),
  tasksCompleted: z.string().trim().min(5, 'Tasks completed description is required'),
  learnings: z.string().trim().min(5, 'Learnings description is required'),
  blockers: z.string().trim().optional(),
});

export const reviewProgressSchema = z.object({
  status: z.enum(['APPROVED', 'NEEDS_REVISION']),
  reviewerComments: z.string().trim().optional(),
});

export const completeInternshipSchema = z.object({
  studentId: z.string().trim().min(1, 'Student ID is required'),
  startDate: z.string().trim().min(1, 'Start date is required'),
  completionDate: z.string().trim().min(1, 'Completion date is required'),
  finalRemarks: z.string().trim().min(5, 'Final remarks are required'),
  certificateUrl: z.string().trim().url('Valid certificate URL is required').optional(),
});

export const updatePpoDecisionSchema = z.object({
  studentId: z.string().trim().min(1, 'Student ID is required'),
  status: z.enum(['UNDER_REVIEW', 'RECOMMENDED', 'OFFERED', 'ACCEPTED', 'DECLINED']),
  packageLpa: z.number().positive('Package LPA must be positive').optional(),
  designation: z.string().trim().optional(),
  joiningDate: z.string().trim().optional(),
  remarks: z.string().trim().optional(),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type RespondOfferInput = z.infer<typeof respondOfferSchema>;
export type AssignMentorInput = z.infer<typeof assignMentorSchema>;
export type SubmitProgressInput = z.infer<typeof submitProgressSchema>;
export type ReviewProgressInput = z.infer<typeof reviewProgressSchema>;
export type CompleteInternshipInput = z.infer<typeof completeInternshipSchema>;
export type UpdatePpoDecisionInput = z.infer<typeof updatePpoDecisionSchema>;
