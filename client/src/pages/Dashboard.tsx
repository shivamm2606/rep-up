import { useBodyweightLog } from "../hooks/bodyweight/useBodyweightLog";
import { useCurrentUser } from "../hooks/user/useCurrentUser";
import { useWorkoutSession } from "../hooks/sessions/useWorkoutSession";
import { getGreeting } from "../utils/getGreeting";
import { useNavigate } from "react-router-dom";

const QUOTES = [
  { text: "ready to lift?" },
  { text: "go harder than yesterday." },
  { text: "don't skip today." },
  { text: "push one more rep." },
  { text: "show up and do the work." },
  { text: "you've got more in you." },
  { text: "earn your rest today." },
  { text: "stay consistent." },
  { text: "keep the streak alive." },
  { text: "no excuses today." },
  { text: "lock in and train." },
  { text: "make this session count." },
];

const S = {
  bg: "#0a0a0c",
  card: "#121216",
  soft: "#1a1a20",
  border: "#1f1f26",
  text: "#f4f4f6",
  muted: "#8b8b9a",
  accent: "#5b7cff",
  green: "#3ddc97",
} as const;

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: S.muted,
  marginBottom: 8,
};

const cardBase: React.CSSProperties = {
  background: S.card,
  borderRadius: 16,
  padding: 14,
};

