import { z } from 'zod';
import { zodName, zodUUID, zodOptionalUUID, cleanString } from '../../shared/utils/index.js';

export const createStorySchema = z.object({
  body: z.object({
    full_name: zodName,
    story: z.string().trim().min(1, 'História é obrigatória'),
    project_id: zodOptionalUUID,
    image_url: z.string().optional().nullable()
  })
});

export const updateStorySchema = z.object({
  params: z.object({
    id: zodUUID
  }),
  body: z.object({
    full_name: zodName.optional(),
    story: z.string().trim().min(1, 'História é obrigatória').optional(),
    project_id: zodOptionalUUID,
    image_url: z.string().optional().nullable()
  })
});
