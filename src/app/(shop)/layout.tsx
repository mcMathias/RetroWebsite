import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

/**
 * Shop layout - public-facing storefront.
 * This wraps all pages under the (shop) route group.
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header will be added in next phase */}
      <main className="flex-1">{children}</main>
      {/* Footer will be added in next phase */}
    </div>
  );
}
