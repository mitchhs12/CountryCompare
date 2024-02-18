"use client";
import { usePathname } from "next/navigation";
import { formatCountryName } from "@/utils/helpers";
import LocationGlobe from "@/components/Globe/LocationGlobe";

export default function Calculator() {
  const pathname = formatCountryName(usePathname().split("/")[1]);

  return (
    <div className="flex justify-between items-center gap-10">
      <h1 className="text-2xl">{pathname}</h1>
      <LocationGlobe />
    </div>
  );
}
