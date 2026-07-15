import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert, Linking,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Card, SectionTitle, PrimaryButton } from '../components';
import { CONTACT, sanitizeInput } from '../config';

const COMPLAINT_CATEGORIES = [
  { key: 'abuse',     emoji: '🚨', label: 'Hayvan İstismarı',     color: colors.dangerLight },
  { key: 'neglect',   emoji: '💔', label: 'İhmal / Bakımsızlık',  color: '#FFF0E6' },
  { key: 'abandon',   emoji: '🏚️', label: 'Terk Etme',            color: '#FAEEDA' },
  { key: 'noise',     emoji: '🔊', label: 'Gürültü / Rahatsızlık', color: '#E6F1FB' },
  { key: 'hygiene',   emoji: '🧹', label: 'Hijyen Sorunu',         color: '#F3E8FF' },
  { key: 'danger',    emoji: '⚠️', label: 'Tehlikeli Hayvan',      color: '#FFF8E1' },
  { key: 'illegal',   emoji: '🚫', label: 'Yasadışı Satış/Üretim', color: '#FCEBEB' },
  { key: 'other',     emoji: '📋', label: 'Diğer',                 color: colors.gray100 },
];

const URGENCY_LEVELS = [
  { key: 'low',    label: 'Düşük',   color: colors.primaryLight, textColor: colors.primary },
  { key: 'medium', label: 'Orta',    color: colors.warningLight, textColor: '#854F0B' },
  { key: 'high',   label: 'Yüksek',  color: '#FCEBEB',          textColor: colors.danger },
  { key: 'urgent', label: 'Acil!',   color: colors.danger,      textColor: colors.white },
];

const HELP_PHONE = CONTACT.HELP_PHONE;

