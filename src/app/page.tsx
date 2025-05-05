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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Anket Uygulaması</h1>

        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            Bu anket uygulaması TikTok kullanım alışkanlıklarını incelemek için tasarlanmıştır.
          </p>
          <p className="text-gray-600">
            Anket yaklaşık <span className="font-semibold">10-15 dakika</span> sürecektir.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Önemli Bilgiler</h2>
          <ul className="text-left text-gray-600 space-y-2 list-disc list-inside">
            <li>Ankete katılım tamamen gönüllüdür.</li>
            <li>Verdiğiniz bilgiler gizli tutulacak ve sadece bilimsel amaçlarla kullanılacaktır.</li>
            <li>Lütfen soruları dikkatlice okuyarak cevaplayınız.</li>
            <li>İlk 4 soru tek tek gösterilecek, sonraki sorular tek sayfada görüntülenecektir.</li>
          </ul>
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
