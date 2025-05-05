# Anket Uygulaması

Bu proje, TikTok kullanım alışkanlıklarını ölçen bir anket uygulamasıdır. Kullanıcılara rastgele bir anket gösterilir ve kullanıcıların anketi tamamlamaları beklenir.

## Özellikler

- Rastgele anket seçimi
- Responsive tasarım (mobil ve masaüstü uyumlu)
- İlk 4 soru tek tek gösterilirken, sonraki sorular tek bir sayfada gösterilir
- İlerleme çubuğu
- Firebase veritabanına entegrasyon için hazır altyapı

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/username/survey.git
cd survey
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme modunda çalıştırın:
```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:3000` adresini açın.

## Teknolojiler

- Next.js 14
- TypeScript
- Tailwind CSS
- React Context API
- Firebase (henüz entegre edilmedi)

## Proje Yapısı

```
/src
  /app
    /survey
      layout.tsx
      page.tsx
    /thank-you
      page.tsx
    layout.tsx
    page.tsx
  /components
    RadioQuestion.tsx
    LikertQuestion.tsx
    ProgressBar.tsx
  /contexts
    SurveyContext.tsx
  /models
    survey.ts
```

## Firebase Entegrasyonu

Firebase entegrasyonu için:

1. Firebase hesabı oluşturun
2. Yeni bir proje ekleyin
3. Firestore database oluşturun
4. Firebase yapılandırma ayarlarını `.env.local` dosyasına ekleyin:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

5. Firebase yapılandırmasını ekleyin ve SurveyContext.tsx içindeki submitSurvey fonksiyonunu düzenleyin.

## Lisans

MIT
