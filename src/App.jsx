import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Minimal in-file UI primitives (to avoid external deps) ---
const Button = ({ children, onClick, className = "", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-2xl shadow-sm border border-white/10 bg-white/10 hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder = "", className = "", type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-3 rounded-2xl themed-field focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
  />
);

const Textarea = ({ value, onChange, placeholder = "", className = "" }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={4}
    className={`w-full px-4 py-3 rounded-2xl themed-field focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
  />
);

const Select = ({ options, value, onChange, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-3 py-2 rounded-xl themed-field focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
    <span className="text-sm opacity-80">{label}</span>
    <span
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(!checked)}
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full p-1 transition ${checked ? "bg-indigo-600" : "bg-white/20"}`}
    >
      <span className={`block w-4 h-4 bg-white rounded-full transition ${checked ? "translate-x-6" : "translate-x-0"}`}></span>
    </span>
  </label>
);

// --- Tiny toast system ---
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const push = (msg, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };
  const view = (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`px-4 py-3 rounded-xl shadow border text-sm ${
              t.type === "error"
                ? "bg-rose-50/90 dark:bg-rose-900/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100"
                : t.type === "success"
                ? "bg-emerald-50/90 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
                : "bg-white/90 dark:bg-zinc-900/70 border-gray-200 dark:border-zinc-800"
            }`}
          >
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
  return { push, view };
};
// Simple auth forms component
function AuthForms({ onRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="space-y-3">
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6)" />
      <div className="flex gap-2">
        <Button onClick={() => onRegister(email, password)} className="bg-white/10 hover:bg-white/20">Register</Button>
        <Button onClick={() => onLogin(email, password)}>Login</Button>
      </div>
    </div>
  );
}

// --- i18n (lightweight) ---
const LOCALES = {
  en: {
    appName: "AstraForge — AI Image Creator",
    tagline: "Type. Tweak. Create magic.",
    prompt: "Prompt",
    negativePrompt: "Negative prompt",
    generate: "Generate",
    advanced: "Advanced",
    presets: "Style presets",
    gallery: "Gallery",
    history: "History",
    faq: "FAQ",
    download: "Download",
    copy: "Copy prompt",
    lang: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    neon: "Neon",
    backendWarning: "Backend not connected — this is a frontend-only preview.",
    placeholderPrompt: "ultra-detailed portrait of a cyberpunk fox, neon bokeh, 85mm, film grain",
    placeholderNegative: "blurry, watermark, lowres, oversaturated",
    steps: "Steps",
    guidance: "Guidance (CFG)",
    size: "Size",
    seed: "Seed",
    safety: "Safety filter",
    nsfwBlock: "Block unsafe prompts",
    shortcuts: "Shortcuts",
    kbd: {
      run: "⌘ / Ctrl + Enter",
      focus: "/ to focus",
      theme: "T to toggle theme",
    },
    faqItems: [
      {
        q: "What is this site?",
        a: "A modern frontend template for an AI image generator. The backend (model) is not connected yet.",
      },
      {
        q: "Is it free?",
        a: "Yes, running locally is free. Hosting high-end models in the cloud requires paid GPUs.",
      },
      {
        q: "Which models will work?",
        a: "Any text-to-image API or local runtime (e.g., Stable Diffusion, Flux). You only need to wire the /generate call.",
      },
      {
        q: "Can I use it with my backend?",
        a: "Yes. Replace the fake request in handleGenerate() with your API endpoint and return an image URL or base64.",
      },
    ],
  },
  az: {
    appName: "AstraForge — Süni Şəkil Generatoru",
    tagline: "Yaz. Dəyiş. Sehr yarat.",
    prompt: "Sorğu mətni",
    negativePrompt: "Mənfi sorğu",
    generate: "Yarat",
    advanced: "Geniş parametrlər",
    presets: "Stil şablonları",
    gallery: "Qalereya",
    history: "Tarixçə",
    faq: "Tez-tez verilən suallar",
    download: "Yüklə",
    copy: "Sorğunu kopyala",
    lang: "Dil",
    theme: "Mövzu",
    light: "Açıq",
    dark: "Tünd",
    system: "Sistem",
    neon: "Neon",
    backendWarning: "Backend qoşulmayıb — bu yalnız frontend önizləməsidir.",
    placeholderPrompt: "kibərpank tülkünün ultra-detal portreti, neon bokeh, 85mm, film taxılı",
    placeholderNegative: "bulanıq, filigran, aşağı keyfiyyət, çox doymuş",
    steps: "Addımlar",
    guidance: "Rəhbərlik (CFG)",
    size: "Ölçü",
    seed: "Toxum (seed)",
    safety: "Təhlükəsizlik filtri",
    nsfwBlock: "Uyğunsuz sorğuları blokla",
    shortcuts: "Qısa yollar",
    kbd: { run: "⌘ / Ctrl + Enter", focus: "/ fokus", theme: "T — mövzu" },
    faqItems: [
      { q: "Bu nədir?", a: "AI şəkil generatoru üçün müasir frontend şablonu. Backend (model) hələ qoşulmayıb." },
      { q: "Puldandır?", a: "Yerli işlətmək pulsuzdur. Buludda güclü modellər üçün ödənişli GPU lazımdır." },
      { q: "Hansılar işləyəcək?", a: "Hər hansı mətndən-şəklə API və ya lokal runtime (məs. Stable Diffusion, Flux). Sadəcə /generate çağırışını qoşun." },
      { q: "Öz backend-imlə işlədim?", a: "Bəli. handleGenerate() funksiyasında saxta sorğunu API-nizlə əvəz edin və şəkil URL-i və ya base64 qaytarın." },
    ],
  },
};

