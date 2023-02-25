import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import BarChartController from '../../../components/charts/BarChartController';
import Panel from '../../../components/common/Panel';
import Header from '../../../components/header/Header';

const Charts: NextPage = () => {
  const router = useRouter();
  const guildID = router.query.guildID as string | undefined;
  const [selectedChart, setSelectedChart] =
    useState<keyof ReturnType<typeof routes>>('Levels');
  const box = useRef<HTMLDivElement>(null);

  if (!guildID) {
    return <>Loading...</>;
  }

  const handleClick = (
    e: React.MouseEvent<HTMLLIElement>,
    selectedChartType: string
  ) => {
    if (!box.current) {
      return;
    }

    // setAnimating(true);
    box.current.animate(
      {
        left: e.currentTarget.offsetLeft + 'px',
      },
      {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards',
      }
    );

    setSelectedChart(selectedChartType as keyof ReturnType<typeof routes>);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="container mx-auto my-3 flex max-w-7xl flex-1 flex-col items-stretch gap-3 px-3 md:flex-row">
        <Panel className="flex w-full flex-col justify-between gap-3 bg-slate-300 md:px-16 lg:px-36">
          <Panel className="mx-auto h-min w-auto bg-slate-100">
            <nav className="relative flex justify-center">
              <div
                ref={box}
                className="pointer-events-none absolute left-0 h-12 w-24 rounded-md bg-slate-400"
              ></div>

              <ul className="flex gap-3 text-2xl">
                {Object.keys(routes(guildID)).map((element) => (
                  <li
                    key={element}
                    className="z-10 h-12 w-24 cursor-pointer rounded-md p-2 text-center transition hover:bg-slate-400 hover:bg-opacity-50"
                    onClick={(e) => {
                      handleClick(e, element);
                    }}
                  >
                    <span>{element}</span>
                  </li>
                ))}
              </ul>
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
  Time: <div>coming soon</div>,
  Activity: <div>coming soon</div>,
});
