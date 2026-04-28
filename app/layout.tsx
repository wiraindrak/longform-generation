import type { Metadata } from "next";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "INFOGRAPHIC — AI Visual Generator",
  description:
    "Turn any topic into a publication-ready infographic for Indonesian media brands. Powered by Kimi K2.5 and GPT Image.",
  openGraph: {
    title: "INFOGRAPHIC — AI Visual Generator",
    description:
      "Turn any topic into a publication-ready infographic for Indonesian media brands.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Nav />
        {children}
      </body>
    </html>
  );
}
