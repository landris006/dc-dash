import React from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { trpc } from '../../../utils/trpc';
import Chart from '../elements/Chart';
import ActivityChart from './ActivityChart';

const ActivityChartController = ({ guildID }: { guildID: string }) => {
  const {
    data: connections,
    isLoading,
    isError,
  } = trpc.chart.activity.useQuery({ guildID });

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
    <Chart margin={{ top: 20, right: 85, bottom: 75, left: 85 }} minWidth={600}>
      <ActivityChart connections={connections} />;
    </Chart>
  );
};

export default ActivityChartController;
