import { GuildMember } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import ListItem from "./ListItem";
import Modal from "./ui/Modal";
import Panel from "./ui/Panel";
import Image from "next/image";
import Stat from "./Stat";
import { MdAccessTimeFilled } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import { SiGooglemessages } from "react-icons/si";
import { BiRename } from "react-icons/bi";
import { CONVERSIONS } from "../utils/conversions";
import { GoSearch } from "react-icons/go";

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
              width={50}
              height={50}
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

      <div className=" py-3">
        <div className="relative flex w-full justify-center rounded-full bg-slate-300">
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

      <div className="grid justify-center gap-3 sm:grid-cols-2 md:grid-cols-3">
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

const Members = ({ guildID }: { guildID: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GuildMember>();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: guildMembers,
    isLoading,
    isError,
  } = trpc.guildMember.getAllInGuild.useQuery(guildID as string);

  if (isError) {
    return <h2>Could not load members...</h2>;
  }

  return (
    <>
      <Modal classNames="" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {selectedMember && <MemberInfo member={selectedMember} />}
      </Modal>

      <Panel>
        <div>
          <h2 className="text-3xl font-semibold">Members</h2>
          <hr className="h-1 rounded bg-black" />
        </div>

        <div className="flex items-center gap-2 py-3">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            className="h-10 rounded-md p-1 text-xl"
          />
          <GoSearch size={30} />
        </div>

        {isLoading ? (
          <h2 className="text-3xl">Loading members...</h2>
        ) : (
          <ul className="flex flex-col gap-1  text-black">
            {guildMembers
              .filter((guildMember) =>
                guildMember.nickname
                  ?.toLocaleLowerCase()
                  .includes(searchQuery.toLocaleLowerCase())
              )
              .map((guildMember) => (
                <ListItem
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedMember(guildMember);
                  }}
                  key={guildMember.userID}
                >
                  {guildMember.nickname}
                </ListItem>
              ))}
          </ul>
        )}
      </Panel>
    </>
  );
};

export default Members;
