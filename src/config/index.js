/**
 * Uygulama yapılandırma dosyası
 * Hassas verileri ve sabitleri burada tutuyoruz.
 * 
 * ÜRETİM ORTAMI İÇİN:
 * Bu değerler .env dosyasından veya backend'den çekilmelidir.
 * react-native-dotenv veya expo-constants ile entegre edin.
 */

// İletişim bilgileri
export const CONTACT = {
  HELP_PHONE: '05360657242',
  SUPPORT_EMAIL: 'destek@patiapp.com',
};

// Auth ayarları
export const AUTH_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 5 * 60 * 1000, // 5 dakika
  SESSION_KEY: 'pati_user_session',
};

// Email doğrulama regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Şifre gücü kontrolleri
export const PASSWORD_RULES = {
  minLength: 6,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: false,
};

/**
 * Şifre gücünü hesaplar
 * @param {string} password
 * @returns {{ score: number, label: string, color: string }}
 */
export function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Zayıf', color: '#E24B4A' };
  if (score <= 4) return { score, label: 'Orta', color: '#EF9F27' };
  return { score, label: 'Güçlü', color: '#2D7A4F' };
}

/**
 * Email doğrulama
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * Input sanitizasyonu — HTML/script taglerini temizler
 * @param {string} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')       // HTML tagleri kaldır
    .replace(/[<>'"]/g, '')        // Tehlikeli karakterleri kaldır
    .trim();
}
