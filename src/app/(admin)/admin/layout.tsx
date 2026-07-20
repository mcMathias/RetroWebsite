import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar, AdminTopBar } from "@/components/layout/admin";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Admin | RetroShop",
    template: "%s | RetroShop Admin",
  },
  description: "RetroShop administration panel",
};

/**
 * Admin layout — internal administration system.
 * Uses shadcn/ui Sidebar for persistent navigation.
 * Protected by authentication middleware (role: ADMIN | EMPLOYEE).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopBar />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  );
}
