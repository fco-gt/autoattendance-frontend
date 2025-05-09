export const getDayNames = (days: number[]) => {
  const dayMap: Record<number, string> = {
    0: "Dom",
    1: "Lun",
    2: "Mar",
    3: "Mié",
    4: "Jue",
    5: "Vie",
    6: "Sáb",
  };

  return days
    .sort()
    .map((day) => dayMap[day])
    .join(", ");
};
