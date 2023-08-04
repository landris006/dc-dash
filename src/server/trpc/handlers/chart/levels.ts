import { CONVERSIONS } from '../../../../utils/conversions';
import { getTotalTime } from '../../../../utils/getTotalTime';
import { Context } from '../../context';

export const levels = async (guildId: string, ctx: Context) => {
  const guildMembers = await ctx.prisma.guildMember.findMany({
    where: {
      guildId,
    },
    include: {
      connections: {
        where: {
          NOT: { endTime: null },
        },
      },
    },
  });

  const levels = guildMembers.map((member) => {
    const totalTimeConnected = getTotalTime(member.connections);
    return CONVERSIONS.HOURS_TO_LEVEL(CONVERSIONS.MILISECONDS_TO_HOURS * totalTimeConnected);
  });

  const response = levels
    .map((level) => level.toString())
    .reduce<{ level: string; frequency: number }[]>((levels, level) => {
      const rowInTable = levels.find((row) => row.level === level);

      if (!rowInTable) {
        levels.push({
          level: level,
          frequency: 1,
        });
        return levels;
      }

      rowInTable.frequency += 1;
      return levels;
    }, []);

  Array(Math.max(...levels))
    .fill(0)
    .forEach((_, i) => {
      if (!response.find((row) => row.level === (i + 1).toString())) {
        response.push({
          level: (i + 1).toString(),
          frequency: 0,
        });
      }
    });

  return response;
};
