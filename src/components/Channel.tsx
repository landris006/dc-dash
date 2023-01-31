import React from 'react';
import { trpc } from '../utils/trpc';
import ListItem from './ListItem';
import { ImSpinner8 } from 'react-icons/im';
import RefreshButton from './RefreshButton';
import Member from './Member';

interface Props {
  channelID: string;
  usersIDs: string[];
}
const Channel = ({ channelID, usersIDs }: Props) => {
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
          {usersIDs.length} member{usersIDs.length !== 1 && 's'}
        </span>
      </p>

      {usersIDs.length > 0 && (
        <ul className="pt-3">
          {usersIDs.map((userID) => (
            <li className="ml-2" key={userID}>
              <Member userID={userID} />
            </li>
          ))}
        </ul>
      )}
    </ListItem>
  );
};

export default Channel;
