import type { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Image from 'next/image';
import Statistics from '../../components/Statistics';
import Highlights from '../../components/Highlights';
import Members from '../../components/Members';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import ChannelStatus from '../../components/ChannelStatus';

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

const Header = () => {
  const router = useRouter();
  const guildID = router.query.guildID as string;
  const { data: guild, isLoading, isError } = trpc.guild.get.useQuery(guildID);

  if (isError) {
    return <h2>Could not load guild...</h2>;
  }

  return (
    <header className="bg-gray-300 bg-opacity-[0.45] p-3 text-black backdrop-blur-md">
      <div className="container mx-auto flex-wrap justify-between px-3 sm:flex">
        <div className="mb-3 flex gap-3 sm:mb-0">
          <h2 className="flex items-center text-4xl">
            {isLoading ? 'Loading guild...' : guild.name}
          </h2>

          <div className="hidden items-center justify-center sm:flex">
            {guild?.iconURL && (
              <Image
                // TODO: default image
                src={guild.iconURL}
                width={50}
                height={50}
                alt="guild icon"
              />
            )}
          </div>
        </div>

        <BackToServers router={router} />
      </div>
    </header>
  );
};

const BackToServers = ({ router }: { router: NextRouter }) => {
  return (
    <div
      className="flex cursor-pointer items-center text-slate-600 hover:text-slate-800"
      onClick={() => router.push('/')}
    >
      <p className="flex items-center text-2xl">Back to servers</p>
      <BsFillDoorOpenFill size={30} />
    </div>
  );
};

export default Server;
