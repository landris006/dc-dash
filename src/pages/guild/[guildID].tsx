import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import Statistics from "../../components/Statistics";
import Highlights from "../../components/Highlights";
import Members from "../../components/Members";
import { BsFillDoorOpenFill } from "react-icons/bs";

const Header = ({ guildID }: { guildID: string }) => {
  const { data: guild, isLoading, isError } = trpc.guild.get.useQuery(guildID);
  const router = useRouter();

  if (isError) {
    return <h2>Could not load guild...</h2>;
  }

  return (
    <header className="bg-gray-300 p-3 text-black">
      <div className="container mx-auto flex-wrap justify-between sm:flex">
        <div className="mb-3 flex gap-3 sm:mb-0">
          <h2 className="text-4xl">
            {isLoading ? "Loading guild..." : guild.name}
          </h2>

          <div className=" hidden items-center justify-center sm:flex">
            <Image
              // TODO: default image
              src={guild?.iconURL ?? ""}
              width={50}
              height={50}
              alt="guild icon"
            />
          </div>
        </div>

        <div
          className="flex cursor-pointer items-center"
          onClick={() => router.push("/")}
        >
          <p className="flex items-center text-2xl text-slate-600 hover:text-black">
            Back to servers
          </p>
          <BsFillDoorOpenFill size={30} className={"fill-slate-600"} />
        </div>
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
    <div className="flex h-screen flex-col">
      <Header guildID={guildID} />

      <main className="container mx-auto mb-3 flex flex-1 flex-col">
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
    </div>
  );
};

export default Server;
