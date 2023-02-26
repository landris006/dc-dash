import { GuildMember, User } from '@prisma/client';
import { BiRename } from 'react-icons/bi';
import { IoCreate } from 'react-icons/io5';
import { MdAccessTimeFilled } from 'react-icons/md';
import { SiGooglemessages } from 'react-icons/si';
import { CONVERSIONS } from '../../utils/conversions';
import Stat from '../Stat';
import Panel from '../common/Panel';
import Image from 'next/image';
import { trpc } from '../../utils/trpc';

const MemberInfo = ({
  member,
}: {
  member: GuildMember & {
    user: User;
  };
}) => {
  const { data: stats, status } = trpc.guildMember.getStats.useQuery(member.id);

  const hoursActive =
    (stats?.timeActive ?? 0) * CONVERSIONS.MILISECONDS_TO_HOURS;
  const level = CONVERSIONS.HOURS_TO_LEVEL(hoursActive);
  const hoursToCurrentLevel = CONVERSIONS.LEVEL_TO_HOURS(level);
  const progression =
    (hoursActive - hoursToCurrentLevel) /
    (CONVERSIONS.LEVEL_TO_HOURS(level + 1) - hoursToCurrentLevel);

  return (
    <Panel className="mx-auto w-[90vw] bg-white bg-opacity-100 sm:max-w-fit">
      <div className="flex gap-2 ">
        {member.user.avatarURL && (
          <div className="hidden sm:block ">
            <Image
              src={member.user.avatarURL}
              width={75}
              height={75}
              alt="profile picture"
              className=" rounded-full "
            />
          </div>
        )}
        <h2 className="flex content-center items-center text-3xl font-semibold">
          {member.nickname ?? member.user.username}
        </h2>
      </div>

      <hr className="h-1 rounded bg-black" />

      <div className="py-3">
        <div className="relative flex w-full justify-center rounded-full bg-slate-300 text-xl">
          <div
            className="absolute left-0 top-0 flex justify-center rounded-full"
            style={{
              backgroundColor: CONVERSIONS.LEVEL_TO_COLOR_MAP.get(level),
              width: `${progression * 100}%`,
            }}
          >
            {progression > 0.04 && <>&nbsp;</>}
          </div>

          <span className="z-10 font-semibold">Level {level}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 justify-center gap-3 text-xl sm:grid-cols-3">
        <Stat
          prefix={<IoCreate />}
          value={member.joinedAt.toLocaleDateString()}
          tooltipText="Joined at"
        />
        <Stat
          prefix={<BiRename />}
          value={member.user.username}
          tooltipText="Username"
        />
        <Stat
          prefix={<SiGooglemessages />}
          value={stats?.totalMessages}
          tooltipText="Messages sent"
        />
        <Stat
          prefix={<MdAccessTimeFilled />}
          value={status === 'success' ? Math.round(hoursActive) : undefined}
          tooltipText="Hours active"
        />
      </div>
    </Panel>
  );
};

export default MemberInfo;
