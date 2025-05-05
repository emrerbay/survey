"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { Survey, getRandomSurvey } from "@/models/survey";
import { saveSurveyResponses } from "@/firebase/surveyService";

interface SurveyContextType {
    currentSurvey: Survey;
    answers: Record<string, string | number>;
    currentQuestionIndex: number;
    isSubmitting: boolean;
    isSingleQuestionMode: boolean;
    setAnswer: (questionId: string, value: string | number) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    submitSurvey: () => Promise<void>;
    currentStep: number;
    totalSteps: number;
    isFirstQuestion: boolean;
    isLastQuestion: boolean;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const useSurvey = () => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error("useSurvey must be used within a SurveyProvider");
    }
    return context;
};

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Get random survey
    const [currentSurvey] = useState<Survey>(() => getRandomSurvey());
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // İlk 5 soru için tek tek gösterim, sonrası için hepsi birlikte
    const isSingleQuestionMode = currentQuestionIndex < 5;

    const setAnswer = (questionId: string, value: string | number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const nextQuestion = () => {
        if (isSingleQuestionMode) {
            if (currentQuestionIndex < currentSurvey.questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            }
        } else {
            // Tüm soruların gösterildiği sayfada, submit işlemi gerçekleşecek
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const submitSurvey = async () => {
        setIsSubmitting(true);

        try {
            // Firebase'e anket yanıtlarını kaydet
            await saveSurveyResponses(currentSurvey.id, answers);
            console.log("Anket cevapları:", answers);

            // Simüle edilmiş asenkron işlem
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // İşlem başarılı olduktan sonra
            return Promise.resolve();
        } catch (error) {
            console.error("Anket gönderilirken hata oluştu:", error);
            return Promise.reject(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // İlerleme çubuğu için adım bilgileri
    const currentStep = isSingleQuestionMode ? currentQuestionIndex + 1 : 6;
    const totalSteps = 6; // 5 tekli soru + 1 çoklu soru sayfası

    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = isSingleQuestionMode ? currentQuestionIndex === 4 : true;

    const value = useMemo(
        () => ({
            currentSurvey,
            answers,
            currentQuestionIndex,
            isSubmitting,
            isSingleQuestionMode,
            setAnswer,
            nextQuestion,
            prevQuestion,
            submitSurvey,
            currentStep,
            totalSteps,
            isFirstQuestion,
            isLastQuestion,
        }),
        [
            currentSurvey,
            answers,
            currentQuestionIndex,
            isSubmitting,
            isSingleQuestionMode,
            isFirstQuestion,
            isLastQuestion,
            currentStep,
            totalSteps,
            nextQuestion,
            prevQuestion,
            submitSurvey
        ]
    );

    return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}; 