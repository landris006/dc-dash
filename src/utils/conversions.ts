export const CONVERSIONS = {
  MILISECONDS_TO_HOURS: 2.77777778e-7,
  MILISECONDS_TO_SECONDS: 1e-3,

  LEVEL_TO_COLOR_MAP: new Map<number, string>([
    [0, '#FFFFFF'],
    [1, '#3498DB'],
    [2, '#2ECC71'],
    [3, '#FFFF00'],
    [4, '#E67E22'],
    [5, '#E74C3C'],
    [6, '#9B59B6'],
    [7, '#AD1457'],
    [8, '#95A5A6'],
    [9, '#E91E63'],
  ]),

  LEVEL_TO_COLOR_MAP_TAILWIND: new Map<number, string>([
    [0, 'bg-[#FFFFFF]'],
    [1, 'bg-[#3498DB]'],
    [2, 'bg-[#2ECC71]'],
    [3, 'bg-[#FFFF00]'],
    [4, 'bg-[#E67E22]'],
    [5, 'bg-[#E74C3C]'],
    [6, 'bg-[#9B59B6]'],
    [7, 'bg-[#AD1457]'],
    [8, 'bg-[#95A5A6]'],
    [9, 'bg-[#E91E63]'],
  ]),

  HOURS_TO_LEVEL: (hoursActive: number) => {
    if (hoursActive < 1) {
      return 1;
    }

    return Math.trunc(Math.log2(hoursActive)) + 1;
  },

  LEVEL_TO_HOURS: (level: number) => {
    if (level < 1) {
      return 0;
    }

    return 2 ** (level - 1);
  },
};
