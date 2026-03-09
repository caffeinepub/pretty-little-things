import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { PageLayout } from "../components/PageLayout";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return "/assets/generated/earring-pearl-star.dim_400x400.jpg";
  if (imageUrl.startsWith("/assets/generated/")) return imageUrl;
  return `/assets/generated/${imageUrl}.dim_400x400.jpg`;
}

export function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAddToCart = (productId: bigint, productName: string) => {
    const item = items.find((i) => i.product.id === productId);
    if (!item) return;
    addItem(item.product);
    setAddedIds((prev) => new Set(prev).add(productId.toString()));
    toast.success("Added to cart! ✿", { description: productName });
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId.toString());
        return next;
      });
    }, 1500);
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl sm:text-5xl font-bold mb-3"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              background:
                "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--lavender)) 50%, oklch(var(--mint)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            My Wishlist 💕
          </h1>
          <p
            className="text-sm"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            {items.length === 0
              ? "Your wishlist is empty"
              : `${items.length} item${items.length !== 1 ? "s" : ""} saved`}
          </p>

          {items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearWishlist();
                toast("Wishlist cleared");
              }}
              className="mt-3 text-xs font-medium hover:opacity-70 transition-opacity"
              style={{ color: "oklch(var(--muted-foreground))" }}
              data-ocid="wishlist.clear_button"
            >
              Clear all
            </button>
          )}
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {items.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
              data-ocid="wishlist.empty_state"
            >
              <div className="text-6xl mb-6">🤍</div>
              <h2
                className="text-xl font-semibold mb-3"
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  color: "oklch(var(--foreground))",
                }}
              >
                Nothing saved yet
              </h2>
              <p
                className="text-sm mb-8"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Tap the heart icon on any product to save it here ✿
              </p>
              <Link to="/products">
                <Button
                  className="rounded-full px-8 py-2.5 h-auto font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                    color: "white",
                    border: "none",
                  }}
                  data-ocid="wishlist.browse_button"
                >
                  Browse Products ✨
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {items.map((item, i) => {
                const isAdded = addedIds.has(item.product.id.toString());
                return (
                  <motion.article
                    key={item.product.id.toString()}
                    className="kawaii-card overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    data-ocid={`wishlist.item.${i + 1}`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageUrl(item.product.imageUrl)}
                        alt={item.product.name}
                        className="product-img w-full"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                      {/* Category badge */}
                      <div className="absolute top-2 left-2">
                        <span className="badge-pink text-[10px]">
                          {item.product.category}
                        </span>
                      </div>
                      {/* Remove from wishlist */}
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(item.product.id);
                          toast("Removed from wishlist");
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        style={{
                          background: "oklch(var(--pink))",
                          border: "1.5px solid oklch(var(--pink))",
                        }}
                        data-ocid={`wishlist.remove_button.${i + 1}`}
                        aria-label="Remove from wishlist"
                      >
                        <Heart
                          className="w-3.5 h-3.5"
                          style={{ color: "white" }}
                          fill="white"
                        />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3
                        className="font-semibold text-sm mb-1 line-clamp-2"
                        style={{ color: "oklch(var(--foreground))" }}
                      >
                        {item.product.name}
                      </h3>
                      <p
                        className="text-xs mb-3 line-clamp-2 opacity-70"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        {item.product.description}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-base font-bold"
                          style={{ color: "oklch(var(--pink))" }}
                        >
                          ₹{Number(item.product.price)}
                        </span>
                        <div className="flex gap-1.5">
                          <Button
                            onClick={() =>
                              handleAddToCart(
                                item.product.id,
                                item.product.name,
                              )
                            }
                            size="sm"
                            className="rounded-full px-3 py-1.5 h-auto text-xs font-semibold transition-all"
                            style={{
                              background: isAdded
                                ? "oklch(var(--mint))"
                                : "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                              color: "white",
                              border: "none",
                            }}
                            data-ocid={`wishlist.add_to_cart_button.${i + 1}`}
                          >
                            {isAdded ? (
                              "✓"
                            ) : (
                              <ShoppingCart className="w-3 h-3" />
                            )}
                          </Button>
                          <button
                            type="button"
                            onClick={() => {
                              removeItem(item.product.id);
                              toast("Removed from wishlist");
                            }}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                            style={{
                              background: "oklch(var(--muted) / 0.5)",
                              border: "1px solid oklch(var(--border))",
                            }}
                            data-ocid={`wishlist.delete_button.${i + 1}`}
                            aria-label="Remove"
                          >
                            <Trash2
                              className="w-3 h-3"
                              style={{
                                color: "oklch(var(--muted-foreground))",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
