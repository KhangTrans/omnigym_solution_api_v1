import { Request, Response } from 'express';
import { fetchFaqs } from '../services/faq.service.js';
import { GetFaqsQueryDto } from '../dtos/faq.dto.js';

const parsePublishedFilter = (value: unknown): boolean | undefined => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const query: GetFaqsQueryDto = {
      category: typeof req.query.category === 'string' ? req.query.category : undefined,
      is_published: parsePublishedFilter(req.query.is_published),
    };

    const faqs = await fetchFaqs(query);

    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
