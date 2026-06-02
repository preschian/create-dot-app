import React from "react";
import Provider from "../components/provider";
import { cookieToWeb3AuthState } from "@web3auth/modal";
import "./globals.css";

import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "create-dot-app · Welcome",
  description: "Polkadot-native dapp starter — wallet connection, type-safe hooks and deploy scripts, already wired together.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const web3authInitialState = cookieToWeb3AuthState(headersList.get("cookie"));
  return (
    <html lang="en">
      <body className={`${grotesk.variable} ${mono.variable} font-sans antialiased`}>
        <Provider web3authInitialState={web3authInitialState}>{children}</Provider>
      </body>
    </html>
  );
}
