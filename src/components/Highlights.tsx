import React from "react";
import Panel from "./ui/Panel";
import Stat from "./Stat";
import { GiGrowth } from "react-icons/gi";
import { trpc } from "../utils/trpc";
import { SiGooglemessages } from "react-icons/si";
import { MdAccessTimeFilled } from "react-icons/md";
import { CONVERSIONS } from "../utils/conversions";

interface Props {
  guildID: string;
}
const Highlights = ({ guildID }: Props) => {
  const {
    data: guildMembers,
    isLoading,
    isError,
  } = trpc.guildMember.getAllInGuild.useQuery(guildID);

  if (isLoading || !guildMembers?.length) {
    return <h2>Loading highlights...</h2>;
  }

  if (isError || !guildMembers?.length) {
    return <h2>Could not load highlights...</h2>;
  }

  const { mostMessages, mostTimeConnected, oldestMember } = guildMembers.reduce(
    (highlights, member) => {
      if (member.messagesSent > highlights.mostMessages.count) {
        highlights.mostMessages = {
          count: member.messagesSent,
          nickname: member.nickname ?? "",
        };
      }

      if (member.hoursActive > highlights.mostTimeConnected.hours) {
        highlights.mostTimeConnected = {
          hours: member.hoursActive,
          nickname: member.nickname ?? "",
        };
      }

      if (member.joinedAt < highlights.oldestMember.date) {
        highlights.oldestMember = {
          date: member.joinedAt,
          nickname: member.nickname ?? "",
        };
      }

      return highlights;
    },
    {
      mostMessages: {
        count: 0,
        nickname: "",
      },
      mostTimeConnected: {
        hours: 0,
        nickname: "",
      },
      oldestMember: {
        date: new Date(),
        nickname: "",
      },
    }
  );

  return (
    <Panel classNames="bg-rose-200">
      <div className=" mb-5">
        <h2 className="text-3xl font-semibold">Highlights</h2>
        <hr className="h-1 rounded bg-black" />
      </div>

      <div className="flex flex-wrap gap-3 text-xl sm:flex-nowrap">
        <Stat
          prefix={<GiGrowth />}
          value={CONVERSIONS.HOURS_TO_LEVEL(mostTimeConnected.hours)}
          suffix={`(${mostTimeConnected.nickname})`}
          tooltip="Highest level member"
        />
        <Stat
          prefix={<SiGooglemessages />}
          value={mostMessages.count}
          suffix={`(${mostMessages.nickname})`}
          tooltip="Most messages sent"
        />
        <Stat
          prefix={<MdAccessTimeFilled />}
          value={oldestMember.date.toLocaleDateString()}
          suffix={`(${oldestMember.nickname})`}
          tooltip="Oldest member"
        />
      </div>
    </Panel>
  );
};

export default Highlights;
