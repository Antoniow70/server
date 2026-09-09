import { z } from 'zod';
import {
  zodEmail,
  zodPhone,
  zodName,
  zodAmount,
  zodUUID,
  cleanString
} from '../../shared/utils/index.js';

export const submitDonationSchema = z.object({
  body: z.object({
    nome: zodName,
    email: zodEmail,
    telefone: zodPhone,
    causa: z.string().trim().min(1, 'Causa é obrigatória'),
    valor: zodAmount.optional().default(0),
    mensagem: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : cleanString(String(val))),
      z.string().optional().nullable()
    ),
    metodo_pagamento: z.enum(['M-Pesa', 'E-Mola', 'e-Mola', 'Transferencia Bancaria', 'Cartao'])
  })
});

export const updateDonationStatusSchema = z.object({
  params: z.object({
    id: zodUUID
  }),
  body: z.object({
    status: z.enum(['Pendente', 'Em Analise', 'Recebido', 'Confirmado', 'Nao Recebido', 'Recusado'])
  })
});
