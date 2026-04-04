import { createContext, useContext, useReducer, useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from "recharts";

const THEMES = {
  light: {
    name: "light",
    "--bg-base":         "#f8f8f6",
    "--bg-surface":      "#ffffff",
    "--bg-surface2":     "#fafaf9",
    "--bg-surface3":     "#f5f5f3",
    "--bg-elevated":     "#ffffff",
    "--border":          "#f0efed",
    "--border-strong":   "#e5e3df",
    "--text-primary":    "#111827",
    "--text-secondary":  "#6b7280",
    "--text-muted":      "#9ca3af",
    "--text-faint":      "#d1d5db",
    "--glass-bg":        "rgba(248,248,246,0.92)",
    "--glass-border":    "rgba(0,0,0,0.06)",
    "--shadow-sm":       "0 1px 3px rgba(0,0,0,0.04)",
    "--shadow-md":       "0 4px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
    "--shadow-lg":       "0 8px 32px rgba(0,0,0,0.10)",
    "--accent":          "#6366f1",
    "--accent-bg":       "#eef2ff",
    "--accent-border":   "#c7d2fe",
    "--success":         "#059669",
    "--success-bg":      "#d1fae5",
    "--danger":          "#ef4444",
    "--danger-bg":       "#fee2e2",
    "--warning":         "#d97706",
    "--warning-bg":      "#fef3c7",
    "--chart-grid":      "#f0efed",
    "--chart-text":      "#9ca3af",
    "--chart-tooltip-bg":"#ffffff",
    "--chart-tooltip-border":"#e5e3df",
    "--scrollbar":       "#e5e7eb",
    "--star-opacity":    "0",
    "--nebula-opacity":  "0",
  },
  dark: {
    name: "dark",
    "--bg-base":         "#020617",
    "--bg-surface":      "#0c1122",
    "--bg-surface2":     "#0f172a",
    "--bg-surface3":     "#1e293b",
    "--bg-elevated":     "#141b2d",
    "--border":          "#1e293b",
    "--border-strong":   "#334155",
    "--text-primary":    "#f1f5f9",
    "--text-secondary":  "#94a3b8",
    "--text-muted":      "#475569",
    "--text-faint":      "#334155",
    "--glass-bg":        "rgba(2,6,23,0.85)",
    "--glass-border":    "rgba(148,163,184,0.08)",
    "--shadow-sm":       "0 1px 3px rgba(0,0,0,0.4)",
    "--shadow-md":       "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(148,163,184,0.06)",
    "--shadow-lg":       "0 8px 40px rgba(0,0,0,0.7)",
    "--accent":          "#818cf8",
    "--accent-bg":       "#1e1b4b",
    "--accent-border":   "#3730a3",
    "--success":         "#34d399",
    "--success-bg":      "#064e3b",
    "--danger":          "#f87171",
    "--danger-bg":       "#450a0a",
    "--warning":         "#fbbf24",
    "--warning-bg":      "#451a03",
    "--chart-grid":      "#1e293b",
    "--chart-text":      "#475569",
    "--chart-tooltip-bg":"#0f172a",
    "--chart-tooltip-border":"#1e293b",
    "--scrollbar":       "#1e293b",
    "--star-opacity":    "1",
    "--nebula-opacity":  "1",
  },
};

const ThemeContext = createContext(null);
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("zorvyn_theme") === "dark" ? "dark" : "light"; } catch { return "light"; }
  });
  const isDark = theme === "dark";
  const toggle = useCallback(() => {
    setTheme(t => {
      const next = t === "light" ? "dark" : "light";
      try { localStorage.setItem("zorvyn_theme", next); } catch {}
      return next;
    });
  }, []);
  const vars = THEMES[theme];
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle, vars }}>
      <style>{`
        :root {
          ${Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join("\n          ")}
        }
        * { box-sizing: border-box; margin: 0; padding: 0; transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease; }
        body { background: var(--bg-base); }
        @keyframes fadeUp    { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes twinkle   { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes drift     { 0%{transform:translateY(0)} 50%{transform:translateY(-8px)} 100%{transform:translateY(0)} }
        @keyframes toastIn   { from{opacity:0;transform:translateY(12px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes toastOut  { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(-8px) scale(.96)} }
        @keyframes progressBar { from{width:100%} to{width:0%} }
        @keyframes shimmerMove { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(129,140,248,0)} 50%{box-shadow:0 0 20px 4px rgba(129,140,248,0.25)} }
        .summary-grid { grid-template-columns: repeat(3,1fr) !important; }
        .intel-grid   { grid-template-columns: 1fr 1fr 340px !important; }
        .charts-grid  { grid-template-columns: 1fr 1fr !important; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 0.4; }
        select { -webkit-appearance: none; appearance: none; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 2px; }
        @media(max-width:1100px) { .intel-grid { grid-template-columns: 1fr 1fr !important; } }
        @media(max-width:960px)  { .summary-grid { grid-template-columns: 1fr 1fr !important; } .charts-grid { grid-template-columns: 1fr !important; } .intel-grid { grid-template-columns: 1fr !important; } }
        @media(max-width:720px)  { aside { display: none !important; } .summary-grid { grid-template-columns: 1fr !important; } }
        .export-btn-shimmer { position: relative; overflow: hidden; }
        .export-btn-shimmer::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); transform:translateX(-100%); }
        .export-btn-shimmer:hover::after { animation: shimmerMove 0.6s ease; }
      `}</style>
      {children}
    </ThemeContext.Provider>
  );
}
function useTheme() { return useContext(ThemeContext); }

const ToastContext = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type, duration, dying: false }]);
    setTimeout(() => {
      setToasts(t => t.map(x => x.id === id ? { ...x, dying: true } : x));
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 380);
    }, duration);
  }, []);
  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        {toasts.map(t => <Toast key={t.id} toast={t} />)}
      </div>
    </ToastContext.Provider>
  );
}
function useToast() { return useContext(ToastContext); }

