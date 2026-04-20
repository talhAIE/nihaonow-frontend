'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/lib/navigation';
import { useAppContext } from '@/context/AppContext';
import AuthLanguageToggle from '@/components/auth/AuthLanguageToggle';

export default function WelcomeOnBoardingScreen() {
  const { dir } = useAppContext();
  const { goToRegister, goToLogin } = useNavigation();
  const isAr = dir === 'rtl';

  const copy = {
    ar: {
      getStarted: 'ابدأ الآن',
      alreadyHave: 'لديك حساب بالفعل',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      copyright: '© NihaoNow 2025 Inc.',
    },
    en: {
      getStarted: 'Get Started',
      alreadyHave: 'I already have an account',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      copyright: '© NihaoNow 2025 Inc.',
    },
  } as const;

  const t = isAr ? copy.ar : copy.en;

  return (
    <div className={`relative min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center p-4 ${isAr ? 'font-almarai' : 'font-nunito'}`} dir={dir} lang={isAr ? 'ar' : 'en'}>
      <div className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-20`}>
        <AuthLanguageToggle />
      </div>
      <div className={`w-full max-w-6xl mx-auto flex flex-col ${isAr ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-center gap-8 md:gap-16`}>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[28rem] md:h-[28rem] relative">
            <Image
              src="/images/2.png"
              alt="NihaoNow illustration"
              fill={true}
              className={`object-contain ${isAr ? 'scale-x-[-1]' : ''}`}
            />
          </div>
        </div>

        <div className={`w-full md:w-1/2 flex flex-col items-center md:items-center ${dir === 'rtl' ? 'text-right' : 'text-left'}`} lang={dir === 'rtl' ? 'ar' : 'en'}>

          <div className="relative w-full max-w-[400px] h-[120px] mb-8">
            <Image
              src="/images/title.svg"
              alt="NihaoNow Title"
              fill
              className="object-contain"
            />
          </div>

          <div className="w-full max-w-sm space-y-3">
            <Button
              onClick={goToRegister}
              aria-label="Get started - register"
              className="transition duration-200 shadow-md w-full max-w-[470.5px] h-[54px] py-4 gap-[10px] rounded-[12px] border-b-[3px] border-b-[#20672F] bg-[#35AB4E] hover:bg-[#35AB4E] text-[#ECECEC]  font-bold text-[16px] leading-[100%] tracking-[0%]"
            >
              {t.getStarted}
            </Button>

            <Button
              onClick={goToLogin}
              aria-label="I already have an account - login"
              className=" font-bold max-w-[470.5px] w-full h-[54px] py-4 gap-[10px] rounded-[12px] bg-[#E5E5E5] hover:bg-[#E5E5E5] border-b-[3px] border-b-[rgba(0,0,0,0.08)] opacity-100 text-[#282828] text-[16px] leading-[100%] tracking-[0%] transition duration-200"
            >
              {t.alreadyHave}
            </Button>
          </div>

          <div className="w-full max-w-sm mt-8">
            <div className="flex justify-between text-medium-11">
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-800 text-start">{t.privacy}</a>
                <span>|</span>
                <a href="#" className="hover:text-gray-800">{t.terms}</a>
              </div>
              <span>{t.copyright}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
