import React, { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ─── Color System — "Clean Governance UI" (KaushalDrishti brand palette) ─────
const C = {
  bg: "#F8FAFC",            // Off-White / Pale Ice — main page background
  surface: "#EEF2F6",       // light surface — inputs, table headers, tooltips
  card: "#FFFFFF",          // crisp white cards
  navy: "#0F2C59",          // Deep Navy — headers, nav rail, primary buttons
  navyDeep: "#0A1F40",      // darker navy for gradients/hover states
  border: "#E2E8F0",        // card & input borders
  borderHover: "rgba(0,168,150,0.4)",
  accent: "#00A896",        // Vibrant Teal — interactive elements, active tabs, key data
  accentMid: "#00786B",     // deeper teal for readable text labels
  accentSoft: "rgba(0,168,150,0.12)",
  accentSoftStrong: "rgba(0,168,150,0.22)", // teal tint against navy
  gold: "#E9C46A",          // Soft Saffron Gold — badges, high-priority, CTAs
  goldSoft: "rgba(233,196,106,0.22)",
  green: "#16A34A",         // success / verified
  greenSoft: "rgba(22,163,74,0.12)",
  amber: "#E9C46A",         // pending (Saffron Gold per status legend)
  amberSoft: "rgba(233,196,106,0.22)",
  red: "#DC2626",           // alerts / critical
  redSoft: "rgba(220,38,38,0.10)",
  purple: "#6D45B8",        // tertiary accent — skill-gap, rejected, misc stats
  purpleSoft: "rgba(109,69,184,0.10)",
  cyan: "#2563EB",          // informational / self-employed (Blue per status legend)
  cyanSoft: "rgba(37,99,235,0.10)",
  textPrimary: "#1E293B",   // Dark Charcoal — headings, body, table text
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  navyText: "#FFFFFF",              // text on navy chrome
  navyTextMuted: "rgba(255,255,255,0.68)",
  navyBorder: "rgba(255,255,255,0.12)",
  shadow: "0 1px 3px rgba(15,44,89,0.08), 0 1px 2px rgba(15,44,89,0.04)",
  glass: "rgba(255,255,255,0.85)",
};

// ─── Skill Taxonomy (for Skill Assessment Form) ──────────────────────────────
const SKILL_CATEGORIES = [
  {
    id: "programming",
    label: "Programming Languages",
    skills: ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust", "PHP", "Kotlin", "Swift", "SQL"],
  },
  {
    id: "frontend",
    label: "Web Dev — Frontend",
    skills: ["HTML", "CSS", "Tailwind", "Bootstrap", "React", "Next.js", "Angular", "Vue"],
  },
  {
    id: "backend",
    label: "Web Dev — Backend",
    skills: ["Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel"],
  },
  {
    id: "database",
    label: "Databases",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Supabase", "Firebase"],
  },
  {
    id: "data_ai",
    label: "Data & AI",
    skills: ["Pandas", "NumPy", "Power BI", "Tableau", "Machine Learning", "Deep Learning", "Generative AI", "OpenAI APIs"],
  },
  {
    id: "cloud_devops",
    label: "Cloud & DevOps",
    skills: ["Git", "GitHub", "Docker", "Kubernetes", "AWS", "Azure", "CI/CD"],
  },
];

const SOFT_SKILLS = ["Communication", "Leadership", "Teamwork", "Problem Solving", "Presentation Skills", "Time Management"];

// ─── Mock APIs (replace with real backend when connected) ────────────────────
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

const authApi = {
  sendOtp: async (mobile) => {
    const response = await axios.post(
      `${API_URL}/auth/send-otp`,
      { mobile }
    );
    return response.data;
  },

  verifyOtp: async (mobile, otp) => {
    const response = await axios.post(
      `${API_URL}/auth/verify-otp`,
      { mobile, otp }
    );
    return response.data;
  },

  loginWithPassword: async (email, password, role) => {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        email,
        password,
        role
      }
    );
    return response.data;
  },

  signup: async (data) => {
    const response = await axios.post(
      `${API_URL}/auth/signup`,
      data
    );
    return response.data;
  },

  guestLogin: async () => {
    const response = await axios.post(
      `${API_URL}/auth/guest`
    );
    return response.data;
  },
};

const mockSkillApi = {
  submitAssessment: async (payload) => {
    const response = await axios.post(
      `${API_URL}/ai/analyze`,
      payload
    );

    return response.data;
  },
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const employmentTrend = [
  { month: "Jan", placed: 4200, trained: 5800, verified: 3800 },
  { month: "Feb", placed: 4800, trained: 6200, verified: 4200 },
  { month: "Mar", placed: 5200, trained: 6800, verified: 4600 },
  { month: "Apr", placed: 5800, trained: 7200, verified: 5100 },
  { month: "May", placed: 6400, trained: 7800, verified: 5700 },
  { month: "Jun", placed: 7100, trained: 8400, verified: 6300 },
  { month: "Jul", placed: 7800, trained: 9000, verified: 7000 },
  { month: "Aug", placed: 8400, trained: 9600, verified: 7600 },
];

const districtData = [
  { district: "Pune", rate: 82, gap: 12 },
  { district: "Mumbai", rate: 78, gap: 18 },
  { district: "Nagpur", rate: 71, gap: 22 },
  { district: "Nashik", rate: 68, gap: 28 },
  { district: "Aurangabad", rate: 61, gap: 31 },
  { district: "Solapur", rate: 58, gap: 35 },
  { district: "Kolhapur", rate: 55, gap: 38 },
  { district: "Latur", rate: 48, gap: 44 },
];

const skillDemand = [
  { skill: "Data Analytics", demand: 94, supply: 42 },
  { skill: "AI/ML", demand: 88, supply: 28 },
  { skill: "Cloud Computing", demand: 82, supply: 35 },
  { skill: "Cybersecurity", demand: 78, supply: 31 },
  { skill: "Full-Stack Dev", demand: 75, supply: 58 },
  { skill: "IoT Systems", demand: 68, supply: 22 },
  { skill: "Digital Marketing", demand: 65, supply: 71 },
  { skill: "EV Technology", demand: 62, supply: 18 },
];

const centerPerformance = [
  { center: "MSSDS Pune", students: 1240, placed: 1020, rating: 4.8 },
  { center: "ITI Mumbai", students: 980, placed: 742, rating: 4.2 },
  { center: "KVIC Nagpur", students: 760, placed: 532, rating: 3.9 },
  { center: "NULM Nashik", students: 640, placed: 428, rating: 3.7 },
  { center: "PMKVY Latur", students: 520, placed: 312, rating: 3.1 },
];

const verificationStatus = [
  { name: "Verified", value: 58, color: C.green },
  { name: "Pending", value: 24, color: C.amber },
  { name: "Unverified", value: 12, color: C.red },
  { name: "Rejected", value: 6, color: C.purple },
];

const notifications = [
  { id: 1, type: "alert", title: "Low placement — Latur district", desc: "Placement rate dropped to 44% this quarter. Intervention needed.", time: "2m ago", color: C.red },
  { id: 2, type: "verify", title: "148 verifications pending", desc: "Employer confirmation awaited for July batch students.", time: "18m ago", color: C.amber },
  { id: 3, type: "skill", title: "AI/ML skill gap widening", desc: "Demand-supply gap increased by 12% in Maharashtra Tech sector.", time: "1h ago", color: C.purple },
  { id: 4, type: "followup", title: "Follow-up reminders due", desc: "324 students haven't been contacted in the last 30 days.", time: "3h ago", color: C.cyan },
  { id: 5, type: "alert", title: "PMKVY Latur flagged", desc: "Training center performance below threshold for 2 consecutive quarters.", time: "6h ago", color: C.red },
  { id: 6, type: "verify", title: "TechMahindra verification link sent", desc: "Batch of 62 students awaiting employer confirmation.", time: "1d ago", color: C.green },
];

const employmentTrackingData = [
  { id: "KD001", name: "Priya Sharma", district: "Pune", course: "Data Analytics", status: "Employed", employer: "Infosys", salary: "₹4.2L", whatsapp: "Responded", linkedin: "Verified", followup: "Completed" },
  { id: "KD002", name: "Rahul Patil", district: "Nagpur", course: "AI/ML", status: "Awaiting", employer: "—", salary: "—", whatsapp: "No Response", linkedin: "Pending", followup: "Due" },
  { id: "KD003", name: "Sunita Jadhav", district: "Aurangabad", course: "Cloud Computing", status: "Self Employed", employer: "Freelance", salary: "₹3.8L", whatsapp: "Responded", linkedin: "Verified", followup: "Completed" },
  { id: "KD004", name: "Amit Deshmukh", district: "Nashik", course: "Full Stack Dev", status: "Apprentice", employer: "TCS", salary: "₹2.4L", whatsapp: "Responded", linkedin: "Pending", followup: "In Progress" },
  { id: "KD005", name: "Kavya Kulkarni", district: "Mumbai", course: "Cybersecurity", status: "Unemployed", employer: "—", salary: "—", whatsapp: "No Response", linkedin: "Not Found", followup: "Overdue" },
  { id: "KD006", name: "VijayMore", district: "Solapur", course: "Digital Marketing", status: "Employed", employer: "Wipro", salary: "₹3.2L", whatsapp: "Responded", linkedin: "Verified", followup: "Completed" },
];

const skillGapData = [
  { skill: "Machine Learning", district: "Aurangabad", sector: "IT/ITES", gap: 78, demand: 320, supply: 71, priority: "Critical" },
  { skill: "Cloud Architecture", district: "Nagpur", sector: "IT/ITES", gap: 72, demand: 280, supply: 78, priority: "Critical" },
  { skill: "EV Battery Systems", district: "Pune", sector: "Automotive", gap: 68, demand: 190, supply: 61, priority: "High" },
  { skill: "Industrial IoT", district: "Nashik", sector: "Manufacturing", gap: 65, demand: 160, supply: 56, priority: "High" },
  { skill: "Drone Technology", district: "Latur", sector: "Agriculture", gap: 81, demand: 140, supply: 27, priority: "Critical" },
  { skill: "Cybersecurity Ops", district: "Mumbai", sector: "BFSI", gap: 58, demand: 420, supply: 176, priority: "High" },
  { skill: "Data Engineering", district: "Pune", sector: "IT/ITES", gap: 54, demand: 510, supply: 235, priority: "Medium" },
  { skill: "Biomedical Tech", district: "Mumbai", sector: "Healthcare", gap: 48, demand: 180, supply: 94, priority: "Medium" },
];

const chatHistory = [
  { role: "assistant", content: "Hello! I'm the KaushalDrishti AI Policy Copilot. I can analyze employment data, identify skill gaps, and provide district-level insights for Maharashtra's skilling initiatives. What would you like to know?" },
];

const aiResponses = {
  "low placement": {
    text: "Based on current data, **5 districts** show placement rates below 60%:\n\n- **Latur** — 44% (Critical)\n- **Osmanabad** — 48% (Critical)\n- **Nandurbar** — 51% (High risk)\n- **Gadchiroli** — 53% (High risk)\n- **Yavatmal** — 57% (Moderate)\n\nPrimary causes include limited employer presence, geographic isolation, and mismatch between trained skills and local industry demand. Recommended action: Mobile recruitment drives and remote work infrastructure.",
    chart: "district"
  },
  "skill": {
    text: "The top 5 most critical skill gaps in Maharashtra (2024–25):\n\n- **AI/ML Engineering** — 78% gap (demand 2.4x supply)\n- **Drone Technology** — 81% gap (emerging sector)\n- **Cloud Architecture** — 72% gap\n- **EV Battery Systems** — 68% gap\n- **Industrial IoT** — 65% gap\n\nIT/ITES and Automotive sectors show the most severe shortfalls. Recommendation: Fast-track 6-month certification programs in top 3 skills.",
    chart: "skill"
  },
  "training center": {
    text: "**3 training centers** require immediate intervention:\n\n- **PMKVY Latur** — 60% placement rate (2 quarters below threshold), 3.1/5 rating\n- **NULM Osmanabad** — 52% placement, infrastructure concerns flagged\n- **ITI Gadchiroli** — 48% placement, high dropout rate\n\nRecommended actions:\n1. Curriculum audit against industry requirements\n2. Industry partner onboarding for placement support\n3. Trainer upskilling in emerging technologies",
    chart: "center"
  },
};

// ─── Utility Components ──────────────────────────────────────────────────────
const GlassCard = ({ children, style = {}, hover = false, onClick }) => (
  <div onClick={onClick} style={{
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: "1.5rem",
    boxShadow: C.shadow,
    transition: "all 0.2s",
    cursor: onClick ? "pointer" : "default",
    ...(hover ? { ":hover": { borderColor: C.borderHover } } : {}),
    ...style
  }}>
    {children}
  </div>
);

const Badge = ({ children, color = C.accent, bg }) => (
  <span style={{
    background: bg || `${color}22`,
    color,
    border: `1px solid ${color}44`,
    borderRadius: 6,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap"
  }}>{children}</span>
);

const KPICard = ({ icon, label, value, sub, color = C.accent, trend }) => (
  <div style={{
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: "1.25rem 1.5rem",
    position: "relative",
    overflow: "hidden",
    boxShadow: C.shadow
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.02em" }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ background: `${color}15`, borderRadius: 10, padding: 10, fontSize: 20 }}>{icon}</div>
    </div>
    {trend && (
      <div style={{ marginTop: 8, fontSize: 12, color: trend > 0 ? C.green : C.red }}>
        {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last quarter
      </div>
    )}
  </div>
);

const Chip = ({ label, active, onClick, color = C.accent }) => (
  <button onClick={onClick} style={{
    background: active ? `${color}20` : "transparent",
    border: `1px solid ${active ? color : C.border}`,
    color: active ? color : C.textSecondary,
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.15s",
    fontWeight: active ? 600 : 400
  }}>{label}</button>
);

const ProgressBar = ({ value, color = C.accent, bg = "#E2E8F0" }) => (
  <div style={{ background: bg, borderRadius: 4, height: 6, overflow: "hidden" }}>
    <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
  </div>
);

const Skeleton = ({ w = "100%", h = 16, r = 8 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: "linear-gradient(90deg, #E9EEF3 25%, #F4F7FA 50%, #E9EEF3 75%)", backgroundSize: "400% 100%", animation: "shimmer 1.5s infinite" }} />
);

const StatusDot = ({ status }) => {
  const colors = {
    "Employed": C.green, "Self Employed": C.cyan, "Apprentice": C.accent,
    "Unemployed": C.red, "Awaiting": C.amber, "Awaiting Verification": C.amber
  };
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[status] || C.textMuted, boxShadow: `0 0 6px ${colors[status] || C.textMuted}` }} />
      <span style={{ fontSize: 12, color: colors[status] || C.textSecondary, fontWeight: 600 }}>{status}</span>
    </span>
  );
};

