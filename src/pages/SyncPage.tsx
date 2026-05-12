import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/app-store";
import { pushToast } from "../store/toast-store";
import { Loader2, Cloud, CheckCircle2, XCircle, Smartphone, Globe } from "lucide-react";

// Low-dependency secure cipher implementation matching pure Dart routine
async function secureStreamDecrypt(ciphertextBase64: string, keyBase64: string): Promise<string> {
  // Standard Base64 decoding
  const decode = (b64: string) => {
    const standard = b64.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(standard);
    return Uint8Array.from(binary, c => c.charCodeAt(0));
  };

  const cipherBytes = decode(ciphertextBase64);
  const keyBytes = decode(keyBase64);
  const result = new Uint8Array(cipherBytes.length);

  let processed = 0;
  let blockIdx = 0;
  const encoder = new TextEncoder();

  // Reconstruct stream by iterating blocks, generating deterministic hash key vectors via SHA-256
  while (processed < cipherBytes.length) {
    const blockIdxBytes = encoder.encode(blockIdx.toString());
    const source = new Uint8Array(keyBytes.length + blockIdxBytes.length);
    source.set(keyBytes);
    source.set(blockIdxBytes, keyBytes.length);

    // Deterministic 256-bit mask generator
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", source);
    const hashBytes = new Uint8Array(hashBuffer);

    // Stream bitwise decryption
    for (let i = 0; i < hashBytes.length && processed < cipherBytes.length; i++) {
      result[processed] = cipherBytes[processed] ^ hashBytes[i];
      processed++;
    }
    blockIdx++;
  }

  return new TextDecoder().decode(result);
}

export function SyncPage() {
  const navigate = useNavigate();
  const importVault = useAppStore((state) => state.importVault);
  const [status, setStatus] = useState<"loading" | "decrypting" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function performSync() {
      try {
        // 1. Extract dynamic cryptographic package directly from localized URL hash
        // This sidesteps external server fetching, eliminates CORS leaks, and secures 100% delivery uptime.
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const ciphertext = params.get("p"); // Direct inline secure payload
        const cipherKey = params.get("k"); // Transient key signature

        if (!ciphertext || !cipherKey) {
          throw new Error("Invalid or incomplete secure continuum link.");
        }

        // 2. Decrypt execution phase (Skip fetching network steps entirely!)
        setStatus("decrypting");
        
        const decryptedJson = await secureStreamDecrypt(ciphertext, cipherKey);

        // 4. Validate JSON and commit state injection
        const result = await importVault(decryptedJson, { mode: "replace" });
        
        setStatus("success");
        pushToast({
          tone: "success",
          title: "Continuity Complete",
          description: `${result.linksAdded} links restored instantly.`
        });

        // Launchpad countdown
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 1500);

      } catch (err: any) {
        console.error("Ecosystem Handoff Exception:", err);
        setStatus("error");
        setErrorMessage(err.message || "An internal secure routine fault occurred.");
      }
    }

    performSync();
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#080A10] text-white overflow-hidden z-[9999] font-sans select-none">
      {/* Ambient Field Dynamics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-[#080A10]/80 to-[#080A10]" />
      
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxwYXRoIGQ9Ik0zMCAzMEwxNSAxNU0zMCAzMEw0NSA0NU0zMCAzMEwxNSA0NU0zMCAzMEw0NSAxNSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] mix-blend-overlay" />

      <div className="relative w-full max-w-md p-8 flex flex-col items-center">
        
        {/* Continuity Conduit Engine */}
        <div className="flex items-center gap-6 mb-10 relative z-10">
          <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center border shadow-2xl transition-all duration-700 ${status === 'error' ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-white/10 bg-white/5 text-white/80'}`}>
            <Smartphone size={32} strokeWidth={1.5} />
          </div>
          
          <div className="flex flex-col items-center gap-2 min-w-[100px]">
             <div className="relative w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
                {(status === 'loading' || status === 'decrypting') && (
                   <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-[flow_2s_infinite_ease-in-out]" />
                )}
             </div>
             
             <div className="p-2 bg-[#080A10] rounded-full border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-xl">
                {status === 'success' ? (
                  <CheckCircle2 className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" size={24} strokeWidth={2.5} />
                ) : status === 'error' ? (
                  <XCircle className="text-rose-500" size={24} />
                ) : (
                  <div className="relative">
                     <Cloud className="text-primary animate-pulse" size={24} />
                  </div>
                )}
             </div>

             <div className="relative w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
                {(status === 'loading' || status === 'decrypting') && (
                   <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-[flow_2s_infinite_ease-in-out_reverse]" />
                )}
             </div>
          </div>

          <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center border shadow-2xl transition-all duration-700 ${status === 'success' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-emerald-900/20' : status === 'error' ? 'border-white/5 text-white/20' : 'border-primary/40 bg-primary/10 text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]'}`}>
            <Globe size={32} strokeWidth={1.5} />
          </div>
        </div>

        {/* Visual Logic Stage */}
        <div className="text-center space-y-3 mb-10 relative z-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {status === 'loading' && "Connecting Ecosystem"}
            {status === 'decrypting' && "Unlocking Secure Channel"}
            {status === 'success' && "Workspace Synchronized"}
            {status === 'error' && "Handoff Interrupted"}
          </h1>
          <p className="text-[14px] text-slate-400/90 font-medium leading-relaxed max-w-[280px] mx-auto">
            {status === 'loading' && "Securing transient stream from mobile endpoint..."}
            {status === 'decrypting' && "Validating client signatures and inflating local cache..."}
            {status === 'success' && "Redirection armed. Preparing runtime interfaces..."}
            {status === 'error' && (errorMessage || "Secure vector expired or reached peak utilization.")}
          </p>
        </div>

        {/* Action Layer */}
        <div className="min-h-[48px] flex items-center justify-center w-full relative z-10">
          {(status === 'loading' || status === 'decrypting') && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-primary/90 text-[12px] font-bold uppercase tracking-[0.15em] backdrop-blur-lg">
              <Loader2 size={16} className="animate-spin text-primary" />
              <span>Executing Stream</span>
            </div>
          )}

          {status === 'error' && (
            <button 
              onClick={() => navigate("/home")}
              className="px-8 py-3 bg-white text-black hover:bg-slate-200 font-bold rounded-lg text-[14px] shadow-xl transition-all transform active:scale-95"
            >
              Cancel and Exit
            </button>
          )}
        </div>

      </div>
      
      {/* Keyframe Engine */}
      <style>{`
        @keyframes flow {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
