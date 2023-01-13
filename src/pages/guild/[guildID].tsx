import type { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Image from 'next/image';
import Statistics from '../../components/Statistics';
import Highlights from '../../components/Highlights';
import Members from '../../components/Members';
import { BsFillDoorOpenFill } from 'react-icons/bs';

const Header = () => {
  const router = useRouter();
  const guildID = router.query.guildID as string;
  const { data: guild, isLoading, isError } = trpc.guild.get.useQuery(guildID);

  if (isError) {
    return <h2>Could not load guild...</h2>;
  }

  return (
    <header className="bg-gray-300 p-3 text-black">
      <div className="container mx-auto flex-wrap justify-between px-3 sm:flex">
        <div className="mb-3 flex gap-3 sm:mb-0">
          <h2 className="text-4xl">
            {isLoading ? 'Loading guild...' : guild.name}
          </h2>

          <div className=" hidden items-center justify-center sm:flex">
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

      <main className="container mx-auto flex flex-1 flex-col px-3 pb-3">
        <div className="my-3 flex-wrap gap-3 md:flex">
          <div className="mb-3 flex-1 md:mb-0">
            <Statistics />
          </div>
          <div className="flex-1">
            <Highlights />
          </div>
        </div>

        <Members />
      </main>
    </div>
  );
};

const BackToServers = ({ router }: { router: NextRouter }) => {
  return (
    <div
      className="flex cursor-pointer items-center"
      onClick={() => router.push('/')}
    >
      <p className="flex items-center text-2xl text-slate-600 hover:text-black">
        Back to servers
      </p>
      <BsFillDoorOpenFill size={30} className={'fill-slate-600'} />
    </div>
  );
};

export default Server;
