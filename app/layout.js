import { Space_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import LayoutWrapper from "../components/LayoutWrapper";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aayushsaini.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aayush Saini — Lead UX Designer",
    template: "%s | Aayush Saini — UX Designer"
  },
  description: "Portfolio of Aayush Saini, Lead UX Designer and Product Designer based in Bangalore, India. Designing accessible B2B SaaS experiences & digital products.",
  keywords: [
    "Aayush Saini",
    "Aayush Saini designer",
    "UX Designer",
    "Product Designer",
    "Bangalore Designer",
    "Bangalore UX Designer",
    "UX Designer Bangalore",
    "Lead UX Designer",
    "UX Designer India"
  ],
  authors: [{ name: "Aayush Saini", url: "https://x.com/aayushsaini_" }],
  creator: "Aayush Saini",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Aayush Saini — Lead UX Designer in Bangalore",
    description: "Portfolio of Aayush Saini, Lead UX Designer and Product Designer based in Bangalore, India.",
    siteName: "Aayush Saini Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aayush Saini — Lead UX Designer in Bangalore",
    description: "Portfolio of Aayush Saini, Lead UX Designer based in Bangalore, India.",
    creator: "@aayushsaini_",
  },
  icons: {
    icon: "/icon.svg"
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aayush Saini',
  url: siteUrl,
  jobTitle: 'Lead UX Designer',
  worksFor: {
    '@type': 'Organization',
    name: 'Josys',
    url: 'https://josys.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    addressCountry: 'India',
  },
  sameAs: [
    'https://x.com/aayushsaini_',
    'https://linkedin.com/in/aayushsaini',
  ],
  knowsAbout: [
    'UX Design',
    'Product Design',
    'User Experience',
    'Design Systems',
    'B2B SaaS',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${spaceMono.variable}`}>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
