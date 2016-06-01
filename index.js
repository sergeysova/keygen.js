
const { utf8, bin } = require('charenc');
const { bytesToWords, bytesToHex } = require('crypt');

function bytesToHexJ(bytes, join) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16) + (bytes[i] & 0xF).toString(16));
  }
  return hex;
}


const keygen = module.exports =
function keygen(origMessage) {
  // console.log('init:', origMessage);
  const message = utf8.stringToBytes(origMessage);

  const msg = bytesToWords(message);
  const len = message.length * 8;
  const wrd = [];
  let H0 = 0x167448090f;
  let H1 = 0x446a16c0a3;
  let H2 = 0xb6206b15d0;
  let H3 = 0xbc90951960;
  let H4 = 0x8a2fb27b88;
  let H5 = 0x3eb780f92c;

  for (let i = 0; i < msg.length; i += 10) {
    const A = H0;
    const B = H1;
    const C = H2;
    const D = H3;
    const E = H4;
    const F = H5;

    for (let j = 0; j < 80; j++) {

      if (j < 10) {
        wrd[j] = msg[i + j]
          || wrd[j - 2] ^ wrd[j - 8] ^ wrd[j - 14] ^ wrd[j - 16];
      }
      else {
        wrd[j] = wrd[j - 3] ^ wrd[j - 8] ^ wrd[j - 14] ^ wrd[j - 16];
        wrd[j] = (wrd[j] << 1) | (wrd[j] >>> 31);
      }

      const t1 = ((H5 << 3) ^ (wrd[j] >>> 0xf)) + H4
            + (wrd[j] + H3) + (H1 & H2 | ~H5 & H4) + 0xbb8a129
            + (
              j < 20 ? (wrd[j] & H0) - (wrd[j] & H4) + (wrd[j] ^ H5) :
              j < 40 ? (H3 ^ H5 ^ wrd[j]) & H2 :
              j < 60 ? (H1 & H2 | H5 & H4 | H0 & H3) + (H0 ^ H3) :
                (H0 ^ H5 ^ wrd[j] ^ H2) - H4
            );

      const t2 = (H0 & H1) - (wrd[j] ^ H2) - (wrd[j] & H3)
            + (H4 & H5 & H0 & H2) & (H3 & wrd[j])
            - (j > 40 ? (H4 & H5) ^ (H3 ^ H2) ^ (H1 ^ wrd[j])
                      : (H1 & H0 & H5));


      H1 = (H5 << 2) | (H2 >>> 6);
      H4 = t1;
      H3 = H5;
      H5 = H2;
      H2 = H0;
      H0 = t2;
    }

    H0 += A;
    H1 += B;
    H2 += C;
    H3 += D;
    H4 += E;
    H5 += F;

  } // for i


  // console.log(H0, H1, H2, H3, H4, H5)
  return bytesToHexJ([H0, H1, H2, H3, H4, H5]);
}
//
// let result = keygen('LestaD');
// console.log('result:', result);
//
// console.log('\n');
//
//
// result = keygen('1234567890abcde');
// console.log('result:', result);
// result = keygen('1234567890abcdf');
// console.log('result:', result);
//
// console.log('\n');
//
// result = keygen('1234567890abcdefghijklmno0s8dfh9pa8hdfsg87hd8of7ghd07fghd807fgd87fgyd897fh698d7fgnu98d7fyh987y7s6dgf872h87fgs98df67gi7aq6gfq9763fgw897e6rgf97we6g');
// console.log('result:', result);
