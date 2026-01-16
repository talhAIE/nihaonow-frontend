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
import { Button } from "@/components/ui/button";

export default function StudentAccountPage() {
    const { state } = useAppContext();
    const user = state.authUser;
    const displayName = state.user || user?.username || "الطالب";
    const userEmail = user?.email || "student@example.com";

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetEmail, setResetEmail] = useState(user?.email || "");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { toast } = useToast();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
            return;
        }

        if (!oldPassword) {
            setMessage({ type: 'error', text: 'يرجى إدخال كلمة المرور الحالية' });
            return;
        }

        setIsLoading(true);

        try {
            await authApi.changePassword({ currentPassword: oldPassword, newPassword });

            setMessage({ type: 'success', text: 'تم تحديث كلمة المرور بنجاح' });
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error: any) {
            console.error('Password change error:', error);
            const errorMsg = error.message || error?.response?.data?.message || 'فشل تحديث كلمة المرور. تأكد من كلمة المرور الحالية.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendResetLink = async () => {
        const trimmedEmail = resetEmail.trim();
        if (!trimmedEmail) {
            toast({ title: 'خطأ في التحقق', description: 'يرجى إدخال بريدك الإلكتروني', variant: 'destructive', duration: 5000 });
            return;
        }

        setIsLoading(true);
        try {
            const res = await authApi.forgetPassword({ email: trimmedEmail });
            toast({
                title: 'تم بنجاح',
                description: res?.message || 'إذا كان هذا البريد الإلكتروني موجوداً، فقد تم إرسال رابط إعادة التعيين.',
                duration: 5000
            });
        } catch (error: any) {
            console.error('Reset link error:', error);
            let description = error.message || error?.response?.data?.message || 'فشل إرسال الرابط. حاول مرة أخرى.';

            // Fallback translation for common English error message from backend
            if (description === 'Failed to send password reset email. Please try again later.') {
                description = 'فشل إرسال بريد إلكتروني لإعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى لاحقاً.';
            }

            toast({
                title: 'خطأ',
                description: description,
                variant: 'destructive',
                duration: 5000
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-8 pt-6" dir="rtl">
            <div>
                <h2 className="text-2xl font-black text-slate-800 ">إعدادات الحساب</h2>
                <p className="text-slate-500 font-bold text-sm">تحديث ملفك الشخصي وإعدادات الأمان</p>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                {/* Simple Profile Header */}
                <div className="bg-slate-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100">
                    <div className="w-24 h-24 rounded-full bg-[#35AB4E] p-1 flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {user?.image ? (
                                <Image src={user.image} alt={displayName} width={96} height={96} className="object-cover w-full h-full" />
                            ) : (
                                <User size={40} className="text-[#35AB4E]" />
                            )}
                        </div>
                    </div>
                    <div className="text-center sm:text-right space-y-1">
                        <h3 className="text-xl font-black text-slate-800">{displayName}</h3>
                        <p className="text-slate-500 font-bold text-sm flex items-center justify-center sm:justify-start gap-1.5">
                            <Mail className="w-4 h-4" />
                            {userEmail}
                        </p>
                        <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3">
                            <span className="bg-[#35AB4E]/10 text-[#35AB4E] px-4 py-1.5 rounded-full backdrop-blur-md border border-[#35AB4E]/20 text-sm font-black">
                                طالب
                            </span>
                            <span className="bg-[#35AB4E]/10 text-[#35AB4E] px-4 py-1.5 rounded-full backdrop-blur-md border border-[#35AB4E]/20 text-sm font-black">
                                نشط
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-10">
                    {/* Password Section */}
                    <section className="space-y-6">
                        <div className="space-y-1">
                            <h4 className="text-lg font-black text-slate-800">كلمة المرور</h4>
                            <p className="text-slate-400 text-xs font-bold">تغيير كلمة المرور الخاصة بك أو إعادة تعيينها.</p>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-xl">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-600">كلمة المرور الحالية</label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="w-full pl-12 pr-10 py-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#35AB4E] transition-all placeholder:text-slate-300"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#35AB4E] transition-colors"
                                        >
                                            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-600">كلمة المرور الجديدة</label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-12 pr-10 py-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#35AB4E] transition-all placeholder:text-slate-300"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#35AB4E] transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-600">تأكيد كلمة المرور</label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-10 py-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#35AB4E] transition-all placeholder:text-slate-300"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#35AB4E] transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
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
                                    className="flex items-center justify-center gap-2 bg-[#35AB4E] text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-[#2d9344] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>حفظ كلمة المرور</span>
                                </button>
                            </div>
                        </form>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Separate Forget Password Section to match main screen flow */}
                    <section className="space-y-6">
                        <div className="space-y-1">
                            <h4 className="text-lg font-black text-slate-800">إعادة تعيين كلمة المرور</h4>
                            <p className="text-slate-400 text-xs font-bold">سنرسل لك رابطاً لإعادة تعيين كلمة المرور عبر البريد الإلكتروني.</p>
                        </div>

                        <div className="space-y-4 max-w-xl">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-600">البريد الإلكتروني</label>
                                <div className="relative">
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        dir="ltr"
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="w-full pl-4 pr-10 py-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#35AB4E] transition-all placeholder:text-slate-300"
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
                                <span>إرسال رابط إعادة تعيين</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
