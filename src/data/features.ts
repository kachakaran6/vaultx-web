export interface Feature {
  id: number;
  name: string;
  description: string;
  usecase: string;
  category: string;
}

export const FEATURES: Feature[] = [
  {
    "id": 1,
    "name": "Smart Collections",
    "description": "Folders that automatically pull links based on dynamic rule-sets (e.g., all links containing \"github\" and tagged \"dev\").",
    "usecase": "User wants a \"Dashboard\" folder that updates itself without manual sorting.",
    "category": "Organization & Search"
  },
  {
    "id": 2,
    "name": "Nested Hierarchies",
    "description": "Allow unlimited depth for folders and sub-folders.",
    "usecase": "Organizing complex research like \"Work -> Q3 -> Competitors -> European Market\".",
    "category": "Organization & Search"
  },
  {
    "id": 3,
    "name": "Full-Text Search Engine",
    "description": "Index the actual text content of saved web pages, not just the title/URL.",
    "usecase": "User remembers a specific quote from an article but forgot the title.",
    "category": "Organization & Search"
  },
  {
    "id": 4,
    "name": "Bulk Metadata Editor",
    "description": "Select 50 links and apply tags, categories, or colors simultaneously.",
    "usecase": "Cleaning up a messy vault after months of dumping unorganized links.",
    "category": "Organization & Search"
  },
  {
    "id": 5,
    "name": "Semantic Tagging Engine",
    "description": "A graph-based tag system where \"React\" implies \"JavaScript\" automatically.",
    "usecase": "Searching for \"Frontend\" brings up all React, Vue, and CSS links automatically.",
    "category": "Organization & Search"
  },
  {
    "id": 6,
    "name": "Cross-Linking (Backlinks)",
    "description": "Allow linking one Vault item to another (like Obsidian/Roam).",
    "usecase": "Connecting a Jira ticket link to a PR link and a documentation link.",
    "category": "Organization & Search"
  },
  {
    "id": 7,
    "name": "Contextual Workspaces",
    "description": "Isolate views so Work links and Personal links never mix on screen.",
    "usecase": "Screen sharing during a meeting without exposing personal bookmarks.",
    "category": "Organization & Search"
  },
  {
    "id": 8,
    "name": "Time-Machine View",
    "description": "A calendar interface showing exactly what you researched on a specific day.",
    "usecase": "User wants to find \"that tool I was looking at last Tuesday\".",
    "category": "Organization & Search"
  },
  {
    "id": 9,
    "name": "Custom Views & Layouts",
    "description": "Build your own database views (like Notion) using kanban, timeline, or gallery.",
    "usecase": "Managing a reading pipeline (To Read -> Reading -> Done) via Kanban.",
    "category": "Organization & Search"
  },
  {
    "id": 10,
    "name": "Fuzzy Search & Typo Tolerance",
    "description": "Implement Levenshtein distance for search queries.",
    "usecase": "Finding \"Youtube\" when the user types \"Yutobe\".",
    "category": "Organization & Search"
  },
  {
    "id": 11,
    "name": "Pinning & Starred Hubs",
    "description": "A dedicated fast-access hub for the top 1% most critical links.",
    "usecase": "Opening the morning routine links (Email, Calendar, Analytics) in one click.",
    "category": "Organization & Search"
  },
  {
    "id": 12,
    "name": "Duplicate Resolver",
    "description": "Detect exact and similar URLs, prompting to merge or delete.",
    "usecase": "Preventing vault bloat when saving the same Wikipedia article 3 times.",
    "category": "Organization & Search"
  },
  {
    "id": 13,
    "name": "Visual Link Previews",
    "description": "Generate high-res thumbnails of the website as it appeared when saved.",
    "usecase": "Identifying a website purely by its visual design rather than text.",
    "category": "Organization & Search"
  },
  {
    "id": 14,
    "name": "Keyboard-First Command Palette",
    "description": "A Ctrl+K interface to navigate, search, and edit anything instantly.",
    "usecase": "Power users wanting to manage their vault without touching the mouse.",
    "category": "Organization & Search"
  },
  {
    "id": 15,
    "name": "Geotagged Links",
    "description": "Attach GPS coordinates to bookmarks.",
    "usecase": "Saving restaurant links while traveling and viewing them on a map.",
    "category": "Organization & Search"
  },
  {
    "id": 16,
    "name": "Auto-Summarization",
    "description": "AI generates a 3-bullet summary of the article upon saving.",
    "usecase": "Grasping the core concept of a 10,000-word essay in 5 seconds.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 17,
    "name": "Chat-with-Vault",
    "description": "An LLM interface that answers questions using only your saved links as context.",
    "usecase": "Asking \"What did those articles say about React performance?\"",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 18,
    "name": "Sentiment Analysis",
    "description": "AI flags articles as positive, negative, or neutral based on content.",
    "usecase": "Filtering news bookmarks by \"Good News\" to avoid doomscrolling.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 19,
    "name": "Automated Categorization",
    "description": "AI reads the URL content and slots it into the correct folder.",
    "usecase": "Zero-friction saving; the user never has to manually categorize again.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 20,
    "name": "Read-Time Estimator",
    "description": "AI calculates exact reading time based on word count and complexity.",
    "usecase": "Filtering the \"To Read\" list for things that take \"< 5 mins\" while waiting for a bus.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 21,
    "name": "Action-Item Extractor",
    "description": "AI pulls out tasks and to-dos embedded within a saved link.",
    "usecase": "Saving a recipe and getting a generated grocery list automatically.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 22,
    "name": "Concept Clustering",
    "description": "AI groups visually or semantically similar links without tags.",
    "usecase": "Discovering that 15 of your links form a cluster around \"Machine Learning Basics\".",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 23,
    "name": "AI Clickbait Detector",
    "description": "Analyzes headlines and warns if the article is historically clickbait.",
    "usecase": "Saving time by avoiding low-quality journalism.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 24,
    "name": "Translation Engine",
    "description": "Automatically translates saved foreign links into the user native language.",
    "usecase": "A researcher saving Japanese tech blogs and reading them in English.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 25,
    "name": "Content Decay Predictor",
    "description": "AI estimates how quickly the information in a link will become outdated.",
    "usecase": "Highlighting Javascript framework tutorials as \"likely outdated\" after 2 years.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 26,
    "name": "Auto-Highlighting",
    "description": "AI highlights the most critical sentences in the archived text.",
    "usecase": "Skimming an article by only reading the AI-determined core arguments.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 27,
    "name": "Related Content Recommender",
    "description": "Suggests similar links from your vault when viewing a specific link.",
    "usecase": "Going down a personal rabbit hole of connected research.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 28,
    "name": "External Discovery",
    "description": "AI suggests new web content based on your vault's topics.",
    "usecase": "Discovering new blogs that match your highly specific niche interests.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 29,
    "name": "Podcast/Audio Transcription",
    "description": "AI fetches YouTube/Podcast links and transcribes the audio to text.",
    "usecase": "Searching for a specific spoken quote within a 2-hour video bookmark.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 30,
    "name": "Visual Data Extraction",
    "description": "AI extracts charts, tables, and images from the saved link into a gallery.",
    "usecase": "Building a mood board or data dashboard directly from saved articles.",
    "category": "Smart & AI Intelligence"
  },
  {
    "id": 31,
    "name": "Full Offline Archive",
    "description": "Downloads the entire HTML, CSS, and images of a page locally.",
    "usecase": "Reading saved Wikipedia pages on an airplane without WiFi.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 32,
    "name": "Clean Reader Mode",
    "description": "Strips all ads, popups, and banners, leaving only typography.",
    "usecase": "Focusing on a long-form article without getting distracted by sidebars.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 33,
    "name": "Text-to-Speech (TTS)",
    "description": "Reads the saved article aloud using neural voices.",
    "usecase": "Listening to saved blog posts while driving or cooking.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 34,
    "name": "EPUB/PDF Export",
    "description": "Bundle a folder of links into a formatted eBook.",
    "usecase": "Compiling 20 articles into a custom book for Kindle reading.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 35,
    "name": "Highlighting & Annotations",
    "description": "Allow users to select text and add marginalia notes.",
    "usecase": "Active reading and studying for a university thesis.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 36,
    "name": "Infinite Scroll Queue",
    "description": "Stitches unread articles together into one continuous feed.",
    "usecase": "Binge-reading the weekend backlog without clicking \"next\".",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 37,
    "name": "Bionic Reading Toggle",
    "description": "Bolds the first few letters of words to increase reading speed.",
    "usecase": "Users with ADHD consuming text significantly faster.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 38,
    "name": "Paywall Bypass/Snapshot",
    "description": "Uses archive.org or Google Cache to fetch paywalled content.",
    "usecase": "Reading a crucial news article when the original site blocks access.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 39,
    "name": "Video PiP Player",
    "description": "Extracts YouTube/Vimeo embeds to play in a Picture-in-Picture window.",
    "usecase": "Watching a saved tutorial while typing notes in the vault.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 40,
    "name": "Progress Tracking",
    "description": "Remembers scroll position for every article in the vault.",
    "usecase": "Resuming a 50-page technical manual exactly where you left off.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 41,
    "name": "Focus Metrics",
    "description": "Tracks how much time is actually spent reading vs skimming.",
    "usecase": "Self-quantification of learning habits.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 42,
    "name": "Dark Web/Tor Support",
    "description": "Ability to resolve and archive .onion links.",
    "usecase": "Privacy researchers saving decentralized content securely.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 43,
    "name": "Print-Optimized Formatting",
    "description": "Generates a perfect, ink-saving print layout for any article.",
    "usecase": "Printing a recipe or manual without wasting 5 pages of ads.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 44,
    "name": "Tweet Thread Unroller",
    "description": "Converts long Twitter/X threads into a single readable blog post.",
    "usecase": "Saving social media knowledge in a digestible format.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 45,
    "name": "Version History Archiving",
    "description": "Takes periodic snapshots of a URL to track changes over time.",
    "usecase": "Monitoring a competitor's pricing page for changes.",
    "category": "Offline, Reader & Media"
  },
  {
    "id": 46,
    "name": "Zero-Knowledge Encryption",
    "description": "Encrypts the entire database using a local key; server never sees data.",
    "usecase": "Storing sensitive financial links knowing even the devs cannot read them.",
    "category": "Security & Privacy"
  },
  {
    "id": 47,
    "name": "Biometric Unlock",
    "description": "Requires FaceID / Fingerprint to open the Vault or specific folders.",
    "usecase": "Handing your phone to a friend without exposing your private bookmarks.",
    "category": "Security & Privacy"
  },
  {
    "id": 48,
    "name": "Self-Destructing Links",
    "description": "Links that delete themselves after a set date or view count.",
    "usecase": "Sharing a temporary credential link that expires in 24 hours.",
    "category": "Security & Privacy"
  },
  {
    "id": 49,
    "name": "Password Generator",
    "description": "Built-in secure password generation for the credentials feature.",
    "usecase": "Creating a new account and immediately saving the complex password.",
    "category": "Security & Privacy"
  },
  {
    "id": 50,
    "name": "Breach Monitor",
    "description": "Checks saved domains against HaveIBeenPwned API.",
    "usecase": "Alerting the user if a website they saved credentials for was hacked.",
    "category": "Security & Privacy"
  },
  {
    "id": 51,
    "name": "TOTP 2FA Authenticator",
    "description": "Generates 6-digit 2FA codes alongside the username/password.",
    "usecase": "Logging into a site using Vault X as the primary authenticator app.",
    "category": "Security & Privacy"
  },
  {
    "id": 52,
    "name": "Phishing Protection",
    "description": "Warns if a saved link closely resembles a known malicious domain.",
    "usecase": "Preventing the user from accidentally saving \"paypa1.com\".",
    "category": "Security & Privacy"
  },
  {
    "id": 53,
    "name": "Local-Only Mode",
    "description": "A strict toggle that severs all internet sync and AI features.",
    "usecase": "Journalists operating in hostile environments needing absolute air-gaps.",
    "category": "Security & Privacy"
  },
  {
    "id": 54,
    "name": "Decoy Vault",
    "description": "Entering a fake master password opens a secondary, dummy vault.",
    "usecase": "Plausible deniability during forced device searches at border crossings.",
    "category": "Security & Privacy"
  },
  {
    "id": 55,
    "name": "Audit Logs",
    "description": "A tamper-proof ledger of every time a link was viewed, edited, or shared.",
    "usecase": "Corporate compliance tracking for shared team vaults.",
    "category": "Security & Privacy"
  },
  {
    "id": 56,
    "name": "Hardware Key Support",
    "description": "Requires YubiKey or NFC token to decrypt the database.",
    "usecase": "Maximum security posture for enterprise users.",
    "category": "Security & Privacy"
  },
  {
    "id": 57,
    "name": "Encrypted File Attachments",
    "description": "Attach PDFs or images to a link, stored purely in encrypted blobs.",
    "usecase": "Saving a tax receipt PDF alongside the link to the tax portal.",
    "category": "Security & Privacy"
  },
  {
    "id": 58,
    "name": "Clipboard Auto-Clear",
    "description": "Automatically purges the system clipboard 30s after copying a password.",
    "usecase": "Preventing clipboard snooping by malicious background apps.",
    "category": "Security & Privacy"
  },
  {
    "id": 59,
    "name": "Hidden/Ghost Links",
    "description": "Links that do not appear in search or lists unless explicitly toggled.",
    "usecase": "Hiding surprise gift links from a shared family computer.",
    "category": "Security & Privacy"
  },
  {
    "id": 60,
    "name": "VPN Routing per Link",
    "description": "Forces specific links to only open if a certain VPN profile is active.",
    "usecase": "Ensuring internal company links only open on the corporate intranet.",
    "category": "Security & Privacy"
  },
  {
    "id": 61,
    "name": "Live Sync Co-op",
    "description": "Multiplayer mode where two users can organize a folder simultaneously.",
    "usecase": "A research team live-sorting links during a Zoom call.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 62,
    "name": "Granular Permissions",
    "description": "Share a folder with \"View Only\", \"Can Edit\", or \"Can Add\" roles.",
    "usecase": "A teacher sharing a syllabus folder with students (Read-Only).",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 63,
    "name": "Public Vault Profiles",
    "description": "A Linktree-style public page showcasing curated public folders.",
    "usecase": "An influencer sharing their \"Top UI Design Resources\" portfolio.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 64,
    "name": "Link Comments & Threads",
    "description": "Inline commenting system on shared links.",
    "usecase": "Team members debating the merits of a competitor's article.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 65,
    "name": "Upvoting & Polling",
    "description": "Team members can upvote links in a shared folder.",
    "usecase": "Democratically deciding which software vendor to choose based on saved links.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 66,
    "name": "Activity Feed",
    "description": "A timeline of what links your network/team has added recently.",
    "usecase": "Staying updated on what your engineering team is reading this week.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 67,
    "name": "Bounty/Request System",
    "description": "Ask your team to find and save links matching a criteria.",
    "usecase": "Requesting \"Someone find good articles on Docker deployment\".",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 68,
    "name": "Share-by-QR Code",
    "description": "Generates a highly compressed QR code that transfers link data offline.",
    "usecase": "Sharing a contact link locally without internet access.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 69,
    "name": "Guest Dropboxes",
    "description": "An unauthenticated URL where anyone can submit a link to your vault.",
    "usecase": "Collecting portfolio submissions for a job posting.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 70,
    "name": "Shared Credentials Rotation",
    "description": "Share a password, but when the owner changes it, it updates for everyone.",
    "usecase": "Managing the shared team Twitter account password.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 71,
    "name": "Embeddable Vault Widgets",
    "description": "Generate iframe code to embed a live Vault folder on a website.",
    "usecase": "Embedding a dynamic resource list into a personal blog.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 72,
    "name": "Social Discovery Graph",
    "description": "See who else saved this exact link (if public).",
    "usecase": "Finding out which thought leaders also bookmarked an obscure whitepaper.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 73,
    "name": "Team Tag Taxonomy",
    "description": "Enforce a strict dictionary of allowed tags for a corporate workspace.",
    "usecase": "Preventing tag fragmentation (e.g. \"reactjs\" vs \"react\").",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 74,
    "name": "Expiring Shares",
    "description": "A share link that revokes access after 7 days.",
    "usecase": "Granting temporary access to project resources for a freelancer.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 75,
    "name": "Revocation Panic Button",
    "description": "Instantly nullifies all shared links and public profiles worldwide.",
    "usecase": "Emergency lockdown of data leaks.",
    "category": "Collaboration & Sharing"
  },
  {
    "id": 76,
    "name": "REST API",
    "description": "Full programmatic access to read/write Vault data.",
    "usecase": "Building a custom python script to push server logs as Vault notes.",
    "category": "Integrations & API"
  },
  {
    "id": 77,
    "name": "Webhooks",
    "description": "Trigger external events when a link is added or tagged.",
    "usecase": "Sending a Discord message whenever a link is tagged \"urgent\".",
    "category": "Integrations & API"
  },
  {
    "id": 78,
    "name": "IFTTT / Zapier Integration",
    "description": "No-code pipelines for Vault X.",
    "usecase": "\"If I like a YouTube video, save it to Vault X automatically.\"",
    "category": "Integrations & API"
  },
  {
    "id": 79,
    "name": "CLI Client",
    "description": "Manage the vault entirely from the terminal.",
    "usecase": "Developers saving StackOverflow links without leaving their IDE.",
    "category": "Integrations & API"
  },
  {
    "id": 80,
    "name": "Browser Extension (Deep)",
    "description": "Replaces the default browser new tab page and bookmark manager.",
    "usecase": "Making Vault X the absolute center of the user's web experience.",
    "category": "Integrations & API"
  },
  {
    "id": 81,
    "name": "Alfred / Raycast Extension",
    "description": "Global OS shortcut to search the vault from anywhere.",
    "usecase": "Opening a link in 1 second without opening the Vault X app first.",
    "category": "Integrations & API"
  },
  {
    "id": 82,
    "name": "Markdown/Obsidian Sync",
    "description": "Two-way sync between Vault X folders and local Markdown files.",
    "usecase": "Integrating web research directly into a PKM (Personal Knowledge Base).",
    "category": "Integrations & API"
  },
  {
    "id": 83,
    "name": "Email-to-Vault",
    "description": "A dedicated email address (save@vaultx.com) to forward newsletters to.",
    "usecase": "Saving a weekly newsletter directly into the Read-It-Later queue.",
    "category": "Integrations & API"
  },
  {
    "id": 84,
    "name": "RSS Feed Generation",
    "description": "Turns any Vault folder into a subscribeable RSS feed.",
    "usecase": "Publishing a curated news feed for others to consume in their RSS readers.",
    "category": "Integrations & API"
  },
  {
    "id": 85,
    "name": "Bulk Import/Export API",
    "description": "Lossless JSON/CSV parsing for Netscape Bookmark HTML.",
    "usecase": "Migrating 10,000 links from Chrome seamlessly.",
    "category": "Integrations & API"
  },
  {
    "id": 86,
    "name": "Custom CSS Theming",
    "description": "Allow users to write custom CSS to style their personal Vault interface.",
    "usecase": "Power users tailoring the UI exactly to their personal brand.",
    "category": "Integrations & API"
  },
  {
    "id": 87,
    "name": "Scriptable Macros",
    "description": "Write JavaScript snippets that run on saved links (like Greasemonkey).",
    "usecase": "A macro that automatically strips UTM parameters from all saved URLs.",
    "category": "Integrations & API"
  },
  {
    "id": 88,
    "name": "Local File Indexing",
    "description": "Allow saving `file://` URIs and indexing local PDFs.",
    "usecase": "Bridging the gap between web bookmarks and local filesystem management.",
    "category": "Integrations & API"
  },
  {
    "id": 89,
    "name": "Database Sharding",
    "description": "Split a massive vault into multiple separate database files.",
    "usecase": "Managing a vault with 1,000,000+ links without crashing the browser.",
    "category": "Integrations & API"
  },
  {
    "id": 90,
    "name": "Headless Mode",
    "description": "Run Vault X as a background daemon on a Raspberry Pi.",
    "usecase": "Self-hosting a personal archive server for family use.",
    "category": "Integrations & API"
  },
  {
    "id": 91,
    "name": "Knowledge Graph Viz",
    "description": "A node-graph showing how all your links and tags connect.",
    "usecase": "Visualizing the \"brain\" to see gaps in personal research.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 92,
    "name": "Reading Streaks",
    "description": "Tracks consecutive days of reading/clearing the queue.",
    "usecase": "Motivating users to read at least one saved article a day.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 93,
    "name": "Time-Wasted Calculator",
    "description": "Estimates time spent on links tagged \"Entertainment\".",
    "usecase": "Digital wellbeing and self-reflection.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 94,
    "name": "Data Portability Score",
    "description": "Analyzes how reliant you are on locked-in platforms vs open web.",
    "usecase": "Encouraging users to read independent blogs over walled gardens.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 95,
    "name": "Tag Entropy Metric",
    "description": "Warns the user if they have too many redundant tags.",
    "usecase": "Maintaining a clean, efficient organizational structure.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 96,
    "name": "Velocity Tracking",
    "description": "Measures how fast you add links vs how fast you consume them.",
    "usecase": "Alerting the user to \"Tsundoku\" (hoarding without reading).",
    "category": "Analytics & Gamification"
  },
  {
    "id": 97,
    "name": "Domain Trust Score",
    "description": "Calculates an aggregate score based on the reputation of saved links.",
    "usecase": "Assessing the factual reliability of a research folder.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 98,
    "name": "Gamified Badges",
    "description": "Unlock achievements (e.g., \"Archivist: Save 1,000 links\").",
    "usecase": "Making the mundane task of bookmarking slightly more engaging.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 99,
    "name": "Topic Drift Analysis",
    "description": "AI analyzes how your saved categories evolve over a decade.",
    "usecase": "Fascinating insight into personal career or hobby transitions.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 100,
    "name": "Share Analytics",
    "description": "Track how many times your public shared vault was clicked.",
    "usecase": "Influencers measuring the impact of their curated resource lists.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 101,
    "name": "Focus Mode (Pomodoro)",
    "description": "Locks the UI into a single article with a 25-minute timer.",
    "usecase": "Deep work and intense study sessions.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 102,
    "name": "Smart Pagination Fetch",
    "description": "Automatically fetches page 2, 3, etc of an article and merges it.",
    "usecase": "Reading multi-page tutorials in one single smooth scroll.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 103,
    "name": "Link Expiration Warnings",
    "description": "Warns if a domain registration is expiring soon.",
    "usecase": "Archiving a favorite indie blog before it disappears off the internet.",
    "category": "Analytics & Gamification"
  },
  {
    "id": 104,
    "name": "The Vault API Marketplace",
    "description": "A plugin store where users can write and share Vault X extensions.",
    "usecase": "Community-driven feature expansion scaling indefinitely.",
    "category": "Analytics & Gamification"
  }
];
