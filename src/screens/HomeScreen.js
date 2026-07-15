import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Card, Badge, Avatar, SectionTitle, StatusBadge } from '../components';
import { reports } from '../data/mockData';
import { useAnimals } from '../context/AnimalContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNotifications } from '../context/NotificationContext';

export default function HomeScreen({ navigation }) {
  const { animals } = useAnimals();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { unreadCount } = useNotifications();
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const filteredAnimals = animals.filter(a =>
    a.status === 'adoption' &&
    (query === '' ||
     a.name?.toLowerCase().includes(query) ||
     a.breed?.toLowerCase().includes(query) ||
     a.location?.toLowerCase().includes(query))
  );

  const totalAnimals = animals.length;
  const adoptionCount = animals.filter(a => a.status === 'adoption').length;
  const reportCount = reports.length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>Pati 🐾</Text>
          <Text style={styles.location}>📍 İstanbul • Kadıköy</Text>
        </View>
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={{ fontSize: 18 }}>🔔</Text>
            {unreadCount > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('Report')}
          >
            <Text style={styles.addBtnText}>+ Bildir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Hayvan, ırk veya konum ara..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            maxLength={100}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ fontSize: 14, color: colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* İstatistikler */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.statNum}>{adoptionCount}</Text>
            <Text style={styles.statLabel}>Sahiplenme{'\n'}Bekliyor</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.warningLight }]}>
            <Text style={styles.statNum}>{reportCount}</Text>
            <Text style={styles.statLabel}>Aktif{'\n'}Bildirim</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E6F1FB' }]}>
            <Text style={styles.statNum}>{totalAnimals}</Text>
            <Text style={styles.statLabel}>Toplam{'\n'}Kayıt</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          {[
            { emoji: '🗺️', label: 'Mama\nHaritası', screen: 'Map' },
            { emoji: '🏥', label: 'Veteriner\nRehberi', screen: 'Vets' },
            { emoji: '🐾', label: 'Sahipsiz\nHayvan', screen: 'Report' },
            { emoji: '🐶', label: 'Hayvan\nEkle', screen: 'AddAnimal' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.quickIconWrap}>
                <Text style={styles.quickEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Adoption Animals */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>
          Evlat edinmeyi bekleyenler ({filteredAnimals.length})
        </SectionTitle>

        {filteredAnimals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40 }}>🐾</Text>
            <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
            <Text style={styles.emptySubtitle}>Farklı bir arama deneyin</Text>
          </View>
        ) : (
          filteredAnimals.map((animal) => (
            <Card
              key={animal.id}
              style={styles.animalCard}
              onPress={() => navigation.navigate('AnimalDetail', { animalId: animal.id })}
            >
              <View style={styles.animalRow}>
                <Avatar emoji={animal.emoji} bg={animal.color} size={54} />
                <View style={styles.animalInfo}>
                  <Text style={styles.animalName}>{animal.name}</Text>
                  <Text style={styles.animalMeta}>
                    {animal.gender} • {animal.age} • {animal.breed}
                  </Text>
                  <Text style={styles.animalLocation}>📍 {animal.location}</Text>
                </View>
                <View style={styles.animalRight}>
                  <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => toggleFavorite(animal.id)}
                  >
                    <Text style={{ fontSize: 20 }}>
                      {isFavorite(animal.id) ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.animalBadges}>
                    {animal.vaccinated && <Badge label="Aşılı" variant="success" />}
                    {animal.neutered && (
                      <View style={{ marginTop: 4 }}>
                        <Badge label="Kısır" variant="info" />
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Card>
          ))
        )}

        {/* Recent Reports */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          Son bildirimler
        </SectionTitle>

        {reports.map((report) => (
          <Card key={report.id} style={styles.reportCard} onPress={() => {
            Alert.alert(
              report.title,
              `📍 ${report.location}\n⏰ ${report.time}\n\n${report.description}`,
              [{ text: 'Tamam' }]
            );
          }}>
            <View style={styles.reportRow}>
              <View style={[styles.reportThumb, { backgroundColor: report.urgent ? colors.dangerLight : colors.primaryLight }]}>
                <Text style={{ fontSize: 20 }}>{report.emoji}</Text>
              </View>
              <View style={styles.reportInfo}>
                <View style={styles.reportTitleRow}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  {report.urgent && <Badge label="Acil" variant="danger" />}
                </View>
                <Text style={styles.reportMeta}>
                  📍 {report.location} • {report.time}
                </Text>
                <Text style={styles.reportDesc} numberOfLines={1}>
                  {report.description}
                </Text>
              </View>
            </View>
          </Card>
        ))}

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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    color: colors.white,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  location: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  headerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF9F27',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  addBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  addBtnText: {
    color: colors.white,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statNum: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 14,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  quickItem: { alignItems: 'center', flex: 1 },
  quickIconWrap: {
    width: 52,
    height: 52,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickEmoji: { fontSize: 22 },
  quickLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  animalCard: {
    marginHorizontal: spacing.lg,
  },
  animalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  animalInfo: { flex: 1 },
  animalName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  animalMeta: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  animalLocation: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  animalRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  heartBtn: {
    padding: 2,
  },
  animalBadges: { alignItems: 'flex-end' },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  reportCard: { marginHorizontal: spacing.lg },
  reportRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  reportThumb: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  reportInfo: { flex: 1 },
  reportTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  reportTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  reportMeta: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  reportDesc: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
