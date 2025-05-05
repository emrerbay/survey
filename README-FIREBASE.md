# Firebase Entegrasyon Talimatları

Bu doküman, anket uygulamasının Firebase'e nasıl entegre edileceğini adım adım açıklamaktadır.

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Proje ekle" veya "Add project" seçeneğine tıklayın
3. Projenize bir isim verin, örneğin "survey-app"
4. Google Analytics'i etkinleştirip etkinleştirmemeyi seçin (opsiyonel)
5. "Proje oluştur" veya "Create project" düğmesine tıklayın
6. Proje oluşturulduğunda "Continue" veya "Devam Et" düğmesine tıklayın

## 2. Firestore Veritabanı Oluşturma

1. Sol menüden "Firestore Database" seçeneğine tıklayın
2. "Create database" düğmesine tıklayın
3. Güvenlik modunu "Start in test mode" (Test modunda başlat) olarak seçin (Gerçek bir uygulamada production modunda daha sıkı güvenlik kuralları ayarlamanız gerekecektir)
4. Coğrafi konumunuza en yakın bölgeyi seçin ve "Enable" (Etkinleştir) düğmesine tıklayın

## 3. Firebase Web Uygulaması Yapılandırma

1. Firebase Console'da projenizin ana sayfasına gidin
2. "Web" (</>) simgesine tıklayarak web uygulaması ekleme seçeneğini seçin
3. Uygulamanıza bir takma ad verin, örneğin "survey-web-app"
4. "Firebase Hosting'i de bu uygulama için ayarla" seçeneğini işaretleyebilirsiniz (isteğe bağlı)
5. "Uygulamayı kaydet" veya "Register app" düğmesine tıklayın
6. Firebase size bir yapılandırma bilgisi verecektir

## 4. Environment Değişkenlerini Ayarlama

Projenizin kök dizininde `.env.local` adında bir dosya oluşturun ve Firebase yapılandırma bilgilerinizi aşağıdaki formatta ekleyin:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

## 5. Firebase Yapılandırma Dosyasını Güncelleme

`src/firebase/config.ts` dosyasını açın ve environment değişkenlerini kullanacak şekilde güncelleyin:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase yapılandırma bilgilerinizi .env.local dosyasından alın
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanını al
const db = getFirestore(app);

export { app, db };
```

## 6. Uygulamayı Çalıştırma

Tüm değişiklikleri yaptıktan sonra, uygulamayı yeniden başlatın:

```
npm run dev
```

## 7. Firestore Güvenlik Kuralları Ayarlama (Opsiyonel)

Uygulama gerçek ortama geçmeden önce, Firestore güvenlik kurallarını düzenlemeniz önerilir. Firestore Console'da "Rules" sekmesine gidin ve aşağıdaki gibi basit bir kural ekleyin:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /survey-responses/{document=**} {
      allow read, write: if true;  // Test için, üretim ortamında daha sıkı kurallar kullanın
    }
  }
}
```

## 8. Verileri Kontrol Etme

Anket yanıtları Firestore'da `survey-responses` koleksiyonunda saklanacaktır. Firebase Console'da "Firestore Database" bölümüne giderek gönderilen yanıtları görebilirsiniz. 