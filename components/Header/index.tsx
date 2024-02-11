"use client";

import { usePathname } from "next/navigation";
import { ThemeSwitch } from "@/components/ThemeSwitcher";

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      <header
        className={`relative flex justify-between items-center h-[64px] pr-4 ${
          pathname === "/" ? "pl-2" : "ml-[48px] xl:ml-[176px]"
        } z-[802]`}
      >
        Logo Goes Here
        <nav className="flex justify-evenly items-center gap-8 h-full text-[.8rem] font-semibold">
          <ThemeSwitch />
        </nav>
        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 divider" />
      </header>
    </>
  );
}
