import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { AUTH_CONFIG, isValidEmail } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Login/register işlemi sürüyor mu
  const [isRestoring, setIsRestoring] = useState(true); // Açılışta kayıtlı oturum yükleniyor mu
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  // Uygulama açıldığında kayıtlı oturumu kontrol et
  useEffect(() => {
    loadSession();
  }, []);

  /**
   * SecureStore'dan kayıtlı oturumu yükle
   */
  const loadSession = async () => {
    try {
      const sessionJson = await SecureStore.getItemAsync(AUTH_CONFIG.SESSION_KEY);
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        // Oturum süresi kontrolü yapılabilir (opsiyonel)
        setUser(session);
      }
    } catch (e) {
      console.warn('Oturum yüklenemedi:', e.message);
      // Bozuk oturum verisini temizle
      await SecureStore.deleteItemAsync(AUTH_CONFIG.SESSION_KEY).catch(() => {});
    } finally {
      setIsRestoring(false);
    }
  };

  /**
   * Oturumu SecureStore'a kaydet
   */
  const saveSession = async (userData) => {
    try {
      await SecureStore.setItemAsync(
        AUTH_CONFIG.SESSION_KEY,
        JSON.stringify(userData)
      );
    } catch (e) {
      console.warn('Oturum kaydedilemedi:', e.message);
    }
  };

  /**
   * Oturumu SecureStore'dan sil
   */
  const clearSession = async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_CONFIG.SESSION_KEY);
    } catch (e) {
      console.warn('Oturum silinemedi:', e.message);
    }
  };

  /**
   * Rate limiting kontrolü
   * @returns {string|null} Hata mesajı varsa döner, yoksa null
   */
  const checkRateLimit = () => {
    // Lockout süresi doldu mu?
    if (lockoutUntil) {
      const now = Date.now();
      if (now < lockoutUntil) {
        const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return `Çok fazla deneme yapıldı. ${minutes}:${String(seconds).padStart(2, '0')} sonra tekrar deneyin.`;
      }
      // Lockout süresi doldu, sıfırla
      setLockoutUntil(null);
      setLoginAttempts(0);
    }

    // Max deneme kontrolü
    if (loginAttempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
      const until = Date.now() + AUTH_CONFIG.LOCKOUT_DURATION_MS;
      setLockoutUntil(until);
      return `Çok fazla deneme yapıldı. 5 dakika sonra tekrar deneyin.`;
    }

    return null;
  };

  /**
   * Giriş yap
   * Şu anda backend yokken simülasyon yapıyor ama güvenlik önlemleri uygulanıyor.
   * TODO: Firebase Auth / Supabase Auth entegrasyonu yapılacak
   */
  const login = async (email, password) => {
    // Rate limiting kontrolü
    const rateLimitError = checkRateLimit();
    if (rateLimitError) {
      throw new Error(rateLimitError);
    }

    // Email format doğrulaması
    if (!isValidEmail(email)) {
      setLoginAttempts(prev => prev + 1);
      throw new Error('Geçerli bir e-posta adresi girin.');
    }

    // Şifre uzunluk kontrolü
    if (!password || password.length < AUTH_CONFIG.MIN_PASSWORD_LENGTH) {
      setLoginAttempts(prev => prev + 1);
      throw new Error('Şifre en az 6 karakter olmalıdır.');
    }

    setIsLoading(true);

    try {
      // Simüle edilmiş giriş
      // TODO: Burayı gerçek backend API çağrısı ile değiştirin
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Benzersiz kullanıcı ID'si üret
      const userId = Crypto.randomUUID();

      const userData = {
        id: userId,
        name: email.split('@')[0],
        email,
        avatar: '👤',
        location: 'İstanbul',
        createdAt: new Date().toISOString(),
      };

      // Oturumu güvenli depolamaya kaydet
      await saveSession(userData);

      setUser(userData);
      setLoginAttempts(0); // Başarılı girişte sıfırla
      setLockoutUntil(null);
      return userData;
    } catch (e) {
      // Genel hata mesajı göster, iç detayları gizle
      if (e.message.includes('fazla deneme') || e.message.includes('e-posta') || e.message.includes('Şifre')) {
        throw e; // Bilinen hatalar olduğu gibi geçsin
      }
      throw new Error('Giriş yapılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Kayıt ol
   */
  const register = async (name, email, password) => {
    // Email format doğrulaması
    if (!isValidEmail(email)) {
      throw new Error('Geçerli bir e-posta adresi girin.');
    }

    // İsim doğrulaması
    if (!name || name.trim().length < 2) {
      throw new Error('İsim en az 2 karakter olmalıdır.');
    }

    // Şifre uzunluk kontrolü
    if (!password || password.length < AUTH_CONFIG.MIN_PASSWORD_LENGTH) {
      throw new Error('Şifre en az 6 karakter olmalıdır.');
    }

    setIsLoading(true);

    try {
      // Simüle edilmiş kayıt
      // TODO: Burayı gerçek backend API çağrısı ile değiştirin
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Benzersiz kullanıcı ID'si üret
      const userId = Crypto.randomUUID();

      const userData = {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar: '👤',
        location: 'İstanbul',
        createdAt: new Date().toISOString(),
      };

      // Oturumu güvenli depolamaya kaydet
      await saveSession(userData);

      setUser(userData);
      return userData;
    } catch (e) {
      if (e.message.includes('e-posta') || e.message.includes('İsim') || e.message.includes('Şifre')) {
        throw e;
      }
      throw new Error('Kayıt yapılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Çıkış yap — güvenli depolamadaki oturumu da temizler
   */
  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
    setLoginAttempts(0);
    setLockoutUntil(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isRestoring,
      login,
      register,
      logout,
      loginAttempts,
      isLockedOut: lockoutUntil !== null && Date.now() < lockoutUntil,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
