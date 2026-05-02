import { useBodyweightLog } from "../hooks/bodyweight/useBodyweightLog";
import { useCurrentUser } from "../hooks/user/useCurrentUser";
import { useWorkoutSession } from "../hooks/sessions/useWorkoutSession";
import { getGreeting } from "../utils/getGreeting";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

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

function getDailyQuote() {
  const todayKey = new Date().toDateString();

  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem("dailyQuote");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === todayKey) return parsed.quote;
      } catch {
        localStorage.removeItem("dailyQuote");
      }
    }
  }

  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(
      "dailyQuote",
      JSON.stringify({ date: todayKey, quote: randomQuote }),
    );
  }

  return randomQuote;
}

function Dashboard() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { data: sessions } = useWorkoutSession();
  const { data: bwLogs } = useBodyweightLog();

  const latestBW = bwLogs?.logs?.[0];

  const [dailyQuote] = useState(getDailyQuote);

  const allSessions = useMemo(() => sessions?.sessions ?? [], [sessions]);

  const lastSession = useMemo(
    () =>
      [...allSessions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0] ?? null,
    [allSessions],
  );

  const { weeklyCount, diff } = useMemo(() => {
    const now = new Date();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
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

    return { weeklyCount, diff };
  }, [allSessions]);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  }, []);

  const formattedLastSessionDate = useMemo(() => {
    if (!lastSession) return null;
    return new Date(lastSession.date).toLocaleDateString();
  }, [lastSession]);

  const streak = useMemo(() => {
    if (allSessions.length === 0) return 0;

    const sessionDays = new Set(
      allSessions.map((s) => new Date(s.date).toDateString()),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOffset = sessionDays.has(today.toDateString()) ? 0 : 1;

    let count = 0;
    let i = startOffset;

    while (true) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);

      if (sessionDays.has(day.toDateString())) {
        count++;
        i++;
      } else {
        break;
      }
    }

    return count;
  }, [allSessions]);

  const bwLoggedToday = useMemo(() => {
    if (!latestBW) return false;
    const today = new Date().toDateString();
    return new Date(latestBW.date).toDateString() === today;
  }, [latestBW]);

  return (
    <div className="bg-[#0a0a0c] text-[#f4f4f6] font-[Inter] min-h-screen pb-[82px]">
      {/* HEADER */}
      <div className="px-[18px] pt-[30px] pb-[20px] border-b border-[#1f1f26]">
        <div className="flex items-start justify-between mb-[14px]">
          <div>
            <p className="text-[11px] font-bold text-[#8b8b9a] tracking-[0.08em] uppercase">
              {getGreeting()}
            </p>

            <h1 className="text-[30px] font-black tracking-[-0.04em] leading-[1] mt-[3px]">
              {user?.name ?? "-"}
            </h1>

            <p className="text-[13px] font-medium text-[#8b8b9a] mt-[6px]">
              {formattedDate} -{" "}
              {dailyQuote.text.length > 60
                ? dailyQuote.text.slice(0, 60) + "..."
                : dailyQuote.text}
            </p>
          </div>

          <div className="flex items-center gap-[5px] bg-[#1a1a20] border border-[#1f1f26] rounded-[12px] px-[12px] py-[8px] shrink-0">
            <span className="text-[15px] leading-[1]">🔥</span>
            <span className="text-[14px] font-extrabold font-mono tracking-[-0.02em]">
              {streak}
            </span>
          </div>
        </div>
      </div>

      {/* TODAY */}
      <div className="px-[14px] pt-[14px]">
        <p className="text-[11px] font-semibold text-[#8b8b9a] mb-[8px]">
          Today
        </p>

        <button
          onClick={() => navigate("/workout/start")}
          className="
            w-full text-left relative overflow-hidden
            bg-[rgba(91,124,255,0.08)] border border-[rgba(91,124,255,0.25)]
            rounded-[20px] px-[18px] py-[18px]
            transition-all duration-200
          "
        >
          <div className="absolute -top-[28px] -right-[28px] w-[100px] h-[100px] rounded-full bg-[rgba(123,149,255,0.25)]" />
          <div className="absolute -bottom-[32px] left-0 w-[70px] h-[70px] rounded-full bg-[rgba(50,80,200,0.2)]" />

          <div className="relative flex items-center justify-between gap-[14px]">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-[#8b8b9a] uppercase tracking-[0.08em] mb-[4px]">
                Ready to train?
              </p>

              <p className="text-[24px] font-black tracking-[-0.035em] leading-[1.1]">
                Start Workout
              </p>

              <p className="text-[11px] font-semibold text-[#8b8b9a] font-mono mt-[8px]">
                ready when you are
              </p>
            </div>

            <div className="w-[42px] h-[42px] rounded-[12px] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.18)] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24">
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

      {/* WEEK */}
      <div className="px-[14px] pt-[14px]">
        <p className="text-[11px] font-semibold text-[#8b8b9a] mb-[8px]">
          This Week
        </p>

        <div className="grid grid-cols-2 gap-[10px]">
          <div className="bg-[#121216] rounded-[16px] p-[14px]">
            <p className="text-[11px] text-[#8b8b9a]">Sessions</p>

            <div className="flex items-baseline gap-[6px]">
              <p className="text-[30px] font-extrabold">{weeklyCount}</p>
              <span className="text-[12px] text-[#8b8b9a]">/ wk</span>
            </div>

            <p
              className={`text-[11px] mt-[4px] ${diff >= 0 ? "text-[#3ddc97]" : "text-[#ef4444]"}`}
            >
              {diff >= 0 ? `+${diff}` : diff} from last week
            </p>
          </div>

          <div className="bg-[#121216] rounded-[16px] p-[14px]">
            <p className="text-[11px] text-[#8b8b9a]">Bodyweight</p>

            <p className="text-[28px] font-black mt-[4px]">
              {latestBW?.weight ?? "-"}
              <span className="text-[14px] text-[#8b8b9a]"> kg</span>
            </p>

            <p className="text-[11px] text-[#8b8b9a] mt-[4px]">
              {latestBW
                ? bwLoggedToday
                  ? "logged today"
                  : `logged ${new Date(latestBW.date).toLocaleDateString()}`
                : "no log yet"}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="px-[14px] pt-[14px]">
        <p className="text-[11px] font-semibold text-[#8b8b9a] mb-[8px]">
          Quick Actions
        </p>

        <div className="grid grid-cols-2 gap-[10px]">
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
                    stroke="#8b8b9a"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="12"
                    y="3"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke="#8b8b9a"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="3"
                    y="12"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke="#8b8b9a"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="12"
                    y="12"
                    width="7"
                    height="7"
                    rx="1.5"
                    stroke="#8b8b9a"
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
                  <rect
                    x="3"
                    y="8"
                    width="16"
                    height="11"
                    rx="2"
                    stroke="#8b8b9a"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 8C8 5.79 9.79 4 12 4s4 1.79 4 4"
                    stroke="#8b8b9a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 12v2"
                    stroke="#8b8b9a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="14.5" r="0.75" fill="#8b8b9a" />
                </svg>
              ),
            },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-[#121216] rounded-[16px] p-[14px] min-h-[108px] flex flex-col justify-between text-left"
            >
              <div className="flex items-center justify-between">
                <div className="w-[32px] h-[32px] rounded-[9px] bg-[#1a1a20] border border-[#1f1f26] flex items-center justify-center">
                  {item.icon}
                </div>

                <div className="w-[24px] h-[24px] rounded-[7px] bg-[#1a1a20] flex items-center justify-center">
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7h8M7 3l4 4-4 4"
                      stroke="#8b8b9a"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-[13px] font-extrabold tracking-[-0.02em]">
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* LAST SESSION */}
      <div className="px-[14px] pt-[14px]">
        <p className="text-[11px] font-semibold text-[#8b8b9a] mb-[8px]">
          Last Session
        </p>

        <div className="bg-[#121216] rounded-[16px] p-[14px]">
          {lastSession ? (
            <>
              <p className="text-[10px] font-bold text-[#8b8b9a] uppercase tracking-[0.09em] mb-[14px]">
                Most recent workout
              </p>

              <p className="text-[16px] font-extrabold tracking-[-0.025em]">
                {lastSession.name ?? "Unnamed"}
              </p>

              <p className="text-[11px] text-[#8b8b9a] mt-[6px]">
                {formattedLastSessionDate}
              </p>
            </>
          ) : (
            <p className="text-[13px] text-[#8b8b9a] text-center py-[12px]">
              No sessions yet - start your first workout!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
