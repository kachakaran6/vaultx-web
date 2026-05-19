import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Zap, ExternalLink, AlertTriangle, Loader2, Compass, CheckCircle2, Copy, Check, RotateCw, Sparkles, Globe } from "lucide-react";

interface LinkItem {
  title: string;
  url: string;
}

export function ClusterPage() {
  const [searchParams] = useSearchParams();
  const rawData = searchParams.get("data");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clusterName, setClusterName] = useState("Vault Stack");
  const [links, setLinks] = useState<LinkItem[]>([]);
  
  // Tracking launch states
  const [launchedUrls, setLaunchedUrls] = useState<Set<string>>(new Set());
  const [blockedUrls, setBlockedUrls] = useState<Set<string>>(new Set());
  const [currentLaunchIndex, setCurrentLaunchIndex] = useState(0);
  const [isBlasting, setIsBlasting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failedFavicons, setFailedFavicons] = useState<Set<string>>(new Set());

  const getDomain = (url: string) => {
    try {
      const uri = new URL(url);
      return uri.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  useEffect(() => {
    async function parsePayload() {
      if (!rawData) {
        setError("No cluster share payload found in URL.");
        setLoading(false);
        return;
      }

      try {
        // 1. Decode Base64Url to Uint8Array
        let base64 = rawData.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
          base64 += "=";
        }
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // 2. Decompress using standard browser DecompressionStream (gzip)
        const ds = new DecompressionStream("gzip");
        const writer = ds.writable.getWriter();
        writer.write(bytes);
        writer.close();

        const response = new Response(ds.readable);
        const buffer = await response.arrayBuffer();
        const jsonStr = new TextDecoder("utf-8").decode(buffer);

        // 3. Parse JSON
        const clusterData = JSON.parse(jsonStr);

        // 4. Validate and extract links
        const isLegacy = clusterData.v !== undefined;
        const isStandardCluster = clusterData.type === "vaultx_cluster" || isLegacy;

        if (!isStandardCluster) {
          throw new Error("Unsupported package format type.");
        }

        let name = "Vault Stack";
        let parsedLinks: LinkItem[] = [];

        if (isLegacy) {
          name = clusterData.n || "Vault Stack";
          parsedLinks = (clusterData.v || []).map((item: any) => ({
            title: item.t || getDomain(item.u),
            url: item.u,
          }));
        } else {
          name = clusterData.name || "Vault Stack";
          parsedLinks = (clusterData.links || [])
            .map((item: any) => {
              if (typeof item === "string") {
                return { title: getDomain(item), url: item };
              } else if (item && typeof item === "object") {
                return { title: item.title || getDomain(item.url), url: item.url };
              }
              return null;
            })
            .filter(Boolean) as LinkItem[];
        }

        if (parsedLinks.length === 0) {
          throw new Error("The shared cluster contains 0 links.");
        }

        setClusterName(name);
        setLinks(parsedLinks);
      } catch (err: any) {
        console.error("Payload decompression error:", err);
        setError(err.message || "Failed to decompress or parse cluster payload.");
      } finally {
        setLoading(false);
      }
    }

    parsePayload();
  }, [rawData]);

  const handleBrowserBlast = () => {
    if (links.length === 0 || isBlasting) return;

    setIsBlasting(true);
    setBlockedUrls(new Set());
    
    let currentIdx = currentLaunchIndex >= links.length ? 0 : currentLaunchIndex;
    const total = links.length;

    if (currentIdx === 0) {
      setLaunchedUrls(new Set());
    }

    function openNextTab() {
      if (currentIdx >= total) {
        setIsBlasting(false);
        setCurrentLaunchIndex(total);
        return;
      }

      const link = links[currentIdx];
      try {
        const newTab = window.open(link.url, "_blank");
        if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
          // Blocker detected: Mark all remaining links as blocked
          setBlockedUrls(prev => {
            const next = new Set(prev);
            for (let i = currentIdx; i < total; i++) {
              next.add(links[i].url);
            }
            return next;
          });
          setIsBlasting(false);
          return;
        } else {
          setLaunchedUrls(prev => {
            const next = new Set(prev);
            next.add(link.url);
            return next;
          });
          setCurrentLaunchIndex(currentIdx + 1);
        }
      } catch (e) {
        setBlockedUrls(prev => {
          const next = new Set(prev);
          for (let i = currentIdx; i < total; i++) {
            next.add(links[i].url);
          }
          return next;
        });
        setIsBlasting(false);
        return;
      }

      currentIdx++;
      // 200ms delay between tabs prevents device choking and allows browser to spawn tabs smoothly
      setTimeout(openNextTab, 200);
    }

    openNextTab();
  };

  const handleSingleLaunch = (url: string) => {
    window.open(url, "_blank");
    setLaunchedUrls(prev => {
      const next = new Set(prev);
      next.add(url);
      return next;
    });
    setBlockedUrls(prev => {
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAllLaunched = currentLaunchIndex === links.length && links.length > 0;

  return (
    <div className="min-h-screen bg-vault-background text-vault-text font-sans flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Ambient background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-vault-primary/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[450px] h-[450px] rounded-full bg-[#8B5CF6]/8 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 animate-fade-up">
        <div className="bg-vault-card border border-vault-border rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Accent top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-vault-primary to-[#8B5CF6]" />

          {/* 1. Loading State */}
          {loading && (
            <div className="py-12 text-center space-y-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-vault-primary/10 border border-vault-primary/20 flex items-center justify-center text-vault-primary animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold tracking-tight text-white animate-pulse">Opening Beam...</div>
                <p className="text-sm text-vault-muted">Decompressing shared links...</p>
              </div>
            </div>
          )}

          {/* 2. Error State */}
          {!loading && error && (
            <div className="py-8 text-center space-y-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold tracking-tight text-white">Invalid Payload</div>
                <p className="text-sm text-destructive font-medium">{error}</p>
                <p className="text-xs text-vault-muted mt-2 max-w-[280px] mx-auto">
                  Verify that the QR code link is fully intact and has not been truncated.
                </p>
              </div>
            </div>
          )}

          {/* 3. Success state */}
          {!loading && !error && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-vault-primary/10 border border-vault-primary/20 text-vault-primary shadow-glow-primary animate-float">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  {/* Changed tags to div to completely bypass index.css global overrides and custom sizes */}
                  <div className="text-[11px] font-bold tracking-[0.2em] text-vault-primary uppercase leading-none">
                    Quantum Cluster Beam
                  </div>
                  <div className="text-2xl font-extrabold text-white tracking-tight mt-1 leading-snug">
                    {clusterName}
                  </div>
                </div>

                {/* Unified copy share pill */}
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-border/40 border border-vault-border/50">
                    <span className="text-[11px] font-semibold text-white/90 pr-1.5 border-r border-vault-border/50 leading-none">
                      {links.length} Links
                    </span>
                    <button 
                      onClick={copyShareLink}
                      className="flex items-center gap-1 text-[10px] font-bold text-vault-muted hover:text-white transition-colors"
                      title="Copy Share Link"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar visualizer */}
              <div className="space-y-2 px-0.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-vault-muted">
                  <span>Launch Progress</span>
                  <span className="font-bold text-vault-primary">
                    {currentLaunchIndex} of {links.length} Opened
                  </span>
                </div>
                <div className="w-full h-1.5 bg-vault-border/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-vault-primary to-emerald-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(79,124,255,0.4)]"
                    style={{ width: `${(currentLaunchIndex / links.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Links List */}
              <div className="border border-vault-border rounded-2xl bg-black/20 overflow-hidden">
                <div className="max-h-[240px] overflow-y-auto divide-y divide-vault-border/30 scrollbar-thin py-1">
                  {links.map((link, idx) => {
                    const domain = getDomain(link.url);
                    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                    
                    const isLaunched = launchedUrls.has(link.url);
                    const isBlocked = blockedUrls.has(link.url);
                    const isFaviconFailed = failedFavicons.has(link.url);

                    return (
                      <div 
                        key={idx} 
                        onClick={() => handleSingleLaunch(link.url)}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5 cursor-pointer group"
                      >
                        {isFaviconFailed ? (
                          <div className="w-6 h-6 rounded bg-vault-primary/10 border border-vault-primary/20 flex items-center justify-center text-vault-primary flex-shrink-0">
                            <Globe className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <img 
                            src={faviconUrl} 
                            alt="favicon"
                            className="w-6 h-6 rounded bg-white/10 flex-shrink-0 object-contain p-0.5"
                            onError={() => {
                              setFailedFavicons(prev => {
                                const next = new Set(prev);
                                next.add(link.url);
                                return next;
                              });
                            }}
                          />
                        )}
                        
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold truncate leading-snug transition-colors ${
                            isLaunched ? "text-emerald-400" : "text-white group-hover:text-vault-primary"
                          }`}>
                            {link.title}
                          </p>
                          <p className="text-xs text-vault-muted truncate mt-0.5">
                            {link.url}
                          </p>
                        </div>

                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {isLaunched ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                          ) : isBlocked ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                              Blocked
                            </span>
                          ) : (
                            <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBrowserBlast}
                  disabled={isBlasting}
                  className={`w-full text-white font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 hover:-translate-y-[1px] active:translate-y-[1px] ${
                    isAllLaunched 
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20" 
                      : "bg-vault-primary hover:bg-vault-primary/90 shadow-glow-primary"
                  }`}
                >
                  {isBlasting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Blasting Tabs...</span>
                    </>
                  ) : isAllLaunched ? (
                    <>
                      <RotateCw className="w-5 h-5" />
                      <span>Relaunch All Tabs</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-current" />
                      <span>
                        {currentLaunchIndex > 0 ? "Resume Blasting All" : "Launch All Tabs (Auto-Blast)"}
                      </span>
                    </>
                  )}
                </button>

                <a
                  href={`vaultx://import?data=${rawData}`}
                  className="w-full bg-white/5 border border-vault-border hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Import into Vault X App</span>
                </a>
              </div>

              {/* Popup Blocker Guide Alert */}
              {blockedUrls.size > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-3 text-xs text-amber-200 leading-relaxed animate-fade-up">
                  <div className="flex gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[13px] text-white">Browser Blocked Auto-Launch</p>
                      <p className="mt-1 text-amber-100/90">
                        To open all **{links.length} links** automatically in a single click, please enable pop-ups for this website:
                      </p>
                    </div>
                  </div>
                  
                  {/* Visual Instructions */}
                  <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2 text-white/95">
                    <p className="font-bold text-vault-primary flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      1-Time Simple Step:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-vault-muted">
                      <li>Look at your browser address bar (URL bar).</li>
                      <li>Click the **Pop-up Blocker Icon** (looks like a window with a red 'x').</li>
                      <li>Select **"Always allow pop-ups and redirects from this site"**.</li>
                      <li>Click **Done**.</li>
                    </ol>
                  </div>
                  
                  <p className="text-[10px] text-vault-muted italic text-center">
                    Once enabled, click the button above again to open all links instantly.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
