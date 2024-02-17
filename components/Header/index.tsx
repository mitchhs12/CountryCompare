"use client";

import { usePathname } from "next/navigation";
import { ThemeSwitch } from "@/components/ThemeSwitcher";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      <header className={`relative flex justify-between items-center h-[64px] px-4 z-[1000]`}>
        <Link href="/">Logo Placeholder</Link>
        <nav className="flex justify-evenly items-center gap-8 h-full text-[.8rem] font-semibold">
          <ThemeSwitch />
        </nav>
        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 divider" />
      </header>
    </>
  );
}
