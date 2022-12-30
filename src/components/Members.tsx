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

  return (
    <Panel classNames="bg-white">
      <div className="flex gap-2">
        {user.avatarURL && (
          <Image
            src={user.avatarURL}
            width={50}
            height={50}
            alt="profile picture"
            className="rounded-full"
          />
        )}
        <h2 className="flex content-center items-center text-3xl font-semibold">
          {member.nickname ?? user.username}
        </h2>
      </div>
      <hr className="h-1 rounded bg-black" />
      <div className="grid justify-center gap-3 pt-3 sm:grid-cols-2 md:grid-cols-3">
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

  const {
    data: guildMembers,
    isLoading,
    isError,
  } = trpc.guildMember.getAllInGuild.useQuery(guildID as string);

  if (isLoading) {
    return <h2>Loading members...</h2>;
  }
  if (isError) {
    return <h2>Could not load members...</h2>;
  }

  return (
    <>
      <Modal classNames="" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {selectedMember && <MemberInfo member={selectedMember} />}
      </Modal>

      <Panel>
        <div className="mb-5">
          <h2 className="text-3xl font-semibold">Members</h2>
          <hr className=" h-1 rounded bg-black" />
        </div>
        <ul className="flex flex-col gap-1  text-black">
          {guildMembers.map((guildMember) => (
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
      </Panel>
    </>
  );
};

export default Members;
