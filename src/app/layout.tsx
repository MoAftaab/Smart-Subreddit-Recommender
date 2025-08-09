import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reddit Community Finder - Discover Perfect Subreddits",
  description: "AI-powered Reddit community recommendation app that helps you find the perfect subreddits for your interests and problems.",
  keywords: ["Reddit", "subreddit", "community", "recommendation", "AI", "Next.js", "TypeScript"],
  authors: [{ name: "Reddit Community Finder" }],
  openGraph: {
    title: "Reddit Community Finder",
    description: "AI-powered app to discover perfect Reddit communities for your interests",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reddit Community Finder",
    description: "AI-powered app to discover perfect Reddit communities for your interests",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
