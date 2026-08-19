import { Request, Response } from 'express';

export const getHealth = (_req: Request, res: Response): Response => {
  return res.status(200).json({
    success: true,
    message: 'InternIQ API is running',
  });
};
