import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Card, Badge, StarRating } from '../components';
import { useFavorites } from '../context/FavoritesContext';
import { useAnimals } from '../context/AnimalContext';

export default function AnimalDetailScreen({ route, navigation }) {
  // Sadece ID alıp context'ten hayvan verisini çekiyoruz
  const { animalId } = route.params;
  const { animals } = useAnimals();
  const { toggleFavorite, isFavorite } = useFavorites();

  const animal = animals.find(a => a.id === animalId);

  // Hayvan bulunamazsa güvenli geri dönüş
  if (!animal) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Text style={{ fontSize: 48, marginBottom: spacing.md }}>🐾</Text>
        <Text style={{ fontSize: typography.size.lg, color: colors.text, fontWeight: typography.weight.medium }}>
          Hayvan bulunamadı
        </Text>
        <Text style={{ fontSize: typography.size.sm, color: colors.textSecondary, marginTop: spacing.xs }}>
          Bu ilan kaldırılmış olabilir.
        </Text>
        <TouchableOpacity
          style={{ marginTop: spacing.xl, paddingVertical: spacing.sm, paddingHorizontal: spacing.xl, backgroundColor: colors.primary, borderRadius: radius.full }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: colors.white, fontWeight: typography.weight.medium }}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const adopt = () => {
    Alert.alert(
      'Evlat edinme talebi 🐾',
      `${animal.name} için evlat edinme talebiniz iletildi. İlan sahibi sizinle iletişime geçecek.`,
      [{ text: 'Harika!' }]
    );
  };

  const share = () => {
    Alert.alert(
      'Paylaş 📤',
      `${animal.name} - ${animal.breed}\n${animal.gender} • ${animal.age}\n📍 ${animal.location}\n\n${animal.description}\n\nPati App üzerinden paylaşıldı 🐾`,
      [{ text: 'Tamam' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Hero Header */}
      <View style={[styles.hero, { backgroundColor: animal.color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.heroActions}>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => toggleFavorite(animal.id)}
          >
            <Text style={{ fontSize: 20 }}>{isFavorite(animal.id) ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroBtn} onPress={share}>
            <Text style={{ fontSize: 18 }}>📤</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.heroEmoji}>{animal.emoji}</Text>
        <Text style={styles.heroName}>{animal.name}</Text>
        <Text style={styles.heroBreed}>{animal.breed} • {animal.gender} • {animal.age}</Text>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Status Badges */}
        <View style={styles.badgeRow}>
          {animal.vaccinated && <Badge label="✓ Aşılı" variant="success" />}
          {animal.neutered && <Badge label="✓ Kısırlaştırıldı" variant="success" />}
          <Badge label={`⚖️ ${animal.weight}`} variant="neutral" />
        </View>

        {/* Info Card */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Hakkında</Text>
          <Text style={styles.description}>{animal.description}</Text>
        </Card>

        {/* Details */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Detaylar</Text>
          {[
            { label: 'Tür', value: animal.type },
            { label: 'Irk', value: animal.breed },
            { label: 'Cinsiyet', value: animal.gender },
            { label: 'Yaş', value: animal.age },
            { label: 'Kilo', value: animal.weight },
            { label: 'Konum', value: animal.location },
          ].map((row, i, arr) => (
            <View
              key={row.label}
              style={[styles.detailRow, i < arr.length - 1 && styles.detailRowBorder]}
            >
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </Card>

        {/* Vaccine Card */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Aşı Geçmişi</Text>
          {animal.vaccines && animal.vaccines.length > 0 ? (
            animal.vaccines.map((v) => (
              <View key={v.name} style={styles.vaccineRow}>
                <Text style={{ fontSize: 16 }}>{v.status === 'done' ? '✅' : '⏰'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vaccineName}>{v.name}</Text>
                  <Text style={styles.vaccineDate}>{v.date}</Text>
                </View>
                <Badge
                  label={v.status === 'done' ? 'Tamam' : 'Bekliyor'}
                  variant={v.status === 'done' ? 'success' : 'warning'}
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aşı kaydı bulunmuyor.</Text>
          )}
        </Card>

        {/* Contact */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>İlan Sahibi</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactAvatar}>
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
            <View>
              <Text style={styles.contactName}>
                {animal.contact ? animal.contact.split('•')[0].trim() : 'İlan sahibi'}
              </Text>
              <Text style={styles.contactMeta}>İlan tarihi: {animal.postedAt}</Text>
            </View>
          </View>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.messageBtn} onPress={() => {
          const contactName = animal.contact ? animal.contact.split('•')[0].trim() : 'İlan sahibi';
          Alert.alert(
            'Mesaj Gönder 💬',
            `${contactName} ile iletişime geçmek istiyor musunuz?`,
            [
              { text: 'İptal', style: 'cancel' },
              { text: 'Mesaj Gönder', onPress: () => {
                Alert.alert('Gönderildi ✅', 'Mesajınız ilan sahibine iletildi. En kısa sürede size dönüş yapacaktır.');
              }},
            ]
          );
        }}>
          <Text style={styles.messageBtnText}>💬 Mesaj Gönder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.adoptBtn} onPress={adopt}>
          <Text style={styles.adoptBtnText}>🐾 Evlat Edin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    position: 'relative',
  },
  heroActions: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: typography.size.xl,
    color: colors.text,
  },
  heroEmoji: { fontSize: 72, marginBottom: spacing.sm },
  heroName: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  heroBreed: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
    paddingTop: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  card: { marginHorizontal: spacing.lg },
  sectionLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: typography.size.md,
    color: colors.text,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  detailRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  vaccineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  vaccineName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  vaccineDate: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  contactMeta: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  messageBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  messageBtnText: {
    fontSize: typography.size.md,
    color: colors.text,
    fontWeight: typography.weight.medium,
  },
  adoptBtn: {
    flex: 2,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  adoptBtnText: {
    fontSize: typography.size.md,
    color: colors.white,
    fontWeight: typography.weight.bold,
  },
});
