/**
 * Catálogo de expressões regulares do Backend da plataforma ALEM.
 * Espelho rigoroso do catálogo do frontend para garantir paridade total.
 */

// E-mail RFC 5322 simplificado
export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Telefones Moçambique (Vodacom 84/85, Movitel 86/87, Tmcel 82/83)
export const REGEX_PHONE_MZ = /^(?:\+258\s?|258\s?)?8[2-7]\d{7}$/;

// Específico Vodacom M-Pesa (84, 85)
export const REGEX_PHONE_MPESA = /^(?:\+258\s?|258\s?)?8[45]\d{7}$/;

// Específico Movitel e-Mola (86, 87)
export const REGEX_PHONE_EMOLA = /^(?:\+258\s?|258\s?)?8[67]\d{7}$/;

// Específico Tmcel (82, 83)
export const REGEX_PHONE_TMCEL = /^(?:\+258\s?|258\s?)?8[23]\d{7}$/;

// Telefone Internacional E.164 flexível
export const REGEX_PHONE_INTL = /^\+?[1-9]\d{7,14}$/;

// Código de recuperação / OTP (6 a 8 dígitos numéricos)
export const REGEX_OTP = /^\d{6,8}$/;
export const REGEX_OTP_8 = /^\d{8}$/;

// Nomes de pessoas e organizações
export const REGEX_NAME = /^[A-Za-zÀ-ÿ\s'-]{2,100}$/;

// Nome completo (primeiro e último nome)
export const REGEX_FULL_NAME = /^[A-Za-zÀ-ÿ'-]{2,}\s+[A-Za-zÀ-ÿ'-]{2,}.*$/;

// NIB Moçambique (21 dígitos)
export const REGEX_NIB_MZ = /^\d{21}$/;

// IBAN Moçambique (MZ59 + 21 dígitos)
export const REGEX_IBAN_MZ = /^MZ59\d{21}$/i;

// Identificadores UUID v4
export const REGEX_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
