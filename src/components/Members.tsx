import { GuildMember, User } from "@prisma/client";
import { useEffect, useRef, useState, RefObject } from "react";
import { trpc } from "../utils/trpc";
import ListItem from "./ListItem";
import Modal from "./ui/Modal";
import Panel from "./ui/Panel";
import { GoSearch } from "react-icons/go";
import MemberInfo from "./MemberInfo";
import Image from "next/image";
import RefreshButton from "./RefreshButton";

const calculateHeight = (
  panel: RefObject<HTMLDivElement>,
  ul: RefObject<HTMLUListElement>
) => {
  if (!panel.current || !ul.current) {
    return "0px";
  }

  ul.current.style.height = "0px";

  const { top, height } = panel.current.getBoundingClientRect();

  const ulHeight = top + height - ul.current.getBoundingClientRect().top;

  ul.current.style.height = `${Math.max(ulHeight, 500)}px`;
};

const Members = ({ guildID }: { guildID: string }) => {
  const { data: guildMembers, isLoading } =
    trpc.guildMember.getAllInGuildWithUser.useQuery(guildID as string);
  const utils = trpc.useContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<
    GuildMember & {
      user: User;
    }
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [guildMembersToShow, setGuildMembersToShow] = useState(
    guildMembers ?? []
  );

  const container = useRef<HTMLDivElement>(null);
  const ul = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setGuildMembersToShow(
      guildMembers?.filter((guildMember) =>
        guildMember.nickname
          ?.toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase())
      ) ?? []
    );
  }, [guildMembers, searchQuery]);

  useEffect(() => {
    calculateHeight(container, ul);
    window.addEventListener("resize", () => calculateHeight(container, ul));

    return () =>
      window.removeEventListener("resize", () =>
        calculateHeight(container, ul)
      );
  }, [guildMembers]);

  return (
    <>
      <Modal classNames="" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {selectedMember && <MemberInfo member={selectedMember} />}
      </Modal>

      <Panel classNames="bg-gray-300 flex-1 flex flex-col">
        <div>
          <h2 className="h- text-3xl font-semibold">Members</h2>
          <hr className="h-1 rounded bg-black" />
        </div>

        <div className="flex items-center gap-2 py-3">
          <input
            value={searchQuery}
            placeholder="Search members..."
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            type="text"
            className="h-10 rounded-md p-1 text-xl"
          />
          <GoSearch size={30} />
        </div>

        <div className="flex-1" ref={container}>
          {isLoading ? (
            <h2 className="text-3xl">Loading members...</h2>
          ) : (
            <ul
              ref={ul}
              className="flex h-0 flex-col gap-1 overflow-y-auto text-black"
            >
              {guildMembersToShow.map((guildMember) => (
                <ListItem
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedMember(guildMember);
                  }}
                  key={guildMember.userID}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={guildMember.user.avatarURL ?? "/default-avatar.png"}
                      width={40}
                      height={40}
                      alt="profile picture"
                      className=" rounded-full "
                    />

                    <span className="text-xl">{guildMember.nickname}</span>
                  </div>
                </ListItem>
              ))}

              {guildMembersToShow.length === 0 && (
                <div className="flex items-center gap-3">
                  <p className="text-xl">No members found...</p>
                  <RefreshButton
                    isLoading={isLoading}
                    maxRetries={3}
                    onClick={() =>
                      utils.guildMember.getAllInGuildWithUser.invalidate()
                    }
                  />
                </div>
              )}
            </ul>
          )}
        </div>
      </Panel>
    </>
  );
};

export default Members;
