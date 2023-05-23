export function omitText(text = '') {
  const textStr = String(text);
  if (textStr.length >= 15) {
    return String(text).replace(/(.{4})(.*)(.{4})/, '$1....$3');
  }
  return text;
}
