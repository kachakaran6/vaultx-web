import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Download, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Container } from "../components/ui/Container";
import { HeroSection } from "../components/landing/HeroSection";
import { FeatureGrid } from "../components/landing/FeatureGrid";
import { PrivacyShowcase } from "../components/landing/PrivacyShowcase";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "py-3 bg-neutral-950/80 backdrop-blur-lg border-b border-white/[0.05] shadow-glow-subtle" : "py-6 bg-transparent"
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vault-400 to-vault-600 flex items-center justify-center text-white shadow-glow-primary border border-white/10">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-widest uppercase text-white">Vault X</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Security", "Experience", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Sign In
            </Button>
            <Link to="/home">
              <Button variant="default" size="sm" className="shadow-neu-soft">
                Launch App
              </Button>
            </Link>
          </div>
        </nav>
      </Container>
    </motion.header>
  );
}

function Footer() {
  return (
    <footer className="bg-neutral-950 pt-20 pb-10 border-t border-white/[0.05]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-vault-500 flex items-center justify-center text-white">
                <Shield size={18} />
              </div>
              <span className="text-lg font-bold tracking-wider uppercase">Vault X</span>
            </div>
            <p className="text-neutral-400 max-w-sm leading-relaxed font-medium">
              World-class digital asset security and bookmark organization for elite productivity workflows.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-neutral-500 font-medium">
              <li><a href="#" className="hover:text-vault-400">Mobile App</a></li>
              <li><a href="#" className="hover:text-vault-400">Web Access</a></li>
              <li><a href="#" className="hover:text-vault-400">Pro Version</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-neutral-500 font-medium">
              <li><a href="#" className="hover:text-vault-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-vault-400">Terms of Use</a></li>
              <li><a href="#" className="hover:text-vault-400">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-600 text-sm font-medium">
            © {new Date().getFullYear()} Vault X. All rights reserved. Designed for privacy.
          </p>
          <div className="flex items-center gap-4 text-neutral-600">
            <Github size={20} className="hover:text-white cursor-pointer" />
            <Download size={20} className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FinalCTA() {
  return (
    <section className="py-32 relative">
      <Container>
        <div className="relative bg-neutral-900 p-12 md:p-20 rounded-[40px] shadow-neu-flat border border-white/[0.03] text-center overflow-hidden">
          {/* Atmospheric Glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-vault-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Secure your digital memory today.
            </h2>
            <p className="text-lg text-neutral-400 mb-10 font-medium">
              Join the hundreds of thousands organizing their web experience with absolute zero compromise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/home">
                <Button size="lg" variant="default" className="w-full shadow-glow-primary">
                  Open Digital Vault Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#090B0F] selection:bg-vault-500/30 text-white overflow-hidden font-sans bg-grain">
      <Navbar />
      <div className="relative w-full h-full z-0">
        <HeroSection />
        
        <div id="features">
          <FeatureGrid />
        </div>

        <div id="security">
          <PrivacyShowcase />
        </div>
        
        <FinalCTA />
      </div>
      <Footer />
    </main>
  );
}
