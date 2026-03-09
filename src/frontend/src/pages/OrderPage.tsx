import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { PageLayout } from "../components/PageLayout";
import { useCart } from "../contexts/CartContext";
import { useActor } from "../hooks/useActor";

function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return "/assets/generated/earring-pearl-star.dim_400x400.jpg";
  if (imageUrl.startsWith("/assets/generated/")) return imageUrl;
  return `/assets/generated/${imageUrl}.dim_400x400.jpg`;
}

const DELIVERY_CHARGE = 20;

export function OrderPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { actor } = useActor();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const grandTotal = totalAmount + DELIVERY_CHARGE;

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-6">🛒</div>
          <h2
            className="text-2xl font-bold mb-4"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: "oklch(var(--pink))",
            }}
          >
            Your cart is empty!
          </h2>
          <p
            className="mb-6 text-sm"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Add some pretty things to your cart first ✿
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
              Browse Products 🌸
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Please wait while we connect...");
      return;
    }

    setIsLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: BigInt(item.quantity),
        price: item.product.price,
      }));

      await actor.placeOrder(
        name.trim(),
        phone.trim(),
        address.trim(),
        orderItems,
      );
      clearCart();
      toast.success("Order placed! 🎀");
      navigate({ to: "/order-confirmation" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
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
            Place Your Order 🎀
          </h1>
          <p
            className="text-sm"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Fill in your details and we'll deliver to you!
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Cart Summary */}
          <motion.div
            className="kawaii-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2
              className="font-bold text-base mb-4"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Order Summary
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id.toString()}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ background: "oklch(var(--pink-light))" }}
                  >
                    <img
                      src={getImageUrl(item.product.imageUrl)}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: "oklch(var(--foreground))" }}
                    >
                      {item.product.name}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      × {item.quantity}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "oklch(var(--pink))" }}
                  >
                    ₹{Number(item.product.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="border-t mt-4 pt-4 space-y-2"
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
                  className="font-bold text-sm"
                  style={{ color: "oklch(var(--foreground))" }}
                >
                  Grand Total
                </span>
                <span
                  className="font-bold text-lg"
                  style={{ color: "oklch(var(--pink))" }}
                >
                  ₹{grandTotal}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Order Notes */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div
              className="p-3 rounded-xl text-sm font-medium"
              style={{
                background: "oklch(var(--pink-light))",
                color: "oklch(var(--pink-dark))",
              }}
            >
              🚚 Delivery available only within Salem, Tamil Nadu
            </div>
            <div
              className="p-3 rounded-xl text-sm font-medium"
              style={{
                background: "oklch(var(--lavender-light))",
                color: "oklch(0.4 0.1 295)",
              }}
            >
              💰 Payment: Cash on Delivery (COD)
            </div>
            <div
              className="p-3 rounded-xl text-sm font-medium"
              style={{
                background: "oklch(var(--pink-light))",
                color: "oklch(var(--pink-dark))",
              }}
            >
              📦 Delivery charge: ₹20 (fixed for all orders)
            </div>
          </motion.div>

          {/* Order Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="kawaii-card p-6 space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2
              className="font-bold text-base"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Delivery Details
            </h2>

            <div className="space-y-2">
              <Label
                htmlFor="order-name"
                className="text-sm font-medium"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Full Name <span style={{ color: "oklch(var(--pink))" }}>*</span>
              </Label>
              <Input
                id="order-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl border-2"
                style={{ borderColor: "oklch(var(--pink-light))" }}
                data-ocid="order.name_input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="order-phone"
                className="text-sm font-medium"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Phone Number{" "}
                <span style={{ color: "oklch(var(--pink))" }}>*</span>
              </Label>
              <Input
                id="order-phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
                className="rounded-xl border-2"
                style={{ borderColor: "oklch(var(--pink-light))" }}
                data-ocid="order.phone_input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="order-address"
                className="text-sm font-medium"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Delivery Address{" "}
                <span style={{ color: "oklch(var(--pink))" }}>*</span>
              </Label>
              <Textarea
                id="order-address"
                placeholder="Full delivery address in Salem..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                className="rounded-xl border-2 resize-none"
                style={{ borderColor: "oklch(var(--pink-light))" }}
                data-ocid="order.address_textarea"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-3 h-auto font-semibold text-base"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                color: "white",
                border: "none",
              }}
              data-ocid="order.submit_button"
            >
              {isLoading ? (
                <span
                  data-ocid="order.loading_state"
                  className="flex items-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing your order...
                </span>
              ) : (
                "Place Order 🎀"
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </PageLayout>
  );
}
