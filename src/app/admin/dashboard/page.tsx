"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { utils, write } from "xlsx";
import { useRouter } from "next/navigation";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    ChartData
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';

// Chart.js bileşenlerini kaydet
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Anket yanıtlarını daha kolay kullanmak için interface
interface SurveyResponse {
    id: string;
    surveyId: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | Date;
    answers: Record<string, string | number>;
}

// Chart veri tipleri
interface ChartDataType extends ChartData<'pie' | 'bar' | 'doughnut' | 'line'> {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string | string[];
        borderColor: string | string[];
        borderWidth?: number;
        fill?: boolean;
        tension?: number;
    }[];
}

export default function AdminDashboard() {
    const router = useRouter();
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [exporting, setExporting] = useState(false);
    const [genderData, setGenderData] = useState<ChartDataType | null>(null);
    const [ageData, setAgeData] = useState<ChartDataType | null>(null);
    const [surveyTypeData, setSurveyTypeData] = useState<ChartDataType | null>(null);
    const [dailyResponsesData, setDailyResponsesData] = useState<ChartDataType | null>(null);
    const [questionResponseData, setQuestionResponseData] = useState<ChartDataType | null>(null);

    // Sayfa yüklendiğinde Firebase'den verileri al
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "survey-responses"));
                const data: SurveyResponse[] = [];

                querySnapshot.forEach((doc) => {
                    const responseData = doc.data();
                    data.push({
                        id: doc.id,
                        surveyId: responseData.surveyId || "",
                        createdAt: responseData.createdAt ? new Date(responseData.createdAt.seconds * 1000) : new Date(),
                        answers: responseData.answers || {}
                    });
                });

                setResponses(data);
                prepareChartsData(data);
            } catch (err) {
                console.error("Veriler yüklenirken hata oluştu:", err);
                setError("Veriler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Grafik verilerini hazırla
    const prepareChartsData = (data: SurveyResponse[]) => {
        // 1. Cinsiyet dağılımı (Pie Chart)
        const genderCounts = {
            male: 0,
            female: 0,
            other: 0
        };

        data.forEach(response => {
            // q2 veya qs2_2 cinsiyeti temsil ediyor
            const gender = response.answers.q2 || response.answers.qs2_2;
            if (gender === "male") genderCounts.male++;
            else if (gender === "female") genderCounts.female++;
            else genderCounts.other++;
        });

        setGenderData({
            labels: ['Erkek', 'Kadın', 'Diğer'],
            datasets: [
                {
                    label: 'Cinsiyet Dağılımı',
                    data: [genderCounts.male, genderCounts.female, genderCounts.other],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1,
                },
            ],
        });

        // 2. Yaş aralığı dağılımı (Bar Chart)
        const ageCounts: Record<string, number> = {};

        data.forEach(response => {
            // q1 veya qs2_1 yaş aralığını temsil ediyor
            const age = String(response.answers.q1 || response.answers.qs2_1);
            if (age) {
                if (!ageCounts[age]) ageCounts[age] = 0;
                ageCounts[age]++;
            }
        });

        const ageLabels = Object.keys(ageCounts).sort();
        const ageCounts_values = ageLabels.map(label => ageCounts[label]);

        setAgeData({
            labels: ageLabels,
            datasets: [
                {
                    label: 'Yaş Aralığı Dağılımı',
                    data: ageCounts_values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });

        // 3. Anket tipi dağılımı (Doughnut Chart)
        const surveyTypeCounts = {
            survey1: 0,
            survey2: 0
        };

        data.forEach(response => {
            if (response.surveyId === "survey1") surveyTypeCounts.survey1++;
            else if (response.surveyId === "survey2") surveyTypeCounts.survey2++;
        });

        setSurveyTypeData({
            labels: ['Mikro Influencer Anketi', 'Makro Influencer Anketi'],
            datasets: [
                {
                    label: 'Anket Tipi Dağılımı',
                    data: [surveyTypeCounts.survey1, surveyTypeCounts.survey2],
                    backgroundColor: [
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                },
            ],
        });

        // 4. Günlük yanıt sayısı (Line Chart)
        const responseDates: Record<string, number> = {};

        data.forEach(response => {
            const date = response.createdAt instanceof Date
                ? response.createdAt.toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];

            if (!responseDates[date]) responseDates[date] = 0;
            responseDates[date]++;
        });

        // Tarihleri sırala
        const sortedDates = Object.keys(responseDates).sort();
        const responsesByDate = sortedDates.map(date => responseDates[date]);

        setDailyResponsesData({
            labels: sortedDates,
            datasets: [
                {
                    label: 'Günlük Yanıt Sayısı',
                    data: responsesByDate,
                    fill: false,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1
                },
            ],
        });

        // 5. İlk anket sorusuna (q5 veya qs2_5) verilen yanıtların dağılımı
        const questionCounts: Record<string, number> = {};

        // Sadece Mikro Influencer anketini seçelim (q5 sorusu)
        data.filter(response => response.surveyId === "survey1").forEach(response => {
            const answer = String(response.answers.q5);
            if (answer) {
                if (!questionCounts[answer]) questionCounts[answer] = 0;
                questionCounts[answer]++;
            }
        });

        const questionLabels = Object.keys(questionCounts);
        const questionValues = questionLabels.map(label => questionCounts[label]);

        setQuestionResponseData({
            labels: questionLabels,
            datasets: [
                {
                    label: 'Sosyal Medya Kullanım Sıklığı',
                    data: questionValues,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        });
    };

    // Excel'e aktarma işlevi - TÜM ANKETLER
    const exportToExcel = () => {
        setExporting(true);

        try {
            // Düzleştirilmiş veriyi oluştur
            const flatData = responses.map(response => {
                // Temel alanları ekle
                const flatRow: Record<string, string | number | Date> = {
                    "Anket Tipi": response.surveyId === "survey1" ? "Mikro" : "Makro",
                    "Oluşturma Tarihi": response.createdAt instanceof Date
                        ? response.createdAt.toLocaleString("tr-TR")
                        : new Date().toLocaleString("tr-TR")
                };

                // Kişisel bilgileri ekle (ilk 5 soru özel isimlerle)
                const prefix = response.surveyId === "survey1" ? "q" : "qs2_";

                // İsim (0. soru)
                if (`${prefix}0` in response.answers) {
                    flatRow["İsim"] = response.answers[`${prefix}0`];
                }

                // Yaş (1. soru)
                if (`${prefix}1` in response.answers) {
                    flatRow["Yaş"] = response.answers[`${prefix}1`];
                }

                // Cinsiyet (2. soru)
                if (`${prefix}2` in response.answers) {
                    const gender = response.answers[`${prefix}2`];
                    flatRow["Cinsiyet"] = gender === "male" ? "Erkek" : gender === "female" ? "Kadın" : gender;
                }

                // Eğitim (3. soru)
                if (`${prefix}3` in response.answers) {
                    flatRow["Eğitim"] = response.answers[`${prefix}3`];
                }

                // Gelir (4. soru)
                if (`${prefix}4` in response.answers) {
                    flatRow["Gelir"] = response.answers[`${prefix}4`];
                }

                // Soru ID'lerini sıralama yardımcı fonksiyonu
                const getQuestionNumber = (key: string): number => {
                    // q ile başlayan sorular için (ör: q5)
                    if (key.startsWith('q') && key.length > 1) {
                        const numPart = key.substring(1);
                        if (!isNaN(parseInt(numPart))) {
                            return parseInt(numPart);
                        }
                    }

                    // qs2_ ile başlayan sorular için (ör: qs2_15)
                    if (key.startsWith('qs2_') && key.length > 4) {
                        const numPart = key.substring(4);
                        if (!isNaN(parseInt(numPart))) {
                            return parseInt(numPart);
                        }
                    }

                    // Diğer durumlar için
                    return Number.MAX_SAFE_INTEGER;
                };

                // Diğer tüm soruları sıralı olarak ekleyelim (5. sorudan itibaren Soru 1, Soru 2... diye)
                const remainingAnswers = Object.entries(response.answers)
                    .filter(([key]) => {
                        // Survey 1 için q5 ve üzeri olan sorular
                        if (response.surveyId === "survey1" && key.startsWith('q') && getQuestionNumber(key) > 4) {
                            return true;
                        }
                        // Survey 2 için qs2_5 ve üzeri olan sorular
                        if (response.surveyId === "survey2" && key.startsWith('qs2_') && getQuestionNumber(key) > 4) {
                            return true;
                        }
                        // _info soruları hariç
                        return !key.includes('_info') && !key.startsWith('q') && !key.startsWith('qs2_');
                    })
                    .sort((a, b) => {
                        const aNum = getQuestionNumber(a[0]);
                        const bNum = getQuestionNumber(b[0]);

                        // İkisi de sayı olarak çevrilebiliyorsa
                        if (aNum !== Number.MAX_SAFE_INTEGER && bNum !== Number.MAX_SAFE_INTEGER) {
                            return aNum - bNum;
                        }

                        // Sadece biri sayı olarak çevrilebiliyorsa
                        if (aNum !== Number.MAX_SAFE_INTEGER) return -1;
                        if (bNum !== Number.MAX_SAFE_INTEGER) return 1;

                        // İkisi de çevrilemiyorsa alfabetik sırala
                        return a[0].localeCompare(b[0]);
                    });

                // Sıralanmış soruları ekle
                let questionNumber = 1; // 5. sorudan sonrasını Soru 1'den başlat
                remainingAnswers.forEach(([, value]) => {
                    flatRow[`Soru ${questionNumber}`] = value;
                    questionNumber++;
                });

                return flatRow;
            });

            // Excel çalışma kitabı oluştur
            const worksheet = utils.json_to_sheet(flatData);
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, "Anket Yanıtları");

            // CSV formatında indir (Mac uyumluluğu için)
            const csvData = write(workbook, { bookType: "csv", type: "array" });
            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

            // İndirme bağlantısı oluştur
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `tum-anket-sonuclari-${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();

            // Temizlik
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Excel dışa aktarma sırasında hata oluştu:", err);
            setError("Dışa aktarma başarısız oldu. Lütfen tekrar deneyin.");
        } finally {
            setExporting(false);
        }
    };

    // Sadece Mikro anket yanıtlarını CSV olarak indirme
    const exportMicroToExcel = () => {
        setExporting(true);

        try {
            // Sadece Mikro anket yanıtlarını filtrele
            const microResponses = responses.filter(response => response.surveyId === "survey1");

            // Düzleştirilmiş veriyi oluştur
            const flatData = microResponses.map(response => {
                // Temel alanları ekle
                const flatRow: Record<string, string | number | Date> = {
                    "Oluşturma Tarihi": response.createdAt instanceof Date
                        ? response.createdAt.toLocaleString("tr-TR")
                        : new Date().toLocaleString("tr-TR")
                };

                // İsim (0. soru)
                if ("q0" in response.answers) {
                    flatRow["İsim"] = response.answers.q0;
                }

                // Yaş (1. soru)
                if ("q1" in response.answers) {
                    flatRow["Yaş"] = response.answers.q1;
                }

                // Cinsiyet (2. soru)
                if ("q2" in response.answers) {
                    const gender = response.answers.q2;
                    flatRow["Cinsiyet"] = gender === "male" ? "Erkek" : gender === "female" ? "Kadın" : gender;
                }

                // Eğitim (3. soru)
                if ("q3" in response.answers) {
                    flatRow["Eğitim"] = response.answers.q3;
                }

                // Gelir (4. soru)
                if ("q4" in response.answers) {
                    flatRow["Gelir"] = response.answers.q4;
                }

                // Soru ID'lerini sıralama yardımcı fonksiyonu
                const getQuestionNumber = (key: string): number => {
                    if (key.startsWith('q') && key.length > 1) {
                        const numPart = key.substring(1);
                        if (!isNaN(parseInt(numPart))) {
                            return parseInt(numPart);
                        }
                    }
                    return Number.MAX_SAFE_INTEGER;
                };

                // Diğer tüm soruları sıralı olarak ekleyelim (5. sorudan itibaren Soru 1, Soru 2... diye)
                const remainingAnswers = Object.entries(response.answers)
                    .filter(([key]) => {
                        // Survey 1 için q5 ve üzeri olan sorular
                        return key.startsWith('q') && getQuestionNumber(key) > 4 && !key.includes('_info');
                    })
                    .sort((a, b) => {
                        const aNum = getQuestionNumber(a[0]);
                        const bNum = getQuestionNumber(b[0]);
                        return aNum - bNum;
                    });

                // Sıralanmış soruları ekle
                let questionNumber = 1; // 5. sorudan sonrasını Soru 1'den başlat
                remainingAnswers.forEach(([, value]) => {
                    flatRow[`Soru ${questionNumber}`] = value;
                    questionNumber++;
                });

                return flatRow;
            });

            // Excel çalışma kitabı oluştur
            const worksheet = utils.json_to_sheet(flatData);
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, "Mikro Anket Yanıtları");

            // CSV formatında indir
            const csvData = write(workbook, { bookType: "csv", type: "array" });
            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

            // İndirme bağlantısı oluştur
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `mikro-anket-sonuclari-${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();

            // Temizlik
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Excel dışa aktarma sırasında hata oluştu:", err);
            setError("Dışa aktarma başarısız oldu. Lütfen tekrar deneyin.");
        } finally {
            setExporting(false);
        }
    };

    // Sadece Makro anket yanıtlarını CSV olarak indirme
    const exportMacroToExcel = () => {
        setExporting(true);

        try {
            // Sadece Makro anket yanıtlarını filtrele
            const macroResponses = responses.filter(response => response.surveyId === "survey2");

            // Düzleştirilmiş veriyi oluştur
            const flatData = macroResponses.map(response => {
                // Temel alanları ekle
                const flatRow: Record<string, string | number | Date> = {
                    "Oluşturma Tarihi": response.createdAt instanceof Date
                        ? response.createdAt.toLocaleString("tr-TR")
                        : new Date().toLocaleString("tr-TR")
                };

                // İsim (0. soru)
                if ("qs2_0" in response.answers) {
                    flatRow["İsim"] = response.answers.qs2_0;
                }

                // Yaş (1. soru)
                if ("qs2_1" in response.answers) {
                    flatRow["Yaş"] = response.answers.qs2_1;
                }

                // Cinsiyet (2. soru)
                if ("qs2_2" in response.answers) {
                    const gender = response.answers.qs2_2;
                    flatRow["Cinsiyet"] = gender === "male" ? "Erkek" : gender === "female" ? "Kadın" : gender;
                }

                // Eğitim (3. soru)
                if ("qs2_3" in response.answers) {
                    flatRow["Eğitim"] = response.answers.qs2_3;
                }

                // Gelir (4. soru)
                if ("qs2_4" in response.answers) {
                    flatRow["Gelir"] = response.answers.qs2_4;
                }

                // Soru ID'lerini sıralama yardımcı fonksiyonu
                const getQuestionNumber = (key: string): number => {
                    if (key.startsWith('qs2_') && key.length > 4) {
                        const numPart = key.substring(4);
                        if (!isNaN(parseInt(numPart))) {
                            return parseInt(numPart);
                        }
                    }
                    return Number.MAX_SAFE_INTEGER;
                };

                // Diğer tüm soruları sıralı olarak ekleyelim (5. sorudan itibaren Soru 1, Soru 2... diye)
                const remainingAnswers = Object.entries(response.answers)
                    .filter(([key]) => {
                        // Survey 2 için qs2_5 ve üzeri olan sorular
                        return key.startsWith('qs2_') && getQuestionNumber(key) > 4 && !key.includes('_info');
                    })
                    .sort((a, b) => {
                        const aNum = getQuestionNumber(a[0]);
                        const bNum = getQuestionNumber(b[0]);
                        return aNum - bNum;
                    });

                // Sıralanmış soruları ekle
                let questionNumber = 1; // 5. sorudan sonrasını Soru 1'den başlat
                remainingAnswers.forEach(([, value]) => {
                    flatRow[`Soru ${questionNumber}`] = value;
                    questionNumber++;
                });

                return flatRow;
            });

            // Excel çalışma kitabı oluştur
            const worksheet = utils.json_to_sheet(flatData);
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, "Makro Anket Yanıtları");

            // CSV formatında indir
            const csvData = write(workbook, { bookType: "csv", type: "array" });
            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

            // İndirme bağlantısı oluştur
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `makro-anket-sonuclari-${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();

            // Temizlik
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Excel dışa aktarma sırasında hata oluştu:", err);
            setError("Dışa aktarma başarısız oldu. Lütfen tekrar deneyin.");
        } finally {
            setExporting(false);
        }
    };

    const handleLogout = () => {
        router.push("/admin");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl text-gray-700">Veriler yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Anket Yönetim Paneli</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={exportToExcel}
                            disabled={exporting || responses.length === 0}
                            className={`py-2 px-3 rounded-md text-white font-medium text-sm ${exporting || responses.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                            title="Tüm anket yanıtlarını CSV olarak indir"
                        >
                            {exporting ? "Dışa Aktarılıyor..." : "Tüm Anketler CSV"}
                        </button>
                        <button
                            onClick={exportMicroToExcel}
                            disabled={exporting || responses.filter(r => r.surveyId === "survey1").length === 0}
                            className={`py-2 px-3 rounded-md text-white font-medium text-sm ${exporting || responses.filter(r => r.surveyId === "survey1").length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            title="Sadece Mikro Influencer anket yanıtlarını CSV olarak indir"
                        >
                            {exporting ? "Dışa Aktarılıyor..." : "Mikro Anket CSV"}
                        </button>
                        <button
                            onClick={exportMacroToExcel}
                            disabled={exporting || responses.filter(r => r.surveyId === "survey2").length === 0}
                            className={`py-2 px-3 rounded-md text-white font-medium text-sm ${exporting || responses.filter(r => r.surveyId === "survey2").length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700"
                                }`}
                            title="Sadece Makro Influencer anket yanıtlarını CSV olarak indir"
                        >
                            {exporting ? "Dışa Aktarılıyor..." : "Makro Anket CSV"}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md text-sm"
                        >
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Grafikler Bölümü */}
                {responses.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-6 text-black">Anket İstatistikleri ve Grafikleri</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Cinsiyet Dağılımı */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-4 text-black">Cinsiyet Dağılımı</h3>
                                <div className="h-64">
                                    {genderData && <Pie data={genderData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: "#000000"
                                                }
                                            },
                                            tooltip: {
                                                bodyColor: "#FFFFFF",
                                                titleColor: "#FFFFFF",
                                                backgroundColor: "rgba(0, 0, 0, 0.8)"
                                            }
                                        }
                                    }} />}
                                </div>
                            </div>

                            {/* Yaş Aralığı Dağılımı */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-4 text-black">Yaş Aralığı Dağılımı</h3>
                                <div className="h-64">
                                    {ageData && <Bar data={ageData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: "#000000"
                                                }
                                            },
                                            tooltip: {
                                                bodyColor: "#FFFFFF",
                                                titleColor: "#FFFFFF",
                                                backgroundColor: "rgba(0, 0, 0, 0.8)"
                                            }
                                        },
                                        scales: {
                                            x: {
                                                ticks: {
                                                    color: "#000000"
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    color: "#000000"
                                                }
                                            }
                                        }
                                    }} />}
                                </div>
                            </div>

                            {/* Anket Tipi Dağılımı */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-4 text-black">Anket Tipi Dağılımı</h3>
                                <div className="h-64">
                                    {surveyTypeData && <Doughnut data={surveyTypeData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: "#000000"
                                                }
                                            },
                                            tooltip: {
                                                bodyColor: "#FFFFFF",
                                                titleColor: "#FFFFFF",
                                                backgroundColor: "rgba(0, 0, 0, 0.8)"
                                            }
                                        }
                                    }} />}
                                </div>
                            </div>

                            {/* Günlük Yanıt Sayısı */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-4 text-black">Günlük Yanıt Sayısı</h3>
                                <div className="h-64">
                                    {dailyResponsesData && <Line data={dailyResponsesData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: "#000000"
                                                }
                                            },
                                            tooltip: {
                                                bodyColor: "#FFFFFF",
                                                titleColor: "#FFFFFF",
                                                backgroundColor: "rgba(0, 0, 0, 0.8)"
                                            }
                                        },
                                        scales: {
                                            x: {
                                                ticks: {
                                                    color: "#000000"
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    color: "#000000"
                                                }
                                            }
                                        }
                                    }} />}
                                </div>
                            </div>

                            {/* Sosyal Medya Kullanım Sıklığı (İlk anket için) */}
                            <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                                <h3 className="text-lg font-semibold mb-4 text-black">Sosyal Medya Kullanım Sıklığı (Mikro Anketi - 5. Soru)</h3>
                                <div className="h-64">
                                    {questionResponseData && <Bar data={questionResponseData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: "#000000"
                                                }
                                            },
                                            tooltip: {
                                                bodyColor: "#FFFFFF",
                                                titleColor: "#FFFFFF",
                                                backgroundColor: "rgba(0, 0, 0, 0.8)"
                                            }
                                        },
                                        scales: {
                                            x: {
                                                ticks: {
                                                    color: "#000000"
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    color: "#000000"
                                                }
                                            }
                                        }
                                    }} />}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tablo Bölümü */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-black">Anket Yanıtları ({responses.length})</h2>

                    {responses.length === 0 ? (
                        <p className="text-gray-500">Henüz kaydedilmiş anket yanıtı bulunmamaktadır.</p>
                    ) : (
                        <div className="space-y-8">
                            {/* Mikro Influencer Anketi Tablosu */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-black">Mikro Influencer Anketi Yanıtları</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-black">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tarih
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    İsim
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Yaş
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cinsiyet
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Eğitim
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Gelir
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Soru 1
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Soru 2
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {responses.filter(response => response.surveyId === "survey1").map(response => (
                                                <tr key={response.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.createdAt instanceof Date
                                                            ? response.createdAt.toLocaleString("tr-TR")
                                                            : new Date().toLocaleString("tr-TR")}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                                        {response.answers.q0 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.q1 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.q2 === "male" ? "Erkek" : response.answers.q2 === "female" ? "Kadın" : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.q3 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.q4 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.q5 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.q6 || "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Makro Influencer Anketi Tablosu */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-black">Makro Influencer Anketi Yanıtları</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-black">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tarih
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    İsim
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Yaş
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cinsiyet
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Eğitim
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Gelir
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Soru 1
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Soru 2
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {responses.filter(response => response.surveyId === "survey2").map(response => (
                                                <tr key={response.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.createdAt instanceof Date
                                                            ? response.createdAt.toLocaleString("tr-TR")
                                                            : new Date().toLocaleString("tr-TR")}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                                        {response.answers.qs2_0 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.qs2_1 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.qs2_2 === "male" ? "Erkek" : response.answers.qs2_2 === "female" ? "Kadın" : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.qs2_3 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.qs2_4 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.qs2_5 || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers.qs2_6 || "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 