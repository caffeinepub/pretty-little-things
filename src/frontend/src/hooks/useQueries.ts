import { useQuery } from "@tanstack/react-query";
import type { LoginLog, Order, Product } from "../backend";
import { useActor } from "./useActor";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      const products = await actor.getAllProducts();
      if (products.length === 0) {
        await actor.seedProducts();
        return actor.getAllProducts();
      }
      return products;
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllLoginLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<LoginLog[]>({
    queryKey: ["loginLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLoginLogs();
    },
    enabled: !!actor && !isFetching,
  });
}
