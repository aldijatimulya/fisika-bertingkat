import type { Metadata } from "next";
import "@fontsource-variable/literata";
import "@fontsource-variable/instrument-sans";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: { default: "Fisika, dari dasar ke atas", template: "%s | Fisika, dari dasar ke atas" },
  description: "Platform belajar fisika untuk mahasiswa: setiap persamaan dijelaskan asal-usul, prasyarat, dan batas berlakunya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
