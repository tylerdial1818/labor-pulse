import type { Metadata } from "next";
import { serif } from "@/app/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Labor Pulse",
  description: "A public US labor market monitor for researchers and executive briefings."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={serif.variable}>
      <body>{children}</body>
    </html>
  );
}