function Toast({ toast }) {
  const configs = {
    success: { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>, color: "#34d399", bg: "#064e3b", border: "#065f46", label: "Success" },
    error:   { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, color: "#f87171", bg: "#450a0a", border: "#7f1d1d", label: "Error" },
    info:    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>, color: "#818cf8", bg: "#1e1b4b", border: "#3730a3", label: "Info" },
  };
  const c = configs[toast.type] || configs.success;
  return (
    <div style={{
      pointerEvents: "auto",
      display: "flex", flexDirection: "column",
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 14, overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
      animation: toast.dying ? "toastOut 0.35s ease forwards" : "toastIn 0.35s cubic-bezier(0.34,1.3,0.64,1) both",
      minWidth: 260, maxWidth: 340,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "13px 14px 11px" }}>
        <div style={{ width: 24, height: 24, borderRadius: 8, background: c.color + "22", border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: c.color, flexShrink: 0 }}>
          {c.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: c.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{c.label}</div>
          <div style={{ fontSize: 12.5, color: "#e2e8f0", fontWeight: 400, lineHeight: 1.4 }}>{toast.msg}</div>
        </div>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: c.color, animation: `progressBar ${toast.duration}ms linear forwards` }} />
      </div>
    </div>
  );
}

const JEWEL = { sapphire: "#1B4FD8", amethyst: "#7C3AED", emerald: "#047857", ruby: "#B91C1C", topaz: "#B45309", teal: "#0F766E", indigo: "#3730A3" };
const JEWEL_ARRAY = Object.values(JEWEL);

const INITIAL_TRANSACTIONS = [
  { id: 1,  name: "Stripe Inc.",       category: "Revenue",        date: "2026-04-02", amount: 84500, type: "income",  avatar: "S", avatarBg: "#EEF2FF", avatarColor: JEWEL.sapphire },
  { id: 2,  name: "AWS Services",      category: "Infrastructure", date: "2026-04-01", amount: 12340, type: "expense", avatar: "A", avatarBg: "#FFF7ED", avatarColor: JEWEL.topaz    },
  { id: 3,  name: "Razorpay Payout",   category: "Revenue",        date: "2026-03-31", amount: 31200, type: "income",  avatar: "R", avatarBg: "#F5F3FF", avatarColor: JEWEL.amethyst },
  { id: 4,  name: "Google Workspace",  category: "Software",       date: "2026-03-30", amount: 4800,  type: "expense", avatar: "G", avatarBg: "#ECFDF5", avatarColor: JEWEL.emerald  },
  { id: 5,  name: "Freelance Project", category: "Revenue",        date: "2026-03-29", amount: 22000, type: "income",  avatar: "F", avatarBg: "#FDF4FF", avatarColor: "#9333EA"      },
  { id: 6,  name: "Notion Pro",        category: "Software",       date: "2026-03-28", amount: 1600,  type: "expense", avatar: "N", avatarBg: "#F8FAFC", avatarColor: "#475569"      },
  { id: 7,  name: "Client Retainer",   category: "Revenue",        date: "2026-03-27", amount: 45000, type: "income",  avatar: "C", avatarBg: "#FEF3C7", avatarColor: JEWEL.topaz    },
  { id: 8,  name: "Figma Teams",       category: "Software",       date: "2026-03-26", amount: 3200,  type: "expense", avatar: "F", avatarBg: "#FFF1F2", avatarColor: JEWEL.ruby     },
  { id: 9,  name: "Office Rent",       category: "Operations",     date: "2026-03-25", amount: 28000, type: "expense", avatar: "O", avatarBg: "#F0FDFA", avatarColor: JEWEL.teal     },
  { id: 10, name: "Marketing Ads",     category: "Marketing",      date: "2026-03-24", amount: 9500,  type: "expense", avatar: "M", avatarBg: "#EEF2FF", avatarColor: JEWEL.indigo   },
  { id: 11, name: "Salary Payout",     category: "Salary",         date: "2026-03-23", amount: 52000, type: "expense", avatar: "S", avatarBg: "#F1F5F9", avatarColor: "#334155"      },
  { id: 12, name: "Consulting Fee",    category: "Revenue",        date: "2026-03-22", amount: 18500, type: "income",  avatar: "C", avatarBg: "#EEF2FF", avatarColor: JEWEL.sapphire },
];

const BALANCE_30D = (() => {
  const base = 320000;
  const seed = [0,4200,-1800,7600,2100,-3400,5500,-900,8200,1400,-2700,6300,3800,-1200,9100,2500,-4100,7800,1900,-3200,5400,4600,-800,8900,2200,-1600,6700,3100,-900,5800];
  let running = base;
  return seed.map((delta, i) => {
    running += delta;
    const d = new Date("2026-03-05"); d.setDate(d.getDate() + i);
    return { date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), balance: running, delta };
  });
})();

const CATEGORIES_LIST = ["Revenue", "Infrastructure", "Software", "Operations", "Marketing", "Salary", "Other"];
const AVATAR_PALETTE = [
  { bg: "#EEF2FF", color: JEWEL.sapphire }, { bg: "#FFF7ED", color: JEWEL.topaz },
  { bg: "#F5F3FF", color: JEWEL.amethyst }, { bg: "#ECFDF5", color: JEWEL.emerald },
  { bg: "#FDF4FF", color: "#9333EA" },       { bg: "#FEF3C7", color: JEWEL.topaz },
  { bg: "#FFF1F2", color: JEWEL.ruby },
];

const LS_KEYS = { transactions: "zorvyn_txv3", role: "zorvyn_rolev3", filters: "zorvyn_filtersv3" };
function loadLS(key, fallback) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; } }
function saveLS(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

const INITIAL_FILTERS = { search: "", category: "All", type: "All" };
const DashboardContext = createContext(null);

function dashboardReducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":           return { ...state, currentRole: action.payload };
    case "SET_FILTER":         return { ...state, filters: { ...state.filters, [action.key]: action.value } };
    case "RESET_FILTERS":      return { ...state, filters: INITIAL_FILTERS };
    case "ADD_TRANSACTION":    return { ...state, transactions: [action.payload, ...state.transactions] };
    case "DELETE_TRANSACTION": return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    default:                   return state;
  }
}

function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, {
    transactions: loadLS(LS_KEYS.transactions, INITIAL_TRANSACTIONS),
    currentRole:  loadLS(LS_KEYS.role, "Admin"),
    filters:      loadLS(LS_KEYS.filters, INITIAL_FILTERS),
  });
  useEffect(() => { saveLS(LS_KEYS.transactions, state.transactions); }, [state.transactions]);
  useEffect(() => { saveLS(LS_KEYS.role, state.currentRole); }, [state.currentRole]);
  useEffect(() => { saveLS(LS_KEYS.filters, state.filters); }, [state.filters]);
  const filteredTransactions = state.transactions.filter(tx => {
    const sm = tx.name.toLowerCase().includes(state.filters.search.toLowerCase()) || tx.category.toLowerCase().includes(state.filters.search.toLowerCase());
    const cm = state.filters.category === "All" || tx.category === state.filters.category;
    const tm = state.filters.type === "All" || tx.type === state.filters.type;
    return sm && cm && tm;
  });
  return <DashboardContext.Provider value={{ state, dispatch, filteredTransactions }}>{children}</DashboardContext.Provider>;
}
function useDashboard() { return useContext(DashboardContext); }

