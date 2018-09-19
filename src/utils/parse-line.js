const parseLine = line => {
  const talker = line.substring(0, 4)
  const type = line.substring(4, 7)
  const fields = line
    .substring(line.indexOf(',') + 1, line.indexOf('*'))
    .split(',')

  return {
    talker,
    type,
    fields
  }
}

export default parseLine
