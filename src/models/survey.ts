export interface Answer {
  id: string;
  text: string;
  value: string | number;
}

export interface Question {
  id: string;
  text: string;
  type: "radio" | "select" | "likert" | "attention-check" | "text";
  answers: Answer[];
  required?: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

// Anket 1'in soruları
export const survey1: Survey = {
  id: "survey1",
  title: "TikTok Kullanımı Anketi",
  questions: [
    {
      id: "q0",
      text: "Adınız Soyadınız",
      type: "text",
      required: true,
      answers: [],
    },
    {
      id: "q1",
      text: "Yaş Aralığınız?",
      type: "radio",
      required: true,
      answers: [
        { id: "q1a1", text: "18 – 24", value: "18-24" },
        { id: "q1a2", text: "25 – 34", value: "25-34" },
        { id: "q1a3", text: "35 – 44", value: "35-44" },
        { id: "q1a4", text: "45 – 54", value: "45-54" },
        { id: "q1a5", text: "55 +", value: "55+" },
      ],
    },
    {
      id: "q2",
      text: "Cinsiyetiniz?",
      type: "radio",
      required: true,
      answers: [
        { id: "q2a1", text: "Kadın", value: "female" },
        { id: "q2a2", text: "Erkek", value: "male" },
      ],
    },
    {
      id: "q3",
      text: "Eğitim Durumunuz?",
      type: "radio",
      required: true,
      answers: [
        { id: "q3a1", text: "İlkokul", value: "primary" },
        { id: "q3a2", text: "Ortaokul", value: "middle" },
        { id: "q3a3", text: "Lise", value: "high" },
        {
          id: "q3a4",
          text: "Ön lisans (2 yıllık üniversite)",
          value: "associate",
        },
        { id: "q3a5", text: "Lisans (4 yıllık üniversite)", value: "bachelor" },
        { id: "q3a6", text: "Yüksek Lisans", value: "master" },
        { id: "q3a7", text: "Doktora", value: "doctorate" },
      ],
    },
    {
      id: "q4",
      text: "Aylık Kişisel Geliriniz Nedir?",
      type: "radio",
      required: true,
      answers: [
        { id: "q4a1", text: "Gelirim yok", value: "no-income" },
        { id: "q4a2", text: "1 – 9.999 TL", value: "1-9999" },
        { id: "q4a3", text: "10.000 – 24.999 TL", value: "10000-24999" },
        { id: "q4a4", text: "25.000 – 49.999 TL", value: "25000-49999" },
        { id: "q4a5", text: "50.000 – 74.999 TL", value: "50000-74999" },
        { id: "q4a6", text: "75.000 – 99.999 TL", value: "75000-99999" },
        { id: "q4a7", text: "100.000 TL ve üzeri", value: "100000+" },
        { id: "q4a8", text: "Cevap vermek istemiyorum", value: "no-answer" },
      ],
    },
    // TikTok kullanım açıklaması
    {
      id: "q4_tiktok_info",
      text: "TikTok'ta aşağıdaki faaliyetleri ne sıklıkla gerçekleştirdiğinizi belirtiniz: (Hiçbir zaman, Nadiren, Bazen, Sık sık, Her zaman)",
      type: "text",
      required: false,
      answers: [],
    },
    // Likert ölçeği soruları 5-16
    {
      id: "q5",
      text: "TikTok'ta içerik paylaşıyorum.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q5a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q6",
      text: "Videolara, yorumlara veya gönderilere yorum yapıyorum.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q6a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q7",
      text: "TikTok üzerinden mesajlaşıyorum (DM, sohbet).",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q7a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q8",
      text: "Başkalarının ne yaptığına bakıyorum.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q8a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q9",
      text: "Canlı yayınlara katılıyor veya canlı yayın açıyorum.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q9a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q10",
      text: "Fotoğraf paylaşıyorum",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q10a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q11",
      text: "Başkalarını fotoğraflara etiketliyorum",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q11a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q12",
      text: "Başkalarının fotoğraflarına bakıyorum.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q12a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q13",
      text: "Video paylaşıyorum.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q13a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q14",
      text: "Videolarda kişileri etiketliyorum.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q14a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q15",
      text: "For you (Senin için) içeriklerinde pasif şekilde geziyorum (beğeni veya yorum yapmadan).",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q15a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q16",
      text: "For you (Senin için) içeriklerinde aktif şekilde katılıyorum (beğeni yapıyor, yorum yazıyor, paylaşıyorum).",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q16a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    {
      id: "q17",
      text: "Takip ettiğim kişilerin profillerini inceliyorum.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q17a${i + 1}`,
        text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][i],
        value: i + 1,
      })),
    },
    // Likert ölçeği katılım soruları 18-61
    {
      id: "q18",
      text: "TikTok kullanmak, gerçek dünyadan uzaklaşmamı sağlar.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q18a${i + 1}`,
        text: [
          "Kesinlikle katılmıyorum",
          "Katılmıyorum",
          "Kararsızım",
          "Katılıyorum",
          "Kesinlikle katılıyorum",
        ][i],
        value: i + 1,
      })),
    },
    {
      id: "q19",
      text: "TikTok kullanmak, sorunlarım ve baskılarım karşısında kaçış sağlamama yardımcı olur.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q19a${i + 1}`,
        text: [
          "Kesinlikle katılmıyorum",
          "Katılmıyorum",
          "Kararsızım",
          "Katılıyorum",
          "Kesinlikle katılıyorum",
        ][i],
        value: i + 1,
      })),
    },
    {
      id: "q20",
      text: "TikTok kullanmak, hoş olmayan ve can sıkıcı şeylerden uzaklaşmamı sağlar.",
      type: "likert",
      required: true,
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: `q20a${i + 1}`,
        text: [
          "Kesinlikle katılmıyorum",
          "Katılmıyorum",
          "Kararsızım",
          "Katılıyorum",
          "Kesinlikle katılıyorum",
        ][i],
        value: i + 1,
      })),
    },
    generateAttentionCheckQuestion(
      21,
      'Bu soruyu dikkatlice okuyorsanız lütfen "2 = Katılmıyorum" seçeneğini işaretleyin.'
    ),
  ],
};