const fmt = n => "₹" + Number(n).toLocaleString("en-IN");
const fmtDate = d => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const NAV_ITEMS = [
  { id: "overview",     label: "Overview",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id: "intelligence", label: "Intelligence", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M12 2a8 8 0 0 1 8 8c0 3-1.5 5.5-4 7v2H8v-2c-2.5-1.5-4-4-4-7a8 8 0 0 1 8-8z"/><line x1="9" y1="21" x2="15" y2="21"/></svg>, badge: "NEW" },
  { id: "transactions", label: "Transactions", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>, count: true },
  { id: "analytics",   label: "Analytics",    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id: "settings",    label: "Settings",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

function DeepSpaceBackground() {
  const { isDark } = useTheme();
  if (!isDark) return null;
  const stars = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    x: Math.sin(i * 137.5) * 50 + 50,
    y: Math.cos(i * 97.3) * 50 + 50,
    r: [0.5, 0.8, 1.2, 0.6, 1][i % 5],
    delay: (i * 0.19).toFixed(2),
    dur: (2.5 + (i % 4) * 0.7).toFixed(1),
  })), []);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: "var(--star-opacity)", transition: "opacity 0.6s ease" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="nebula1" cx="20%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#1B4FD8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#1B4FD8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula2" cx="80%" cy="70%" r="35%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula3" cx="60%" cy="20%" r="25%">
            <stop offset="0%" stopColor="#0F766E" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#0F766E" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#nebula1)" />
        <rect width="100%" height="100%" fill="url(#nebula2)" />
        <rect width="100%" height="100%" fill="url(#nebula3)" />
        {stars.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
            style={{ animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
        ))}
      </svg>
    </div>
  );
}

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to Light mode" : "Switch to Deep Space mode"}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 12px 6px 8px", borderRadius: 24,
        border: `1px solid var(--border-strong)`,
        background: isDark ? "rgba(30,41,59,0.8)" : "var(--bg-surface)",
        cursor: "pointer", fontFamily: "inherit",
        backdropFilter: isDark ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
        animation: isDark ? "pulseGlow 3s ease-in-out infinite" : "none",
      }}
    >
      <div style={{ width: 44, height: 22, borderRadius: 11, position: "relative", background: isDark ? "linear-gradient(135deg, #1e1b4b, #312e81)" : "#e2e8f0", transition: "background 0.3s ease", border: `1px solid ${isDark ? "#3730a3" : "#d1d5db"}` }}>
        <div style={{ position: "absolute", top: 2, left: isDark ? 22 : 2, width: 16, height: 16, borderRadius: "50%", background: isDark ? "linear-gradient(135deg, #f1f5f9, #818cf8)" : "#fff", transition: "left 0.28s cubic-bezier(0.34,1.4,0.64,1)", boxShadow: isDark ? "0 0 8px rgba(129,140,248,0.8)" : "0 1px 3px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>
          {isDark ? "✦" : ""}
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: isDark ? "#94a3b8" : "#64748b", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
        {isDark ? "Deep Space" : "Light"}
      </span>
    </button>
  );
}

function ExportButton() {
  const { filteredTransactions, state } = useDashboard();
  const { add } = useToast();
  const { isDark } = useTheme();
  const isAdmin = state.currentRole === "Admin";
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(() => {
    if (!isAdmin || isExporting) return;
    setIsExporting(true);
    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: "Sahil Gupta",
      role: state.currentRole,
      filters: state.filters,
      count: filteredTransactions.length,
      transactions: filteredTransactions.map(tx => ({
        id: tx.id, name: tx.name, category: tx.category,
        date: tx.date, amount: tx.amount, type: tx.type,
      })),
    };
    console.group("%c📤 Zorvyn Export", "color:#818cf8;font-weight:700;font-size:14px");
    console.log("%cExport payload:", "color:#34d399;font-weight:600", payload);
    console.log("%cTransaction count:", "color:#94a3b8", payload.count);
    console.log("%cFilters applied:", "color:#94a3b8", payload.filters);
    console.groupEnd();
    add(`${filteredTransactions.length} transactions exported to console`, "success");
    setTimeout(() => setIsExporting(false), 1000);
  }, [isAdmin, isExporting, filteredTransactions, state, add]);

  if (!isAdmin) return null;

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="export-btn-shimmer"
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 10,
        border: `1px solid ${isDark ? "#3730a3" : "var(--accent-border)"}`,
        background: isDark ? "linear-gradient(135deg, rgba(67,56,202,0.3), rgba(99,102,241,0.2))" : "linear-gradient(135deg, #eef2ff, #e0e7ff)",
        color: "var(--accent)", fontSize: 12.5, fontWeight: 600,
        cursor: isExporting ? "wait" : "pointer",
        fontFamily: "inherit",
        opacity: isExporting ? 0.7 : 1,
        transition: "all 0.2s ease",
        backdropFilter: isDark ? "blur(8px)" : "none",
      }}
    >
      {isExporting ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      )}
      {isExporting ? "Exporting…" : "Export JSON"}
    </button>
  );
}

