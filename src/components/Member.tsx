import { useRouter } from 'next/router';
import React from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { trpc } from '../utils/trpc';
import Image from 'next/image';
import { BsFillMicMuteFill } from 'react-icons/bs';
import { TbHeadphonesOff } from 'react-icons/tb';

const Member = ({
  user,
}: {
  user: { id: string; muted: boolean; deafened: boolean };
}) => {
  const guildID = useRouter().query.guildID as string;

  const {
    data: guildMember,
    isLoading,
    isError,
  } = trpc.guildMember.getWithUser.useQuery({
    guildID,
    userID: user.id,
  });

  if (isLoading) {
    return (
      <div>
        <ImSpinner8 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Something went wrong...</div>;
  }

  return (
    <p className="flex items-center gap-2">
      <Image
        width={25}
        height={25}
        className="rounded-full"
        src={guildMember.user.avatarURL ?? '/default-avatar.png'}
      />

      <span>{guildMember.nickname ?? guildMember.user.username}</span>

      {user.muted && <BsFillMicMuteFill opacity={0.7} />}

      {user.deafened && <TbHeadphonesOff opacity={0.7} />}
    </p>
  );
};

export default Member;
