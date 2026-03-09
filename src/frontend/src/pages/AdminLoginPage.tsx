import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";

export function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAdminLoggedIn } = useAuth();
  const { actor } = useActor();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Please wait while we connect...");
      return;
    }
    setIsLoading(true);
    try {
      const result = await actor.adminLogin(password);
      if (result.success) {
        setAdminLoggedIn(true);
        toast.success("Welcome, Admin! ✿");
        navigate({ to: "/admin" });
      } else {
        toast.error(result.message || "Invalid password");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="page-content w-full max-w-sm">
        <motion.div
          className="kawaii-card p-8"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--pink-light)) 0%, oklch(var(--lavender-light)) 100%)",
                boxShadow: "0 4px 16px oklch(var(--pink) / 0.2)",
              }}
            >
              <Lock
                className="w-6 h-6"
                style={{ color: "oklch(var(--pink))" }}
              />
            </div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                color: "oklch(var(--pink))",
              }}
            >
              Admin Panel
            </h1>
            <p
              className="text-xs"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Pretty Little Things · Owner Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-sm font-medium"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Admin Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-2"
                style={{ borderColor: "oklch(var(--pink-light))" }}
                data-ocid="admin.password_input"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-3 h-auto font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                color: "white",
                border: "none",
              }}
              data-ocid="admin.login_button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Login ✿"
              )}
            </Button>
          </form>
        </motion.div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          ✿ Pretty Little Things ✿
        </p>
      </div>
    </div>
  );
}
