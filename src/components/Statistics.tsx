import { trpc } from "../utils/trpc";
import Panel from "./ui/Panel";
import { BsFillPersonFill } from "react-icons/bs";
import { MdAccessTimeFilled } from "react-icons/md";
import { MdPhoneCallback } from "react-icons/md";
import { SiGooglemessages } from "react-icons/si";
import Stat from "./Stat";
import { IoCreate } from "react-icons/io5";

interface Props {
  guildID: string;
}

const Statistics = ({ guildID }: Props) => {
  const { data: stats, isError } = trpc.guild.getStats.useQuery(
    guildID as string
  );

  if (isError) {
    return <h2>Could not load stats...</h2>;
  }

  return (
    <Panel bgColor="bg-blue-200" classNames="bg-blue-200">
      <div className="mb-5">
        <h2 className="text-3xl font-semibold">Stats</h2>
        <hr className="h-1 rounded bg-black" />
      </div>

      <div className="flex flex-wrap gap-3 text-xl sm:flex-nowrap">
        <Stat
          prefix={<BsFillPersonFill />}
          value={stats?.totalMembers}
          tooltip="Total members"
        />
        <Stat
          prefix={<MdAccessTimeFilled />}
          value={
            stats?.totalTimeConnected && Math.round(stats.totalTimeConnected)
          }
          suffix="hrs"
          tooltip="Total time connected"
        />
        <Stat
          prefix={<MdPhoneCallback />}
          value={stats?.totalConnections}
          tooltip="Total voice connections"
        />
        <Stat
          prefix={<SiGooglemessages />}
          value={stats?.totalMessages}
          tooltip="Total messages sent"
        />
        <Stat
          prefix={<IoCreate />}
          value={stats?.createdAt?.toLocaleDateString()}
          tooltip="Created at"
        />
      </div>
    </Panel>
  );
};

export default Statistics;
