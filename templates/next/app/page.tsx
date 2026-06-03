import type { Metadata } from "next";
import App from "@/components/App";

export const metadata: Metadata = {
  title: "create-dot-app · Welcome",
  description:
    "Polkadot-native dapp starter — wallet connection, type-safe hooks and deploy scripts, already wired together.",
};

export default function Home() {
  return <App />;
}
