"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function ThankYouPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <svg
                        className="w-16 h-16 text-green-500 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">Teşekkürler!</h1>

                <p className="text-lg text-gray-600 mb-8">
                    Anketi tamamladığınız için teşekkür ederiz. Değerli katkılarınız bizim için önemlidir.
                </p>

                <button
                    onClick={() => router.push("/")}
                    className="py-3 px-8 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors"
                >
                    Ana Sayfaya Dön
                </button>
            </div>
        </div>
    );
} 