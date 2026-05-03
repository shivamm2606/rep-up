import type { IWorkoutSession } from "../../types/workoutSession.types";

function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return new Date(dateStr).toLocaleDateString();
}

interface LastSessionCardProps {
  session: IWorkoutSession | null;
}

export function LastSessionCard({ session }: LastSessionCardProps) {
  if (!session) {
    return (
      <div className="bg-[#121216] border border-[#1a1a20] rounded-[16px] p-4">
        <p className="text-[13px] text-[#8b8b9a] text-center py-3">
          No sessions yet - start your first workout!
        </p>
      </div>
    );
  }

  const exerciseCount = session.exercises?.length ?? 0;
  const totalSets =
    session.exercises?.reduce((sum, ex) => sum + (ex.sets?.length ?? 0), 0) ??
    0;

  return (
    <div className="bg-[#121216] border border-[#1a1a20] rounded-[16px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-[#8b8b9a] uppercase tracking-[0.09em] mb-3">
            Most recent workout
          </p>
          <p className="text-[16px] font-extrabold tracking-[-0.025em] leading-[1.2] truncate">
            {session.name ?? "Unnamed Session"}
          </p>
          <p className="text-[11px] text-[#8b8b9a] mt-[6px]">
            {getRelativeDate(session.date)}
          </p>
        </div>

        {exerciseCount > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-[20px] font-black leading-[1]">
              {exerciseCount}
            </p>
            <p className="text-[10px] text-[#8b8b9a] mt-1">
              {exerciseCount === 1 ? "exercise" : "exercises"}
            </p>
            <p className="text-[10px] text-[#8b8b9a]">
              {totalSets} {totalSets === 1 ? "set" : "sets"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
