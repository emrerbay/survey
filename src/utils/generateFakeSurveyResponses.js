// Sahte anket yanıtları üretmek için yardımcı fonksiyon
const turkishFemaleNames = [
  "Ayşe", "Fatma", "Zeynep", "Emine", "Hatice", "Elif", "Özlem", "Büşra",
  "Derya", "Gül", "Canan", "Selin", "Gamze", "Merve", "Seda", "Esra", "Aslı", 
  "Gizem", "Sevgi", "Sibel", "Şule", "Ebru", "Ayla", "Nuray", "Burcu", "Tuğçe", 
  "Yasemin", "Aysun", "Melek", "Esin", "Özge", "Feride", "Ceyda", "Beyza", 
  "İrem", "Ezgi", "Aylin", "Nihan", "Sinem", "Elvan", "Arzu", "Serap", "Pınar", 
  "Hande", "Nalan", "Duygu", "Filiz", "Zehra", "Şeyma", "Bahar", "Dilara", "Ece"
];

const turkishMaleNames = [
  "Ahmet", "Mehmet", "Ali", "Mustafa", "İbrahim", "Hüseyin", "Halil", "Ömer", 
  "Hasan", "Murat", "Serkan", "Cem", "Deniz", "Berk", "Emre", "Burak", "Tolga", 
  "Onur", "Kaan", "Kemal", "Tuncay", "Tarık", "Orhan", "Levent", "Metin", "Oktay", 
  "Tamer", "Selim", "Erol", "Selçuk", "Erkan", "Hakan", "Serdar", "Kadir", "Umut", 
  "Alper", "Yavuz", "Melih", "Özkan", "Ferhat", "Volkan", "Koray", "Ufuk", "Sinan", 
  "Bülent", "Erhan", "Emrah", "Mert", "Barış", "İsmail", "Yiğit"
];

const surnames = [
  "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir",
  "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Şimşek", "Kurt", "Özkan", "Şen", "Koç",
  "Karahan", "Acar", "Ceylan", "Tekin", "Kara", "Çalışkan", "Bilgin", "Avcı", "Türk", "Yalçın",
  "Güneş", "Yüksel", "Turan", "Polat", "Korkmaz", "Bulut", "Çakır", "Aksoy", "Erbaş", "Canatar",
  "Erdem", "Yaman", "Kaplan", "Kocaman", "Zengin", "Aktaş", "Coşkun", "Altun", "Güler", "Kahraman"
];

// Mevcut anket ortalamalarını temsil eden veriler
// Bu değerler gerçek veri analizi sonucunda belirlenebilir veya uygun şekilde ayarlanabilir
const realSurveyMeans = {
  // TikTok kullanım alışkanlıkları (q5-q17) ortalamaları - tipik olarak 1-5 arası puanlar
  usageHabits: {
    micro: {
      // Her soru için varsayılan ortalama değerler (örneğin gerçek verilerden hesaplanmış)
      q5: 3.2, q6: 2.8, q7: 2.5, q8: 4.1, q9: 2.2, q10: 2.7, q11: 2.4, 
      q12: 4.0, q13: 2.9, q14: 2.3, q15: 4.2, q16: 3.1, q17: 3.8
    },
    macro: {
      qs2_5: 3.1, qs2_6: 2.9, qs2_7: 2.6, qs2_8: 4.2, qs2_9: 2.3, qs2_10: 2.8, qs2_11: 2.5,
      qs2_12: 4.1, qs2_13: 3.0, qs2_14: 2.4, qs2_15: 4.3, qs2_16: 3.0, qs2_17: 3.9
    }
  },
  // TikTok ve hayat soruları (q18-q41) ortalamaları
  lifeAndShopping: {
    micro: {
      q18: 3.1, q19: 3.2, q20: 3.3, // q21 tuzak soru, ortalamaya dahil değil
      q22: 2.9, q23: 3.8, q24: 4.0, q25: 3.7, q26: 3.6, q27: 3.2, q28: 3.0, q29: 3.4,
      q30: 2.8, q31: 3.1, q32: 2.7, q33: 2.5, q34: 3.0, q35: 3.2, q36: 3.5,
      q37: 3.1, q38: 3.3, q39: 3.4, q40: 2.5, q41: 2.4
    },
    macro: {
      qs2_18: 3.0, qs2_19: 3.1, qs2_20: 3.2, // qs2_21 tuzak soru
      qs2_22: 2.8, qs2_23: 3.7, qs2_24: 3.9, qs2_25: 3.6, qs2_26: 3.5, qs2_27: 3.1, qs2_28: 2.9, qs2_29: 3.3,
      qs2_30: 2.7, qs2_31: 3.0, qs2_32: 2.6, qs2_33: 2.4, qs2_34: 2.9, qs2_35: 3.1, qs2_36: 3.4,
      qs2_37: 3.0, qs2_38: 3.2, qs2_39: 3.3, qs2_40: 2.4, qs2_41: 2.3
    }
  },
  // Influencer soruları (q42-q61 / qs2_42-qs2_61) ortalamaları
  influencer: {
    micro: {
      q42: 2.4, q43: 2.3, q44: 2.5, // q45 tuzak soru
      q46: 2.6, q47: 2.5, q48: 2.2, q49: 2.7, q50: 2.3, q51: 3.1, q52: 3.0,
      q53: 3.2, q54: 2.9, q55: 2.8, q56: 3.3, q57: 3.4, q58: 3.2, q59: 3.1, q60: 3.0, q61: 3.1
    },
    macro: {
      qs2_42: 2.3, qs2_43: 2.2, qs2_44: 2.4, qs2_45: 2.3, qs2_46: 2.5, // qs2_47 tuzak soru
      qs2_48: 2.1, qs2_49: 2.6, qs2_50: 2.2, qs2_51: 3.0, qs2_52: 2.9, qs2_53: 3.1, 
      qs2_54: 2.8, qs2_55: 2.7, qs2_56: 3.2, qs2_57: 3.3, qs2_58: 3.1, qs2_59: 3.0, qs2_60: 2.9, qs2_61: 3.0
    }
  }
};

