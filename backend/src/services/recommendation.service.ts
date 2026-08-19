import studentRepository from '../repositories/student.repository';
import internshipRepository from '../repositories/internship.repository';
import userRepository from '../repositories/user.repository';
import matchingService from './matching.service';
import { AppError } from '../utils/appError';
import {
  IInternshipRecommendation,
  IMatchResult,
} from '../types/intelligence.types';
import { IStudent } from '../types/student.types';
import { IInternship, InternshipStatus } from '../types/company.types';
import { UserRole } from '../types/user.types';

export class RecommendationService {
  /**
   * Deterministically generate an explainable recommendation rationale
   */
  generateRecommendationReason(
    matchResult: IMatchResult,
    missingSkills: string[]
  ): string {
    const { matchScore, isEligible } = matchResult;
    let reason = '';

    if (matchScore >= 80) {
      if (missingSkills.length === 0) {
        reason = 'Excellent fit across technical skills, academics, and project experience.';
      } else {
        reason = `Strong skill alignment and academic fit. Missing skills: ${missingSkills.join(', ')}.`;
      }
    } else if (matchScore >= 60) {
      if (missingSkills.length === 0) {
        reason = 'Good overall alignment with solid technical and academic foundation.';
      } else {
        reason = `Good potential match. Recommend acquiring missing skills: ${missingSkills.join(', ')}.`;
      }
    } else if (matchScore >= 40) {
      if (missingSkills.length > 0) {
        reason = `Moderate alignment. Focus on developing missing skills: ${missingSkills.join(', ')}.`;
      } else {
        reason = 'Moderate alignment. Consider expanding project portfolio and certifications.';
      }
    } else {
      if (missingSkills.length > 0) {
        reason = `Emerging match. Significant skill development required: ${missingSkills.join(', ')}.`;
      } else {
        reason = 'Emerging match. Core technical and academic prerequisites need enhancement.';
      }
    }

    if (!isEligible) {
      reason += ' (Currently ineligible due to hard criteria)';
    }

    return reason;
  }

  /**
   * Compute recommendations for a student from a list of internships
   */
  computeRecommendations(
    student: IStudent,
    internships: IInternship[]
  ): IInternshipRecommendation[] {
    const now = Date.now();

    // Filter active and non-expired internships
    const activeInternships = internships.filter((internship) => {
      // Must be OPEN
      if (internship.status !== 'OPEN') {
        return false;
      }
      // Must not be expired
      if (internship.applicationDeadline) {
        const deadlineTime = new Date(internship.applicationDeadline).getTime();
        if (!isNaN(deadlineTime) && deadlineTime < now) {
          return false;
        }
      }
      return true;
    });

    const recommendations: IInternshipRecommendation[] = [];

    for (const internship of activeInternships) {
      const matchResult = matchingService.computeMatch(student, internship);
      const missingSkills = matchResult.skillGap.missing || [];
      const recommendationReason = this.generateRecommendationReason(
        matchResult,
        missingSkills
      );

      recommendations.push({
        internshipId: internship.id,
        title: internship.title,
        companyName: internship.companyName,
        location: internship.location,
        mode: internship.mode,
        stipend: internship.stipend,
        duration: internship.duration,
        applicationDeadline: internship.applicationDeadline,
        matchScore: matchResult.matchScore,
        isEligible: matchResult.isEligible,
        scoreBreakdown: matchResult.scoreBreakdown,
        skillGap: matchResult.skillGap,
        missingSkills,
        recommendationReason,
      });
    }

    // Sort descending by matchScore
    // Tie-breaker 1: skillScore descending
    // Tie-breaker 2: internshipId ascending for deterministic ordering
    recommendations.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      if (b.scoreBreakdown.skillScore !== a.scoreBreakdown.skillScore) {
        return b.scoreBreakdown.skillScore - a.scoreBreakdown.skillScore;
      }
      return a.internshipId.localeCompare(b.internshipId);
    });

    return recommendations;
  }

  /**
   * Retrieve ranked internship recommendations for an authenticated student
   */
  async getRecommendationsForStudent(
    studentUserIdOrId: string
  ): Promise<IInternshipRecommendation[]> {
    let student = await studentRepository.findByUserId(studentUserIdOrId);
    if (!student) {
      student = await studentRepository.findById(studentUserIdOrId);
    }
    if (!student) {
      const user = await userRepository.findById(studentUserIdOrId);
      if (user && user.role === UserRole.STUDENT) {
        student = await studentRepository.getOrCreate(user.id, user.name, user.email);
      }
    }
    if (!student) {
      throw AppError.notFound(`Student with ID '${studentUserIdOrId}' not found`);
    }

    const allInternships = await internshipRepository.findAll();
    return this.computeRecommendations(student, allInternships);
  }
}

export const recommendationService = new RecommendationService();
export default recommendationService;
