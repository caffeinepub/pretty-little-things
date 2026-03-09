import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Activity, LogOut, Package } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGetAllLoginLogs, useGetAllOrders } from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  // ICP timestamps are in nanoseconds
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return ts.toString();
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function TableSkeleton({
  rows = 5,
  cols = 4,
}: { rows?: number; cols?: number }) {
  const rowKeys = Array.from({ length: rows }, (_, i) => `row-${i}`);
  const colKeys = Array.from({ length: cols }, (_, j) => `col-${j}`);
  return (
    <div className="space-y-2">
      {rowKeys.map((rk) => (
        <div key={rk} className="flex gap-4">
          {colKeys.map((ck) => (
            <Skeleton
              key={ck}
              className="h-8 flex-1"
              style={{ background: "oklch(var(--pink-light) / 0.5)" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AdminPage() {
  const { isAdminLoggedIn, setAdminLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const { data: loginLogs, isLoading: logsLoading } = useGetAllLoginLogs();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate({ to: "/admin/login" });
    }
  }, [isAdminLoggedIn, navigate]);

  const handleLogout = () => {
    setAdminLoggedIn(false);
    navigate({ to: "/" });
  };

  if (!isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-page">
      <div className="page-content">
        {/* Admin Navigation */}
        <nav className="nav-glass sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <span
                  className="text-lg font-bold"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    background:
                      "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--lavender)) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Pretty Little Things
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "oklch(var(--pink-light))",
                    color: "oklch(var(--pink-dark))",
                  }}
                >
                  Admin
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-full gap-1.5 text-xs"
                style={{ color: "oklch(var(--foreground))" }}
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1
              className="text-3xl font-bold mb-1"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                background:
                  "linear-gradient(135deg, oklch(var(--pink)) 0%, oklch(var(--lavender)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Admin Panel ✿
            </h1>
            <p
              className="text-sm"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Manage orders and monitor activity
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="kawaii-card p-5 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "oklch(var(--pink-light))" }}
              >
                <Package
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--pink))" }}
                />
              </div>
              <div>
                <p
                  className="text-xs"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Total Orders
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "oklch(var(--pink))" }}
                >
                  {ordersLoading ? "..." : (orders?.length ?? 0)}
                </p>
              </div>
            </div>
            <div className="kawaii-card p-5 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "oklch(var(--lavender-light))" }}
              >
                <Activity
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--lavender))" }}
                />
              </div>
              <div>
                <p
                  className="text-xs"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Login Events
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "oklch(var(--lavender))" }}
                >
                  {logsLoading ? "..." : (loginLogs?.length ?? 0)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="orders">
              <TabsList
                className="rounded-full p-1 mb-6 w-auto inline-flex"
                style={{ background: "oklch(var(--pink-light))" }}
              >
                <TabsTrigger
                  value="orders"
                  className="rounded-full text-sm font-semibold px-5"
                  style={{ color: "oklch(var(--pink-dark))" }}
                  data-ocid="admin.orders_tab"
                >
                  <Package className="w-3.5 h-3.5 mr-1.5" />
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="login-logs"
                  className="rounded-full text-sm font-semibold px-5"
                  style={{ color: "oklch(var(--pink-dark))" }}
                  data-ocid="admin.login_logs_tab"
                >
                  <Activity className="w-3.5 h-3.5 mr-1.5" />
                  Login Logs
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <div
                  className="kawaii-card overflow-hidden"
                  data-ocid="admin.orders_table"
                >
                  {ordersLoading ? (
                    <div className="p-6">
                      <TableSkeleton rows={5} cols={5} />
                    </div>
                  ) : !orders || orders.length === 0 ? (
                    <div
                      className="py-16 text-center"
                      data-ocid="orders.empty_state"
                    >
                      <div className="text-4xl mb-4">📦</div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        No orders yet ✿
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow
                            style={{ borderColor: "oklch(var(--pink-light))" }}
                          >
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              Customer
                            </TableHead>
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              Phone
                            </TableHead>
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              Address
                            </TableHead>
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              Items
                            </TableHead>
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              Total
                            </TableHead>
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              Status
                            </TableHead>
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              Date
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order, i) => (
                            <TableRow
                              key={order.id.toString()}
                              className="hover:bg-kawaii-pink-light/20 transition-colors"
                              style={{
                                borderColor: "oklch(var(--pink-light) / 0.5)",
                              }}
                              data-ocid={`admin.orders.row.${i + 1}`}
                            >
                              <TableCell
                                className="font-medium text-sm"
                                style={{ color: "oklch(var(--foreground))" }}
                              >
                                {order.customerName}
                              </TableCell>
                              <TableCell
                                className="text-xs"
                                style={{
                                  color: "oklch(var(--muted-foreground))",
                                }}
                              >
                                {order.phone}
                              </TableCell>
                              <TableCell
                                className="text-xs max-w-[150px] truncate"
                                style={{
                                  color: "oklch(var(--muted-foreground))",
                                }}
                                title={order.address}
                              >
                                {order.address}
                              </TableCell>
                              <TableCell
                                className="text-xs"
                                style={{
                                  color: "oklch(var(--muted-foreground))",
                                }}
                              >
                                <div className="space-y-0.5">
                                  {order.items.map((item) => (
                                    <div
                                      key={`${order.id.toString()}-${item.productId.toString()}`}
                                    >
                                      {item.productName} ×
                                      {Number(item.quantity)}
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell
                                className="font-semibold text-sm"
                                style={{ color: "oklch(var(--pink))" }}
                              >
                                ₹{Number(order.totalAmount)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className="text-[10px] rounded-full px-2"
                                  style={{
                                    background:
                                      order.status === "delivered"
                                        ? "oklch(var(--mint-light))"
                                        : "oklch(var(--lavender-light))",
                                    color:
                                      order.status === "delivered"
                                        ? "oklch(var(--mint))"
                                        : "oklch(0.45 0.1 295)",
                                    border: "none",
                                  }}
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell
                                className="text-xs"
                                style={{
                                  color: "oklch(var(--muted-foreground))",
                                }}
                              >
                                {formatTimestamp(order.timestamp)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Login Logs Tab */}
              <TabsContent value="login-logs">
                <div
                  className="kawaii-card overflow-hidden"
                  data-ocid="admin.login_logs_table"
                >
                  {logsLoading ? (
                    <div className="p-6">
                      <TableSkeleton rows={5} cols={3} />
                    </div>
                  ) : !loginLogs || loginLogs.length === 0 ? (
                    <div
                      className="py-16 text-center"
                      data-ocid="logs.empty_state"
                    >
                      <div className="text-4xl mb-4">📋</div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        No login activity yet ✿
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow
                            style={{ borderColor: "oklch(var(--pink-light))" }}
                          >
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              #
                            </TableHead>
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              Email
                            </TableHead>
                            <TableHead
                              className="text-xs font-semibold"
                              style={{ color: "oklch(var(--pink))" }}
                            >
                              Login Time
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loginLogs.map((log, i) => (
                            <TableRow
                              key={log.id.toString()}
                              className="hover:bg-kawaii-pink-light/20 transition-colors"
                              style={{
                                borderColor: "oklch(var(--pink-light) / 0.5)",
                              }}
                              data-ocid={`admin.login_logs.row.${i + 1}`}
                            >
                              <TableCell
                                className="text-xs"
                                style={{
                                  color: "oklch(var(--muted-foreground))",
                                }}
                              >
                                {i + 1}
                              </TableCell>
                              <TableCell
                                className="font-medium text-sm"
                                style={{ color: "oklch(var(--foreground))" }}
                              >
                                {log.email}
                              </TableCell>
                              <TableCell
                                className="text-xs"
                                style={{
                                  color: "oklch(var(--muted-foreground))",
                                }}
                              >
                                {formatTimestamp(log.timestamp)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>

        {/* Footer */}
        <footer
          className="py-6 border-t text-center"
          style={{
            borderColor: "oklch(var(--pink-light))",
            color: "oklch(var(--muted-foreground))",
          }}
        >
          <p className="text-xs">
            ✿ Pretty Little Things Admin Panel ✿ · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
