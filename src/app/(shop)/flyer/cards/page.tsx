import { QRCodeSVG } from "qrcode.react";

const SITE_URL = "https://retro-website-xi.vercel.app";

/**
 * Print multiple small flyers/cards on one A4 page
 * Perfect for cutting out and handing to people
 */
export default function CardsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 print:p-0 print:bg-white">
      {/* Print Instructions - hidden when printing */}
      <div className="mb-4 bg-black text-white p-4 rounded-lg text-center print:hidden">
        <p className="text-sm">
          Tryk <kbd className="bg-purple-600 px-2 py-1 rounded mx-1">Ctrl+P</kbd> for at printe 6 kort på én A4-side
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Klip dem ud og del dem rundt på markedet! ✂️
        </p>
      </div>

      {/* A4 Page with 6 cards (2x3 grid) */}
      <div className="w-[210mm] mx-auto bg-white print:shadow-none shadow-lg">
        <div className="grid grid-cols-2 gap-0">
          {[...Array(6)].map((_, i) => (
            <Card key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="w-[95mm] h-[55mm] bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] text-white p-3 flex border border-dashed border-gray-300 print:border-gray-200">
      {/* Left side - Text */}
      <div className="flex-1 flex flex-col justify-between pr-2">
        <div>
          <p className="text-[8px] text-gray-400">EN NY DANSK</p>
          <h1 className="text-[11px] font-black text-purple-400 leading-tight">
            RETRO GAMING
            <br />
            SHOP
          </h1>
          <p className="text-[7px] text-purple-300 italic">er på vej! 💜</p>
        </div>
        
        <div className="text-[6px] text-gray-400 space-y-0.5">
          <p>🎮 Testede konsoller</p>
          <p>📦 Retro spil & tilbehør</p>
          <p>🔍 Ærlig standsvurdering</p>
        </div>

        <p className="text-[9px] font-bold text-purple-400">retroshop.dk</p>
      </div>

      {/* Right side - QR */}
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white p-1.5 rounded">
          <QRCodeSVG
            value={SITE_URL}
            size={45}
            level="M"
            bgColor="#ffffff"
            fgColor="#1a1a2e"
          />
        </div>
        <p className="text-[5px] text-gray-500 mt-1 text-center">
          Scan for venteliste
        </p>
      </div>
    </div>
  );
}
