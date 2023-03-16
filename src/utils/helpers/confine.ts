export const confine = (value: number, bounds: [number, number]): number => {
  return Math.min(Math.max(value, bounds[0]), bounds[1]);
};
