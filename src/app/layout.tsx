import type { Metadata } from "next";
import { Caveat, Instrument_Serif, Libre_Franklin, Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  preload: false
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
  preload: false
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-libre",
  display: "swap",
  preload: false
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
  preload: false
});

export const metadata: Metadata = {
  title: "Saathvik Visuals | Digital Experiences & Product Design",
  description:
    "Premium UI/UX portfolio for Saathvik Visuals, featuring cinematic product concepts, client-style websites, theme modes, and multilingual storytelling.",
  icons: {
    icon: "/brand-favicon.png"
  },
  openGraph: {
    title: "Saathvik Visuals",
    description: "Digital Experiences & Product Design",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${raleway.variable} ${libreFranklin.variable} ${instrument.variable} ${caveat.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
