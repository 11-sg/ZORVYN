import { useState, useMemo, useRef, useEffect, useCallback } from "react";

const TRANSACTIONS_DATA = [
  { id: 1,  merchant: "Stripe Inc.",        category: "Revenue",        date: "2026-04-02", amount: 84500,  type: "income",  note: "Monthly gateway settlement"   },
  { id: 2,  merchant: "Swiggy",             category: "Food",           date: "2026-04-01", amount: 1240,   type: "expense", note: "Lunch for team"                },
  { id: 3,  merchant: "Razorpay Payout",    category: "Revenue",        date: "2026-03-31", amount: 31200,  type: "income",  note: "Q1 client payment"            },
  { id: 4,  merchant: "Amazon",             category: "Shopping",       date: "2026-03-30", amount: 6800,   type: "expense", note: "Office supplies & peripherals" },
  { id: 5,  merchant: "Freelance Project",  category: "Revenue",        date: "2026-03-29", amount: 22000,  type: "income",  note: "Design contract delivery"      },
  { id: 6,  merchant: "Notion Pro",         category: "Software",       date: "2026-03-28", amount: 1600,   type: "expense", note: "Annual subscription"           },
  { id: 7,  merchant: "Monthly Salary",     category: "Salary",         date: "2026-03-27", amount: 95000,  type: "income",  note: "CTC disbursement"              },
  { id: 8,  merchant: "Figma Teams",        category: "Software",       date: "2026-03-26", amount: 3200,   type: "expense", note: "Design tool license"           },
  { id: 9,  merchant: "Office Rent",        category: "Operations",     date: "2026-03-25", amount: 28000,  type: "expense", note: "March rent — HSR Layout"       },
  { id: 10, merchant: "Zepto Groceries",    category: "Food",           date: "2026-03-24", amount: 2890,   type: "expense", note: "Weekly grocery run"            },
  { id: 11, merchant: "Marketing Ads",      category: "Marketing",      date: "2026-03-23", amount: 9500,   type: "expense", note: "Meta + Google campaigns"       },
  { id: 12, merchant: "Consulting Fee",     category: "Revenue",        date: "2026-03-22", amount: 18500,  type: "income",  note: "Strategy retainer"             },
  { id: 13, merchant: "Myntra",             category: "Shopping",       date: "2026-03-21", amount: 3450,   type: "expense", note: "Branded merchandise"           },
  { id: 14, merchant: "AWS Cloud",          category: "Infrastructure", date: "2026-03-20", amount: 12340,  type: "expense", note: "EC2 + S3 March bill"           },
  { id: 15, merchant: "Dividend Payout",    category: "Revenue",        date: "2026-03-19", amount: 5600,   type: "income",  note: "Mutual fund dividend"          },
  { id: 16, merchant: "Rapido",             category: "Transport",      date: "2026-03-18", amount: 580,    type: "expense", note: "Daily commute"                 },
  { id: 17, merchant: "Cult.fit",           category: "Health",         date: "2026-03-17", amount: 2999,   type: "expense", note: "Monthly membership"            },
  { id: 18, merchant: "Airtel Broadband",   category: "Utilities",      date: "2026-03-16", amount: 999,    type: "expense", note: "Home internet plan"            },
  { id: 19, merchant: "Client Milestone",   category: "Revenue",        date: "2026-03-15", amount: 40000,  type: "income",  note: "Phase 2 delivery accepted"     },
  { id: 20, merchant: "Nykaa",              category: "Shopping",       date: "2026-03-14", amount: 2100,   type: "expense", note: "Skincare order"                },
  { id: 21, merchant: "Uber",               category: "Transport",      date: "2026-03-13", amount: 1240,   type: "expense", note: "Airport drop"                  },
  { id: 22, merchant: "Practo",             category: "Health",         date: "2026-03-12", amount: 800,    type: "expense", note: "General checkup"               },
  { id: 23, merchant: "YouTube Premium",    category: "Software",       date: "2026-03-11", amount: 189,    type: "expense", note: "Ad-free subscription"          },
  { id: 24, merchant: "Blinkit",            category: "Food",           date: "2026-03-10", amount: 1760,   type: "expense", note: "Quick commerce order"          },
  { id: 25, merchant: "Electricity Bill",   category: "Utilities",      date: "2026-03-09", amount: 2200,   type: "expense", note: "BESCOM March bill"             },
];

