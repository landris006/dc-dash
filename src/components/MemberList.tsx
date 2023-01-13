import { GuildMember, User } from '@prisma/client';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { trpc } from '../utils/trpc';
import ListItem from './ListItem';
import Image from 'next/image';
import RefreshButton from './RefreshButton';
import MemberInfo from './MemberInfo';
import Modal from './ui/Modal';
import { useRouter } from 'next/router';

const MemberList = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const guildID = router.query.guildID as string;

  const [pagination, setPagination] = useState({
    skip: 0,
    take: 10,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberWithUser>();

  const [guildMembers, setGuildMembers] = useState<MemberWithUser[]>([]);
  const [allMembersFetched, setAllMembersFetched] = useState(false);

  const { isLoading, status } = trpc.guildMember.getMembers.useQuery(
    {
      guildID,
      ...pagination,
    },
    {
      onSuccess(data) {
        if (pagination.skip + pagination.take <= guildMembers.length) {
          return;
        }

        if (data.length === 0) {
          setAllMembersFetched(true);
          return;
        }

        setGuildMembers((prev) => [...prev, ...data]);
      },
    }
  );
  useEffect(() => {
    utils.guildMember.getMembers.invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const ul = useRef<HTMLUListElement>(null);
  const container = useRef<HTMLDivElement>(null);

  const incrementPagination = () => {
    setPagination((prev) => ({ ...prev, skip: prev.skip + 10 }));
  };

  useEffect(() => {
    calculateHeight(container, ul);
    window.addEventListener('resize', () => calculateHeight(container, ul));

    return () =>
      window.removeEventListener('resize', () =>
        calculateHeight(container, ul)
      );
  }, [guildMembers]);

  useEffect(() => {
    const onScroll = () => {
      if (!ul.current) {
        return;
      }

      const scrollBottom =
        ul.current.scrollHeight -
        ul.current.scrollTop -
        ul.current.clientHeight;

      if (scrollBottom < 100 && !allMembersFetched && status === 'success') {
        incrementPagination();
      }
    };

    const ulElement = ul.current;
    ulElement?.addEventListener('scroll', onScroll);

    return () => ulElement?.removeEventListener('scroll', onScroll);
  }, [allMembersFetched, status]);

  return (
    <>
      <Modal classNames="" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {selectedMember && <MemberInfo member={selectedMember} />}
      </Modal>

      <div className="flex-1" ref={container}>
        <ul
          ref={ul}
          className="flex h-0 flex-col gap-1 overflow-y-auto text-black"
        >
          {guildMembers.map((guildMember) => (
            <ListItem
              onClick={() => {
                setIsOpen(true);
                setSelectedMember(guildMember);
              }}
              key={guildMember.userID}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={guildMember.user.avatarURL ?? '/default-avatar.png'}
                  width={40}
                  height={40}
                  alt="profile picture"
                  className=" rounded-full "
                />

                <span className="text-xl">{guildMember.nickname}</span>
              </div>
            </ListItem>
          ))}

          {status === 'success' && guildMembers.length === 0 && (
            <div className="flex items-center gap-3">
              <p className="text-xl">No members found...</p>
              <RefreshButton
                isLoading={isLoading}
                maxRetries={3}
                onClick={() => utils.guildMember.getMembers.invalidate()}
              />
            </div>
          )}
        </ul>
      </div>
    </>
  );
};

const calculateHeight = (
  panel: RefObject<HTMLDivElement>,
  ul: RefObject<HTMLUListElement>
) => {
  if (!panel.current || !ul.current) {
    return '0px';
  }

  ul.current.style.height = '0px';
  const { top, height } = panel.current.getBoundingClientRect();
  const ulHeight = top + height - ul.current.getBoundingClientRect().top;
  ul.current.style.height = `${Math.max(ulHeight, 500)}px`;
};

interface MemberWithUser extends GuildMember {
  user: User;
}

export default MemberList;
