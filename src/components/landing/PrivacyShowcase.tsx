import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";

export function PrivacyShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full"></div>
      
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 mb-6">
              100% Local Encryption
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gradient">
              Your memory is strictly <br />
              <span className="text-emerald-400">for your eyes only.</span>
            </h2>
            <p className="text-lg text-neutral-400 font-medium leading-relaxed mb-8">
              Vault X was built from day one with privacy as the immutable foundation. Every single byte stored is client-side encrypted, meaning zero access for anyone but you.
            </p>
            
            <ul className="space-y-4">
              {[
                "Biometric and local-only storage by default.",
                "Zero-Knowledge architecture design philosophy.",
                "No hidden cloud syncing unless explicitely routed.",
                "Military-grade AES-256 dynamic asset encryption."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-200 font-medium">
                  <CheckCircle2 className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
              {/* Ring layers for tactile security effect */}
              <div className="absolute inset-0 rounded-full bg-neutral-950 shadow-neu-pressed border border-white/[0.02]"></div>
              <div className="absolute inset-6 rounded-full bg-neutral-900 shadow-neu-convex border border-white/[0.02]"></div>
              <div className="absolute inset-12 rounded-full bg-neutral-950 shadow-neu-pressed border border-white/[0.02] flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/20 scale-[0.95]"
                ></motion.div>
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center justify-center text-neutral-950 animate-float">
                  <Lock size={36} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
