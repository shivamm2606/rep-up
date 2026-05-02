import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    label: "Home",
    path: "/dashboard",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: "Templates",
    path: "/templates",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
        />
        <rect
          x="3"
          y="12"
          width="7"
          height="7"
          rx="1.5"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="12"
          width="7"
          height="7"
          rx="1.5"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: "Workout",
    path: "/workout",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle
          cx="11"
          cy="11"
          r="8"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
        />
        <path
          d="M11 7v4l3 3"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "History",
    path: "/history",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 17l4-4 4 3 4-6 4 2"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="3"
          y="3"
          width="16"
          height="16"
          rx="2"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/profile",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle
          cx="11"
          cy="8"
          r="3.5"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
        />
        <path
          d="M4 19c0-3.314 3.134-6 7-6s7 2.686 7 6"
          stroke={active ? "#3b6bfa" : "#6b6b80"}
          strokeWidth="1.5"
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
    <nav className="fixed bottom-0 left-0 right-0 bg-[#16161f] border-t border-[#2a2a38] flex z-50">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex-1 flex flex-col items-center gap-1 pt-3 pb-4 bg-transparent border-none cursor-pointer"
          >
            {item.icon(active)}
            <span
              className={`text-[9px] font-bold uppercase tracking-widest ${
                active ? "text-[#3b6bfa]" : "text-[#6b6b80]"
              }`}
            >
              {item.label}
            </span>
            <span
              className={`w-4 h-0.5 rounded-full bg-[#3b6bfa] transition-opacity ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
