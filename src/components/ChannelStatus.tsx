import React, { useEffect } from 'react';
import Panel from './ui/Panel';
import { GoPrimitiveDot } from 'react-icons/go';
import { io } from 'socket.io-client';
import Channel from './Channel';
import { env } from '../env/client.mjs';

const ChannelStatus = ({ guildID }: { guildID: string }) => {
  const [channels, setChannels] = React.useState<{
    [key: string]: {
      id: string;
      muted: boolean;
      deafened: boolean;
    }[];
  }>({});

  useEffect(() => {
    if (!guildID) {
      return;
    }

    const socket = io(env.NEXT_PUBLIC_BOT_URL);

    socket.emit('subscribe', guildID);
    socket.on('update', (data) => setChannels(data));
    socket.on('error', (error) => console.error(error));

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, [guildID]);

  return (
    <Panel>
      <h2 className="flex items-center text-3xl font-semibold">
        Channel status
        <GoPrimitiveDot color="#ff4545" className="animate-pulse" size={35} />
      </h2>
      <hr className="h-1 rounded bg-black" />

      <ul className="flex flex-col gap-2 pt-3">
        {Object.entries(channels).map(([channelID, users]) => (
          <Channel key={channelID} channelID={channelID} users={users} />
        ))}
      </ul>
    </Panel>
  );
};

export default ChannelStatus;
