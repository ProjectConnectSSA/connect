import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Facebook, Twitter, Linkedin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PublishOptionsProps {
  formId: string;
}

const PublishOptions: React.FC<PublishOptionsProps> = ({ formId }) => {
  const [copied, setCopied] = useState(false);
  const formLink = `${window.location.origin}/form/${formId}`;
  const qrSize = 160;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formLink);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const encodedLink = encodeURIComponent(formLink);
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedLink}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
        break;
    }

    window.open(shareUrl, "_blank");
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("qrCode") as HTMLCanvasElement;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `form_${formId}_qrcode.png`;
    downloadLink.click();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Share Your Form</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
          <QRCodeSVG
            id="qrCode"
            value={formLink}
            size={qrSize}
            level="H"
            className="mb-3"
          />
          <Button
            onClick={downloadQRCode}
            variant="outline"
            className="w-full">
            Download QR Code
          </Button>
        </div>

        {/* Link Section */}
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
          <input
            readOnly
            value={formLink}
            className="flex-grow bg-transparent focus:outline-none text-sm"
          />
          <Button
            onClick={handleCopyLink}
            variant={copied ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap">
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        {/* Social Sharing */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => shareOnSocial("facebook")}
            variant="outline"
            className="flex items-center justify-center">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => shareOnSocial("twitter")}
            variant="outline"
            className="flex items-center justify-center">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => shareOnSocial("linkedin")}
            variant="outline"
            className="flex items-center justify-center">
            <Linkedin className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishOptions;
