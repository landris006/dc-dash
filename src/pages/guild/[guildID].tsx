import type { NextPage } from 'next';
import Statistics from '../../components/Statistics';
import Highlights from '../../components/Highlights';
import Members from '../../components/list/Members';
import ChannelStatus from '../../components/sidebar/ChannelStatus';
import BackToServers from '../../components/header/BackToServers';
import Header from '../../components/header/Header';
import { useRouter } from 'next/router';

const Server: NextPage = () => {
  const router = useRouter();
  const guildID = router.query.guildID as string | undefined;

  if (!guildID) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-300 p-3">
        <h2 className="mb-3 text-2xl">Invalid server id...</h2>
        <BackToServers router={router} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="container mx-auto my-3 flex flex-1 flex-col items-stretch gap-3 px-3 md:flex-row">
        <ChannelStatus guildID={guildID} />

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col items-stretch gap-3 xl:flex-row">
            <div>
              <Statistics />
            </div>
            <div className="flex-1">
              <Highlights />
            </div>
          </div>

          <div className="flex flex-1 gap-3">
            <Members />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Server;
