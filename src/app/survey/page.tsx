"use client";

import { useRouter } from "next/navigation";
import { useSurvey } from "@/contexts/SurveyContext";
import RadioQuestion from "@/components/RadioQuestion";
import LikertQuestion from "@/components/LikertQuestion";
import TextInputQuestion from "@/components/TextInputQuestion";
import ProgressBar from "@/components/ProgressBar";
import { useRef, useEffect, useState } from "react";

export default function SurveyPage() {
    const router = useRouter();
    // Soruların referanslarını tutacak bir obje oluşturuyoruz
    const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);
    const [pulsatingQuestionId, setPulsatingQuestionId] = useState<string | null>(null);

    const {
        currentSurvey,
        answers,
        currentQuestionIndex,
        isSingleQuestionMode,
        isSubmitting,
        setAnswer,
        nextQuestion,
        prevQuestion,
        submitSurvey,
        currentStep,
        totalSteps,
        isFirstQuestion,
        isLastQuestion,
    } = useSurvey();

    const currentQuestion = currentSurvey.questions[currentQuestionIndex];

    // Çözülmemiş ilk soruyu bulan fonksiyon
    const findFirstUnansweredQuestion = () => {
        if (isSingleQuestionMode) {
            // Tek soru modunda, şu anki soru yanıtlanmadıysa bu sorudur
            return !answers[currentQuestion?.id || ""] ? currentQuestion?.id : null;
        }

        // Çoklu soru modunda, zorunlu sorulardan yanıtlanmamış ilkini bul
        const remainingRequiredQuestions = currentSurvey.questions
            .slice(5)
            .filter(q => q.required && !q.id.endsWith('_info')); // Bilgi metinlerini hariç tut

        return remainingRequiredQuestions.find(q => !answers[q.id])?.id || null;
    };

    // Çözülmemiş ilk soruya veya submit butonuna scroll eden fonksiyon
    const scrollToTarget = () => {
        const unansweredQuestionId = findFirstUnansweredQuestion();

        if (unansweredQuestionId) {
            // Çözülmemiş soru var, o soruya scroll yap
            const questionElement = questionRefs.current[unansweredQuestionId];
            if (questionElement) {
                questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setPulsatingQuestionId(unansweredQuestionId);

                // 3 saniye sonra pulse efektini kaldır
                setTimeout(() => {
                    setPulsatingQuestionId(null);
                }, 3000);
            }
        } else if (submitButtonRef.current) {
            // Tüm sorular çözülmüş, submit butonuna scroll yap
            submitButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Ref atama fonksiyonu
    const setQuestionRef = (el: HTMLDivElement | null, id: string) => {
        if (el) {
            questionRefs.current[id] = el;
        }
    };

    // Pulse efekti CSS sınıfı
    const getPulseClass = (questionId: string) => {
        return pulsatingQuestionId === questionId ? 'border-2 border-red-400 outline outline-2 outline-red-300 outline-offset-0 rounded-md transition-all duration-500 animate-border-pulse' : '';
    };

    // Tek tek soru gösterme modu
    const renderSingleQuestion = () => {
        if (!currentQuestion) return null;

        switch (currentQuestion.type) {
            case "text":
                return (
                    <div
                        ref={(el) => setQuestionRef(el, currentQuestion.id)}
                        className={`p-3 ${getPulseClass(currentQuestion.id)}`}
                    >
                        <TextInputQuestion
                            question={currentQuestion}
                            value={answers[currentQuestion.id]}
                            onChange={(value) => setAnswer(currentQuestion.id, value)}
                        />
                    </div>
                );
            case "radio":
                return (
                    <div
                        ref={(el) => setQuestionRef(el, currentQuestion.id)}
                        className={`p-3 ${getPulseClass(currentQuestion.id)}`}
                    >
                        <RadioQuestion
                            question={currentQuestion}
                            value={answers[currentQuestion.id]}
                            onChange={(value) => setAnswer(currentQuestion.id, value)}
                        />
                    </div>
                );
            case "likert":
            case "attention-check":
                return (
                    <div
                        ref={(el) => setQuestionRef(el, currentQuestion.id)}
                        className={`p-3 ${getPulseClass(currentQuestion.id)}`}
                    >
                        <LikertQuestion
                            question={currentQuestion}
                            value={answers[currentQuestion.id]}
                            onChange={(value) => setAnswer(currentQuestion.id, value)}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    // Tüm soruları bir sayfada gösterme
    const renderAllQuestions = () => {
        // 5. sorudan sonrasını göster
        const remainingQuestions = currentSurvey.questions.slice(5);

        return (
            <div className="space-y-6">
                {remainingQuestions.map((question) => {
                    if (question.type === "text") {
                        return (
                            <div
                                key={question.id}
                                ref={(el) => setQuestionRef(el, question.id)}
                                className={`p-3 ${getPulseClass(question.id)}`}
                            >
                                <TextInputQuestion
                                    question={question}
                                    value={answers[question.id]}
                                    onChange={(value) => setAnswer(question.id, value)}
                                />
                            </div>
                        );
                    } else if (question.type === "radio") {
                        return (
                            <div
                                key={question.id}
                                ref={(el) => setQuestionRef(el, question.id)}
                                className={`p-3 ${getPulseClass(question.id)}`}
                            >
                                <RadioQuestion
                                    question={question}
                                    value={answers[question.id]}
                                    onChange={(value) => setAnswer(question.id, value)}
                                />
                            </div>
                        );
                    } else if (question.type === "likert" || question.type === "attention-check") {
                        return (
                            <div
                                key={question.id}
                                ref={(el) => setQuestionRef(el, question.id)}
                                className={`p-3 ${getPulseClass(question.id)}`}
                            >
                                <LikertQuestion
                                    question={question}
                                    value={answers[question.id]}
                                    onChange={(value) => setAnswer(question.id, value)}
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    // İleri butonu aktif/pasif kontrolü
    const canContinue = () => {
        if (isSingleQuestionMode) {
            return !!answers[currentQuestion?.id || ""];
        }

        // Çoklu sorular için tüm zorunlu soruların cevaplanıp cevaplanmadığını kontrol et
        const remainingRequiredQuestions = currentSurvey.questions
            .slice(5)
            .filter(q => q.required)
            .map(q => q.id);

        return remainingRequiredQuestions.every(id => !!answers[id]);
    };

    const handleNextClick = () => {
        if (isSingleQuestionMode) {
            if (isLastQuestion) {
                // Son tekli sorudan sonra, tüm soruların olduğu sayfaya geçiş yap
                nextQuestion();
            } else {
                nextQuestion();
            }
        } else {
            // Çoklu sorular modunda ve devam butonuna tıklandığında
            if (!canContinue()) {
                // Eğer tamamlanmamış sorular varsa, ilk tamamlanmamış soruya scroll yap
                scrollToTarget();
                return;
            }

            // Tüm sorular tamamlanmışsa submit işlemi yap
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            await submitSurvey();
            // Firebase'e başarıyla kayıt olduktan sonra thank-you sayfasına yönlendir
            router.push("/thank-you");
        } catch (error) {
            console.error("Anket gönderilirken hata oluştu:", error);
        }
    };

    // Özel animasyonlar için CSS stilini ekle
    useEffect(() => {
        // Animasyon için CSS stil ekle
        const style = document.createElement('style');
        style.textContent = `
            @keyframes border-pulse {
                0% { border-color: rgba(248, 113, 113, 0.8); outline-color: rgba(248, 113, 113, 0.4); }
                50% { border-color: rgba(248, 113, 113, 0.4); outline-color: rgba(248, 113, 113, 0.2); }
                100% { border-color: rgba(248, 113, 113, 0.8); outline-color: rgba(248, 113, 113, 0.4); }
            }
            .animate-border-pulse {
                animation: border-pulse 1s infinite;
            }
        `;
        document.head.appendChild(style);

        return () => {
            // Component unmount olduğunda stili kaldır
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-2">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

            <div className="mb-6">
                {isSingleQuestionMode ? renderSingleQuestion() : renderAllQuestions()}
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={prevQuestion}
                    disabled={isFirstQuestion}
                    className={`px-6 py-2 rounded-lg ${isFirstQuestion
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                >
                    Geri
                </button>

                <button
                    ref={submitButtonRef}
                    onClick={handleNextClick}
                    disabled={isSingleQuestionMode ? !canContinue() || isSubmitting : isSubmitting}
                    className={`px-6 py-2 rounded-lg ${isSingleQuestionMode && (!canContinue() || isSubmitting)
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    {isSubmitting
                        ? "Gönderiliyor..."
                        : isSingleQuestionMode
                            ? isLastQuestion
                                ? "Devam Et"
                                : "İleri"
                            : "Anketi Tamamla"}
                </button>
            </div>
        </div>
    );
} 