import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

import Navigation from "@/components/Navigation/Navigation";
import styles from './page.module.css'
import Footer from "@/components/Footer/Footer";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FTS",
  description: "on Lisk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = headers().get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers cookie={cookie}>
          <Navigation />
          <main className={styles.main}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html >
  );
}
