import "../styles/globals.css";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import AppHeader from "../components/nav/AppHeader";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: "RecoveryOS",
  description: "Daily recovery check-ins and insights.",
  manifest: "/manifest.json",
  metadataBase: new URL(siteUrl)
};

export const viewport: Viewport = {
  themeColor: "#f4f6f8"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;600&family=Space+Grotesk:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <main className="px-5 py-8 md:px-10">
            <AppHeader />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