// Normal dağılım ile ortalamayı koruyacak şekilde değer üretme
const getNormalDistributedValue = (mean, stdDev = 1.0) => {
  // Box-Muller dönüşümü ile normal dağılımlı rastgele değer üret
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // 0 olmasını engelle
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  
  // Ortalama ve standart sapma ile ölçeklendir
  let value = Math.round(mean + stdDev * z);
  
  // 1-5 aralığında sınırla
  return Math.min(5, Math.max(1, value));
};

const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Ağırlıklı rastgele değer seçme
const getWeightedRandomValue = (weights) => {
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return i + 1;
    }
    random -= weights[i];
  }
  
  return weights.length;
};

// İsim üretme fonksiyonu - cinsiyet parametresi alacak şekilde güncellenmiş
const generateName = (gender) => {
  // Cinsiyete göre isim listesini seç
  const nameList = gender === "female" ? turkishFemaleNames : turkishMaleNames;
  const name = getRandomItem(nameList);
  
  // 30% şansla soyadı da ekle
  return Math.random() < 0.3 ? `${name} ${getRandomItem(surnames)}` : name;
};

const generateSurveyResponse = (surveyType) => {
  // Belirli bir tarih aralığı oluştur: 5 Mayıs - 26 Mayıs 2025
  const timestamp = new Date(2025, 4, 5); // 5 Mayıs 2025 (JavaScript'te aylar 0'dan başlar, 4 = Mayıs)
  
  // 5 Mayıs - 26 Mayıs arasında rastgele bir gün seç (0-21 arası gün)
  const randomDays = getRandomIntBetween(0, 21);
  timestamp.setDate(timestamp.getDate() + randomDays);
  
  // Saati ve dakikayı da rastgele belirle
  timestamp.setHours(getRandomIntBetween(0, 23));
  timestamp.setMinutes(getRandomIntBetween(0, 59));
  timestamp.setSeconds(getRandomIntBetween(0, 59));
  
  // Önce cinsiyet belirle, isim cinsiyetle tutarlı olsun
  // Ağırlık dağılımları korundu: female = 0.6, male = 0.4
  const gender = getWeightedRandomValue([0.6, 0.4]) === 1 ? "female" : "male";
  
  // Ortak demografik veriler - isim cinsiyete göre oluşturulacak
  const name = generateName(gender);
  const ageGroup = getWeightedRandomValue([0.3, 0.4, 0.15, 0.1, 0.05]); // Ağırlıklı olarak genç nüfus
  
  // Eğitim durumu ağırlıklarını güncelliyoruz - sadece yüksek eğitim düzeyleri
  // İndeksler: 3=ön lisans, 4=lisans, 5=yüksek lisans, 6=doktora
  // Ön lisans: %15, Lisans: %50, Yüksek Lisans: %25, Doktora: %10
  const education = getWeightedRandomValue([0, 0, 0, 0.15, 0.50, 0.25, 0.10]) + 1;
  
  const income = getWeightedRandomValue([0.1, 0.1, 0.15, 0.25, 0.2, 0.1, 0.05, 0.05]); // Orta-yüksek gelirli ağırlıklı
  
  // Anket tipine göre ID ön eki ve ortalamaları
  const idPrefix = surveyType === "mikro" ? "q" : "qs2_";
  const isMicro = surveyType === "mikro";
  
  // Yanıtları tutacak nesne
  const answers = {};
  
  // Demografik veriler
  answers[`${idPrefix}0`] = name;
  answers[`${idPrefix}1`] = ["18-24", "25-34", "35-44", "45-54", "55+"][ageGroup - 1];
  answers[`${idPrefix}2`] = gender; // "female" veya "male"
  answers[`${idPrefix}3`] = ["primary", "middle", "high", "associate", "bachelor", "master", "doctorate"][education - 1];
  answers[`${idPrefix}4`] = ["no-income", "1-9999", "10000-24999", "25000-49999", "50000-74999", "75000-99999", "100000+", "no-answer"][income - 1];
  
  // TikTok kullanım alışkanlıkları (q5-q17)
  for (let i = 5; i <= 17; i++) {
    const questionId = `${idPrefix}${i}`;
    const meanValue = isMicro 
      ? realSurveyMeans.usageHabits.micro[`q${i}`]
      : realSurveyMeans.usageHabits.macro[`qs2_${i}`];
    
    // Standart sapma: aktif kullanıcılar için daha yüksek (daha fazla varyasyon)
    // pasif kullanıcılar için daha düşük (daha tutarlı davranış)
    let stdDev = 0.8;
    
    // Aktivite seviyesine göre standart sapmayı ayarla
    if (i === 5 || i === 6 || i === 7 || i === 10 || i === 11 || i === 13 || i === 14 || i === 16) {
      // Aktif faaliyetler için yüksek varyasyon
      stdDev = 1.0;
    } else if (i === 8 || i === 12 || i === 15 || i === 17) {
      // Pasif faaliyetler için düşük varyasyon
      stdDev = 0.7;
    }
    
    // Ortalama ve standart sapma ile normal dağılımlı değer üret
    answers[questionId] = getNormalDistributedValue(meanValue, stdDev);
  }
  
  // TikTok ve alışveriş-hayat soruları (18-41)
  for (let i = 18; i <= 41; i++) {
    const questionId = `${idPrefix}${i}`;
    
    // Tuzak sorular için doğru cevapları ayarlayalım
    if ((isMicro && i === 21) || (!isMicro && i === 21)) {
      answers[questionId] = 2; // "2 = Katılmıyorum" seçeneği
    } else {
      // Gerçek ortalamaları kullan
      const meanValue = isMicro 
        ? realSurveyMeans.lifeAndShopping.micro[`q${i}`]
        : realSurveyMeans.lifeAndShopping.macro[`qs2_${i}`];
      
      if (meanValue) {
        // Bağımlılık ve materyalizm soruları için farklı standart sapma değerleri
        let stdDev = 0.8;
        
        // Bağımlılık soruları (30-33) için aktivite seviyesine göre ayarla
        if (i >= 30 && i <= 33) {
          stdDev = answers[`${idPrefix}15`] > 3 ? 0.7 : 1.0; // Sık kullananlar daha tutarlı
        } 
        // Materyalizm soruları (34-39) için gelir seviyesine göre ayarla
        else if (i >= 34 && i <= 39) {
          const incomeLevel = income;
          stdDev = incomeLevel > 4 ? 0.7 : 0.9; // Yüksek gelirliler daha tutarlı
        }
        
        answers[questionId] = getNormalDistributedValue(meanValue, stdDev);
      } else {
        // Eğer ortalama yoksa makul bir değer ata
        answers[questionId] = getRandomIntBetween(2, 4);
      }
    }
  }
  
  // Influencer soruları (40-61)
  for (let i = 40; i <= 61; i++) {
    const questionId = `${idPrefix}${i}`;
    
    // Tuzak sorular için doğru cevapları ayarlayalım
    if ((isMicro && i === 45) || (!isMicro && i === 47)) {
      answers[questionId] = 5; // "5 = Kesinlikle katılıyorum" seçeneği
    } else {
      // Gerçek ortalamaları kullan
      const section = i >= 42 ? 'influencer' : 'lifeAndShopping';
      const meanValue = isMicro 
        ? realSurveyMeans[section].micro[`q${i}`]
        : realSurveyMeans[section].macro[`qs2_${i}`];
      
      if (meanValue) {
        // Farklı soru grupları için standart sapma değerleri
        let stdDev = 0.8;
        
        // İnfluencer etkileşim soruları (40-44)
        if (i >= 40 && i <= 44) {
          // TikTok kullanım sıklığına göre standart sapmayı ayarla
          stdDev = answers[`${idPrefix}5`] > 3 ? 0.7 : 1.0; // Aktif paylaşanlar daha tutarlı
        }
        // Negatif etkileşimler (46-55)
        else if (i >= 46 && i <= 55) {
          stdDev = 0.9; // Gözlemlerin daha fazla varyasyonu olabilir
        }
        // Satın alma niyeti (56-61)
        else if (i >= 56) {
          // Gelir seviyesine göre standart sapmayı ayarla
          stdDev = income > 4 ? 0.7 : 0.9; // Yüksek gelirliler daha tutarlı
        }
        
        answers[questionId] = getNormalDistributedValue(meanValue, stdDev);
      } else {
        // Eğer ortalama yoksa makul bir değer ata
        answers[questionId] = getRandomIntBetween(2, 4);
      }
    }
  }
  
  return {
    timestamp: timestamp.toISOString(),
    surveyType,
    answers
  };
};