// Geriye kalan soruları oluşturmak için yardımcı fonksiyon
export function generateLikertQuestion(
  id: number,
  text: string,
  type: "general" | "agreement" = "agreement"
): Question {
  const options =
    type === "general"
      ? ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"]
      : [
          "Kesinlikle katılmıyorum",
          "Katılmıyorum",
          "Kararsızım",
          "Katılıyorum",
          "Kesinlikle katılıyorum",
        ];

  return {
    id: `q${id}`,
    text,
    type: "likert",
    required: true,
    answers: Array.from({ length: 5 }, (_, i) => ({
      id: `q${id}a${i + 1}`,
      text: options[i],
      value: i + 1,
    })),
  };
}

// Dikkat kontrolü soruları için yardımcı fonksiyon
export function generateAttentionCheckQuestion(
  id: number,
  text: string
): Question {
  return {
    id: `q${id}`,
    text,
    type: "attention-check" as const,
    required: true,
    answers: Array.from({ length: 5 }, (_, i) => ({
      id: `q${id}a${i + 1}`,
      text: [
        "Kesinlikle katılmıyorum",
        "Katılmıyorum",
        "Kararsızım",
        "Katılıyorum",
        "Kesinlikle katılıyorum",
      ][i],
      value: i + 1,
    })),
  };
}

