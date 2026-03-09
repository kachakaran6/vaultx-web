import { motion } from "framer-motion";

interface VaultOrbProps {
  linkCount: number;
  onClick: () => void;
}

export function VaultOrb({ linkCount, onClick }: VaultOrbProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative mx-auto mt-2 flex h-52 w-52 items-center justify-center rounded-full"
    >
      <div className="absolute inset-0 rounded-full bg-vault-primary/10 blur-3xl transition group-hover:bg-vault-primary/20" />
      <motion.div
        className="absolute h-[180px] w-[180px] rounded-full border border-vault-primary/50"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{ borderStyle: "dashed" }}
      />
      <motion.div
        className="absolute h-[150px] w-[150px] rounded-full border border-vault-secondary/45"
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{ borderStyle: "dashed" }}
      />
      <motion.div
        className="relative flex h-[130px] w-[130px] flex-col items-center justify-center rounded-full border border-vault-primary/35 bg-[radial-gradient(circle_at_35%_30%,rgba(46,46,69,1),rgba(26,26,40,1),rgba(15,15,20,1))] shadow-[0_0_60px_rgba(58,134,255,0.22)]"
        whileTap={{ scale: 0.94 }}
        animate={{
          boxShadow: [
            "0 0 34px rgba(58,134,255,0.18)",
            "0 0 62px rgba(58,134,255,0.28)",
            "0 0 34px rgba(58,134,255,0.18)"
          ]
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="font-display text-[2.4rem] font-black leading-none">{linkCount}</div>
        <div className="mt-1 text-[11px] font-bold tracking-[0.35em] text-vault-hint">LINKS</div>
      </motion.div>
      <div className="absolute bottom-3 text-[10px] font-bold tracking-[0.35em] text-vault-primary">+ ADD</div>
    </button>
  );
}
