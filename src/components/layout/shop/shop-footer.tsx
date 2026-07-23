import Link from "next/link";
import { Gamepad2 } from "lucide-react";

/**
 * Shop footer with site info, navigation, and legal links.
 */
export function ShopFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <span>RetroShop</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Danmarks bedste markedsplads for retro gaming. Kvalitetsprodukter
              med ærlig grading.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  Alle produkter
                </Link>
              </li>
              <li>
                <Link href="/products?brand=nintendo" className="hover:text-foreground transition-colors">
                  Nintendo
                </Link>
              </li>
              <li>
                <Link href="/products?brand=playstation" className="hover:text-foreground transition-colors">
                  PlayStation
                </Link>
              </li>
              <li>
                <Link href="/products?brand=xbox" className="hover:text-foreground transition-colors">
                  Xbox
                </Link>
              </li>
              <li>
                <Link href="/products?brand=sega" className="hover:text-foreground transition-colors">
                  Sega
                </Link>
              </li>
            </ul>
          </div>

          {/* Kundeservice */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Kundeservice</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shipping" className="hover:text-foreground transition-colors">
                  Fragt & levering
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground transition-colors">
                  Returret
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  Om RetroShop
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Handelsbetingelser
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privatlivspolitik
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} RetroShop. Alle rettigheder forbeholdes.</p>
        </div>
      </div>
    </footer>
  );
}
