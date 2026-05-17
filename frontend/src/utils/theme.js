// ============================================
// MOODEX THEME — change colors here only
// ============================================

export const theme = {
  // Main gradient colors
  gradientFrom: "#C026D3",
  gradientTo:   "#E879F9",

  // Page background
  pageBg: "linear-gradient(135deg, #FDF4FF 0%, #FAF0FE 40%, #FFF0F9 100%)",

  // Sidebar + Navbar background
  sidebarBg:  "#FFFFFF",
  navbarBg:   "rgba(255,255,255,0.85)",

  // Text colors
  textPrimary:   "#3B0764",
  textSecondary: "#A855F7",
  textMuted:     "#C084FC",

  // Border colors
  borderLight: "#F5D0FE",
  borderSoft:  "#FAE8FF",

  // Active nav item
  navActiveBg:     "#FDF4FF",
  navActiveText:   "#A21CAF",
  navActiveBorder: "#E879F9",

  // Hover nav item
  navHoverBg:   "#FDF4FF",
  navHoverText: "#7E22CE",

  // Card background
  cardBg: "#FFFFFF",

  // Accent blobs on landing/auth pages
  blob1: "bg-pink-200/40",
  blob2: "bg-purple-200/40",
  blob3: "bg-fuchsia-100/50",

  // Button shadow
  btnShadow: "rgba(192,38,211,0.3)",

  // Scrollbar
  scrollbar: "#E879F9",
};

// Pre-built class strings for common patterns
export const cls = {
  gradientBg:   "gradient-bg",
  gradientText: "gradient-text",
  glass:        "glass",
  pageWrapper:  "min-h-screen flex",
  card:         "bg-white rounded-2xl border shadow-sm",
  input:        `w-full bg-white border rounded-xl px-4 py-3
                 text-sm outline-none transition-all duration-200`,
};