export const parseJson = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) { /* Ignore */ }
  }
  return data;
}
