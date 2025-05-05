import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

// Anket cevaplarını Firestore'a kaydeden fonksiyon
export const saveSurveyResponses = async (
  surveyId: string,
  answers: Record<string, string | number>
) => {
  try {
    // Cevapları ve ek bilgileri içeren belgeyi oluştur
    const surveyData = {
      surveyId,
      answers,
      createdAt: serverTimestamp(), // Sunucu zaman damgası
    };

    // 'survey-responses' koleksiyonuna belgeyi ekle
    const docRef = await addDoc(collection(db, "survey-responses"), surveyData);
    console.log("Anket cevapları başarıyla kaydedildi. Belge ID:", docRef.id);

    return docRef.id;
  } catch (error) {
    console.error("Anket cevapları kaydedilirken hata oluştu:", error);
    throw error;
  }
};
