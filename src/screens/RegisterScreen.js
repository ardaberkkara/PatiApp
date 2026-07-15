import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView,
  Platform, Animated, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, getPasswordStrength } from '../config';

export default function RegisterScreen({ navigation }) {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin.');
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
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }
    try {
      await register(name.trim(), email.trim(), password);
    } catch (error) {
      Alert.alert('Kayıt Başarısız', error.message);
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
          {/* Üst bölüm */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerEmoji}>🐾</Text>
            <Text style={styles.headerTitle}>Aramıza Katıl!</Text>
            <Text style={styles.headerSubtitle}>Hayvanların sesi olmak için kayıt ol</Text>
          </View>

          {/* Form */}
          <Animated.View style={[styles.formContainer, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }]}>

            {/* Ad Soyad */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad Soyad</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adınız Soyadınız"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  maxLength={60}
                />
              </View>
            </View>

            {/* E-posta */}
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
                  placeholder="En az 6 karakter"
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

            {/* Şifre Tekrar */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre Tekrar</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Şifrenizi tekrar girin"
                  placeholderTextColor={colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            {/* Şifre gücü göstergesi */}
            {password.length > 0 && (() => {
              const strength = getPasswordStrength(password);
              const widthPercent = strength.score <= 2 ? '33%' : strength.score <= 4 ? '66%' : '100%';
              return (
                <View style={styles.strengthRow}>
                  <View style={[
                    styles.strengthBar,
                    { backgroundColor: strength.color, width: widthPercent },
                  ]} />
                  <Text style={styles.strengthText}>{strength.label}</Text>
                </View>
              );
            })()}

            {/* Kayıt Ol Butonu */}
            <TouchableOpacity
              style={[styles.registerBtn, isLoading && styles.registerBtnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.registerBtnText}>Kayıt Ol 🐾</Text>
              )}
            </TouchableOpacity>

            {/* Giriş yap */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
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
  scrollContent: { flexGrow: 1 },
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontSize: 20, color: colors.white },
  headerEmoji: { fontSize: 48, marginBottom: spacing.sm },
  headerTitle: {
    color: colors.white,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.size.sm,
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
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  registerBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerBtnDisabled: { opacity: 0.7 },
  registerBtnText: {
    color: colors.white,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  loginText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: typography.size.md,
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
});
