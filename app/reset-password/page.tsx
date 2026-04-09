"use client";

import { useCallback, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';
import Image from 'next/image';
import AuthLanguageToggle from '@/components/auth/AuthLanguageToggle';
import { useAppContext } from '@/context/AppContext';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#35AB4E]" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const { goToLogin } = useNavigation();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { dir } = useAppContext();
  const token = searchParams?.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isAr = dir === 'rtl';

  const copy = {
    ar: {
      title: 'إعادة تعيين كلمة المرور',
      subtitle: 'أدخل كلمة مرور قوية جديدة لحسابك.',
      invalidLinkTitle: 'رابط غير صالح',
      invalidLinkDesc: 'لم يتم توفير رمز في الرابط',
      validationTitle: 'خطأ في التحقق',
      newPasswordMissing: 'يرجى إدخال كلمة مرور جديدة',
      passwordShort: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
      mismatch: 'كلمات المرور غير متطابقة',
      successTitle: 'تم بنجاح',
      successDesc: 'تم إعادة تعيين كلمة المرور. يرجى تسجيل الدخول.',
      errorTitle: 'خطأ',
      errorFallback: 'حدث خطأ أثناء إعادة تعيين كلمة المرور',
      newPasswordLabel: 'كلمة المرور الجديدة',
      newPasswordPlaceholder: 'أدخل كلمة المرور الجديدة',
      confirmPasswordLabel: 'تأكيد كلمة المرور',
      confirmPasswordPlaceholder: 'تأكيد كلمة المرور الجديدة',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
      resetting: 'جاري إعادة التعيين...',
      resetButton: 'إعادة تعيين كلمة المرور',
      linkNote: 'ستنتهي صلاحية هذا الرابط خلال ساعة واحدة. إذا انتهت الصلاحية، اطلب إعادة تعيين جديدة من صفحة تسجيل الدخول.',
    },
    en: {
      title: 'Reset Password',
      subtitle: 'Enter a strong new password for your account.',
      invalidLinkTitle: 'Invalid Link',
      invalidLinkDesc: 'No token was provided in the link',
      validationTitle: 'Validation Error',
      newPasswordMissing: 'Please enter a new password',
      passwordShort: 'Password must be at least 8 characters',
      mismatch: 'Passwords do not match',
      successTitle: 'Success',
      successDesc: 'Your password has been reset. Please log in.',
      errorTitle: 'Error',
      errorFallback: 'Something went wrong while resetting your password',
      newPasswordLabel: 'New Password',
      newPasswordPlaceholder: 'Enter a new password',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your new password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      resetting: 'Resetting...',
      resetButton: 'Reset Password',
      linkNote: 'This link will expire in one hour. If it expires, request a new reset from the login page.',
    },
  } as const;

  const t = isAr ? copy.ar : copy.en;

  useEffect(() => {
    if (!token) {
      toast({ title: t.invalidLinkTitle, description: t.invalidLinkDesc, variant: 'destructive', duration: 5000 });
    }
  }, [token, toast, t]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!newPassword) {
      toast({ title: t.validationTitle, description: t.newPasswordMissing, variant: 'destructive', duration: 5000 });
      return;
    }

    if (newPassword.length < 8) {
      toast({ title: t.validationTitle, description: t.passwordShort, variant: 'destructive', duration: 5000 });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: t.validationTitle, description: t.mismatch, variant: 'destructive', duration: 5000 });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ token, newPassword });
      toast({ title: t.successTitle, description: res?.message || t.successDesc, duration: 5000 });
      goToLogin();
    } catch (err: any) {
      console.error('Reset password error:', err);
      toast({ title: t.errorTitle, description: err?.message ?? t.errorFallback, variant: 'destructive', duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  }, [token, newPassword, confirmPassword, goToLogin, toast, t]);

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
                  aria-label={t.newPasswordLabel}
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t.newPasswordPlaceholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={false}
                  className="text-left bg-[#ECECEC] border-2 border-transparent focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none w-full h-11 sm:h-[44px] px-4 pr-12 rounded-[12px] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showNewPassword ? t.hidePassword : t.showPassword}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  dir="ltr"
                  aria-label={t.confirmPasswordLabel}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={false}
                  className="text-left bg-[#ECECEC] border-2 border-transparent focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none w-full h-11 sm:h-[44px] px-4 pr-12 rounded-[12px] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmPassword ? t.hidePassword : t.showPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading || !token} className="transition duration-200 shadow-md w-full sm:max-w-[470.5px] h-11 sm:h-[45px] gap-[10px] rounded-[12px] border-b-[3px] border-b-[#20672F] hover:bg-[#35AB4E] bg-[#35AB4E] text-[#ECECEC]  font-bold text-[16px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  {t.resetting}
                </>
              ) : (
                t.resetButton
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              {t.linkNote}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
