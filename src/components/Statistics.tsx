import { trpc } from '../utils/trpc';
import Panel from './ui/Panel';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdAccessTimeFilled } from 'react-icons/md';
import { MdPhoneCallback } from 'react-icons/md';
import { SiGooglemessages } from 'react-icons/si';
import Stat from './Stat';
import { IoCreate } from 'react-icons/io5';
import RefreshButton from './RefreshButton';
import { useRouter } from 'next/router';
import { CONVERSIONS } from '../utils/conversions';

const Statistics = () => {
  const guildID = useRouter().query.guildID as string;
  const {
    data: stats,
    isError,
    isLoading,
  } = trpc.guild.getStats.useQuery(guildID as string);
  const utils = trpc.useContext();

  return (
    <Panel bgColor="bg-blue-200" classNames="bg-blue-200">
      <div className="mb-5">
        <h2 className="text-3xl font-semibold">Stats</h2>
        <hr className="h-1 rounded bg-black" />
      </div>

      <div className="grid grid-cols-2 justify-items-center gap-3 text-xl sm:flex sm:flex-nowrap">
        {isError ? (
          <div className="flex items-center gap-3">
            <p className="text-xl">Could not load stats...</p>{' '}
            <RefreshButton
              isLoading={isLoading}
              onClick={() => utils.guild.getStats.invalidate()}
            />
          </div>
        ) : (
          <>
            <Stat
              prefix={<BsFillPersonFill />}
              value={stats?.totalMembers}
              tooltipText="Total members"
            />
            <Stat
              prefix={<MdAccessTimeFilled />}
              value={
                stats?.totalTimeConnected &&
                Math.round(
                  stats.totalTimeConnected * CONVERSIONS.MILISECONDS_TO_HOURS
                )
              }
              suffix="hrs"
              tooltipText="Total time connected"
            />
            <Stat
              prefix={<MdPhoneCallback />}
              value={stats?.totalConnections}
              tooltipText="Total voice connections"
            />
            <Stat
              prefix={<SiGooglemessages />}
              value={stats?.totalMessages}
              tooltipText="Total messages sent"
            />
            <Stat
              prefix={<IoCreate />}
              value={stats?.createdAt?.toLocaleDateString()}
              tooltipText="Created at"
            />
          </>
        )}
      </div>
    </Panel>
  );
};

export default Statistics;
