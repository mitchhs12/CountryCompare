"use client";

import Image from "next/image";
import Link from "next/link";
import { countries } from "@/utils/data/Countries";

export default function Home() {
  console.log("cwd", process.cwd());

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="flex pt-12 text-2xl">Countries</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 py-12 px-24">
        {countries.map((country) => (
          <Link href={`/${country}`} key={country}>
            <div className="flex flex-col items-center justify-center border-2 gap-y-6">
              <Image src={`/country-icons/${country}.webp`} alt={country} width={150} height={150} />
              <span>{country}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