// --- Utility ---
const placeholderImages = [
  "https://placehold.co/1024x768/png?text=Your+Image+Here",
  "https://placehold.co/768x768/png?text=Preview",
  "https://placehold.co/896x512/png?text=Sample",
  "https://placehold.co/640x640/png?text=Gallery",
];

const StyleChip = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 transition"
  >
    {label}
  </button>
);

const Accordion = ({ items }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-gray-200 dark:divide-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
      {items.map((it, idx) => (
        <div key={idx}>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left bg-white/50 dark:bg-zinc-900/30"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <span className="font-medium">{it.q}</span>
            <span className="text-xl">{open === idx ? "−" : "+"}</span>
          </button>
          <AnimatePresence initial={false}>
            {open === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 text-sm opacity-90 bg-white/40 dark:bg-zinc-900/20"
              >
                {it.a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    return localStorage.getItem("theme") || "system";
  });
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const T = useMemo(() => LOCALES[lang], [lang]);

  const [prompt, setPrompt] = useState("");
  const [negative, setNegative] = useState("");
  const [steps, setSteps] = useState(30);
  const [cfg, setCfg] = useState(7.5);
  const [size, setSize] = useState("768x768");
  const [seed, setSeed] = useState("");
  const [safe, setSafe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [history, setHistory] = useState([]);

  const { push, view } = useToast();
  const inputRef = useRef(null);

  // App navigation and simple auth/billing state
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("tab") || "generate");
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [credits, setCredits] = useState(() => parseInt(localStorage.getItem("credits") || "0", 10));

  // theme handling
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Remove all theme classes first
    root.classList.remove("dark", "neon");
    
    // Apply the appropriate theme class
    if (theme === "dark" || (theme === "system" && prefersDark)) {
      root.classList.add("dark");
    } else if (theme === "neon") {
      root.classList.add("neon");
    }
    
    // Force a re-render to apply theme changes
    root.style.setProperty('--theme-applied', Date.now().toString());
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key.toLowerCase() === "t") {
        setTheme((prev) => (prev === "dark" ? "light" : prev === "light" ? "neon" : prev === "neon" ? "system" : "dark"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      push("Please enter a prompt.", "error");
      inputRef.current?.focus();
      return;
    }
    // Credit enforcement: free or offline users need credits
    const unlimited = user && (user.plan === 'standard' || user.plan === 'pro');
    if (!unlimited) {
      const current = parseInt(localStorage.getItem('credits')||'0',10);
      if (current <= 0) {
        push("No credits left. Buy one-time credit in Pricing.", 'error');
        setActiveTab('pricing');
        return;
      }
      localStorage.setItem('credits', String(current - 1));
      setCredits(current - 1);
    }
    setLoading(true);
    push(T.backendWarning, "info");

    // Simulate a generation delay & preview (since backend isn't wired yet)
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1200));
    const fake = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    setImageUrl(fake);

    const record = {
      id: Date.now(),
      prompt,
      negative,
      steps,
      cfg,
      size,
      seed,
      ts: new Date().toLocaleString(),
      url: fake,
    };
    setHistory((h) => [record, ...h].slice(0, 12));
    setLoading(false);
  };

  // --- Mock auth and billing ---
  const handleRegister = async (email, password) => {
    if (!email.includes("@") || password.length < 6) {
      push("Enter a valid email and a 6+ character password.", "error");
      return;
    }
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      const data = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      push("Account created. You are signed in.", "success");
      setActiveTab("generate");
    } catch (e) {
      // Fallback for GitHub Pages: store locally when server isn't reachable
      const localUser = { id: Date.now(), email, plan: 'free', credits: 0 };
      setUser(localUser);
      localStorage.setItem('user', JSON.stringify(localUser));
      push("Registered locally (offline mode).", 'info');
      setActiveTab('generate');
    }
  };

  const handleLogin = async (email, password) => {
    if (!email.includes("@")) { push("Enter a valid email.", "error"); return; }
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      const data = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      push("Signed in.", "success");
      setActiveTab("generate");
    } catch (e) {
      // Offline fallback: accept any email/password and persist locally
      const localUser = { id: Date.now(), email, plan: 'free', credits: parseInt(localStorage.getItem('credits')||'0',10) };
      setUser(localUser);
      localStorage.setItem('user', JSON.stringify(localUser));
      push('Signed in (offline mode).', 'info');
      setActiveTab('generate');
    }
  };

  const handleLogout = async () => {
    try { await fetch('/api/logout', { method: 'POST' }); } catch {}
    setUser(null);
    localStorage.removeItem("user");
    push("Signed out.", "info");
  };

  const subscribePlans = {
    standard: { name: "Standard", price: 9, period: "/mo", features: ["Fast queue", "768×768 up to 30 steps", "Basic styles", "Commercial use"], color: "from-indigo-500 to-sky-500" },
    pro: { name: "Pro", price: 29, period: "/mo", features: ["Priority queue", "1024×1024 up to 60 steps", "All styles + custom presets", "Bulk downloads", "API access"], color: "from-fuchsia-500 to-rose-500" },
    onetime: { name: "One‑time", price: 0.10, period: "/image", features: ["Pay per image", "No subscription", "Great for quick tasks"], color: "from-emerald-500 to-teal-500" },
  };

  const handleSubscribe = async (planKey) => {
    const plan = subscribePlans[planKey];
    if (!user) {
      push("Sign in to continue to checkout.", "error");
      setActiveTab("account");
      return;
    }
    if (planKey === "onetime") {
      try {
        const res = await fetch('/api/buy-credit', { method: 'POST' });
        if (!res.ok) throw new Error('Purchase failed');
        const data = await res.json();
        setCredits(data.credits);
        localStorage.setItem('credits', String(data.credits));
        push("Purchased 1 credit for $0.10.", "success");
      } catch (e) {
        // Offline fallback
        const next = credits + 1;
        setCredits(next);
        localStorage.setItem('credits', String(next));
        push('Credit added (offline mode).', 'info');
      }
      return;
    }
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: planKey }) });
      if (!res.ok) throw new Error('Subscription failed');
      const data = await res.json();
      const updated = { ...user, plan: data.plan };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      push(`Subscribed to ${plan.name}.`, 'success');
    } catch (e) {
      // Offline fallback
      const updated = { ...user, plan: planKey };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      push(`Subscribed to ${plan.name} (offline mode).`, 'info');
    }
  };

  const sizeOptions = [
    { value: "512x512", label: "512 × 512" },
    { value: "640x640", label: "640 × 640" },
    { value: "768x768", label: "768 × 768" },
    { value: "1024x768", label: "1024 × 768" },
    { value: "896x512", label: "896 × 512" },
  ];

  const stylePresets = [
    "Photorealistic",
    "Anime",
    "Cinematic",
    "Isometric",
    "Watercolor",
    "Pixel art",
    "Neon noir",
  ];

  const applyPreset = (preset) => {
    const map = {
      Photorealistic: ", ultra-detailed, 85mm, natural light, RAW, high dynamic range",
      Anime: ", anime style, clean lineart, vibrant colors, studio quality",
      Cinematic: ", cinematic lighting, shallow depth of field, film grain, anamorphic bokeh",
      Isometric: ", isometric perspective, detailed, volumetric lighting",
      Watercolor: ", watercolor style, soft edges, paper texture",
      "Pixel art": ", pixel art, 1-bit dithering, 32x32 style, retro",
      "Neon noir": ", cyberpunk, neon glow, moody shadows, noir",
    };
    setPrompt((p) => (p ? p + map[preset] : `A scene${map[preset]}`));
  };

  return (
    <div className="min-h-screen text-zinc-100">
      <div className="app-bg" aria-hidden="true"></div>
      {view}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/90 flex items-center justify-center text-white font-bold shadow-lg">A</div>
            <div>
              <div className="font-semibold leading-tight">{T.appName}</div>
              <div className="text-xs opacity-70">{T.tagline}</div>
            </div>
          </div>
          <nav className="ml-6 hidden sm:flex items-center gap-1">
            {[
              { k: "generate", label: "Generate" },
              { k: "pricing", label: "Pricing" },
              { k: "explore", label: "Explore" },
              { k: "account", label: user ? "Account" : "Sign in" },
            ].map((item) => (
              <button
                key={item.k}
                onClick={() => setActiveTab(item.k)}
                className={`px-3 py-2 rounded-xl text-sm transition border ${
                  activeTab === item.k
                    ? "bg-white/10 border-white/20"
                    : "border-white/5 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Select
              value={lang}
              onChange={setLang}
              options={[
                { value: "en", label: "English" },
                { value: "az", label: "Azərbaycan" },
              ]}
            />
            <Select
              value={theme}
              onChange={setTheme}
              options={[
                { value: "system", label: `${T.theme}: ${T.system}` },
                { value: "light", label: `${T.theme}: ${T.light}` },
                { value: "dark", label: `${T.theme}: ${T.dark}` },
                { value: "neon", label: `${T.theme}: Neon` },
              ]}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {activeTab === "generate" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <div className="rounded-3xl p-4 sm:p-6 glass hover-float">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-600/20 text-indigo-200 border border-indigo-400/20">Text → Image</span>
                  <span className="text-xs opacity-70">({T.shortcuts}: {T.kbd.run}, {T.kbd.focus}, {T.kbd.theme})</span>
                </div>

                <Input
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={T.placeholderPrompt}
                  className="mb-3"
                />

                <Textarea
                  value={negative}
                  onChange={(e) => setNegative(e.target.value)}
                  placeholder={T.placeholderNegative}
                  className="mb-4"
                />

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm mb-1">{T.steps}</label>
                    <input type="range" min={10} max={60} value={steps} onChange={(e) => setSteps(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                    <div className="text-xs opacity-70 mt-1">{steps}</div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{T.guidance}</label>
                    <input type="range" min={1} max={12} step={0.1} value={cfg} onChange={(e) => setCfg(parseFloat(e.target.value))} className="w-full accent-fuchsia-500" />
                    <div className="text-xs opacity-70 mt-1">{cfg}</div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{T.size}</label>
                    <Select value={size} onChange={setSize} options={sizeOptions} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{T.seed}</label>
                    <Input value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="e.g. 1337 or empty" />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Toggle checked={safe} onChange={setSafe} label={`${T.safety}: ${T.nsfwBlock}`} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={() => navigator.clipboard.writeText(prompt)} className="text-sm hover-float">{T.copy}</Button>
                    <Button onClick={handleGenerate} disabled={loading} className="bg-indigo-600 text-white hover:bg-indigo-700 hover-float">{loading ? "…" : T.generate}</Button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm mb-2 font-medium">{T.presets}</div>
                  <div className="flex flex-wrap gap-2">
                    {stylePresets.map((s) => (
                      <StyleChip key={s} label={s} onClick={() => applyPreset(s)} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <aside className="space-y-6">
              <div className="rounded-3xl p-3 glass hover-float">
                <div className="text-sm mb-2 font-medium">{T.gallery}</div>
                <div className="aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center">
                  {imageUrl ? (
                    <motion.img key={imageUrl} src={imageUrl} alt="Generated" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs opacity-60 p-6 text-center">No image yet. Enter a prompt and click Generate.</div>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button onClick={() => imageUrl && window.open(imageUrl, "_blank")} className="flex-1 hover-float" disabled={!imageUrl}>{T.download}</Button>
                </div>
              </div>

              <div className="rounded-3xl p-3 glass hover-float">
                <div className="text-sm mb-2 font-medium">{T.history}</div>
                <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
                  {history.length === 0 && <div className="text-xs opacity-60">No history yet.</div>}
                  {history.map((h) => (
                    <div key={h.id} className="flex gap-3 items-start p-2 rounded-xl hover:bg-white/5 transition">
                      <img src={h.url} alt="thumb" className="w-14 h-14 rounded-lg object-cover border border-white/10" />
                      <div className="min-w-0">
                        <div className="text-xs opacity-60">{h.ts}</div>
                        <div className="text-sm truncate max-w-[240px]" title={h.prompt}>{h.prompt}</div>
                      </div>
                      <div className="ml-auto">
                        <Button className="text-xs hover-float" onClick={() => setImageUrl(h.url)}>Open</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "pricing" && (
          <section>
            <div className="mb-6 text-center">
              <div className="text-2xl font-semibold">Choose your plan</div>
              <div className="opacity-70 text-sm mt-1">Cancel anytime. One‑time option available for quick tasks.</div>
              <div className="mt-2 text-xs opacity-70">Credits: {credits}{user ? ` · Signed in as ${user.email}` : ""}</div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(subscribePlans).map(([key, plan]) => (
                <div key={key} className="rounded-3xl p-5 glass hover-float">
                  <div className={`h-28 rounded-2xl bg-gradient-to-br ${plan.color} mb-4 flex items-center justify-center text-white font-semibold text-lg`}>{plan.name}</div>
                  <div className="flex items-end gap-1 mb-3">
                    <div className="text-3xl font-bold">{key === "onetime" ? plan.price.toFixed(2) : plan.price}</div>
                    <div className="opacity-70">USD {plan.period}</div>
                  </div>
                  <ul className="space-y-1 text-sm opacity-90 mb-4 list-disc list-inside">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Button onClick={() => handleSubscribe(key)} className="w-full bg-white/10 hover:bg-white/20">{key === "onetime" ? "Buy 1 credit" : `Subscribe to ${plan.name}`}</Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "explore" && (
          <section>
            <div className="text-2xl font-semibold mb-4">Explore styles</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=1200&auto=format&fit=crop",
              ].map((src) => (
                <img key={src} src={src} alt="style" className="w-full h-56 object-cover rounded-2xl border border-white/10 hover-float" />
              ))}
            </div>
            <div className="text-xs opacity-60 mt-2">Inspiration similar to interactive showcases on modern event sites like awwwards.</div>
          </section>
        )}

        {activeTab === "account" && (
          <section className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl p-5 glass">
              <div className="text-lg font-semibold mb-2">{user ? "Your account" : "Create account"}</div>
              {!user ? (
                <AuthForms onRegister={handleRegister} onLogin={handleLogin} />
              ) : (
                <div className="space-y-3 text-sm">
                  <div><span className="opacity-70">Email:</span> {user.email}</div>
                  <div><span className="opacity-70">Plan:</span> {user.plan}</div>
                  <div><span className="opacity-70">Credits:</span> {credits}</div>
                  <div className="flex gap-2">
                    <Button onClick={handleLogout}>Sign out</Button>
                    <Button onClick={() => setActiveTab("pricing")} className="bg-white/10 hover:bg-white/20">Manage plan</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl p-5 glass">
              <div className="text-lg font-semibold mb-2">Quick buy</div>
              <div className="text-sm opacity-80 mb-3">Need just one image? Purchase a single credit for $0.10.</div>
              <Button onClick={() => handleSubscribe("onetime")} className="bg-emerald-600 text-white hover:bg-emerald-700">Buy 1 credit — $0.10</Button>
              <div className="text-xs opacity-60 mt-3">Payments are mocked for now. We will wire Stripe or your provider later.</div>
            </div>
          </section>
        )}
      </main>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-3xl p-4 sm:p-6 glass hover-float">
          <div className="text-lg font-semibold mb-3">{T.faq}</div>
          <Accordion items={T.faqItems} />
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-sm opacity-70">
        <div className="mx-auto max-w-6xl px-4">
          © {new Date().getFullYear()} AstraForge. Built as a frontend-only demo. Wire your backend at <code>/generate</code>.
        </div>
      </footer>
    </div>
  );
}