export default function ComplaintScreen({ navigation }) {
  const [category, setCategory] = useState(null);
  const [urgency, setUrgency] = useState('medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const handleCall = () => {
    Linking.openURL(`tel:${HELP_PHONE}`);
  };

  const handleSubmit = () => {
    if (!category) {
      Alert.alert('Eksik Bilgi', 'Lütfen şikay et kategorisini seçin.');
      return;
    }
    const cleanDesc = sanitizeInput(description);
    if (!cleanDesc || cleanDesc.length < 10) {
      Alert.alert('Eksik Bilgi', 'Şikayet açıklaması en az 10 karakter olmalıdır.');
      return;
    }

    const selectedCat = COMPLAINT_CATEGORIES.find(c => c.key === category);
    Alert.alert(
      'Şikayet Gönderildi ✅',
      `${selectedCat.emoji} ${selectedCat.label} kategorisinde şikayetiniz kaydedildi.\n\nYetkili birimler en kısa sürede inceleyecektir.`,
      [{ text: 'Tamam', onPress: () => {
        setCategory(null);
        setUrgency('medium');
        setLocation('');
        setDescription('');
        setAnonymous(false);
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🚨 Şikayet Et</Text>
        <Text style={styles.subtitle}>Hayvan haklarını koruyalım</Text>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Kategori Seçimi */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Şikayet Kategorisi</SectionTitle>
        <View style={styles.categoryGrid}>
          {COMPLAINT_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryCard,
                { backgroundColor: cat.color },
                category === cat.key && styles.categoryCardActive,
              ]}
              onPress={() => setCategory(cat.key)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={[
                styles.categoryLabel,
                category === cat.key && styles.categoryLabelActive,
              ]}>
                {cat.label}
              </Text>
              {category === cat.key && (
                <View style={styles.checkMark}>
                  <Text style={{ color: colors.white, fontSize: 10, fontWeight: '700' }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Aciliyet */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Aciliyet Durumu</SectionTitle>
        <View style={styles.urgencyRow}>
          {URGENCY_LEVELS.map(u => (
            <TouchableOpacity
              key={u.key}
              style={[
                styles.urgencyChip,
                { backgroundColor: urgency === u.key ? u.color : colors.card },
                urgency === u.key && { borderColor: u.textColor, borderWidth: 1.5 },
              ]}
              onPress={() => setUrgency(u.key)}
            >
              <Text style={[
                styles.urgencyText,
                { color: urgency === u.key ? u.textColor : colors.textSecondary },
                urgency === u.key && { fontWeight: typography.weight.semibold },
              ]}>
                {u.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Konum */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Konum</SectionTitle>
        <Card style={styles.inputCard}>
          <View style={styles.inputRow}>
            <Text style={{ fontSize: 18 }}>📍</Text>
            <TextInput
              style={styles.input}
              placeholder="Olayın yaşandığı yer..."
              placeholderTextColor={colors.textMuted}
              value={location}
              onChangeText={setLocation}
              maxLength={150}
            />
          </View>
        </Card>

        {/* Açıklama */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Şikayet Detayı</SectionTitle>
        <Card style={styles.inputCard}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ne olduğunu, ne gördüğünüzü detaylı anlatın..."
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            maxLength={1000}
          />
        </Card>

        {/* Anonim */}
        <Card style={[styles.anonCard, anonymous && styles.anonCardActive]}>
          <TouchableOpacity
            style={styles.anonRow}
            onPress={() => setAnonymous(!anonymous)}
          >
            <View>
              <Text style={styles.anonTitle}>🕵️ Anonim şikayet</Text>
              <Text style={styles.anonSub}>Kimlik bilgileriniz paylaşılmaz</Text>
            </View>
            <View style={[styles.toggle, anonymous && styles.toggleActive]}>
              <View style={[styles.toggleDot, anonymous && styles.toggleDotActive]} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Gönder */}
        <View style={styles.submitWrap}>
          <PrimaryButton label="Şikayeti Gönder 🚨" onPress={handleSubmit} style={{ backgroundColor: '#B71C1C' }} />
        </View>

        {/* Telefon ile yardım */}
        <View style={styles.helpSection}>
          <View style={styles.helpDividerRow}>
            <View style={styles.helpDivider} />
            <Text style={styles.helpDividerText}>veya</Text>
            <View style={styles.helpDivider} />
          </View>

          <Text style={styles.helpTitle}>
            İfade edemeyenler için
          </Text>
          <Text style={styles.helpSubtitle}>
            Yazılı şikayet oluşturamıyorsanız{'\n'}aşağıdaki numarayı arayabilirsiniz
          </Text>

          <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.8}>
            <Text style={styles.callIcon}>📞</Text>
            <View>
              <Text style={styles.callNumber}>{HELP_PHONE}</Text>
              <Text style={styles.callLabel}>Hemen Ara</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: spacing.xxxl * 1.5 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#B71C1C' },
  header: {
    backgroundColor: '#B71C1C',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
  },

  // Kategori Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryCard: {
    width: '47%',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
    gap: spacing.xs,
    position: 'relative',
  },
  categoryCardActive: {
    borderColor: '#B71C1C',
    borderWidth: 2,
  },
  categoryEmoji: { fontSize: 28 },
  categoryLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
  categoryLabelActive: { color: '#B71C1C', fontWeight: typography.weight.semibold },
  checkMark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#B71C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Aciliyet
  urgencyRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  urgencyChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  urgencyText: {
    fontSize: typography.size.sm,
  },

  // Form
  inputCard: { marginHorizontal: spacing.lg },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },

  // Anonim
  anonCard: {
    marginHorizontal: spacing.lg,
  },
  anonCardActive: {
    backgroundColor: '#E6F1FB',
    borderColor: '#185FA5',
  },
  anonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anonTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  anonSub: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.gray200,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: '#185FA5' },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  toggleDotActive: { alignSelf: 'flex-end' },

  // Gönder
  submitWrap: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },

  // Yardım bölümü
  helpSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  helpDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.lg,
  },
  helpDivider: { flex: 1, height: 1, backgroundColor: colors.border },
  helpDividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  helpTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  helpSubtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#EAF3DE',
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  callIcon: { fontSize: 24 },
  callNumber: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  callLabel: {
    fontSize: typography.size.xs,
    color: colors.primaryDark,
    marginTop: 1,
  },
});
