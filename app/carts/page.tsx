"use client";

import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/tailgrids/core/badge";
import { useGlobalData } from "../context/GlobalData";
import type { Product } from "../data/products";

export default function Page() {
  const { carts, setCarts, setProducts } = useGlobalData();

  const removeFromCarts = (product: Product) => {
    setCarts((prev) => prev.filter((p) => p.id !== product.id));
    setProducts((prev) => [...prev, product].sort((a, b) => a.id - b.id));
  };

  const totalPrice = carts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="mx-auto mt-4 max-w-4xl px-4">
      <div className="h-[480px] overflow-y-auto rounded-xl border border-gray-300 bg-sky-50 p-3">
        {carts.length === 0 ? (
          <p className="py-10 text-center text-gray-500">Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {carts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                actionLabel="Remove"
                variant="danger"
                onAction={removeFromCarts}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-center gap-4">
        <Badge size="lg" className="bg-yellow-400 font-semibold text-white">
          Count: {carts.length} items
        </Badge>
        <Badge size="lg" className="bg-red-600 font-semibold text-white">
          Price: ${totalPrice.toFixed(2)}
        </Badge>
      </div>
    </div>
  );
}
