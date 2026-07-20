import {
  Gamepad2,
  Package,
  Search,
  Truck,
  Heart,
  Sparkles,
  Users,
  Star,
} from "lucide-react";
import { WaitlistForm } from "@/features/waitlist/components/waitlist-form";
import { QRCode } from "@/features/waitlist/components/qr-code";
import { siteConfig } from "@/config/site";

const features = [
  {
    icon: Gamepad2,
    title: "TESTEDE KONSOLLER",
    description: "Alle konsoller bliver testet, rengjort og gennemgået.",
  },
  {
    icon: Package,
    title: "RETRO SPIL & TILBEHØR",
    description: "Nintendo, Game Boy, GameCube, N64, Pokémon og meget mere.",
  },
  {
    icon: Search,
    title: "ÆRLIG STANDSVURDERING",
    description: "Detaljerede beskrivelser og mange billeder af hver vare.",
  },
  {
    icon: Truck,
    title: "HURTIG LEVERING",
    description: "Sikker emballage og hurtig afsendelse.",
  },
];

const values = [
  { icon: Heart, label: "Passion for retro" },
  { icon: Star, label: "Samler kvalitet" },
  { icon: Sparkles, label: "Bygget med passion" },
  { icon: Users, label: "For samlere" },
];

/**
 * Landing page for RetroShop
 * Designed to match the promotional poster for the retro gaming market
 */
export default function HomePage() {
  const siteUrl = siteConfig.url;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] text-white overflow-hidden">
      {/* Decorative pixel hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] text-purple-500/20 text-4xl">💜</div>
        <div className="absolute top-40 right-[15%] text-purple-500/20 text-2xl">💜</div>
        <div className="absolute top-60 left-[25%] text-purple-500/20 text-xl">💜</div>
        <div className="absolute bottom-40 right-[10%] text-purple-500/20 text-3xl">💜</div>
        <div className="absolute bottom-60 left-[5%] text-purple-500/20 text-2xl">💜</div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-wide">
            EN NY DANSK
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-2 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            RETRO GAMING SHOP
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-purple-400">💜💜💜</span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold italic text-purple-300">
              ER PÅ VEJ!
            </h3>
            <span className="text-purple-400">💜💜💜</span>
          </div>
          <p className="text-gray-300 text-lg mb-8">
            Bygget af en passioneret samler og programmør – <span className="italic text-purple-300">for samlere.</span>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all hover:bg-white/10"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-purple-500/20">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-sm font-bold text-purple-300 mb-2">{feature.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Console Images Placeholder - Visual Section */}
      <section className="relative py-8 px-4">
        <div className="max-w-4xl mx-auto flex justify-center items-end gap-4 sm:gap-8">
          <div className="text-6xl sm:text-8xl opacity-80 hover:opacity-100 transition-opacity hover:scale-105 transform">🎮</div>
          <div className="text-7xl sm:text-9xl opacity-90 hover:opacity-100 transition-opacity hover:scale-105 transform">🕹️</div>
          <div className="text-6xl sm:text-8xl opacity-80 hover:opacity-100 transition-opacity hover:scale-105 transform">👾</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/40 to-purple-800/30 rounded-2xl p-6 md:p-10 border border-purple-500/30">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left side - Text */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🚀</span>
                  <p className="text-sm text-purple-300 uppercase tracking-wider font-medium">
                    Hjælp os med at bygge
                  </p>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-4">
                  <span className="text-white">DANMARKS BEDSTE</span>
                  <br />
                  <span className="text-purple-400">RETRO GAMING SHOP!</span>
                </h3>
                <ul className="space-y-2 mb-6">
                  {values.map((value) => (
                    <li key={value.label} className="flex items-center gap-3 text-gray-300">
                      <value.icon className="w-5 h-5 text-purple-400" />
                      <span>{value.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right side - QR Code & Signup */}
              <div className="text-center">
                <p className="text-sm text-purple-300 uppercase tracking-wider font-medium mb-2">
                  Scan QR-koden og tilmeld dig
                </p>
                <h4 className="text-2xl font-black text-purple-400 mb-4">VENTELISTEN</h4>
                <div className="flex justify-center mb-4">
                  <QRCode url={siteUrl} size={140} />
                </div>
                <p className="text-sm text-gray-400 italic mb-6">
                  Få besked som en af de første, når vi åbner!
                </p>
                <WaitlistForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Bar */}
      <section className="relative py-6 px-4 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {values.map((value, index) => (
              <div key={value.label} className="flex items-center gap-2 text-gray-400">
                {index > 0 && <span className="text-purple-500 hidden md:inline">💜</span>}
                <value.icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm uppercase tracking-wider">{value.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider">Følg med på:</p>
          <div className="flex justify-center items-center gap-6 mb-6">
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href={siteConfig.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://tiktok.com/@retroshop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
              aria-label="Website"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </a>
          </div>
          <p className="text-lg font-bold text-purple-400">retroshop.dk</p>
        </div>
      </footer>
    </div>
  );
}
