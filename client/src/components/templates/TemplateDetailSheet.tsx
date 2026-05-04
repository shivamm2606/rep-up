import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSession } from "../../hooks/sessions/useCreateSession";
import { getMuscleColor, formatMuscle } from "./templateUtils";
import type { WorkoutTemplate, PopulatedExercise } from "../../types/workoutTemplate.types";

interface Props {
  template: WorkoutTemplate;
  onClose: () => void;
}

export function TemplateDetailSheet({ template, onClose }: Props) {
  const navigate = useNavigate();
  const { mutate: createSession, isPending } = useCreateSession();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    if (isPending) return;
    setClosing(true);
    setTimeout(onClose, 250);
  };

  const handleStart = () => {
    createSession(
      { templateUsed: template._id },
      {
        onSuccess: (response) => {
          onClose();
          navigate(`/workout/${response.data._id}`);
        },
      },
    );
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-250 ${closing ? "opacity-0" : "opacity-100"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-panel w-full max-w-[520px] mx-auto bg-[#0d0d12] border-t border-l border-r border-[#1e1e28] rounded-t-[28px] px-5 pb-[90px] max-h-[85vh] flex flex-col"
        style={{
          animation: closing
            ? "sheetDown 0.25s ease-in forwards"
            : "sheetUp 0.34s cubic-bezier(0.22, 1.08, 0.36, 1)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-[14px] pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#2a2a36]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-1.5 pt-2.5 pb-5 shrink-0">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-[#44445a] tracking-[0.1em] uppercase mb-1.5">
              Template Details
            </p>
            <h2 className="text-[24px] font-black text-[#f0f0f5] tracking-[-0.04em] leading-[1.1] m-0 truncate">
              {template.name}
            </h2>
            <p className="text-[12px] text-[#6b6b80] mt-1.5">
              {template.exercises.length} exercise{template.exercises.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-[12px] bg-[#13131a] border border-[#1e1e28] flex items-center justify-center text-[#8b8b9a] hover:text-[#f0f0f5] transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Exercise List */}
        <div className="overflow-y-auto flex-1 -mx-1.5 px-1.5">
          <div className="flex flex-col gap-[1px]">
            {template.exercises.map((ex, i) => {
              const populated =
                typeof ex.exerciseId === "object" ? (ex.exerciseId as PopulatedExercise) : null;
              const muscle = populated?.muscleGroup ?? "";
              const c = getMuscleColor(muscle);

              return (
                <div
                  key={populated?._id ?? i}
                  className={`flex items-center gap-3 py-[14px] px-[14px] rounded-[14px] ${i % 2 === 0 ? "bg-[#0f0f15]" : "bg-transparent"}`}
                >
                  <span className="text-[11px] font-bold text-[#33334a] w-5 text-center shrink-0 tabular-nums">
                    {i + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#e0e0ea] tracking-tight truncate">
                      {populated?.name ?? "Unknown exercise"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {muscle && (
                        <span
                          className="text-[8.5px] font-bold tracking-[0.04em] uppercase px-[6px] py-[1.5px] rounded-[5px] border"
                          style={{ background: c.bg, color: c.text, borderColor: c.border }}
                        >
                          {formatMuscle(muscle)}
                        </span>
                      )}
                      {ex.notes && (
                        <span className="text-[10px] text-[#55556a] italic truncate">
                          {ex.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  {ex.targetSets && (
                    <div className="text-right shrink-0">
                      <p className="text-[16px] font-black text-[#f0f0f5] tabular-nums leading-none">
                        {ex.targetSets}
                      </p>
                      <p className="text-[9px] font-semibold text-[#55556a] uppercase tracking-wider mt-0.5">
                        sets
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Workout Button */}
        <div className="shrink-0 pt-5 pb-2">
          <button
            onClick={handleStart}
            disabled={isPending}
            className={`
              w-full py-[15px] rounded-[14px] text-[15px] font-extrabold tracking-tight
              transition-all duration-150
              ${isPending
                ? "bg-[#4ade80]/40 text-[#0b0b10]/60 cursor-not-allowed"
                : "bg-[#4ade80] text-[#0b0b10] hover:bg-[#5eebb0] active:scale-[0.98]"
              }
            `}
          >
            {isPending ? "Starting…" : "Start Workout"}
          </button>
        </div>
      </div>
    </div>
  );
}
