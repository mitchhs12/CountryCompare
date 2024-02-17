"use client";
import { usePathname } from "next/navigation";
import { formatCountryName } from "@/utils/helpers";

export default function Calculator() {
  const pathname = formatCountryName(usePathname().split("/")[1]);

  return (
    <div className="flex-col justify-start">
      <h1 className="text-2xl">{pathname}</h1>
    </div>
  );
}
