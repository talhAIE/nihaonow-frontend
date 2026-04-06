"use client";

import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import navLogoPng from "@/assets/landingpage-zayd/zayd-logo.png";

const menuItems = [
  { name: "Home", href: "#home", isRoute: false },
  { name: "Features", href: "#features", isRoute: false },
  { name: "Tutors", href: "#tutors", isRoute: false },
  { name: "Challenge", href: "#challenge", isRoute: false },
  { name: "Compliance", href: "#compliance", isRoute: false },
  { name: "Join Now", href: "#join-now", isRoute: false },
  { name: "Contact Us", href: "/contact-us", isRoute: true },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const router = useRouter();

  const isMainPath = pathname === "/" || pathname === "/english" || pathname === "/chinese";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (href: string, isRoute: boolean = false) => {
    if (isRoute) {
      router.push(href);
      setIsMobileMenuOpen(false);
      return;
    }
    if (href === "#home") {
      if (!isMainPath) {
        router.push("/english");
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (!isMainPath) {
        router.push("/english");
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isMainPath) return;

    const sections = menuItems
      .filter((item) => !item.isRoute)
      .map((item) => item.href.substring(1));

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isMainPath]);

  return (
    <nav className="w-full h-16 sm:h-20 shadow-sm sticky top-0 bg-white z-[9999] flex items-center">
      <div className="flex items-center w-full px-4 sm:px-6 relative">
        
        {/* Logo - Left aligned */}
        <div className="absolute left-4 md:relative md:left-auto w-24 sm:w-32 lg:w-40 h-8 sm:h-10 lg:h-14 flex items-center cursor-pointer z-10" dir="ltr" onClick={() => scrollToSection("#home")}>
          <Image
            src={navLogoPng}
            alt="Zayd AI Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 xl:gap-4 bg-[#E1EEFF] px-4 xl:px-6 py-2 rounded-full text-gray-700 font-medium text-sm xl:text-base whitespace-nowrap z-10">
          {menuItems.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = item.isRoute
              ? pathname === item.href
              : isMainPath && activeSection === sectionId;

            if (item.isRoute) {
              const targetHref = (pathname === "/english" && item.href === "/contact-us")
                ? "/contact-us?from=english"
                : item.href;

              return (
                <li key={item.name}>
                  <NextLink
                    href={targetHref}
                    className={`cursor-pointer px-2 xl:px-3 py-1 rounded-full transition-colors block whitespace-nowrap ${
                      isActive ? "bg-[#058BF4] text-white" : "hover:text-blue-800"
                    }`}
                  >
                    {item.name}
                  </NextLink>
                </li>
              );
            }

            return (
              <li
                key={item.name}
                className={`cursor-pointer px-2 xl:px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
                  isActive ? "bg-[#058BF4] text-white" : "hover:text-blue-800"
                }`}
                onClick={() => scrollToSection(item.href, item.isRoute)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>

        {/* Desktop buttons - far right */}
        <div className="hidden lg:flex gap-2.5 items-center ms-auto">
          <NextLink href="/login">
            <button
              className="bg-white rounded-full px-6 py-[8px] text-[15px] font-medium transition-colors hover:bg-[#F0F7FF]"
              style={{ border: "1px solid #058BF4", color: "#058BF4" }}
            >
              Sign In
            </button>
          </NextLink>
          <NextLink href="/register">
            <button
              className="rounded-full px-6 py-[9px] text-[15px] font-medium text-white transition-opacity hover:opacity-90 border-none"
              style={{ background: "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)" }}
            >
              Signup
            </button>
          </NextLink>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center gap-1 ms-auto">
            <button
              className="flex flex-col justify-center items-center w-8 h-8 space-y-1 shrink-0"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </div>

      {/* Mobile menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`flex flex-col h-full transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Mobile header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="w-24 h-8 sm:w-32 sm:h-10 flex items-center" dir="ltr">
              <Image src={navLogoPng} alt="Zayd AI Logo" className="w-full h-full object-contain" />
            </div>
            <button
              onClick={toggleMobileMenu}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Close mobile menu"
            >
              <span className="text-3xl">&times;</span>
            </button>
          </div>

          {/* Mobile nav items */}
          <div className="flex-1 flex flex-col justify-center items-center space-y-6 py-8">
            {menuItems.map((item, index) => {
              const sectionId = item.href.substring(1);
              const isActive = item.isRoute
                ? pathname === item.href
                : isMainPath && activeSection === sectionId;

              if (item.isRoute) {
                const targetHref = (pathname === "/english" && item.href === "/contact-us")
                  ? "/contact-us?from=english"
                  : item.href;

                return (
                  <NextLink
                    key={item.name}
                    href={targetHref}
                    className={`text-xl font-medium transition-all duration-300 ${
                      isActive ? "text-[#058BF4]" : "text-gray-700 hover:text-[#058BF4]"
                    } ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : "0ms" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NextLink>
                );
              }

              return (
                <button
                  key={item.name}
                  className={`text-xl font-medium transition-all duration-300 ${
                    isActive ? "text-[#058BF4]" : "text-gray-700 hover:text-[#058BF4]"
                  } ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : "0ms" }}
                  onClick={() => scrollToSection(item.href, item.isRoute)}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Mobile buttons */}
          <div
            className={`flex flex-col gap-3 p-6 border-t transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "400ms" : "0ms" }}
          >
            <NextLink href="/login">
              <Button
                variant="outline"
                className="rounded-full border-[#058BF4] text-[#058BF4] hover:text-[#058BF4] w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Button>
            </NextLink>
            <NextLink href="/register">
              <Button
                className="rounded-full text-white hover:opacity-90 transition-opacity w-full"
                style={{ background: "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Signup
              </Button>
            </NextLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
