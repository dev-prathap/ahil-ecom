import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahil Diwali Specials - Order Form | SWIX (Sidewayssix)",
  description: "Order traditional Indian sweets and savories for Diwali. Crafted by Ahil Foods with digital experience by SWIX (Sidewayssix).",
  keywords: ["Diwali", "Indian sweets", "savories", "order form", "Ahil Foods", "SWIX", "Sidewayssix", "traditional", "handcrafted"],
  authors: [{ name: "Ahil Foods" }],
  creator: "Ahil Foods & SWIX (Sidewayssix)",
  publisher: "Ahil Foods in partnership with SWIX (Sidewayssix)",
  openGraph: {
    title: "Ahil Diwali Specials • Crafted with SWIX (Sidewayssix)",
    description: "Premium Diwali sweets and savories by Ahil Foods with a digital storefront engineered by SWIX (Sidewayssix).",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    description: "Shop handcrafted Diwali treats online, designed by SWIX (Sidewayssix).",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪔</text></svg>" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased festive-gradient min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
