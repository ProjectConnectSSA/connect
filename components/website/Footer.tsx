"use client";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";
import Logo from "./Logo";

export function Footer() {
  return (
    <footer className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold">DigiFlow</span>
            </div>
            <p className="text-indigo-100">Making digital presence management simple and powerful.</p>
            <div className="flex space-x-4">
              <SocialLink
                href="#"
                icon={<Twitter className="w-5 h-5" />}
              />
              <SocialLink
                href="#"
                icon={<Facebook className="w-5 h-5" />}
              />
              <SocialLink
                href="#"
                icon={<Instagram className="w-5 h-5" />}
              />
              <SocialLink
                href="#"
                icon={<Github className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="#showcase">Showcase</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Press</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <FooterLink href="#">Privacy</FooterLink>
              <FooterLink href="#">Terms</FooterLink>
              <FooterLink href="#">Security</FooterLink>
              <FooterLink href="#">Cookies</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-500 mt-12 pt-8 text-center text-indigo-100">
          <p>&copy; {new Date().getFullYear()} DigiFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a
    href={href}
    className="text-indigo-100 hover:text-white transition-colors">
    {icon}
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a
      href={href}
      className="text-indigo-100 hover:text-white transition-colors">
      {children}
    </a>
  </li>
);

export default Footer;
