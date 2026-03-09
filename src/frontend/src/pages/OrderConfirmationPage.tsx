import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageLayout } from "../components/PageLayout";

const confettiItems = [
  { id: "c1", emoji: "🌸", pos: 10, delay: 0 },
  { id: "c2", emoji: "✨", pos: 18, delay: 0.15 },
  { id: "c3", emoji: "🎀", pos: 26, delay: 0.3 },
  { id: "c4", emoji: "💕", pos: 34, delay: 0.45 },
  { id: "c5", emoji: "✿", pos: 42, delay: 0.6 },
  { id: "c6", emoji: "❀", pos: 50, delay: 0.75 },
  { id: "c7", emoji: "🌷", pos: 58, delay: 0.9 },
  { id: "c8", emoji: "💝", pos: 66, delay: 1.05 },
  { id: "c9", emoji: "⭐", pos: 74, delay: 1.2 },
  { id: "c10", emoji: "🎊", pos: 82, delay: 1.35 },
];

export function OrderConfirmationPage() {
  return (
    <PageLayout>
      <div
        className="max-w-lg mx-auto px-4 py-16 text-center"
        data-ocid="order.success_state"
      >
        {/* Confetti animation */}
        <div className="relative mb-8">
          {confettiItems.map((item) => (
            <motion.span
              key={item.id}
              className="absolute text-xl pointer-events-none select-none"
              style={{
                left: `${item.pos}%`,
                top: 0,
              }}
              initial={{ y: -20, opacity: 0, scale: 0 }}
              animate={{
                y: [0, -40, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                delay: item.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
              }}
            >
              {item.emoji}
            </motion.span>
          ))}

          {/* Main celebration icon */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--pink-light)) 0%, oklch(var(--lavender-light)) 100%)",
                boxShadow: "0 8px 32px oklch(var(--pink) / 0.3)",
              }}
            >
              🎀
            </div>
          </motion.div>
        </div>

        {/* Thank you card */}
        <motion.div
          className="kawaii-card p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              background:
                "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--lavender)) 50%, oklch(var(--mint)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Thank you for your order!
          </motion.h1>

          <motion.p
            className="text-base mb-2 font-medium"
            style={{ color: "oklch(var(--foreground))" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            We'll deliver your pretty things soon! 🎀
          </motion.p>

          <motion.p
            className="text-sm mb-8"
            style={{ color: "oklch(var(--muted-foreground))" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            Your order has been placed successfully. Our team will contact you
            shortly to confirm delivery.
          </motion.p>

          {/* Info boxes */}
          <motion.div
            className="space-y-3 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <div
              className="p-3 rounded-xl text-sm"
              style={{
                background: "oklch(var(--pink-light))",
                color: "oklch(var(--pink-dark))",
              }}
            >
              🚚 Delivery within Salem, Tamil Nadu
            </div>
            <div
              className="p-3 rounded-xl text-sm"
              style={{
                background: "oklch(var(--lavender-light))",
                color: "oklch(0.4 0.1 295)",
              }}
            >
              💰 Pay with Cash on Delivery
            </div>
          </motion.div>

          {/* Decorative divider */}
          <div
            className="flex items-center justify-center gap-3 mb-8 text-lg"
            style={{ color: "oklch(var(--pink) / 0.4)" }}
          >
            <span>✿</span>
            <span>❀</span>
            <span>🌸</span>
            <span>❀</span>
            <span>✿</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Link to="/products">
              <Button
                className="rounded-full px-10 py-3 h-auto font-semibold text-base w-full sm:w-auto"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                  color: "white",
                  border: "none",
                }}
              >
                Continue Shopping ✨
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
