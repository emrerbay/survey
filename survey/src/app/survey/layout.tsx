"use client";

import { SurveyProvider } from "@/contexts/SurveyContext";
import React from "react";

export default function SurveyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SurveyProvider>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Anket</h1>
                    <p className="text-gray-700 font-medium mt-2">
                        Lütfen aşağıdaki soruları dikkatlice cevaplandırın.
                    </p>
                </header>

                {children}
            </div>
        </SurveyProvider>
    );
} 