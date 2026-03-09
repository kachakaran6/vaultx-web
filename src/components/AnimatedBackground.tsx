import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  left: `${(index * 13) % 100}%`,
  top: `${(index * 29) % 100}%`,
  size: (index % 4) + 2,
  duration: 8 + (index % 5) * 2,
  delay: (index % 6) * 0.6,
  color: index % 2 === 0 ? "rgba(58,134,255,0.6)" : "rgba(131,56,236,0.5)"
}));

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none bg-vault-background overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vault-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-vault-primary/3 blur-[100px] rounded-full" />
    </div>
  );
}
