import React, { createContext, useContext, useState, useCallback } from 'react';
import * as Crypto from 'expo-crypto';

const NotificationContext = createContext();

// Varsayılan bildirimler
const DEFAULT_NOTIFICATIONS = [
  {
    id: 'default-1',
    type: 'adoption',
    emoji: '🐾',
    title: 'Evlat edinme talebiniz onaylandı!',
    message: 'Özlem için evlat edinme talebiniz ilan sahibi tarafından onaylandı.',
    time: '2 saat önce',
    read: false,
  },
  {
    id: 'default-2',
    type: 'alert',
    emoji: '🚨',
    title: 'Yakınınızda yaralı hayvan bildirimi',
    message: 'Moda Parkı yakınında yaralı bir kedi bildirildi. Yardım edebilir misiniz?',
    time: '4 saat önce',
    read: false,
  },
  {
    id: 'default-3',
    type: 'vaccine',
    emoji: '💉',
    title: 'Aşı hatırlatması',
    message: "Özlem'in karma aşısı için randevu zamanı geldi.",
    time: 'Dün',
    read: true,
  },
  {
    id: 'default-4',
    type: 'feeding',
    emoji: '🥣',
    title: 'Mama noktası boşaldı',
    message: 'Haydar Aliyev Parkı mama noktası boş olarak işaretlendi.',
    time: 'Dün',
    read: true,
  },
  {
    id: 'default-5',
    type: 'community',
    emoji: '🎉',
    title: 'Topluluk güncellemesi',
    message: 'Bu ay bölgenizde 12 hayvan sahiplendirildi! Teşekkürler.',
    time: '2 gün önce',
    read: true,
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  /**
   * Yeni bildirim ekle (en üste)
   */
  const addNotification = useCallback(({ type, emoji, title, message }) => {
    const newNotif = {
      id: Crypto.randomUUID(),
      type,
      emoji,
      title,
      message,
      time: 'Az önce',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    return newNotif;
  }, []);

  /**
   * Tek bir bildirimi okundu olarak işaretle
   */
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  /**
   * Tüm bildirimleri okundu olarak işaretle
   */
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  /**
   * Okunmamış bildirim sayısı
   */
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllRead,
      unreadCount,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
