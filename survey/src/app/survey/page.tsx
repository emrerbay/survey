"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/contexts/SurveyContext";
import RadioQuestion from "@/components/RadioQuestion";
import LikertQuestion from "@/components/LikertQuestion";
import TextInputQuestion from "@/components/TextInputQuestion";
import ProgressBar from "@/components/ProgressBar";

export default function SurveyPage() {
    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);

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

    // Tek tek soru gösterme modu
    const renderSingleQuestion = () => {
        if (!currentQuestion) return null;

        switch (currentQuestion.type) {
            case "text":
                return (
                    <TextInputQuestion
                        question={currentQuestion}
                        value={answers[currentQuestion.id]}
                        onChange={(value) => setAnswer(currentQuestion.id, value)}
                    />
                );
            case "radio":
                return (
                    <RadioQuestion
                        question={currentQuestion}
                        value={answers[currentQuestion.id]}
                        onChange={(value) => setAnswer(currentQuestion.id, value)}
                    />
                );
            case "likert":
            case "attention-check":
                return (
                    <LikertQuestion
                        question={currentQuestion}
                        value={answers[currentQuestion.id]}
                        onChange={(value) => setAnswer(currentQuestion.id, value)}
                    />
                );
            default:
                return null;
        }
    };

    // Tüm soruları bir sayfada gösterme
    const renderAllQuestions = () => {
        // 4. sorudan sonrasını göster
        const remainingQuestions = currentSurvey.questions.slice(4);

        return (
            <div className="space-y-6">
                {remainingQuestions.map((question) => {
                    if (question.type === "text") {
                        return (
                            <TextInputQuestion
                                key={question.id}
                                question={question}
                                value={answers[question.id]}
                                onChange={(value) => setAnswer(question.id, value)}
                            />
                        );
                    } else if (question.type === "radio") {
                        return (
                            <RadioQuestion
                                key={question.id}
                                question={question}
                                value={answers[question.id]}
                                onChange={(value) => setAnswer(question.id, value)}
                            />
                        );
                    } else if (question.type === "likert" || question.type === "attention-check") {
                        return (
                            <LikertQuestion
                                key={question.id}
                                question={question}
                                value={answers[question.id]}
                                onChange={(value) => setAnswer(question.id, value)}
                            />
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
            .slice(4)
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
            // Tüm soruların gösterildiği sayfadan sonra submit işlemi
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            await submitSurvey();
            setIsSubmitted(true);
        } catch (error) {
            console.error("Anket gönderilirken hata oluştu:", error);
        }
    };

    // Anket tamamlandı ekranı
    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Anket Tamamlandı!</h2>
                <p className="text-gray-800 text-lg mb-6">
                    Katılımınız için teşekkür ederiz. Yanıtlarınız başarıyla kaydedildi.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-blue-700 text-white text-base font-medium rounded-lg hover:bg-blue-800 transition-colors"
                >
                    Ana Sayfaya Dön
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-3">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

            <div className="mb-6">
                {isSingleQuestionMode ? renderSingleQuestion() : renderAllQuestions()}
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={prevQuestion}
                    disabled={isFirstQuestion}
                    className={`px-6 py-2 rounded-lg text-base ${isFirstQuestion
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                        }`}
                >
                    Geri
                </button>

                <button
                    onClick={handleNextClick}
                    disabled={!canContinue() || isSubmitting}
                    className={`px-6 py-2 rounded-lg text-base ${!canContinue() || isSubmitting
                        ? "bg-blue-400 cursor-not-allowed text-white"
                        : "bg-blue-700 hover:bg-blue-800 text-white font-medium"
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