import { useState } from "react";
import { useCreateSession } from "../hooks/sessions/useCreateSession";
import { useNavigate } from "react-router-dom";
import TemplateSelector from "./TemplateSelector";

interface Props {
  onClose: () => void;
}

const OptionCard = ({
  onClick,
  disabled = false,
  icon,
  label,
  description,
  badge,
  accent,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  description: string;
  badge?: string;
  accent: {
    cardPressed: string;
    borderPressed: string;
    borderIdle: string;
    iconBg: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  };
}) => {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className={`
        w-full text-left rounded-[20px] p-[20px]
        border transition-all duration-150 relative overflow-hidden
        hover:border-[#2a2a38] hover:bg-[#15151d]
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${pressed ? `${accent.cardPressed} ${accent.borderPressed} scale-[0.985]` : `bg-[#13131a] ${accent.borderIdle}`}
      `}
    >
      <div className="flex items-center gap-[14px] relative z-10">
        <div
          className={`w-[48px] h-[48px] rounded-[16px] shrink-0 flex items-center justify-center border ${accent.iconBg} ${accent.badgeBorder}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[16px] font-extrabold text-[#f0f0f5] tracking-tight m-0">
              {label}
            </p>
            {badge && (
              <span
                className={`text-[9px] font-bold tracking-widest uppercase px-[6px] py-[2px] rounded-md border ${accent.badgeBg} ${accent.badgeBorder} ${accent.badgeText}`}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#6b6b80] m-0 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="w-7 h-7 rounded-[9px] shrink-0 bg-[#1a1a24] border border-[#24242e] flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7h8M7 3l4 4-4 4"
              stroke="#55556a"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};

export const StartWorkoutModal = ({ onClose }: Props) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const { mutate: createSession, isPending } = useCreateSession();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    createSession(
      {},
      {
        onSuccess: (response) => {
          onClose();
          navigate(`/workout/${response._id}`);
        },
      },
    );
  };

  if (showTemplates) {
    return (
      <TemplateSelector
        onBack={() => setShowTemplates(false)}
        onClose={isPending ? () => {} : onClose}
      />
    );
  }

  return (
    <div
      onClick={isPending ? undefined : onClose}
      className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-sm"
    >
      <style>{`
        @keyframes sheetUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] mx-auto bg-[#0d0d12] border-t border-l border-r border-[#1e1e28] rounded-t-[28px] px-5 pb-[90px]"
        style={{ animation: "sheetUp 0.34s cubic-bezier(0.22, 1.08, 0.36, 1)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-[14px] pb-2">
          <div className="w-10 h-1 rounded-full bg-[#2a2a36]" />
        </div>

        {/* Header */}
        <div className="px-1.5 pt-2.5 pb-5">
          <p className="text-[11px] font-bold text-[#44445a] tracking-[0.1em] uppercase mb-1.5">
            New Workout
          </p>
          <h2 className="text-[28px] font-black text-[#f0f0f5] tracking-[-0.04em] leading-[1.1] m-0">
            How are we
            <br />
            training today?
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          <OptionCard
            onClick={() => setShowTemplates(true)}
            label="Use a Template"
            description="Start from one of your saved routines"
            badge="Fast"
            accent={{
              cardPressed: "bg-[rgba(91,124,255,0.07)]",
              borderPressed: "border-[rgba(91,124,255,0.3)]",
              borderIdle: "border-[#1e1e28]",
              iconBg: "bg-[rgba(91,124,255,0.1)]",
              badgeBg: "bg-[rgba(91,124,255,0.1)]",
              badgeBorder: "border-[rgba(91,124,255,0.3)]",
              badgeText: "text-[#7b9dff]",
            }}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="#7b9dff"
                  strokeWidth="1.8"
                />
                <rect
                  x="13"
                  y="3"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="#7b9dff"
                  strokeWidth="1.8"
                />
                <rect
                  x="3"
                  y="13"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="#7b9dff"
                  strokeWidth="1.8"
                />
                <path
                  d="M16 13v6M13 16h6"
                  stroke="#7b9dff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            }
          />

          <OptionCard
            onClick={handleCreateNew}
            disabled={isPending}
            label={isPending ? "Creating..." : "Start Empty"}
            description="Build your workout on the fly"
            accent={{
              cardPressed: "bg-[rgba(200,255,71,0.05)]",
              borderPressed: "border-[rgba(200,255,71,0.25)]",
              borderIdle: "border-[#1e1e28]",
              iconBg: "bg-[rgba(200,255,71,0.08)]",
              badgeBg: "bg-[rgba(200,255,71,0.08)]",
              badgeBorder: "border-[rgba(200,255,71,0.2)]",
              badgeText: "text-[#c8ff47]",
            }}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="#c8ff47"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StartWorkoutModal;
