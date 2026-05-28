import { AppDataSource } from '../config/data-source.js';
import { FAQ } from '../models/faq.entity.js';
import { GetFaqsQueryDto } from '../dtos/faq.dto.js';

export const fetchFaqs = async (query: GetFaqsQueryDto) => {
  const faqRepository = AppDataSource.getRepository(FAQ);

  const qb = faqRepository
    .createQueryBuilder('faq')
    .leftJoinAndSelect('faq.creator', 'creator')
    .select([
      'faq.id',
      'faq.created_by',
      'faq.title',
      'faq.content',
      'faq.category',
      'faq.view_count',
      'faq.is_published',
      'faq.published_at',
      'faq.created_at',
      'creator.id',
      'creator.full_name',
      'creator.email',
    ])
    .orderBy('faq.created_at', 'DESC');

  if (query.category) {
    qb.andWhere('faq.category = :category', { category: query.category });
  }

  if (typeof query.is_published === 'boolean') {
    qb.andWhere('faq.is_published = :isPublished', {
      isPublished: query.is_published,
    });
  }

  return qb.getMany();
};
