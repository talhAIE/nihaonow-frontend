"use client";

import React, { useState } from "react";
import {
    User,
    Mail,
    Shield,
    LogOut,
    Lock,
    Save,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { authApi } from "@/lib/services/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";

export default function TeacherAccountPage() {
    const { state, dir } = useAppContext();
    const isAr = dir === "rtl";
    const user = state.authUser;
    const displayName = state.user || user?.username || (isAr ? "المعلم" : "Teacher");
    const userEmail = user?.email || "teacher@example.com";

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetEmail, setResetEmail] = useState(user?.email || "");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { toast } = useToast();

    const t = isAr
        ? {
            accountSettings: "إعدادات الحساب",
            accountSubtitle: "تحديث ملفك الشخصي وإعدادات الأمان",
            password: "كلمة المرور",
            passwordHelp: "تغيير كلمة المرور الخاصة بك أو إعادة تعيينها.",
            currentPassword: "كلمة المرور الحالية",
            newPassword: "كلمة المرور الجديدة",
            confirmPassword: "تأكيد كلمة المرور",
            savePassword: "حفظ كلمة المرور",
            resetPassword: "إعادة تعيين كلمة المرور",
            resetHelp: "سنرسل لك رابطاً لإعادة تعيين كلمة المرور عبر البريد الإلكتروني.",
            email: "البريد الإلكتروني",
            sendReset: "إرسال رابط إعادة تعيين",
            errorMismatch: "كلمات المرور غير متطابقة",
            errorMinLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
            errorMissingOld: "يرجى إدخال كلمة المرور الحالية",
            successUpdate: "تم تحديث كلمة المرور بنجاح",
            errorUpdate: "فشل تحديث كلمة المرور. تأكد من كلمة المرور الحالية.",
            verifyError: "خطأ في التحقق",
            verifyEmail: "يرجى إدخل بريدك الإلكتروني",
            resetSuccessTitle: "تم بنجاح",
            resetSuccessDesc: "إذا كان هذا البريد الإلكتروني موجوداً، فقد تم إرسال رابط إعادة التعيين.",
            resetErrorTitle: "خطأ",
            resetErrorFallback: "فشل إرسال الرابط. حاول مرة أخرى.",
            resetErrorEnglishFallback: "فشل إرسال بريد إلكتروني لإعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى لاحقاً.",
        }
        : {
            accountSettings: "Account Settings",
            accountSubtitle: "Update your profile and security settings",
            password: "Password",
            passwordHelp: "Change or reset your password.",
            currentPassword: "Current password",
            newPassword: "New password",
            confirmPassword: "Confirm password",
            savePassword: "Save password",
            resetPassword: "Reset password",
            resetHelp: "We will email you a reset link.",
            email: "Email",
            sendReset: "Send reset link",
            errorMismatch: "Passwords do not match",
            errorMinLength: "Password must be at least 6 characters",
            errorMissingOld: "Please enter your current password",
            successUpdate: "Password updated successfully",
            errorUpdate: "Failed to update password. Check your current password.",
            verifyError: "Verification error",
            verifyEmail: "Please enter your email",
            resetSuccessTitle: "Success",
            resetSuccessDesc: "If that email exists, a reset link was sent.",
            resetErrorTitle: "Error",
            resetErrorFallback: "Failed to send link. Please try again.",
            resetErrorEnglishFallback: "Failed to send password reset email. Please try again later.",
        };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: t.errorMismatch });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: t.errorMinLength });
            return;
        }

        if (!oldPassword) {
            setMessage({ type: 'error', text: t.errorMissingOld });
            return;
        }

        setIsLoading(true);

        try {
            await authApi.changePassword({ currentPassword: oldPassword, newPassword });

            setMessage({ type: 'success', text: t.successUpdate });
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error: any) {
            console.error('Password change error:', error);
            const errorMsg = error.message || error?.response?.data?.message || t.errorUpdate;
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendResetLink = async () => {
        const trimmedEmail = resetEmail.trim();
        if (!trimmedEmail) {
            toast({ title: t.verifyError, description: t.verifyEmail, variant: 'destructive', duration: 5000 });
            return;
        }

        setIsLoading(true);
        try {
            const res = await authApi.forgetPassword({ email: trimmedEmail });
            toast({
                title: t.resetSuccessTitle,
                description: res?.message || t.resetSuccessDesc,
                duration: 5000
            });
        } catch (error: any) {
            console.error('Reset link error:', error);
            let description = error.message || error?.response?.data?.message || t.resetErrorFallback;

            // Fallback translation for common English error message from backend
            if (description === t.resetErrorEnglishFallback) {
                description = isAr ? t.resetErrorEnglishFallback : t.resetErrorFallback;
            }

            toast({
                title: t.resetErrorTitle,
                description: description,
                variant: 'destructive',
                duration: 5000
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={`relative max-w-4xl mx-auto space-y-8 ${isAr ? "font-almarai" : "font-nunito"}`} dir={dir} lang={isAr ? "ar" : "en"}>
            <div className={`flex ${isAr ? "justify-start" : "justify-end"}`}>
                <AuthLanguageToggle activeBgClass="bg-[#FFCB08]" activeShadowClass="shadow-[0_2px_0_0_#DEA407]" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-800">{t.accountSettings}</h2>
                <p className="text-slate-500 font-bold text-sm">{t.accountSubtitle}</p>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                {/* Simple Profile Header: Keep existing code for header, only showing form changes */}
                <div className="bg-slate-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100">
                    <div className="w-24 h-24 rounded-full bg-[#FFCB08] p-1 flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {user?.image ? (
                                <Image src={user.image} alt={displayName} width={96} height={96} className="object-cover w-full h-full" />
                            ) : (
                                <User size={40} className="text-[#8D1716]" />
                            )}
                        </div>
                    </div>
                    <div className={`text-center ${isAr ? "sm:text-right" : "sm:text-left"} space-y-1`}>
                        <h3 className="text-xl font-black text-slate-800">{displayName}</h3>
                        <p className={`text-slate-500 font-bold text-sm flex items-center justify-center ${isAr ? "sm:justify-end flex-row-reverse" : "sm:justify-start"} gap-1.5`}>
                            <Mail className="w-4 h-4" />
                            {userEmail}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-10">
                    {/* Password Section */}
                    <section className="space-y-6">
                        <div className="space-y-1">
                            <h4 className="text-lg font-black text-slate-800">{t.password}</h4>
                            <p className="text-slate-400 text-xs font-bold">{t.passwordHelp}</p>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-xl">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-600">{t.currentPassword}</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors`}
                                        >
                                            {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            dir="ltr"
                                            className={`w-full ${isAr ? "pl-10 pr-12" : "pl-12 pr-10"} py-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCB08] transition-all placeholder:text-slate-300`}
                                            placeholder="••••••••"
                                        />
                                        <Lock className={`absolute ${isAr ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-600">{t.newPassword}</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors`}
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            dir="ltr"
                                            className={`w-full ${isAr ? "pl-10 pr-12" : "pl-12 pr-10"} py-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCB08] transition-all placeholder:text-slate-300`}
                                            placeholder="••••••••"
                                        />
                                        <Lock className={`absolute ${isAr ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-600">{t.confirmPassword}</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors`}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            dir="ltr"
                                            className={`w-full ${isAr ? "pl-10 pr-12" : "pl-12 pr-10"} py-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCB08] transition-all placeholder:text-slate-300`}
                                            placeholder="••••••••"
                                        />
                                        <Lock className={`absolute ${isAr ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    <Shield className="w-3.5 h-3.5" />
                                    {message.text}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-2 bg-[#FFCB08] text-[#8D1716] px-6 py-2.5 rounded-xl text-sm font-black hover:bg-[#F0BF07] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{t.savePassword}</span>
                                </button>
                            </div>
                        </form>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Separate Forget Password Section to match main screen flow */}
                    <section className="space-y-6">
                        <div className="space-y-1">
                            <h4 className="text-lg font-black text-slate-800">{t.resetPassword}</h4>
                            <p className="text-slate-400 text-xs font-bold">{t.resetHelp}</p>
                        </div>

                        <div className="space-y-4 max-w-xl">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-600">{t.email}</label>
                                <div className="relative">
                                    <Mail className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                                    <Input
                                        dir="ltr"
                                        type="email"
                                        value={resetEmail}
                                        readOnly
                                        className={`w-auto ${isAr ? "pl-4 pr-10" : "pl-10 pr-4"} py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm focus:outline-none cursor-not-allowed select-none`}
                                        placeholder="your-email@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSendResetLink}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                <span>{t.sendReset}</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
