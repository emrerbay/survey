#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { generateFakeSurveyResponses, convertToCSV } = require('../utils/generateFakeSurveyResponses');

// Komut satırı argümanlarını işle
const args = process.argv.slice(2);
const countArg = args.find(arg => arg.startsWith('--count='));
const count = countArg ? parseInt(countArg.split('=')[1]) : 100;

console.log(`Generating ${count} fake survey responses...`);

// Anket yanıtlarını oluştur
const responses = generateFakeSurveyResponses(count);

// CSV'ye dönüştür
const csvContent = convertToCSV(responses);

// Çıktı dosyasını kaydet
const outputDir = path.join(__dirname, '../../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const now = new Date();
const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
const outputFile = path.join(outputDir, `anket_verileri_${timestamp}.csv`);

fs.writeFileSync(outputFile, csvContent, 'utf8');

console.log(`${count} anket yanıtı başarıyla oluşturuldu.`);
console.log(`CSV dosyası kaydedildi: ${outputFile}`);

// İstatistikler
const mikroCount = responses.filter(r => r.surveyType === 'mikro').length;
const makroCount = responses.filter(r => r.surveyType === 'makro').length;

console.log('\nİstatistikler:');
console.log(`Mikro influencer anketleri: ${mikroCount} (${(mikroCount/count*100).toFixed(1)}%)`);
console.log(`Makro influencer anketleri: ${makroCount} (${(makroCount/count*100).toFixed(1)}%)`);

// Dikkat kontrolü sorularını doğru cevaplayanların sayısını kontrol et
const correctAttentionChecks = responses.filter(r => {
  const idPrefix = r.surveyType === 'mikro' ? 'q' : 'qs2_';
  
  // İlk dikkat kontrolü sorusu (q21 veya qs2_21) "2" olmalı
  const firstCheck = r.answers[`${idPrefix}21`] === 2;
  
  // İkinci dikkat kontrolü sorusu (q45 veya qs2_47) "5" olmalı
  const secondCheck = r.surveyType === 'mikro' 
    ? r.answers[`${idPrefix}45`] === 5
    : r.answers[`${idPrefix}45`] === 5;
    
  return firstCheck && secondCheck;
}).length;

console.log(`Dikkat kontrolü sorularını doğru cevaplayanlar: ${correctAttentionChecks} (${(correctAttentionChecks/count*100).toFixed(1)}%)`);

// Rastgele 5 örnek yanıt göster
console.log('\nRastgele 5 örnek yanıt:');
const sampleResponses = responses.sort(() => 0.5 - Math.random()).slice(0, 5);
sampleResponses.forEach((response, index) => {
  console.log(`\n${index + 1}. ${response.answers[response.surveyType === 'mikro' ? 'q0' : 'qs2_0']} (${response.surveyType})`);
  console.log(`   Yaş: ${response.answers[response.surveyType === 'mikro' ? 'q1' : 'qs2_1']}`);
  console.log(`   Cinsiyet: ${response.answers[response.surveyType === 'mikro' ? 'q2' : 'qs2_2']}`);
  console.log(`   Eğitim: ${response.answers[response.surveyType === 'mikro' ? 'q3' : 'qs2_3']}`);
  
  // Tuzak soruları kontrol et
  const idPrefix = response.surveyType === 'mikro' ? 'q' : 'qs2_';
  const firstAttentionCheck = response.answers[`${idPrefix}21`] === 2 ? '✓' : '✗';
  const secondAttentionCheck = response.surveyType === 'mikro'
    ? response.answers[`${idPrefix}45`] === 5 ? '✓' : '✗'
    : response.answers[`${idPrefix}45`] === 5 ? '✓' : '✗';
  
  console.log(`   Dikkat kontrolleri: İlk (${firstAttentionCheck}), İkinci (${secondAttentionCheck})`);
}); 