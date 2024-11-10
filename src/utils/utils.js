export const range = (count, value) => {
  return Array(count).fill(value || '');
}

export const addNumberComma = (number) => {
  return number.toLocaleString('ko-KR');
}
