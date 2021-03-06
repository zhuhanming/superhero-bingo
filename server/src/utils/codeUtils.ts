const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charactersLength = characters.length;

export const makeCode = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
