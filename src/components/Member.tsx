import { useRouter } from 'next/router';
import React from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { trpc } from '../utils/trpc';
import Image from 'next/image';

const Member = ({ userID }: { userID: string }) => {
  const guildID = useRouter().query.guildID as string;

  const {
    data: guildMember,
    isLoading,
    isError,
  } = trpc.guildMember.getWithUser.useQuery({
    guildID,
    userID,
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
    <p className="flex gap-2">
      <Image
        width={25}
        height={25}
        className="rounded-full"
        src={guildMember.user.avatarURL ?? '/default-avatar.png'}
      />

      <span>{guildMember.nickname ?? guildMember.user.username}</span>
    </p>
  );
};

export default Member;
