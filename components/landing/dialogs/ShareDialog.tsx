// components/landing/dialogs/ShareDialog.tsx
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Link2, QrCode, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareLink: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  shareLink,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [isShorteningUrl, setIsShorteningUrl] = useState(false);
  const [shortUrlError, setShortUrlError] = useState("");
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      const textToCopy = shortUrl || shareLink;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shortenUrl = async () => {
    setIsShorteningUrl(true);
    setShortUrlError("");
    try {
      const response = await fetch("/api/shorten-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: shareLink }),
      });
      if (!response.ok) throw new Error("Failed to shorten URL");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setShortUrl(data.shortUrl);
    } catch (error) {
      console.error("Error shortening URL:", error);
      setShortUrlError("Error shortening the link");
    } finally {
      setIsShorteningUrl(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector("svg");
      if (svgElement) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "landingpage-qrcode.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent border dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">
            Share Landing Page
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Use the link below to share the landing page or generate its QR code.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <input
            type="text"
            value={shortUrl || shareLink}
            readOnly
            className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          />
          <Button
            onClick={handleCopy}
            size="icon"
            variant="outline"
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Copy
              className={`h-4 w-4 ${
                copied ? "text-green-500" : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
        {shortUrlError && (
          <p className="text-sm text-red-500 mt-1">{shortUrlError}</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setShowQRCode(!showQRCode)}
            variant="secondary"
            className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {showQRCode ? "Hide QR Code" : "Generate QR Code"}
            <QrCode className="ml-2 h-4 w-4" />
          </Button>

          <Button
            onClick={shortenUrl}
            disabled={isShorteningUrl || !!shortUrl}
            variant="outline"
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {isShorteningUrl ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Shortening...
              </>
            ) : shortUrl ? (
              <>
                <Link2 className="mr-2 h-4 w-4 text-green-500" />
                Shortened
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Shorten URL
              </>
            )}
          </Button>
        </div>
        {showQRCode && (
          <div className="mt-4 flex flex-col items-center">
            <div ref={qrCodeRef} className="bg-white p-2 rounded">
              <QRCodeSVG
                value={shortUrl || shareLink}
                size={128}
                level="Q"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <Button
              onClick={downloadQRCode}
              variant="outline"
              className="mt-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Download QR Code
            </Button>
          </div>
        )}
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="mt-4 w-full dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
