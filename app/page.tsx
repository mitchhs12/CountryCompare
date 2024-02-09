import Image from "next/image";
import Link from "next/link";
import { countries } from "@/utils/data/Countries";
import Hero from "@/components/Hero";

// Utility function to format country names, with specific handling for certain words
function formatCountryName(country: string) {
  const lowercaseWords = ["a", "the", "of"]; // Words to keep in lowercase unless they are the first word
  return country
    .split("-")
    .map((word, index) => {
      if (index === 0 || !lowercaseWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(" ");
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="flex pt-12 text-2xl">Countries</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-10 py-12">
        {countries.map((country) => (
          <Link href={`/${country}`} key={country}>
            {/* Use Tailwind CSS classes for responsive container sizes */}
            <div className="relative group w-40 h-40">
              <Image src={`/country-icons/${country}.webp`} alt={country} layout="fill" objectFit="cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300 ease-in-out group-hover:bg-opacity-10">
                <span className=" text-white text-center text-lg font-semibold">{formatCountryName(country)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
