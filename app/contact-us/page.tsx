"use client";

import EnglishContactUs from "@/components/landing-page-zayd/contact-us";
import ChineseContactUs from "@/components/landing-page/ChineseContactUs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ContactUsContent() {
  const searchParams = useSearchParams();
  const isEnglish = searchParams.get("from") === "english";

  if (isEnglish) {
    return <EnglishContactUs />;
  }

  return <ChineseContactUs />;
}

export default function ContactUsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactUsContent />
    </Suspense>
  );
}