// Kalan soruları ekleyelim
const remainingLikertQuestions: Question[] = [
  generateLikertQuestion(
    22,
    "TikTok kullanmak, kendimi farklı bir dünyadaymış gibi hissetmeme neden olur."
  ),
  generateLikertQuestion(23, "TikTok kullanmak benim günlük alışkanlığım."),
  generateLikertQuestion(24, "Boş zamanım olduğunda TikTok'a göz atarım."),
  generateLikertQuestion(
    25,
    "Geç saat olsa bile, yatmadan önce TikTok içeriklerine bakarım."
  ),
  generateLikertQuestion(26, "TikTok'u rahatlamak için sıkça kullanırım."),
  generateLikertQuestion(
    27,
    "TikTok'ta aldığım beğeni ve yorumlar bana tatmin duygusu verir."
  ),
  generateLikertQuestion(
    28,
    "TikTok'ta aldığım destek ve teşvik benim için çok önemlidir."
  ),
  generateLikertQuestion(
    29,
    "TikTok kullanırken arkadaşlarımla olan ilişkilerimden memnun olurum."
  ),
  generateLikertQuestion(
    30,
    "Gerçek dünyaya kıyasla TikTok kullanırken daha rahat hissederim."
  ),
  generateLikertQuestion(
    31,
    "TikTok kullanamadığımda kendimi sıkılmış hissederim."
  ),
  generateLikertQuestion(
    32,
    "Gerçek dünyaya kıyasla TikTok'ta sosyalleşirken daha mutlu olurum."
  ),
  generateLikertQuestion(
    33,
    "TikTok kullanamadığımda kendimi endişeli hissederim."
  ),
  generateLikertQuestion(
    34,
    "Gerçek dünyaya kıyasla TikTok'ta sosyalleşmek bana daha anlamlı geliyor."
  ),
  generateLikertQuestion(
    35,
    "TikTok'ta etkileşimde bulunmak, sosyal çevremle daha fazla etkileşimde olduğumu hissettiriyor."
  ),
  generateLikertQuestion(
    36,
    "Pahalı evlere, arabalara ve kıyafetlere sahip insanlara hayranlık duyarım."
  ),
  generateLikertQuestion(
    37,
    "Sahip olduğum şeyler, hayatta ne kadar başarılı olduğum hakkında çok şey anlatır."
  ),
  generateLikertQuestion(
    38,
    "Bir şeyler satın almak bana büyük bir keyif verir."
  ),
  generateLikertQuestion(39, "Hayatımda bolca lüks olmasını severim."),
  generateLikertQuestion(
    40,
    "Sahip olmadığım bazı şeylere sahip olsaydım hayatım daha iyi olurdu."
  ),
  generateLikertQuestion(
    41,
    "Daha fazla şey satın alabilecek gücüm olsaydı daha mutlu olurdum."
  ),

  // Mikro influencer açıklamasını ekle
  {
    id: "q41_info",
    text: "Mikro-influencer, genellikle 10.000 ila 100.000 arası takipçiye sahip olan sosyal medya kullanıcılarını ifade eder.",
    type: "text",
    required: false,
    answers: [],
  },

  generateLikertQuestion(
    42,
    "Mikro influencer'ın içerikleriyle ilgili olarak sık sık geliştirme önerilerinde bulunurum."
  ),
  generateLikertQuestion(
    43,
    "Kişisel ihtiyaçlarımı mikro influencer'a sık sık ifade ederim."
  ),
  generateLikertQuestion(
    44,
    "Mikro influencer ile birlikte, karşılaştığım sorunlara çözüm bulduğum olur."
  ),
  generateLikertQuestion(
    45,
    "Mikro influencer yeni içerikler oluştururken aktif olarak sürece dahil olurum."
  ),
  generateLikertQuestion(
    46,
    "Mikro influencer, takipçileriyle birlikte çözümler üretmeye teşvik eder."
  ),
  generateAttentionCheckQuestion(
    47,
    'Lütfen bu soruda "5 = Kesinlikle katılıyorum" seçeneğini işaretleyiniz'
  ),
  generateLikertQuestion(
    48,
    "Mikro influencer veya takipçileri, birbirlerine karşı öfkesini kontrol edemez."
  ),
  generateLikertQuestion(
    49,
    "Mikro influencer veya takipçileri birbirlerine karşı uygunsuz beden dili kullanır."
  ),
  generateLikertQuestion(
    50,
    "Mikro influencer veya takipçilerini birbirlerini sözlü olarak tehdit eder."
  ),
  generateLikertQuestion(
    51,
    "Mikro influencer'ın veya takipçilerinin sözleri, bazı takipçilerin kendilerini dışlanmış veya ayrımcılığa uğramış hissetmesine neden olur."
  ),
  generateLikertQuestion(
    52,
    "Mikro influencer veya takipçileri, birbirlerine karşı uygunsuz ifadeler kullanarak tacizde bulunur."
  ),
  generateLikertQuestion(
    53,
    "Bazı takipçiler mikro influencer'dan mantıksız taleplerde bulunur."
  ),
  generateLikertQuestion(
    54,
    "Bazı takipçiler, influencer'ın içerik süreciyle iş birliği yapmaz/beğenmez."
  ),
  generateLikertQuestion(
    55,
    "Bazı takipçiler, yaşanan sorunların sorumluluğunu mikro influencer'a yükler."
  ),
  generateLikertQuestion(
    56,
    "Bazı takipçiler, mikro-influencer'ın dijital içeriklerine kaba şekilde yaklaşır."
  ),
  generateLikertQuestion(
    57,
    "Bazı takipçiler, influencer tarafından sunulan içerik ya da kampanyaları kötüye kullanır."
  ),
  generateLikertQuestion(
    58,
    "Takip ettiğim mikro-influencerların önerdiği ürünleri satın alırım"
  ),
  generateLikertQuestion(
    59,
    "Mikro-influencerların sosyal medya hesaplarında tanıttığı ürünleri satın alma isteği duyarım"
  ),
  generateLikertQuestion(
    60,
    "Güvendiğim mikro-influencerların desteklediği ürünleri satın alma olasılığım yüksektir"
  ),
  generateLikertQuestion(
    61,
    "Mikro-influencerların kişisel deneyimlerine dayanarak önerdiği ürünleri satın almayı planlıyorum"
  ),
];

