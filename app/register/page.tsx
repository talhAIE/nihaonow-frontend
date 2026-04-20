'use client';

import { useCallback, useState } from 'react';
import { useNavigation } from '@/lib/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { authApi } from '@/lib/api';
import { setAuthToken, setUserRole } from '@/lib/authUtils';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import AuthLanguageToggle from '@/components/auth/AuthLanguageToggle';

type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const { goToStudentDashboard } = useNavigation();
  const { login, dir } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const isAr = dir === 'rtl';

  const copy = {
    ar: {
      title: 'إنشاء حساب',
      usernameLabel: 'اسم المستخدم',
      usernamePlaceholder: 'أدخل اسم المستخدم',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'name@example.com',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: '••••••••',
      fieldRequired: 'هذا الحقل مطلوب',
      usernameShort: 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل',
      passwordShort: 'يجب أن تكون كلمة المرور 4 أحرف على الأقل',
      invalidEmail: 'الرجاء إدخال عنوان بريد إلكتروني صالح',
      validationTitle: 'خطأ في التحقق',
      tokenMissing: 'لم يتم العثور على التوكن',
      authErrorTitle: 'خطأ في المصادقة',
      authErrorDesc: 'تعذر حفظ رمز الجلسة',
      successTitle: 'تم بنجاح',
      successDesc: 'مرحبًا بك',
      errorTitle: 'خطأ',
      unexpectedError: 'حدث خطأ غير متوقع',
      creating: 'جاري إنشاء الحساب...',
      createAccount: 'إنشاء حساب',
      haveAccount: 'لديك حساب بالفعل؟',
      signIn: 'تسجيل الدخول',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
    },
    en: {
      title: 'Create Account',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter your username',
      emailLabel: 'Email',
      emailPlaceholder: 'name@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      fieldRequired: 'This field is required',
      usernameShort: 'Username must be at least 3 characters',
      passwordShort: 'Password must be at least 4 characters',
      invalidEmail: 'Please enter a valid email address',
      validationTitle: 'Validation Error',
      tokenMissing: 'Token not found',
      authErrorTitle: 'Authentication Error',
      authErrorDesc: 'Failed to save session token',
      successTitle: 'Success',
      successDesc: 'Welcome',
      errorTitle: 'Error',
      unexpectedError: 'An unexpected error occurred',
      creating: 'Creating account...',
      createAccount: 'Create Account',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
    },
  } as const;

  const t = isAr ? copy.ar : copy.en;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const val = name === 'email' ? value.trimStart() : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  const validateField = useCallback((field: keyof FormData) => {
    const value = (formData[field] ?? '').toString();
    let error = '';
    if (!value.trim()) {
      error = t.fieldRequired;
    } else {
      if (field === 'username' && value.length < 3) {
        error = t.usernameShort;
      }
      if (field === 'password' && value.length < 4) {
        error = t.passwordShort;
      }
      if (field === 'email') {
      }
      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = t.invalidEmail;
      }
    }
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
    return !error;
  }, [formData, t]);

  const validateForm = useCallback(() => {
    const fields: (keyof FormData)[] = ['username', 'email', 'password'];
    const fieldResults = fields.map(f => validateField(f));
    const ok = fieldResults.every(Boolean);
    if (!ok) {
      // toast({ title: 'خطأ في التحقق', description: 'يرجى تصحيح الحقول المظللة', variant: 'destructive' });
    }
    return ok;
  }, [validateField]);

  const normalizeResponse = (res: any) => {
    if (!res) return { token: null, user: null, message: 'Empty response from server' };
    const token = res.access_token ?? res.token ?? res.data?.access_token ?? null;
    const user = res.user ?? res.data?.user ?? res.data ?? null;
    const message = res.message ?? res.error ?? res.data?.message ?? null;
    return { token, user, message };
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsLoading(true);
      try {
        const response = await authApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        // Handle both direct response and wrapped response formats
        let token, userData;
        if (response && typeof response === "object") {
          if ("data" in response && response.data) {
            const wrappedResponse = response as any;
            token = wrappedResponse.data.access_token ?? wrappedResponse.data.token;
            userData = wrappedResponse.data.user;
          } else {
            const resAny = response as any;
            token = resAny.access_token ?? resAny.token;
            userData = resAny.user;
          }
        }

        if (!token || !userData) {
          toast({ title: t.validationTitle, description: t.tokenMissing, variant: 'destructive', duration: 5000 });
          return;
        }

        try {
          setAuthToken(token);
        } catch (err) {
          console.error('Failed to persist auth token', err);
          toast({ title: t.authErrorTitle, description: t.authErrorDesc, variant: 'destructive', duration: 5000 });
          return;
        }

        let userRole = String(userData.role || "student").toLowerCase();

        setUserRole(userRole);

        login({
          id: String(userData.id ?? ""),
          email: userData.email ?? "",
          username: userData.username ?? userData.name ?? "",
          role: userRole,
          isFirstLogin: userData.isFirstLogin,
        });

        toast({ title: t.successTitle, description: t.successDesc, duration: 5000 });

        setTimeout(() => {
          goToStudentDashboard();
        }, 100);
      } catch (error: any) {
        console.error('Registration error:', error);
        const message = error?.response?.data?.message ?? error?.message ?? t.unexpectedError;
        toast({ title: t.errorTitle, description: message, variant: 'destructive', duration: 5000 });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, login, goToStudentDashboard, toast, validateForm, t]
  );

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

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  dir='ltr'
                  aria-label={t.usernameLabel}
                  id="username"
                  name="username"
                  type="text"
                  placeholder={t.usernamePlaceholder}
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={errors.username ? 'true' : 'false'}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  className={`bg-[#ECECEC] border-0 hover:bg-[#ECECEC] focus:bg-[#ECECEC] focus-visible:bg-[#ECECEC] focus:border-0 focus-visible:border-0 focus:ring-0 focus-visible:ring-0 outline-none w-full h-11 sm:h-[44px] px-4 rounded-[12px] text-left`}
                />
              </div>
              {errors.username && (
                <p id="username-error" className="mt-1 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  dir="ltr"
                  aria-label={t.emailLabel}
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="text-left bg-[#ECECEC] border-0 hover:bg-[#ECECEC] focus:bg-[#ECECEC] focus-visible:bg-[#ECECEC] focus:border-0 focus-visible:border-0 focus:ring-0 focus-visible:ring-0 outline-none w-full h-11 sm:h-[44px] px-4 rounded-[12px]"
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  dir="ltr"
                  aria-label={t.passwordLabel}
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className="text-left bg-[#ECECEC] border-0 hover:bg-[#ECECEC] focus:bg-[#ECECEC] focus-visible:bg-[#ECECEC] focus:border-0 focus-visible:border-0 focus:ring-0 focus-visible:ring-0 outline-none w-full h-11 sm:h-[44px] px-4 pr-12 rounded-[12px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="transition duration-200 shadow-md w-full sm:max-w-[470.5px] h-11 sm:h-[45px] gap-[10px] rounded-[12px] border-b-[3px] border-b-[#20672F] hover:bg-[#35AB4E] bg-[#35AB4E] text-[#ECECEC]  font-bold text-[16px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  {t.creating}
                </>
              ) : (
                t.createAccount
              )}
            </Button>

            <div className="w-full sm:max-w-[470.5px] flex items-center justify-center">
              <Link href="/login" className="block w-full">
                <Button
                  type="button"
                  className="font-bold w-full h-11 sm:h-[45px] px-4 rounded-[12px] hover:bg-[#E5E5E5] bg-[#E5E5E5] border-b-[3px] border-b-[rgba(0,0,0,0.08)] text-[#282828] text-[14px] sm:text-[16px] transition duration-200 whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">{t.haveAccount} </span>
                  <span className="font-semibold text-green-600 hover:text-green-700 transition-colors mr-1">
                    {t.signIn}
                  </span>
                </Button>
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
