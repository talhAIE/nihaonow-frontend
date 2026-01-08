"use client";
import React, { useEffect, useState } from "react";
import { teacherApi } from "@/lib/api";
import { StudentTable } from "@/components/teacher/StudentTable";
import { AnalyticsOverview } from "@/components/teacher/AnalyticsOverview";
import { StatCard } from "@/components/teacher/StatCard";
import { Users, BookOpen, Clock, Activity, TrendingUp } from "lucide-react";

export default function TeacherDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsData, studentsData] = await Promise.all([
          teacherApi.getAnalytics(),
          teacherApi.getStudents()
        ]);
        setAnalytics(analyticsData);
        setStudents(studentsData);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35AB4E]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">لوحة المعلم</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="إجمالي الطلاب"
          value={analytics?.totalStudents || "128"}
          icon={Users}
          description="الطلاب المسجلين"
          className="bg-white shadow-sm border-none"
        />
        <StatCard
          title="قاموا بتسجيل الدخول"
          value={analytics?.loggedInCount || "112"}
          icon={Activity}
          description="طلاب نشطين في النظام"
          className="bg-white shadow-sm border-none"
        />
        <StatCard
          title="لم يسجلوا الدخول بعد"
          value={analytics?.yetToLoginCount || "16"}
          icon={Users}
          description="طلاب مضافين لم يبدأوا بعد"
          className="bg-white shadow-sm border-none"
        />
        <StatCard
          title="إجمالي الاستخدام"
          value={`${analytics?.totalUsageHours || "1,240"} س`}
          icon={Clock}
          description="ساعات التعلم الكلية"
          className="bg-white shadow-sm border-none"
        />
        <StatCard
          title="المواضيع المكتملة"
          value={analytics?.topicsCompleted || "856"}
          icon={BookOpen}
          description="تقدماً ممتازاً"
          className="bg-white shadow-sm border-none"
        />
        <StatCard
          title="معدل التفاعل"
          value={analytics?.engagementRate || "82%"}
          icon={TrendingUp}
          description="نسبة المشاركة والتفاعل"
          className="bg-white shadow-sm border-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <AnalyticsOverview className="col-span-4 bg-white shadow-sm rounded-xl p-6" />
        <div className="col-span-3 bg-white shadow-sm rounded-xl p-6 border border-gray-100 italic flex flex-col items-center justify-center text-gray-400 gap-4 text-center">
            <Activity className="h-12 w-12 text-gray-200" />
            <p>مخطط تفاعل الطلاب قريباً</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">الطلاب المعينون</h3>
          <p className="text-sm text-gray-500">تفاصيل أداء جميع الطلاب في فصولك الدراسية.</p>
        </div>
        <StudentTable students={students} />
      </div>
    </div>
  );
}
