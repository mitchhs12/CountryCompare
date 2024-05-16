import { cache } from "react";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";

// const getCountryData = cache(async () => {
//   await connect();
//   const countries = await Country.find({});
//   return countries;
// });

export default async function Home() {
  //const countries = await getCountryData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center w-full h-full">
      <h1 className="flex pt-12 text-2xl">Countries</h1>
      <Hero />
      <Grid />
    </main>
  );
}
