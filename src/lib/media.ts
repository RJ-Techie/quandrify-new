export const MAX_LOGO_BYTES = 256 * 1024;
export function imageMime(bytes: Uint8Array) {
 if (bytes.length < 12 || bytes.length > MAX_LOGO_BYTES) return null;
 if (bytes.slice(0,8).every((value,i)=>value===[137,80,78,71,13,10,26,10][i])) return 'image/png';
 if (bytes[0]===255 && bytes[1]===216 && bytes[2]===255) return 'image/jpeg';
 if (String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP') return 'image/webp';
 return null;
}
