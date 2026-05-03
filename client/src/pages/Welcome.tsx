import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

// ─── types ────────────────────────────────────────────────────────────────────
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// ─── hooks ────────────────────────────────────────────────────────────────────
function useInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  return { canInstall: !!prompt, install, installed };
}

// ─── desktop placeholder ──────────────────────────────────────────────────────
function DesktopView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appUrl = window.location.origin;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, appUrl, {
        width: 160,
        margin: 2,
        color: { dark: "#080809", light: "#47b8ff" },
      });
    }
  }, [appUrl]);

  const features = [
    {
      icon: "🏋️",
      title: "Workout Tracking",
      desc: "Log every set, rep and weight. Build a complete training history.",
    },
    {
      icon: "📋",
      title: "Smart Templates",
      desc: "Create reusable workout templates for Push, Pull, Legs and more.",
    },
    {
      icon: "⚖️",
      title: "Bodyweight Log",
      desc: "Track your weight over time and visualise your progress curve.",
    },
    {
      icon: "🔥",
      title: "Calorie Goals",
      desc: "Auto-calculated TDEE targets based on your stats and activity.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080809",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grain overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Lime glow blobs */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          right: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(71,184,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(71,184,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem 4rem",
            borderBottom: "1px solid #1a1a1f",
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "2rem",
              letterSpacing: "0.05em",
            }}
          >
            Rep<span style={{ color: "#47b8ff" }}>Up</span>
          </span>
          <a
            href="https://github.com/shivamm2606/rep-up"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.875rem",
              opacity: 0.6,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </nav>

        {/* Hero */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            padding: "6rem 4rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Left */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(71,184,255,0.08)",
                border: "1px solid rgba(71,184,255,0.2)",
                borderRadius: "99px",
                padding: "0.35rem 1rem",
                fontSize: "0.78rem",
                color: "#47b8ff",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "2rem",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#47b8ff",
                  animation: "pulse 2s infinite",
                }}
              />
              Progressive Web App
            </div>

            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4rem, 7vw, 7rem)",
                lineHeight: 0.9,
                margin: "0 0 1.5rem",
                letterSpacing: "0.02em",
              }}
            >
              TRACK EVERY
              <br />
              <span style={{ color: "#47b8ff" }}>REP.</span>
              <br />
              GET STRONGER.
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                maxWidth: "42ch",
                marginBottom: "3rem",
              }}
            >
              RepUp is a mobile-first gym tracker built for serious lifters.
              Log workouts, monitor progress, and hit your goals — one session
              at a time.
            </p>

            {/* Mobile notice + QR */}
            <div
              style={{
                background: "#111113",
                border: "1px solid #222228",
                borderRadius: "16px",
                padding: "1.5rem 2rem",
                display: "flex",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 600,
                    marginBottom: "0.4rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Built for mobile
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.825rem",
                    lineHeight: 1.6,
                    maxWidth: "28ch",
                  }}
                >
                  Open on your phone or scan the QR code to install RepUp as an app.
                </p>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  padding: "8px",
                  background: "#47b8ff",
                  borderRadius: "12px",
                }}
              >
                <canvas ref={canvasRef} style={{ display: "block", borderRadius: "6px" }} />
              </div>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "280px",
                height: "560px",
                borderRadius: "40px",
                border: "2px solid #222228",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px #111113",
                background: "#080809",
              }}
            >
              {/* Notch */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "22px",
                  background: "#080809",
                  borderRadius: "99px",
                  zIndex: 10,
                  border: "1.5px solid #222228",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.88) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "48px",
                  left: "24px",
                  right: "24px",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Welcome to
                </p>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "2.8rem",
                    lineHeight: 1,
                    color: "#fff",
                    marginBottom: "12px",
                  }}
                >
                  Rep<span style={{ color: "#47b8ff" }}>Up.</span>
                </p>
                <div
                  style={{
                    background: "#47b8ff",
                    color: "#fff",
                    borderRadius: "99px",
                    padding: "10px 20px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Get Started →
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section
          style={{
            padding: "2rem 4rem 6rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "2rem",
              fontWeight: 600,
            }}
          >
            What's inside
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "#111113",
                  border: "1px solid #222228",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  transition: "border-color 0.2s, transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(71,184,255,0.3)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#222228";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "1rem" }}>
                  {f.icon}
                </span>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem", color: "#fff" }}>
                  {f.title}
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.825rem", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid #1a1a1f",
            padding: "2rem 4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.25rem",
              letterSpacing: "0.05em",
              opacity: 0.4,
            }}
          >
            Rep<span style={{ color: "#47b8ff" }}>Up</span>
          </span>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>
            Built by{" "}
            <a
              href="https://github.com/shivamm2606"
              target="_blank"
              rel="noreferrer"
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
            >
              Shivam
            </a>
          </p>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

// ─── mobile landing ───────────────────────────────────────────────────────────
function MobileLanding() {
  const navigate = useNavigate();
  const { canInstall, install, installed } = useInstallPrompt();

  return (
    <div
      style={{
        height: "100svh",
        width: "100%",
        overflow: "hidden",
        background: "#000",
        position: "relative",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 35%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.93) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 1.75rem 3rem",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "0.85rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
            marginBottom: "0.25rem",
          }}
        >
          Welcome to
        </p>

        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3.5rem, 18vw, 5rem)",
            lineHeight: 0.95,
            margin: "0 0 1.25rem",
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ color: "#fff" }}>Rep</span>
          <span style={{ color: "#47b8ff" }}>Up.</span>
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(0.875rem, 4vw, 1rem)",
            lineHeight: 1.65,
            marginBottom: "2.25rem",
            maxWidth: "30ch",
          }}
        >
          Track every rep. Log every session.
          <br />
          Watch yourself get stronger —<br />
          one lift at a time.
        </p>

        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            padding: "1rem",
            background: "#47b8ff",
            color: "#fff",
            border: "none",
            borderRadius: "99px",
            fontSize: "1rem",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.02em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            boxShadow: "0 0 32px rgba(71,184,255,0.3)",
            marginBottom: "0.875rem",
          }}
        >
          Get Started →
        </button>

        {canInstall && !installed && (
          <button
            onClick={install}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "99px",
              fontSize: "0.9rem",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              backdropFilter: "blur(8px)",
              marginBottom: "0.875rem",
            }}
          >
            <span>📲</span> Install App
          </button>
        )}

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#47b8ff",
              fontWeight: 700,
              fontSize: "0.875rem",
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Log in
          </button>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

// ─── root export ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile ? <MobileLanding /> : <DesktopView />;
}