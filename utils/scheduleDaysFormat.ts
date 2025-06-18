export const getDayNames = (days: number[]) => {
  const dayMap: Record<number, string> = {
    1: "Lun",
    2: "Mar",
    3: "Mié",
    4: "Jue",
    5: "Vie",
    6: "Sáb",
    7: "Dom",
  };

  return days
    .sort((a, b) => a - b)
    .map((day) => dayMap[day])
    .join(", ");
};
