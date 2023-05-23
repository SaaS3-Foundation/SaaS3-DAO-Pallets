export function stringToBytes(str) {
  const byteArray = [...new TextEncoder().encode(str)];
  const hexArray = byteArray.map((byte) => byte.toString(16).padStart(2, '0'));
  const hexString = `0x${hexArray.join('')}`;
  return hexString;
}
