import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Copy,
  Heart,
  Instagram,
  LogOut,
  MessageCircle,
  Share2,
  ShoppingCart,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

export function Navigation() {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Check out Pretty Little Things ✨ ${window.location.origin}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setShareOpen(false);
  };

  const handleInstagramShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success("Link copied! Paste it in your Instagram bio or story 📸");
    } catch {
      toast.error("Could not copy link. Try manually copying the URL.");
    }
    setShareOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success("Link copied! Share it with your friends 💕");
    } catch {
      toast.error("Could not copy link. Try manually copying the URL.");
    }
    setShareOpen(false);
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
            <Link
              to="/wishlist"
              className="relative flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "oklch(var(--foreground))" }}
              data-ocid="nav.wishlist_link"
              activeProps={{
                style: { color: "oklch(var(--pink))", fontWeight: 600 },
              }}
            >
              <Heart className="w-4 h-4" />
              Wishlist
              {wishlistCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-3 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-bold rounded-full"
                  style={{
                    background: "oklch(var(--pink))",
                    color: "white",
                    minWidth: "1rem",
                  }}
                >
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </div>

          {/* Auth section */}
          <div className="flex items-center gap-3">
            {/* Share button */}
            <Popover open={shareOpen} onOpenChange={setShareOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs gap-1.5 px-3 py-1.5 h-auto transition-all hover:opacity-80"
                  style={{
                    background: "oklch(var(--pink-light))",
                    color: "oklch(var(--pink-dark))",
                    border: "1px solid oklch(var(--pink) / 0.3)",
                  }}
                  data-ocid="nav.share_button"
                  title="Share Pretty Little Things"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="w-56 p-4 rounded-2xl border-2"
                style={{
                  borderColor: "oklch(var(--pink) / 0.4)",
                  background: "white",
                  boxShadow: "0 8px 32px oklch(var(--pink) / 0.15)",
                }}
              >
                <p
                  className="text-sm font-semibold mb-3 text-center"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    color: "oklch(var(--pink-dark))",
                  }}
                >
                  Share Pretty Little Things 💕
                </p>

                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white mb-2 transition-opacity hover:opacity-90"
                  style={{ background: "#25D366" }}
                  data-ocid="share.whatsapp_button"
                >
                  <MessageCircle className="w-4 h-4" />
                  Share on WhatsApp
                </button>

                {/* Instagram */}
                <button
                  type="button"
                  onClick={handleInstagramShare}
                  className="w-full flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white mb-1 transition-opacity hover:opacity-90"
                  style={{
                    background:
                      "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  }}
                  data-ocid="share.instagram_button"
                >
                  <Instagram className="w-4 h-4" />
                  Share on Instagram
                </button>
                <p
                  className="text-[10px] text-center mb-2 px-1"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Paste the copied link in your Instagram bio or story
                </p>

                {/* Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{
                    border: "1.5px solid oklch(var(--pink) / 0.5)",
                    color: "oklch(var(--pink-dark))",
                    background: "transparent",
                  }}
                  data-ocid="share.copy_link_button"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </PopoverContent>
            </Popover>
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

            {/* Mobile wishlist icon */}
            <Link
              to="/wishlist"
              className="sm:hidden relative"
              data-ocid="nav.wishlist_link"
            >
              <Heart
                className="w-5 h-5"
                style={{ color: "oklch(var(--foreground))" }}
              />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center text-[10px] font-bold rounded-full"
                  style={{ background: "oklch(var(--pink))", color: "white" }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

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
