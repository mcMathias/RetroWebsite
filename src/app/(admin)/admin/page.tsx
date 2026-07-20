import {
  ShoppingCart,
  Package,
  DollarSign,
  PackageCheck,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { RecentListCard } from "@/components/shared/recent-list-card";

/**
 * Admin dashboard page.
 *
 * Architecture: Server Component that fetches stats from the database.
 * Currently using placeholder data — will be connected to real queries
 * once the service layer is built.
 */
export default function AdminDashboardPage() {
  // TODO: Replace with real data from dashboard service
  const stats = {
    todayOrders: 3,
    pendingOrders: 7,
    readyToPack: 2,
    revenueToday: "1.240 kr",
    revenueMonth: "34.560 kr",
    productsAdded: 12,
    lowStock: 5,
    outOfStock: 2,
  };

  const recentOrders = [
    {
      id: "1",
      title: "Order #1042",
      subtitle: "Martin Jensen",
      badge: { label: "Pending", variant: "secondary" as const },
      value: "450 kr",
    },
    {
      id: "2",
      title: "Order #1041",
      subtitle: "Lars Nielsen",
      badge: { label: "Packing", variant: "default" as const },
      value: "1.200 kr",
    },
    {
      id: "3",
      title: "Order #1040",
      subtitle: "Anne Pedersen",
      badge: { label: "Shipped", variant: "outline" as const },
      value: "890 kr",
    },
  ];

  const lowStockItems = [
    {
      id: "1",
      title: "Super Mario World",
      subtitle: "SNES • PAL",
      badge: { label: "2 left", variant: "destructive" as const },
    },
    {
      id: "2",
      title: "Zelda: Ocarina of Time",
      subtitle: "N64 • PAL",
      badge: { label: "1 left", variant: "destructive" as const },
    },
    {
      id: "3",
      title: "Pokémon Red",
      subtitle: "Game Boy • PAL",
      badge: { label: "2 left", variant: "destructive" as const },
    },
  ];

  const recentProducts = [
    {
      id: "1",
      title: "GoldenEye 007",
      subtitle: "N64 • Very Good",
      value: "350 kr",
    },
    {
      id: "2",
      title: "Final Fantasy VII",
      subtitle: "PS1 • Good",
      value: "450 kr",
    },
    {
      id: "3",
      title: "Sonic the Hedgehog",
      subtitle: "Mega Drive • Near Mint",
      value: "280 kr",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your retro gaming business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Orders Today"
          value={stats.todayOrders}
          description="since midnight"
          icon={ShoppingCart}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          description="awaiting confirmation"
          icon={Clock}
        />
        <StatCard
          title="Ready to Pack"
          value={stats.readyToPack}
          description="waiting in queue"
          icon={PackageCheck}
        />
        <StatCard
          title="Revenue Today"
          value={stats.revenueToday}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          description="vs yesterday"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue This Month"
          value={stats.revenueMonth}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          description="vs last month"
        />
        <StatCard
          title="Products Added"
          value={stats.productsAdded}
          description="this week"
          icon={Package}
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          description="items below threshold"
          icon={AlertTriangle}
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          description="items unavailable"
          icon={XCircle}
        />
      </div>

      {/* Detail Cards */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <RecentListCard
          title="Recent Orders"
          items={recentOrders}
          emptyMessage="No orders today"
        />
        <RecentListCard
          title="Low Stock Alerts"
          items={lowStockItems}
          emptyMessage="All items well stocked"
        />
        <RecentListCard
          title="Recently Added"
          items={recentProducts}
          emptyMessage="No new products"
        />
      </div>
    </div>
  );
}
