import { Bowlby_One, Inter, Roboto_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { DOM_IDS } from "@/app/constants/ui";

import { getMetadata } from "@/sanity/getMetadata";
import { SanityLive, sanityFetch } from "@/sanity/live";

import { siteSettingsQuery } from "@/studio/queries/groq";
import type { SiteSettingsQueryResult } from "@/studio/sanity.types";

import { Header } from "@/ui/global/Header";

import { WavyFooter } from "../ui/global/WavyFooter";

import { AppUiProvider } from "./components/AppUiContext";
import { ModalSlotPresence } from "./components/ModalSlotPresence";
import { MotionLayoutRoot } from "./components/MotionLayoutRoot";
import { SanityPreviewExit } from "./components/SanityPreviewExit";
import { resolveButtonHref } from "./utils/resolveButtonHref";

import "./styles/globals.css";

const bowlby = Bowlby_One({
  variable: "--font-bowlby",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata() {
  return getMetadata();
}

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const { data: siteSettings } = await sanityFetch<SiteSettingsQueryResult>({
    query: siteSettingsQuery,
    stega: false,
  });
  const isDraftMode = (await draftMode()).isEnabled;

  const headerCTA = siteSettings?.headerCTA
    ? {
        label: siteSettings.headerCTA.label ?? undefined,
        href: resolveButtonHref(siteSettings.headerCTA),
        action: siteSettings.headerCTA.action,
      }
    : null;

  return (
    <html lang="en">
      <body className={`${bowlby.variable} ${inter.variable} ${robotoMono.variable}`}>
        <AppUiProvider errorFallback={siteSettings?.errorFallback}>
          {/* <div className="h-20 sticky top-0 bg-black">Header</div> */}
          <Header nav={siteSettings?.navigation} headerCTA={headerCTA} />
          <MotionLayoutRoot>
            <main>{children}</main>
            <ModalSlotPresence>{modal}</ModalSlotPresence>
            <div id={DOM_IDS.modalRoot} />
          </MotionLayoutRoot>
          <WavyFooter copyright={siteSettings?.copyright} />
        </AppUiProvider>
        <SanityLive />
        {isDraftMode ? (
          <>
            <SanityPreviewExit />
            <VisualEditing />
          </>
        ) : null}
      </body>
    </html>
  );
}