const CATEGORY_META = {
  Revenue:        { icon: "revenue",        color: "#1B4FD8", bg: "#EEF2FF", label: "Revenue"        },
  Food:           { icon: "food",           color: "#B45309", bg: "#FFFBEB", label: "Food"           },
  Shopping:       { icon: "shopping",       color: "#7C3AED", bg: "#F5F3FF", label: "Shopping"       },
  Software:       { icon: "software",       color: "#0F766E", bg: "#F0FDFA", label: "Software"       },
  Salary:         { icon: "salary",         color: "#047857", bg: "#ECFDF5", label: "Salary"         },
  Operations:     { icon: "operations",     color: "#475569", bg: "#F8FAFC", label: "Operations"     },
  Infrastructure: { icon: "infrastructure", color: "#B91C1C", bg: "#FFF1F2", label: "Infrastructure" },
  Marketing:      { icon: "marketing",      color: "#3730A3", bg: "#EEF2FF", label: "Marketing"      },
  Transport:      { icon: "transport",      color: "#0369A1", bg: "#F0F9FF", label: "Transport"      },
  Health:         { icon: "health",         color: "#BE185D", bg: "#FDF4FF", label: "Health"         },
  Utilities:      { icon: "utilities",      color: "#92400E", bg: "#FEF3C7", label: "Utilities"      },
};

const ALL_CATEGORIES = ["All", ...Object.keys(CATEGORY_META)];

function CategoryIcon({ type, size = 20 }) {
  const icons = {
    revenue: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    food: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    shopping: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    software: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    salary: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    operations: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    infrastructure: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    marketing: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    transport: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    health: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    utilities: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  };
  return icons[type] || icons.revenue;
}

function EmptyState({ query, category, onClear }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px 56px",
        textAlign: "center",
        animation: "fadeSlideUp 0.4s cubic-bezier(0.34, 1.3, 0.64, 1) both",
      }}
    >
      <div style={{ position: "relative", marginBottom: 32 }}>
        <svg width="180" height="148" viewBox="0 0 180 148" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="90" cy="138" rx="72" ry="10" fill="#F1F5F9" />
          <rect x="30" y="24" width="120" height="96" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="30" y="24" width="120" height="26" rx="12" fill="#EEF2FF" />
          <rect x="30" y="38" width="120" height="12" rx="0" fill="#EEF2FF" />
          <circle cx="47" cy="37" r="7" fill="#C7D2FE" />
          <rect x="60" y="33" width="40" height="5" rx="2.5" fill="#A5B4FC" />
          <rect x="106" y="33" width="24" height="5" rx="2.5" fill="#C7D2FE" />
          <rect x="42" y="64" width="14" height="14" rx="4" fill="#E0E7FF" />
          <rect x="64" y="66" width="52" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="64" y="74" width="32" height="4" rx="2" fill="#F1F5F9" />
          <rect x="136" y="66" width="20" height="5" rx="2.5" fill="#DCFCE7" />
          <rect x="42" y="88" width="14" height="14" rx="4" fill="#FCE7F3" />
          <rect x="64" y="90" width="44" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="64" y="98" width="28" height="4" rx="2" fill="#F1F5F9" />
          <rect x="136" y="90" width="20" height="5" rx="2.5" fill="#FEE2E2" />
          <rect x="42" y="112" width="14" height="14" rx="4" fill="#FEF3C7" />
          <rect x="64" y="114" width="36" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="64" y="122" width="22" height="4" rx="2" fill="#F1F5F9" />
          <rect x="136" y="114" width="20" height="5" rx="2.5" fill="#E2E8F0" />
          <circle cx="138" cy="50" r="28" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="138" cy="50" r="24" fill="#FFF7ED" />
          <line x1="138" y1="38" x2="138" y2="62" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="126" y1="50" x2="150" y2="50" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="138" cy="50" r="7" fill="#FFEDD5" stroke="#F97316" strokeWidth="1.5" />
          <circle cx="56" cy="12" r="5" fill="#DBEAFE" stroke="#BFDBFE" strokeWidth="1" />
          <circle cx="148" cy="8" r="3.5" fill="#FCE7F3" stroke="#FBCFE8" strokeWidth="1" />
          <circle cx="24" cy="72" r="4" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1" />
          <path d="M56 12 L138 24" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1E293B", letterSpacing: "-0.025em", marginBottom: 8 }}>
        No transactions found
      </h3>
      <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.6, maxWidth: 260, marginBottom: 24 }}>
        {query && category !== "All"
          ? `No "${query}" results in ${category}.`
          : query
          ? `Nothing matched "${query}". Try a different search term.`
          : `No transactions in the ${category} category yet.`}
      </p>

      <button
        onClick={onClear}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "10px 20px",
          borderRadius: 12,
          background: "linear-gradient(135deg, #4F46E5, #6366F1)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
          fontFamily: "inherit",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Clear all filters
      </button>
    </div>
  );
}

