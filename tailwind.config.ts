import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B4332",
        mist: "#F5F0E8",
        dune: "#F5F0E8",
        sage: "#95D5B2",
        pine: "#1B4332",
        clay: "#2D6A4F",
        glow: "#95D5B2",
        "aura-ink": "#1B4332",
        "aura-mist": "#F5F0E8",
        "aura-midnight": "#1B4332",
        "aura-pine": "#1B4332",
        "aura-aqua": "#95D5B2",
        "aura-sage": "#2D6A4F",
        "aura-clay": "#2D6A4F",
        "aura-glow": "#95D5B2"
      },
      boxShadow: {
        aura: "0 24px 80px rgba(27, 67, 50, 0.16)",
        soft: "0 12px 40px rgba(27, 67, 50, 0.08)",
        glow: "0 12px 60px rgba(149, 213, 178, 0.18)"
      },
      fontFamily: {
        display: ["var(--font-playfair)"],
        body: ["var(--font-inter)"]
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top left, rgba(149,213,178,0.3), transparent 38%), radial-gradient(circle at bottom right, rgba(45,106,79,0.16), transparent 34%)"
      }
    }
  },
  plugins: []
};

export default config;
