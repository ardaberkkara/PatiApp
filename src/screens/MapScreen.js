import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert, Linking,
  ActivityIndicator, Platform, Dimensions,
} from 'react-native';
import MapView, { Marker, UrlTile, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors, spacing, radius, typography } from '../theme';
import { Card, SectionTitle, StatusBadge } from '../components';
import { feedingPoints as initialPoints } from '../data/mockData';

const TYPE_EMOJI = { food: '🥣', water: '💧', both: '🥣💧' };
const TYPE_LABEL = { food: 'Mama', water: 'Su', both: 'Mama + Su' };
const STATUS_COLORS = { full: colors.primary, empty: colors.danger, check: colors.warning };

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Kadıköy, İstanbul default bölgesi
const DEFAULT_REGION = {
  latitude: 40.9860,
  longitude: 29.0230,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

export default function MapScreen({ navigation }) {
  const [filter, setFilter] = useState('all');
  const [points, setPoints] = useState(initialPoints);
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [addingMode, setAddingMode] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setUserLocation(coords);
          setRegion({
            ...coords,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          });
        } else {
          // Konum izni reddedildi — kullanıcıyı bilgilendir
          Alert.alert(
            'Konum İzni Gerekli 📍',
            'Yakınındaki mama/su noktalarını gösterebilmek için konum iznine ihtiyacımız var. Varsayılan konum kullanılacak.',
            [
              { text: 'Tamam' },
              {
                text: 'Ayarlara Git',
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
      } catch (e) {
        console.warn('Konum alınamadı:', e.message);
        Alert.alert(
          'Konum Hatası',
          'Konumunuz alınamadı. Cihazınızda konum servislerinin açık olduğundan emin olun.',
          [{ text: 'Tamam' }]
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleStatus = (id) => {
    setPoints(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'full' ? 'empty' : 'full';
        return { ...p, status: newStatus, lastChecked: 'Az önce' };
      }
      return p;
    }));
  };

  const openDirections = (point) => {
    // Koordinat doğrulama
    const lat = parseFloat(point.lat);
    const lng = parseFloat(point.lng);

    if (
      !isFinite(lat) || !isFinite(lng) ||
      lat < -90 || lat > 90 ||
      lng < -180 || lng > 180
    ) {
      Alert.alert('Hata', 'Geçersiz koordinat bilgisi. Yol tarifi alınamıyor.');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Hata', 'Harita uygulaması bulunamadı.');
        }
      })
      .catch(() => {
        Alert.alert('Hata', 'Harita uygulaması açılamadı.');
      });
  };

  const addPoint = (lat, lng, type) => {
    const newPoint = {
      id: Date.now().toString(),
      name: 'Yeni Nokta',
      type,
      distance: 'Yakın',
      status: 'empty',
      lastChecked: 'Az önce',
      lat,
      lng,
    };
    setPoints(prev => [...prev, newPoint]);
    setSelectedPoint(newPoint.id);
    // Aktif filtre yeni noktayı gizlemesin
    setFilter('all');
    // Yeni noktaya zoom yap
    mapRef.current?.animateToRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    }, 500);
  };

  const createPointAt = (coordinate) => {
    const { latitude, longitude } = coordinate;
    Alert.alert(
      'Yeni Nokta 📍',
      'Bu noktada ne var? (Eklendikten sonra işareti basılı tutup sürükleyerek yerini değiştirebilirsin.)',
      [
        { text: '🥣 Mama', onPress: () => addPoint(latitude, longitude, 'food') },
        { text: '💧 Su', onPress: () => addPoint(latitude, longitude, 'water') },
        { text: '🥣💧 İkisi', onPress: () => addPoint(latitude, longitude, 'both') },
        { text: 'İptal', style: 'cancel' },
      ]
    );
  };

  const handleMapPress = (e) => {
    // Marker'a basınca (iOS'ta harita onPress de tetiklenir) nokta ekleme
    if (e.nativeEvent.action === 'marker-press') return;
    if (!addingMode) return;
    setAddingMode(false);
    createPointAt(e.nativeEvent.coordinate);
  };

  const handleMapLongPress = (e) => {
    setAddingMode(false);
    createPointAt(e.nativeEvent.coordinate);
  };

  const movePoint = (id, coordinate) => {
    setPoints(prev => prev.map(p =>
      p.id === id
        ? { ...p, lat: coordinate.latitude, lng: coordinate.longitude, lastChecked: 'Az önce' }
        : p
    ));
  };

  const focusOnPoint = (point) => {
    setSelectedPoint(point.id);
    mapRef.current?.animateToRegion({
      latitude: point.lat,
      longitude: point.lng,
      latitudeDelta: 0.006,
      longitudeDelta: 0.006,
    }, 500);
  };

  const goToMyLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      }, 500);
    } else {
      Alert.alert('Konum', 'Konumunuz alınamadı. Konum izni verdiğinizden emin olun.');
    }
  };

  const filters = [
    { key: 'all',   label: 'Tümü' },
    { key: 'food',  label: '🥣 Mama' },
    { key: 'water', label: '💧 Su' },
    { key: 'both',  label: '🥣💧 İkisi' },
  ];

  const filtered = points.filter(
    p => filter === 'all' || p.type === filter
  );

  const getMarkerColor = (status) => {
    return STATUS_COLORS[status] || colors.warning;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Mama & Su Haritası</Text>
            <Text style={styles.subtitle}>
              {loading ? 'Konum alınıyor...' : `${filtered.length} nokta bulundu`}
            </Text>
          </View>
          <TouchableOpacity style={styles.myLocationBtn} onPress={goToMyLocation}>
            <Text style={styles.myLocationText}>📍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Real Map with OpenStreetMap */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Harita yükleniyor...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            mapType="none"
            onPress={handleMapPress}
            onLongPress={handleMapLongPress}
          >
            {/* OpenStreetMap Tile Layer - Ücretsiz! */}
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />

            {/* Feeding Point Markers */}
            {filtered.map(point => (
              <Marker
                key={point.id}
                coordinate={{
                  latitude: point.lat,
                  longitude: point.lng,
                }}
                title={point.name}
                description={`${TYPE_LABEL[point.type]} • ${point.distance}`}
                onPress={() => setSelectedPoint(point.id)}
                draggable
                onDragEnd={(e) => movePoint(point.id, e.nativeEvent.coordinate)}
              >
                {/* Custom Marker View */}
                <View style={styles.customMarkerContainer}>
                  <View style={[
                    styles.customMarker,
                    { backgroundColor: getMarkerColor(point.status) }
                  ]}>
                    <Text style={styles.markerEmoji}>{TYPE_EMOJI[point.type]}</Text>
                  </View>
                  <View style={[
                    styles.markerArrow,
                    { borderTopColor: getMarkerColor(point.status) }
                  ]} />
                </View>

                {/* Callout (bilgi baloncuğu) */}
                <Callout tooltip style={styles.calloutContainer}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{point.name}</Text>
                    <Text style={styles.calloutType}>{TYPE_LABEL[point.type]}</Text>
                    <View style={styles.calloutStatusRow}>
                      <View style={[styles.calloutDot, { backgroundColor: getMarkerColor(point.status) }]} />
                      <Text style={styles.calloutStatus}>
                        {point.status === 'full' ? 'Dolu' : point.status === 'empty' ? 'Boş' : 'Kontrol gerekli'}
                      </Text>
                    </View>
                    <Text style={styles.calloutTime}>Son kontrol: {point.lastChecked}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        )}

        {/* Adding Mode Banner */}
        {addingMode && !loading && (
          <View style={styles.addingBanner}>
            <Text style={styles.addingBannerText}>
              📍 Nokta eklemek için haritada bir yere dokun
            </Text>
          </View>
        )}

        {/* Floating Add Button */}
        <TouchableOpacity
          style={[styles.addPointBtn, addingMode && styles.addPointBtnActive]}
          onPress={() => setAddingMode(prev => !prev)}
        >
          <Text style={styles.addPointIcon}>{addingMode ? '✕' : '＋'}</Text>
        </TouchableOpacity>

        {/* Map Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Dolu</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Boş</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Kontrol</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Points List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <SectionTitle style={{ paddingHorizontal: spacing.lg }}>Noktalar</SectionTitle>

        {filtered.map(point => (
          <Card
            key={point.id}
            style={[
              styles.pointCard,
              selectedPoint === point.id && styles.pointCardSelected,
            ]}
            onPress={() => focusOnPoint(point)}
          >
            <View style={styles.pointRow}>
              <View style={[styles.pointIcon, {
                backgroundColor: point.status === 'full' ? colors.primaryLight :
                                 point.status === 'empty' ? colors.dangerLight : colors.warningLight
              }]}>
                <Text style={{ fontSize: 20 }}>{TYPE_EMOJI[point.type]}</Text>
              </View>
              <View style={styles.pointInfo}>
                <Text style={styles.pointName}>{point.name}</Text>
                <Text style={styles.pointMeta}>
                  {TYPE_LABEL[point.type]} • {point.distance} uzakta
                </Text>
                <Text style={styles.pointChecked}>Son kontrol: {point.lastChecked}</Text>
              </View>
              <StatusBadge status={point.status} />
            </View>

            {/* Actions */}
            <View style={styles.pointActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => openDirections(point)}>
                <Text style={styles.actionBtnText}>🗺️ Yol tarifi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => toggleStatus(point.id)}>
                <Text style={styles.actionBtnPrimaryText}>
                  {point.status === 'full' ? '✗ Boş işaretle' : '✓ Dolu işaretle'}
                </Text>
              </TouchableOpacity>
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
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  myLocationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myLocationText: {
    fontSize: 20,
  },
  mapContainer: {
    height: 260,
    backgroundColor: colors.background,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },

  // Custom Marker
  customMarkerContainer: {
    alignItems: 'center',
  },
  customMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  markerEmoji: {
    fontSize: 14,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },

  // Callout
  calloutContainer: {
    width: 180,
  },
  callout: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  calloutTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  calloutType: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  calloutStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  calloutDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  calloutStatus: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  calloutTime: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Floating Buttons
  addPointBtn: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addPointBtnActive: {
    backgroundColor: colors.danger,
  },
  addPointIcon: {
    color: colors.white,
    fontSize: 24,
    fontWeight: typography.weight.bold,
    lineHeight: 28,
  },
  addingBanner: {
    position: 'absolute',
    top: spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addingBannerText: {
    color: colors.white,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },

  // Legend
  legend: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    gap: spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },

  // Filters
  filterScroll: {
    backgroundColor: colors.background,
    maxHeight: 52,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: typography.weight.medium,
  },

  // Points List
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pointCard: { marginHorizontal: spacing.lg },
  pointCardSelected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  pointIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pointInfo: { flex: 1 },
  pointName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  pointMeta: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pointChecked: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  pointActions: {
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
});
