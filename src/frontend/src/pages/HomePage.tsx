import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";

const floatingItems = [
  { id: "f1", emoji: "🌸" },
  { id: "f2", emoji: "✿" },
  { id: "f3", emoji: "❀" },
  { id: "f4", emoji: "🍪" },
  { id: "f5", emoji: "💕" },
  { id: "f6", emoji: "✨" },
  { id: "f7", emoji: "🌷" },
  { id: "f8", emoji: "🎀" },
  { id: "f9", emoji: "🍭" },
  { id: "f10", emoji: "💖" },
];

const featureItems = [
  {
    id: "feat1",
    icon: "🚚",
    title: "Salem Delivery",
    desc: "Free COD delivery within Salem, Tamil Nadu",
  },
  {
    id: "feat2",
    icon: "💝",
    title: "Kawaii Quality",
    desc: "Curated Korean accessories that spark joy",
  },
  {
    id: "feat3",
    icon: "🌸",
    title: "Pay on Delivery",
    desc: "Cash on delivery — no online payment needed",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { userEmail, setUserEmail } = useAuth();
  const { actor } = useActor();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setIsLoading(true);
    try {
      const result = await actor.loginUser(loginEmail, loginPassword);
      if (result.success) {
        setUserEmail(loginEmail);
        toast.success("Welcome back! ✿", { description: result.message });
        setLoginEmail("");
        setLoginPassword("");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setIsLoading(true);
    try {
      const result = await actor.registerUser(registerEmail, registerPassword);
      if (result.success) {
        setUserEmail(registerEmail);
        toast.success("Account created! ✨", { description: result.message });
        setRegisterEmail("");
        setRegisterPassword("");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Floating decorative items */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        {floatingItems.map((item, i) => (
          <motion.span
            key={item.id}
            className="absolute text-lg opacity-20 select-none"
            initial={{ y: "110vh", x: `${5 + i * 9}%`, rotate: 0 }}
            animate={{
              y: "-10vh",
              rotate: 360,
            }}
            transition={{
              duration: 12 + i * 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: i * 0.8,
            }}
          >
            {item.emoji}
          </motion.span>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex justify-center mb-4"
          >
            <img
              src="/assets/generated/pretty-little-things-logo-transparent.dim_300x300.png"
              alt="Pretty Little Things Logo"
              className="w-20 h-20 object-contain mx-auto drop-shadow-md"
            />
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              background:
                "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--lavender)) 50%, oklch(var(--mint)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Pretty Little Things
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl mb-8 font-medium"
            style={{ color: "oklch(var(--muted-foreground))" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Adorable accessories for your prettiest days ✨
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              onClick={() => navigate({ to: "/products" })}
              className="rounded-full px-10 py-3 text-base font-semibold h-auto shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                color: "white",
                border: "none",
              }}
              data-ocid="home.shop_now_button"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Shop Now
            </Button>
          </motion.div>

          {/* Category pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {[
              "Korean Earrings",
              "Hair Clips",
              "Tiny Bags",
              "Seamless Chains",
            ].map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "oklch(var(--pink-light))",
                  color: "oklch(var(--pink-dark))",
                }}
              >
                ✿ {cat}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Auth Card Section */}
      <section className="pb-20 px-4">
        <div className="max-w-md mx-auto">
          <AnimatePresence>
            {userEmail ? (
              <motion.div
                key="logged-in"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="kawaii-card p-8 text-center"
              >
                <div className="text-4xl mb-4">🎀</div>
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    color: "oklch(var(--pink))",
                  }}
                >
                  Welcome back!
                </h2>
                <p
                  className="text-sm mb-1"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Logged in as
                </p>
                <p
                  className="font-semibold text-base mb-6"
                  style={{ color: "oklch(var(--foreground))" }}
                >
                  {userEmail}
                </p>
                <Button
                  onClick={() => navigate({ to: "/products" })}
                  className="rounded-full px-8 h-auto py-2.5 font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                    color: "white",
                    border: "none",
                  }}
                >
                  Browse Products ✨
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="kawaii-card p-8"
              >
                <div className="text-center mb-6">
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      color: "oklch(var(--pink))",
                    }}
                  >
                    ♡ Join Us
                  </h2>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    Login or create your account
                  </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList
                    className="w-full rounded-full p-1 mb-6"
                    style={{ background: "oklch(var(--pink-light))" }}
                  >
                    <TabsTrigger
                      value="login"
                      className="flex-1 rounded-full text-sm font-semibold transition-all"
                      style={{ color: "oklch(var(--pink-dark))" }}
                      data-ocid="home.login_tab"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="flex-1 rounded-full text-sm font-semibold transition-all"
                      style={{ color: "oklch(var(--pink-dark))" }}
                      data-ocid="home.register_tab"
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <AnimatePresence mode="wait">
                      {showForgotPassword ? (
                        <motion.div
                          key="forgot-password"
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.97 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="rounded-2xl p-5 text-center"
                          style={{
                            background: "oklch(var(--pink-light) / 0.5)",
                            border: "2px dashed oklch(var(--pink))",
                          }}
                          data-ocid="home.forgot_password.panel"
                        >
                          <div className="text-3xl mb-3">🔑</div>
                          <h3
                            className="text-lg font-bold mb-2"
                            style={{
                              fontFamily: '"Playfair Display", Georgia, serif',
                              color: "oklch(var(--pink))",
                            }}
                          >
                            Forgot your password?
                          </h3>
                          <p
                            className="text-sm leading-relaxed mb-4"
                            style={{ color: "oklch(var(--muted-foreground))" }}
                          >
                            No worries! DM us on Instagram{" "}
                            <span
                              className="font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              @prettylittlethings
                            </span>{" "}
                            with your registered email and we'll sort it out for
                            you 💕
                          </p>
                          <Button
                            type="button"
                            onClick={() => setShowForgotPassword(false)}
                            className="rounded-full px-6 py-2 h-auto text-sm font-semibold"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--pink-dark)) 100%)",
                              color: "white",
                              border: "none",
                            }}
                            data-ocid="home.forgot_password.back_button"
                          >
                            ← Back to Login
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="login-form"
                          onSubmit={handleLogin}
                          className="space-y-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="space-y-2">
                            <Label
                              htmlFor="login-email"
                              className="text-sm font-medium"
                              style={{ color: "oklch(var(--foreground))" }}
                            >
                              Gmail Account
                            </Label>
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="yourname@gmail.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              required
                              className="rounded-xl border-2"
                              style={{
                                borderColor: "oklch(var(--pink-light))",
                              }}
                              data-ocid="home.email_input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="login-password"
                              className="text-sm font-medium"
                              style={{ color: "oklch(var(--foreground))" }}
                            >
                              Gmail Password
                            </Label>
                            <Input
                              id="login-password"
                              type="password"
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              required
                              className="rounded-xl border-2"
                              style={{
                                borderColor: "oklch(var(--pink-light))",
                              }}
                              data-ocid="home.password_input"
                            />
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-xs font-medium hover:opacity-70 transition-opacity"
                                style={{ color: "oklch(var(--pink))" }}
                                data-ocid="home.forgot_password_link"
                              >
                                Forgot password? 🌸
                              </button>
                            </div>
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
                            data-ocid="home.submit_button"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                              </>
                            ) : (
                              "Login ✿"
                            )}
                          </Button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="register-email"
                          className="text-sm font-medium"
                          style={{ color: "oklch(var(--foreground))" }}
                        >
                          Gmail Account
                        </Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="yourname@gmail.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                          className="rounded-xl border-2"
                          style={{ borderColor: "oklch(var(--pink-light))" }}
                          data-ocid="home.email_input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="register-password"
                          className="text-sm font-medium"
                          style={{ color: "oklch(var(--foreground))" }}
                        >
                          Gmail Password
                        </Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                          className="rounded-xl border-2"
                          style={{ borderColor: "oklch(var(--pink-light))" }}
                          data-ocid="home.password_input"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-full py-3 h-auto font-semibold"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(var(--lavender)) 0%, oklch(0.65 0.14 295) 100%)",
                          color: "white",
                          border: "none",
                        }}
                        data-ocid="home.submit_button"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account ✨"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Features section */}
      <section className="page-content pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            {featureItems.map((feat, i) => (
              <motion.div
                key={feat.id}
                className="kawaii-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl mb-3">{feat.icon}</div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: "oklch(var(--foreground))" }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
