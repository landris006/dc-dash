import React, { useEffect } from 'react';
import Panel from './ui/Panel';
import { GoPrimitiveDot } from 'react-icons/go';
import { io } from 'socket.io-client';
import Channel from './Channel';

const ChannelStatus = ({ guildID }: { guildID: string }) => {
  const [channels, setChannels] = React.useState<{ [key: string]: string[] }>(
    {}
  );

  useEffect(() => {
    if (!guildID) {
      return;
    }

    const socket = io('http://localhost:5000');

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
        {Object.entries(channels).map(([channelID, usersIDs]) => (
          <Channel key={channelID} channelID={channelID} usersIDs={usersIDs} />
        ))}

        <Channel
          channelID={'419432952535973890'}
          usersIDs={['694620824765726760']}
        />
      </ul>
    </Panel>
  );
};

export default ChannelStatus;
