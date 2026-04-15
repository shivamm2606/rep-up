export const computeCalorieGoal = ({
  height,
  currentWeight,
  gender,
  age,
  activityLevel,
  goal,
}: {
  height: number;
  currentWeight: number;
  gender: string;
  age: number;
  activityLevel: string;
  goal: string;
}) => {
  // BMR
  const base = 10 * currentWeight + 6.25 * height - 5 * age;

  const bmr =
    gender === "male" ? base + 5 : gender === "female" ? base - 161 : base;

  const activityMap: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };

  const maintenance = bmr * (activityMap[activityLevel] ?? 1.2);

  const goalMap: Record<string, number> = {
    lose_weight: -500,
    maintain: 0,
    lean_bulk: 250,
    bulk: 500,
  };

  const adjustment = goalMap[goal] ?? 0;

  return Math.round(maintenance + adjustment);
};
