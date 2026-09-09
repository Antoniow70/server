/**
 * Sanitizadores e normalizadores de dados para o Backend da plataforma ALEM.
 * Executados antes da persistência no banco de dados Supabase ou envio de e-mails.
 */

/**
 * Remove espaços em branco externos e reduz múltiplos espaços internos a um único.
 * @param {string} str
 * @returns {string}
 */
export function cleanString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Normaliza e-mail: remove espaços externos e converte para minúsculas.
 * @param {string} email
 * @returns {string}
 */
export function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Extrai somente os dígitos numéricos.
 * @param {string|number} value
 * @returns {string}
 */
export function cleanDigits(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\D/g, '');
}

/**
 * Limpa número de telefone mantendo dígitos e '+' inicial.
 * @param {string} phone
 * @returns {string}
 */
export function cleanPhone(phone) {
  if (!phone) return '';
  const trimmed = String(phone).trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Converte nome para Title Case.
 * @param {string} str
 * @returns {string}
 */
export function formatTitleCase(str) {
  if (!str) return '';
  const lowerWords = ['de', 'da', 'do', 'das', 'dos', 'e'];
  return cleanString(str)
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index > 0 && lowerWords.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Converte valor em moeda para número float positivo.
 * @param {string|number} value
 * @returns {number}
 */
export function parseCurrency(value) {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  const cleaned = String(value)
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
