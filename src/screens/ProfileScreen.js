import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Card, Badge, SectionTitle, PrimaryButton, EmptyState } from '../components';
import { useAuth } from '../context/AuthContext';
import { useAnimals } from '../context/AnimalContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNotifications } from '../context/NotificationContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { animals } = useAnimals();
  const { favorites } = useFavorites();
  const { unreadCount } = useNotifications();

  // Kendi hayvanlarım (myPet olarak eklenenler + ilk 2 mock hayvan)
  const myAnimals = [
    ...animals.filter(a => a.status === 'myPet' || a.owner === 'me'),
    ...animals.filter(a => a.status === 'adoption').slice(0, 2),
  ].filter((a, i, arr) => arr.findIndex(x => x.id === a.id) === i);

  const [selectedId, setSelectedId] = useState(myAnimals[0]?.id ?? null);

  // ID üzerinden türet: hayvan güncellenirse/silinirse bayat referans kalmaz
  const selected = myAnimals.find(a => a.id === selectedId) ?? myAnimals[0] ?? null;

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.userAvatar}>
          <Text style={{ fontSize: 28 }}>👤</Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
        <Text style={styles.userMeta}>{user?.location || 'İstanbul'}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{myAnimals.length}</Text>
            <Text style={styles.statLabel}>Hayvanım</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Bildirim</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Katkı</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* My Animals Selector */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Hayvanlarım</SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.animalSelector}
        >
          {myAnimals.map(a => (
            <TouchableOpacity
              key={a.id}
              style={[styles.animalChip, selected?.id === a.id && styles.animalChipActive]}
              onPress={() => setSelectedId(a.id)}
            >
              <Text style={{ fontSize: 20 }}>{a.emoji}</Text>
              <Text style={[styles.animalChipName, selected?.id === a.id && styles.animalChipNameActive]}>
                {a.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addAnimalChip} onPress={() => navigation.navigate('AddAnimal')}>
            <Text style={styles.addAnimalText}>+ Hayvan ekle</Text>
          </TouchableOpacity>
        </ScrollView>

        {!selected && (
          <EmptyState
            emoji="🐾"
            title="Henüz hayvanın yok"
            subtitle="Yukarıdaki '+ Hayvan ekle' butonuyla ilk dostunu ekleyebilirsin."
          />
        )}

        {/* Selected Animal Card */}
        {selected && (
        <>
        <Card style={styles.animalCard}>
          <View style={styles.animalHeader}>
            <View style={[styles.animalAvatar, { backgroundColor: selected.color }]}>
              <Text style={{ fontSize: 32 }}>{selected.emoji}</Text>
            </View>
            <View style={styles.animalHeaderInfo}>
              <Text style={styles.animalName}>{selected.name}</Text>
              <Text style={styles.animalBreed}>{selected.breed}</Text>
              <Text style={styles.animalMeta}>{selected.gender} • {selected.age} • {selected.weight}</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatIcon}>{selected.vaccinated ? '✅' : '❌'}</Text>
              <Text style={styles.quickStatLabel}>Aşılı</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatIcon}>{selected.neutered ? '✅' : '❌'}</Text>
              <Text style={styles.quickStatLabel}>Kısırlaştırıldı</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatIcon}>📍</Text>
              <Text style={styles.quickStatLabel}>Konum</Text>
            </View>
          </View>

          <Text style={styles.description}>{selected.description}</Text>
        </Card>

        {/* Vaccine Schedule */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Aşı Takvimi</SectionTitle>
        <Card style={styles.vaccineCard}>
          {(selected.vaccines?.length ?? 0) > 0 ? (
            selected.vaccines.map((v, i) => (
              <View
                key={v.name}
                style={[styles.vaccineRow, i < selected.vaccines.length - 1 && styles.vaccineRowBorder]}
              >
                <View style={styles.vaccineLeft}>
                  <Text style={styles.vaccineIcon}>
                    {v.status === 'done' ? '✅' : '⏰'}
                  </Text>
                  <View>
                    <Text style={styles.vaccineName}>{v.name}</Text>
                    <Text style={styles.vaccineDate}>{v.date}</Text>
                  </View>
                </View>
                <Badge
                  label={v.status === 'done' ? 'Tamam' : 'Yaklaşıyor'}
                  variant={v.status === 'done' ? 'success' : 'warning'}
                />
              </View>
            ))
          ) : (
            <Text style={styles.noVaccineText}>Henüz aşı kaydı yok. Veterinerinizden aldığınız aşıları buradan takip edebilirsiniz.</Text>
          )}
        </Card>

        {/* Location */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Konum Bilgisi</SectionTitle>
        <Card style={styles.locationCard}>
          <View style={styles.locationRow}>
            <Text style={{ fontSize: 24 }}>📍</Text>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{selected.location}</Text>
              <Text style={styles.locationMeta}>Son güncelleme: Az önce</Text>
            </View>
            <TouchableOpacity style={styles.updateBtn} onPress={() => {
              Alert.alert('Konum Güncellendi 📍', `${selected.name} için konum bilgisi güncellendi.`);
            }}>
              <Text style={styles.updateBtnText}>Güncelle</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Contact */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>İletişim</SectionTitle>
        <Card style={{ marginHorizontal: spacing.lg }}>
          <Text style={styles.contactText}>👤 {selected.contact}</Text>
          <Text style={styles.contactText}>📅 İlan tarihi: {selected.postedAt}</Text>
        </Card>
        </>
        )}

        {/* Ayarlar & Menü */}
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Ayarlar</SectionTitle>
        <Card style={{ marginHorizontal: spacing.lg }}>
          {[
            { emoji: '🔔', label: 'Bildirimler', onPress: () => navigation.navigate('Notifications') },
            { emoji: '❤️', label: `Favorilerim (${favorites.length})`, onPress: () => {
              const favAnimals = animals.filter(a => favorites.includes(a.id));
              if (favAnimals.length === 0) {
                Alert.alert('Favoriler', 'Henüz favori hayvanınız yok. Ana sayfadan kalp ikonuna basarak ekleyebilirsiniz.');
              } else {
                Alert.alert(
                  `Favorilerim (❤️ ${favAnimals.length})`,
                  favAnimals.map(a => `${a.emoji} ${a.name} - ${a.breed}`).join('\n')
                );
              }
            }},
            { emoji: '❓', label: 'Yardım & Destek', onPress: () => Alert.alert('Yardım', 'Sorularınız için destek@patiapp.com adresine yazabilirsiniz.') },
            { emoji: 'ℹ️', label: 'Hakkında', onPress: () => Alert.alert('Pati App 🐾', 'Versiyon 1.0.0\n\nHayvan dostlarımızı korumak ve sahiplendirmek için geliştirildi.\n\n© 2026 Pati App') },
          ].map((item, idx) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuRow} onPress={item.onPress}>
                <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
              {idx < 3 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </Card>

        {/* Çıkış Yap */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>🚪 Çıkış Yap</Text>
        </TouchableOpacity>

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
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  userName: {
    color: colors.white,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  userMeta: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: typography.size.sm,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  statItem: { alignItems: 'center' },
  statNum: {
    color: colors.white,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 0.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
  },
  animalSelector: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  animalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  animalChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  animalChipName: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  animalChipNameActive: { color: colors.white },
  addAnimalChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAnimalText: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  animalCard: { marginHorizontal: spacing.lg },
  animalHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  animalAvatar: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  animalHeaderInfo: { flex: 1, justifyContent: 'center' },
  animalName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  animalBreed: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  animalMeta: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    justifyContent: 'space-around',
  },
  quickStat: { alignItems: 'center', gap: spacing.xs },
  quickStatIcon: { fontSize: 20 },
  quickStatLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
  description: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  vaccineCard: { marginHorizontal: spacing.lg },
  noVaccineText: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  vaccineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  vaccineRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  vaccineLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  vaccineIcon: { fontSize: 18 },
  vaccineName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  vaccineDate: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  locationCard: { marginHorizontal: spacing.lg },
  locationRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  locationInfo: { flex: 1 },
  locationName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  locationMeta: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  updateBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  updateBtnText: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  contactText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  logoutBtn: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.dangerLight,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F09595',
  },
  logoutBtnText: {
    fontSize: typography.size.md,
    color: colors.danger,
    fontWeight: typography.weight.semibold,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text,
  },
  menuArrow: {
    fontSize: 22,
    color: colors.textMuted,
  },
  menuDivider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginLeft: 34,
  },
});
