"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import "./globals.css";
import Footer from "@/components/Footer";
import { buttonStyles } from "@/components/tailgrids/core/button";
import { useEffect, useState } from "react";
import { GlobalDataContext } from "./context/GlobalData";
import { fetchProducts, Product } from "./data/products";
import { Badge } from "@/components/tailgrids/core/badge";
import LoginModal from "@/components/LoginModal";
import type { User } from "./data/users";


export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data as Product[]))
      .catch((error) => setProducts([] as Product[]));
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);
  // console.log(pathname)

  return (
    <GlobalDataContext.Provider
      value={{ products, setProducts, carts, setCarts, user, setUser }}
    >
      <html>
        <body>
          <Header />

          <nav className="mt-4 flex justify-center gap-4">
            <Link
              href={"/"}
              className={buttonStyles({
                variant: "primary",
                size: "sm",
                appearance: pathname === "/" ? "fill" : "outline",
              })}
            >
              Home
            </Link>

            <Link
              href={"/animation"}
              className={buttonStyles({
                variant: "primary",
                size: "sm",
                appearance: pathname === "/animation" ? "fill" : "outline",
              })}
            >
              Animation
            </Link>

            <Link
              href={"/calculator"}
              className={buttonStyles({
                variant: "primary",
                size: "sm",
                appearance: pathname === "/calculator" ? "fill" : "outline",
              })}
            >
              Calculator
            </Link>

            <Link
              href={"/todos"}
              className={buttonStyles({
                variant: "primary",
                size: "sm",
                appearance: pathname === "/todos" ? "fill" : "outline",
              })}
            >
              Todos
            </Link>

            <Link
              href={"/products"}
              className={buttonStyles({
                variant: "primary",
                size: "sm",
                appearance: pathname === "/products" ? "fill" : "outline",
              })}
            >
              Products ({products.length})
            </Link>
            <div className="relative">
              <Link
                href={"/carts"}
                className={buttonStyles({
                  variant: "primary",
                  size: "sm",
                  appearance: pathname === "/carts" ? "fill" : "outline",
                })}
              >
                Carts
              </Link>
              <Badge size={'sm'}
              className="absolute -top-2 -right-2 bg-red-600 text-slate-50">{carts.length}</Badge>
            </div>

            <button
              type="button"
              onClick={() => setUser(null)}
              className={buttonStyles({
                variant: "danger",
                size: "sm",
                appearance: "outline",
              })}
            >
              Logout
            </button>
          </nav>

          <main>{children}</main>
          <Footer />
          <LoginModal isOpen={user === null} onLogin={setUser} />
        </body>
      </html>
    </GlobalDataContext.Provider>
  );
}
