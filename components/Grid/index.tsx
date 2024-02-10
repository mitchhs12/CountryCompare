"use client";

import Image from "next/image";
import Link from "next/link";
import GridController from "@/components/GridController";
import { countries } from "@/utils/data/Countries";
import { formatCountryName } from "@/utils/helpers";

export default function Grid() {
  return (
    <div className="flex-col justify-start">
      <GridController />
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-8 py-10 px-10">
        {countries.map((country, index) => (
          <Link href={`/${country}`} key={country}>
            <div className="relative group">
              <Image src={`/country-icons/${country}.webp`} alt={country} width={200} height={200} />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300 ease-in-out group-hover:bg-opacity-10">
                <span className="text-white text-center text-lg font-semibold">{formatCountryName(country)}</span>
              </div>
              {/* Numbering */}
              <div className="absolute top-0 left-0 m-1 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
                {index + 1}.
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