const Tooltip_Custom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>{p.name}: {p.value.toLocaleString()}</div>
      ))}
    </div>
  );
};

// ─── Brand Logo (used in Splash, Auth, Sidebar, top nav) ─────────────────────
const Logo = ({ size = 34, showWordmark = true, dark = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kd-logo-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={C.navy} />
          <stop offset="100%" stopColor={C.accent} />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="42" height="42" rx="12" fill="url(#kd-logo-grad)" />
      {/* Stylized "K" chevron formed from an eye/lens (Drishti = vision) + skill node */}
      <path d="M14 11 L14 33" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 22 L27 11" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 22 L27 33" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="31" cy="22" r="3.6" fill={C.gold} />
    </svg>
    {showWordmark && (
      <span style={{ fontSize: size >= 30 ? 17 : 14, fontWeight: 700, letterSpacing: "-0.01em", color: dark ? C.textPrimary : "#fff" }}>
        <span style={{ color: C.accent }}>Kaushal</span>Drishti<span style={{ opacity: 0.7, fontWeight: 600 }}> AI</span>
      </span>
    )}
  </div>
);

// ─── Reusable OTP Input (6-digit) ────────────────────────────────────────────
const OTPInput = ({ value, onChange, length = 6 }) => {
  const refs = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleChange = (i, v) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    const next = digits.slice();
    next[i] = clean;
    onChange(next.join(""));
    if (clean && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          style={{
            width: 42, height: 48, textAlign: "center", fontSize: 20, fontWeight: 700,
            background: C.surface, border: `1px solid ${d ? C.accent : C.border}`, borderRadius: 10,
            color: C.textPrimary, outline: "none",
          }}
        />
      ))}
    </div>
  );
};

