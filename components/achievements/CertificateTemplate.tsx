"use client";

import React from "react";

interface CertificateTemplateProps {
    userName: string;
    certificateName: string;
    description: string;
    awardedAt?: string;
}

export default function CertificateTemplate({
    userName,
    certificateName,
    description,
    awardedAt,
}: CertificateTemplateProps) {
    return (
        <div
            id="certificate-download-template"
            style={{
                width: "1131px",
                height: "800px",
                position: "fixed",
                left: "-9999px",
                top: "0",
                backgroundColor: "white",
                fontFamily: "'Almarai', sans-serif",
            }}
            dir="rtl"
        >
            <div className="relative w-full h-full p-12 flex flex-col items-center justify-center">
                {/* Background Scroll */}
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/scrollopened.png"
                        alt="Certificate Background"
                        className="w-full h-full object-contain"
                        crossOrigin="anonymous"
                    />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-[900px] mt-12">
                    <h5 className="text-2xl font-black text-amber-800 whitespace-nowrap mb-10">
                        الشهادة الرسمية
                    </h5>

                    <div className="mb-12">
                        <p className="text-4xl font-bold text-gray-500 mb-6">تُمنح هذه الشهادة لـ</p>
                        <h2 className="text-8xl font-black text-slate-900 font-almarai-extrabold pb-6 border-b-8 border-amber-300">
                            {userName}
                        </h2>
                    </div>

                    <div className="mb-14">
                        <h1 className="text-7xl font-black text-[#35AB4E] mb-8 font-almarai-extrabold">
                            {certificateName}
                        </h1>
                        <p className="text-4xl text-gray-800 leading-relaxed font-bold px-12">
                            {description}
                        </p>
                    </div>

                    {awardedAt && (
                        <div className="mt-12 pt-12 border-t-2 border-amber-200 w-full">
                            <p className="text-3xl font-black text-gray-500">
                                صدرت في: {new Date(awardedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
