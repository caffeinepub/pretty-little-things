import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, ShoppingCart, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export function Navigation() {
  const { totalItems } = useCart();
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <nav className="nav-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.home_link"
          >
            <img
              src="/assets/generated/pretty-little-things-logo-transparent.dim_300x300.png"
              alt="Pretty Little Things"
              className="w-8 h-8 object-contain"
            />
            <span
              className="text-xl font-bold tracking-tight"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                background:
                  "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--lavender)) 60%, oklch(var(--mint)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pretty Little Things
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "oklch(var(--foreground))" }}
              data-ocid="nav.home_link"
              activeProps={{
                style: { color: "oklch(var(--pink))", fontWeight: 600 },
              }}
            >
              ✿ Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "oklch(var(--foreground))" }}
              data-ocid="nav.products_link"
              activeProps={{
                style: { color: "oklch(var(--pink))", fontWeight: 600 },
              }}
            >
              ❀ Products
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "oklch(var(--foreground))" }}
              data-ocid="nav.cart_link"
              activeProps={{
                style: { color: "oklch(var(--pink))", fontWeight: 600 },
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
              {totalItems > 0 && (
                <Badge
                  className="absolute -top-2 -right-3 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-bold rounded-full"
                  style={{
                    background: "oklch(var(--pink))",
                    color: "white",
                    minWidth: "1rem",
                  }}
                >
                  {totalItems}
                </Badge>
              )}
            </Link>
          </div>

          {/* Auth section */}
          <div className="flex items-center gap-3">
            {userEmail ? (
              <div className="flex items-center gap-2">
                <div
                  className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: "oklch(var(--pink-light))",
                    color: "oklch(var(--pink-dark))",
                  }}
                >
                  <User className="w-3 h-3" />
                  <span className="max-w-[120px] truncate">{userEmail}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full text-xs gap-1"
                  style={{ color: "oklch(var(--foreground))" }}
                  data-ocid="nav.login_button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/" data-ocid="nav.login_button">
                <Button
                  size="sm"
                  className="rounded-full btn-pink text-white text-xs px-4 py-1.5 h-auto"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                    border: "none",
                    color: "white",
                  }}
                >
                  ♡ Login
                </Button>
              </Link>
            )}

            {/* Mobile cart icon */}
            <Link
              to="/cart"
              className="sm:hidden relative"
              data-ocid="nav.cart_link"
            >
              <ShoppingCart
                className="w-5 h-5"
                style={{ color: "oklch(var(--foreground))" }}
              />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center text-[10px] font-bold rounded-full"
                  style={{ background: "oklch(var(--pink))", color: "white" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
