"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface QrCodeDisplayProps {
  shortUrl: string;
  slug: string;
}

export function QrCodeDisplay({ shortUrl, slug }: QrCodeDisplayProps) {
  const qrRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svgElement = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);

    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-qrcode.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("QR Code downloaded!");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-4 bg-white rounded-lg border shadow-sm">
        <QRCodeSVG
          ref={qrRef}
          value={shortUrl}
          size={84}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={false}
        />
      </div>
      <Button onClick={handleDownload}>
        <Download className="mr-2 h-3 w-3" />
        Download SVG
      </Button>
    </div>
  );
}