"use client";

import React from "react";
import { Question } from "@/models/survey";

interface TextInputQuestionProps {
    question: Question;
    value: string | number | undefined;
    onChange: (value: string | number) => void;
}

const TextInputQuestion: React.FC<TextInputQuestionProps> = ({
    question,
    value,
    onChange
}) => {
    // Bilgi metni içeren sorular için (id'si _info ile bitenler)
    if (question.id.endsWith('_info')) {
        return (
            <div className="w-full mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <div className="flex">
                    <div className="flex-shrink-0 text-blue-500">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-md font-medium text-blue-800">
                            {question.text}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Normal metin giriş soruları için
    return (
        <div className="w-full mb-4">
            <label className="block text-lg font-medium text-gray-800 mb-2">
                {question.text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type="text"
                value={value as string || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Adınızı ve soyadınızı giriniz"
                required={question.required}
            />
        </div>
    );
};

export default TextInputQuestion; 