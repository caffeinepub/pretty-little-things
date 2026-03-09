import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PageLayout } from "../components/PageLayout";
import { useCart } from "../contexts/CartContext";

function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return "/assets/generated/earring-pearl-star.dim_400x400.jpg";
  if (imageUrl.startsWith("/assets/generated/")) return imageUrl;
  return `/assets/generated/${imageUrl}.dim_400x400.jpg`;
}

const DELIVERY_CHARGE = 20;

export function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              background:
                "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--lavender)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your Cart 🛍️
          </h1>
          <p
            className="text-sm"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            {items.length === 0
              ? "Your cart is empty"
              : `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              data-ocid="cart.empty_state"
            >
              <div className="text-6xl mb-6">🛒</div>
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Your cart is empty ✿
              </h2>
              <p
                className="text-sm mb-8"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Discover our adorable Korean accessories collection!
              </p>
              <Link to="/products">
                <Button
                  className="rounded-full px-8 py-3 h-auto font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                    color: "white",
                    border: "none",
                  }}
                >
                  Shop Now 🌸
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Cart Items */}
              <div className="space-y-4 mb-8">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product.id.toString()}
                      className="kawaii-card p-4 flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: index * 0.05 }}
                      data-ocid={`cart.item.${index + 1}`}
                    >
                      {/* Product image */}
                      <div
                        className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ background: "oklch(var(--pink-light))" }}
                      >
                        <img
                          src={getImageUrl(item.product.imageUrl)}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-sm truncate"
                          style={{ color: "oklch(var(--foreground))" }}
                        >
                          {item.product.name}
                        </h3>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "oklch(var(--muted-foreground))" }}
                        >
                          ₹{Number(item.product.price)} each
                        </p>
                        <p
                          className="text-sm font-bold mt-1"
                          style={{ color: "oklch(var(--pink))" }}
                        >
                          ₹{Number(item.product.price) * item.quantity}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                          style={{
                            background: "oklch(var(--pink-light))",
                            color: "oklch(var(--pink-dark))",
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          className="w-6 text-center font-bold text-sm"
                          style={{ color: "oklch(var(--foreground))" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                          style={{
                            background: "oklch(var(--pink-light))",
                            color: "oklch(var(--pink-dark))",
                          }}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="ml-2 p-1.5 rounded-full transition-all hover:opacity-70"
                        style={{ color: "oklch(var(--destructive))" }}
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <motion.div
                className="kawaii-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2
                  className="font-bold text-lg mb-4"
                  style={{ color: "oklch(var(--foreground))" }}
                >
                  Order Summary
                </h2>

                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id.toString()}
                      className="flex justify-between text-sm"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>₹{Number(item.product.price) * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="border-t pt-4 space-y-2"
                  style={{ borderColor: "oklch(var(--pink-light))" }}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className="text-sm"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      Subtotal
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "oklch(var(--foreground))" }}
                    >
                      ₹{totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className="text-sm"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      🚚 Delivery Charge
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      ₹{DELIVERY_CHARGE}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center border-t pt-2"
                    style={{ borderColor: "oklch(var(--pink-light))" }}
                  >
                    <span
                      className="font-bold text-base"
                      style={{ color: "oklch(var(--foreground))" }}
                    >
                      Grand Total
                    </span>
                    <span
                      className="font-bold text-xl"
                      style={{ color: "oklch(var(--pink))" }}
                    >
                      ₹{totalAmount + DELIVERY_CHARGE}
                    </span>
                  </div>
                </div>

                <div
                  className="mt-3 p-3 rounded-xl text-xs"
                  style={{
                    background: "oklch(var(--pink-light))",
                    color: "oklch(var(--pink-dark))",
                  }}
                >
                  🚚 Cash on Delivery · Delivery within Salem, Tamil Nadu · ₹20
                  delivery charge
                </div>

                <Button
                  onClick={() => navigate({ to: "/order" })}
                  className="w-full mt-4 rounded-full py-3 h-auto font-semibold text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                    color: "white",
                    border: "none",
                  }}
                  data-ocid="cart.checkout_button"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Proceed to Order ✿
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
