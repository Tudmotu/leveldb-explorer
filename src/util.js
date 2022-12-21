import { utils } from 'rlp';

export const bufferFromHex = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

export const hexFromBuffer = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const arrToJSON = (ba) => {
    if (ba instanceof Uint8Array) {
        return utils.bytesToHex(ba);
    }
    else if (ba instanceof Array) {
        const arr = [];

        for (let i = 0; i < ba.length; i++) {
            arr.push(arrToJSON(ba[i]));
        }

        return arr;
    }
}
