export const formatMiliseconds = (time: number): string => {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor(((time % 360000) % 60000) / 1000);

  const formattedHours = hours > 0 ? hours + 'h ' : '';
  const formattedMinutes = minutes > 0 ? minutes + 'm ' : '';
  const formattedSeconds = seconds > 0 ? seconds + 's' : '';

  return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
};