function Sparkline({ data, color }) {
  const w = 120, h = 40;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`).join(" ");
  const uid = color.replace(/[^a-z0-9]/gi, "x");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill={`url(#${uid})`} />
      <polyline points={points} stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function SummaryCards() {
  const { state } = useDashboard();
  const { isDark } = useTheme();
  const totalIncome = state.transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = state.transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const cards = [
    { title: "Total Balance", value: fmt(balance), change: "12.4%", positive: true, lightGrad: "linear-gradient(145deg,#fff 0%,#f5f3ff 100%)", darkGrad: "linear-gradient(145deg,#0c1122 0%,#1e1b4b 100%)", accent: "#6366f1", lightShadow: "rgba(99,102,241,0.1)", darkShadow: "rgba(99,102,241,0.2)", spark: [60,75,65,85,78,92,88,100,95,108,102,118], delay: "0ms" },
    { title: "Total Income",  value: fmt(totalIncome),  change: "8.2%",  positive: true,  lightGrad: "linear-gradient(145deg,#fff 0%,#f0fdf4 100%)", darkGrad: "linear-gradient(145deg,#0c1122 0%,#052e16 100%)", accent: "#10b981", lightShadow: "rgba(16,185,129,0.1)", darkShadow: "rgba(16,185,129,0.2)", spark: [40,55,45,70,60,80,75,90,85,100,92,110], delay: "70ms" },
    { title: "Total Expenses", value: fmt(totalExpense), change: "3.1%", positive: false, lightGrad: "linear-gradient(145deg,#fff 0%,#fff7f5 100%)", darkGrad: "linear-gradient(145deg,#0c1122 0%,#2d1200 100%)", accent: "#f97316", lightShadow: "rgba(249,115,22,0.1)", darkShadow: "rgba(249,115,22,0.2)", spark: [30,35,28,45,40,38,50,42,55,48,52,44], delay: "140ms" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }} className="summary-grid">
      {cards.map((c, i) => (
        <div key={i} style={{ background: isDark ? c.darkGrad : c.lightGrad, borderRadius: 18, padding: "20px 20px 16px", border: `1px solid ${isDark ? "rgba(148,163,184,0.07)" : "transparent"}`, boxShadow: `var(--shadow-sm), 0 4px 20px ${isDark ? c.darkShadow : c.lightShadow}`, animation: "fadeUp .45s ease both", animationDelay: c.delay, position: "relative", overflow: "hidden", backdropFilter: isDark ? "blur(12px)" : "none" }}>
          <div style={{ position: "absolute", inset: 0, background: isDark ? `radial-gradient(ellipse at top left, ${c.accent}11, transparent 60%)` : "none", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: c.accent }}>{c.title}</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: c.positive ? (isDark ? "rgba(16,185,129,.15)" : "rgba(16,185,129,.1)") : (isDark ? "rgba(249,115,22,.15)" : "rgba(249,115,22,.1)"), color: c.positive ? "#10b981" : "#f97316" }}>{c.positive ? "↑" : "↓"} {c.change}</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.035em", color: "var(--text-primary)", lineHeight: 1 }}>{c.value}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>vs last month</div>
          <div style={{ position: "absolute", bottom: 10, right: 12, opacity: isDark ? .6 : .45 }}><Sparkline data={c.spark} color={c.accent} /></div>
        </div>
      ))}
    </div>
  );
}

function CashFlowChart() {
  const { isDark } = useTheme();
  const bars = [{ label: "Jan", income: 65, expense: 42 },{ label: "Feb", income: 72, expense: 55 },{ label: "Mar", income: 58, expense: 38 },{ label: "Apr", income: 88, expense: 61 },{ label: "May", income: 76, expense: 48 },{ label: "Jun", income: 94, expense: 52 }];
  return (
    <div style={{ background: "var(--bg-surface)", borderRadius: 18, padding: "20px 20px 16px", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)", animation: "fadeUp .45s ease both", animationDelay: "210ms", backdropFilter: isDark ? "blur(12px)" : "none" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-.02em" }}>Cash Flow</div><div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Income vs Expenses</div></div>
        <div style={{ display: "flex", gap: 10 }}>{[["#6366f1","Income"],["var(--border-strong)","Expense"]].map(([c,l]) => <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: c }} /><span style={{ fontSize: 10.5, color: "var(--text-muted)", fontWeight: 500 }}>{l}</span></div>)}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", display: "flex", alignItems: "flex-end", gap: 2, height: 76 }}>
              <div style={{ flex: 1, height: `${b.income}%`, background: isDark ? "linear-gradient(180deg,#818cf8,#6366f1)" : "linear-gradient(180deg,#6366f1,#818cf8)", borderRadius: "3px 3px 0 0", opacity: .85 }} />
              <div style={{ flex: 1, height: `${b.expense}%`, background: isDark ? "linear-gradient(180deg,#334155,#1e293b)" : "linear-gradient(180deg,#e2e8f0,#cbd5e1)", borderRadius: "3px 3px 0 0" }} />
            </div>
            <span style={{ fontSize: 9.5, color: "var(--text-muted)", fontWeight: 500 }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChartSimple() {
  const { isDark } = useTheme();
  const segs = [{ label: "Revenue", value: 58, color: "#6366f1" },{ label: "Operations", value: 22, color: isDark ? "#334155" : "#e2e8f0" },{ label: "Software", value: 12, color: "#a5b4fc" },{ label: "Other", value: 8, color: isDark ? "#1e3a5f" : "#ddd6fe" }];
  const R = 36, cx = 48, cy = 48, circ = 2 * Math.PI * R;
  let off = 0;
  return (
    <div style={{ background: "var(--bg-surface)", borderRadius: 18, padding: "20px", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)", animation: "fadeUp .45s ease both", animationDelay: "280ms", backdropFilter: isDark ? "blur(12px)" : "none" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-.02em", marginBottom: 2 }}>Breakdown</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>Category distribution</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg width="96" height="96" viewBox="0 0 96 96">
          {segs.map((s, i) => { const dash = (s.value / 100) * circ, gap = circ - dash; const el = <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth="13" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-off} style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />; off += dash; return el; })}
          <text x="48" y="44" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: "var(--text-primary)", fontFamily: "Inter" }}>58%</text>
          <text x="48" y="58" textAnchor="middle" style={{ fontSize: 8.5, fill: "var(--text-muted)", fontFamily: "Inter" }}>Revenue</text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {segs.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} /><span style={{ fontSize: 11.5, color: "var(--text-secondary)", fontWeight: 500 }}>{s.label}</span><span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-primary)", marginLeft: "auto", paddingLeft: 8 }}>{s.value}%</span></div>)}
        </div>
      </div>
    </div>
  );
}

function CustomAreaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value, delta = payload[0]?.payload?.delta;
  return (
    <div style={{ background: "var(--chart-tooltip-bg)", border: `1px solid var(--chart-tooltip-border)`, borderRadius: 12, padding: "10px 14px", boxShadow: "var(--shadow-lg)" }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{fmt(val)}</p>
      {delta !== undefined && <p style={{ fontSize: 11, fontWeight: 500, color: delta >= 0 ? "#34D399" : "#F87171", marginTop: 3 }}>{delta >= 0 ? "▲" : "▼"} {fmt(Math.abs(delta))} today</p>}
    </div>
  );
}

function ActiveDonutShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} style={{ filter: `drop-shadow(0 0 8px ${fill}88)`, transition: "all 0.3s ease" }} />
      <text x={cx} y={cy - 10} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: "var(--text-primary)", fontFamily: "Inter" }}>{(percent * 100).toFixed(0)}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter" }}>{payload.name}</text>
    </g>
  );
}

