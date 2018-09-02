export const toUnixTime = date => Math.floor(date / 1000)
export const currentUnixTime = () => toUnixTime(Date.now())
