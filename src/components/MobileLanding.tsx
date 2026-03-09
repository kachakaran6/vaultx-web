import { Smartphone, LayoutGrid } from "lucide-react";

interface MobileLandingProps {
    onContinue: () => void;
}

export function MobileLanding({ onContinue }: MobileLandingProps) {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0F14] p-6 text-center animate-in fade-in duration-500">
            <div className="w-full max-w-[420px] space-y-8">
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-vault-primary blur-2xl opacity-20 animate-pulse rounded-full" />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#11161C] border border-[#1e252e] shadow-2xl">
                            <LayoutGrid size={48} className="text-vault-primary" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">Vault X</h2>
                </div>

                {/* Text Section */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
                        Vault X works best on mobile
                    </h1>
                    <p className="text-[#8E9BAA] text-sm leading-relaxed px-4">
                        Install the official Vault X app for the most secure and seamless experience managing your important links.
                    </p>
                </div>

                {/* Action Section */}
                <div className="flex flex-col items-center gap-6 pt-4">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.vaultx.vault_x"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl bg-[#1a1f26] p-4 border border-[#2d3640] transition-all hover:bg-[#1e242d] active:scale-[0.98] shadow-2xl ring-1 ring-white/5"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black border border-white/10 shadow-inner">
                            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.609 2.091C3.411 2.296 3.297 2.607 3.297 3.003V20.997C3.297 21.393 3.411 21.704 3.609 21.909L3.673 21.965L13.167 12.471V12.316L3.673 2.822L3.609 2.091Z" fill="#EA4335" />
                                <path d="M16.331 15.635L13.166 12.471V12.316L16.332 9.151L16.406 9.194L20.151 11.321C21.221 11.928 21.221 12.91 20.151 13.518L16.406 15.644L16.331 15.635Z" fill="#FBBC04" />
                                <path d="M16.406 15.645L13.167 12.406L3.609 21.964C3.939 22.31 4.475 22.348 5.088 22.001L16.406 15.645Z" fill="#34A853" />
                                <path d="M16.406 9.194L5.088 2.784C4.475 2.437 3.939 2.475 3.609 2.821L13.167 12.378L16.406 9.194Z" fill="#4285F4" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9BAA]">Download on</span>
                            <span className="mt-1 text-xl font-bold text-white tracking-tight">Google Play</span>
                        </div>
                        <div className="absolute right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Smartphone size={32} />
                        </div>
                    </a>

                    <button
                        onClick={onContinue}
                        className="text-sm font-semibold text-[#8E9BAA] hover:text-white transition-colors underline decoration-[#2d3640] underline-offset-8"
                    >
                        Continue using web version
                    </button>
                </div>
            </div>

            {/* Decorative footer element */}
            <div className="mt-auto pt-12 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d3640]">
                    Private • Local • Secure
                </p>
            </div>
        </div>
    );
}
