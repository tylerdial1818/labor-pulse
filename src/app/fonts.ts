import { Newsreader } from "next/font/google";

export const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--lp-serif-font",
  display: "swap"
});
