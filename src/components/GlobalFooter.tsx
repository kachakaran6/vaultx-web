import { Link } from "react-router-dom";
import { Mail, Globe, Github as GithubIcon, Linkedin as LinkedinIcon, Instagram as InstagramIcon, Shield } from "lucide-react";

export function GlobalFooter() {
  return (
    <footer className="w-full mt-auto pt-10 pb-8 border-t border-border bg-surface-2/30 rounded-t-xl px-6 sm:px-10">
      <div className="flex flex-col md:flex-row md:justify-between gap-10 mb-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-surface shadow-sm">
              <Shield size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-text uppercase">Vault X</span>
          </div>
          <p className="text-text-muted text-sm leading-relaxed font-medium">
            Your secure digital memory and bookmark organization platform. Designed for privacy, speed, and elite productivity.
          </p>
        </div>

        <div className="md:text-right">
          <h4 className="font-bold text-text mb-5 text-sm uppercase tracking-wider">Other Products</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="https://samast.pro" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent transition-colors">Samast</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-text-muted text-xs font-semibold">
          © {new Date().getFullYear()} Vault X. All rights reserved.
        </p>

        <div className="flex items-center gap-5 pr-20 lg:pr-24">
          <a href="mailto:kachakaran06@gmail.com" aria-label="Email" className="text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            <Mail className="w-[20px] h-[20px]" />
          </a>
          <a href="https://www.kachakaran.me/" target="_blank" rel="noreferrer" aria-label="Portfolio" className="text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            <Globe className="w-[20px] h-[20px]" />
          </a>
          <a href="https://github.com/kachakaran6" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            <GithubIcon className="w-[20px] h-[20px]" />
          </a>
          <a href="https://www.linkedin.com/in/kacha-karan/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            <LinkedinIcon className="w-[20px] h-[20px]" />
          </a>
          <a href="https://www.instagram.com/kacha_karan_/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            <InstagramIcon className="w-[20px] h-[20px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
