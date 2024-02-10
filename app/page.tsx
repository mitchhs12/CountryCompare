import Grid from "@/components/Grid";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center w-full h-full">
      <h1 className="flex pt-12 text-2xl">Countries</h1>
      <Hero />
      <Grid />
    </main>
  );
}
