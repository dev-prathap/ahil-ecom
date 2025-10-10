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
  title: "Ahil Diwali Specials - Order Form",
  description: "Order traditional Indian sweets and savories for Diwali celebrations. Handcrafted with love by Ahil Foods.",
  keywords: ["Diwali", "Indian sweets", "savories", "order form", "Ahil Foods", "traditional", "handcrafted"],
  authors: [{ name: "Ahil Foods" }],
  creator: "Ahil Foods",
  publisher: "Ahil Foods",
  openGraph: {
    title: "Ahil Diwali Specials - Order Form",
    description: "Order traditional Indian sweets and savories for Diwali celebrations",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahil Diwali Specials - Order Form",
    description: "Order traditional Indian sweets and savories for Diwali celebrations",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
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
