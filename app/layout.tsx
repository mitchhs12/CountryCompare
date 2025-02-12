import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Header from "@/components/Header";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import {ContextProvider} from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Nomad Stats",
  description: "A website dedicated to comparing attributes across countries for nomads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-stone-100 dark:bg-stone-950`}>
        <ContextProvider attribute="class" defaultTheme="system" enableSystem>
          <Header/>
          {children}
        </ContextProvider>
        <SpeedInsights/>
        <Analytics />
      </body>
    </html>
  );
}
