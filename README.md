# 🐾 PatiApp

Sokak hayvanlarını korumak, sahiplendirmek ve topluluk olarak destek olmak için geliştirilmiş mobil uygulama. Kullanıcılar sahiplenme bekleyen hayvanları keşfedebilir, mama/su noktalarını harita üzerinde takip edebilir, yaralı veya kayıp hayvanları bildirebilir ve hayvan haklarını ihlal eden durumları şikâyet edebilir.

---

## ✨ Özellikler

- **🏠 Sahiplendirme** — Sahiplenme bekleyen hayvanları ırk, tür ve konuma göre arayın; favori listesi oluşturun.
- **🗺️ Mama & Su Haritası** — OpenStreetMap tabanlı gerçek harita üzerinde mama/su noktalarını görüntüleyin, yeni nokta ekleyin ve durumlarını güncelleyin.
- **🐾 Hayvan Bildirimi** — Sahipsiz, kayıp, bulunan veya yaralı hayvanları fotoğraf ve konum bilgisiyle bildirin; yakındaki gönüllülere otomatik bildirim gitsin.
- **🚨 Şikâyet Modülü** — Hayvan istismarı, ihmal, terk etme gibi 8 farklı kategoride şikâyet oluşturun; aciliyet seviyesi belirleyin; anonim bildirim yapın.
- **🏥 Veteriner Rehberi** — Yakındaki veteriner kliniklerini, çalışma saatlerini, puanlarını ve uzmanlık alanlarını görüntüleyin; 7/24 acil veteriner desteğine erişin.
- **👤 Profil & Hayvan Yönetimi** — Kendi hayvanlarınızı kaydedin, aşı takvimini takip edin, konum bilgilerini güncelleyin.
- **🔔 Bildirim Sistemi** — Yapılan bildirimlerin ve güncellemelerin anlık takibi.
- **🔐 Kimlik Doğrulama** — Kayıt/giriş sistemi; şifre gücü kontrolü, oturum yönetimi (SecureStore ile güvenli saklama).

---

## 🛠 Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|-----------|----------|
| **React Native** | Çapraz platform mobil uygulama geliştirme |
| **Expo SDK 54** | Geliştirme, build ve dağıtım araç seti |
| **React Navigation 6** | Bottom Tabs + Native Stack navigasyon |
| **React Native Maps** | OpenStreetMap destekli interaktif harita |
| **Expo Location** | GPS konum servisleri |
| **Expo Secure Store** | Güvenli oturum saklama |
| **Expo Crypto** | Şifreleme işlemleri |
| **Context API** | Global state yönetimi (Auth, Animal, Favorites, Notification) |

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js 18+**
- **Expo Go** uygulaması (telefonunuzda — [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Adımlar

```bash
git clone https://github.com/ardaberkkara/PatiApp.git
cd PatiApp
npm install
npx expo start
```

Terminalde çıkan **QR kodu** telefonundaki Expo Go ile okut.
Emülatörde çalıştırmak için terminalde `a` (Android) veya `i` (iOS) tuşuna bas.

---

## 📁 Proje Yapısı

```
PatiApp/
├── App.js                        # Uygulama giriş noktası (Provider sarmalayıcı)
├── app.json                      # Expo yapılandırması
├── package.json                  # Bağımlılıklar ve scriptler
│
└── src/
    ├── components/               # Yeniden kullanılabilir UI bileşenleri
    │   └── index.js              #   Card, Badge, Avatar, Button vb.
    │
    ├── config/                   # Uygulama yapılandırması
    │   └── index.js              #   Sabitler, doğrulama fonksiyonları, sanitizasyon
    │
    ├── context/                  # React Context (global state)
    │   ├── AuthContext.js        #   Kimlik doğrulama & oturum yönetimi
    │   ├── AnimalContext.js      #   Hayvan CRUD işlemleri
    │   ├── FavoritesContext.js   #   Favori listesi yönetimi
    │   └── NotificationContext.js#   Bildirim sistemi
    │
    ├── data/                     # Mock veri
    │   └── mockData.js           #   Hayvanlar, bildirimler, mama noktaları, veterinerler
    │
    ├── navigation/               # Navigasyon yapısı
    │   └── AppNavigator.js       #   Auth flow + Bottom Tabs + Stack Navigator
    │
    ├── screens/                  # Ekranlar
    │   ├── HomeScreen.js         #   Ana sayfa (arama, istatistik, sahiplendirme listesi)
    │   ├── MapScreen.js          #   Mama & su haritası (OpenStreetMap)
    │   ├── VetsScreen.js         #   Veteriner rehberi
    │   ├── ProfileScreen.js      #   Profil & hayvan yönetimi
    │   ├── ComplaintScreen.js    #   Şikâyet formu
    │   ├── ReportScreen.js       #   Hayvan bildirim formu
    │   ├── AddAnimalScreen.js    #   Yeni hayvan ekleme
    │   ├── AnimalDetailScreen.js #   Hayvan detay sayfası
    │   ├── NotificationsScreen.js#   Bildirimler
    │   ├── LoginScreen.js        #   Giriş ekranı
    │   └── RegisterScreen.js     #   Kayıt ekranı
    │
    └── theme/                    # Tasarım sistemi
        └── index.js              #   Renkler, boşluklar, tipografi, border-radius
```

---

## 🗺 Yol Haritası

- [ ] Firebase / Supabase backend entegrasyonu
- [ ] Fotoğraf ekleme (expo-image-picker)
- [ ] Push notification desteği
- [ ] Gerçek zamanlı harita güncellemeleri
- [ ] Sahiplendirme başvuru sistemi
- [ ] Chat / mesajlaşma özelliği
- [ ] Çoklu dil desteği (i18n)
- [ ] Dark mode

---

## 📄 Lisans

Bu proje kişisel/eğitim amaçlı geliştirilmiştir.

---

<p align="center">
  Hayvan dostlarımız için 🐾 ile yapıldı
</p>
