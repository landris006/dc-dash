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

  const [isShowingMembers, setIsShowingMembers] = React.useState(false);

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
    <ListItem onClick={() => setIsShowingMembers((prev) => !prev)}>
      <p className="flex justify-between">
        <span>{voiceChannel?.name}</span>
        <span className="text-slate-600">
          {usersIDs.length} member{usersIDs.length !== 1 && 's'}
        </span>
      </p>

      {isShowingMembers && (
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
