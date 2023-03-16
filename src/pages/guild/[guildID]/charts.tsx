import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import BarChartController from '../../../components/charts/BarChart/BarChartController';
import ActivityChartController from '../../../components/charts/ActivityChart/ActivityChartController';
import Panel from '../../../components/common/Panel';
import Header from '../../../components/header/Header';
import NavList from '../../../components/common/NavList';

const Charts: NextPage = () => {
  const router = useRouter();
  const guildID = router.query.guildID as string | undefined;
  const [selectedChart, setSelectedChart] =
    useState<keyof ReturnType<typeof routes>>('Levels');

  if (!guildID) {
    return <>Loading...</>;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="container mx-auto my-3 flex max-w-7xl flex-1 flex-col items-stretch gap-3 px-3 md:flex-row">
        <Panel className="flex w-full flex-1 flex-col  gap-3 bg-slate-300 md:px-16">
          <Panel className="mx-auto h-min w-auto bg-slate-100">
            <nav className="text-2xl">
              <NavList
                items={Object.keys(routes(guildID))}
                onSelect={(selectedChart) =>
                  setSelectedChart(
                    selectedChart as keyof ReturnType<typeof routes>
                  )
                }
              />
            </nav>
          </Panel>

          {routes(guildID)[selectedChart]}
        </Panel>
      </main>
    </div>
  );
};

export default Charts;

const routes = (guildID: string) => ({
  Levels: <BarChartController guildID={guildID} />,
  Activity: <ActivityChartController guildID={guildID} />,
  Time: <div>coming soon</div>,
});
