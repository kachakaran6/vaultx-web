import React from 'react';
import { Shield, Lock, FileText, CheckCircle2, Mail, Globe, Github as GithubIcon, Linkedin as LinkedinIcon, Instagram as InstagramIcon } from 'lucide-react';

export function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Data Collection and Usage",
      icon: <Lock className="w-5 h-5 text-vault-primary mt-1 flex-shrink-0" />,
      content: "We do NOT collect, store, or transmit any personal data, user information, or sensitive data. All data managed by Vault X (including your links, categories, and settings) is stored entirely locally on your device. We do not maintain any remote servers or databases to collect this information."
    },
    {
      title: "2. Third-Party Services",
      icon: <Shield className="w-5 h-5 text-vault-primary mt-1 flex-shrink-0" />,
      content: "Our Service does not integrate with any third-party analytics, tracking, or advertising services that may collect information used to identify you. Your usage remains completely private."
    },
    {
      title: "3. Device Permissions",
      icon: <CheckCircle2 className="w-5 h-5 text-vault-primary mt-1 flex-shrink-0" />,
      content: "The Service may request access to your clipboard to facilitate the quick adding of links. This data is only processed locally on your device within the app's memory and is never transmitted to us or any third party."
    },
    {
      title: "4. Security",
      icon: <Shield className="w-5 h-5 text-vault-primary mt-1 flex-shrink-0" />,
      content: "Because all your data remains exclusively on your device, the risk of external data breaches from our infrastructure is non-existent. However, it is your responsibility to secure your physical device and utilize the local PIN lock features provided within Vault X."
    },
    {
      title: "5. Policy Updates",
      icon: <FileText className="w-5 h-5 text-vault-primary mt-1 flex-shrink-0" />,
      content: "We may update our Privacy Policy from time to time. You are advised to review this page periodically for any changes. Changes are effective immediately upon posting on this page."
    }
  ];

  const effectiveDate = "12 May 2026";

  return (
    <div className="min-h-screen bg-vault-background text-vault-text font-sans">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 pb-24">
        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-vault-primary/10 mb-2">
            <Shield className="w-8 h-8 text-vault-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-vault-muted text-sm uppercase tracking-wider font-semibold">
            Vault X Secure Storage
          </p>
          <div className="inline-block mt-4 px-3 py-1 rounded-full bg-vault-border/50 text-xs text-vault-muted font-medium">
            Effective Date: {effectiveDate}
          </div>
        </div>

        {/* Intro */}
        <div className="bg-vault-card border border-vault-border rounded-xl p-6 mb-8 shadow-sm">
          <p className="text-sm leading-relaxed text-vault-muted">
            Vault X ("we", "our", or "us") is deeply committed to protecting your privacy. We built Vault X with a privacy-first, local-only architecture. This Privacy Policy outlines our practices regarding information when you use our Vault X application (the "Service").
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-vault-card/50 border border-vault-border rounded-xl p-6 transition-all hover:bg-vault-card">
              <div className="flex gap-4">
                {section.icon}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-vault-text tracking-tight">{section.title}</h3>
                  <p className="text-sm text-vault-muted leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center border-t border-vault-border pt-8">
          <p className="text-xs text-vault-muted">
            If you have any questions or suggestions about our Privacy Policy, please contact us at kachakaran06@gmail.com.
          </p>
          <p className="text-xs text-vault-muted mt-2 opacity-60">
            © {new Date().getFullYear()} Vault X. All rights reserved.
          </p>
          <div className="flex justify-center items-center gap-5 mt-6">
            <a href="mailto:kachakaran06@gmail.com" aria-label="Email" className="text-vault-muted hover:text-vault-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-primary rounded-sm">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://www.kachakaran.me/" target="_blank" rel="noreferrer" aria-label="Portfolio" className="text-vault-muted hover:text-vault-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-primary rounded-sm">
              <Globe className="w-5 h-5" />
            </a>
            <a href="https://github.com/kachakaran6" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-vault-muted hover:text-vault-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-primary rounded-sm">
              <GithubIcon className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/kacha-karan/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-vault-muted hover:text-vault-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-primary rounded-sm">
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/kacha_karan_/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-vault-muted hover:text-vault-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-primary rounded-sm">
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
