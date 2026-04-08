import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ambiki Goals V2 Prototype",
  description: "Patient Goals V2 interactive prototype for Ambiki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
