import React, { Dispatch, useEffect, useMemo } from 'react';
import { trpc } from '../../utils/trpc';
import Panel from '../common/Panel';
import BarChart, { dimensions } from './BarChart';

const BarChartController = ({ guildID }: { guildID: string }) => {
  const {
    data: levels,
    isLoading,
    isError,
  } = trpc.chart.levels.useQuery(
    { guildID },
    {
      onSuccess: (data) => {
        data.sort((a, b) => +a.level - +b.level);
      },
    }
  );

  const maxLevel = useMemo(() => {
    if (!levels) {
      return 0;
    }

    return Math.max(...levels.map((level) => +level.level));
  }, [levels]);

  const [levelsToInclude, setLevelsToInclude] = React.useState<string[]>([]);

  useEffect(() => {
    setLevelsToInclude(
      Array.from({ length: maxLevel }, (_, i) => (i + 1).toString()).filter(
        (level) => +level > 1
      )
    );
  }, [maxLevel]);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>Error</>;
  }

  return (
    <>
      <div className="flex justify-center">
        <Panel
          className="flex flex-1  gap-3 bg-slate-300"
          style={{ maxWidth: dimensions.width }}
        >
          <p className="flex items-center text-2xl">Filters: </p>

          <Filters
            maxLevel={maxLevel}
            levelsToInclude={levelsToInclude}
            setLevelsToInclude={setLevelsToInclude}
          />
        </Panel>
      </div>

      <div>
        <BarChart
          levels={levels.filter((level) =>
            levelsToInclude.includes(level.level)
          )}
        />
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
        className={` cursor-pointer rounded-md bg-slate-300 p-2 transition hover:bg-slate-400 ${
          isPanelOpen && 'bg-slate-400'
        }`}
        onClick={() => setIsPanelOpen((prev) => !prev)}
      >
        Levels to include
      </button>

      {isPanelOpen && (
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
                    setLevelsToInclude((prev) =>
                      prev.filter((l) => l !== level.toString())
                    );
                  }
                }}
                id={level.toString()}
              />{' '}
              <label htmlFor={level.toString()}> Level {level}</label>{' '}
            </p>
          ))}
        </Panel>
      )}
    </div>
  );
};
