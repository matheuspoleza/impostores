import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jogo do Impostor",
  description: "Um jogo de dedução e estratégia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}

