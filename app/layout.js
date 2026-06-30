import { Space_Mono } from "next/font/google";
import "./globals.css";

import LayoutWrapper from "../components/LayoutWrapper";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Aayush Saini - Lead UX Designer",
  description: "Portfolio of Aayush Saini, Lead UX Designer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable}`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
