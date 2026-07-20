import { QRCodeSVG } from "qrcode.react";

const SITE_URL = "https://retro-website-xi.vercel.app";

/**
 * Printable flyer page - optimized for A5/A6 print
 * Print with Ctrl+P / Cmd+P
 */
export default function FlyerPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 print:p-0">
      {/* Flyer Container - A6 size roughly */}
      <div className="w-[105mm] h-[148mm] bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] text-white p-6 flex flex-col items-center justify-between print:shadow-none shadow-2xl rounded-lg print:rounded-none">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-lg font-bold tracking-wide">EN NY DANSK</h1>
          <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
            RETRO GAMING SHOP
          </h2>
          <p className="text-purple-300 text-sm font-bold italic mt-1">
            💜 ER PÅ VEJ! 💜
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 text-center text-[10px] w-full">
          <div className="bg-white/10 rounded p-2">
            <p className="font-bold text-purple-300">🎮 Testede konsoller</p>
          </div>
          <div className="bg-white/10 rounded p-2">
            <p className="font-bold text-purple-300">📦 Retro spil & tilbehør</p>
          </div>
          <div className="bg-white/10 rounded p-2">
            <p className="font-bold text-purple-300">🔍 Ærlig vurdering</p>
          </div>
          <div className="bg-white/10 rounded p-2">
            <p className="font-bold text-purple-300">🚚 Hurtig levering</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="text-center">
          <p className="text-[10px] text-purple-300 uppercase tracking-wider mb-2">
            Scan og tilmeld dig ventelisten
          </p>
          <div className="bg-white p-3 rounded-lg inline-block">
            <QRCodeSVG
              value={SITE_URL}
              size={80}
              level="M"
              bgColor="#ffffff"
              fgColor="#1a1a2e"
            />
          </div>
          <p className="text-[9px] text-gray-400 mt-2 italic">
            Få besked når vi åbner!
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-purple-400 font-bold text-sm">retroshop.dk</p>
          <p className="text-[8px] text-gray-500 mt-1">
            Bygget af en samler – for samlere
          </p>
        </div>
      </div>

      {/* Print Instructions - hidden when printing */}
      <div className="fixed bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg text-center print:hidden">
        <p className="text-sm">
          Tryk <kbd className="bg-purple-600 px-2 py-1 rounded mx-1">Ctrl+P</kbd> (eller Cmd+P på Mac) for at printe
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Tip: Vælg "Gem som PDF" hvis du vil have en digital version
        </p>
      </div>
    </div>
  );
}
