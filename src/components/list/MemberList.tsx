import { GuildMember, User } from '@prisma/client';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import ListItem from '../common/ListItem';
import Image from 'next/image';
import MemberInfo from './MemberInfo';
import Modal from '../common/Modal';
import { ImSpinner8 } from 'react-icons/im';

interface Props {
  guildMembers?: (GuildMember & { user: User })[];
  isLoading: boolean;
  isError: boolean;
  pagination: {
    page: number;
    limit: number;
  };
}
const MemberList = ({
  guildMembers,
  isLoading,
  isError,
  pagination,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberWithUser>();

  const ul = useRef<HTMLUListElement>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    calculateHeight(container, ul);
    window.addEventListener('resize', () => calculateHeight(container, ul));

    return () =>
      window.removeEventListener('resize', () =>
        calculateHeight(container, ul)
      );
  }, [guildMembers]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {selectedMember && <MemberInfo member={selectedMember} />}
      </Modal>

      <div className="flex-1" ref={container}>
        <ul
          ref={ul}
          className="relative flex h-0 flex-col gap-1 overflow-y-auto text-black dark:text-slate-200"
        >
          {isLoading ? (
            <ImSpinner8
              size={100}
              className="custom-animate-spin absolute top-1/2 left-1/2 text-slate-900 opacity-60"
            />
          ) : isError || (!isLoading && !guildMembers?.length) ? (
            <div className="flex items-center gap-3">
              <p className="text-xl">No members found...</p>
            </div>
          ) : (
            guildMembers?.map((guildMember, index) => (
              <ListItem
                onClick={() => {
                  setIsOpen(true);
                  setSelectedMember(guildMember);
                }}
                key={guildMember.userID}
              >
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold text-slate-900 opacity-60 dark:text-slate-200">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </p>

                  <Image
                    src={guildMember.user.avatarURL ?? '/default-avatar.png'}
                    width={40}
                    height={40}
                    alt="profile picture"
                    className=" rounded-full "
                  />

                  <span className="text-sla text-xl">
                    {guildMember.nickname}
                  </span>
                </div>
              </ListItem>
            ))
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

  const min = 400;

  ul.current.style.height = `${min}px`;
  const { top, height } = panel.current.getBoundingClientRect();
  const ulHeight = top + height - ul.current.getBoundingClientRect().top;
  ul.current.style.height = `${Math.max(ulHeight, min)}px`;
};

interface MemberWithUser extends GuildMember {
  user: User;
}

export default MemberList;
