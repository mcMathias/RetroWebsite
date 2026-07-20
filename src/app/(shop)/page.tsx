import Link from "next/link";

/**
 * Shop landing page.
 * Will be expanded with featured products, hero section, etc.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        RetroShop
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl text-center">
        Danmarks bedste markedsplads for retro gaming. Find dine yndlingsspil
        fra Nintendo, PlayStation, Xbox og Sega.
      </p>
      <div className="flex gap-4">
        <Link
          href="/products"
          className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          Se produkter
        </Link>
        <Link
          href="/categories"
          className="rounded-md border border-border px-6 py-3 text-sm font-semibold shadow-sm hover:bg-accent transition-colors"
        >
          Kategorier
        </Link>
      </div>
    </div>
  );
}
