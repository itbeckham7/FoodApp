export const textEllipsis = (value, overNum, tail) => {
  return value && value.length > overNum
  ? value.substring(0, overNum) + tail
  : value;
}
  
