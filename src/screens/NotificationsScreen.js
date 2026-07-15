import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationsScreen({ navigation }) {
  const { notifications, markAsRead, markAllRead, unreadCount } = useNotifications();

  const getTypeColor = (type) => {
    const map = {
      adoption: colors.primaryLight,
      alert: colors.dangerLight,
      vaccine: '#E6F1FB',
      feeding: colors.warningLight,
      community: '#F3E8FF',
    };
    return map[type] || colors.gray100;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bildirimler</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markAllText}>
            {unreadCount > 0 ? 'Tümünü oku' : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {unreadCount > 0 && (
          <View style={styles.unreadBanner}>
            <Text style={styles.unreadText}>
              🔔 {unreadCount} okunmamış bildirim
            </Text>
          </View>
        )}

        {notifications.map(notif => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
            onPress={() => markAsRead(notif.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.notifIcon, { backgroundColor: getTypeColor(notif.type) }]}>
              <Text style={{ fontSize: 20 }}>{notif.emoji}</Text>
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifTitleRow}>
                <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]} numberOfLines={1}>
                  {notif.title}
                </Text>
                {!notif.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
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
  markAllText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.size.sm,
    width: 80,
    textAlign: 'right',
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.md,
  },
  unreadBanner: {
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  unreadText: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  notifCard: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 0.5,
    borderColor: colors.border,
    gap: spacing.md,
  },
  notifCardUnread: {
    backgroundColor: '#F0F7FF',
    borderColor: '#B8D4F0',
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notifTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.text,
    flex: 1,
  },
  notifTitleUnread: {
    fontWeight: typography.weight.semibold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notifMessage: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