function SortButton({ field, label, sortKey, sortDir, onSort }) {
  const active = sortKey === field;
  return (
    <button
      onClick={() => onSort(field)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 11px",
        borderRadius: 8,
        border: `1px solid ${active ? "#6366F1" : "#E2E8F0"}`,
        background: active ? "#EEF2FF" : "transparent",
        color: active ? "#4F46E5" : "#64748B",
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.12s ease",
      }}
    >
      {label}
      <span style={{ display: "flex", flexDirection: "column", gap: 1, opacity: active ? 1 : 0.35 }}>
        <svg width="8" height="5" viewBox="0 0 8 5" fill={active && sortDir === "asc" ? "#4F46E5" : "#94A3B8"}>
          <path d="M4 0L7.46 4.5H0.54L4 0z" />
        </svg>
        <svg width="8" height="5" viewBox="0 0 8 5" fill={active && sortDir === "desc" ? "#4F46E5" : "#94A3B8"}>
          <path d="M4 5L0.54.5H7.46L4 5z" />
        </svg>
      </span>
    </button>
  );
}

function TransactionRow({ tx, index }) {
  const meta = CATEGORY_META[tx.category] || CATEGORY_META.Revenue;
  const isIncome = tx.type === "income";
  const fmt = n => "₹" + Number(n).toLocaleString("en-IN");
  const fmtDate = d => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "44px 1fr auto",
        gap: "0 16px",
        padding: "14px 20px",
        borderBottom: "1px solid #F1F5F9",
        background: hovered ? "#FAFBFF" : "transparent",
        transition: "background 0.12s ease",
        animation: `rowReveal 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) both`,
        animationDelay: `${Math.min(index * 35, 400)}ms`,
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: meta.bg,
          color: meta.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: `1px solid ${meta.color}22`,
          transition: "transform 0.15s ease",
          transform: hovered ? "scale(1.07)" : "scale(1)",
        }}
      >
        <CategoryIcon type={meta.icon} size={18} />
      </div>

      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>
            {tx.merchant}
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: meta.bg, color: meta.color, border: `1px solid ${meta.color}22`, whiteSpace: "nowrap", flexShrink: 0 }}>
            {meta.label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11.5, color: "#94A3B8", fontWeight: 400 }}>{fmtDate(tx.date)}</span>
          {tx.note && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#CBD5E1", flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, color: "#CBD5E1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>{tx.note}</span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 3, flexShrink: 0 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: isIncome ? "#059669" : "#1E293B",
            letterSpacing: "-0.02em",
          }}
        >
          {isIncome ? "+" : "−"}{fmt(tx.amount)}
        </span>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            padding: "1px 7px",
            borderRadius: 20,
            background: isIncome ? "#D1FAE5" : "#FEE2E2",
            color: isIncome ? "#065F46" : "#991B1B",
          }}
        >
          {isIncome ? "↑ Income" : "↓ Expense"}
        </span>
      </div>
    </div>
  );
}

