import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Linking, Alert,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Card, SectionTitle, StatusBadge, StarRating } from '../components';
import { vets } from '../data/mockData';

export default function VetsScreen() {
  const [search, setSearch] = useState('');

  const filtered = vets.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.clinic.toLowerCase().includes(search.toLowerCase())
  );

  const emergency = filtered.find(v => v.emergency);
  const regular = filtered.filter(v => !v.emergency);

  const callVet = (phone) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`).catch(() => {
      Alert.alert('Arama Yapılamadı', 'Cihazınız telefon aramasını desteklemiyor.');
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.title}>Veteriner Rehberi</Text>
        <Text style={styles.subtitle}>Yakınımdaki klinikler</Text>
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Klinik veya doktor ara..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            maxLength={100}
          />
        </View>

        {/* Emergency */}
        {emergency && (
          <>
            <SectionTitle style={{ paddingHorizontal: spacing.lg }}>🚨 Acil</SectionTitle>
            <Card style={[styles.vetCard, styles.emergencyCard]} onPress={() => callVet(emergency.phone)}>
              <View style={styles.vetRow}>
                <View style={[styles.avatar, { backgroundColor: emergency.color }]}>
                  <Text style={{ fontSize: 20 }}>{emergency.initials}</Text>
                </View>
                <View style={styles.vetInfo}>
                  <Text style={styles.vetName}>{emergency.clinic}</Text>
                  <Text style={styles.vetMeta}>{emergency.distance} uzakta • {emergency.hours}</Text>
                  <StarRating rating={emergency.rating} />
                </View>
                <StatusBadge status={emergency.status} />
              </View>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => callVet(emergency.phone)}
              >
                <Text style={styles.callBtnText}>📞 Hemen Ara</Text>
              </TouchableOpacity>
            </Card>
          </>
        )}

        {/* Regular Vets */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Klinikler</SectionTitle>

        {regular.map(vet => (
          <Card key={vet.id} style={styles.vetCard} onPress={() => {
            Alert.alert(
              vet.name,
              `🏥 ${vet.clinic}\n📍 ${vet.distance} uzakta\n⏰ ${vet.hours}\n⭐ ${vet.rating} (${vet.reviewCount} değerlendirme)\n\nUzmanlık: ${vet.specialties.join(', ')}`,
              [
                { text: 'Kapat' },
                { text: '📞 Ara', onPress: () => callVet(vet.phone) },
              ]
            );
          }}>
            <View style={styles.vetRow}>
              <View style={[styles.avatar, { backgroundColor: vet.color }]}>
                <Text style={[styles.avatarText, { color: vet.textColor }]}>{vet.initials}</Text>
              </View>
              <View style={styles.vetInfo}>
                <Text style={styles.vetName}>{vet.name}</Text>
                <Text style={styles.clinicName}>{vet.clinic}</Text>
                <Text style={styles.vetMeta}>{vet.distance} • {vet.hours}</Text>
                <StarRating rating={vet.rating} />
              </View>
              <StatusBadge status={vet.status} />
            </View>

            {/* Specialties */}
            <View style={styles.specialtyRow}>
              {vet.specialties.map(s => (
                <View key={s} style={styles.specialtyChip}>
                  <Text style={styles.specialtyText}>{s}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.vetActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => callVet(vet.phone)}>
                <Text style={styles.actionBtnText}>📞 Ara</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => {
                Alert.alert(
                  'Randevu Al 📅',
                  `${vet.name} - ${vet.clinic} için randevu talebi gönderilsin mi?`,
                  [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'Randevu Al', onPress: () => {
                      Alert.alert('Başarılı ✅', `${vet.clinic} için randevu talebiniz iletildi. Klinik sizinle iletişime geçecektir.`);
                    }},
                  ]
                );
              }}>
                <Text style={styles.actionBtnPrimaryText}>📅 Randevu al</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>🏥</Text>
            <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
          </View>
        )}

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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  searchIcon: { fontSize: 14, marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text,
  },
  vetCard: { marginHorizontal: spacing.lg },
  emergencyCard: {
    borderColor: '#F09595',
    borderWidth: 1,
  },
  vetRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  vetInfo: { flex: 1 },
  vetName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  clinicName: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 1,
  },
  vetMeta: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 2,
  },
  specialtyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  specialtyChip: {
    backgroundColor: colors.gray100,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  specialtyText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
  vetActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignItems: 'center',
    backgroundColor: colors.gray100,
  },
  actionBtnText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  actionBtnPrimary: { backgroundColor: colors.primaryLight },
  actionBtnPrimaryText: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  callBtn: {
    backgroundColor: colors.danger,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  callBtnText: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  empty: { alignItems: 'center', padding: spacing.xxxl },
  emptyText: {
    fontSize: typography.size.lg,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
