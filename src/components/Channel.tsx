import React from 'react';
import { trpc } from '../utils/trpc';
import ListItem from './ListItem';
import { ImSpinner8 } from 'react-icons/im';
import RefreshButton from './RefreshButton';
import Member from './Member';

interface Props {
  channelID: string;
  users: {
    id: string;
    muted: boolean;
    deafened: boolean;
    streaming: boolean;
  }[];
}
const Channel = ({ channelID, users }: Props) => {
  const {
    data: voiceChannel,
    isLoading,
    isError,
  } = trpc.voiceChannel.get.useQuery(channelID);
  const utils = trpc.useContext();

  if (isLoading) {
    return (
      <ListItem>
        <ImSpinner8 className="animate-spin" />
      </ListItem>
    );
  }

  if (isError) {
    return (
      <ListItem>
        <p className="flex gap-3">
          Something went wrong...
          <RefreshButton
            isLoading={isLoading}
            onClick={() => utils.voiceChannel.get.invalidate()}
          />
        </p>
      </ListItem>
    );
  }

  return (
    <ListItem>
      <p className="flex justify-between gap-3">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap md:max-w-[10rem] ">
          {voiceChannel?.name}
        </span>

        <span className="whitespace-nowrap text-slate-600">
          {users.length} member{users.length !== 1 && 's'}
        </span>
      </p>

      {users.length > 0 && (
        <ul className="flex flex-col gap-1 pt-3">
          {users.map((user) => (
            <li className="ml-2" key={user.id}>
              <Member user={user} />
            </li>
          ))}
        </ul>
      )}
    </ListItem>
  );
};

export default Channel;
