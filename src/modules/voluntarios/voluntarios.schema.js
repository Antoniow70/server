import { z } from 'zod';
import {
  zodName,
  zodEmail,
  zodPhone,
  zodUUID,
  cleanString
} from '../../shared/utils/index.js';

export const submitVolunteerSchema = z.object({
  body: z.object({
    full_name: zodName,
    email: zodEmail,
    phone: zodPhone,
    genero: z.preprocess((val) => (val === '' || val === null ? null : cleanString(String(val))), z.string().optional().nullable()),
    endereco: z.preprocess((val) => (val === '' || val === null ? null : cleanString(String(val))), z.string().optional().nullable()),
    area_interesse: z.preprocess((val) => (val === '' || val === null ? null : cleanString(String(val))), z.string().optional().nullable()),
    message: z.preprocess((val) => (val === '' || val === null ? null : cleanString(String(val))), z.string().optional().nullable()),
    activity_id: zodUUID
  })
});

export const updateVolunteerStatusSchema = z.object({
  params: z.object({
    id: zodUUID
  }),
  body: z.object({
    status: z.enum(['Pendente', 'Em Analise', 'Aprovado', 'Recusado'])
  })
});

export const bulkUpdateVolunteerStatusSchema = z.object({
  body: z.object({
    ids: z.array(zodUUID),
    status: z.enum(['Pendente', 'Em Analise', 'Aprovado', 'Recusado'])
  })
});
