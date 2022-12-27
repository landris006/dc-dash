import type { NextPage } from "next";
import { useRouter } from "next/router";
import ListItem from "../components/ListItem";
import Panel from "../components/Panel";
import { trpc } from "../utils/trpc";
import Image from "next/image";

const Server: NextPage = () => {
  const guildID = useRouter().query.guildID as string;
  /* const { guildID } = router.query;
  if (!guildID) {
    return <p>Invalid GuildID</p>; */

  const { data: guild } = trpc.guild.get.useQuery(guildID as string);
  const {
    data: guildMembers,
    isLoading,
    isError,
  } = trpc.guildMember.getAllInGuild.useQuery(guildID as string);

  if (!guild) {
    return <p>Could not load guild</p>;
  }

  const Members = () => {
    if (isLoading) {
      return <div>Loading members...</div>;
    }
    if (isError) {
      return <div>Could not load members...</div>;
    }

    return (
      <>
        {guildMembers.map((guildMember) => (
          <ListItem key={guildMember.userID}>{guildMember.nickname}</ListItem>
        ))}
      </>
    );
  };

  return (
    <>
      <header className="bg-gray-300 p-3 text-black">
        <div className="container mx-auto flex flex-wrap gap-3">
          <h2 className="text-4xl">{guild.name}</h2>
          <Image
            src={guild.iconURL ?? ""}
            width={50}
            height={50}
            alt="guild icon"
          />
        </div>
      </header>
      <main className="container mx-auto">
        <Panel>
          <div className="my-5 mt-2">
            <p className="text-3xl">Stats</p>
            <hr className="h-1 rounded bg-black" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            <p>sad</p>
            <p>sad2</p>
            <p>sad2</p>
            <p>sad2</p>
          </div>
        </Panel>

        <Panel>
          <div className="my-5 mt-2">
            <p className="text-3xl">Members</p>
            <hr className=" h-1 rounded bg-black" />
          </div>

          <ul className="flex flex-col gap-1  text-black">
            <Members />
          </ul>
        </Panel>
      </main>
    </>
  );
};

export default Server;
