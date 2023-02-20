import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import BarChartController from '../../../components/charts/BarChartController';
import Panel from '../../../components/common/Panel';
import Header from '../../../components/header/Header';

const Charts: NextPage = () => {
  const router = useRouter();
  const guildID = router.query.guildID as string | undefined;

  if (!guildID) {
    return <>Loading...</>;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="container mx-auto my-3 flex flex-1 flex-col items-stretch gap-3 px-3 md:flex-row">
        <Panel className="flex w-full flex-col justify-between gap-3 bg-slate-300">
          <nav className="flex justify-center">
            <ul className="flex gap-3 text-2xl">
              <li className="cursor-pointer rounded-md bg-slate-300 p-2 transition hover:bg-slate-400">
                Levels
              </li>
              <li className="cursor-pointer rounded-md bg-slate-300 p-2 transition hover:bg-slate-400">
                Time
              </li>
              <li className="cursor-pointer rounded-md bg-slate-300 p-2 transition hover:bg-slate-400">
                Activity
              </li>
            </ul>
          </nav>

          <BarChartController guildID={guildID} />
        </Panel>
      </main>
    </div>
  );
};

export default Charts;
