import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Loader2, Plus, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useGetAllProducts } from "../hooks/useQueries";

const CATEGORIES = [
  { id: "all", label: "✿ All" },
  { id: "Korean Earrings", label: "💎 Korean Earrings" },
  { id: "Korean Clips", label: "🎀 Korean Clips" },
  { id: "Seamless Chains", label: "✨ Seamless Chains" },
];

function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return "/assets/generated/clip1.dim_400x400.jpg";
  if (imageUrl.startsWith("/assets/generated/")) return imageUrl;
  return imageUrl;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    toast.success("Added to cart! ✿", { description: product.name });
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = () => {
    toggleItem(product);
    if (!wishlisted) {
      toast.success("Added to wishlist! 💕", { description: product.name });
    } else {
      toast("Removed from wishlist", { description: product.name });
    }
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
        {/* Wishlist heart button */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            background: wishlisted
              ? "oklch(var(--pink))"
              : "oklch(var(--card) / 0.9)",
            border: `1.5px solid ${wishlisted ? "oklch(var(--pink))" : "oklch(var(--pink-light))"}`,
            boxShadow: wishlisted
              ? "0 2px 8px oklch(var(--pink) / 0.4)"
              : "none",
          }}
          data-ocid={`products.wishlist_button.${index}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className="w-3.5 h-3.5"
            style={{ color: wishlisted ? "white" : "oklch(var(--pink))" }}
            fill={wishlisted ? "white" : "none"}
          />
        </button>
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

const PRODUCT_CATEGORIES = [
  "Korean Earrings",
  "Korean Clips",
  "Seamless Chains",
] as const;

type NewProduct = {
  name: string;
  description: string;
  category: string;
  price: string;
  imageUrl: string;
};

const EMPTY_NEW_PRODUCT: NewProduct = {
  name: "",
  description: "",
  category: "",
  price: "",
  imageUrl: "",
};

let localProductIdCounter = 10000;

const STATIC_PRODUCTS: Product[] = [
  // Korean Clips - ₹100 to ₹150
  {
    id: BigInt(1),
    name: "Butterfly Bow Snap Clip",
    category: "Korean Clips",
    price: BigInt(100),
    imageUrl: "/assets/generated/korean-clip-butterfly-bow.dim_400x400.jpg",
    description: "Sweet pastel pink butterfly bow snap clip with rhinestones",
  },
  {
    id: BigInt(2),
    name: "Daisy Flower Alligator Clip",
    category: "Korean Clips",
    price: BigInt(120),
    imageUrl: "/assets/generated/korean-clip-daisy-lavender.dim_400x400.jpg",
    description: "Pretty lavender daisy alligator clip with tiny petals",
  },
  {
    id: BigInt(3),
    name: "Pearl Claw Clip",
    category: "Korean Clips",
    price: BigInt(150),
    imageUrl: "/assets/generated/korean-clip-pearl-claw-mint.dim_400x400.jpg",
    description: "Elegant mint green claw clip with pearl stud details",
  },
  // Korean Earrings - ₹100 to ₹150
  {
    id: BigInt(4),
    name: "Gold Star Drop Earrings",
    category: "Korean Earrings",
    price: BigInt(100),
    imageUrl: "/assets/generated/korean-earring-gold-star.dim_400x400.jpg",
    description: "Dainty gold star drop earrings with sparkle detail",
  },
  {
    id: BigInt(5),
    name: "Pink Heart Stud Earrings",
    category: "Korean Earrings",
    price: BigInt(110),
    imageUrl: "/assets/generated/korean-earring-pink-heart.dim_400x400.jpg",
    description: "Adorable pastel pink heart stud earrings with glitter",
  },
  {
    id: BigInt(6),
    name: "Lavender Flower Drop Earrings",
    category: "Korean Earrings",
    price: BigInt(130),
    imageUrl:
      "/assets/generated/korean-earring-lavender-flower.dim_400x400.jpg",
    description: "Delicate lavender flower drop earrings with crystal center",
  },
  {
    id: BigInt(7),
    name: "Mint Pearl Teardrop Earrings",
    category: "Korean Earrings",
    price: BigInt(150),
    imageUrl: "/assets/generated/korean-earring-mint-pearl.dim_400x400.jpg",
    description: "Dainty mint green pearl teardrop dangle earrings",
  },
  // Seamless Chains - ₹100 to ₹150
  {
    id: BigInt(8),
    name: "Gold Heart Pendant Chain",
    category: "Seamless Chains",
    price: BigInt(100),
    imageUrl: "/assets/generated/korean-chain-gold-heart.dim_400x400.jpg",
    description: "Elegant thin gold chain with a delicate heart pendant",
  },
  {
    id: BigInt(9),
    name: "Silver Star Charm Chain",
    category: "Seamless Chains",
    price: BigInt(120),
    imageUrl: "/assets/generated/korean-chain-silver-star.dim_400x400.jpg",
    description: "Stylish thin silver chain with a tiny star charm",
  },
  {
    id: BigInt(10),
    name: "Layered Pearl Gold Chain",
    category: "Seamless Chains",
    price: BigInt(140),
    imageUrl: "/assets/generated/korean-chain-layered-pearl.dim_400x400.jpg",
    description: "Feminine double-layer chain with pearls and gold links",
  },
  {
    id: BigInt(11),
    name: "Pink Butterfly Charm Chain",
    category: "Seamless Chains",
    price: BigInt(150),
    imageUrl: "/assets/generated/korean-chain-pink-butterfly.dim_400x400.jpg",
    description: "Sweet pastel pink butterfly charm on a delicate chain",
  },
];

export function ProductsPage() {
  const { data: products, isLoading, isError } = useGetAllProducts();
  const { isAdminLoggedIn, isOwner } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>(EMPTY_NEW_PRODUCT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Merge backend products with static products (avoid duplicates by id)
  const backendIds = new Set((products ?? []).map((p) => p.id.toString()));
  const staticToAdd = STATIC_PRODUCTS.filter(
    (p) => !backendIds.has(p.id.toString()),
  );
  const allProducts = [...(products ?? []), ...staticToAdd, ...localProducts];
  const filtered = allProducts.filter(
    (p) => activeCategory === "all" || p.category === activeCategory,
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.category || !newProduct.price) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    // Simulate a brief save
    setTimeout(() => {
      const created: Product = {
        id: BigInt(localProductIdCounter++),
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        category: newProduct.category,
        price: BigInt(Math.round(Number(newProduct.price))),
        imageUrl: newProduct.imageUrl.trim(),
      };
      setLocalProducts((prev) => [...prev, created]);
      toast.success("Product added! ✿", { description: created.name });
      setNewProduct(EMPTY_NEW_PRODUCT);
      setAddDialogOpen(false);
      setIsSubmitting(false);
    }, 400);
  };

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

          {/* Owner-only: Add Product button — visible for admin session or owner email login */}
          {(isAdminLoggedIn || isOwner) && (
            <div className="mt-5">
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-full px-6 py-2.5 h-auto text-sm font-semibold gap-2 shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                      color: "white",
                      border: "none",
                    }}
                    data-ocid="products.add_product_button"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </DialogTrigger>

                <DialogContent
                  className="rounded-2xl max-w-md w-full"
                  style={{
                    background: "oklch(var(--card))",
                    border: "2px solid oklch(var(--pink-light))",
                  }}
                  data-ocid="products.add_product_modal"
                >
                  <DialogHeader>
                    <DialogTitle
                      className="text-xl font-bold"
                      style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        color: "oklch(var(--pink))",
                      }}
                    >
                      ✿ Add New Product
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleAddProduct} className="space-y-4 mt-2">
                    {/* Product Name */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="product-name"
                        className="text-sm font-medium"
                        style={{ color: "oklch(var(--foreground))" }}
                      >
                        Product Name{" "}
                        <span style={{ color: "oklch(var(--pink))" }}>*</span>
                      </Label>
                      <Input
                        id="product-name"
                        type="text"
                        placeholder="e.g. Crystal Butterfly Earrings"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct((p) => ({ ...p, name: e.target.value }))
                        }
                        required
                        className="rounded-xl border-2"
                        style={{ borderColor: "oklch(var(--pink-light))" }}
                        data-ocid="products.product_name_input"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="product-description"
                        className="text-sm font-medium"
                        style={{ color: "oklch(var(--foreground))" }}
                      >
                        Description
                      </Label>
                      <Textarea
                        id="product-description"
                        placeholder="Describe your product..."
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                        className="rounded-xl border-2 resize-none"
                        style={{ borderColor: "oklch(var(--pink-light))" }}
                        data-ocid="products.product_description_textarea"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <Label
                        className="text-sm font-medium"
                        style={{ color: "oklch(var(--foreground))" }}
                      >
                        Category{" "}
                        <span style={{ color: "oklch(var(--pink))" }}>*</span>
                      </Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(val) =>
                          setNewProduct((p) => ({ ...p, category: val }))
                        }
                      >
                        <SelectTrigger
                          className="rounded-xl border-2"
                          style={{ borderColor: "oklch(var(--pink-light))" }}
                          data-ocid="products.product_category_select"
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="product-price"
                        className="text-sm font-medium"
                        style={{ color: "oklch(var(--foreground))" }}
                      >
                        Price (₹){" "}
                        <span style={{ color: "oklch(var(--pink))" }}>*</span>
                      </Label>
                      <Input
                        id="product-price"
                        type="number"
                        placeholder="e.g. 150"
                        min={1}
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct((p) => ({
                            ...p,
                            price: e.target.value,
                          }))
                        }
                        required
                        className="rounded-xl border-2"
                        style={{ borderColor: "oklch(var(--pink-light))" }}
                        data-ocid="products.product_price_input"
                      />
                    </div>

                    {/* Image URL */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="product-image"
                        className="text-sm font-medium"
                        style={{ color: "oklch(var(--foreground))" }}
                      >
                        Image URL{" "}
                        <span className="text-xs opacity-60">(optional)</span>
                      </Label>
                      <Input
                        id="product-image"
                        type="text"
                        placeholder="Leave blank for default"
                        value={newProduct.imageUrl}
                        onChange={(e) =>
                          setNewProduct((p) => ({
                            ...p,
                            imageUrl: e.target.value,
                          }))
                        }
                        className="rounded-xl border-2"
                        style={{ borderColor: "oklch(var(--pink-light))" }}
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 rounded-full h-auto py-2.5 text-sm"
                        onClick={() => {
                          setAddDialogOpen(false);
                          setNewProduct(EMPTY_NEW_PRODUCT);
                        }}
                        style={{ color: "oklch(var(--muted-foreground))" }}
                        data-ocid="products.add_product_modal.cancel_button"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 rounded-full h-auto py-2.5 text-sm font-semibold gap-2"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                          color: "white",
                          border: "none",
                        }}
                        data-ocid="products.product_submit_button"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add Product
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
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
