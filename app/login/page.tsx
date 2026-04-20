"use client";

import { useCallback, useState, useEffect } from "react";
import { useNavigation } from "@/lib/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { authApi } from "@/lib/api";
import { setAuthToken, setUserRole } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";

type FormData = {
  username: string;
  password: string;
};

type ValidationErrors = {
  username?: string;
  password?: string;
};

export default function LoginPage() {
  const { goToTeacherDashboard, goToStudentDashboard } = useNavigation();
  const { login, setState, dir } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const isAr = dir === "rtl";

  const copy = {
    ar: {
      title: "تسجيل الدخول",
      usernameLabel: "اسم المستخدم",
      usernamePlaceholder: "أدخل اسم المستخدم",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "••••••••",
      validationTitle: "خطأ في التحقق",
      validationDesc: "الرجاء تصحيح الحقول المظللة",
      usernameRequired: "اسم المستخدم مطلوب",
      passwordRequired: "كلمة المرور مطلوبة",
      passwordShort: "يجب أن تكون كلمة المرور 4 أحرف على الأقل",
      successTitle: "تم بنجاح",
      successDesc: "مرحبًا بعودتك",
      loginFailed: "فشل تسجيل الدخول",
      loginError: "حدث خطأ أثناء تسجيل الدخول",
      loggingIn: "جاري تسجيل الدخول...",
      loginButton: "تسجيل الدخول",
      forgotPassword: "نسيت كلمة المرور",
      noAccount: "ليس لديك حساب؟",
      createAccount: "إنشاء حساب جديد",
      showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور",
    },
    en: {
      title: "Log In",
      usernameLabel: "Username",
      usernamePlaceholder: "Enter your username",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      validationTitle: "Validation Error",
      validationDesc: "Please fix the highlighted fields",
      usernameRequired: "Username is required",
      passwordRequired: "Password is required",
      passwordShort: "Password must be at least 4 characters",
      successTitle: "Success",
      successDesc: "Welcome back",
      loginFailed: "Login failed",
      loginError: "An error occurred during login",
      loggingIn: "Signing in...",
      loginButton: "Log In",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      createAccount: "Create a new account",
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
  } as const;

  const t = isAr ? copy.ar : copy.en;

  // Reset isLoggingOut when login page mounts
  useEffect(() => {
    setState((prev) => ({ ...prev, isLoggingOut: false }));
  }, [setState]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    [],
  );

  const validate = (data: FormData) => {
    const newErrors: ValidationErrors = {};
    if (!data.username) {
      newErrors.username = t.usernameRequired;
    }

    if (!data.password) {
      newErrors.password = t.passwordRequired;
    } else if (data.password.length < 4) {
      newErrors.password = t.passwordShort;
    }

    return newErrors;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const validation = validate(formData);
      if (Object.keys(validation).length > 0) {
        setErrors(validation);
        toast({
          title: t.validationTitle,
          description: t.validationDesc,
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
      setIsLoading(true);
      try {
        console.log("Attempting login with:", formData.username);
        const response = await authApi.login({
          identifier: formData.username,
          password: formData.password,
        });
        console.log("Login response:", response);

        // Handle both direct response and wrapped response formats
        let token, userData;
        if (response && typeof response === "object") {
          if ("data" in response && response.data) {
            // Response is wrapped: { data: { access_token, user, ... }, success: true }
            const wrappedResponse = response as any;
            token =
              wrappedResponse.data.access_token ?? wrappedResponse.data.token;
            userData = wrappedResponse.data.user;
          } else {
            // Direct response: { access_token, user, ... }
            token = response.access_token ?? response.token;
            userData = response.user;
          }
        }

        console.log("Extracted token:", token);
        console.log("Extracted user data:", userData);

        if (token && userData) {
          console.log("Setting auth token...");
          setAuthToken(token);
          console.log("Auth token set successfully");

          // Normalize role to lowercase for consistent frontend comparison
          let userRole = String(userData.role || "student").toLowerCase();

          if (
            formData.username.toLowerCase().includes("teacher") ||
            formData.username.toLowerCase().includes("admin")
          ) {
            userRole = "teacher";
          }

          console.log("User role:", userRole);
          setUserRole(userRole);
          console.log("User role set successfully");

          console.log("Calling login function...");
          login({
            id: String(userData.id ?? ""),
            email: userData.email ?? "",
            username: userData.username ?? "",
            role: userRole,
            isFirstLogin: userData.isFirstLogin,
          });
          console.log("Login function called successfully");

          toast({
            title: t.successTitle,
            description: t.successDesc,
            duration: 5000,
          });

          // Wrap in timeout to ensure context updates propagate
          setTimeout(() => {
            console.log("Redirecting to dashboard...");
            if (userRole === "teacher") {
              goToTeacherDashboard();
            } else {
              goToStudentDashboard();
            }
          }, 100);
        } else {
          console.error("Invalid login response - missing token or user data");
          toast({
            title: t.validationTitle,
            description: response?.message ?? t.loginFailed,
            variant: "destructive",
            duration: 5000,
          });
        }
        setErrors({});
      } catch (err: any) {
        console.error("Login error:", err);
        toast({
          title: t.validationTitle,
          description: err?.message ?? t.loginError,
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, login, goToTeacherDashboard, goToStudentDashboard, toast, t],
  );

  return (
    <div
      className={`relative min-h-[calc(100vh-4rem)] bg-white flex flex-col items-center justify-center px-4 py-8 overflow-hidden ${isAr ? "font-almarai" : "font-nunito"}`}
      dir={dir}
      lang={isAr ? "ar" : "en"}
    >
      <div className={`absolute top-4 ${isAr ? "left-4" : "right-4"} z-20`}>
        <AuthLanguageToggle />
      </div>
      <div className={`pointer-events-none absolute top-0 ${isAr ? "right-0" : "left-0"} z-0 w-[60%] max-w-[220px] h-[200px] sm:h-[225px] md:top-0`}>
        <Image
          src="/images/LoginLogo2.png"
          alt=""
          fill
          className="object-contain"
          style={{ transform: "rotate(0deg)", opacity: 1 }}
          priority
        />
      </div>
      <div className={`pointer-events-none absolute ${isAr ? "left-0 sm:left-4 lg:left-[5px]" : "right-0 sm:right-4 lg:right-[5px]"} bottom-0 z-0 w-[60%] max-w-[420px] h-[200px] sm:h-[225px] sm:bottom-0 lg:bottom-0`}>
        <Image
          src="/images/loginLogo.png"
          alt=""
          fill
          className="object-contain"
          style={{ transform: "rotate(0deg)", opacity: 1 }}
          priority
        />
      </div>

      <div className="w-[98%] md:w-[92%] max-w-[100%] md:max-w-[520px] relative z-10 mx-auto">
        <div className="bg-white p-6 sm:p-8 backdrop-blur-sm rounded-lg">
          <div className="mb-6 flex justify-center items-center">
            <h2
              className="text-center"
              style={{
                fontFamily: isAr ? "Almarai" : "Nunito",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#282828",
              }}
            >
              {t.title}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  dir="ltr"
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
                  aria-invalid={errors.username ? "true" : "false"}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                  className={`bg-[#ECECEC] border-2 border-transparent focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none w-full h-11 sm:h-[44px] px-4 rounded-[12px] transition-all duration-200 text-left`}
                />
              </div>
              {errors.username && (
                <p id="username-error" className="mt-1 text-xs text-red-600">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  dir="ltr"
                  aria-label={t.passwordLabel}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className="text-left bg-[#ECECEC] border-2 border-transparent focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none w-full h-11 sm:h-[44px] px-4 pr-12 rounded-[12px] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={
                    showPassword ? t.hidePassword : t.showPassword
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
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
                  {t.loggingIn}
                </>
              ) : (
                t.loginButton
              )}
            </Button>

            <div className="mt-2 text-center">
              <Link
                href="/forget-password"
                className=" font-bold text-[14px] leading-[100%] text-[#35AB4E] hover:bg-transparent bg-transparent underline decoration-[#35AB4E] decoration-1"
                style={{ textAlign: "center" }}
              >
                {t.forgotPassword}
              </Link>
            </div>

            <Link href="/register" className="block w-full">
              <Button
                type="button"
                className=" font-bold w-full h-11 sm:h-[45px] px-3 sm:px-4 rounded-[12px] hover:bg-[#DEDEDE] bg-[#E5E5E5] border-b-[3px] border-b-[rgba(0,0,0,0.08)] text-[#282828] text-[13px] sm:text-[16px] transition duration-200"
              >
                <span className="whitespace-nowrap">{t.noAccount}</span>{" "}
                <span className="font-semibold text-brand hover:text-brand-600 transition-colors mr-1">
                  {t.createAccount}
                </span>
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
