import React from 'react';
import Panel from './common/Panel';
import Stat from './Stat';
import { GiGrowth } from 'react-icons/gi';
import { trpc } from '../utils/trpc';
import { SiGooglemessages } from 'react-icons/si';
import { MdAccessTimeFilled } from 'react-icons/md';
import { CONVERSIONS } from '../utils/conversions';
import { useRouter } from 'next/router';

const Highlights = () => {
  const guildID = useRouter().query.guildID as string;

  const {
    data: highlights,
    isLoading,
    isError,
  } = trpc.guild.getHighlights.useQuery(guildID);

  return (
    <Panel className="bg-rose-200">
      <div className=" mb-5">
        <h2 className="text-3xl font-semibold">Highlights</h2>
        <hr className="h-1 rounded bg-black" />
      </div>

      <div className="clex-col flex flex-wrap gap-3 px-3 text-xl sm:flex-row ">
        {isError ? (
          <div className="flex items-center gap-3">
            <p className="text-xl">Could not load highlights...</p>{' '}
          </div>
        ) : (
          <>
            <Stat
              prefix={<GiGrowth />}
              value={
                highlights?.mostTimeConnected?.miliseconds &&
                CONVERSIONS.HOURS_TO_LEVEL(
                  highlights?.mostTimeConnected?.miliseconds *
                    CONVERSIONS.MILISECONDS_TO_HOURS
                )
              }
              suffix={`(${highlights?.mostTimeConnected?.nickname})`}
              tooltipText="Highest level member"
            />
            <Stat
              prefix={<SiGooglemessages />}
              value={highlights?.mostMessages?.count}
              suffix={`(${highlights?.mostMessages?.nickname})`}
              tooltipText="Most messages sent"
            />
            <Stat
              prefix={<MdAccessTimeFilled />}
              value={
                isLoading
                  ? undefined
                  : highlights?.oldestMember?.date.toLocaleDateString()
              }
              suffix={`(${highlights?.oldestMember?.nickname})`}
              tooltipText="Oldest member"
            />
          </>
        )}
      </div>
    </Panel>
  );
};

export default Highlights;