// Kalan soruları ekle
survey1.questions = [...survey1.questions, ...remainingLikertQuestions];

// Anket 2 için içeriği oluşturalım
export const survey2: Survey = {
  id: "survey2",
  title: "Makro Influencer Anketi",
  description:
    "Bu anket, makro influencer'lar hakkında araştırma yapmak için tasarlanmıştır.",
  questions: [
    {
      id: "qs2_0",
      text: "Adınız Soyadınız",
      type: "text",
      required: true,
      answers: [],
    },
    {
      id: "qs2_1",
      text: "Yaş Aralığınız?",
      type: "radio",
      required: true,
      answers: [
        { id: "qs2_1a1", text: "18 – 24", value: "18-24" },
        { id: "qs2_1a2", text: "25 – 34", value: "25-34" },
        { id: "qs2_1a3", text: "35 – 44", value: "35-44" },
        { id: "qs2_1a4", text: "45 – 54", value: "45-54" },
        { id: "qs2_1a5", text: "55 +", value: "55+" },
      ],
    },
    {
      id: "qs2_2",
      text: "Cinsiyetiniz?",
      type: "radio",
      required: true,
      answers: [
        { id: "qs2_2a1", text: "Kadın", value: "female" },
        { id: "qs2_2a2", text: "Erkek", value: "male" },
      ],
    },
    {
      id: "qs2_3",
      text: "Eğitim Durumunuz?",
      type: "radio",
      required: true,
      answers: [
        { id: "qs2_3a1", text: "İlkokul", value: "primary" },
        { id: "qs2_3a2", text: "Ortaokul", value: "middle" },
        { id: "qs2_3a3", text: "Lise", value: "high" },
        {
          id: "qs2_3a4",
          text: "Ön lisans (2 yıllık üniversite)",
          value: "associate",
        },
        {
          id: "qs2_3a5",
          text: "Lisans (4 yıllık üniversite)",
          value: "bachelor",
        },
        { id: "qs2_3a6", text: "Yüksek Lisans", value: "master" },
        { id: "qs2_3a7", text: "Doktora", value: "doctorate" },
      ],
    },
    {
      id: "qs2_4",
      text: "Aylık Kişisel Geliriniz Nedir?",
      type: "radio",
      required: true,
      answers: [
        { id: "qs2_4a1", text: "Gelirim yok", value: "no-income" },
        { id: "qs2_4a2", text: "1 – 9.999 TL", value: "1-9999" },
        { id: "qs2_4a3", text: "10.000 – 24.999 TL", value: "10000-24999" },
        { id: "qs2_4a4", text: "25.000 – 49.999 TL", value: "25000-49999" },
        { id: "qs2_4a5", text: "50.000 – 74.999 TL", value: "50000-74999" },
        { id: "qs2_4a6", text: "75.000 – 99.999 TL", value: "75000-99999" },
        { id: "qs2_4a7", text: "100.000 TL ve üzeri", value: "100000+" },
        { id: "qs2_4a8", text: "Cevap vermek istemiyorum", value: "no-answer" },
      ],
    },
    // TikTok kullanım açıklaması
    {
      id: "qs2_4_tiktok_info",
      text: "TikTok'ta aşağıdaki faaliyetleri ne sıklıkla gerçekleştirdiğinizi belirtiniz: (Hiçbir zaman, Nadiren, Bazen, Sık sık, Her zaman)",
      type: "text",
      required: false,
      answers: [],
    },
  ],
};