// ─── Navigation ─────────────────────────────────────────────────────────────
const navItems = [
  { id: "landing", icon: "🏠", label: "Home" },
  { id: "auth", icon: "🔐", label: "Login" },
  { id: "gov-dashboard", icon: "📊", label: "Gov Dashboard" },
  { id: "employment", icon: "👤", label: "Employment" },
  { id: "skill-gap", icon: "🎯", label: "Skill Gaps" },
  { id: "ai-analyzer", icon: "🤖", label: "AI Analyzer" },
  { id: "ai-copilot", icon: "💬", label: "AI Copilot" },
  { id: "employer", icon: "🏢", label: "Employer Portal" },
  { id: "training", icon: "🎓", label: "Training Centers" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
];

const Sidebar = ({ active, setPage }) => (
  <div style={{
    width: 220, minHeight: "100vh", background: C.navy,
    borderRight: `1px solid ${C.navyBorder}`, padding: "20px 12px",
    position: "fixed", left: 0, top: 0, bottom: 0, overflowY: "auto", zIndex: 100
  }}>
    {/* Logo */}
    <div style={{ padding: "8px 12px 24px" }}>
      <Logo size={28} />
      <div style={{ fontSize: 10, color: C.navyTextMuted, marginTop: 6 }}>Gov. of Maharashtra · SIH 2024</div>
    </div>

    <div style={{ fontSize: 10, color: C.navyTextMuted, padding: "0 12px", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Navigation</div>

    {navItems.map(item => (
      <button key={item.id} onClick={() => setPage(item.id)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
        background: active === item.id ? C.accentSoftStrong : "transparent",
        borderLeft: active === item.id ? `3px solid ${C.accent}` : "3px solid transparent",
        color: active === item.id ? "#fff" : C.navyTextMuted,
        fontSize: 13, fontWeight: active === item.id ? 600 : 400,
        marginBottom: 2, transition: "all 0.15s", textAlign: "left"
      }}>
        <span style={{ fontSize: 15 }}>{item.icon}</span>
        {item.label}
      </button>
    ))}

    <div style={{ position: "absolute", bottom: 20, left: 12, right: 12 }}>
      <div style={{ background: C.accentSoftStrong, border: `1px solid ${C.accent}44`, borderRadius: 10, padding: "10px 12px" }}>
        <div style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>Live System Status</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
          <span style={{ fontSize: 11, color: C.navyTextMuted }}>All systems operational</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── 1. Landing Page ─────────────────────────────────────────────────────────
const LandingPage = ({ setPage }) => {
  const features = [
    { icon: "📡", title: "Real-time Employment Tracking", desc: "WhatsApp + LinkedIn verification for 100% employment outcome accuracy across Maharashtra." },
    { icon: "🤖", title: "AI Skill Gap Intelligence", desc: "Predicts district-wise skill shortfalls 6 months ahead using industry demand signals." },
    { icon: "📊", title: "Government Analytics Suite", desc: "District heatmaps, policy impact metrics, and center-level performance dashboards." },
    { icon: "🔗", title: "Employer Verification Portal", desc: "Secure one-click employment confirmation links for verified salary and role data." },
    { icon: "💬", title: "AI Policy Copilot", desc: "Ask natural language questions to instantly surface actionable skilling insights." },
    { icon: "🎯", title: "Readiness Score Engine", desc: "Per-student employability scoring with matched skills and course recommendations." },
  ];

  const stats = [
    { value: "2.4L+", label: "Students Tracked", color: C.accent },
    { value: "82%", label: "Verification Rate", color: C.green },
    { value: "34", label: "Districts Covered", color: C.purple },
    { value: "₹4.1L", label: "Avg Annual Salary", color: C.amber },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      {/* Hero */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${C.accent}18, transparent)`, pointerEvents: "none" }} />

        <div style={{ marginBottom: 16 }}>
          <Badge color={C.accent} bg={C.accentSoft}>Smart India Hackathon 2024 · Problem Statement PS1701</Badge>
        </div>

        <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, color: C.textPrimary, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 800, marginBottom: 24 }}>
          Maharashtra's Skilling Intelligence Platform
        </h1>

        <p style={{ fontSize: 18, color: C.textSecondary, maxWidth: 600, lineHeight: 1.7, marginBottom: 40 }}>
          KaushalDrishti AI turns raw training data into verified employment outcomes — closing the loop between skill investment and economic impact for 2.4 lakh students.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => setPage("gov-dashboard")} style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Open Dashboard →
          </button>
          <button onClick={() => setPage("ai-copilot")} style={{ background: "transparent", color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 28px", fontSize: 15, cursor: "pointer" }}>
            Try AI Copilot
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 80, maxWidth: 700, width: "100%" }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Statement */}
      <div style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 20, padding: "2.5rem", borderLeft: `4px solid ${C.accent}` }}>
          <div style={{ fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Problem Statement</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: C.textPrimary, marginBottom: 16, lineHeight: 1.3 }}>
            Government of Maharashtra cannot see where their skilling investments land
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 20 }}>
            {["No employment outcome tracking after course completion", "District-level skill gaps invisible to policymakers", "No standardized employer verification mechanism"].map(p => (
              <div key={p} style={{ background: `${C.red}10`, border: `1px solid ${C.red}22`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>⚠️ {p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.textPrimary, letterSpacing: "-0.02em" }}>Platform Capabilities</h2>
          <p style={{ color: C.textSecondary, marginTop: 8 }}>Purpose-built for government skilling oversight</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 14, padding: "1.5rem", transition: "border-color 0.2s" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>Ready to see Maharashtra's skilling data clearly?</h2>
        <p style={{ color: C.textSecondary, marginBottom: 28 }}>Access the full intelligence platform — no setup required</p>
        <button onClick={() => setPage("auth")} style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.accent})`, color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
          Get Access →
        </button>
      </div>
    </div>
  );
};

// ─── 0. Splash Screen ─────────────────────────────────────────────────────────
const SplashScreen = ({ setPage }) => {
  const [phase, setPhase] = useState(0); // 0 = fade in logo, 1 = reveal text, 2 = glow hold

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 350);
    const t2 = setTimeout(() => setPhase(2), 1100);
    const t3 = setTimeout(() => setPage("auth"), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [setPage]);

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(160deg, ${C.navyDeep}, ${C.navy})`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes kdFadeIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes kdReveal { from { opacity: 0; transform: translateY(10px); letter-spacing: 0.3em; } to { opacity: 1; transform: translateY(0); letter-spacing: 0.04em; } }
        @keyframes kdGlow { 0%, 100% { filter: drop-shadow(0 0 6px ${C.accent}66); } 50% { filter: drop-shadow(0 0 22px ${C.accent}aa); } }
        @keyframes kdFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${C.accent}22, transparent)`,
      }} />

      <div style={{ animation: "kdFadeIn 0.6s ease-out forwards, kdGlow 2.2s ease-in-out 0.6s infinite" }}>
        <Logo size={72} showWordmark={false} />
      </div>

      <div style={{
        marginTop: 26, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, color: "#fff",
        letterSpacing: "0.04em", opacity: phase >= 1 ? 1 : 0,
        animation: phase >= 1 ? "kdReveal 0.7s ease-out forwards" : "none",
      }}>
        KAUSHAL<span style={{ color: C.accent }}>DRISHTI</span> AI
      </div>

      <div style={{
        marginTop: 12, fontSize: 14, color: C.navyTextMuted, letterSpacing: "0.02em",
        opacity: phase >= 2 ? 1 : 0, animation: phase >= 2 ? "kdFadeUp 0.6s ease-out forwards" : "none",
      }}>
        Tracking Skills. Measuring Impact. Building Futures.
      </div>

      <div style={{
        marginTop: 40, width: 160, height: 3, borderRadius: 3, background: C.navyBorder, overflow: "hidden",
        opacity: phase >= 1 ? 1 : 0,
      }}>
        <div style={{
          height: "100%", background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`,
          animation: phase >= 1 ? "kdSplashBar 1.6s ease-out forwards" : "none",
        }} />
      </div>
      <style>{`@keyframes kdSplashBar { from { width: 0%; } to { width: 100%; } }`}</style>
    </div>
  );
};

// ─── 2. Auth Page ─────────────────────────────────────────────────────────────
const AuthPage = ({ setPage, setSession }) => {
  const [role, setRole] = useState("trainee"); // "admin" | "trainee"
  const [traineeMethod, setTraineeMethod] = useState("otp"); // "otp" | "password" | "guest"

  // Admin fields
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");

  // Trainee — email/password
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Trainee — mobile OTP
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { id: "admin", icon: "🛡️", label: "Admin" },
    { id: "trainee", icon: "🎓", label: "Trainee" },
  ];

  const resetMessages = () => setError("");

  const handleAdminLogin = async () => {
    resetMessages(); setLoading(true);
    try {
      const res = await mockAuthApi.loginWithPassword(adminEmail, adminPass, "admin");
      setSession({
        role: "admin",
        guest: false,
        token: res.token,
        user: res.user,
      });
      setPage("gov-dashboard");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const handleSendOtp = async () => {
    resetMessages(); setLoading(true);
    try {
      await mockAuthApi.sendOtp(mobile);
      setOtpSent(true);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    resetMessages(); setLoading(true);
    try {
      await mockAuthApi.verifyOtp(mobile, otp);
      setSession({ role: "trainee", guest: false });
      setPage("skill-assessment");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const handleTraineePasswordLogin = async () => {
    resetMessages(); setLoading(true);
    try {
      await mockAuthApi.loginWithPassword(email, pass, "trainee");
      setSession({ role: "trainee", guest: false });
      setPage("skill-assessment");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const handleGuestLogin = async () => {
    resetMessages(); setLoading(true);
    try {
      await mockAuthApi.guestLogin();
      setSession({ role: "trainee", guest: true });
      setPage("guest-onboarding");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const traineeMethods = [
    { id: "otp", label: "Mobile OTP" },
    { id: "password", label: "Email & Password" },
    { id: "guest", label: "Guest" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Logo size={40} dark />
          </div>
          <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 8 }}>Secure Skilling Intelligence Platform</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 20, padding: "1.75rem" }}>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 10 }}>Select your role</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {roles.map(r => (
              <button key={r.id} onClick={() => { setRole(r.id); resetMessages(); }} style={{
                background: role === r.id ? C.accentSoft : "transparent",
                border: `1px solid ${role === r.id ? C.accent : C.border}`,
                borderRadius: 10, padding: "12px 8px", cursor: "pointer", textAlign: "center", transition: "all 0.15s"
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{r.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: role === r.id ? C.accentMid : C.textSecondary }}>{r.label}</div>
              </button>
            ))}
          </div>

          {role === "admin" && (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Email / Employee ID</div>
                <input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="officer@maharashtra.gov.in"
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Password</div>
                <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="••••••••"
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 12 }}>{error}</div>}
              <button onClick={handleAdminLogin} disabled={loading} style={{
                width: "100%", background: `linear-gradient(135deg, ${C.navy}, ${C.accent})`,
                color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600,
                cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Signing in…" : "Sign in as Admin"}
              </button>
            </>
          )}

          {role === "trainee" && (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                {traineeMethods.map(m => (
                  <Chip key={m.id} label={m.label} active={traineeMethod === m.id}
                    onClick={() => { setTraineeMethod(m.id); resetMessages(); setOtpSent(false); }} />
                ))}
              </div>

              {traineeMethod === "otp" && (
                <>
                  {!otpSent ? (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Mobile Number</div>
                        <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                          <span style={{ padding: "10px 12px", color: C.textMuted, fontSize: 14, borderRight: `1px solid ${C.border}` }}>+91</span>
                          <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210"
                            style={{ flex: 1, background: "transparent", border: "none", padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none" }} />
                        </div>
                      </div>
                      {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 12 }}>{error}</div>}
                      <button onClick={handleSendOtp} disabled={loading} style={{
                        width: "100%", background: `linear-gradient(135deg, ${C.navy}, ${C.accent})`,
                        color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600,
                        cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
                      }}>
                        {loading ? "Sending…" : "Send OTP"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 12, color: C.textSecondary, textAlign: "center", marginBottom: 14 }}>
                        Enter the 6-digit code sent to +91 {mobile}
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <OTPInput value={otp} onChange={setOtp} />
                      </div>
                      {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 12, textAlign: "center" }}>{error}</div>}
                      <button onClick={handleVerifyOtp} disabled={loading} style={{
                        width: "100%", background: `linear-gradient(135deg, ${C.navy}, ${C.accent})`,
                        color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600,
                        cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, marginBottom: 10,
                      }}>
                        {loading ? "Verifying…" : "Verify OTP"}
                      </button>
                      <div style={{ textAlign: "center" }}>
                        <button onClick={() => { setOtpSent(false); setOtp(""); }} style={{ background: "none", border: "none", color: C.accentMid, fontSize: 12, cursor: "pointer" }}>
                          Change number / Resend
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {traineeMethod === "password" && (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Email</div>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                      style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Password</div>
                    <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
                      style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 12 }}>{error}</div>}
                  <button onClick={handleTraineePasswordLogin} disabled={loading} style={{
                    width: "100%", background: `linear-gradient(135deg, ${C.navy}, ${C.accent})`,
                    color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600,
                    cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
                  }}>
                    {loading ? "Signing in…" : "Sign in"}
                  </button>
                  <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: C.textSecondary }}>
                    Don't have an account?{" "}
                    <button onClick={() => setPage("signup")} style={{ background: "none", border: "none", color: C.accentMid, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
                      Create one
                    </button>
                  </div>
                </>
              )}

              {traineeMethod === "guest" && (
                <>
                  <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, marginBottom: 18, textAlign: "center" }}>
                    Explore KaushalDrishti AI instantly — no account needed. You can optionally complete your skill profile afterwards.
                  </div>
                  {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 12, textAlign: "center" }}>{error}</div>}
                  <button onClick={handleGuestLogin} disabled={loading} style={{
                    width: "100%", background: C.surface, border: `1px solid ${C.border}`,
                    color: C.textPrimary, borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600,
                    cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
                  }}>
                    {loading ? "Entering…" : "Continue as Guest →"}
                  </button>
                </>
              )}
            </>
          )}

          <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: C.textMuted }}>
            Protected by MahaIT · DigiLocker Verified · ISO 27001
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 2b. Signup Page ──────────────────────────────────────────────────────────
const SignupPage = ({ setPage, setSession }) => {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const field = (label, input) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>{label}</div>
      {input}
    </div>
  );

  const inputStyle = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none", boxSizing: "border-box" };

  const handleSendOtp = async () => {
    setError(""); setLoading(true);
    try { await mockAuthApi.sendOtp(mobile); setOtpSent(true); }
    catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    setError(""); setLoading(true);
    try { await mockAuthApi.verifyOtp(mobile, otp); setMobileVerified(true); }
    catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const handleCreateAccount = async () => {
    setError("");
    if (!mobileVerified) { setError("Please verify your mobile number first"); return; }
    setLoading(true);
    try {
      await mockAuthApi.signup({ fullName, mobile, email, password, confirmPassword });
      setSession({ role: "trainee", guest: false });
      setPage("skill-assessment");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Logo size={38} dark />
          </div>
          <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 8 }}>Create your Trainee account</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 20, padding: "1.75rem" }}>
          {field("Full Name", <input style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />)}

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Mobile Number</div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                <span style={{ padding: "10px 12px", color: C.textMuted, fontSize: 14, borderRight: `1px solid ${C.border}` }}>+91</span>
                <input value={mobile} disabled={mobileVerified} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210"
                  style={{ flex: 1, background: "transparent", border: "none", padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none" }} />
              </div>
              {!mobileVerified && (
                <button onClick={handleSendOtp} disabled={loading || otpSent} style={{
                  background: C.accentSoft, border: `1px solid ${C.accent}`, color: C.accentMid,
                  borderRadius: 8, padding: "0 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  {otpSent ? "Sent" : "Send OTP"}
                </button>
              )}
              {mobileVerified && <Badge color={C.green}>✓ Verified</Badge>}
            </div>
          </div>

          {otpSent && !mobileVerified && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: C.textSecondary, textAlign: "center", marginBottom: 14 }}>
                Enter the 6-digit OTP sent to +91 {mobile}
              </div>
              <div style={{ marginBottom: 16 }}>
                <OTPInput value={otp} onChange={setOtp} />
              </div>
              {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 12, textAlign: "center" }}>{error}</div>}
              <button onClick={handleVerifyOtp} disabled={loading} style={{
                width: "100%", marginTop: 12, background: C.navy, color: "#fff", border: "none",
                borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
            </div>
          )}

          {field("Email", <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />)}
          {field("Password", <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />)}
          {field("Confirm Password", <input style={inputStyle} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />)}

          {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 12 }}>{error}</div>}

          <button onClick={handleCreateAccount} disabled={loading} style={{
            width: "100%", background: `linear-gradient(135deg, ${C.navy}, ${C.accent})`,
            color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600,
            cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4,
          }}>
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: C.textSecondary }}>
            Already have an account?{" "}
            <button onClick={() => setPage("auth")} style={{ background: "none", border: "none", color: C.accentMid, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 2c. Guest Onboarding (optional) ─────────────────────────────────────────
const GuestOnboarding = ({ setPage }) => (
  <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ width: "100%", maxWidth: 480, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 20, padding: "2.25rem", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Welcome, Guest!</div>
      <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7, marginBottom: 28 }}>
        You're in. Want a personalized employability profile? Fill a quick skill assessment — or skip it and explore the dashboard right away.
      </div>
      <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
        <button onClick={() => setPage("skill-assessment")} style={{
          background: `linear-gradient(135deg, ${C.navy}, ${C.accent})`, color: "#fff", border: "none",
          borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>
          Fill Skill Assessment →
        </button>
        <button onClick={() => setPage("gov-dashboard")} style={{
          background: "transparent", color: C.textSecondary, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>
          Skip for now
        </button>
      </div>
    </div>
  </div>
);

// ─── 2d. Skill Assessment Form ────────────────────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(n => (
      <span key={n} onClick={() => onChange(n)} style={{ cursor: "pointer", fontSize: 15, color: n <= value ? C.gold : C.border }}>★</span>
    ))}
  </div>
);

const SkillAssessmentForm = ({ setPage, onComplete, allowSkip = true }) => {
  const [step, setStep] = useState(0); // 0 personal, 1 technical, 2 soft skills, 3 review
  const [personal, setPersonal] = useState({ name: "", age: "", education: "", district: "", courseCompleted: "" });
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState({}); // { skillName: rating }
  const [selectedSoft, setSelectedSoft] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const allTechSkills = SKILL_CATEGORIES.flatMap(c => c.skills.map(s => ({ skill: s, category: c.label })));
  const filteredSkills = search
    ? allTechSkills.filter(s => s.skill.toLowerCase().includes(search.toLowerCase()))
    : allTechSkills;

  const toggleSkill = (name) => {
    setSelectedSkills(prev => {
      const next = { ...prev };
      if (next[name] !== undefined) delete next[name];
      else next[name] = 3;
      return next;
    });
  };

  const toggleSoft = (name) => {
    setSelectedSoft(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

  const steps = ["Personal Info", "Technical Skills", "Soft Skills", "Review & Submit"];

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const payload = {
        personal,
        skills: Object.entries(selectedSkills).map(([name, rating]) => ({ name, rating })),
        softSkills: selectedSoft,
      };

      const result = await mockSkillApi.submitAssessment(payload);
      onComplete(result);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "40px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <Logo size={32} dark showWordmark={false} />
        </div>
        <div style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>Trainee Skill Assessment</div>
        <div style={{ textAlign: "center", fontSize: 13, color: C.textSecondary, marginBottom: 28 }}>
          Helps us generate your AI employability profile
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center", flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <div key={s} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20,
              background: i === step ? C.accentSoft : "transparent",
              border: `1px solid ${i <= step ? C.accent : C.border}`,
              color: i <= step ? C.accentMid : C.textMuted, fontSize: 12, fontWeight: i === step ? 600 : 400,
            }}>
              <span>{i + 1}</span> {s}
            </div>
          ))}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 20, padding: "2rem" }}>
          {step === 0 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Name</div>
                  <input style={inputStyle} value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} placeholder="Full name" />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Age</div>
                  <input style={inputStyle} type="number" value={personal.age} onChange={e => setPersonal({ ...personal, age: e.target.value })} placeholder="e.g. 22" />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Education</div>
                  <input style={inputStyle} value={personal.education} onChange={e => setPersonal({ ...personal, education: e.target.value })} placeholder="e.g. B.Sc IT" />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>District</div>
                  <input style={inputStyle} value={personal.district} onChange={e => setPersonal({ ...personal, district: e.target.value })} placeholder="e.g. Pune" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Course Completed</div>
                  <input style={inputStyle} value={personal.courseCompleted} onChange={e => setPersonal({ ...personal, courseCompleted: e.target.value })} placeholder="e.g. Data Analytics" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <input style={{ ...inputStyle, marginBottom: 16 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills (e.g. Python, React, AWS)…" />
              <div style={{ maxHeight: 340, overflowY: "auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {filteredSkills.map(({ skill }) => (
                  <Chip key={skill} label={skill} active={selectedSkills[skill] !== undefined} onClick={() => toggleSkill(skill)} />
                ))}
                {filteredSkills.length === 0 && <div style={{ fontSize: 13, color: C.textMuted }}>No skills match "{search}"</div>}
              </div>
              {Object.keys(selectedSkills).length > 0 && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>Rate your proficiency</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {Object.entries(selectedSkills).map(([name, rating]) => (
                      <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: C.textPrimary }}>{name}</span>
                        <StarRating value={rating} onChange={v => setSelectedSkills(prev => ({ ...prev, [name]: v }))} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: Object.values(selectedSoft).length ? 20 : 0 }}>
                {SOFT_SKILLS.map(s => (
                  <label key={s} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10,
                    border: `1px solid ${selectedSoft.includes(s) ? C.accent : C.border}`,
                    background: selectedSoft.includes(s) ? C.accentSoft : "transparent", cursor: "pointer",
                  }}>
                    <input type="checkbox" checked={selectedSoft.includes(s)} onChange={() => toggleSoft(s)} />
                    <span style={{ fontSize: 13, color: C.textPrimary }}>{s}</span>
                  </label>
                ))}
              </div>
              {selectedSoft.length > 0 && (
                <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>Rate yourself</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {selectedSoft.map(name => (
                      <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: C.textPrimary }}>{name}</span>
                        <StarRating value={3} onChange={() => {}} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 16 }}>Review your details before submitting</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <div><strong style={{ color: C.textPrimary }}>Name:</strong> {personal.name || "—"}</div>
                <div><strong style={{ color: C.textPrimary }}>District:</strong> {personal.district || "—"}</div>
                <div><strong style={{ color: C.textPrimary }}>Course:</strong> {personal.courseCompleted || "—"}</div>
                <div><strong style={{ color: C.textPrimary }}>Technical Skills:</strong> {Object.keys(selectedSkills).length || 0} selected</div>
                <div><strong style={{ color: C.textPrimary }}>Soft Skills:</strong> {selectedSoft.length} selected</div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            <div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textSecondary, borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer" }}>
                  ← Back
                </button>
              )}
              {step === 0 && allowSkip && (
                <button onClick={() => setPage("gov-dashboard")} style={{ background: "transparent", border: "none", color: C.textMuted, fontSize: 13, cursor: "pointer" }}>
                  Skip for now
                </button>
              )}
            </div>
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} style={{
                background: `linear-gradient(135deg, ${C.navy}, ${C.accent})`, color: "#fff", border: "none",
                borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1,
              }}>
                {submitting ? "Generating profile…" : "Submit & Generate Profile"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 2e. Skill Profile Result ─────────────────────────────────────────────────
const SkillProfileResult = ({ result, setPage }) => {
  if (!result) return null;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "40px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>Your AI Skill Profile</div>
          <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>Generated from your assessment responses</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <KPICard icon="📈" label="Skill Score" value={`${result.skillScore}/100`} color={C.accent} />
          <KPICard icon="💼" label="Employability Score" value={`${result.employabilityScore}/100`} color={C.gold} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <GlassCard>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 12 }}>💪 Strong Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {result.strongSkills.length ? result.strongSkills.map(s => <Badge key={s} color={C.green}>{s}</Badge>) : <span style={{ fontSize: 12, color: C.textMuted }}>None selected</span>}
            </div>
          </GlassCard>
          <GlassCard>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 12 }}>🎯 Missing / Recommended Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {result.missingSkills.map(s => <Badge key={s} color={C.red}>{s}</Badge>)}
            </div>
          </GlassCard>
        </div>

        <GlassCard style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>📚 Recommended Learning Path</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.recommendedPath.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.accentSoft, color: C.accentMid, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: C.textSecondary }}>{step}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => setPage("gov-dashboard")} style={{
            background: `linear-gradient(135deg, ${C.navy}, ${C.accent})`, color: "#fff", border: "none",
            borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            Continue to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── 3. Government Dashboard ──────────────────────────────────────────────────
const GovDashboard = () => {
  const kpis = [
    { icon: "👥", label: "Total Students Trained", value: "2,41,840", sub: "FY 2024–25", color: C.accent, trend: 18 },
    { icon: "✅", label: "Verified Employment Rate", value: "71.4%", sub: "of placed students", color: C.green, trend: 6 },
    { icon: "🏢", label: "Active Employers", value: "1,284", sub: "across 34 districts", color: C.purple, trend: 22 },
    { icon: "💰", label: "Avg Annual Salary", value: "₹4.1L", sub: "verified CTC", color: C.amber, trend: 12 },
    { icon: "📍", label: "District Coverage", value: "34/36", sub: "operational", color: C.cyan, trend: 4 },
    { icon: "⚠️", label: "Skill Gap Cases", value: "18,420", sub: "requiring intervention", color: C.red, trend: -8 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.02em" }}>Government Intelligence Dashboard</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>Maharashtra Skilling Initiative · Real-time Analytics · FY 2024–25</div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {kpis.map(k => <KPICard key={k.label} {...k} />)}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>Employment Trend — FY 2024–25</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Monthly trained vs placed vs verified students</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={employmentTrend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF0" />
              <XAxis dataKey="month" stroke={C.textMuted} fontSize={11} />
              <YAxis stroke={C.textMuted} fontSize={11} />
              <Tooltip content={<Tooltip_Custom />} />
              <Area type="monotone" dataKey="trained" stroke={C.accent} fill="url(#g1)" name="Trained" strokeWidth={2} />
              <Area type="monotone" dataKey="placed" stroke={C.green} fill="url(#g2)" name="Placed" strokeWidth={2} />
              <Line type="monotone" dataKey="verified" stroke={C.amber} strokeWidth={2} dot={false} name="Verified" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>Verification Breakdown</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>Employment confirmation status</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={verificationStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {verificationStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<Tooltip_Custom />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
            {verificationStatus.map(v => (
              <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: v.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: C.textSecondary }}>{v.name} {v.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>District Placement Rates</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>Top 8 districts by verified placement</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={districtData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF0" horizontal={false} />
              <XAxis type="number" stroke={C.textMuted} fontSize={11} domain={[0, 100]} />
              <YAxis type="category" dataKey="district" stroke={C.textMuted} fontSize={11} width={80} />
              <Tooltip content={<Tooltip_Custom />} />
              <Bar dataKey="rate" fill={C.accent} name="Placement %" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>Skill Demand vs Supply</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>Critical gaps requiring intervention</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillDemand.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF0" />
              <XAxis dataKey="skill" stroke={C.textMuted} fontSize={9} angle={-30} textAnchor="end" height={50} />
              <YAxis stroke={C.textMuted} fontSize={11} />
              <Tooltip content={<Tooltip_Custom />} />
              <Bar dataKey="demand" fill={C.accent} name="Demand" radius={[4, 4, 0, 0]} />
              <Bar dataKey="supply" fill={C.green} name="Supply" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Training Center Performance */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Training Center Performance</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Center Name", "Students Trained", "Students Placed", "Placement Rate", "Rating"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: C.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {centerPerformance.map((c, i) => (
                <tr key={c.center} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: C.textPrimary, fontWeight: 500 }}>{c.center}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: C.textSecondary }}>{c.students.toLocaleString()}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: C.textSecondary }}>{c.placed.toLocaleString()}</td>
                  <td style={{ padding: "12px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <ProgressBar value={Math.round(c.placed / c.students * 100)} color={c.placed / c.students > 0.7 ? C.green : c.placed / c.students > 0.5 ? C.amber : C.red} />
                      <span style={{ fontSize: 12, color: C.textSecondary, minWidth: 34 }}>{Math.round(c.placed / c.students * 100)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 12px" }}>
                    <Badge color={c.rating >= 4.5 ? C.green : c.rating >= 4 ? C.amber : C.red}>{c.rating} ⭐</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* District Heatmap (Text-based) */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem", marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>Maharashtra District Skill Gap Heatmap</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Color intensity indicates skill gap severity · Click district for details</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {[
            { d: "Mumbai", g: 18 }, { d: "Thane", g: 22 }, { d: "Pune", g: 12 }, { d: "Nashik", g: 28 }, { d: "Aurangabad", g: 31 }, { d: "Nagpur", g: 22 },
            { d: "Solapur", g: 35 }, { d: "Kolhapur", g: 38 }, { d: "Satara", g: 30 }, { d: "Sangli", g: 32 }, { d: "Latur", g: 44 }, { d: "Nanded", g: 40 },
            { d: "Raigad", g: 26 }, { d: "Ratnagiri", g: 42 }, { d: "Sindhudurg", g: 46 }, { d: "Jalgaon", g: 33 }, { d: "Dhule", g: 36 }, { d: "Nandurbar", g: 48 },
            { d: "Ahmednagar", g: 29 }, { d: "Beed", g: 38 }, { d: "Osmanabad", g: 44 }, { d: "Jalna", g: 39 }, { d: "Parbhani", g: 41 }, { d: "Hingoli", g: 43 },
          ].map(({ d, g }) => {
            const intensity = g / 50;
            const r = Math.round(239 * intensity + 99 * (1 - intensity));
            const gr = Math.round(68 * intensity + 102 * (1 - intensity));
            const b = Math.round(68 * intensity + 241 * (1 - intensity));
            return (
              <div key={d} style={{
                background: `rgba(${r},${gr},${b},0.2)`,
                border: `1px solid rgba(${r},${gr},${b},0.4)`,
                borderRadius: 8, padding: "8px 6px", textAlign: "center", cursor: "pointer"
              }}>
                <div style={{ fontSize: 10, color: C.textSecondary, fontWeight: 500 }}>{d}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: `rgb(${r},${gr},${b})`, marginTop: 2 }}>{g}% gap</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.textMuted }}>Gap scale:</span>
          {[["Low (0–20%)", C.accent], ["Moderate (20–35%)", C.amber], ["High (35–50%)", C.red]].map(([label, color]) => (
            <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.6 }} />
              <span style={{ fontSize: 11, color: C.textSecondary }}>{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── 4. Employment Tracking ───────────────────────────────────────────────────
const EmploymentTracking = () => {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Employed", "Self Employed", "Apprentice", "Unemployed", "Awaiting"];
  const filtered = filter === "All" ? employmentTrackingData : employmentTrackingData.filter(r => r.status === filter);

  const summaryStats = [
    { label: "WhatsApp Response Rate", value: "68%", color: C.green },
    { label: "LinkedIn Verified", value: "52%", color: C.accent },
    { label: "Follow-up Completed", value: "61%", color: C.cyan },
    { label: "Avg Response Time", value: "3.2 days", color: C.amber },
  ];

  const whatsappRate = [
    { month: "Apr", rate: 54 }, { month: "May", rate: 61 }, { month: "Jun", rate: 65 },
    { month: "Jul", rate: 68 }, { month: "Aug", rate: 72 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>Employment Tracking</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>Real-time outcome verification for all trained students</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {summaryStats.map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 12, padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>WhatsApp Response Rate Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={whatsappRate}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF0" />
              <XAxis dataKey="month" stroke={C.textMuted} fontSize={11} />
              <YAxis stroke={C.textMuted} fontSize={11} />
              <Tooltip content={<Tooltip_Custom />} />
              <Area type="monotone" dataKey="rate" stroke={C.green} fill="url(#wg)" name="Response %" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Employment Status Distribution</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {[
              { s: "Employed", count: 1420, pct: 58.9, color: C.green },
              { s: "Self Employed", count: 284, pct: 11.8, color: C.cyan },
              { s: "Apprentice", count: 192, pct: 8.0, color: C.accent },
              { s: "Unemployed", count: 312, pct: 12.9, color: C.red },
              { s: "Awaiting Verification", count: 200, pct: 8.3, color: C.amber },
            ].map(s => (
              <div key={s.s}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.textSecondary }}>{s.s}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.count} ({s.pct}%)</span>
                </div>
                <ProgressBar value={s.pct} color={s.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {statuses.map(s => <Chip key={s} label={s} active={filter === s} onClick={() => setFilter(s)} />)}
      </div>

      {/* Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.surface }}>
                {["ID", "Student", "District", "Course", "Status", "Employer", "Salary", "WhatsApp", "LinkedIn", "Follow-up"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: C.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: C.textMuted, fontFamily: "monospace" }}>{r.id}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: C.textPrimary, fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: C.textSecondary }}>{r.district}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: C.textSecondary }}>{r.course}</td>
                  <td style={{ padding: "12px 14px" }}><StatusDot status={r.status} /></td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: C.textSecondary }}>{r.employer}</td>
                  <td style={{ padding: "12px 14px" }}><Badge color={r.salary !== "—" ? C.green : C.textMuted}>{r.salary}</Badge></td>
                  <td style={{ padding: "12px 14px" }}>
                    <Badge color={r.whatsapp === "Responded" ? C.green : C.red}>{r.whatsapp === "Responded" ? "✓" : "✗"}</Badge>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Badge color={r.linkedin === "Verified" ? C.accent : r.linkedin === "Pending" ? C.amber : C.red}>
                      {r.linkedin}
                    </Badge>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Badge color={r.followup === "Completed" ? C.green : r.followup === "Overdue" ? C.red : C.amber}>{r.followup}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── 5. Skill Gap Intelligence ────────────────────────────────────────────────
const SkillGapIntelligence = () => {
  const [search, setSearch] = useState("");
  const [distFilter, setDistFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");

  const districts = ["All", "Pune", "Mumbai", "Nagpur", "Aurangabad", "Nashik", "Latur"];
  const sectors = ["All", "IT/ITES", "Automotive", "Manufacturing", "Agriculture", "BFSI", "Healthcare"];

  const filtered = skillGapData.filter(s =>
    (search === "" || s.skill.toLowerCase().includes(search.toLowerCase())) &&
    (distFilter === "All" || s.district === distFilter) &&
    (sectorFilter === "All" || s.sector === sectorFilter)
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>Skill Gap Intelligence</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>District and sector-wise skill demand-supply analysis</div>
      </div>

      {/* Filters */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 14, padding: "1rem 1.25rem", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search skill..."
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", color: C.textPrimary, fontSize: 13, outline: "none", minWidth: 200 }} />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: C.textMuted, alignSelf: "center" }}>District:</span>
            {districts.slice(0, 5).map(d => <Chip key={d} label={d} active={distFilter === d} onClick={() => setDistFilter(d)} color={C.cyan} />)}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: C.textMuted, alignSelf: "center" }}>Sector:</span>
            {sectors.slice(0, 5).map(s => <Chip key={s} label={s} active={sectorFilter === s} onClick={() => setSectorFilter(s)} color={C.purple} />)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Top Skill Gaps by Severity</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillDemand} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF0" horizontal={false} />
              <XAxis type="number" stroke={C.textMuted} fontSize={11} domain={[0, 100]} />
              <YAxis type="category" dataKey="skill" stroke={C.textMuted} fontSize={10} width={100} />
              <Tooltip content={<Tooltip_Custom />} />
              <Bar dataKey="demand" fill={C.red} name="Demand" opacity={0.8} radius={[0, 4, 4, 0]} />
              <Bar dataKey="supply" fill={C.green} name="Supply" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Industry Demand Analysis</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={[
              { sector: "IT/ITES", demand: 94 }, { sector: "Automotive", demand: 72 },
              { sector: "BFSI", demand: 68 }, { sector: "Healthcare", demand: 61 },
              { sector: "Manufacturing", demand: 78 }, { sector: "Agriculture", demand: 55 },
            ]}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="sector" tick={{ fill: C.textMuted, fontSize: 11 }} />
              <Radar name="Demand Index" dataKey="demand" stroke={C.accent} fill={C.accent} fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Gap Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {filtered.map(s => (
          <div key={s.skill} style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 14, padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>{s.skill}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{s.district} · {s.sector}</div>
              </div>
              <Badge color={s.priority === "Critical" ? C.red : s.priority === "High" ? C.amber : C.green}>{s.priority}</Badge>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.textMuted }}>Demand</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.red }}>{s.demand} openings</span>
              </div>
              <ProgressBar value={100} color={C.red} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.textMuted }}>Supply</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>{s.supply} skilled</span>
              </div>
              <ProgressBar value={Math.round(s.supply / s.demand * 100)} color={C.green} />
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.textMuted }}>Gap index</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: s.priority === "Critical" ? C.red : C.amber }}>{s.gap}%</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: C.textMuted }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>No skill gaps matching your filters</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting the district or sector filter</div>
        </div>
      )}
    </div>
  );
};

// ─── 6. AI Skill Readiness Analyzer ─────────────────────────────────────────
const AISkillAnalyzer = () => {
  const [course, setCourse] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!course.trim()) return;
    setLoading(true);
    setResult(null);

    const prompt = `You are an AI skill readiness analyzer for Maharashtra's government skilling platform. A student has completed: "${course}" and has these skills: "${skills || "basic computing"}".

Analyze and return a JSON object with:
- employabilityScore: number 0-100
- grade: "Excellent" | "Good" | "Fair" | "Needs Work"
- matchedSkills: array of 4-6 matched skills
- missingSkills: array of 4-6 missing skills  
- recommendedCourses: array of 3 courses with name and duration
- industryFit: array of 3 industries with name and fitScore (0-100)
- salaryRange: string like "₹3.2L – ₹5.8L"
- summary: 2 sentence analysis

Return ONLY valid JSON, no markdown.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (e) {
      setResult({
        employabilityScore: 74, grade: "Good",
        matchedSkills: ["Python Basics", "Data Analysis", "Excel Advanced", "SQL Fundamentals", "Power BI"],
        missingSkills: ["Machine Learning", "Cloud Platforms", "Statistical Modeling", "API Integration", "Docker"],
        recommendedCourses: [
          { name: "ML Fundamentals — NASSCOM Certified", duration: "3 months" },
          { name: "AWS Cloud Practitioner", duration: "6 weeks" },
          { name: "Advanced Data Science — PMKVY", duration: "4 months" }
        ],
        industryFit: [{ name: "IT/ITES", fitScore: 82 }, { name: "BFSI Analytics", fitScore: 71 }, { name: "E-commerce", fitScore: 64 }],
        salaryRange: "₹3.5L – ₹5.2L",
        summary: `Strong foundation in data analysis tools. Adding ML and cloud skills could increase employability by ~18% and target ₹5L+ roles at top-tier employers in Maharashtra's IT corridor.`
      });
    }
    setLoading(false);
  };

  const scoreColor = s => s >= 80 ? C.green : s >= 60 ? C.amber : C.red;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>AI Skill Readiness Analyzer</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>Powered by Claude · Instant employability assessment</div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Course Completed *</div>
            <input value={course} onChange={e => setCourse(e.target.value)}
              placeholder="e.g. Data Analytics (PMKVY Level 3)"
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Certified Skills (comma-separated)</div>
            <input value={skills} onChange={e => setSkills(e.target.value)}
              placeholder="e.g. Python, SQL, Excel, Power BI"
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
        <button onClick={analyze} disabled={loading || !course.trim()} style={{
          background: loading ? C.textMuted : `linear-gradient(135deg, ${C.navy}, ${C.accent})`,
          color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600,
          cursor: loading || !course.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8
        }}>
          {loading ? "⚡ Analyzing with AI..." : "🤖 Analyze Readiness"}
        </button>
        {!course.trim() && <div style={{ fontSize: 11, color: C.red, marginTop: 8 }}>Please enter the course completed</div>}
      </div>

      {loading && (
        <div style={{ display: "grid", gap: 12 }}>
          {[120, 200, 160].map((h, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
              <Skeleton h={h} r={10} />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Score Card */}
          <div style={{ background: C.card, border: `1px solid ${scoreColor(result.employabilityScore)}44`, borderRadius: 16, padding: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: `conic-gradient(${scoreColor(result.employabilityScore)} ${result.employabilityScore * 3.6}deg, #E2E8F0 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ width: 76, height: 76, borderRadius: "50%", background: C.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor(result.employabilityScore) }}>{result.employabilityScore}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>/ 100</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary }}>Employability Score: <span style={{ color: scoreColor(result.employabilityScore) }}>{result.grade}</span></div>
                <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 6, lineHeight: 1.6 }}>{result.summary}</div>
                <div style={{ marginTop: 12 }}>
                  <Badge color={C.green}>Salary Range: {result.salaryRange}</Badge>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Industry Fit</div>
                {result.industryFit?.map(ind => (
                  <div key={ind.name} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: C.textSecondary }}>{ind.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: scoreColor(ind.fitScore) }}>{ind.fitScore}%</span>
                    </div>
                    <div style={{ width: 140 }}><ProgressBar value={ind.fitScore} color={scoreColor(ind.fitScore)} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Matched Skills */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.green, marginBottom: 14 }}>✅ Matched Skills</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.matchedSkills?.map(s => (
                  <div key={s} style={{ background: C.greenSoft, border: `1px solid ${C.green}30`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: C.textPrimary }}>
                    ✓ {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.red, marginBottom: 14 }}>⚠️ Missing Skills</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.missingSkills?.map(s => (
                  <div key={s} style={{ background: C.redSoft, border: `1px solid ${C.red}30`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: C.textPrimary }}>
                    ✗ {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Courses */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 14 }}>📚 Recommended Courses</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {result.recommendedCourses?.map((c, i) => (
                <div key={i} style={{ background: C.accentSoft, border: `1px solid ${C.accent}33`, borderRadius: 10, padding: "14px" }}>
                  <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 4 }}>COURSE {i + 1}</div>
                  <div style={{ fontSize: 13, color: C.textPrimary, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>⏱ {c.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── 7. AI Policy Copilot ─────────────────────────────────────────────────────
const AIPolicyCopilot = () => {
  const [messages, setMessages] = useState(chatHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const examples = [
    "Which districts have low placement rates?",
    "What skills are most critically missing?",
    "Which training centers need intervention?",
  ];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    const systemPrompt = `You are KaushalDrishti AI Policy Copilot for the Government of Maharashtra's skilling platform. You analyze employment outcomes, skill gaps, and training center performance. 

Key data context:
- 2,41,840 students trained in FY 2024-25
- 34 districts covered, Latur and Osmanabad have lowest placement (44-48%)
- AI/ML, Drone Tech, Cloud Architecture are most critical skill gaps
- PMKVY Latur needs urgent intervention (60% placement, 3.1/5 rating)
- WhatsApp response rate: 68%, LinkedIn verification: 52%
- Average verified salary: ₹4.1L annually

Respond with clear, actionable insights. Use bullet points and specific numbers. Keep responses focused on Maharashtra skilling policy.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: systemPrompt,
          messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: "user", content: q }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I encountered an error. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      const key = q.toLowerCase();
      const resp = Object.keys(aiResponses).find(k => key.includes(k));
      setMessages(prev => [...prev, {
        role: "assistant",
        content: resp ? aiResponses[resp].text : "Based on Maharashtra skilling data, I can see several areas requiring attention. Could you be more specific about which district, skill, or metric you'd like to explore?"
      }]);
    }
    setLoading(false);
  };

  const formatMsg = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("- **")) {
        return <div key={i} style={{ display: "flex", gap: 8, margin: "4px 0" }}>
          <span style={{ color: C.accent }}>•</span>
          <span dangerouslySetInnerHTML={{ __html: line.replace(/- \*\*(.+?)\*\*/g, '- <strong style="color:#0F2C59">$1</strong>') }} />
        </div>;
      }
      if (line.startsWith("**")) {
        return <div key={i} style={{ fontWeight: 700, color: C.textPrimary, margin: "8px 0 4px" }}
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />;
      }
      if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
      return <div key={i} style={{ margin: "2px 0" }}
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#0F2C59">$1</strong>') }} />;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>AI Policy Copilot</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>Ask anything about Maharashtra's skilling data — Powered by Claude AI</div>
      </div>

      {/* Example prompts */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {examples.map(e => (
          <button key={e} onClick={() => send(e)} style={{
            background: C.accentSoft, border: `1px solid ${C.accent}33`, borderRadius: 8,
            padding: "7px 14px", fontSize: 12, color: C.accentMid, cursor: "pointer"
          }}>{e}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, paddingRight: 4, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accentSoft, border: `1px solid ${C.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 10, marginTop: 4 }}>🤖</div>
            )}
            <div style={{
              maxWidth: "80%", background: m.role === "user" ? C.accentSoft : C.card,
              border: `1px solid ${m.role === "user" ? C.accent + "44" : C.border}`,
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "12px 16px", fontSize: 13, color: C.textSecondary, lineHeight: 1.65
            }}>
              {m.role === "user" ? m.content : formatMsg(m.content)}
              {m.role === "assistant" && (
                <div style={{ marginTop: 10, fontSize: 11, color: C.textMuted, borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", gap: 10 }}>
                  <span>📊 Based on live Maharashtra skilling data</span>
                  <span>·</span>
                  <span>KaushalDrishti AI</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: "16px 16px 16px 4px", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, opacity: 0.5, animation: `pulse 1.2s ${d}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask about district performance, skill gaps, policy insights..."
          style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 12, padding: "12px 16px", color: C.textPrimary, fontSize: 14, outline: "none" }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          background: input.trim() ? C.accent : C.textMuted, color: "#fff", border: "none",
          borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer"
        }}>→</button>
      </div>
    </div>
  );
};

// ─── 8. Employer Verification Portal ─────────────────────────────────────────
const EmployerPortal = () => {
  const [confirmed, setConfirmed] = useState({});
  const candidates = [
    { id: "KD001", name: "Priya Sharma", course: "Data Analytics", batch: "Jul 2024", district: "Pune", center: "MSSDS Pune", salary: "₹4.2L – ₹5.0L", role: "Data Analyst Trainee", status: "pending" },
    { id: "KD004", name: "Amit Deshmukh", course: "Full Stack Development", batch: "Jun 2024", district: "Nashik", center: "KVIC Nashik", salary: "₹3.5L – ₹4.5L", role: "Junior Developer", status: "pending" },
    { id: "KD007", name: "Meera Gaikwad", course: "Cloud Computing", batch: "Aug 2024", district: "Nagpur", center: "ITI Nagpur", salary: "₹4.0L – ₹5.5L", role: "Cloud Support Engineer", status: "pending" },
  ];

  const handleAction = (id, action) => setConfirmed(prev => ({ ...prev, [id]: action }));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>Employer Verification Portal</div>
          <Badge color={C.green}>Secure Link ✓</Badge>
        </div>
        <div style={{ fontSize: 14, color: C.textSecondary }}>Verify employment status for candidates from your recent hiring batch</div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: 24, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ fontSize: 28 }}>🏢</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>TechMahindra Ltd — HR Verification Panel</div>
          <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>Batch ID: TM-MH-2024-AUG · 3 candidates pending verification · Expires in 72 hours</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Badge color={C.amber}>3 Pending</Badge>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {candidates.map(c => {
          const action = confirmed[c.id];
          return (
            <div key={c.id} style={{
              background: C.card,
              border: `1px solid ${action === "confirm" ? C.green + "60" : action === "reject" ? C.red + "60" : C.border}`,
              borderRadius: 16, padding: "1.5rem",
              opacity: action ? 0.8 : 1
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: C.accent }}>
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: C.textPrimary }}>{c.name}</span>
                    <Badge color={C.accent}>{c.id}</Badge>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: "6px 24px", fontSize: 12, color: C.textSecondary }}>
                    <span>📚 {c.course}</span>
                    <span>📍 {c.district}</span>
                    <span>🎓 {c.center}</span>
                    <span>📅 Batch: {c.batch}</span>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ background: C.greenSoft, border: `1px solid ${C.green}33`, borderRadius: 8, padding: "6px 12px" }}>
                      <span style={{ fontSize: 11, color: C.textMuted }}>Salary Range</span>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{c.salary}</div>
                    </div>
                    <div style={{ background: C.accentSoft, border: `1px solid ${C.accent}33`, borderRadius: 8, padding: "6px 12px" }}>
                      <span style={{ fontSize: 11, color: C.textMuted }}>Proposed Role</span>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.accentMid }}>{c.role}</div>
                    </div>
                  </div>
                </div>
                <div>
                  {action ? (
                    <div style={{ textAlign: "center", padding: "12px 20px" }}>
                      {action === "confirm" ? (
                        <div style={{ color: C.green, fontWeight: 700, fontSize: 15 }}>✅ Employment Confirmed</div>
                      ) : (
                        <div style={{ color: C.red, fontWeight: 700, fontSize: 15 }}>❌ Employment Rejected</div>
                      )}
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Recorded · Gov. notified</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button onClick={() => handleAction(c.id, "confirm")} style={{
                        background: C.greenSoft, border: `1px solid ${C.green}44`, color: C.green,
                        borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
                      }}>✅ Confirm Employment</button>
                      <button onClick={() => handleAction(c.id, "reject")} style={{
                        background: C.redSoft, border: `1px solid ${C.red}44`, color: C.red,
                        borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer"
                      }}>✗ Reject / Not Hired</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 12, padding: "1rem 1.25rem", marginTop: 20, fontSize: 12, color: C.textMuted }}>
        🔒 This portal is encrypted and compliant with Maharashtra IT Act 2023. Verification records are immutably logged on GovChain. Any misrepresentation is subject to legal action under Section 12 of MSDE regulations.
      </div>
    </div>
  );
};

