import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sheen",
  description:
    "This is an e-commerce project made by Randy Olais. Just a personal project simulating an e-commerce store.",
  authors: [{ name: "Randy Olais" }],
  keywords: ["ecommerce", "Next.js", "personal project", "sheen store"],
  robots: "index, follow",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav/>
        <main>
       {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
