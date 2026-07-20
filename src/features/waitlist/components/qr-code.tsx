"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
    url: string;
    size?: number;
}

export function QRCode({ url, size = 120 }: QRCodeProps) {
    return (
        <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG
                value={url}
                size={size}
                level="M"
                bgColor="#ffffff"
                fgColor="#1a1a2e"
            />
        </div>
    );
}
