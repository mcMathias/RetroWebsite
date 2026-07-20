"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Truck,
  BarChart3,
  Settings,
  Star,
  ScrollText,
  Gamepad2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  {
    group: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    group: "Catalog",
    items: [
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "Inventory", href: "/admin/inventory", icon: Warehouse },
      { title: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    group: "Sales",
    items: [
      { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { title: "Customers", href: "/admin/customers", icon: Users },
      { title: "Shipping", href: "/admin/shipping", icon: Truck },
    ],
  },
  {
    group: "Insights",
    items: [
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { title: "Audit Log", href: "/admin/audit-log", icon: ScrollText },
    ],
  },
  {
    group: "System",
    items: [
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-sidebar-primary" />
          <span className="text-lg font-bold">RetroShop</span>
        </Link>
        <span className="text-xs text-sidebar-foreground/60">Admin Panel</span>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isActive}
                        className={cn(
                          isActive && "bg-sidebar-accent font-medium",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-sidebar-primary">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin</span>
            <span className="text-xs text-sidebar-foreground/60">
              admin@retroshop.dk
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
