import React from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { trpc } from '../../../utils/trpc';
import NavList from '../../common/NavList';
import Panel from '../../common/Panel';
import Chart from '../elements/Chart';
import ActivityChart from './ActivityChart';

const ActivityChartController = ({ guildId }: { guildId: string }) => {
  const [interval, setInterval] = React.useState<1 | 2 | 3>(1);
  const {
    data: connections,
    isLoading,
    isError,
    isSuccess,
  } = trpc.chart.activity.useQuery({ guildId, interval });

  return (
    <>
      <div className="z-10 flex justify-center">
        <Panel className="flex flex-1 gap-3 bg-slate-300 text-xl" style={{ maxWidth: 960 }}>
          <NavList
            items={['1d', '3d', '7d']}
            onSelect={(selectedInterval) =>
              setInterval(parseInt(selectedInterval.split('')[0] ?? '1') as typeof interval)
            }
            width={4}
            height={2}
          />
        </Panel>
      </div>

      {isLoading && (
        <ImSpinner8
          size={100}
          className="custom-animate-spin absolute top-1/2 left-1/2 text-slate-900 opacity-60"
        />
      )}

      {isError && <p>Error</p>}

      {isSuccess && (
        <Chart margin={{ top: 20, right: 85, bottom: 75, left: 85 }} minWidth={600}>
          <ActivityChart connections={connections} interval={interval} />;
        </Chart>
      )}
    </>
  );
};

export default ActivityChartController;
