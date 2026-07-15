import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Card, SectionTitle, PrimaryButton } from '../components';
import { useAnimals } from '../context/AnimalContext';
import { sanitizeInput } from '../config';

const ANIMAL_TYPES = [
  { key: 'Kedi', emoji: '🐱' },
  { key: 'Köpek', emoji: '🐶' },
  { key: 'Kuş', emoji: '🐦' },
  { key: 'Tavşan', emoji: '🐰' },
  { key: 'Diğer', emoji: '🐾' },
];

const GENDERS = ['Dişi', 'Erkek'];

const COLORS_LIST = [
  { bg: '#EAF3DE', label: 'Yeşil' },
  { bg: '#FAEEDA', label: 'Sarı' },
  { bg: '#E6F1FB', label: 'Mavi' },
  { bg: '#FCEBEB', label: 'Kırmızı' },
  { bg: '#F3E8FF', label: 'Mor' },
];

export default function AddAnimalScreen({ navigation }) {
  const { addAnimal } = useAnimals();
  const [name, setName] = useState('');
  const [type, setType] = useState('Kedi');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('Dişi');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS_LIST[0].bg);
  const [purpose, setPurpose] = useState('adoption'); // adoption | myPet

  const selectedType = ANIMAL_TYPES.find(t => t.key === type);

  const handleSubmit = () => {
    const cleanName = sanitizeInput(name);
    const cleanBreed = sanitizeInput(breed);
    const cleanAge = sanitizeInput(age);
    const cleanWeight = sanitizeInput(weight);
    const cleanLocation = sanitizeInput(location);
    const cleanDescription = sanitizeInput(description);

    if (!cleanName || cleanName.length < 2) {
      Alert.alert('Eksik Bilgi', 'Hayvan adı en az 2 karakter olmalıdır.');
      return;
    }
    if (!cleanBreed || cleanBreed.length < 2) {
      Alert.alert('Eksik Bilgi', 'Lütfen hayvanın ırkını girin.');
      return;
    }
    if (!cleanAge) {
      Alert.alert('Eksik Bilgi', 'Lütfen hayvanın yaşını girin.');
      return;
    }

    const newAnimal = {
      name: cleanName,
      type,
      breed: cleanBreed,
      gender,
      age: cleanAge,
      weight: cleanWeight || 'Bilinmiyor',
      location: cleanLocation || 'İstanbul',
      status: purpose === 'adoption' ? 'adoption' : 'myPet',
      owner: purpose === 'myPet' ? 'me' : undefined,
      vaccinated,
      neutered,
      emoji: selectedType?.emoji || '🐾',
      color: selectedColor,
      description: cleanDescription || 'Çok tatlı bir hayvan.',
      vaccines: [],
      contact: 'Ben • Profil üzerinden iletişim',
    };

    addAnimal(newAnimal);

    const purposeText = purpose === 'adoption' ? 'sahiplendirme ilanınız' : 'hayvanınız';

    Alert.alert(
      'Başarılı! 🐾',
      `${name} isimli ${purposeText} başarıyla eklendi.`,
      [{ text: 'Harika!', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Hayvan Ekle</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Amaç Seçimi */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Ne için ekliyorsun?</SectionTitle>
        <View style={styles.purposeRow}>
          <TouchableOpacity
            style={[styles.purposeCard, purpose === 'myPet' && styles.purposeCardActive]}
            onPress={() => setPurpose('myPet')}
          >
            <Text style={styles.purposeEmoji}>🏠</Text>
            <Text style={[styles.purposeLabel, purpose === 'myPet' && styles.purposeLabelActive]}>
              Kendi hayvanım
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.purposeCard, purpose === 'adoption' && styles.purposeCardActive]}
            onPress={() => setPurpose('adoption')}
          >
            <Text style={styles.purposeEmoji}>💕</Text>
            <Text style={[styles.purposeLabel, purpose === 'adoption' && styles.purposeLabelActive]}>
              Sahiplendirme
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hayvan Türü */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Hayvan Türü</SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeRow}
        >
          {ANIMAL_TYPES.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeChip, type === t.key && styles.typeChipActive]}
              onPress={() => setType(t.key)}
            >
              <Text style={styles.typeEmoji}>{t.emoji}</Text>
              <Text style={[styles.typeText, type === t.key && styles.typeTextActive]}>{t.key}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* İsim */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>İsim</SectionTitle>
        <Card style={styles.inputCard}>
          <View style={styles.inputRow}>
            <Text style={{ fontSize: 18 }}>{selectedType?.emoji || '🐾'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Hayvanın adı"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              maxLength={50}
            />
          </View>
        </Card>

        {/* Irk */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Irk</SectionTitle>
        <Card style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Örn: Van Kedisi, Golden Retriever..."
            placeholderTextColor={colors.textMuted}
            value={breed}
            onChangeText={setBreed}
            maxLength={50}
          />
        </Card>

        {/* Cinsiyet */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Cinsiyet</SectionTitle>
        <View style={styles.genderRow}>
          {GENDERS.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.genderChip, gender === g && styles.genderChipActive]}
              onPress={() => setGender(g)}
            >
              <Text style={{ fontSize: 16 }}>{g === 'Dişi' ? '♀️' : '♂️'}</Text>
              <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Yaş & Kilo */}
        <View style={styles.doubleRow}>
          <View style={{ flex: 1 }}>
            <SectionTitle>Yaş</SectionTitle>
            <Card style={{ marginBottom: spacing.sm }}>
              <TextInput
                style={styles.input}
                placeholder="Örn: 2 yaş"
                placeholderTextColor={colors.textMuted}
                value={age}
                onChangeText={setAge}
                maxLength={20}
              />
            </Card>
          </View>
          <View style={{ flex: 1 }}>
            <SectionTitle>Kilo</SectionTitle>
            <Card style={{ marginBottom: spacing.sm }}>
              <TextInput
                style={styles.input}
                placeholder="Örn: 4.2 kg"
                placeholderTextColor={colors.textMuted}
                value={weight}
                onChangeText={setWeight}
                maxLength={20}
              />
            </Card>
          </View>
        </View>

        {/* Konum */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Konum</SectionTitle>
        <Card style={styles.inputCard}>
          <View style={styles.inputRow}>
            <Text style={{ fontSize: 18 }}>📍</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Kadıköy, İstanbul"
              placeholderTextColor={colors.textMuted}
              value={location}
              onChangeText={setLocation}
              maxLength={100}
            />
          </View>
        </Card>

        {/* Renk Teması */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Profil Rengi</SectionTitle>
        <View style={styles.colorRow}>
          {COLORS_LIST.map(c => (
            <TouchableOpacity
              key={c.bg}
              style={[styles.colorDot, { backgroundColor: c.bg },
                selectedColor === c.bg && styles.colorDotActive]}
              onPress={() => setSelectedColor(c.bg)}
            >
              {selectedColor === c.bg && <Text style={{ fontSize: 14 }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sağlık Durumu */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Sağlık Durumu</SectionTitle>
        <Card style={styles.inputCard}>
          <TouchableOpacity style={styles.toggleRow} onPress={() => setVaccinated(!vaccinated)}>
            <Text style={styles.toggleLabel}>💉 Aşılı</Text>
            <View style={[styles.toggle, vaccinated && styles.toggleActive]}>
              <View style={[styles.toggleDot, vaccinated && styles.toggleDotActive]} />
            </View>
          </TouchableOpacity>
          <View style={styles.toggleDivider} />
          <TouchableOpacity style={styles.toggleRow} onPress={() => setNeutered(!neutered)}>
            <Text style={styles.toggleLabel}>✂️ Kısırlaştırıldı</Text>
            <View style={[styles.toggle, neutered && styles.toggleActive]}>
              <View style={[styles.toggleDot, neutered && styles.toggleDotActive]} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Açıklama */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Açıklama</SectionTitle>
        <Card style={styles.inputCard}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Hayvanın karakteri, alışkanlıkları hakkında bilgi verin..."
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </Card>

        {/* Fotoğraf */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Fotoğraf</SectionTitle>
        <Card style={styles.inputCard}>
          <TouchableOpacity
            style={styles.photoPicker}
            onPress={() => Alert.alert('Fotoğraf', 'Fotoğraf seçme özelliği yakında aktif olacak.\n(expo-image-picker entegrasyonu gerekli)')}
          >
            <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>📸</Text>
            <Text style={styles.photoPickerText}>Fotoğraf ekle</Text>
            <Text style={styles.photoPickerSub}>Galerinizden seçin veya çekin</Text>
          </TouchableOpacity>
        </Card>

        {/* Gönder */}
        <View style={styles.submitWrap}>
          <PrimaryButton
            label={purpose === 'adoption' ? 'İlanı Yayınla 🐾' : 'Hayvanı Ekle 🐾'}
            onPress={handleSubmit}
          />
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
  purposeRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  purposeCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  purposeCardActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  purposeEmoji: { fontSize: 28 },
  purposeLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  purposeLabelActive: { color: colors.primary },
  typeRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeEmoji: { fontSize: 16 },
  typeText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  typeTextActive: {
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
  genderRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  genderChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  genderChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  genderText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  genderTextActive: {
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  doubleRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  colorRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotActive: {
    borderColor: colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  toggleLabel: {
    fontSize: typography.size.md,
    color: colors.text,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.gray200,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: colors.primary },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  toggleDotActive: { alignSelf: 'flex-end' },
  toggleDivider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
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
  submitWrap: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
});