// TikTok kullanım alışkanlıkları soruları (5-17)
const tiktokHabitsQuestions = Array.from({ length: 13 }, (_, i) => {
  const questionId = i + 5;
  return {
    id: `qs2_${questionId}`,
    text: [
      "TikTok'ta içerik paylaşıyorum.",
      "Videolara, yorumlara veya gönderilere yorum yapıyorum.",
      "TikTok üzerinden mesajlaşıyorum (DM, sohbet).",
      "Başkalarının ne yaptığına bakıyorum.",
      "Canlı yayınlara katılıyor veya canlı yayın açıyorum.",
      "Fotoğraf paylaşıyorum",
      "Başkalarını fotoğraflara etiketliyorum",
      "Başkalarının fotoğraflarına bakıyorum.",
      "Video paylaşıyorum.",
      "Videolarda kişileri etiketliyorum.",
      "For you (Senin için) içeriklerinde pasif şekilde geziyorum (beğeni veya yorum yapmadan).",
      "For you (Senin için) içeriklerinde aktif şekilde katılıyorum (beğeni yapıyor, yorum yazıyor, paylaşıyorum).",
      "Takip ettiğim kişilerin profillerini inceliyorum.",
    ][i],
    type: "likert" as const,
    required: true,
    answers: Array.from({ length: 5 }, (_, j) => ({
      id: `qs2_${questionId}a${j + 1}`,
      text: ["Hiçbir zaman", "Nadiren", "Bazen", "Sık sık", "Her zaman"][j],
      value: j + 1,
    })),
  };
});

// TikTok ve alışveriş-hayat soruları (18-41)
const tiktokLifestyleQuestions = Array.from({ length: 24 }, (_, i) => {
  const questionId = i + 18;
  const questionText = [
    "TikTok kullanmak, gerçek dünyadan uzaklaşmamı sağlar.",
    "TikTok kullanmak, sorunlarım ve baskılarım karşısında kaçış sağlamama yardımcı olur.",
    "TikTok kullanmak, hoş olmayan ve can sıkıcı şeylerden uzaklaşmamı sağlar.",
    'Bu soruyu dikkatlice okuyorsanız lütfen "2 = Katılmıyorum" seçeneğini işaretleyin.',
    "TikTok kullanmak, kendimi farklı bir dünyadaymış gibi hissetmeme neden olur.",
    "TikTok kullanmak benim günlük alışkanlığım.",
    "Boş zamanım olduğunda TikTok'a göz atarım.",
    "Geç saat olsa bile, yatmadan önce TikTok içeriklerine bakarım.",
    "TikTok'u rahatlamak için sıkça kullanırım.",
    "TikTok'ta aldığım beğeni ve yorumlar bana tatmin duygusu verir.",
    "TikTok'ta aldığım destek ve teşvik benim için çok önemlidir.",
    "TikTok kullanırken arkadaşlarımla olan ilişkilerimden memnun olurum.",
    "Gerçek dünyaya kıyasla TikTok kullanırken daha rahat hissederim.",
    "TikTok kullanamadığımda kendimi sıkılmış hissederim.",
    "Gerçek dünyaya kıyasla TikTok'ta sosyalleşirken daha mutlu olurum.",
    "TikTok kullanamadığımda kendimi endişeli hissederim.",
    "Gerçek dünyaya kıyasla TikTok'ta sosyalleşmek bana daha anlamlı geliyor.",
    "TikTok'ta etkileşimde bulunmak, sosyal çevremle daha fazla etkileşimde olduğumu hissettiriyor.",
    "Pahalı evlere, arabalara ve kıyafetlere sahip insanlara hayranlık duyarım.",
    "Sahip olduğum şeyler, hayatta ne kadar başarılı olduğum hakkında çok şey anlatır.",
    "Bir şeyler satın almak bana büyük bir keyif verir.",
    "Hayatımda bolca lüks olmasını severim.",
    "Sahip olmadığım bazı şeylere sahip olsaydım hayatım daha iyi olurdu.",
    "Daha fazla şey satın alabilecek gücüm olsaydı daha mutlu olurdum.",
  ][i];

  if (questionId === 21) {
    return {
      id: `qs2_${questionId}`,
      text: questionText,
      type: "attention-check" as const,
      required: true,
      answers: Array.from({ length: 5 }, (_, j) => ({
        id: `qs2_${questionId}a${j + 1}`,
        text: [
          "Kesinlikle katılmıyorum",
          "Katılmıyorum",
          "Kararsızım",
          "Katılıyorum",
          "Kesinlikle katılıyorum",
        ][j],
        value: j + 1,
      })),
    };
  }

  return {
    id: `qs2_${questionId}`,
    text: questionText,
    type: "likert" as const,
    required: true,
    answers: Array.from({ length: 5 }, (_, j) => ({
      id: `qs2_${questionId}a${j + 1}`,
      text: [
        "Kesinlikle katılmıyorum",
        "Katılmıyorum",
        "Kararsızım",
        "Katılıyorum",
        "Kesinlikle katılıyorum",
      ][j],
      value: j + 1,
    })),
  };
});

