import { motion } from "framer-motion";
import { Shield, Link2, Zap, ArrowRight, FolderLock } from "lucide-react";
import { Button } from "../ui/button";
import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden md:pt-48 md:pb-32">
      {/* Background Atmospheric Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square pointer-events-none">
        <div className="absolute inset-0 bg-vault-500/20 blur-[120px] rounded-full opacity-40 -translate-y-1/2"></div>
        <div className="absolute inset-0 bg-purple-500/10 blur-[120px] rounded-full opacity-30 -translate-y-1/3 translate-x-1/4"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center flex flex-col items-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge className="mb-6 animate-fade-up font-semibold">
              Introducing Vault X 2.0
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-gradient"
          >
            Organize Your Web
            <br />
            <span className="text-gradient-accent">Into A Secure Vault</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            The easiest way to save, organize, and manage all your favorite website links securely. Now featuring stunning visual themes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto mb-20"
          >
            <Button size="lg" variant="default" className="w-full sm:w-auto gap-2">
              Launch Web App
              <ArrowRight size={20} />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
              <FolderLock size={20} />
              Discover Features
            </Button>
          </motion.div>

          {/* Floating Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-vault-500/10 blur-3xl rounded-3xl transform translate-y-8 scale-95 pointer-events-none"></div>
            
            <div className="relative p-1 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm shadow-float animate-float">
              <div className="bg-neutral-900 rounded-[28px] overflow-hidden shadow-neu-flat border border-white/[0.03]">
                {/* Internal UI Mockup Simulation */}
                <div className="w-full aspect-[16/10] bg-[#0B0D11] flex flex-col">
                  {/* Fake Browser Bar */}
                  <div className="h-12 border-b border-white/[0.05] bg-neutral-900/50 flex items-center px-6 gap-2 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <div className="ml-4 w-64 h-6 bg-neutral-950 rounded-md shadow-neu-pressed border border-white/[0.02] flex items-center px-3">
                      <div className="w-full h-2 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                  {/* Dashboard Simulation Body */}
                  <div className="flex-1 p-8 flex flex-col md:flex-row gap-6 overflow-hidden">
                    {/* Sidebar Placeholder */}
                    <div className="hidden md:flex w-56 flex-col gap-3 flex-shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className={`h-10 rounded-xl flex items-center px-4 gap-3 ${i === 0 ? 'bg-vault-400/10 text-vault-300 border border-vault-400/20' : 'text-white/40 hover:bg-white/5 border border-transparent'}`}
                        >
                          <div className={`w-4 h-4 rounded-md ${i === 0 ? 'bg-vault-400' : 'bg-white/20'}`}></div>
                          <div className={`h-2.5 rounded-full ${i === 0 ? 'bg-vault-300 w-20' : 'bg-white/10 w-16'}`}></div>
                        </div>
                      ))}
                    </div>
                    {/* Main Grid Content Placeholder */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-neutral-900 p-4 rounded-2xl shadow-neu-convex border border-white/[0.02] aspect-square md:aspect-video lg:aspect-square flex flex-col gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-vault-300 shadow-neu-soft">
                            {i % 3 === 0 ? <Link2 size={18} /> : i % 3 === 1 ? <Shield size={18} /> : <Zap size={18} />}
                          </div>
                          <div className="space-y-2 mt-2">
                            <div className="w-3/4 h-3 bg-white/20 rounded-full"></div>
                            <div className="w-1/2 h-2.5 bg-white/10 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
