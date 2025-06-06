"use client";

import React from "react";
import { Question } from "@/models/survey";

interface RadioQuestionProps {
    question: Question;
    value: string | number | undefined;
    onChange: (value: string | number) => void;
}

const RadioQuestion: React.FC<RadioQuestionProps> = ({
    question,
    value,
    onChange
}) => {
    return (
        <div className="w-full">
            <fieldset className="mb-4">
                <legend className="text-lg font-medium text-gray-800 mb-3">
                    {question.text}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                </legend>

                <div className="space-y-2">
                    {question.answers.map((answer) => (
                        <div key={answer.id} className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id={answer.id}
                                    type="radio"
                                    name={question.id}
                                    value={answer.value.toString()}
                                    checked={value !== undefined && value.toString() === answer.value.toString()}
                                    onChange={() => onChange(answer.value)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    required={question.required}
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor={answer.id} className="font-medium text-gray-700 cursor-pointer">
                                    {answer.text}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </fieldset>
        </div>
    );
};

export default RadioQuestion; 