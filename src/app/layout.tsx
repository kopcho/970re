import type { Metadata } from "next";
import { Fraunces, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import TalkToRich from "@/components/TalkToRich";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://970.re"),
  title: {
    template: "%s | 970.re",
    default: "970.re — Know the 970 | Northern Colorado Real Estate",
  },
  description:
    "Rich Kopcho, Broker — 50 years of Northern Colorado real estate. Buy, sell, and invest in Fort Collins, Loveland, Berthoud, Wellington, and the 970 area code. Better Homes & Gardens Real Estate — Neuhaus.",
  keywords: [
    "Northern Colorado real estate",
    "Fort Collins homes for sale",
    "Loveland CO real estate",
    "Berthoud homes",
    "Wellington CO",
    "Timnath real estate",
    "Larimer County homes",
    "970 area code",
    "BHGRE — Neuhaus",
    "Rich Kopcho broker",
  ],
  alternates: {
    canonical: "https://970.re",
  },
  openGraph: {
    title: "970.re — Know the 970 | Northern Colorado Real Estate",
    description:
      "Rich Kopcho, Broker — 50 years of Northern Colorado real estate. Buy, sell, and invest in Fort Collins, Loveland, Berthoud, Wellington, and the 970 area code. Better Homes & Gardens Real Estate — Neuhaus.",
    url: "https://970.re",
    siteName: "970.re",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/rich-kopcho.jpg",
        width: 1200,
        height: 630,
        alt: "Rich Kopcho, Broker — 970.re Northern Colorado Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "970.re — Know the 970 | Northern Colorado Real Estate",
    description:
      "Rich Kopcho, Broker — 50 years of Northern Colorado real estate. Buy, sell, and invest in Fort Collins, Loveland, Berthoud, Wellington, and the 970 area code.",
    images: ["/images/rich-kopcho.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "GOOGLE_VERIFICATION_CODE",
  },
  other: {
    "geo.region": "US-CO",
    "geo.placename": "Loveland, Colorado",
    "geo.position": "40.3978;-105.0749",
    ICBM: "40.3978, -105.0749",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${dmMono.variable} ${dmSans.variable} antialiased`}
      >
        <Nav />
        {children}
        <TalkToRich />
      </body>
    </html>
  );
}
