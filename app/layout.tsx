"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import "./globals.css";
import Footer from "@/components/Footer";
import { Button } from "@/components/tailgrids/core/button";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  // console.log(pathname)

  return (
    <html>
      <body>
        <Header />

        <nav className="mt-4 flex justify-center gap-4">
          <Link href="/">
            <Button
              variant="primary"
              size="sm"
              appearance={pathname === "/" ? "fill" : "outline"}
            >
              Home
            </Button>
          </Link>
          <Link href="/animation">
            <Button
              variant="primary"
              size="sm"
              appearance={pathname === "/animation" ? "fill" : "outline"}
            >
              Animation
            </Button>
          </Link>
          <Link href="/calculator">
            <Button
              variant="primary"
              size="sm"
              appearance={pathname === "/calculator" ? "fill" : "outline"}
            >
              Calculator
            </Button>
          </Link>
          <Link href="/todos">
            <Button
              variant="primary"
              size="sm"
              appearance={pathname === "/todos" ? "fill" : "outline"}
            >
              Todos
            </Button>
          </Link>
        </nav>

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
