# TikTok Anket Uygulaması

Bu uygulama, TikTok platformu kullanım amacı ve platformda yer alan influencerların takipçileri üzerindeki etkilerinin belirlenmesi amacıyla hazırlanmış bir anket uygulamasıdır.

## Sahte Anket Verileri Oluşturma

Admin panelinde görüntülemek üzere test amaçlı sahte anket verileri oluşturmak için aşağıdaki adımları takip edebilirsiniz:

### Gereksinimler

- Node.js 

### Kurulum

1. Projeyi bilgisayarınıza klonlayın
2. `npm install` komutu ile bağımlılıkları yükleyin
3. Firebase kullanımı için gerekli paketleri yükleyin: `npm install firebase`

### Sahte Veri Oluşturma

Sahte anket verilerini oluşturmak için:

```bash
# 100 adet anket yanıtı oluşturmak için (varsayılan)
node src/scripts/generateSurveyData.js

# Belirli sayıda anket yanıtı oluşturmak için
node src/scripts/generateSurveyData.js --count=120
```

Bu komut:
- Belirtilen sayıda sahte anket yanıtı oluşturur
- Yanıtları CSV formatında `/output` klasörüne kaydeder
- Oluşturulan verilerin istatistiklerini gösterir

### Firebase'e Veri Yükleme

Oluşturulan verileri Firebase veritabanına yüklemek için:

```bash
# Firebase yapılandırma bilgilerini ayarlayın
export FIREBASE_API_KEY="your-api-key"
export FIREBASE_AUTH_DOMAIN="your-auth-domain"
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_STORAGE_BUCKET="your-storage-bucket"
export FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
export FIREBASE_APP_ID="your-app-id"

# 100 adet sahte anket yanıtı oluşturup Firebase'e yüklemek için
node src/scripts/saveToFirebase.js

# Belirli sayıda yanıt için
node src/scripts/saveToFirebase.js --count=120
```

Bu script:
- Gerçek anket sonuçlarının ortalamasını koruyacak şekilde sahte veriler üretir
- Oluşturulan verileri batch halinde Firebase'e yükler
- Yükleme ilerlemesini ve istatistikleri gösterir

### Özellikler

Oluşturulan sahte veriler:

- Mikro ve makro influencer anketleri için dengeli dağılım sağlar
- Gerçekçi demografik veriler içerir (isim, yaş, cinsiyet, eğitim, gelir)
- Dikkat kontrolü sorularına doğru yanıtlar verir (q21, q45 veya qs2_21, qs2_47)
- Kullanıcı profilleri arasında tutarlılık sağlar (bir kullanıcının tüm cevapları kendi içinde tutarlıdır)
- Gerçek kullanıcılar tarafından doldurulmuş gibi çeşitlilik içerir
- **Gerçek anket verilerinin ortalamasını koruyarak, istatistiksel değerleri bozmaz**

### CSV Dosyası

Oluşturulan CSV dosyası şu alanları içerir:

- Anket Tipi: Mikro veya Makro
- Oluşturma Tarihi: Anketin doldurulduğu tarih
- İsim: Kullanıcının adı
- Yaş: Yaş aralığı
- Cinsiyet: Kadın veya Erkek
- Eğitim: Eğitim seviyesi
- Gelir: Gelir aralığı
- Soru yanıtları: Tüm anket sorularına verilen yanıtlar (q5-q59 veya qs2_5-qs2_59)

### Notlar

- Oluşturulan veriler, gerçek kullanıcı davranışlarını simüle etmek için çeşitli algoritmalara dayanır
- Her çalıştırmada farklı veriler oluşturulur
- Dikkat kontrolü soruları her zaman doğru yanıtlanır
- Tüm sorular için anlamlı ve tutarlı yanıtlar üretilir
- Veri dağılımı gerçek anketlerin ortalamasına göre normal dağılımlı olarak üretilir

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
