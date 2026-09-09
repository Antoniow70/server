import { z } from 'zod';
import {
  REGEX_EMAIL,
  REGEX_PHONE_MZ,
  REGEX_PHONE_MPESA,
  REGEX_PHONE_EMOLA,
  REGEX_PHONE_INTL,
  REGEX_NAME,
  REGEX_OTP,
  REGEX_UUID
} from './regex.js';
import { cleanPhone, cleanString, normalizeEmail } from './sanitizers.js';

/**
 * Validador Zod para endereço de e-mail (auto-trim, lowercase e regex RFC 5322).
 */
export const zodEmail = z
  .string()
  .trim()
  .transform(normalizeEmail)
  .pipe(z.string().regex(REGEX_EMAIL, 'Endereço de e-mail inválido'));

/**
 * Validador Zod para e-mail opcional (trata strings vazias como null).
 */
export const zodOptionalEmail = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : val),
  zodEmail.optional().nullable()
);

/**
 * Validador Zod para número de telefone (Moçambique ou Internacional).
 */
export const zodPhone = z
  .string()
  .trim()
  .transform(cleanPhone)
  .refine(
    (val) => REGEX_PHONE_MZ.test(val) || REGEX_PHONE_INTL.test(val),
    'Número de telefone inválido (Moçambique de 9 dígitos ou formato internacional com +)'
  );

/**
 * Validador Zod para telefone opcional.
 */
export const zodOptionalPhone = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : val),
  zodPhone.optional().nullable()
);

/**
 * Validador Zod para nome de pessoa ou entidade (auto-trim, sanitização de espaços e regex).
 */
export const zodName = z
  .string()
  .transform(cleanString)
  .pipe(
    z
      .string()
      .min(2, 'O nome deve ter pelo menos 2 caracteres')
      .max(100, 'O nome não deve exceder 100 caracteres')
      .regex(REGEX_NAME, 'O nome deve conter apenas letras e espaços')
  );

/**
 * Validador Zod para palavra-passe (mínimo de 6 caracteres).
 */
export const zodPassword = z
  .string()
  .min(6, 'A palavra-passe deve ter pelo menos 6 caracteres');

/**
 * Validador Zod para código OTP de recuperação.
 */
export const zodOtp = z
  .string()
  .trim()
  .pipe(z.string().regex(REGEX_OTP, 'Código de verificação deve ter entre 6 e 8 dígitos'));

/**
 * Validador Zod para UUID v4.
 */
export const zodUUID = z
  .string()
  .trim()
  .regex(REGEX_UUID, 'Identificador (UUID) inválido');

/**
 * Validador Zod para UUID v4 opcional ou nulo.
 */
export const zodOptionalUUID = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : val),
  zodUUID.optional().nullable()
);

/**
 * Validador Zod para valor monetário positivo ou zero.
 */
export const zodAmount = z.coerce
  .number()
  .min(0, 'O valor não pode ser negativo');
