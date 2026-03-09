import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { HomePage } from "./pages/HomePage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { OrderPage } from "./pages/OrderPage";
import { ProductsPage } from "./pages/ProductsPage";
import { WishlistPage } from "./pages/WishlistPage";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Outlet />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "oklch(var(--card))",
                border: "1px solid oklch(var(--pink-light))",
                color: "oklch(var(--foreground))",
                borderRadius: "1rem",
                fontFamily: '"Outfit", sans-serif',
              },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  ),
});

// Page routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order",
  component: OrderPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation",
  component: OrderConfirmationPage,
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: WishlistPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  cartRoute,
  wishlistRoute,
  orderRoute,
  orderConfirmationRoute,
  adminLoginRoute,
  adminRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Type declaration
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
