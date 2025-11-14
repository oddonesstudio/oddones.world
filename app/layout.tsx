import { Bowlby_One, Roboto } from "next/font/google";

import { client } from "@/sanity/client";
import { getMetadata } from "@/sanity/getMetadata";
import type { SiteSettings } from "@/studio/sanity.types";

import { Header } from "./components/Header";
import "./globals.css";

const bowlby = Bowlby_One({
  variable: "--font-bowlby",
  subsets: ["latin"],
  weight: "400",
});

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata() {
  return getMetadata();
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const query = `*[_type == "siteSettings"][0]{
      navigation[] {
        _key,
        label,
        "slug": page->slug.current,
        iconType,
        pixelIcon->{
          title,
          svg
        },
        "uploadedIcon": uploadedIcon.asset->url
      },
      footerText,
      socialLinks[] {
        platform,
        url,
        iconType,
        pixelIcon->{
          title,
          svg
        },
        "uploadedIcon": uploadedIcon.asset->url
      }
    }`;

  const siteSettings: SiteSettings = await client.fetch(query);

  return (
    <html lang="en">
      <body className={`${bowlby.variable} ${roboto.variable}`}>
        <Header nav={siteSettings.navigation} />
        <main>{children}</main>
      </body>
    </html>
  );
}
