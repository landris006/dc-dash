import React from 'react';
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

  const [ignoreLevel1, setIgnoreLevel1] = React.useState(true);

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
          className="flex flex-1 items-center gap-3 bg-slate-300"
          style={{ maxWidth: dimensions.width }}
        >
          <p className="text-2xl">Filter</p>

          <p>
            Ignore level 1:{' '}
            <input
              type="checkbox"
              checked={ignoreLevel1}
              onChange={(e) => setIgnoreLevel1(e.target.checked)}
            />
          </p>
        </Panel>
      </div>

      <div>
        <BarChart
          levels={levels.filter(
            (level) => !(ignoreLevel1 && level.level === '1')
          )}
        />
      </div>
    </>
  );
};

export default BarChartController;
