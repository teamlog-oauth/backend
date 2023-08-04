import * as crypto from 'crypto';

export const sha256 = (text: string) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};