// 100+ adet anket yanıtı oluştur
const generateFakeSurveyResponses = (count = 100) => {
  const responses = [];
  for (let i = 0; i < count; i++) {
    // Yaklaşık yarı yarıya mikro ve makro anketler
    const surveyType = Math.random() < 0.5 ? "mikro" : "makro";
    responses.push(generateSurveyResponse(surveyType));
  }
  return responses;
};

// CSV formatına dönüştürme
const convertToCSV = (responses) => {
  // Tüm olası soru ID'lerini topla
  const allQuestionIds = new Set();
  responses.forEach(response => {
    Object.keys(response.answers).forEach(key => {
      allQuestionIds.add(key);
    });
  });
  
  // CSV başlık satırı oluştur
  const sortedQuestionIds = Array.from(allQuestionIds).sort((a, b) => {
    // İlk önce anket tipine göre sırala (q vs qs2_)
    const aPrefix = a.startsWith('q') ? 0 : 1;
    const bPrefix = b.startsWith('q') ? 0 : 1;
    
    if (aPrefix !== bPrefix) return aPrefix - bPrefix;
    
    // Ardından numara kısmına göre sırala
    const aNum = parseInt(a.replace(/[^\d]/g, ''));
    const bNum = parseInt(b.replace(/[^\d]/g, ''));
    return aNum - bNum;
  });
  
  const headers = ['Anket Tipi', 'Oluşturma Tarihi', 'İsim', 'Yaş', 'Cinsiyet', 'Eğitim', 'Gelir', ...sortedQuestionIds.filter(id => !['q0', 'q1', 'q2', 'q3', 'q4', 'qs2_0', 'qs2_1', 'qs2_2', 'qs2_3', 'qs2_4'].includes(id))];
  
  // CSV satırları oluştur
  const rows = responses.map(response => {
    const row = {
      'Anket Tipi': response.surveyType === 'mikro' ? 'Mikro' : 'Makro',
      'Oluşturma Tarihi': response.timestamp,
      'İsim': response.answers[response.surveyType === 'mikro' ? 'q0' : 'qs2_0'],
      'Yaş': response.answers[response.surveyType === 'mikro' ? 'q1' : 'qs2_1'],
      'Cinsiyet': response.answers[response.surveyType === 'mikro' ? 'q2' : 'qs2_2'],
      'Eğitim': response.answers[response.surveyType === 'mikro' ? 'q3' : 'qs2_3'],
      'Gelir': response.answers[response.surveyType === 'mikro' ? 'q4' : 'qs2_4'],
    };
    
    // Diğer tüm soruları ekle
    sortedQuestionIds.forEach(id => {
      if (!['q0', 'q1', 'q2', 'q3', 'q4', 'qs2_0', 'qs2_1', 'qs2_2', 'qs2_3', 'qs2_4'].includes(id)) {
        row[id] = response.answers[id] || '';
      }
    });
    
    return row;
  });
  
  // CSV formatında birleştir
  const csvContent = [
    headers.join(','),
    ...rows.map(row => headers.map(header => row[header] || '').join(','))
  ].join('\n');
  
  return csvContent;
};

// Dışa aktarma
module.exports = {
  generateFakeSurveyResponses,
  convertToCSV
}; 