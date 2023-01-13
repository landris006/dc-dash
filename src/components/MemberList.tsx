import { GuildMember, User } from '@prisma/client';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import ListItem from './ListItem';
import Image from 'next/image';
import MemberInfo from './MemberInfo';
import Modal from './ui/Modal';

interface Props {
  guildMembers: (GuildMember & { user: User })[];
}
const MemberList = ({ guildMembers }: Props) => {
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
