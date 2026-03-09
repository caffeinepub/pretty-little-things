import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Product } from "../backend";

export interface WishlistItem {
  product: Product;
}

interface WishlistContextValue {
  items: WishlistItem[];
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: bigint) => boolean;
  removeItem: (productId: bigint) => void;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_STORAGE_KEY = "plt_wishlist";

function serializeWishlist(items: WishlistItem[]): string {
  return JSON.stringify(
    items.map((item) => ({
      product: {
        ...item.product,
        id: item.product.id.toString(),
        price: item.product.price.toString(),
      },
    })),
  );
}

function deserializeWishlist(data: string): WishlistItem[] {
  try {
    const parsed = JSON.parse(data) as Array<{
      product: {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        category: string;
        price: string;
      };
    }>;
    return parsed.map((item) => ({
      product: {
        ...item.product,
        id: BigInt(item.product.id),
        price: BigInt(item.product.price),
      },
    }));
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? deserializeWishlist(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, serializeWishlist(items));
  }, [items]);

  const toggleItem = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.filter((item) => item.product.id !== product.id);
      }
      return [...prev, { product }];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: bigint) => {
      return items.some((item) => item.product.id === productId);
    },
    [items],
  );

  const removeItem = useCallback((productId: bigint) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleItem,
        isWishlisted,
        removeItem,
        clearWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
