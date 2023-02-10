import { useRouter } from 'next/router';
import Image from 'next/image';
import { trpc } from '../../utils/trpc';
import BackToServers from './BackToServers';
import ThemeChanger from './ThemeChanger';

const Header = () => {
  const router = useRouter();
  const guildID = router.query.guildID as string;
  const { data: guild, isLoading, isError } = trpc.guild.get.useQuery(guildID);

  if (isError) {
    return <h2>Could not load guild...</h2>;
  }

  return (
    <header
      className="bg-gray-300 bg-opacity-[0.45] p-2 text-black backdrop-blur-md
      dark:bg-opacity-[0.15] dark:text-slate-300"
    >
      <div className="container mx-auto flex-wrap justify-between px-3 sm:flex">
        <div>
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

        <ThemeChanger />
      </div>
    </header>
  );
};

export default Header;
