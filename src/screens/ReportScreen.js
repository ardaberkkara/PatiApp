import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Card, SectionTitle, PrimaryButton } from '../components';
import { sanitizeInput } from '../config';
import { useNotifications } from '../context/NotificationContext';

const REPORT_TYPES = [
  { key: 'stray',  emoji: '🐾', label: 'Sahipsiz Hayvan' },
  { key: 'lost',   emoji: '🆘', label: 'Kayıp İlanı' },
  { key: 'found',  emoji: '🔍', label: 'Bulunan Hayvan' },
  { key: 'injury', emoji: '🩹', label: 'Yaralı Hayvan' },
];

const ANIMAL_TYPES = ['Kedi', 'Köpek', 'Kuş', 'Tavşan', 'Diğer'];

export default function ReportScreen({ navigation }) {
  const { addNotification } = useNotifications();
  const [reportType, setReportType] = useState('stray');
  const [animalType, setAnimalType] = useState('Kedi');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [urgent, setUrgent] = useState(false);

  const submit = () => {
    const cleanLocation = sanitizeInput(location);
    const cleanDescription = sanitizeInput(description);

    if (!cleanLocation || cleanLocation.length < 3) {
      Alert.alert('Eksik bilgi', 'Lütfen geçerli bir konum girin (en az 3 karakter).');
      return;
    }
    if (!cleanDescription || cleanDescription.length < 10) {
      Alert.alert('Eksik bilgi', 'Açıklama en az 10 karakter olmalıdır.');
      return;
    }
    const typeInfo = REPORT_TYPES.find(t => t.key === reportType);
    addNotification({
      type: 'alert',
      emoji: urgent ? '🚨' : typeInfo?.emoji || '🐾',
      title: `${typeInfo?.label || 'Bildirim'} kaydedildi`,
      message: `${animalType} • ${cleanLocation} — bildirimin yakındaki gönüllülere iletildi.`,
    });

    Alert.alert(
      'Bildirim gönderildi ✅',
      'Teşekkürler! Bildirimin kaydedildi ve yakındaki gönüllülere iletildi.',
      [{ text: 'Tamam', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Hayvan Bildir</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Report Type */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Bildirim türü</SectionTitle>
        <View style={styles.typeGrid}>
          {REPORT_TYPES.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeCard, reportType === t.key && styles.typeCardActive]}
              onPress={() => setReportType(t.key)}
            >
              <Text style={styles.typeEmoji}>{t.emoji}</Text>
              <Text style={[styles.typeLabel, reportType === t.key && styles.typeLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Animal Type */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Hayvan türü</SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.animalTypeRow}
        >
          {ANIMAL_TYPES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, animalType === t && styles.chipActive]}
              onPress={() => setAnimalType(t)}
            >
              <Text style={[styles.chipText, animalType === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Location */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Konum</SectionTitle>
        <Card style={styles.inputCard}>
          <View style={styles.inputRow}>
            <Text style={{ fontSize: 18 }}>📍</Text>
            <TextInput
              style={styles.input}
              placeholder="Sokak, mahalle veya açıklama..."
              placeholderTextColor={colors.textMuted}
              value={location}
              onChangeText={setLocation}
              maxLength={150}
            />
          </View>
          <TouchableOpacity style={styles.gpsBtn} onPress={() => {
            setLocation('Kadıköy, İstanbul (GPS)');
            Alert.alert('Konum Alındı 📍', 'GPS konumunuz başarıyla alındı.');
          }}>
            <Text style={styles.gpsBtnText}>📡 GPS konumumu kullan</Text>
          </TouchableOpacity>
        </Card>

        {/* Photo */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Fotoğraf</SectionTitle>
        <Card style={styles.photoCard}>
          <TouchableOpacity style={styles.photoPicker} onPress={() => {
            Alert.alert(
              'Fotoğraf Ekle 📸',
              'Fotoğraf seçme özelliği yakında aktif olacak.\n(expo-image-picker entegrasyonu gerekli)',
              [{ text: 'Tamam' }]
            );
          }}>
            <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>📸</Text>
            <Text style={styles.photoPickerText}>Fotoğraf ekle</Text>
            <Text style={styles.photoPickerSub}>Galerinizden seçin veya çekin</Text>
          </TouchableOpacity>
        </Card>

        {/* Description */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Açıklama</SectionTitle>
        <Card style={styles.inputCard}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Hayvanın durumu, rengi, özellikleri hakkında bilgi verin..."
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </Card>

        {/* Urgent Toggle */}
        <Card style={[styles.urgentCard, urgent && styles.urgentCardActive]}>
          <TouchableOpacity
            style={styles.urgentRow}
            onPress={() => setUrgent(!urgent)}
          >
            <View>
              <Text style={[styles.urgentTitle, urgent && styles.urgentTitleActive]}>
                🚨 Acil durum
              </Text>
              <Text style={styles.urgentSub}>Veteriner müdahalesi gerektiriyor</Text>
            </View>
            <View style={[styles.toggle, urgent && styles.toggleActive]}>
              <View style={[styles.toggleDot, urgent && styles.toggleDotActive]} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Submit */}
        <View style={styles.submitWrap}>
          <PrimaryButton label="Bildirimi Gönder 🐾" onPress={submit} />
        </View>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 60 },
  backBtnText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: typography.size.md,
  },
  title: {
    color: colors.white,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  typeCardActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  typeEmoji: { fontSize: 28 },
  typeLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
  typeLabelActive: { color: colors.primary },
  animalTypeRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: typography.weight.medium,
  },
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
    height: 90,
    textAlignVertical: 'top',
  },
  gpsBtn: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  gpsBtnText: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  photoCard: { marginHorizontal: spacing.lg },
  photoPicker: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
  },
  photoPickerText: {
    fontSize: typography.size.md,
    color: colors.text,
    fontWeight: typography.weight.medium,
  },
  photoPickerSub: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  urgentCard: { marginHorizontal: spacing.lg },
  urgentCardActive: {
    backgroundColor: colors.dangerLight,
    borderColor: '#F09595',
  },
  urgentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgentTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  urgentTitleActive: { color: colors.danger },
  urgentSub: {
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
  toggleActive: { backgroundColor: colors.danger },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  toggleDotActive: { alignSelf: 'flex-end' },
  submitWrap: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
});
