interface StatCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  subtitle: React.ReactNode;
  subtitleColor?: string;
}

export function StatCard({
  label,
  value,
  unit,
  subtitle,
  subtitleColor,
}: StatCardProps) {
  return (
    <div className="bg-[#121216] border border-[#1a1a20] rounded-[16px] p-4">
      <p className="text-[11px] text-[#8b8b9a] mb-3">{label}</p>
      <div className="flex items-baseline gap-[6px] mb-2">
        <p className="text-[30px] font-extrabold leading-[1]">{value}</p>
        {unit && <span className="text-[12px] text-[#8b8b9a]">{unit}</span>}
      </div>
      <p className={`text-[11px] ${subtitleColor ?? "text-[#8b8b9a]"}`}>
        {subtitle}
      </p>
    </div>
  );
}
