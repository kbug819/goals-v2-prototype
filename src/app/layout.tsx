import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goals V2 Prototype",
  description: "Patient Goals V2 interactive prototype",
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
