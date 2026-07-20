/**
 * Site-wide configuration.
 * Used for metadata, SEO, and layout configuration.
 */

export const siteConfig = {
  name: "RetroShop",
  description: "Danmarks bedste markedsplads for retro gaming",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "da-DK",
  currency: "DKK",
  ogImage: "/og-image.png",
  links: {
    facebook: "https://facebook.com/retroshop",
    instagram: "https://instagram.com/retroshop",
  },
  creator: "RetroShop ApS",
} as const;

export const navConfig = {
  shop: [
    { title: "Nyheder", href: "/products?sort=newest" },
    { title: "Tilbud", href: "/products?sale=true" },
    { title: "Nintendo", href: "/categories/nintendo" },
    { title: "PlayStation", href: "/categories/playstation" },
    { title: "Xbox", href: "/categories/xbox" },
    { title: "Sega", href: "/categories/sega" },
  ],
  admin: [
    { title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { title: "Products", href: "/admin/products", icon: "Package" },
    { title: "Orders", href: "/admin/orders", icon: "ShoppingCart" },
    { title: "Customers", href: "/admin/customers", icon: "Users" },
    { title: "Inventory", href: "/admin/inventory", icon: "Warehouse" },
    { title: "Shipping", href: "/admin/shipping", icon: "Truck" },
    { title: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    { title: "Settings", href: "/admin/settings", icon: "Settings" },
  ],
} as const;
