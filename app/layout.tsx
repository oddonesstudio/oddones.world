import { Bowlby_One, Roboto } from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

import { getMetadata } from "@/sanity/getMetadata";
import { sanityFetch, SanityLive } from "@/sanity/live";

import { Header } from "./components/Header";
import { PageTransitionFooter } from "./components/PageTransitionFooter";

import "./globals.css";
import { siteSettingsQuery } from "@/studio/queries/siteSettings";
import { SiteSettingsQueryResult } from "@/studio/sanity.types";

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
  const { data: siteSettings } = await sanityFetch<SiteSettingsQueryResult>({
    query: siteSettingsQuery,
    stega: false,
  });
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="en">
      <body className={`${bowlby.variable} ${roboto.variable} bg-black`}>
        <Header nav={siteSettings?.navigation} />
        <main>{children}</main>
        <PageTransitionFooter />
        <SanityLive />
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
