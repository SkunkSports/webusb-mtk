const numberToHex = number => {
  let hex = number.toString(16)
  return ('00000000' + hex).slice(-8)
}

export default numberToHex
