interface WorkoutCTAProps {
  onStart: () => void;
}

export function WorkoutCTA({ onStart }: WorkoutCTAProps) {
  return (
    <button
      onClick={onStart}
      className="w-full text-left relative overflow-hidden bg-[rgba(91,124,255,0.08)] border border-[rgba(91,124,255,0.25)] rounded-[20px] px-[18px] py-[18px] transition-all duration-200 active:scale-[0.98]"
    >
      <div className="absolute -top-7 -right-7 w-[100px] h-[100px] rounded-full bg-[rgba(123,149,255,0.25)]" />
      <div className="absolute -bottom-8 left-0 w-[70px] h-[70px] rounded-full bg-[rgba(50,80,200,0.2)]" />

      <div className="relative flex items-center justify-between gap-[14px]">
        <div className="flex flex-col flex-1">
          <p className="text-[11px] font-bold text-[#8b8b9a] uppercase tracking-[0.08em] mb-1">
            Ready to train?
          </p>
          <p className="text-[26px] font-black tracking-[-0.035em] leading-[1.05]">
            Start Workout
          </p>
          <p className="text-[12px] font-semibold text-[#8b8b9a] font-mono mt-2">
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
  );
}
