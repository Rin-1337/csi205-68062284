"use client";

import { Button } from "@/components/tailgrids/core/button";
import type { Product } from "@/app/data/products";

type Props = {
  product: Product;
  actionLabel: string;
  variant: "success" | "danger";
  onAction: (product: Product) => void;
};

export default function ProductCard({ product, actionLabel, variant, onAction }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-300 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnailUrl}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute top-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
          ${product.price.toFixed(2)}
        </span>
        <p className="absolute right-0 bottom-0 left-0 line-clamp-2 bg-black/60 px-1.5 py-0.5 text-xs text-white">
          {product.title}
        </p>
      </div>
      <Button
        variant={variant}
        appearance="outline"
        size="sm"
        className="w-full py-1.5"
        onPress={() => onAction(product)}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