// ─── 9. Training Center Dashboard ─────────────────────────────────────────────
const TrainingDashboard = () => {
  const myCenter = { name: "MSSDS Pune (Maharashtra State Skill Development Society)", batch: "AUG 2024", id: "TC-PUN-042" };
  const myMetrics = [
    { icon: "📈", label: "Placement Rate", value: "82.3%", color: C.green, trend: 5 },
    { icon: "👥", label: "Students Trained", value: "1,240", color: C.accent, trend: 14 },
    { icon: "✅", label: "Verification Rate", value: "89.1%", color: C.cyan, trend: 8 },
    { icon: "⚠️", label: "Skill Gap Cases", value: "142", color: C.amber, trend: -12 },
  ];

  const batchData = [
    { batch: "Q1 FY25", enrolled: 280, completed: 258, placed: 212, verified: 194 },
    { batch: "Q2 FY25", enrolled: 320, completed: 296, placed: 246, verified: 218 },
    { batch: "Q3 FY25", enrolled: 360, completed: 334, placed: 280, verified: 246 },
    { batch: "Q4 FY25", enrolled: 280, completed: 250, placed: 200, verified: 165 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>Training Center Dashboard</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>{myCenter.name} · {myCenter.id}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {myMetrics.map(m => <KPICard key={m.label} {...m} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Batch Performance Overview</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={batchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF0" />
              <XAxis dataKey="batch" stroke={C.textMuted} fontSize={11} />
              <YAxis stroke={C.textMuted} fontSize={11} />
              <Tooltip content={<Tooltip_Custom />} />
              <Bar dataKey="enrolled" fill={`${C.navy}30`} name="Enrolled" radius={[4, 4, 0, 0]} />
              <Bar dataKey="placed" fill={C.accent} name="Placed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="verified" fill={C.green} name="Verified" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 14 }}>Center Health Score</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Curriculum Quality", score: 88, color: C.green },
              { label: "Trainer Performance", score: 91, color: C.green },
              { label: "Industry Alignment", score: 76, color: C.amber },
              { label: "Infrastructure", score: 82, color: C.green },
              { label: "Employer Relationships", score: 71, color: C.amber },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: C.textSecondary }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.score}%</span>
                </div>
                <ProgressBar value={s.score} color={s.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Recent Batch Students</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Student", "Course", "Completion", "Placement Status", "Salary"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employmentTrackingData.slice(0, 5).map(r => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "11px 12px", fontSize: 13, color: C.textPrimary, fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: "11px 12px", fontSize: 12, color: C.textSecondary }}>{r.course}</td>
                <td style={{ padding: "11px 12px" }}><Badge color={C.green}>Completed</Badge></td>
                <td style={{ padding: "11px 12px" }}><StatusDot status={r.status} /></td>
                <td style={{ padding: "11px 12px" }}><span style={{ fontSize: 13, fontWeight: 600, color: r.salary !== "—" ? C.green : C.textMuted }}>{r.salary}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Skill Gap Cases */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 16, padding: "1.5rem", marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>Skill Gap Alerts for My Center</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>Students whose certified skills don't match current job market demand</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { skill: "Machine Learning", count: 48, action: "Enroll in NASSCOM ML track" },
            { skill: "Cloud Platforms", count: 36, action: "AWS/Azure bridge course" },
            { skill: "DevOps Tools", count: 28, action: "Docker & Kubernetes add-on" },
          ].map(g => (
            <div key={g.skill} style={{ background: C.amberSoft, border: `1px solid ${C.amber}33`, borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.amber }}>{g.count} students</div>
              <div style={{ fontSize: 13, color: C.textPrimary, margin: "4px 0" }}>Missing: {g.skill}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{g.action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── 10. Notifications Center ─────────────────────────────────────────────────
const NotificationsCenter = () => {
  const [filter, setFilter] = useState("All");
  const [dismissed, setDismissed] = useState({});
  const types = ["All", "alert", "verify", "skill", "followup"];

  const filtered = notifications.filter(n =>
    (filter === "All" || n.type === filter) && !dismissed[n.id]
  );

  const typeIcon = { alert: "🚨", verify: "✅", skill: "🎯", followup: "📞" };
  const typeLabel = { alert: "Alert", verify: "Verification", skill: "Skill Gap", followup: "Follow-up" };

  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>Notifications Center</div>
          <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>Real-time alerts and action items</div>
        </div>
        <Badge color={C.red}>{Object.keys(dismissed).length < notifications.length ? `${filtered.length} active` : "All cleared"}</Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {Object.entries(typeIcon).map(([t, icon]) => {
          const count = notifications.filter(n => n.type === t && !dismissed[n.id]).length;
          return (
            <div key={t} style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 12, padding: "1rem", cursor: "pointer" }}
              onClick={() => setFilter(filter === t ? "All" : t)}>
              <div style={{ fontSize: 24 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginTop: 6 }}>{typeLabel[t]}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{count} pending</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {types.map(t => <Chip key={t} label={t === "All" ? "All" : typeLabel[t]} active={filter === t} onClick={() => setFilter(t)} />)}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(n => (
          <div key={n.id} style={{ background: C.card, border: `1px solid ${n.color}33`, borderLeft: `3px solid ${n.color}`, borderRadius: 14, padding: "1.25rem 1.5rem", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 22 }}>{typeIcon[n.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{n.title}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{n.time}</span>
                  <button onClick={() => setDismissed(p => ({ ...p, [n.id]: true }))} style={{
                    background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: C.textMuted, cursor: "pointer"
                  }}>Dismiss</button>
                </div>
              </div>
              <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{n.desc}</div>
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button style={{ background: `${n.color}18`, border: `1px solid ${n.color}44`, color: n.color, borderRadius: 7, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>
                  Take Action →
                </button>
                <Badge color={n.color}>{typeLabel[n.type]}</Badge>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.textPrimary }}>All clear!</div>
            <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 6 }}>No pending notifications in this category</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function KaushalDrishtiApp() {
  const [page, setPage] = useState("splash");
  const [session, setSession] = useState(null); // { role: "admin" | "trainee", guest: bool }
  const [skillResult, setSkillResult] = useState(null);
  const isFullPage = ["splash", "landing", "auth", "signup", "guest-onboarding", "skill-assessment", "skill-result"].includes(page);
  const showMinimalNav = ["landing", "auth", "signup", "guest-onboarding", "skill-assessment", "skill-result"].includes(page);

  const handleAssessmentComplete = (result) => {
    setSkillResult(result);
    setPage("skill-result");
  };

  const renderPage = () => {
    switch (page) {
      case "splash": return <SplashScreen setPage={setPage} />;
      case "landing": return <LandingPage setPage={setPage} />;
      case "auth": return <AuthPage setPage={setPage} setSession={setSession} />;
      case "signup": return <SignupPage setPage={setPage} setSession={setSession} />;
      case "guest-onboarding": return <GuestOnboarding setPage={setPage} />;
      case "skill-assessment": return <SkillAssessmentForm setPage={setPage} onComplete={handleAssessmentComplete} allowSkip={session?.guest} />;
      case "skill-result": return <SkillProfileResult result={skillResult} setPage={setPage} />;
      case "gov-dashboard": return <GovDashboard />;
      case "employment": return <EmploymentTracking />;
      case "skill-gap": return <SkillGapIntelligence />;
      case "ai-analyzer": return <AISkillAnalyzer />;
      case "ai-copilot": return <AIPolicyCopilot />;
      case "employer": return <EmployerPortal />;
      case "training": return <TrainingDashboard />;
      case "notifications": return <NotificationsCenter />;
      default: return <GovDashboard />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', system-ui, sans-serif", color: C.textSecondary }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        @keyframes shimmer { 0% { background-position: -400% 0; } 100% { background-position: 400% 0; } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } }
      `}</style>

      {!isFullPage && <Sidebar active={page} setPage={setPage} />}

      {isFullPage ? (
        <div>
          {/* Minimal top nav — hidden on the splash screen for a clean full-bleed intro */}
          {showMinimalNav && (
            <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: 56, background: `${C.navy}f2`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.navyBorder}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, zIndex: 200 }}>
              <div style={{ flex: 1 }}>
                <Logo size={26} />
              </div>
              <button onClick={() => setPage("gov-dashboard")} style={{ background: "transparent", border: `1px solid ${C.navyBorder}`, color: C.navyTextMuted, borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>Dashboard</button>
              {page !== "auth" && page !== "signup" && (
                <button onClick={() => setPage("auth")} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sign In</button>
              )}
            </nav>
          )}
          <div style={{ paddingTop: showMinimalNav ? 56 : 0 }}>{renderPage()}</div>
        </div>
      ) : (
        <div style={{ marginLeft: 220, padding: "28px 28px 40px", minHeight: "100vh" }}>
          {renderPage()}
        </div>
      )}
    </div>
  );
}
