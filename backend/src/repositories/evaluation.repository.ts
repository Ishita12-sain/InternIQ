import crypto from 'crypto';
import { IEvaluation } from '../types/company.types';

export class EvaluationRepository {
  private evaluations: Map<string, IEvaluation> = new Map(); // key: evaluation.id

  private generateId(): string {
    return crypto.randomUUID ? crypto.randomUUID() : `eval_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async create(data: Omit<IEvaluation, 'id' | 'evaluatedAt'>): Promise<IEvaluation> {
    const id = this.generateId();
    const now = new Date();
    const newEval: IEvaluation = {
      ...data,
      id,
      evaluatedAt: now,
    };

    this.evaluations.set(id, newEval);
    return JSON.parse(JSON.stringify(newEval));
  }

  async findByInternshipAndStudent(
    internshipId: string,
    studentId: string
  ): Promise<IEvaluation | null> {
    for (const ev of this.evaluations.values()) {
      if (ev.internshipId === internshipId && ev.studentId === studentId) {
        return JSON.parse(JSON.stringify(ev));
      }
    }
    return null;
  }

  async findByInternshipId(internshipId: string): Promise<IEvaluation[]> {
    const list = Array.from(this.evaluations.values()).filter(
      (e) => e.internshipId === internshipId
    );
    return JSON.parse(JSON.stringify(list));
  }

  async clear(): Promise<void> {
    this.evaluations.clear();
  }
}

export const evaluationRepository = new EvaluationRepository();
export default evaluationRepository;
