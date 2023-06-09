import { ScaleBand, ScaleLinear } from 'd3';
import { useRouter } from 'next/router';
import React, { useContext, useMemo, useState } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { CONVERSIONS } from '../../../utils/conversions';
import { trpc } from '../../../utils/trpc';
import ClickOutsideListener from '../../common/ClickOutsideListener';
import ListItem from '../../common/ListItem';
import Modal from '../../common/Modal';
import Panel from '../../common/Panel';
import { ChartContext } from './ChartContext';
import Tooltip from './Tooltip';
import Image from 'next/image';
import MemberInfo from '../../list/MemberInfo';

const Bars = ({
  data,
  xScale,
  yScale,
}: {
  data: { level: string; frequency: number }[];
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number, never>;
}) => {
  const { margin, innerHeight, setAllowInteractions } = useContext(ChartContext);

  const [tooltipData, setTooltipData] = useState<{
    level: string;
    frequency: number;
  }>();
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(undefined);

  const onClose = () => {
    setSelectedLevel(undefined);
    setAllowInteractions(true);
  };

  const frequencySum = useMemo(() => data.reduce((acc, curr) => acc + curr.frequency, 0), [data]);

  return (
    <>
      <Tooltip>
        {tooltipData && (
          <div className="rounded-md bg-violet-400 bg-opacity-80 p-3 text-xl backdrop-blur-md">
            <p>Level: {tooltipData.level}</p>
            <p>Frequency: {tooltipData.frequency}</p>
            <p>Ratio: {Math.round((tooltipData.frequency / frequencySum) * 100)} %</p>
          </div>
        )}
      </Tooltip>

      <Modal isOpen={!!selectedLevel} onClose={onClose}>
        <ClickOutsideListener onClickOutside={onClose}>
          <Panel className="w-[90vw] bg-white bg-opacity-100 text-xl md:w-fit md:min-w-[24rem]">
            <div className="flex gap-3">
              <h2 className="text-2xl font-semibold">Members</h2>

              <span
                className="flex items-center rounded-full px-2 py-1 text-sm font-semibold text-black"
                style={{
                  backgroundColor: CONVERSIONS.LEVEL_TO_COLOR(selectedLevel ?? 0),
                  opacity: 0.8,
                }}
              >
                Level {selectedLevel}
              </span>
            </div>

            <hr className="my-1 h-[2px] rounded bg-black" />

            <List level={selectedLevel ?? 1} />
          </Panel>
        </ClickOutsideListener>
      </Modal>

      {data.map(({ level, frequency }) => (
        <g
          key={level}
          onMouseEnter={() =>
            setTooltipData({
              level,
              frequency,
            })
          }
          onMouseLeave={() => setTooltipData(undefined)}
          onClick={() => {
            setSelectedLevel(+level);
            setAllowInteractions(false);
          }}
          className="cursor-pointer opacity-60 hover:opacity-80"
        >
          <rect
            key={level}
            x={(xScale(level) ?? 0) - (xScale.padding() * xScale.bandwidth()) / 2}
            y={innerHeight - yScale(frequency)}
            width={xScale.bandwidth() + xScale.padding() * xScale.bandwidth() + 2}
            height={yScale(frequency) + margin.bottom}
            fill="transparent"
          ></rect>

          <rect
            x={xScale(level)}
            y={innerHeight - yScale(frequency)}
            width={xScale.bandwidth()}
            height={yScale(frequency)}
            fill={CONVERSIONS.LEVEL_TO_COLOR(+level)}
          ></rect>
        </g>
      ))}
    </>
  );
};

export default Bars;

const List = ({ level }: { level: number }) => {
  const guildID = useRouter().query.guildID as string;
  const [selectedID, setSelectedID] = useState<string | null>(null);

  const onClose = () => {
    setSelectedID(null);
  };

  const {
    data: members,
    isLoading,
    isError,
  } = trpc.guildMember.getAllInGuildWithLevel.useQuery({
    guildID,
    level,
  });

  if (isError) {
    return <p>Could not load members...</p>;
  }

  if (isLoading) {
    return <ImSpinner8 className="animate-spin" />;
  }

  return (
    <>
      <Modal
        className="flex items-center justify-center"
        blurBackground={false}
        isOpen={!!selectedID}
        onClose={() => setSelectedID(null)}
      >
        {selectedID && (
          <ClickOutsideListener onClickOutside={onClose}>
            <MemberInfo id={selectedID} />
          </ClickOutsideListener>
        )}
      </Modal>

      <ul className="flex max-h-[80vh] flex-col gap-1 overflow-y-auto">
        {members.map((member) => (
          <ListItem key={member.id} onClick={() => setSelectedID(member.id)}>
            <div className="flex items-center gap-3">
              <Image
                src={member.user.avatarURL ?? '/default-avatar.png'}
                alt="profile picture"
                width={40}
                height={40}
                className="rounded-full"
              />

              {member.nickname ?? member.user.username}
            </div>
          </ListItem>
        ))}
      </ul>
    </>
  );
};
