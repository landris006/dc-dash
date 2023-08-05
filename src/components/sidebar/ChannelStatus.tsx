import React, { useEffect } from 'react';
import Panel from '../common/Panel';
import { GoPrimitiveDot } from 'react-icons/go';
import { io } from 'socket.io-client';
import Channel from './Channel';
import { env } from '../../env/client.mjs';
import { ImSpinner8 } from 'react-icons/im';

const ChannelStatus = ({ guildId }: { guildId: string }) => {
  const [channels, setChannels] = React.useState<{
    [key: string]: {
      id: string;
      muted: boolean;
      deafened: boolean;
      streaming: boolean;
    }[];
  }>({});

  useEffect(() => {
    if (!guildId) {
      return;
    }

    const socket = io(env.NEXT_PUBLIC_BOT_URL, {
      query: {
        guildId,
      },
      transports: ['websocket'],
      secure: true,
    });

    socket.on('update', (data) => setChannels(data));
    socket.on('error', (error) => console.error(error));

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, [guildId]);

  return (
    <Panel className="bg-slate-300">
      <h2 className="flex items-center text-3xl font-semibold">
        Channel status
        {Object.keys(channels).length === 0 ? (
          <ImSpinner8 size={23} className="ml-3 animate-spin" />
        ) : (
          <GoPrimitiveDot color="#ff4545" className="animate-pulse" size={35} />
        )}
      </h2>
      <hr className="h-1 rounded bg-black" />

      <ul className="flex flex-col gap-2 pt-3">
        {Object.entries(channels).map(([channelId, users]) => (
          <Channel key={channelId} channelId={channelId} users={users} />
        ))}
      </ul>
    </Panel>
  );
};

export default ChannelStatus;
