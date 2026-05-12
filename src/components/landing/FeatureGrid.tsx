import { motion } from "framer-motion";
import { Shield, Globe, BarChart3, Zap, Smartphone, Layers } from "lucide-react";
import { Container } from "../ui/Container";

const features = [
  {
    icon: <Shield className="text-emerald-400" />,
    title: "Hyper Secure",
    description: "Military-grade local encryption. Your data never leaves your device unless you want it to.",
  },
  {
    icon: <Globe className="text-vault-400" />,
    title: "Cross-Platform",
    description: "Seamlessly sync memory between your mobile, tablet, and browser extensions instantly.",
  },
  {
    icon: <Zap className="text-amber-400" />,
    title: "Instant Search",
    description: "Lightning-quick filtering allows you to retrieve any link within milliseconds, effortlessly.",
  },
  {
    icon: <BarChart3 className="text-pink-400" />,
    title: "Smart Insights",
    description: "Beautiful visualized usage patterns helping you track saved data trends over time.",
  },
  {
    icon: <Layers className="text-purple-400" />,
    title: "Auto Categorization",
    description: "Intelligence engines grouping your saved URLs by semantic context automatically.",
  },
  {
    icon: <Smartphone className="text-blue-400" />,
    title: "Neo Experience",
    description: "Immersive, modern modes completely tailored for high-density workflows.",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-24 relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gradient">
            Engineered for absolute speed
          </h2>
          <p className="text-lg text-neutral-400 font-medium">
            Built on modern technology layers to remove friction from your daily information saving workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-neutral-900 p-8 rounded-[24px] border border-white/[0.03] shadow-neu-convex hover:shadow-neu-soft transition-all duration-300 cursor-default"
            >
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-neutral-950 shadow-neu-pressed border border-white/[0.02] group-hover:shadow-neu-soft transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed font-medium text-[15px]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