const iconBox: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 9,
  background: S.soft,
  border: `1px solid ${S.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const chip: React.CSSProperties = {
  background: S.soft,
  border: `1px solid ${S.border}`,
  borderRadius: 7,
  padding: "3px 8px",
  fontSize: 10,
  fontWeight: 600,
  color: S.muted,
  fontFamily: "'JetBrains Mono', monospace",
};

function Dashboard() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { data: sessions } = useWorkoutSession();
  const { data: bwLogs } = useBodyweightLog();

  const now = new Date();
  const today = now;

  const todayIndex =
    today.getFullYear() * 1000 + today.getMonth() * 50 + today.getDate();

  const dailyQuote = QUOTES[todayIndex % QUOTES.length];

  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  const allSessions = sessions?.sessions ?? [];

  const oneWeekAgo = new Date(now.getTime() - ONE_WEEK);

  const weeklySessions = allSessions.filter(
    (s) => new Date(s.date) >= oneWeekAgo,
  );

  const prevWeekSessions = allSessions.filter((s) => {
    const d = new Date(s.date);
    return d < oneWeekAgo && d >= new Date(oneWeekAgo.getTime() - ONE_WEEK);
  });

  const weeklyCount = weeklySessions.length;
  const prevWeekCount = prevWeekSessions.length;
  const diff = weeklyCount - prevWeekCount;

  const lastSession = allSessions[0];
  const latestBW = bwLogs?.logs?.[0];

  return (
    <div
      style={{
        background: S.bg,
        color: S.text,
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        paddingBottom: 82,
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          padding: "30px 18px 20px",
          borderBottom: `1px solid ${S.border}`,
        }}
      >
        {/* Name + fire */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: S.muted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {getGreeting()}
            </p>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginTop: 3,
                color: S.text,
              }}
            >
              {user?.name ?? "-"}
            </h1>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: S.muted,
                marginTop: 6,
              }}
            >
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}{" "}
              -{" "}
              {dailyQuote.text.length > 60
                ? dailyQuote.text.slice(0, 60) + "..."
                : dailyQuote.text}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: S.soft,
              border: `1px solid ${S.border}`,
              borderRadius: 12,
              padding: "8px 12px",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>🔥</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "-0.02em",
                color: S.text,
              }}
            >
              7
            </span>
          </div>
        </div>
      </div>

      {/* ── TODAY ── */}
      <div style={{ padding: "14px 14px 0" }}>
        <p style={sectionLabel}>Today</p>
        <button
          onClick={() => navigate("/workout/start")}
          style={{
            background: "rgba(91,124,255,0.08)",
            border: `1px solid rgba(91,124,255,0.25)`,
            borderRadius: 20,
            padding: "18px 18px",
            transition: "all 0.2s ease",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* background blobs (slightly adjusted, less intrusive) */}
          <div
            style={{
              position: "absolute",
              top: -28,
              right: -28,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(123,149,255,0.25)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -32,
              left: 0,
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "rgba(50,80,200,0.2)",
            }}
          />

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
            }}
          >
            {/* LEFT CONTENT */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: S.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Ready to train?
              </p>

              <p
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: S.text,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                }}
              >
                Start Workout
              </p>

              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: S.muted,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 8,
                }}
              >
                ready when you are
              </p>
            </div>

            {/* RIGHT ICON */}
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 12,
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* ── OVERVIEW ── */}
      <div style={{ padding: "14px 14px 0" }}>
        <p style={sectionLabel}>This Week</p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {/* Sessions */}
          <div style={cardBase}>
            <p style={{ fontSize: 11, color: S.muted }}>Sessions</p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <p style={{ fontSize: 30, fontWeight: 800 }}>{weeklyCount}</p>
              <span style={{ fontSize: 12, color: S.muted }}>/ wk</span>
            </div>

            <p
              style={{
                fontSize: 11,
                color: diff >= 0 ? S.green : "#ef4444",
                marginTop: 4,
              }}
            >
              {diff >= 0 ? `+${diff}` : diff} from last week
            </p>
          </div>

          {/* Bodyweight */}
          <div style={cardBase}>
            <p style={{ fontSize: 11, color: S.muted }}>Bodyweight</p>

            <p
              style={{
                fontSize: 28,
                fontWeight: 900,
                marginTop: 4,
              }}
            >
              {latestBW?.weight ?? "-"}
              <span style={{ fontSize: 14, color: S.muted }}> kg</span>
            </p>

            <p style={{ fontSize: 11, color: S.muted, marginTop: 4 }}>
              {latestBW ? "logged today" : "no log yet"}
            </p>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ padding: "14px 14px 0" }}>
        <p style={sectionLabel}>Quick Actions</p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {[
            {
              label: "View Templates",
              path: "/templates",
              icon: (
                <svg width="15" height="15" viewBox="0 0 22 22" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke={S.muted}
                    strokeWidth="1.5"
                  />
                  <rect
                    x="12"
                    y="3"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke={S.muted}
                    strokeWidth="1.5"
                  />
                  <rect
                    x="3"
                    y="12"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke={S.muted}
                    strokeWidth="1.5"
                  />
                  <rect
                    x="12"
                    y="12"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke={S.muted}
                    strokeWidth="1.5"
                  />
                </svg>
              ),
            },
            {
              label: "Log Bodyweight",
              path: "/bodyweight/log",
              icon: (
                <svg width="15" height="15" viewBox="0 0 22 22" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke={S.muted}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11 7v4l3 3"
                    stroke={S.muted}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...cardBase,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 108,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={iconBox}>{item.icon}</div>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: S.soft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7h8M7 3l4 4-4 4"
                      stroke={S.muted}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: S.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
              >
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── LAST SESSION ── */}
      <div style={{ padding: "14px 14px 0" }}>
        <p style={sectionLabel}>Last Session</p>
        <div style={cardBase}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: S.muted,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
              }}
            >
              Most recent workout
            </p>
            {lastSession && (
              <div
                style={{
                  background: "rgba(61,220,151,0.1)",
                  border: "1px solid rgba(61,220,151,0.2)",
                  borderRadius: 8,
                  padding: "4px 9px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: S.green,
                  letterSpacing: "0.04em",
                }}
              >
                Completed
              </div>
            )}
          </div>

          {lastSession ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: "rgba(91,124,255,0.1)",
                  border: "1px solid rgba(91,124,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M3 11h2.5M16.5 11H19M5.5 11a5.5 5.5 0 0011 0M5.5 11a5.5 5.5 0 0111 0M8 9V7m6 2V7"
                    stroke={S.accent}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: S.text,
                  }}
                >
                  {lastSession.name ?? "Unnamed"}
                </p>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  {lastSession.duration && (
                    <span style={chip}>{lastSession.duration} min</span>
                  )}
                  <span style={chip}>
                    {new Date(lastSession.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p
              style={{
                fontSize: 13,
                color: S.muted,
                textAlign: "center",
                padding: "12px 0",
              }}
            >
              No sessions yet - start your first workout!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
