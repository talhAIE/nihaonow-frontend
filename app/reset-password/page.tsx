"use client";

import { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const { goToLogin } = useNavigation();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const token = searchParams?.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({ title: 'رابط غير صالح', description: 'لم يتم توفير رمز في الرابط', variant: 'destructive', duration: 5000 });
    }
  }, [token, toast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!newPassword) {
      toast({ title: 'خطأ في التحقق', description: 'يرجى إدخال كلمة مرور جديدة', variant: 'destructive', duration: 5000 });
      return;
    }

    if (newPassword.length < 8) {
      toast({ title: 'خطأ في التحقق', description: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل', variant: 'destructive', duration: 5000 });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: 'خطأ في التحقق', description: 'كلمات المرور غير متطابقة', variant: 'destructive', duration: 5000 });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ token, newPassword });
      toast({ title: 'تم بنجاح', description: res?.message || 'تم إعادة تعيين كلمة المرور. يرجى تسجيل الدخول.', duration: 5000 });
      goToLogin();
    } catch (err: any) {
      console.error('Reset password error:', err);
      toast({ title: 'خطأ', description: err?.message ?? 'حدث خطأ أثناء إعادة تعيين كلمة المرور', variant: 'destructive', duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  }, [token, newPassword, confirmPassword, goToLogin, toast]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-white flex flex-col items-center justify-center px-4 py-8 overflow-hidden" dir="rtl">
      <Image
        src="/images/LoginLogo2.png"
        alt=""
        aria-hidden="true"
        width={220}
        height={225}
        className="pointer-events-none absolute top-0 right-0 z-0 w-[60%] max-w-[220px] h-auto max-h-[225px] opacity-100 transform-none md:top-0"
        style={{ transform: 'rotate(0deg)', opacity: 1 }}
      />
      <Image
        src="/images/loginLogo.png"
        alt=""
        aria-hidden="true"
        width={420}
        height={225}
        className="pointer-events-none absolute left-0 bottom-0 z-0 w-[60%] max-w-[420px] h-auto max-h-[225px] opacity-100 transform-none sm:left-4 sm:bottom-0 lg:left-[5px] lg:bottom-0"
        style={{ transform: 'rotate(0deg)', opacity: 1 }}
      />

      <div className="w-[98%] md:w-[92%] max-w-[100%] md:max-w-[520px] relative z-10 mx-auto">
        <div className="bg-white p-6 sm:p-8 backdrop-blur-sm rounded-lg">
          <div className="mb-6 flex justify-center items-center">
            <h2 className="text-center" style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', color: '#282828' }}>
              إعادة تعيين كلمة المرور
            </h2>
          </div>

          <p className="text-center text-sm text-gray-600 mb-6">أدخل كلمة مرور قوية جديدة لحسابك.</p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  dir="ltr"
                  aria-label="كلمة المرور الجديدة"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={false}
                  className="text-left bg-[#ECECEC] border-0 hover:bg-[#ECECEC] focus:bg-[#ECECEC] focus-visible:bg-[#ECECEC] focus:border-0 focus-visible:border-0 focus:ring-0 focus-visible:ring-0 outline-none w-full h-11 sm:h-[44px] px-4 rounded-[12px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  dir="ltr"
                  aria-label="تأكيد كلمة المرور"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="تأكيد كلمة المرور الجديدة"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={false}
                  className="text-left bg-[#ECECEC] border-0 hover:bg-[#ECECEC] focus:bg-[#ECECEC] focus-visible:bg-[#ECECEC] focus:border-0 focus-visible:border-0 focus:ring-0 focus-visible:ring-0 outline-none w-full h-11 sm:h-[44px] px-4 rounded-[12px]"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading || !token} className="transition duration-200 shadow-md w-full sm:max-w-[470.5px] h-11 sm:h-[45px] gap-[10px] rounded-[12px] border-b-[3px] border-b-[#20672F] hover:bg-[#35AB4E] bg-[#35AB4E] text-[#ECECEC]  font-bold text-[16px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري إعادة التعيين...
                </>
              ) : (
                'إعادة تعيين كلمة المرور'
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              ستنتهي صلاحية هذا الرابط خلال ساعة واحدة. إذا انتهت الصلاحية، اطلب إعادة تعيين جديدة من صفحة تسجيل الدخول.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
