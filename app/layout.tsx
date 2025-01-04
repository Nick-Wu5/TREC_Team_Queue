import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";

// Load custom fonts
const aurulentSansMono = localFont({
  src: "./fonts/AurulentSansMono-Regular.otf",
  variable: "--font-aurulent-mono",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const noto = localFont({
  src: "./fonts/NotoSansDisplay.ttf",
  variable: "--font-noto",
});

// Define app metadata
export const metadata: Metadata = {
  title: "TREC Queue",
  description:
    "A dynamic team management and game control application built with Next.js for seamless real-time coordination and enhanced user experience for pickup soccer.",
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${aurulentSansMono.variable} ${noto.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
