// View-only versions of elements for public rendering
import React, { useEffect, useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Twitch, Github, Mail, Share2 } from "lucide-react";

export function CountdownElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(element.targetDate || "");
      const now = new Date();
      const diff = Math.max(target.getTime() - now.getTime(), 0);
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
      const days = Math.floor(diff / 1000 / 60 / 60 / 24);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [element.targetDate]);

  return (
    <motion.div
      className="my-4 p-4 rounded border shadow bg-white text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h3
        className="font-semibold text-lg mb-2"
        style={{ color: styles.textColor }}>
        {element.title || "Countdown"}
      </h3>
      <motion.div
        className="text-2xl font-bold"
        style={{ color: styles.textColor }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </motion.div>
    </motion.div>
  );
}

export function CalendlyElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  return (
    <div className="my-4 p-4 rounded border shadow bg-white">
      <h3
        className="font-semibold text-lg mb-2 text-center"
        style={{ color: styles.textColor }}>
        {element.title || "Book a Call"}
      </h3>
      <iframe
        src={element.url || "https://calendly.com/your-default-link"}
        width="100%"
        height="600"
        frameBorder="0"
        allow="fullscreen"
        style={{ borderRadius: "var(--border-radius-val)" }}
      />
    </div>
  );
}

export function HeaderElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  return (
    <div className="my-4 flex items-center justify-center px-4">
      <h2
        className="text-xl font-semibold text-center w-full"
        style={{ color: styles.textColor }}>
        {element.title || "Header Text"}
      </h2>
    </div>
  );
}

export function CardElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;
  const cardBgColor = styles.theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)";
  const cardTextColor = styles.textColor;
  const cardContent = (
    <>
      {element.thumbnailUrl && (
        <img
          src={element.thumbnailUrl}
          alt={element.title || "Card thumbnail"}
          className={`w-full h-32 object-cover ${radiusClass.replace("rounded-", "rounded-t-")}`}
        />
      )}
      {(element.title || element.description) && (
        <div className="p-4">
          {element.title && (
            <h3
              className="font-semibold mb-1"
              style={{ color: cardTextColor }}>
              {element.title}
            </h3>
          )}
          {element.description && (
            <p
              className="text-sm"
              style={{ color: cardTextColor, opacity: 0.85 }}>
              {element.description}
            </p>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className={`mb-3 w-full ${element.layout === "double" ? "md:w-[calc(50%-0.5rem)]" : "w-full"}`}>
      {element.url ? (
        <a
          href={element.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block overflow-hidden border shadow-md ${radiusClass}`}
          style={{ backgroundColor: cardBgColor }}>
          {cardContent}
        </a>
      ) : (
        <div
          className={`block overflow-hidden border shadow-md ${radiusClass}`}
          style={{ backgroundColor: cardBgColor }}>
          {cardContent}
        </div>
      )}
    </div>
  );
}

export function ImageElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;
  const displayUrl = element.url || element.thumbnailUrl;
  return displayUrl ? (
    <img
      src={displayUrl}
      alt={element.title || "User uploaded image"}
      className={`w-full h-auto object-cover ${radiusClass} my-3`}
    />
  ) : null;
}

export function LinkElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;
  const buttonBase = `w-full p-4 text-center block font-medium transition ${radiusClass}`;
  const filledStyle = `${buttonBase} text-white`;
  const outlineStyle = `${buttonBase} border-2 bg-transparent`;

  return (
    <a
      href={element.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.buttonStyle === "filled" ? filledStyle : outlineStyle}
      style={
        styles.buttonStyle === "filled"
          ? { backgroundColor: styles.buttonColor, color: styles.buttonTextColor }
          : { borderColor: styles.buttonColor, color: styles.buttonColor }
      }>
      {element.title || "Link"}
    </a>
  );
}

export function ProfileElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;
  return (
    <div className="flex flex-col items-center mb-6 text-center">
      <div className="mb-3">
        {element.avatarUrl ? (
          <img
            src={element.avatarUrl}
            alt="Avatar"
            className={`w-24 h-24 object-cover border-2 ${radiusClass === "rounded-full" ? "rounded-full" : radiusClass}`}
            style={{ borderColor: styles.buttonColor }}
          />
        ) : (
          <div
            className={`w-24 h-24 bg-gray-300 flex items-center justify-center border-2 ${
              radiusClass === "rounded-full" ? "rounded-full" : radiusClass
            }`}
            style={{ borderColor: styles.buttonColor }}>
            <span className="text-gray-500">No Avatar</span>
          </div>
        )}
      </div>
      <h1
        className="text-xl font-semibold"
        style={{ color: styles.textColor }}>
        {element.name || "Your Name"}
      </h1>
      <p
        className="text-sm mt-1"
        style={{ color: styles.textColor }}>
        {element.bioText || "Your bio goes here."}
      </p>
    </div>
  );
}

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook size={24} />,
  twitter: <Twitter size={24} />,
  instagram: <Instagram size={24} />,
  linkedin: <Linkedin size={24} />,
  youtube: <Youtube size={24} />,
  twitch: <Twitch size={24} />,
  github: <Github size={24} />,
  email: <Mail size={24} />,
  default: <Share2 size={24} />,
};

export function SocialsElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  const getIcon = (platform: string) => platformIcons[platform.toLowerCase()] || platformIcons.default;
  return (
    <div className="my-6 flex justify-center space-x-4">
      {element.socialLinks?.map((link, index) => (
        <a
          key={index}
          href={link.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: styles.textColor }}
          className="hover:opacity-75 transition-opacity"
          aria-label={link.platform}>
          {getIcon(link.platform)}
        </a>
      )) || <p className="text-sm text-gray-500">No social links</p>}
    </div>
  );
}

export function ShopifyElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (!urlObj.pathname.includes("/products/")) return "";
      return `${urlObj.origin}${urlObj.pathname}?view=embed`;
    } catch {
      return "";
    }
  };

  const embedUrl = getEmbedUrl(element.url || "");
  return (
    <div className="my-4 p-4 rounded border shadow bg-white">
      <h3
        className="font-semibold text-lg mb-3 text-center"
        style={{ color: styles.textColor }}>
        {element.title || "Shopify Product"}
      </h3>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="600"
          frameBorder="0"
          allow="fullscreen"
        />
      ) : (
        <p className="text-center text-sm text-gray-500 italic">Invalid Shopify product URL</p>
      )}
    </div>
  );
}

export function SubscribeElementView({ element, styles }: { element: BioElement; styles: StyleProps }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setSubmitting(true);
    try {
      // Replace with real API call
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "",
          email,
          sourceType: element.type,
          sourceId: element.id,
          createdAt: new Date().toISOString(),
          status: "pending",
        }),
      });
      setEmail("");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-4 p-4 rounded border shadow bg-white text-center">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitting}
        className="w-full mb-2 p-2 border rounded"
        style={{ borderColor: styles.buttonColor, color: styles.textColor }}
      />
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full p-2 rounded"
        style={{ backgroundColor: styles.buttonColor, color: styles.buttonTextColor, opacity: submitting ? 0.6 : 1 }}>
        {submitting ? "Submitting..." : "Subscribe"}
      </button>
    </div>
  );
}
