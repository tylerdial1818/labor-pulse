import type { Metadata } from "next";
import { serif } from "@/app/fonts";
import { SiteFooter } from "@/components/layout/site-footer";
import { appConfig } from "@/config/app";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.url),
  title: {
    default: "Labor Pulse | U.S. Labor Market Monitor",
    template: "%s | Labor Pulse"
  },
  description: "A continuously maintained public research service for understanding change in the U.S. labor market.",
  openGraph: {
    type: "website",
    title: "Labor Pulse | U.S. Labor Market Monitor",
    description: "Public labor market research for policy researchers and workforce leaders.",
    siteName: "Labor Pulse",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Labor Pulse U.S. Labor Market Monitor" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Labor Pulse | U.S. Labor Market Monitor",
    description: "Public labor market research for policy researchers and workforce leaders.",
    images: ["/og.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={serif.variable}>
      <body className="bg-paper text-ink">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
