import { getCurrentUser } from "./actions";
import { redirect } from "next/navigation";
import HeroSection from "@/components/website/HeroSection";
import { Footer } from "@/components/website/Footer";
import ProductShowcase from "@/components/website//ProductShowcase";
import EasyBuilder from "@/components/website/EasyBuilder";
import Features from "@/components/website/Features";
import FAQ from "@/components/website/FAQ";
import Pricing from "@/components/website/Pricing";
import Navbar from "@/components/website/Navbar";
import Contact from "@/components/website/contact";
export default async function Home() {
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  if (currentUser) {
    return redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      {/* Hero Section */}
      <main>
        <HeroSection />
        <ProductShowcase />
        <EasyBuilder />
        <Features />
        <Contact />
        <FAQ />
        <Pricing />
        <Footer />
      </main>
    </div>
  );
}
