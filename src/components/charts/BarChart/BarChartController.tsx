import React, { Dispatch, useEffect, useMemo } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { trpc } from '../../../utils/trpc';
import ClickOutsideListener from '../../common/ClickOutsideListener';
import Panel from '../../common/Panel';
import BarChart from './BarChart';
import Chart from '../elements/Chart';

const BarChartController = ({ guildId }: { guildId: string }) => {
  const { data, isLoading, isError } = trpc.chart.levels.useQuery(
    { guildId },
    {
      onSuccess: (data) => {
        return data.sort((a, b) => +a.level - +b.level);
      },
    }
  );
  const levels = useMemo(() => data?.sort((a, b) => +a.level - +b.level), [data]);

  const maxLevel = useMemo(() => {
    if (!levels) {
      return 0;
    }

    return Math.max(...levels.map((level) => +level.level));
  }, [levels]);

  const [levelsToInclude, setLevelsToInclude] = React.useState<string[]>([]);

  useEffect(() => {
    setLevelsToInclude(
      Array.from({ length: maxLevel }, (_, i) => (i + 1).toString()).filter((level) => +level > 1)
    );
  }, [maxLevel]);

  if (isLoading) {
    return (
      <ImSpinner8
        size={100}
        className="custom-animate-spin absolute top-1/2 left-1/2 text-slate-900 opacity-60"
      />
    );
  }

  if (isError) {
    return <>Error</>;
  }

  return (
    <>
      <div className="z-10 flex justify-center">
        <Panel className="flex flex-1  gap-3 bg-slate-300" style={{ maxWidth: 960 }}>
          <p className="flex items-center text-2xl">Filters: </p>

          <Filters
            maxLevel={maxLevel}
            levelsToInclude={levelsToInclude}
            setLevelsToInclude={setLevelsToInclude}
          />
        </Panel>
      </div>

      <div className="flex-1">
        <Chart margin={{ top: 20, right: 20, bottom: 75, left: 75 }} minWidth={600} minHeight={300}>
          <BarChart
            levels={levels?.filter((level) => levelsToInclude.includes(level.level)) ?? []}
          />
        </Chart>
      </div>
    </>
  );
};

export default BarChartController;

const Filters = ({
  maxLevel,
  levelsToInclude,
  setLevelsToInclude,
}: {
  maxLevel: number;
  levelsToInclude: string[];
  setLevelsToInclude: Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        className={`cursor-pointer rounded-md bg-slate-300 p-2 transition hover:bg-slate-400 ${
          isPanelOpen && 'bg-slate-400'
        }`}
        onClick={() => setIsPanelOpen((prev) => !prev)}
      >
        Levels to include
      </button>

      {isPanelOpen && (
        <ClickOutsideListener onClickOutside={() => setIsPanelOpen(false)}>
          <Panel className="absolute left-0 top-full h-fit w-full bg-white bg-opacity-100">
            {Array.from({ length: maxLevel }, (_, i) => i + 1).map((level) => (
              <p key={level} className="mx-1 flex gap-3">
                <input
                  className="bg-red-100"
                  type="checkbox"
                  checked={levelsToInclude.includes(level.toString())}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setLevelsToInclude((prev) => [...prev, level.toString()]);
                    } else {
                      setLevelsToInclude((prev) => prev.filter((l) => l !== level.toString()));
                    }
                  }}
                  id={level.toString()}
                />{' '}
                <label htmlFor={level.toString()}> Level {level}</label>{' '}
              </p>
            ))}
          </Panel>
        </ClickOutsideListener>
      )}
    </div>
  );
};
