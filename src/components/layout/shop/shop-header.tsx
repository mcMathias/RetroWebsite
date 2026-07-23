"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, ShoppingCart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/context";

const navLinks = [
  { title: "Nyheder", href: "/products?sort=newest" },
  { title: "Tilbud", href: "/products?sale=true" },
  { title: "Nintendo", href: "/products?brand=nintendo" },
  { title: "PlayStation", href: "/products?brand=playstation" },
  { title: "Xbox", href: "/products?brand=xbox" },
  { title: "Sega", href: "/products?brand=sega" },
];

/**
 * Shop header with logo, navigation, cart icon, and auth link.
 * Responsive: hamburger menu on mobile, full nav on desktop.
 */
export function ShopHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span>RetroShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href && "bg-accent text-accent-foreground",
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Right Side: Cart + Account */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button variant="ghost" size="icon" render={<Link href="/cart" aria-label="Indkøbskurv" />} nativeButton={false}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {itemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] font-bold pointer-events-none"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" render={<Link href="/login" aria-label="Log ind" />} nativeButton={false}>
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Luk menu" : "Åbn menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href && "bg-accent text-accent-foreground",
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
