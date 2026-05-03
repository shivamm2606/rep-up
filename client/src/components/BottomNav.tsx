import { useLocation, useNavigate } from "react-router-dom";

const ACTIVE_COLOR = "#4ade80";
const INACTIVE_COLOR = "#6b6b80";

const navItems = [
  {
    label: "Home",
    path: "/dashboard",
    icon: (color: string) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 22 22"
        fill="none"
        stroke={color}
      >
        <path
          d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    label: "Templates",
    path: "/templates",
    icon: (color: string) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 22 22"
        fill="none"
        stroke={color}
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="1.6" />
        <rect x="12" y="3" width="7" height="7" rx="1.5" strokeWidth="1.6" />
        <rect x="3" y="12" width="7" height="7" rx="1.5" strokeWidth="1.6" />
        <rect x="12" y="12" width="7" height="7" rx="1.5" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    label: "Workout",
    path: "/workout",
    
    icon: (color: string) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 22 22"
        fill="none"
        stroke={color}
      >
        <path
          d="M2 11h2M18 11h2M6 8v6M16 8v6M4 9.5v3M18 9.5v3M6 11h10"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "History",
    path: "/history",
    icon: (color: string) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 22 22"
        fill="none"
        stroke={color}
      >
        <rect x="3" y="3" width="16" height="16" rx="2" strokeWidth="1.6" />
        <path
          d="M3 17l4-4 4 3 4-6 4 2"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/profile",
    icon: (color: string) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 22 22"
        fill="none"
        stroke={color}
      >
        <circle cx="11" cy="8" r="3.5" strokeWidth="1.6" />
        <path
          d="M4 19c0-3.314 3.134-6 7-6s7 2.686 7 6"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#2a2a38] bg-[#16161f]">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.path);
        const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className="
              flex-1 flex flex-col items-center
              gap-1 pt-3 pb-4
              bg-transparent border-none
              cursor-pointer
              active:scale-95
              transition-all duration-150
            "
          >
            {/* ICON */}
            <div
              className={`
                transition-all duration-200
                ${active ? "-translate-y-[2px]" : ""}
              `}
            >
              {item.icon(color)}
            </div>

            {/* LABEL */}
            <span
              className={`
                text-[9px] font-bold uppercase tracking-widest
                transition-colors
                ${active ? "text-[#4ade80]" : "text-[#6b6b80]"}
              `}
            >
              {item.label}
            </span>

            {/* UNDERLINE */}
            <span
              className={`
                w-4 h-0.5 rounded-full bg-[#4ade80]
                transition-transform duration-200 origin-center
                ${active ? "scale-x-100" : "scale-x-0"}
              `}
            />
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
