import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from '@clerk/nextjs';
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";

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
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
      <body>
        <ConvexClientProvider>
          {googleMapsApiKey ? (
            <GoogleMapsProvider apiKey={googleMapsApiKey}>
              {children}
            </GoogleMapsProvider>
          ) : (
            children
          )}
        </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
