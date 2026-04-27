import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LONGFORM — AI Content Generator",
  description:
    "Generate stunning long-form visual content for Indonesian media brands. Powered by Kimi K2.5 and GPT Image.",
  openGraph: {
    title: "LONGFORM — AI Content Generator",
    description: "Generate stunning long-form visual content for Indonesian media brands.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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
      <body className="min-h-screen bg-[#080808] text-[#e8e8e8]">
        {children}
      </body>
    </html>
  );
}
