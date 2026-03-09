export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto py-8 border-t"
      style={{
        borderColor: "oklch(var(--pink-light))",
        background: "oklch(var(--cream-dark) / 0.6)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p
          className="text-xs"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          ✿ Pretty Little Things ✿
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          © {year}. All rights reserved{" "}
          <span style={{ color: "oklch(var(--pink))" }}>♡</span>
        </p>
        <p
          className="text-[10px] mt-2 opacity-60"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          🚚 Cash on Delivery · Delivery only in Salem, Tamil Nadu
        </p>
      </div>
    </footer>
  );
}
