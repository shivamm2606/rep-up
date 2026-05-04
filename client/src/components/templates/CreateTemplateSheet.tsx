import { useState } from "react";
import { useCreateTemplate } from "../../hooks/workoutTemplate/useCreateTemplate";
import { ExercisePicker } from "./ExercisePicker";
import { getMuscleColor, formatMuscle } from "./templateUtils";
import type { Exercise } from "../../hooks/exercises/useGetExercises";

interface AddedExercise {
  exercise: Exercise;
  targetSets: number;
}

interface Props {
  onClose: () => void;
}

export function CreateTemplateSheet({ onClose }: Props) {
  const { mutate: createTemplate, isPending } = useCreateTemplate();
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<AddedExercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const canSave = name.trim().length > 0 && exercises.length > 0;

  const handleClose = () => {
    if (isPending) return;
    setClosing(true);
    setTimeout(onClose, 250);
  };

  const handleAddExercises = (newExercises: Exercise[]) => {
    const toAdd = newExercises.map((ex) => ({ exercise: ex, targetSets: 3 }));
    setExercises([...exercises, ...toAdd]);
  };

  const handleRemove = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSetsChange = (index: number, delta: number) => {
    setExercises(
      exercises.map((item, i) => {
        if (i !== index) return item;
        const next = item.targetSets + delta;
        return { ...item, targetSets: Math.max(1, Math.min(10, next)) };
      }),
    );
  };

  const handleDragEnd = () => {
    if (
      dragIndex !== null &&
      dragOverIndex !== null &&
      dragIndex !== dragOverIndex
    ) {
      const updated = [...exercises];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(dragOverIndex, 0, moved);
      setExercises(updated);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleSave = () => {
    if (!canSave) return;
    createTemplate(
      {
        name: name.trim(),
        exercises: exercises.map((item) => ({
          exerciseId: item.exercise._id,
          targetSets: item.targetSets,
        })),
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-250 ${closing ? "opacity-0" : "opacity-100"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-panel w-full max-w-[520px] mx-auto bg-[#0d0d12] border-t border-l border-r border-[#1e1e28] rounded-t-[28px] px-5 pb-[90px] max-h-[90vh] flex flex-col"
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

        {showPicker ? (
          <ExercisePicker
            alreadyAddedIds={exercises.map((e) => e.exercise._id)}
            onAdd={(selected) => {
              handleAddExercises(selected);
              setShowPicker(false);
            }}
            onBack={() => setShowPicker(false)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-1.5 pt-2.5 pb-4 shrink-0">
              <div>
                <p className="text-[11px] font-bold text-[#44445a] tracking-[0.1em] uppercase mb-1.5">
                  New
                </p>
                <h2 className="text-[24px] font-black text-[#f0f0f5] tracking-[-0.04em] leading-[1.1] m-0">
                  Create Template
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-[12px] bg-[#13131a] border border-[#1e1e28] flex items-center justify-center text-[#8b8b9a] hover:text-[#f0f0f5] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Name Input */}
            <div className="shrink-0 mb-4">
              <label className="text-[11px] font-bold text-[#6b6b80] uppercase tracking-[0.06em] mb-2 block">
                Template Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Push Day"
                maxLength={100}
                className="w-full bg-[#13131a] border border-[#1e1e28] rounded-[14px] px-4 py-[12px] text-[14px] text-[#f0f0f5] placeholder-[#33334a] outline-none focus:border-[#2a2a38] transition-colors"
              />
            </div>

            {/* Exercises List */}
            <div className="overflow-y-auto flex-1 mb-4">
              <label className="text-[11px] font-bold text-[#6b6b80] uppercase tracking-[0.06em] mb-2 block">
                Exercises ({exercises.length})
              </label>

              {exercises.length === 0 && (
                <p className="text-[12px] text-[#44445a] py-4 text-center">
                  No exercises added yet
                </p>
              )}

              <div className="flex flex-col gap-[6px]">
                {exercises.map((item, i) => {
                  const c = getMuscleColor(item.exercise.muscleGroup);
                  return (
                    <div
                      key={item.exercise._id}
                      draggable
                      onDragStart={() => setDragIndex(i)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIndex(i);
                      }}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-2 py-[12px] px-[14px] rounded-[14px] bg-[#0f0f15] transition-all duration-100 ${
                        dragOverIndex === i && dragIndex !== i
                          ? "border-t-2 border-[#7b9dff]"
                          : "border-t-2 border-transparent"
                      } ${dragIndex === i ? "opacity-40" : ""}`}
                    >
                      {/* Drag handle */}
                      <div className="shrink-0 cursor-grab active:cursor-grabbing touch-none py-1 px-0.5">
                        <svg
                          width="10"
                          height="16"
                          viewBox="0 0 10 16"
                          fill="none"
                        >
                          <circle cx="2.5" cy="2.5" r="1.2" fill="#44445a" />
                          <circle cx="7.5" cy="2.5" r="1.2" fill="#44445a" />
                          <circle cx="2.5" cy="8" r="1.2" fill="#44445a" />
                          <circle cx="7.5" cy="8" r="1.2" fill="#44445a" />
                          <circle cx="2.5" cy="13.5" r="1.2" fill="#44445a" />
                          <circle cx="7.5" cy="13.5" r="1.2" fill="#44445a" />
                        </svg>
                      </div>

                      {/* Exercise info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#e0e0ea] tracking-tight truncate">
                          {item.exercise.name}
                        </p>
                        <span
                          className="inline-block mt-1 text-[8.5px] font-bold tracking-[0.04em] uppercase px-[6px] py-[1.5px] rounded-[5px] border"
                          style={{
                            background: c.bg,
                            color: c.text,
                            borderColor: c.border,
                          }}
                        >
                          {formatMuscle(item.exercise.muscleGroup)}
                        </span>
                      </div>

                      {/* Sets stepper */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleSetsChange(i, -1)}
                          className="w-7 h-7 rounded-[8px] bg-[#1a1a24] border border-[#24242e] flex items-center justify-center text-[#6b6b80] hover:text-[#f0f0f5] transition-colors"
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 12h14"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <span className="w-6 text-center text-[14px] font-black text-[#f0f0f5] tabular-nums">
                          {item.targetSets}
                        </span>
                        <button
                          onClick={() => handleSetsChange(i, 1)}
                          className="w-7 h-7 rounded-[8px] bg-[#1a1a24] border border-[#24242e] flex items-center justify-center text-[#6b6b80] hover:text-[#f0f0f5] transition-colors"
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 5v14M5 12h14"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(i)}
                        className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[#44445a] hover:text-[#ef4444] transition-colors"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add Exercise Button */}
              <button
                onClick={() => setShowPicker(true)}
                className="w-full mt-3 py-[12px] rounded-[14px] border border-dashed border-[#24242e] text-[#7b9dff] text-[13px] font-bold tracking-tight flex items-center justify-center gap-2 hover:bg-[rgba(123,157,255,0.05)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Add Exercise
              </button>
            </div>

            {/* Save Button */}
            <div className="shrink-0 pt-2 pb-2">
              <button
                onClick={handleSave}
                disabled={!canSave || isPending}
                className={`
                  w-full py-[15px] rounded-[14px] text-[15px] font-extrabold tracking-tight
                  transition-all duration-150
                  ${
                    canSave && !isPending
                      ? "bg-[#4ade80] text-[#0b0b10] hover:bg-[#5eebb0] active:scale-[0.98]"
                      : "bg-[#1a1a24] text-[#44445a] cursor-not-allowed"
                  }
                `}
              >
                {isPending ? "Saving…" : "Save Template"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
