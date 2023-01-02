import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import Statistics from "../../components/Statistics";
import Highlights from "../../components/Highlights";
import Members from "../../components/Members";

const Header = ({ guildID }: { guildID: string }) => {
  const { data: guild, isLoading, isError } = trpc.guild.get.useQuery(guildID);

  if (isError) {
    return <h2>Could not load guild...</h2>;
  }

  return (
    <header className="bg-gray-300 p-3 text-black">
      <div className="container mx-auto flex flex-wrap gap-3 lg:px-20">
        <h2 className="text-4xl">
          {isLoading ? "Loading guild..." : guild.name}
        </h2>

        <Image
          src={guild?.iconURL ?? ""}
          width={50}
          height={50}
          alt="guild icon"
        />
      </div>
    </header>
  );
};

const Server: NextPage = () => {
  const guildID = useRouter().query.guildID as string | undefined;
  if (!guildID) {
    return <h2>Could not load guild...</h2>;
  }

  return (
    <>
      <Header guildID={guildID} />
      <main className="container mx-auto lg:px-20">
        <div className="my-3 flex-wrap gap-3 md:flex">
          <div className="mb-3 flex-1 md:mb-0">
            <Statistics guildID={guildID} />
          </div>
          <div className="flex-1">
            <Highlights guildID={guildID} />
          </div>
        </div>

        <Members guildID={guildID} />
      </main>
    </>
  );
};

export default Server;
