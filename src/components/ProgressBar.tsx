"use client";

import React from "react";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <div className="w-full mb-8">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-600">{percentage}% tamamlandı</span>
                <span className="text-sm font-medium text-gray-500">{currentStep}/{totalSteps}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar; 