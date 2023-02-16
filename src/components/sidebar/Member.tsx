import { useRouter } from 'next/router';
import React from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { trpc } from '../../utils/trpc';
import Image from 'next/image';
import { BsFillMicMuteFill } from 'react-icons/bs';
import { TbHeadphonesOff } from 'react-icons/tb';
import TimeOnline from './TimeOnline';

const Member = ({
  user,
}: {
  user: { id: string; muted: boolean; deafened: boolean; streaming: boolean };
}) => {
  const guildID = useRouter().query.guildID as string;

  const {
    data: guildMember,
    isLoading,
    isError,
  } = trpc.guildMember.getConnectedMember.useQuery(
    {
      guildID,
      userID: user.id,
    },
    {
      refetchOnMount: 'always',
    }
  );

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

  console.log({ guildMember });

  return (
    <div className="flex justify-between">
      <p className="flex items-center gap-2">
        <Image
          width={25}
          height={25}
          alt="avatar"
          className="rounded-full"
          src={guildMember.user.avatarURL ?? '/default-avatar.png'}
        />

        <span>{guildMember.nickname ?? guildMember.user.username}</span>

        {user.muted && <BsFillMicMuteFill opacity={0.7} />}
        {user.deafened && <TbHeadphonesOff opacity={0.7} />}
        {user.streaming && (
          <span className="rounded-lg bg-red-500 px-2 text-[12px] font-semibold uppercase text-white">
            live
          </span>
        )}
      </p>

      {guildMember.connections.length === 1 && (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <TimeOnline startTime={guildMember.connections[0]!.startTime} />
      )}
    </div>
  );
};

export default Member;
