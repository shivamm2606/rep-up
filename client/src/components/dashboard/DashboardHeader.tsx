interface DashboardHeaderProps {
  greeting: string;
  userName: string;
  date: string;
  quote: string;
  streak: number;
}

export function DashboardHeader({
  greeting,
  userName,
  date,
  quote,
  streak,
}: DashboardHeaderProps) {
  return (
    <div className="px-4 pt-6 pb-4 border-b border-[#1f1f26]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[#8b8b9a] tracking-[0.08em] uppercase">
            {greeting}
          </p>
          <h1 className="text-[26px] font-black tracking-[-0.035em] leading-[1.15] mt-[3px] line-clamp-2">
            {userName}
          </h1>
          <p className="text-[12px] font-medium text-[#8b8b9a] mt-[6px] leading-[1.45]">
            {date} - {quote.length > 50 ? quote.slice(0, 50) + "..." : quote}
          </p>
        </div>

        <button className="group relative flex items-center gap-[5px] bg-[#1a1a20] border border-[#1f1f26] hover:bg-[#202028] hover:border-[#2a2a38] rounded-[12px] px-3 py-2 shrink-0 mt-[2px] transition-colors focus:outline-none">
          <span className="text-[15px] leading-[1]">🔥</span>
          <span className="text-[15px] font-extrabold font-mono tracking-[-0.02em]">
            {streak}
          </span>

          <div className="absolute right-0 top-full mt-2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-focus:opacity-100 group-focus:translate-y-0 transition-all duration-200 z-50">
            <div className="bg-[#000000] text-[#f0f0f5] text-[11px] font-bold tracking-[0.02em] py-1.5 px-2.5 rounded-[8px] whitespace-nowrap shadow-xl border border-[#1f1f26] relative">
              Current streak
              <div className="absolute -top-[5px] right-[16px] w-[9px] h-[9px] bg-[#000000] border-t border-l border-[#1f1f26] rotate-45" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