// Makro influencer soruları (42-61)
const macroInfluencerQuestions = Array.from({ length: 20 }, (_, i) => {
  const questionId = i + 42;
  const questionText = [
    "Makro influencer'ın içerikleriyle ilgili olarak sık sık geliştirme önerilerinde bulunurum.",
    "Kişisel ihtiyaçlarımı makro influencer'a sık sık ifade ederim.",
    "Makro influencer ile birlikte, karşılaştığım sorunlara çözüm bulduğum olur.",
    "Makro influencer yeni içerikler oluştururken aktif olarak sürece dahil olurum.",
    "Makro influencer, takipçileriyle birlikte çözümler üretmeye teşvik eder.",
    'Lütfen bu soruda "5 = Kesinlikle katılıyorum" seçeneğini işaretleyiniz',
    "Makro influencer veya takipçileri, birbirlerine karşı öfkesini kontrol edemez.",
    "Makro influencer veya takipçileri birbirlerine karşı uygunsuz beden dili kullanır.",
    "Makro influencer veya takipçilerini birbirlerini sözlü olarak tehdit eder.",
    "Makro influencer'ın veya takipçilerinin sözleri, bazı takipçilerin kendilerini dışlanmış veya ayrımcılığa uğramış hissetmesine neden olur.",
    "Makro influencer veya takipçileri, birbirlerine karşı uygunsuz ifadeler kullanarak tacizde bulunur.",
    "Bazı takipçiler makro influencer'dan mantıksız taleplerde bulunur.",
    "Bazı takipçiler, influencer'ın içerik süreciyle iş birliği yapmaz/beğenmez.",
    "Bazı takipçiler, yaşanan sorunların sorumluluğunu makro influencer'a yükler.",
    "Bazı takipçiler, makro-influencer'ın dijital içeriklerine kaba şekilde yaklaşır.",
    "Bazı takipçiler, influencer tarafından sunulan içerik ya da kampanyaları kötüye kullanır.",
    "Takip ettiğim makro-influencerların önerdiği ürünleri satın alırım",
    "Makro-influencerların sosyal medya hesaplarında tanıttığı ürünleri satın alma isteği duyarım",
    "Güvendiğim makro-influencerların desteklediği ürünleri satın alma olasılığım yüksektir",
    "Makro-influencerların kişisel deneyimlerine dayanarak önerdiği ürünleri satın almayı planlıyorum",
  ][i];

  if (questionId === 47) {
    return {
      id: `qs2_${questionId}`,
      text: questionText,
      type: "attention-check" as const,
      required: true,
      answers: Array.from({ length: 5 }, (_, j) => ({
        id: `qs2_${questionId}a${j + 1}`,
        text: [
          "Kesinlikle katılmıyorum",
          "Katılmıyorum",
          "Kararsızım",
          "Katılıyorum",
          "Kesinlikle katılıyorum",
        ][j],
        value: j + 1,
      })),
    };
  }

  return {
    id: `qs2_${questionId}`,
    text: questionText,
    type: "likert" as const,
    required: true,
    answers: Array.from({ length: 5 }, (_, j) => ({
      id: `qs2_${questionId}a${j + 1}`,
      text: [
        "Kesinlikle katılmıyorum",
        "Katılmıyorum",
        "Kararsızım",
        "Katılıyorum",
        "Kesinlikle katılıyorum",
      ][j],
      value: j + 1,
    })),
  };
});

// İkinci anket için tüm soruları birleştirelim
survey2.questions = [
  ...survey2.questions,
  ...tiktokHabitsQuestions,
  ...tiktokLifestyleQuestions,
  // Makro influencer açıklamasını ekle
  {
    id: "qs2_macro_info",
    text: "Makro-influencer, genellikle 100.000 üzerinde takipçiye sahip olan sosyal medya kullanıcılarını ifade eder.",
    type: "text",
    required: false,
    answers: [],
  },
  ...macroInfluencerQuestions,
];

// Tüm anketleri içeren koleksiyon
export const surveys: Survey[] = [survey1, survey2];

// Random anket seçme fonksiyonu
export function getRandomSurvey(): Survey {
  const randomIndex = Math.floor(Math.random() * surveys.length);
  return surveys[randomIndex];
}
