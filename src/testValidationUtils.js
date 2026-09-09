import {
  REGEX_EMAIL,
  REGEX_PHONE_MZ,
  REGEX_PHONE_MPESA,
  REGEX_PHONE_EMOLA,
  REGEX_PHONE_TMCEL,
  REGEX_PHONE_INTL,
  REGEX_NAME,
  REGEX_OTP,
  cleanPhone,
  cleanString,
  normalizeEmail,
  cleanDigits,
  formatTitleCase,
  parseCurrency,
  zodEmail,
  zodPhone,
  zodName,
  zodAmount,
  zodUUID
} from './shared/utils/index.js';

import { loginSchema, forgotPasswordSchema } from './modules/auth/auth.schema.js';
import { submitDonationSchema } from './modules/doacoes/doacoes.schema.js';
import { submitVolunteerSchema } from './modules/voluntarios/voluntarios.schema.js';
import { submitMessageSchema } from './modules/suporte/suporte.schema.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log('====================================================');
console.log('   SUÍTE DE TESTES: REGEX, FORMATAÇÃO E VALIDAÇÕES  ');
console.log('====================================================\n');

// 1. E-mails
console.log('[1] Testes de E-mail:');
assert(normalizeEmail('  Antonio@ALEM.mz  ') === 'antonio@alem.mz', 'Normalização de e-mail com trim e lowercase');
assert(REGEX_EMAIL.test('usuario@dominio.com'), 'Email padrão válido');
assert(REGEX_EMAIL.test('antonio.felix+teste@alem.mz'), 'Email com subendereçamento e domínio moçambicano válido');
assert(!REGEX_EMAIL.test('invalido@'), 'Email sem domínio é rejeitado');
assert(!REGEX_EMAIL.test('invalido@dominio'), 'Email sem TLD é rejeitado');

// 2. Telefones Moçambique
console.log('\n[2] Testes de Telefones (Moçambique e Internacional):');
assert(cleanPhone('84 123 4567') === '841234567', 'Limpeza de telefone nacional');
assert(cleanPhone('+258 84 196 9548') === '+258841969548', 'Limpeza de telefone com indicativo +258');
assert(REGEX_PHONE_MZ.test(cleanPhone('84 123 4567')), 'Vodacom 84 válido');
assert(REGEX_PHONE_MZ.test(cleanPhone('85 999 8888')), 'Vodacom 85 válido');
assert(REGEX_PHONE_MZ.test(cleanPhone('86 123 4567')), 'Movitel 86 válido');
assert(REGEX_PHONE_MZ.test(cleanPhone('87 000 1111')), 'Movitel 87 válido');
assert(REGEX_PHONE_MZ.test(cleanPhone('82 555 4444')), 'Tmcel 82 válido');
assert(REGEX_PHONE_MZ.test(cleanPhone('83 777 6666')), 'Tmcel 83 válido');
assert(!REGEX_PHONE_MZ.test(cleanPhone('81 123 4567')), 'Prefixo inexistente 81 é rejeitado');

// 3. M-Pesa vs E-Mola
console.log('\n[3] Validação de Métodos de Pagamento Móvel (M-Pesa / E-Mola):');
assert(REGEX_PHONE_MPESA.test(cleanPhone('84 196 9548')), 'M-Pesa aceita Vodacom 84');
assert(REGEX_PHONE_MPESA.test(cleanPhone('+258 85 111 2222')), 'M-Pesa aceita Vodacom 85');
assert(!REGEX_PHONE_MPESA.test(cleanPhone('86 123 4567')), 'M-Pesa rejeita Movitel 86');

assert(REGEX_PHONE_EMOLA.test(cleanPhone('86 123 4567')), 'E-Mola aceita Movitel 86');
assert(REGEX_PHONE_EMOLA.test(cleanPhone('87 999 0000')), 'E-Mola aceita Movitel 87');
assert(!REGEX_PHONE_EMOLA.test(cleanPhone('84 123 4567')), 'E-Mola rejeita Vodacom 84');

// 4. Internacional
console.log('\n[4] Telefones Internacionais:');
assert(REGEX_PHONE_INTL.test(cleanPhone('+351 912 345 678')), 'Telefone de Portugal válido');
assert(REGEX_PHONE_INTL.test(cleanPhone('+1 415 555 2671')), 'Telefone dos EUA válido');
assert(REGEX_PHONE_INTL.test(cleanPhone('+27 82 123 4567')), 'Telefone da África do Sul válido');

// 5. Nomes e Title Case
console.log('\n[5] Higienização de Nomes e Strings:');
assert(cleanString('   Múltiplos    espaços     internos   ') === 'Múltiplos espaços internos', 'Compressão de espaços');
assert(formatTitleCase('antónio felix de nhanombe') === 'António Felix de Nhanombe', 'Title Case preservando conectivos');
assert(REGEX_NAME.test('João Félix de Araújo'), 'Nome com acentos em português válido');
assert(!REGEX_NAME.test('João 123'), 'Nome com números é rejeitado');

// 6. Códigos OTP e Valores
console.log('\n[6] Códigos OTP e Valores:');
assert(cleanDigits('5374-9388') === '53749388', 'Limpeza de dígitos do OTP');
assert(REGEX_OTP.test('53749388'), 'OTP de 8 dígitos válido');
assert(parseCurrency('1 500,50 MT') === 1500.5, 'Conversão de Moeda Meticais para float');

// 7. Schemas Zod Completos
console.log('\n[7] Schemas Zod da API:');

// Auth Login
const loginRes = loginSchema.safeParse({
  body: {
    email: '  Admin@alem.mz  ',
    password: 'password123'
  }
});
assert(loginRes.success && loginRes.data.body.email === 'admin@alem.mz', 'LoginSchema normaliza email');

// Doação
const donationRes = submitDonationSchema.safeParse({
  body: {
    nome: '  Amélia dos Santos  ',
    email: '  amelia@gmail.com  ',
    telefone: '84 196 9548',
    causa: 'Apoio a Crianças',
    valor: '500',
    mensagem: '  Força equipa!  ',
    metodo_pagamento: 'M-Pesa'
  }
});
assert(donationRes.success, 'Doação válida é aceite pelo schema');
assert(donationRes.data?.body?.telefone === '841969548', 'Telefone de doação é limpo');
assert(donationRes.data?.body?.valor === 500, 'Valor de doação é convertido para número');

// Voluntários
const volRes = submitVolunteerSchema.safeParse({
  body: {
    full_name: 'Carlos Alberto',
    email: 'carlos@alem.mz',
    phone: '+258 84 000 0000',
    activity_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  }
});
assert(volRes.success, 'Candidatura de voluntário válida é aceite');

// Suporte / Contactos
const supportRes = submitMessageSchema.safeParse({
  body: {
    name: 'Maria da Silva',
    email: '',
    phone: '82 123 4567',
    subject: 'Apoio ortopédico',
    message: 'Gostaria de solicitar uma cadeira de rodas.'
  }
});
assert(supportRes.success, 'Pedido de apoio com email vazio/opcional é aceite');

console.log('\n====================================================');
console.log(`RESULTADO FINAL: ${passed} PASSOU, ${failed} FALHOU`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
