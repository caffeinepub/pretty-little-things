import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { PageLayout } from "../components/PageLayout";
import { useCart } from "../contexts/CartContext";
import { useGetAllProducts } from "../hooks/useQueries";

const CATEGORIES = [
  { id: "all", label: "✿ All" },
  { id: "Korean Earrings", label: "💎 Korean Earrings" },
  { id: "Korean Hair Clips", label: "🎀 Hair Clips" },
  { id: "Tiny Bags", label: "👜 Tiny Bags" },
  { id: "Seamless Chains", label: "✨ Seamless Chains" },
];

function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return "/assets/generated/earring-pearl-star.dim_400x400.jpg";
  if (imageUrl.startsWith("/assets/generated/")) return imageUrl;
  return `/assets/generated/${imageUrl}.dim_400x400.jpg`;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    toast.success("Added to cart! ✿", { description: product.name });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      className="kawaii-card overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      data-ocid={`products.item.${index}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="product-img w-full"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="badge-pink text-[10px]">{product.category}</span>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-sm mb-1 line-clamp-2"
          style={{ color: "oklch(var(--foreground))" }}
        >
          {product.name}
        </h3>
        <p
          className="text-xs mb-3 line-clamp-2 opacity-70"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-lg font-bold"
            style={{ color: "oklch(var(--pink))" }}
          >
            ₹{Number(product.price)}
          </span>
          <Button
            onClick={handleAdd}
            size="sm"
            className="rounded-full px-4 py-1.5 h-auto text-xs font-semibold transition-all"
            style={{
              background: added
                ? "oklch(var(--mint))"
                : "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
              color: "white",
              border: "none",
            }}
            data-ocid={`products.add_to_cart_button.${index}`}
          >
            {added ? (
              "✓ Added!"
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function ProductSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: "oklch(var(--pink-light))" }}
    >
      <Skeleton
        className="aspect-square w-full"
        style={{ background: "oklch(var(--pink-light) / 0.5)" }}
      />
      <div className="p-4 space-y-2">
        <Skeleton
          className="h-4 w-3/4"
          style={{ background: "oklch(var(--pink-light) / 0.5)" }}
        />
        <Skeleton
          className="h-3 w-full"
          style={{ background: "oklch(var(--pink-light) / 0.3)" }}
        />
        <div className="flex justify-between items-center mt-3">
          <Skeleton
            className="h-6 w-16"
            style={{ background: "oklch(var(--pink-light) / 0.4)" }}
          />
          <Skeleton
            className="h-8 w-24 rounded-full"
            style={{ background: "oklch(var(--pink-light) / 0.4)" }}
          />
        </div>
      </div>
    </div>
  );
}

export function ProductsPage() {
  const { data: products, isLoading, isError } = useGetAllProducts();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = (products ?? []).filter(
    (p) => activeCategory === "all" || p.category === activeCategory,
  );

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            Our Collection ✿
          </h1>
          <p
            className="text-sm"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Handpicked Korean accessories for your cutest looks
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                background:
                  activeCategory === cat.id
                    ? "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)"
                    : "oklch(var(--pink-light))",
                color:
                  activeCategory === cat.id
                    ? "white"
                    : "oklch(var(--pink-dark))",
                boxShadow:
                  activeCategory === cat.id
                    ? "0 4px 12px oklch(var(--pink) / 0.3)"
                    : "none",
              }}
              data-ocid={cat.id === "all" ? "products.all_tab" : undefined}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className="flex items-center justify-center gap-2 mb-6"
            style={{ color: "oklch(var(--muted-foreground))" }}
            data-ocid="products.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading pretty things...</span>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-12" data-ocid="products.error_state">
            <p
              className="text-sm"
              style={{ color: "oklch(var(--destructive))" }}
            >
              Oops! Could not load products. Please try again.
            </p>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((id) => (
              <ProductSkeleton key={id} />
            ))}
          </div>
        ) : (
          <>
            {filtered.length === 0 && !isError && (
              <div
                className="text-center py-16"
                data-ocid="products.empty_state"
              >
                <div className="text-4xl mb-4">🌸</div>
                <p
                  className="text-base font-medium"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  No products in this category yet ✿
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i + 1}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
