import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "dazlet | Deutsch lernen",
  description: "Deutschkurse und Aktivitäten für die Schweiz.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de-CH">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
