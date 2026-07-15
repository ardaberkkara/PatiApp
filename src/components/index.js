import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

// ─── Badge ──────────────────────────────────────────────────
export function Badge({ label, variant = 'success' }) {
  const variants = {
    success: { bg: colors.successLight, text: colors.primary },
    warning: { bg: colors.warningLight, text: '#854F0B' },
    danger:  { bg: colors.dangerLight,  text: '#A32D2D' },
    info:    { bg: '#E6F1FB',           text: '#185FA5' },
    neutral: { bg: colors.gray100,      text: colors.gray600 },
  };
  const v = variants[variant] || variants.success;
  return (
    <View style={[styles.badge, { backgroundColor: v.bg }]}>
      <Text style={[styles.badgeText, { color: v.text }]}>{label}</Text>
    </View>
  );
}

// ─── Card ────────────────────────────────────────────────────
export function Card({ children, style, onPress }) {
  if (onPress) {
    return (
      <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.75}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── SectionTitle ────────────────────────────────────────────
export function SectionTitle({ children, style }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

// ─── Avatar ──────────────────────────────────────────────────
export function Avatar({ emoji, initials, size = 48, bg = colors.primaryLight, textColor = colors.primary, borderRadius = radius.md }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, backgroundColor: bg, borderRadius }]}>
      <Text style={{ fontSize: size * 0.45, color: textColor, fontWeight: typography.weight.medium }}>
        {emoji || initials}
      </Text>
    </View>
  );
}

// ─── StarRating ──────────────────────────────────────────────
export function StarRating({ rating }) {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < full ? '★' : '☆');
  return (
    <Text style={styles.stars}>{stars.join('')} <Text style={styles.ratingNum}>{rating}</Text></Text>
  );
}

// ─── StatusDot ───────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    open:   { label: 'Açık',      variant: 'success' },
    closed: { label: 'Kapalı',   variant: 'danger'  },
    busy:   { label: 'Yoğun',    variant: 'warning' },
    full:   { label: 'Dolu',     variant: 'success' },
    empty:  { label: 'Boş',      variant: 'danger'  },
    check:  { label: 'Kontrol',  variant: 'warning' },
    resolved:{ label: 'Çözüldü', variant: 'neutral' },
  };
  const m = map[status] || map.open;
  return <Badge label={m.label} variant={m.variant} />;
}

// ─── EmptyState ──────────────────────────────────────────────
export function EmptyState({ emoji = '🐾', title, subtitle }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

// ─── PrimaryButton ───────────────────────────────────────────
export function PrimaryButton({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.primaryBtn, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: {
    color: colors.accent,
    fontSize: typography.size.sm,
  },
  ratingNum: {
    color: colors.textSecondary,
    fontSize: typography.size.xs,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
