import React, { useEffect } from 'react';

const TimeOnline = ({ startTime }: { startTime: Date }) => {
  const [timeOnline, setTimeOnline] = React.useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date(Date.now() - startTime.getTime());
      const minutes = time.getUTCMinutes();
      const seconds = time.getUTCSeconds();

      setTimeOnline(
        `${time.getUTCHours()}:${
          minutes < 10 ? '0' + minutes.toString() : minutes
        }:${seconds < 10 ? '0' + seconds.toString() : seconds}`
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return <p className="text-slate-600">{timeOnline}</p>;
};

export default TimeOnline;