function FinancialIntelligence() {
  const { state } = useDashboard();
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (sectionRef.current) obs.observe(sectionRef.current); return () => obs.disconnect(); }, []);
  const { transactions } = state;
  const income = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const expenses = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const savingsRate = income > 0 ? ((income - expenses) / income * 100) : 0;
  const spendByCategory = useMemo(() => { const map = {}; transactions.filter(t => t.type === "expense").forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; }); return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })); }, [transactions]);
  const topCategory = spendByCategory[0];
  const maxSpend = spendByCategory[0]?.value || 1;
  const avgDailyBalance = BALANCE_30D.reduce((s, d) => s + d.balance, 0) / BALANCE_30D.length;
  const balanceGrowth = ((BALANCE_30D[BALANCE_30D.length - 1].balance - BALANCE_30D[0].balance) / BALANCE_30D[0].balance * 100);
  const [activeDonut, setActiveDonut] = useState(0);
  const panelBase = { background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 20, padding: "20px 22px", backdropFilter: isDark ? "blur(16px)" : "none" };
  const panelStyle = (delay) => ({ ...panelBase, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms` });

  return (
    <section ref={sectionRef}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 3, height: 24, background: "linear-gradient(180deg,#1B4FD8,#7C3AED)", borderRadius: 2 }} />
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.025em" }}>Financial Intelligence</h2>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: JEWEL.teal, background: JEWEL.teal + "22", border: `1px solid ${JEWEL.teal}44`, padding: "2px 8px", borderRadius: 20 }}>LIVE</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 340px", gap: 16 }} className="intel-grid">
        <div style={panelStyle(0)}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
              <div><p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Balance Trend</p><p style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.04em", marginTop: 4 }}>{fmt(BALANCE_30D[BALANCE_30D.length - 1].balance)}</p></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: balanceGrowth >= 0 ? (isDark ? "#064E3B" : "#D1FAE5") : (isDark ? "#450A0A" : "#FEE2E2"), color: balanceGrowth >= 0 ? "#34D399" : "#F87171", display: "inline-block" }}>{balanceGrowth >= 0 ? "▲" : "▼"} {Math.abs(balanceGrowth).toFixed(1)}% / 30d</div><p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Avg {fmt(Math.round(avgDailyBalance))}/day</p></div>
            </div>
          </div>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={BALANCE_30D} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={JEWEL.sapphire} stopOpacity={isDark ? 0.4 : 0.3}/><stop offset="55%" stopColor={JEWEL.amethyst} stopOpacity={isDark ? 0.15 : 0.1}/><stop offset="100%" stopColor={JEWEL.amethyst} stopOpacity={0}/></linearGradient>
                  <linearGradient id="lGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={JEWEL.sapphire}/><stop offset="50%" stopColor={JEWEL.amethyst}/><stop offset="100%" stopColor={JEWEL.teal}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--chart-text)", fontSize: 10, fontFamily: "Inter" }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tickFormatter={v => "₹" + (v / 1000).toFixed(0) + "k"} tick={{ fill: "var(--chart-text)", fontSize: 10, fontFamily: "Inter" }} tickLine={false} axisLine={false} width={52} />
                <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: "var(--border-strong)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotoneX" dataKey="balance" stroke="url(#lGrad)" strokeWidth={2.5} fill="url(#bGrad)" dot={false} activeDot={{ r: 5, fill: JEWEL.sapphire, stroke: "var(--bg-surface)", strokeWidth: 2 }} isAnimationActive={visible} animationDuration={1800} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {[["Sapphire", JEWEL.sapphire],["Amethyst", JEWEL.amethyst],["Teal", JEWEL.teal]].map(([l, c]) => <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 3, borderRadius: 2, background: c }} /><span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{l}</span></div>)}
          </div>
        </div>

        <div style={panelStyle(120)}>
          <div style={{ marginBottom: 8 }}><p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Spending Breakdown</p><p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginTop: 3 }}>by category · jewel tones</p></div>
          {spendByCategory.length > 0 ? (
            <>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <PieChart><Pie data={spendByCategory} cx="50%" cy="50%" innerRadius={62} outerRadius={88} dataKey="value" paddingAngle={3} activeIndex={activeDonut} activeShape={<ActiveDonutShape />} onMouseEnter={(_, idx) => setActiveDonut(idx)} isAnimationActive={visible} animationBegin={300} animationDuration={1400} animationEasing="ease-out">
                    {spendByCategory.map((_, i) => <Cell key={i} fill={JEWEL_ARRAY[i % JEWEL_ARRAY.length]} style={{ cursor: "pointer", filter: activeDonut === i ? "none" : "brightness(0.7)", transition: "filter 0.25s" }} />)}
                  </Pie></PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                {spendByCategory.slice(0, 6).map((d, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: JEWEL_ARRAY[i % JEWEL_ARRAY.length], flexShrink: 0, boxShadow: isDark ? `0 0 4px ${JEWEL_ARRAY[i % JEWEL_ARRAY.length]}88` : "none" }} /><span style={{ fontSize: 10.5, color: "var(--text-secondary)", fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span><span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)" }}>{((d.value / expenses) * 100).toFixed(0)}%</span></div>)}
              </div>
            </>
          ) : <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>No expense data</div>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease 240ms, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) 240ms" }}>
          <div style={{ ...panelBase }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Key Insights</p>
            {[
              { label: "Highest Spend", val: topCategory ? topCategory.name : "—", sub: topCategory ? `${fmt(topCategory.value)} · ${((topCategory.value / expenses) * 100).toFixed(0)}% of total` : "No data", color: JEWEL.ruby, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
              { label: "Monthly Savings", val: savingsRate.toFixed(1) + "%", sub: `${fmt(income - expenses)} net saved`, color: JEWEL.emerald, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg> },
              { label: "Avg Daily Balance", val: fmt(Math.round(avgDailyBalance)), sub: "30-day rolling average", color: JEWEL.amethyst, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
            ].map((ins, i) => (
              <div key={i} style={{ background: "var(--bg-surface2)", border: `1px solid var(--border)`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, position: "relative", overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: `all 0.5s cubic-bezier(0.34,1.2,0.64,1) ${(i + 1) * 120}ms` }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${ins.color}, transparent)`, borderRadius: "14px 14px 0 0" }} />
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: ins.color + "22", border: `1px solid ${ins.color}33`, display: "flex", alignItems: "center", justifyContent: "center", color: ins.color, flexShrink: 0 }}>{ins.icon}</div>
                  <div><p style={{ fontSize: 9.5, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{ins.label}</p><p style={{ fontSize: 18, fontWeight: 700, color: ins.color, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 3 }}>{ins.val}</p><p style={{ fontSize: 10.5, color: "var(--text-muted)", fontWeight: 500 }}>{ins.sub}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...panelBase, flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Spend by Category</p>
            {spendByCategory.slice(0, 5).map((d, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontSize: 11.5, color: "var(--text-secondary)", fontWeight: 500 }}>{d.name}</span><span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-primary)" }}>{fmt(d.value)}</span></div>
                <div style={{ height: 5, background: "var(--bg-surface3)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: visible ? (d.value / maxSpend * 100) + "%" : "0%", background: `linear-gradient(90deg, ${JEWEL_ARRAY[i % JEWEL_ARRAY.length]}, ${JEWEL_ARRAY[i % JEWEL_ARRAY.length]}88)`, borderRadius: 3, transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${i * 80 + 200}ms`, boxShadow: isDark ? `0 0 8px ${JEWEL_ARRAY[i % JEWEL_ARRAY.length]}44` : "none" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AddTransactionModal({ onClose }) {
  const { dispatch, state } = useDashboard();
  const { isDark } = useTheme();
  const [form, setForm] = useState({ name: "", amount: "", category: "Revenue", type: "income", date: new Date().toISOString().split("T")[0] });
  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);
  const validate = () => { const e = {}; if (!form.name.trim()) e.name = "Name is required"; if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Enter a valid amount"; if (!form.date) e.date = "Date is required"; return e; };
  const handleSubmit = () => { const e = validate(); if (Object.keys(e).length > 0) { setErrors(e); return; } const palette = AVATAR_PALETTE[state.transactions.length % AVATAR_PALETTE.length]; dispatch({ type: "ADD_TRANSACTION", payload: { id: Date.now(), name: form.name.trim(), amount: Number(form.amount), category: form.category, type: form.type, date: form.date, avatar: form.name.trim()[0].toUpperCase(), avatarBg: palette.bg, avatarColor: palette.color } }); onClose(); };
  const iS = (key) => ({ width: "100%", padding: "9px 12px", borderRadius: 10, border: `1px solid ${errors[key] ? "#fca5a5" : "var(--border-strong)"}`, fontSize: 13, fontFamily: "Inter,sans-serif", color: "var(--text-primary)", outline: "none", background: errors[key] ? (isDark ? "#450a0a33" : "#fff5f5") : "var(--bg-surface2)", transition: "border .15s" });
  const lS = { display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 5 };
  return (
    <div ref={overlayRef} onClick={e => e.target === overlayRef.current && onClose()} style={{ position: "fixed", inset: 0, background: isDark ? "rgba(2,6,23,.7)" : "rgba(0,0,0,.28)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)", animation: "fadeIn .2s ease" }}>
      <div style={{ background: "var(--bg-elevated)", borderRadius: 22, padding: 28, width: "100%", maxWidth: 420, boxShadow: "var(--shadow-lg), 0 0 0 1px var(--glass-border)", border: "1px solid var(--border)", animation: "slideUp .25s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div><div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-.025em" }}>Add Transaction</div><div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>Fill in the details below</div></div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-surface2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div style={{ marginBottom: 14 }}><label style={lS}>Merchant Name</label><input type="text" value={form.name} placeholder="e.g. Stripe Inc." onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: "" })); }} style={iS("name")} />{errors.name && <div style={{ fontSize: 11, color: "var(--danger)", marginTop: 3 }}>{errors.name}</div>}</div>
        <div style={{ marginBottom: 14 }}><label style={lS}>Amount (₹)</label><input type="number" value={form.amount} placeholder="0" min="0" onChange={e => { setForm(p => ({ ...p, amount: e.target.value })); setErrors(p => ({ ...p, amount: "" })); }} style={iS("amount")} />{errors.amount && <div style={{ fontSize: 11, color: "var(--danger)", marginTop: 3 }}>{errors.amount}</div>}</div>
        <div style={{ marginBottom: 14 }}><label style={lS}>Category</label><select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...iS("category"), cursor: "pointer" }}>{CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div style={{ marginBottom: 14 }}><label style={lS}>Type</label><div style={{ display: "flex", gap: 8 }}>{["income","expense"].map(t => <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))} style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1.5px solid ${form.type === t ? (t === "income" ? "#10b981" : "#f97316") : "var(--border-strong)"}`, background: form.type === t ? (t === "income" ? (isDark ? "#064e3b" : "#f0fdf4") : (isDark ? "#431407" : "#fff7f5")) : "var(--bg-surface2)", color: form.type === t ? (t === "income" ? "#10b981" : "#f97316") : "var(--text-secondary)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif", textTransform: "capitalize", transition: "all .15s" }}>{t === "income" ? "↑" : "↓"} {t}</button>)}</div></div>
        <div style={{ marginBottom: 14 }}><label style={lS}>Date</label><input type="date" value={form.date} onChange={e => { setForm(p => ({ ...p, date: e.target.value })); setErrors(p => ({ ...p, date: "" })); }} style={iS("date")} />{errors.date && <div style={{ fontSize: 11, color: "var(--danger)", marginTop: 3 }}>{errors.date}</div>}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 11, border: "1px solid var(--border)", background: "var(--bg-surface2)", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 2, padding: "10px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#6366f1,#818cf8)", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "Inter,sans-serif", boxShadow: "0 4px 12px rgba(99,102,241,.4)" }}>Add Transaction</button>
        </div>
      </div>
    </div>
  );
}

function VibeToggle() {
  const { state, dispatch } = useDashboard();
  const { isDark } = useTheme();
  const isAdmin = state.currentRole === "Admin";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 8px", borderRadius: 24, border: "1px solid var(--border-strong)", background: "var(--bg-surface)" }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--text-muted)", letterSpacing: ".08em", textTransform: "uppercase" }}>Vibe</div>
      <button onClick={() => dispatch({ type: "SET_ROLE", payload: isAdmin ? "Viewer" : "Admin" })} style={{ width: 44, height: 24, borderRadius: 12, position: "relative", background: isAdmin ? "linear-gradient(135deg,#6366f1,#818cf8)" : (isDark ? "#1e293b" : "#e5e7eb"), border: "none", cursor: "pointer", transition: "background .3s", boxShadow: isAdmin ? "0 2px 8px rgba(99,102,241,.4)" : "none", flexShrink: 0 }} aria-label="Toggle role">
        <div style={{ position: "absolute", top: 3, left: isAdmin ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .25s cubic-bezier(.4,0,.2,1)", boxShadow: "0 1px 4px rgba(0,0,0,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, lineHeight: 1 }}>{isAdmin ? "🔑" : "👁"}</div>
      </button>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: isAdmin ? "var(--accent)" : "var(--text-muted)", transition: "color .2s", minWidth: 38 }}>{state.currentRole}</div>
    </div>
  );
}

function AddTransactionButton({ onClick }) {
  const { state } = useDashboard();
  const isViewer = state.currentRole === "Viewer";
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef(null);
  const handleMouseEnter = useCallback(() => { if (isViewer) { clearTimeout(timerRef.current); setShowTooltip(true); } }, [isViewer]);
  const handleMouseLeave = useCallback(() => { timerRef.current = setTimeout(() => setShowTooltip(false), 150); }, []);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  useEffect(() => { if (!isViewer) setShowTooltip(false); }, [isViewer]);
  return (
    <div style={{ position: "relative", display: "inline-flex" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button onClick={isViewer ? undefined : onClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: isViewer ? "var(--bg-surface3)" : "linear-gradient(135deg,#6366f1,#818cf8)", color: isViewer ? "var(--text-muted)" : "#fff", fontSize: 12.5, fontWeight: 600, fontFamily: "Inter,sans-serif", cursor: isViewer ? "not-allowed" : "pointer", boxShadow: isViewer ? "none" : "0 4px 12px rgba(99,102,241,.35)", transition: "all .2s", opacity: isViewer ? .6 : 1 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Transaction
      </button>
      {isViewer && showTooltip && <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", background: "#111827", color: "#fff", fontSize: 11.5, fontWeight: 500, padding: "7px 12px", borderRadius: 9, whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(0,0,0,.4)", zIndex: 300, animation: "fadeIn .15s ease", pointerEvents: "none" }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Admin Access Only</div><div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #111827" }} /></div>}
    </div>
  );
}

function FilterBar() {
  const { state, dispatch } = useDashboard();
  const { filters } = state;
  const hasActive = filters.search || filters.category !== "All" || filters.type !== "All";
  const inputBase = { border: "none", outline: "none", background: "transparent", fontSize: 12.5, color: "var(--text-primary)", fontFamily: "Inter,sans-serif" };
  const selectBase = { padding: "7px 12px", borderRadius: 10, border: "1px solid var(--border-strong)", background: "var(--bg-surface2)", fontSize: 12.5, fontFamily: "Inter,sans-serif", color: "var(--text-primary)", cursor: "pointer", outline: "none", appearance: "none" };
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--bg-surface2)", border: "1px solid var(--border-strong)", borderRadius: 10, padding: "7px 12px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.75"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input value={filters.search} onChange={e => dispatch({ type: "SET_FILTER", key: "search", value: e.target.value })} placeholder="Search…" style={{ ...inputBase, width: 130 }} />
      </div>
      <select value={filters.category} onChange={e => dispatch({ type: "SET_FILTER", key: "category", value: e.target.value })} style={selectBase}><option value="All">All Categories</option>{CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}</select>
      <select value={filters.type} onChange={e => dispatch({ type: "SET_FILTER", key: "type", value: e.target.value })} style={selectBase}><option value="All">All Types</option><option value="income">Income</option><option value="expense">Expense</option></select>
      {hasActive && <button onClick={() => dispatch({ type: "RESET_FILTERS" })} style={{ padding: "7px 11px", borderRadius: 10, border: "1px solid var(--danger-bg)", background: "var(--danger-bg)", fontSize: 11.5, fontWeight: 600, color: "var(--danger)", cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 4 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Clear</button>}
    </div>
  );
}

function TransactionsTable({ onAdd }) {
  const { filteredTransactions, state, dispatch } = useDashboard();
  const { isDark } = useTheme();
  const isAdmin = state.currentRole === "Admin";
  const rowHover = (e, enter) => { e.currentTarget.style.background = enter ? (isDark ? "var(--bg-surface2)" : "#fafaf9") : ""; };
  return (
    <div style={{ background: "var(--bg-surface)", borderRadius: 20, boxShadow: "var(--shadow-md)", border: "1px solid var(--border)", overflow: "hidden", animation: "fadeUp .45s ease both", animationDelay: "350ms", backdropFilter: isDark ? "blur(12px)" : "none" }}>
      <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div><div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-.02em" }}>Recent Transactions</div><div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{filteredTransactions.length} of {state.transactions.length} records</div></div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <ExportButton />
            <AddTransactionButton onClick={onAdd} />
          </div>
        </div>
        <FilterBar />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>{["Merchant","Category","Date","Type","Amount",...(isAdmin?[""]:[])] .map((h, i) => <th key={i} style={{ padding: "10px 20px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: ".08em", textTransform: "uppercase", whiteSpace: "nowrap", background: "var(--bg-surface2)" }}>{h}</th>)}</tr></thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr><td colSpan={isAdmin ? 6 : 5} style={{ padding: "48px 22px", textAlign: "center" }}><div style={{ fontSize: 13, color: "var(--text-muted)" }}>No transactions match your filters.</div><div style={{ fontSize: 11.5, color: "var(--text-faint)", marginTop: 4 }}>Try adjusting your search or filters.</div></td></tr>
            ) : filteredTransactions.map(tx => (
              <tr key={tx.id} style={{ borderBottom: "1px solid var(--border)", transition: "background .1s" }} onMouseEnter={e => rowHover(e, true)} onMouseLeave={e => rowHover(e, false)}>
                <td style={{ padding: "12px 20px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 30, height: 30, borderRadius: 9, background: tx.avatarBg, color: tx.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 700, flexShrink: 0, opacity: isDark ? 0.9 : 1 }}>{tx.avatar}</div><span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{tx.name}</span></div></td>
                <td style={{ padding: "12px 20px" }}><span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", background: "var(--bg-surface3)", padding: "3px 8px", borderRadius: 5, whiteSpace: "nowrap" }}>{tx.category}</span></td>
                <td style={{ padding: "12px 20px", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{fmtDate(tx.date)}</td>
                <td style={{ padding: "12px 20px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: tx.type === "income" ? "var(--success-bg)" : "var(--danger-bg)", color: tx.type === "income" ? "var(--success)" : "var(--danger)", whiteSpace: "nowrap" }}>{tx.type === "income" ? "↑ Income" : "↓ Expense"}</span></td>
                <td style={{ padding: "12px 20px" }}><span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.01em", color: tx.type === "income" ? "var(--success)" : "var(--text-primary)", whiteSpace: "nowrap" }}>{tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}</span></td>
                {isAdmin && <td style={{ padding: "12px 20px" }}><button onClick={() => dispatch({ type: "DELETE_TRANSACTION", payload: tx.id })} style={{ width: 26, height: 26, borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg-surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", transition: "all .15s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "var(--danger-bg)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "var(--bg-surface)"; }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "12px 22px", background: "var(--bg-surface2)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Showing {filteredTransactions.length} results</span>
        <div style={{ display: "flex", gap: 6 }}>{["←","→"].map((a,i) => <button key={i} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-surface)", fontSize: 12, cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>{a}</button>)}</div>
      </div>
    </div>
  );
}

function RoleBanner() {
  const { state } = useDashboard();
  const { isDark } = useTheme();
  if (state.currentRole !== "Viewer") return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 16px", background: isDark ? "var(--warning-bg)" : "linear-gradient(135deg,#fef9c3,#fef3c7)", border: "1px solid", borderColor: isDark ? "#713f12" : "#fde68a", borderRadius: 12, marginBottom: 16, animation: "fadeIn .3s ease" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span style={{ fontSize: 12, fontWeight: 500, color: isDark ? "#fbbf24" : "#92400e" }}>You're in <strong>Viewer mode</strong> — read-only access. Use the Vibe toggle to switch to Admin.</span>
    </div>
  );
}

function Sidebar({ activeNav, setActiveNav }) {
  const { state } = useDashboard();
  const { isDark } = useTheme();
  const isAdmin = state.currentRole === "Admin";
  return (
    <aside style={{ width: 220, minWidth: 220, background: "var(--bg-surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100%", flexShrink: 0, backdropFilter: isDark ? "blur(20px)" : "none", zIndex: 1, position: "relative" }}>
      <div style={{ padding: "24px 20px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#6366f1,#818cf8)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: isDark ? "0 0 12px rgba(129,140,248,0.4)" : "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-.02em", lineHeight: 1 }}>Zorvyn</div><div style={{ fontSize: 9.5, color: "var(--text-muted)", fontWeight: 500, letterSpacing: ".06em", marginTop: 2 }}>FINTECH</div></div>
      </div>
      <div style={{ padding: "0 12px", flex: 1 }}>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: "var(--text-faint)", letterSpacing: ".1em", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>Main Menu</div>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 10px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: activeNav === item.id ? 600 : 500, letterSpacing: "-.01em", color: activeNav === item.id ? (isDark ? "#f1f5f9" : "#111827") : "var(--text-muted)", background: activeNav === item.id ? (isDark ? "rgba(129,140,248,0.12)" : "#f5f5f3") : "transparent", marginBottom: 2, textAlign: "left", transition: "all .15s", boxShadow: activeNav === item.id && isDark ? "0 0 0 1px rgba(129,140,248,0.2)" : "none" }}>
            <span style={{ opacity: activeNav === item.id ? 1 : .5 }}>{item.icon}</span>
            {item.label}
            {item.badge && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, background: JEWEL.teal, color: "#fff", borderRadius: 20, padding: "1px 6px" }}>{item.badge}</span>}
            {item.count && <span style={{ marginLeft: "auto", fontSize: 9.5, fontWeight: 700, background: "var(--accent)", color: "#fff", borderRadius: 20, padding: "1px 7px" }}>{state.transactions.length}</span>}
          </button>
        ))}
      </div>
      <div style={{ padding: "14px 20px 24px" }}>
        <div style={{ background: "var(--bg-surface2)", borderRadius: 12, padding: 12, border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a5b4fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: isDark ? "0 0 8px rgba(99,102,241,0.4)" : "none" }}>S</div>
            <div><div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>Sahil Gupta</div><div style={{ fontSize: 10.5, color: isAdmin ? "var(--accent)" : "var(--text-muted)", marginTop: 2, fontWeight: 500, transition: "color .2s" }}>{state.currentRole}</div></div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DashboardApp() {
  const [activeNav, setActiveNav] = useState("intelligence");
  const [showModal, setShowModal] = useState(false);
  const { isDark } = useTheme();
  const pageTitles = { intelligence: "Financial Intelligence", overview: "Overview", transactions: "Transactions", analytics: "Analytics", settings: "Settings" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter,sans-serif", background: "var(--bg-base)", overflow: "hidden", position: "relative" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <DeepSpaceBackground />
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, position: "relative", zIndex: 1 }}>
        <header style={{ background: "var(--glass-bg)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", borderBottom: "1px solid var(--glass-border)", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, zIndex: 10, boxShadow: isDark ? "0 1px 0 rgba(148,163,184,0.06)" : "0 1px 0 rgba(0,0,0,0.04)" }}>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-.025em", lineHeight: 1 }}>{pageTitles[activeNav]}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>April 3, 2026</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle />
            <div style={{ width: 1, height: 20, background: "var(--border-strong)" }} />
            <VibeToggle />
            <div style={{ width: 1, height: 20, background: "var(--border-strong)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--bg-surface)", border: "1px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "var(--shadow-sm)", backdropFilter: isDark ? "blur(12px)" : "none" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.75"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", border: "1.5px solid var(--bg-base)", boxShadow: isDark ? "0 0 6px var(--accent)" : "none" }} />
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <RoleBanner />
          {activeNav === "intelligence" && <div style={{ background: isDark ? "rgba(11,17,32,0.6)" : "#0B1120", borderRadius: 24, padding: "28px 28px 24px", border: `1px solid ${isDark ? "rgba(30,41,59,0.8)" : "#1E293B"}`, backdropFilter: isDark ? "blur(16px)" : "none", animation: "fadeUp .45s ease both" }}><FinancialIntelligence /></div>}
          {activeNav === "overview" && <><SummaryCards /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }} className="charts-grid"><CashFlowChart /><DonutChartSimple /></div><TransactionsTable onAdd={() => setShowModal(true)} /></>}
          {activeNav === "transactions" && <TransactionsTable onAdd={() => setShowModal(true)} />}
          {(activeNav === "analytics" || activeNav === "settings") && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M12 2a8 8 0 0 1 8 8c0 3-1.5 5.5-4 7v2H8v-2c-2.5-1.5-4-4-4-7a8 8 0 0 1 8-8z"/><line x1="9" y1="21" x2="15" y2="21"/></svg></div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Coming soon — check the Intelligence tab!</p>
            </div>
          )}
        </main>
      </div>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DashboardProvider>
          <DashboardApp />
        </DashboardProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}