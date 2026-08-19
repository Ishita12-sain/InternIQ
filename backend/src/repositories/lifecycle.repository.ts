import crypto from 'crypto';
import {
  IOfferLetter,
  IMentorAssignment,
  IInternshipProgress,
  IInternshipCompletion,
  IPpoDecision,
  OfferStatus,
  ProgressStatus,
  PpoStatus,
} from '../types/lifecycle.types';

export class LifecycleRepository {
  private offers: Map<string, IOfferLetter> = new Map();
  private mentors: Map<string, IMentorAssignment> = new Map();
  private progressRecords: Map<string, IInternshipProgress> = new Map();
  private completions: Map<string, IInternshipCompletion> = new Map();
  private ppos: Map<string, IPpoDecision> = new Map();

  private generateId(prefix: string): string {
    return crypto.randomUUID ? crypto.randomUUID() : `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // ==========================================
  // Offer Letter Methods
  // ==========================================

  async createOffer(
    data: Omit<IOfferLetter, 'id' | 'issuedAt' | 'status'>
  ): Promise<IOfferLetter> {
    const id = this.generateId('offer');
    const offer: IOfferLetter = {
      ...data,
      id,
      status: 'OFFERED',
      issuedAt: new Date(),
    };
    this.offers.set(id, offer);
    return JSON.parse(JSON.stringify(offer));
  }

  async findOfferById(id: string): Promise<IOfferLetter | null> {
    const offer = this.offers.get(id);
    if (!offer) return null;
    return JSON.parse(JSON.stringify(offer));
  }

  async findOffersByInternshipId(internshipId: string): Promise<IOfferLetter[]> {
    const list = Array.from(this.offers.values()).filter(
      (o) => o.internshipId === internshipId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async findOffersByStudentId(studentId: string): Promise<IOfferLetter[]> {
    const list = Array.from(this.offers.values()).filter(
      (o) => o.studentId === studentId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async findOfferByApplicationId(applicationId: string): Promise<IOfferLetter | null> {
    for (const offer of this.offers.values()) {
      if (offer.applicationId === applicationId) {
        return JSON.parse(JSON.stringify(offer));
      }
    }
    return null;
  }

  async updateOfferStatus(
    id: string,
    status: OfferStatus
  ): Promise<IOfferLetter | null> {
    const offer = this.offers.get(id);
    if (!offer) return null;
    offer.status = status;
    offer.respondedAt = new Date();
    this.offers.set(id, offer);
    return JSON.parse(JSON.stringify(offer));
  }

  // ==========================================
  // Mentor Assignment Methods
  // ==========================================

  async createMentorAssignment(
    data: Omit<IMentorAssignment, 'id' | 'assignedAt' | 'status'>
  ): Promise<IMentorAssignment> {
    const id = this.generateId('mentor');
    const assignment: IMentorAssignment = {
      ...data,
      id,
      status: 'ACTIVE',
      assignedAt: new Date(),
    };
    this.mentors.set(id, assignment);
    return JSON.parse(JSON.stringify(assignment));
  }

  async findMentorsByInternshipId(internshipId: string): Promise<IMentorAssignment[]> {
    const list = Array.from(this.mentors.values()).filter(
      (m) => m.internshipId === internshipId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async findMentorsByStudentId(studentId: string): Promise<IMentorAssignment[]> {
    const list = Array.from(this.mentors.values()).filter(
      (m) => m.studentId === studentId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async findMentorByInternshipAndStudent(
    internshipId: string,
    studentId: string
  ): Promise<IMentorAssignment | null> {
    for (const m of this.mentors.values()) {
      if (m.internshipId === internshipId && m.studentId === studentId) {
        return JSON.parse(JSON.stringify(m));
      }
    }
    return null;
  }

  // ==========================================
  // Progress Record Methods
  // ==========================================

  async createProgress(
    data: Omit<IInternshipProgress, 'id' | 'submittedAt' | 'status'>
  ): Promise<IInternshipProgress> {
    const id = this.generateId('prog');
    const record: IInternshipProgress = {
      ...data,
      id,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    };
    this.progressRecords.set(id, record);
    return JSON.parse(JSON.stringify(record));
  }

  async findProgressById(id: string): Promise<IInternshipProgress | null> {
    const prog = this.progressRecords.get(id);
    if (!prog) return null;
    return JSON.parse(JSON.stringify(prog));
  }

  async findProgressByInternshipAndStudent(
    internshipId: string,
    studentId: string
  ): Promise<IInternshipProgress[]> {
    const list = Array.from(this.progressRecords.values()).filter(
      (p) => p.internshipId === internshipId && p.studentId === studentId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async updateProgressReview(
    id: string,
    status: ProgressStatus,
    reviewedBy: string,
    reviewerComments?: string
  ): Promise<IInternshipProgress | null> {
    const prog = this.progressRecords.get(id);
    if (!prog) return null;
    prog.status = status;
    prog.reviewedBy = reviewedBy;
    prog.reviewerComments = reviewerComments;
    prog.reviewedAt = new Date();
    this.progressRecords.set(id, prog);
    return JSON.parse(JSON.stringify(prog));
  }

  // ==========================================
  // Completion Methods
  // ==========================================

  async createCompletion(
    data: Omit<IInternshipCompletion, 'id' | 'completedAt' | 'status'>
  ): Promise<IInternshipCompletion> {
    const id = this.generateId('comp');
    const completion: IInternshipCompletion = {
      ...data,
      id,
      status: 'COMPLETED',
      completedAt: new Date(),
    };
    this.completions.set(id, completion);
    return JSON.parse(JSON.stringify(completion));
  }

  async findCompletionByInternshipAndStudent(
    internshipId: string,
    studentId: string
  ): Promise<IInternshipCompletion | null> {
    for (const c of this.completions.values()) {
      if (c.internshipId === internshipId && c.studentId === studentId) {
        return JSON.parse(JSON.stringify(c));
      }
    }
    return null;
  }

  async findCompletionsByInternshipId(internshipId: string): Promise<IInternshipCompletion[]> {
    const list = Array.from(this.completions.values()).filter(
      (c) => c.internshipId === internshipId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async findCompletionsByStudentId(studentId: string): Promise<IInternshipCompletion[]> {
    const list = Array.from(this.completions.values()).filter(
      (c) => c.studentId === studentId
    );
    return JSON.parse(JSON.stringify(list));
  }

  // ==========================================
  // PPO Decision Methods
  // ==========================================

  async upsertPpo(
    data: Omit<IPpoDecision, 'id' | 'updatedAt'>
  ): Promise<IPpoDecision> {
    let existing: IPpoDecision | null = null;
    for (const p of this.ppos.values()) {
      if (p.internshipId === data.internshipId && p.studentId === data.studentId) {
        existing = p;
        break;
      }
    }

    const now = new Date();
    if (existing) {
      existing.status = data.status;
      existing.packageLpa = data.packageLpa;
      existing.designation = data.designation;
      existing.joiningDate = data.joiningDate;
      existing.remarks = data.remarks;
      existing.updatedAt = now;
      existing.updatedBy = data.updatedBy;
      this.ppos.set(existing.id, existing);
      return JSON.parse(JSON.stringify(existing));
    } else {
      const id = this.generateId('ppo');
      const newPpo: IPpoDecision = {
        ...data,
        id,
        updatedAt: now,
      };
      this.ppos.set(id, newPpo);
      return JSON.parse(JSON.stringify(newPpo));
    }
  }

  async findPpoByInternshipAndStudent(
    internshipId: string,
    studentId: string
  ): Promise<IPpoDecision | null> {
    for (const p of this.ppos.values()) {
      if (p.internshipId === internshipId && p.studentId === studentId) {
        return JSON.parse(JSON.stringify(p));
      }
    }
    return null;
  }

  async findPposByInternshipId(internshipId: string): Promise<IPpoDecision[]> {
    const list = Array.from(this.ppos.values()).filter(
      (p) => p.internshipId === internshipId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async clear(): Promise<void> {
    this.offers.clear();
    this.mentors.clear();
    this.progressRecords.clear();
    this.completions.clear();
    this.ppos.clear();
  }
}

export const lifecycleRepository = new LifecycleRepository();
export default lifecycleRepository;
