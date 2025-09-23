import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { BackendAuthProvider } from "@/hooks/useBackendAuth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sivan InfoTech - Cloud Training & Certification",
  description: "Transform your career with comprehensive cloud training programs. AWS, Azure, GCP certifications with 100% placement support.",
  keywords: "cloud training, AWS certification, Azure certification, GCP certification, cloud computing, IT training, placement support",
  authors: [{ name: "Sivan InfoTech" }],
  creator: "Sivan InfoTech",
  publisher: "Sivan InfoTech",
  icons: {
    icon: [
      { url: "/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png", sizes: "32x32", type: "image/png" },
      { url: "/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png"
  },
  openGraph: {
    title: "Sivan InfoTech - Cloud Training & Certification",
    description: "Transform your career with comprehensive cloud training programs. AWS, Azure, GCP certifications with 100% placement support.",
    url: "https://sivaninfotech.com",
    siteName: "Sivan InfoTech",
    images: [
      {
        url: "/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png",
        width: 1200,
        height: 630,
        alt: "Sivan InfoTech - Cloud Training"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sivan InfoTech - Cloud Training & Certification",
    description: "Transform your career with comprehensive cloud training programs. AWS, Azure, GCP certifications with 100% placement support.",
    images: ["/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackendAuthProvider>
          {children}
        </BackendAuthProvider>
      </body>
    </html>
  );
}
