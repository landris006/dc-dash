import { useRouter } from 'next/router';
import Image from 'next/image';
import { trpc } from '../../utils/trpc';
import BackToServers from './BackToServers';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();
  const guildID = router.query.guildID as string;
  const { data: guild, isLoading, isError } = trpc.guild.get.useQuery(guildID);

  if (isError) {
    return (
      <>
        <h2>Could not load guild...</h2>
        <BackToServers />
      </>
    );
  }

  return (
    <header className="bg-gray-300 bg-opacity-[0.45] p-3 text-black backdrop-blur-md">
      <div className="container mx-auto flex-wrap justify-between px-3 sm:flex">
        <div className="mb-3 flex items-center gap-3 sm:mb-0">
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

          <p className="ml-3 text-2xl text-slate-600 hover:text-slate-800">
            {router.route.includes('charts') ? (
              <Link href={`/guild/${guildID}/stats`}>Stats</Link>
            ) : (
              <Link href={`/guild/${guildID}/charts`}>Charts</Link>
            )}
          </p>
        </div>

        <BackToServers />
      </div>
    </header>
  );
};

export default Header;
