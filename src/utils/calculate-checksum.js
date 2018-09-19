const calculateCheckSum = value => {
  // Compute the checksum by XORing all the character values in the string.
  let checksum = 0
  for (let i = 0; i < value.length; i++) {
    checksum = checksum ^ value.charCodeAt(i)
  }

  // Convert it to hexadecimal (base-16, upper case, most significant nybble first).
  let hexsum = Number(checksum).toString(16).toUpperCase()
  if (hexsum.length < 2) {
    hexsum = ('00' + hexsum).slice(-2)
  }
  return hexsum
}

export default calculateCheckSum
