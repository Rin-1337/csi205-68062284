"use client";

import ProductCard from "@/components/ProductCard";
import { useGlobalData } from "../context/GlobalData";
import type { Product } from "../data/products";

export default function Page() {
  const { products, setProducts, setCarts } = useGlobalData();

  const addToCarts = (product: Product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setCarts((prev) => [...prev, product]);
  };

  return (
    <div className="mx-auto mt-4 max-w-4xl px-4">
      <div className="h-[480px] overflow-y-auto rounded-xl border border-gray-300 bg-sky-50 p-3">
        {products.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No products</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                actionLabel="Add to Carts"
                variant="success"
                onAction={addToCarts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
