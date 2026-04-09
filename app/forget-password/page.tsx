'use client';

import { useCallback, useState } from 'react';
import { useNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import Image from 'next/image';
import AuthLanguageToggle from '@/components/auth/AuthLanguageToggle';
import { useAppContext } from '@/context/AppContext';

export default function ForgetPasswordPage() {
  const { goToLogin } = useNavigation();
  const { toast } = useToast();
  const { dir } = useAppContext();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isAr = dir === 'rtl';

  const copy = {
    ar: {
      title: 'نسيت كلمة المرور',
      subtitle: 'سنرسل لك تعليمات حول كيفية إعادة تعيين كلمة المرور عبر البريد الإلكتروني.',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'your-email@example.com',
      validationTitle: 'خطأ في التحقق',
      validationMissing: 'يرجى إدخال بريدك الإلكتروني',
      validationInvalid: 'يرجى إدخال عنوان بريد إلكتروني صالح',
      successTitle: 'تم بنجاح',
      successFallback: 'إذا كان هذا البريد الإلكتروني موجوداً، فقد تم إرسال رابط إعادة التعيين.',
      errorTitle: 'خطأ',
      errorFallback: 'حدث خطأ أثناء طلب إعادة تعيين كلمة المرور',
      sending: 'جاري الإرسال...',
      continue: 'متابعة',
    },
    en: {
      title: 'Forgot Password',
      subtitle: "We'll email you instructions to reset your password.",
      emailLabel: 'Email',
      emailPlaceholder: 'your-email@example.com',
      validationTitle: 'Validation Error',
      validationMissing: 'Please enter your email',
      validationInvalid: 'Please enter a valid email address',
      successTitle: 'Success',
      successFallback: 'If the email exists, a reset link has been sent.',
      errorTitle: 'Error',
      errorFallback: 'Something went wrong while requesting a reset',
      sending: 'Sending...',
      continue: 'Continue',
    },
  } as const;

  const t = isAr ? copy.ar : copy.en;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast({ title: t.validationTitle, description: t.validationMissing, variant: 'destructive', duration: 5000 });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast({ title: t.validationTitle, description: t.validationInvalid, variant: 'destructive', duration: 5000 });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.forgetPassword({ email: trimmedEmail });
      toast({ title: t.successTitle, description: res?.message || t.successFallback, duration: 5000 });
      goToLogin();
    } catch (err: any) {
      console.error('Forget password error:', err);
      let description = err?.message ?? t.errorFallback;

      // Fallback translation for common English error message from backend
      if (description === 'Failed to send password reset email. Please try again later.') {
        description = isAr
          ? 'فشل إرسال بريد إلكتروني لإعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى لاحقاً.'
          : 'Failed to send password reset email. Please try again later.';
      }

      toast({
        title: t.errorTitle,
        description: description,
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, goToLogin, toast, t, isAr]);

  return (
    <div className={`relative min-h-[calc(100vh-4rem)] bg-white flex flex-col items-center justify-center px-4 py-8 overflow-hidden ${isAr ? 'font-almarai' : 'font-nunito'}`} dir={dir} lang={isAr ? 'ar' : 'en'}>
      <div className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-20`}>
        <AuthLanguageToggle />
      </div>

      <Image
        src="/images/LoginLogo2.png"
        alt=""
        aria-hidden="true"
        width={220}
        height={225}
        className={`pointer-events-none absolute top-0 ${isAr ? 'right-0' : 'left-0'} z-0 w-[60%] max-w-[220px] h-auto max-h-[225px] opacity-100 transform-none md:top-0`}
        style={{ transform: 'rotate(0deg)', opacity: 1 }}
      />
      <Image
        src="/images/loginLogo.png"
        alt=""
        aria-hidden="true"
        width={420}
        height={225}
        className={`pointer-events-none absolute ${isAr ? 'left-0 sm:left-4 lg:left-[5px]' : 'right-0 sm:right-4 lg:right-[5px]'} bottom-0 z-0 w-[60%] max-w-[420px] h-auto max-h-[225px] opacity-100 transform-none sm:bottom-0 lg:bottom-0`}
        style={{ transform: 'rotate(0deg)', opacity: 1 }}
      />

      <div className="w-[98%] md:w-[92%] max-w-[100%] md:max-w-[520px] relative z-10 mx-auto">
        <div className="bg-white p-6 sm:p-8 backdrop-blur-sm rounded-lg">
          <div className="mb-6 flex justify-center items-center">
            <h2 className="text-center" style={{ fontFamily: isAr ? 'Almarai' : 'Nunito', fontWeight: 700, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', color: '#282828' }}>
              {t.title}
            </h2>
          </div>

          <p className="text-center text-sm text-gray-600 mb-6">{t.subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  dir="ltr"
                  aria-label={t.emailLabel}
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={false}
                  className="text-left bg-[#ECECEC] border-0 hover:bg-[#ECECEC] focus:bg-[#ECECEC] focus-visible:bg-[#ECECEC] focus:border-0 focus-visible:border-0 focus:ring-0 focus-visible:ring-0 outline-none w-full h-11 sm:h-[44px] px-4 rounded-[12px]"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="transition duration-200 shadow-md w-full sm:max-w-[470.5px] h-11 sm:h-[45px] gap-[10px] rounded-[12px] border-b-[3px] border-b-[#20672F] hover:bg-[#35AB4E] bg-[#35AB4E] text-[#ECECEC]  font-bold text-[16px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  {t.sending}
                </>
              ) : (
                t.continue
              )}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}
