"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { utils, write } from "xlsx";
import { useRouter } from "next/navigation";

// Anket yanıtlarını daha kolay kullanmak için interface
interface SurveyResponse {
    id: string;
    surveyId: string;
    createdAt: any;
    answers: Record<string, string | number>;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [exporting, setExporting] = useState(false);

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
            } catch (err) {
                console.error("Veriler yüklenirken hata oluştu:", err);
                setError("Veriler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Excel'e aktarma işlevi
    const exportToExcel = () => {
        setExporting(true);

        try {
            // Düzleştirilmiş veriyi oluştur
            const flatData = responses.map(response => {
                // Temel alanları ekle
                const flatRow: Record<string, any> = {
                    "ID": response.id,
                    "Anket ID": response.surveyId,
                    "Oluşturma Tarihi": response.createdAt.toLocaleString("tr-TR")
                };

                // Yanıtları ekle
                Object.entries(response.answers).forEach(([key, value]) => {
                    flatRow[`Soru ${key}`] = value;
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
            link.download = `anket-sonuclari-${new Date().toISOString().slice(0, 10)}.csv`;
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
                    <div className="flex gap-4">
                        <button
                            onClick={exportToExcel}
                            disabled={exporting || responses.length === 0}
                            className={`py-2 px-4 rounded-md text-white font-medium ${exporting || responses.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {exporting ? "Dışa Aktarılıyor..." : "CSV Olarak İndir"}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md"
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

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-black">Anket Yanıtları ({responses.length})</h2>

                    {responses.length === 0 ? (
                        <p className="text-gray-500">Henüz kaydedilmiş anket yanıtı bulunmamaktadır.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Anket Tipi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ad-Soyad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Yaş Aralığı
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cinsiyet
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {responses.map(response => (
                                        <tr key={response.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {response.id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {response.surveyId === "survey1" ? "TikTok Anketi" : "Makro Influencer Anketi"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {response.createdAt.toLocaleString("tr-TR")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {response.answers.q0 || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {response.answers.q1 || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {response.answers.q2 === "male" ? "Erkek" : response.answers.q2 === "female" ? "Kadın" : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 