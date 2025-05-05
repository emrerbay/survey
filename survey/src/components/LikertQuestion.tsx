"use client";

import React from "react";
import { Question } from "@/models/survey";

interface LikertQuestionProps {
    question: Question;
    value: string | number | undefined;
    onChange: (value: string | number) => void;
}

const LikertQuestion: React.FC<LikertQuestionProps> = ({
    question,
    value,
    onChange
}) => {
    return (
        <div className="w-full mb-6 border-b pb-6">
            <div className="mb-3">
                <p className="text-base font-medium text-gray-900">
                    {question.text}
                    {question.required && <span className="text-red-600 ml-1">*</span>}
                </p>
            </div>

            <div className="grid grid-cols-5 gap-2 mt-3">
                {question.answers.map((answer) => (
                    <div
                        key={answer.id}
                        className="flex flex-col items-center"
                    >
                        <label
                            htmlFor={answer.id}
                            className="flex items-center justify-center text-xs text-gray-800 font-medium text-center h-8 px-1 mb-1"
                        >
                            {answer.text}
                        </label>
                        <input
                            id={answer.id}
                            type="radio"
                            name={question.id}
                            value={answer.value.toString()}
                            checked={value !== undefined && value.toString() === answer.value.toString()}
                            onChange={() => onChange(answer.value)}
                            className="focus:ring-blue-700 h-4 w-4 text-blue-700 border-gray-400"
                            required={question.required}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikertQuestion; 