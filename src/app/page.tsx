"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const startSurvey = () => {
    setIsStarting(true);
    router.push("/survey");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6"> Bilimsel Araştırma</h1>

        <div className="mb-8 text-gray-600">
          <p className="mb-4">
            Çalışmadaki anket formu, TikTok platformu kullanım amacı ve platformda yer alan influencerların takipçileri üzerindeki etkilerinin belirlenmesi amacıyla hazırlanmıştır.
          </p>
          <p className="mb-4">
            Vereceğiniz cevaplar yalnızca bilimsel amaçlarla kullanılacak olup, üçüncü kişilerle kesinlikle paylaşılmayacaktır.
          </p>
          <p className="mb-4">
            Katılımınız için teşekkür ederiz.
          </p>
        </div>

        <button
          onClick={startSurvey}
          disabled={isStarting}
          className={`py-3 px-8 text-white font-medium rounded-lg transition-colors w-full sm:w-auto ${isStarting
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
            }`}
        >
          {isStarting ? "Başlatılıyor..." : "Ankete Başla"}
        </button>
      </div>
    </div>
  );
}
