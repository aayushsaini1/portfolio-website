import { Space_Mono } from "next/font/google";
import "./globals.css";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Aayush Saini - UX Designer",
  description: "Portfolio of Aayush Saini, Lead UX Designer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable}`}>
        <div className="app-container">
          <Sidebar />
          
          <main className="main-content">
            {children}
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
