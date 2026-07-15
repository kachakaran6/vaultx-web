import React, { useState, useMemo, useEffect, useRef } from "react";
import { ModalShell } from "./ModalShell";
import { LinkRecord } from "../store/types";
import { Button } from "./ui/button";
import { db } from "../db/schema";

interface ReaderModeDialogProps {
  open: boolean;
  link: LinkRecord | null;
  onClose: () => void;
}

export function ReaderModeDialog({ open, link, onClose }: ReaderModeDialogProps) {
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("sepia");
  const [fontSize, setFontSize] = useState<number>(18);
  const [bionicEnabled, setBionicEnabled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll <= 0) {
        setScrollProgress(100);
      } else {
        setScrollProgress((scrollTop / totalScroll) * 100);
      }

      // Save scroll position in DB
      if (link) {
        void db.links.update(link.id, { scrollPosition: scrollTop });
      }
    };

    const el = contentRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, [open, link]);

  // Pomodoro Focus Timer Logic
  useEffect(() => {
    if (pomoActive) {
      const interval = setInterval(() => {
        setPomoSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setPomoActive(false);
            try {
              const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav");
              audio.volume = 0.5;
              void audio.play();
            } catch (e) {
              // ignore
            }
            alert("🍅 Pomodoro focus session complete! Take a short break.");
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [pomoActive]);

  const formatPomoTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!link) return;
      // Get text content to read
      const textToRead = link.notes ? link.notes.replace(/[•#]/g, "") : link.title;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Reset scroll progress and restore position when link changes
  useEffect(() => {
    setScrollProgress(0);
    setPomoSeconds(25 * 60);
    setPomoActive(false);
    
    // Reset TTS
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Restore scroll position
    if (link && contentRef.current) {
      const targetScroll = link.scrollPosition || 0;
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = targetScroll;
        }
      }, 50);
    }
  }, [link]);

  const readingTime = useMemo(() => {
    if (!link) return 0;
    const notesText = link.notes || "";
    const titleText = link.title || "";
    // Estimate word count based on notes + title. If notes are empty, simulate ~350 words of scraped article summary.
    const notesWords = notesText.split(/\s+/).filter(Boolean).length;
    const estArticleWords = notesWords > 10 ? notesWords : 380;
    const titleWords = titleText.split(/\s+/).filter(Boolean).length;
    const totalWords = estArticleWords + titleWords;
    return Math.max(1, Math.round(totalWords / 200)); // ~200 WPM
  }, [link]);

  const formatBionicText = (text: string): React.ReactNode => {
    if (!text) return "";
    const paragraphs = text.split("\n");
    return paragraphs.map((para, paraIdx) => {
      if (!para.trim()) return <div key={paraIdx} className="h-4" />;
      const words = para.split(/(\s+)/);
      const formattedWords = words.map((word, wordIdx) => {
        if (/^\s+$/.test(word)) return word;
        const len = word.length;
        if (len <= 1) return <strong key={wordIdx} className="font-extrabold">{word}</strong>;
        const mid = Math.ceil(len * 0.4);
        const firstPart = word.slice(0, mid);
        const secondPart = word.slice(mid);
        return (
          <React.Fragment key={wordIdx}>
            <strong className="font-extrabold">{firstPart}</strong>{secondPart}
          </React.Fragment>
        );
      });
      return <p key={paraIdx} className="mb-4">{formattedWords}</p>;
    });
  };

  if (!link) return null;

  const bgClasses = {
    light: "bg-[#fbfbfb] text-[#1a1a1a] border-border",
    sepia: "bg-[#f4ecd8] text-[#5b4636] border-[#e4dcc8]",
    dark: "bg-[#121212] text-[#e0e0e0] border-[#222]"
  };

  const fontClasses = {
    light: "font-sans",
    sepia: "font-serif",
    dark: "font-sans"
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Clean Reader Mode"
      widthClassName="max-w-3xl"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-text-muted">schedule</span>
            <span className="text-xs font-semibold text-text-muted">{readingTime} min read</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Done Reading
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-[70vh]">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              title="Decrease Font Size"
            >
              A-
            </Button>
            <span className="text-xs font-semibold text-text-muted">{fontSize}px</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setFontSize(Math.min(26, fontSize + 2))}
              title="Increase Font Size"
            >
              A+
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Bionic Reading Toggle */}
            <button
              onClick={() => setBionicEnabled(!bionicEnabled)}
              className={`h-8 px-2.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                bionicEnabled 
                  ? "bg-accent/15 border-accent text-accent" 
                  : "bg-surface border-border text-text-muted hover:text-text"
              }`}
              title="Toggle Bionic Reading Mode (ADHD friendly)"
            >
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              <span>Bionic</span>
            </button>

            {/* Pomodoro Focus Timer */}
            <div className="flex items-center gap-1.5 px-2 h-8 rounded-md border border-border bg-surface text-xs font-semibold select-none">
              <span className="material-symbols-outlined text-[15px] text-danger" style={{ fontVariationSettings: pomoActive ? "'FILL' 1" : "'FILL' 0" }}>timer</span>
              <span className="font-mono text-text-muted">{formatPomoTime(pomoSeconds)}</span>
              <button 
                onClick={() => setPomoActive(!pomoActive)} 
                className="text-text hover:text-accent p-0.5 rounded hover:bg-secondary/40 transition-colors ml-1 flex items-center justify-center"
                title={pomoActive ? "Pause Timer" : "Start Focus Timer (25m)"}
              >
                <span className="material-symbols-outlined text-[14px]">{pomoActive ? "pause" : "play_arrow"}</span>
              </button>
              <button 
                onClick={() => { setPomoSeconds(25 * 60); setPomoActive(false); }} 
                className="text-text-muted hover:text-text p-0.5 rounded hover:bg-secondary/40 transition-colors flex items-center justify-center"
                title="Reset Focus Timer"
              >
                <span className="material-symbols-outlined text-[14px]">replay</span>
              </button>
            </div>
            {/* Text-to-Speech Player */}
            <button
              onClick={toggleSpeech}
              className={`h-8 px-2.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSpeaking 
                  ? "bg-accent/15 border-accent text-accent animate-pulse" 
                  : "bg-surface border-border text-text-muted hover:text-text"
              }`}
              title={isSpeaking ? "Stop Speaking" : "Read Aloud (TTS)"}
            >
              <span className="material-symbols-outlined text-[15px]">{isSpeaking ? "volume_off" : "volume_up"}</span>
              <span>{isSpeaking ? "Stop" : "Listen"}</span>
            </button>

            <div className="w-[1px] h-4 bg-border/60 mx-1" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`w-7 h-7 rounded-full border bg-white flex items-center justify-center transition-all ${
                  theme === "light" ? "ring-2 ring-accent border-transparent" : "border-border"
                }`}
                title="Light Theme"
              >
                <span className="text-xs font-bold text-gray-800">A</span>
              </button>
              <button
                onClick={() => setTheme("sepia")}
                className={`w-7 h-7 rounded-full border bg-[#f4ecd8] flex items-center justify-center transition-all ${
                  theme === "sepia" ? "ring-2 ring-accent border-transparent" : "border-[#e4dcc8]"
                }`}
                title="Sepia Theme"
              >
                <span className="text-xs font-bold text-[#5b4636]">A</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`w-7 h-7 rounded-full border bg-zinc-900 flex items-center justify-center transition-all ${
                  theme === "dark" ? "ring-2 ring-accent border-transparent" : "border-zinc-800"
                }`}
                title="Dark Theme"
              >
                <span className="text-xs font-bold text-zinc-300">A</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="w-full h-1 bg-secondary/30 rounded-full mb-4 shrink-0 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Distraction-Free Reading Canvas */}
        <div
          ref={contentRef}
          className={`flex-1 overflow-y-auto p-6 md:p-8 rounded-xl border ${bgClasses[theme]} ${fontClasses[theme]} scroll-smooth`}
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.65" }}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Meta Headers */}
            <div className="space-y-2 border-b border-current/10 pb-6 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
                {new URL(link.url).hostname}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {link.title}
              </h1>
              <div className="flex items-center gap-3 pt-2 text-xs opacity-60">
                <span>⏱️ {readingTime} Minute Read</span>
                <span>•</span>
                <span>Saved {new Date(link.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Main Readable Content */}
            <div className="space-y-4 leading-relaxed">
              {link.notes ? (
                bionicEnabled ? formatBionicText(link.notes) : <div className="whitespace-pre-wrap">{link.notes}</div>
              ) : (
                <div className="italic opacity-80 space-y-4">
                  <p>
                    No offline markdown summary was saved for this bookmark. Here is the scraped website snippet:
                  </p>
                  <div className="p-4 bg-current/5 rounded-lg border border-current/10 not-italic font-normal">
                    {link.title} - Full Article at {link.url}
                  </div>
                  <p>
                    You can append full text contents or copy article summaries directly into the "Notes" section of this bookmark to read them here offline anytime.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Sign-off */}
            <div className="pt-8 border-t border-current/10 mt-8 text-center text-xs opacity-50">
              --- End of Document ---
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
