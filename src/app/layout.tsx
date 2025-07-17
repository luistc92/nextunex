import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import {ClerkProvider} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "Unex",
  description: "Unex",
  icons: [{ rel: "icon", url: "/unexLogo.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
    
  );
}
