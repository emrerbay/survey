#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { generateFakeSurveyResponses } from '../utils/generateFakeSurveyResponses.js';

// Firebase yapılandırması - Projenin kendi yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDainJytfyn_E1eKDK1_jynBJvULmHn7lw",
  authDomain: "survey-4fa3d.firebaseapp.com",
  projectId: "survey-4fa3d",
  storageBucket: "survey-4fa3d.firebasestorage.app",
  messagingSenderId: "986118444786",
  appId: "1:986118444786:web:e6d88024a333e440cb626b",
  measurementId: "G-R1WV8V9CC8"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Komut satırı argümanlarını işle
const args = process.argv.slice(2);
const countArg = args.find(arg => arg.startsWith('--count='));
const count = countArg ? parseInt(countArg.split('=')[1]) : 100;
const batchSize = 25; // Her seferde kaç kayıt yüklenecek

console.log(`Generating ${count} fake survey responses and uploading to Firebase...`);

// Anket yanıtlarını oluştur
const responses = generateFakeSurveyResponses(count);

// Firebase'e veri yükleme fonksiyonu
async function uploadToFirebase(responses) {
  let successCount = 0;
  let failCount = 0;
  
  console.log(`Uploading ${responses.length} survey responses to Firebase in batches of ${batchSize}...`);
  
  // Batch'ler halinde verileri yükle
  for (let i = 0; i < responses.length; i += batchSize) {
    const batch = responses.slice(i, i + batchSize);
    const promises = batch.map(async (response) => {
      try {
        // Anket tipine göre ön ek belirle
        const idPrefix = response.surveyType === "mikro" ? "q" : "qs2_";
        
        // Firestore'a kaydedilecek veri
        const surveyData = {
          surveyId: response.surveyType === "mikro" ? "survey1" : "survey2",
          createdAt: new Date(response.timestamp),
          
          // Demografik bilgileri temizle ve doğru formatta ekle
          name: response.answers[`${idPrefix}0`] || "",
          age: response.answers[`${idPrefix}1`] || "",
          gender: response.answers[`${idPrefix}2`] || "",
          education: response.answers[`${idPrefix}3`] || "",
          income: response.answers[`${idPrefix}4`] || "",
          
          // Tüm cevapları ekle
          answers: { ...response.answers }
        };
        
        // Firebase'e kaydet
        await addDoc(collection(db, "survey-responses"), surveyData);
        successCount++;
        
        // İlerlemeyi göster
        if (successCount % 10 === 0 || successCount === responses.length) {
          console.log(`Progress: ${successCount}/${responses.length} responses uploaded`);
        }
      } catch (error) {
        console.error(`Error uploading response: ${error.message}`);
        failCount++;
      }
    });
    
    // Batch'i bekle
    await Promise.all(promises);
  }
  
  return { successCount, failCount };
}

// Ana fonksiyon
async function main() {
  try {
    const result = await uploadToFirebase(responses);
    
    console.log("\nUpload Summary:");
    console.log(`Total responses: ${count}`);
    console.log(`Successfully uploaded: ${result.successCount}`);
    console.log(`Failed to upload: ${result.failCount}`);
    
    // İstatistikler
    const mikroCount = responses.filter(r => r.surveyType === 'mikro').length;
    const makroCount = responses.filter(r => r.surveyType === 'makro').length;
    
    console.log('\nStatistics:');
    console.log(`Mikro influencer surveys: ${mikroCount} (${(mikroCount/count*100).toFixed(1)}%)`);
    console.log(`Makro influencer surveys: ${makroCount} (${(makroCount/count*100).toFixed(1)}%)`);
    
    // Dikkat kontrolü sorularını doğru cevaplayanların sayısını kontrol et
    const correctAttentionChecks = responses.filter(r => {
      const idPrefix = r.surveyType === 'mikro' ? 'q' : 'qs2_';
      
      // İlk dikkat kontrolü sorusu (q21 veya qs2_21) "2" olmalı
      const firstCheck = r.answers[`${idPrefix}21`] === 2;
      
      // İkinci dikkat kontrolü sorusu (q45 veya qs2_45) "5" olmalı
      const secondCheck = r.surveyType === 'mikro' 
        ? r.answers[`${idPrefix}45`] === 5
        : r.answers[`${idPrefix}45`] === 5;
        
      return firstCheck && secondCheck;
    }).length;
    
    console.log(`Correct attention check responses: ${correctAttentionChecks} (${(correctAttentionChecks/count*100).toFixed(1)}%)`);
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Scripti çalıştır
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Unexpected error:", error);
    process.exit(1);
  }); 