"use client";

import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Product } from "../data/products";
import type { User } from "../data/users";

export type GlobalDataType = {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  carts: Product[];
  setCarts: Dispatch<SetStateAction<Product[]>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const GlobalDataContext = createContext<GlobalDataType | null>(null);

export const useGlobalData = () => {
  const ctx = useContext(GlobalDataContext);
  if (!ctx) throw new Error("useGlobalData must be used inside GlobalDataContext.Provider");
  return ctx;
};
