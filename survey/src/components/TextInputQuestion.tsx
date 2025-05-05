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
    return (
        <div className="w-full mb-4">
            <label className="block text-lg font-medium text-gray-900 mb-2">
                {question.text}
                {question.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <input
                type="text"
                value={value as string || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 text-gray-900"
                placeholder="Adınızı ve soyadınızı giriniz"
                required={question.required}
            />
        </div>
    );
};

export default TextInputQuestion; 