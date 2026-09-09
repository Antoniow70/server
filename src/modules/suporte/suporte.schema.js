import { z } from 'zod';
import {
  zodName,
  zodOptionalEmail,
  zodOptionalPhone,
  zodUUID,
  cleanString
} from '../../shared/utils/index.js';

export const submitMessageSchema = z.object({
  body: z.object({
    name: zodName,
    email: zodOptionalEmail,
    phone: zodOptionalPhone,
    genero: z.preprocess((val) => (val === '' || val === null ? null : cleanString(String(val))), z.string().optional().nullable()),
    data_nascimento: z.preprocess((val) => (val === '' || val === null ? null : cleanString(String(val))), z.string().optional().nullable()),
    endereco: z.preprocess((val) => (val === '' || val === null ? null : cleanString(String(val))), z.string().optional().nullable()),
    tipo_necessidade: z.preprocess((val) => (val === '' || val === null ? null : cleanString(String(val))), z.string().optional().nullable()),
    subject: z.string().trim().min(1, 'Assunto é obrigatório'),
    message: z.string().trim().min(1, 'Mensagem é obrigatória')
  })
});

export const updateMessageStatusSchema = z.object({
  params: z.object({
    id: zodUUID
  }),
  body: z.object({
    status: z.enum(['Novo', 'Pendente', 'Em Analise', 'Aceito', 'Aprovado', 'Recusado'])
  })
});

export const bulkUpdateMessageStatusSchema = z.object({
  body: z.object({
    ids: z.array(zodUUID),
    status: z.enum(['Novo', 'Pendente', 'Em Analise', 'Aceito', 'Aprovado', 'Recusado'])
  })
});
