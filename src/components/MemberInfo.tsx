import { GuildMember } from "@prisma/client";
import { BiRename } from "react-icons/bi";
import { IoCreate } from "react-icons/io5";
import { MdAccessTimeFilled } from "react-icons/md";
import { SiGooglemessages } from "react-icons/si";
import { CONVERSIONS } from "../utils/conversions";
import { trpc } from "../utils/trpc";
import Stat from "./Stat";
import Panel from "./ui/Panel";
import Image from "next/image";

const MemberInfo = ({ member }: { member: GuildMember }) => {
  const {
    data: user,
    isLoading,
    isError,
  } = trpc.user.get.useQuery(member.userID as string, {});

  if (isLoading) {
    return (
      <Panel classNames="bg-white">
        <h2>Loading user...</h2>
      </Panel>
    );
  }
  if (isError) {
    return (
      <Panel classNames="bg-white">
        <h2>Error loading user...</h2>
      </Panel>
    );
  }

  const level = CONVERSIONS.HOURS_TO_LEVEL(member.hoursActive);
  const hoursToCurrentLevel = CONVERSIONS.LEVEL_TO_HOURS(level);
  const progression =
    (member.hoursActive - hoursToCurrentLevel) /
    (CONVERSIONS.LEVEL_TO_HOURS(level + 1) - hoursToCurrentLevel);

  return (
    <Panel classNames="bg-white">
      <div className="flex gap-2">
        {user.avatarURL && (
          <div className="hidden sm:block">
            <Image
              src={user.avatarURL}
              width={75}
              height={75}
              alt="profile picture"
              className=" rounded-full "
            />
          </div>
        )}
        <h2 className="flex content-center items-center text-3xl font-semibold">
          {member.nickname ?? user.username}
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

      <div className="grid justify-center gap-3 text-xl sm:grid-cols-2 md:grid-cols-3">
        <Stat
          prefix={<IoCreate />}
          value={member.joinedAt.toLocaleDateString()}
          tooltip="Joined at"
        />
        <Stat prefix={<BiRename />} value={user.username} tooltip="Username" />
        <Stat
          prefix={<SiGooglemessages />}
          value={member.messagesSent}
          tooltip="Messages sent"
        />
        <Stat
          prefix={<MdAccessTimeFilled />}
          value={Math.round(member.hoursActive)}
          tooltip="Hours active"
        />
      </div>
    </Panel>
  );
};

export default MemberInfo;
