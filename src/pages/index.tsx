import type { NextPage } from 'next';
import Link from 'next/link';
import ListItem from '../components/common/ListItem';
import { trpc } from '../utils/trpc';
import Image from 'next/image';
import { ImSpinner8 } from 'react-icons/im';

const Home: NextPage = () => {
  const { data: guilds, isLoading, isError } = trpc.guild.getAll.useQuery();

  const Servers = () => {
    if (isLoading) {
      return (
        <p className="flex gap-3">
          <ImSpinner8 className="animate-spin" />
          <span>Loading servers...</span>
        </p>
      );
    }
    if (isError) {
      return <p>Could not load servers...</p>;
    }

    return (
      <>
        {guilds.map((guild) => (
          <ListItem key={guild.id}>
            <div className="flex flex-wrap gap-3">
              <Link href={`/guild/${guild.id}`}>{guild.name}</Link>
              <Image
                src={guild.iconURL ?? ''}
                width={50}
                height={50}
                alt="guild icon"
              />
            </div>
          </ListItem>
        ))}
      </>
    );
  };

  return (
    <main className="flex h-screen items-center justify-center text-5xl text-black dark:text-slate-200">
      <div className="min-w rounded-md bg-gray-300 bg-opacity-[0.45] p-5 dark:bg-opacity-[0.15] sm:px-24 sm:py-10">
        <h2 className="mb-10 text-8xl underline">Servers</h2>
        <ul className="flex flex-col gap-2">
          <Servers />
        </ul>
      </div>
    </main>
  );
};

export default Home;
