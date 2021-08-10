export const msToTime = (time: number): string => {
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

  const hourString = hours < 10 ? `0${hours}` : hours;
  const minuteString = minutes < 10 ? `0${minutes}` : minutes;
  const secondString = seconds < 10 ? `0${seconds}` : seconds;

  return `${hourString}:${minuteString}:${secondString}`;
};