export default function TransactionLedger() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [renderKey, setRenderKey] = useState(0);
  const searchRef = useRef(null);

  const handleSort = useCallback((field) => {
    setSortKey(prev => {
      if (prev === field) {
        setSortDir(d => d === "asc" ? "desc" : "asc");
      } else {
        setSortDir("desc");
      }
      return field;
    });
    setRenderKey(k => k + 1);
  }, []);

  const filtered = useMemo(() => {
    let rows = [...TRANSACTIONS_DATA];
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(t =>
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.note.toLowerCase().includes(q)
      );
    }
    if (category !== "All") rows = rows.filter(t => t.category === category);
    if (typeFilter !== "All") rows = rows.filter(t => t.type === typeFilter);
    rows.sort((a, b) => {
      if (sortKey === "date") {
        const diff = new Date(a.date) - new Date(b.date);
        return sortDir === "asc" ? diff : -diff;
      }
      return sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount;
    });
    return rows;
  }, [query, category, typeFilter, sortKey, sortDir]);

  const totalIncome = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const hasFilters = query.trim() || category !== "All" || typeFilter !== "All";
  const clearAll = () => { setQuery(""); setCategory("All"); setTypeFilter("All"); setRenderKey(k => k + 1); };

  const fmt = n => "₹" + Number(n).toLocaleString("en-IN");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rowReveal {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes headerIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .ledger-root * { box-sizing: border-box; }
        .ledger-root { font-family: 'DM Sans', system-ui, sans-serif; }
        .search-input::placeholder { color: #CBD5E1; }
        .search-input:focus { outline: none; border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .filter-select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; }
        .filter-select:focus { outline: none; border-color: #6366F1; }
        .type-chip { transition: all 0.15s ease; }
        .type-chip:hover { opacity: 0.85; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 2px; }
      `}</style>

      <div
        className="ledger-root"
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #E8EAED",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
          overflow: "hidden",
          maxWidth: 780,
          margin: "0 auto",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            padding: "20px 20px 0",
            background: "linear-gradient(180deg, #FAFBFF 0%, #FFFFFF 100%)",
            borderBottom: "1px solid #F1F5F9",
            animation: "headerIn 0.4s ease both",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 3 }}>
                Transaction Ledger
              </h2>
              <p style={{ fontSize: 12, color: "#94A3B8", fontWeight: 400 }}>
                {filtered.length} of {TRANSACTIONS_DATA.length} records
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 1 }}>Income</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#059669", letterSpacing: "-0.02em" }}>{fmt(totalIncome)}</div>
              </div>
              <div style={{ width: 1, background: "#E2E8F0", margin: "2px 4px" }} />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 1 }}>Expenses</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", letterSpacing: "-0.02em" }}>{fmt(totalExpense)}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                display: "flex",
                alignItems: "center",
                gap: 9,
                border: "1.5px solid #E2E8F0",
                borderRadius: 12,
                padding: "9px 13px",
                background: "#fff",
                transition: "border-color 0.15s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={searchRef}
                className="search-input"
                value={query}
                onChange={e => { setQuery(e.target.value); setRenderKey(k => k + 1); }}
                placeholder="Search merchant, category…"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13,
                  color: "#1E293B",
                  fontFamily: "inherit",
                  width: "100%",
                }}
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setRenderKey(k => k + 1); searchRef.current?.focus(); }}
                  style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#CBD5E1", display: "flex", alignItems: "center" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </button>
              )}
            </div>

            <select
              className="filter-select"
              value={category}
              onChange={e => { setCategory(e.target.value); setRenderKey(k => k + 1); }}
              style={{
                flex: "0 0 auto",
                padding: "9px 30px 9px 12px",
                border: `1.5px solid ${category !== "All" ? "#6366F1" : "#E2E8F0"}`,
                borderRadius: 12,
                background: category !== "All" ? "#EEF2FF" : "#fff",
                color: category !== "All" ? "#4F46E5" : "#475569",
                fontSize: 13,
                fontFamily: "inherit",
                fontWeight: category !== "All" ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
            </select>

            <div style={{ display: "flex", gap: 4, padding: "4px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
              {["All", "income", "expense"].map(t => (
                <button
                  key={t}
                  className="type-chip"
                  onClick={() => { setTypeFilter(t); setRenderKey(k => k + 1); }}
                  style={{
                    padding: "5px 11px",
                    borderRadius: 7,
                    border: "none",
                    background: typeFilter === t ? "#fff" : "transparent",
                    color: typeFilter === t ? (t === "income" ? "#059669" : t === "expense" ? "#DC2626" : "#4F46E5") : "#94A3B8",
                    fontSize: 12,
                    fontWeight: typeFilter === t ? 700 : 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: typeFilter === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s ease",
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t === "All" ? "All" : t === "income" ? "↑ Income" : "↓ Expense"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 11.5, color: "#94A3B8", fontWeight: 500, marginRight: 4, alignSelf: "center" }}>Sort:</span>
              <SortButton field="date"   label="Date"   sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortButton field="amount" label="Amount" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            </div>
            {hasFilters && (
              <button
                onClick={clearAll}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 10px", borderRadius: 8,
                  border: "1px solid #FECACA", background: "#FFF5F5",
                  color: "#EF4444", fontSize: 11.5, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#FFF5F5"; }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div
          key={renderKey}
          style={{ overflowY: "auto", maxHeight: 480, position: "relative" }}
        >
          {filtered.length === 0 ? (
            <EmptyState query={query} category={category} onClear={clearAll} />
          ) : (
            filtered.map((tx, i) => (
              <TransactionRow key={tx.id} tx={tx} index={i} />
            ))
          )}
        </div>

        <div
          style={{
            padding: "12px 20px",
            background: "#FAFBFF",
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: "#94A3B8" }}>
            Showing <strong style={{ color: "#64748B" }}>{filtered.length}</strong> transactions
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {["←", "→"].map((a, i) => (
              <button
                key={i}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  border: "1px solid #E2E8F0", background: "#fff",
                  fontSize: 13, cursor: "pointer", color: "#64748B",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "inherit",
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}