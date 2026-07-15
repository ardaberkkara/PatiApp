import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView,
  Platform, Animated, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../config';

export default function LoginScreen({ navigation }) {
  const { login, isLoading, loginAttempts, isLockedOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (isLockedOut) {
      Alert.alert('Hesap Kilitlendi 🔒', 'Çok fazla başarısız deneme yapıldı. Lütfen 5 dakika bekleyin.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin. (örn: ad@email.com)');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Giriş Başarısız', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Başlık */}
          <View style={styles.header}>
            <Animated.Text style={[styles.logoEmoji, { transform: [{ scale: logoScale }] }]}>
              🐾
            </Animated.Text>
            <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
              Pati
            </Animated.Text>
            <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
              Hayvanların sesi ol
            </Animated.Text>
          </View>

          {/* Form */}
          <Animated.View style={[styles.formContainer, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }]}>
            <Text style={styles.formTitle}>Giriş Yap</Text>
            <Text style={styles.formSubtitle}>Hesabınıza giriş yaparak devam edin</Text>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ornek@email.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={100}
                />
              </View>
            </View>

            {/* Şifre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.showBtn}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Şifremi unuttum */}
            <TouchableOpacity style={styles.forgotBtn} onPress={() => {
              if (!email.trim()) {
                Alert.alert('Hata', 'Lütfen önce e-posta adresinizi girin.');
                return;
              }
              Alert.alert('Şifre Sıfırlama 🔑', `${email} adresine şifre sıfırlama bağlantısı gönderildi.`);
            }}>
              <Text style={styles.forgotText}>Şifremi unuttum</Text>
            </TouchableOpacity>

            {/* Giriş Butonu */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.loginBtnText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            {/* Ayırıcı */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sosyal Giriş */}
            <TouchableOpacity style={styles.socialBtn} onPress={() => {
              Alert.alert(
                'Google ile Giriş',
                'Google OAuth entegrasyonu henüz aktif değil. Lütfen e-posta ve şifre ile giriş yapın.',
                [{ text: 'Tamam' }]
              );
            }}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialBtnText}>Google ile devam et</Text>
            </TouchableOpacity>

            {/* Kayıt ol */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: spacing.xxxl * 1.5,
    paddingBottom: spacing.xxxl,
  },
  logoEmoji: { fontSize: 64, marginBottom: spacing.sm },
  appName: {
    color: colors.white,
    fontSize: 36,
    fontWeight: typography.weight.bold,
    letterSpacing: 1,
  },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.size.md,
    marginTop: spacing.xs,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl * 1.5,
    borderTopRightRadius: radius.xl * 1.5,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  formTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  inputGroup: { marginBottom: spacing.lg },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: { fontSize: 16, marginRight: spacing.sm },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
    color: colors.text,
  },
  showBtn: { fontSize: 18, padding: spacing.xs },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: spacing.xl },
  forgotText: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: {
    color: colors.white,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  socialIcon: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#4285F4',
  },
  socialBtnText: {
    fontSize: typography.size.md,
    color: colors.text,
    fontWeight: typography.weight.medium,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  registerText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: typography.size.md,
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
});
