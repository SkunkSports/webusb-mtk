import parseLine from '../utils/parse-line'

const getData = async device => {
  let buffer = ''
  let incompleteLineBuffer = ''
  let found = false
  const decoder = new TextDecoder()

  let resultData = ''

  while (!found) {
    let res = await device.transferIn(1, 1024)

    // console.log(decoder.decode(res.data))

    buffer += decoder.decode(res.data)

    if (buffer.charAt(0) !== '$') {
      buffer = buffer.substring(buffer.indexOf('$'))
    }

    const lastCommand = buffer.lastIndexOf('$')
    incompleteLineBuffer = buffer.substring(lastCommand)
    buffer = buffer.substring(0, lastCommand)

    if (buffer === '') {
      buffer = incompleteLineBuffer
      incompleteLineBuffer = ''
      continue
    }

    let lines = buffer.split('$')
    for (let line of lines) {
      if (line === '') continue
      // console.log('processing sentence:', line)
      let lineData = parseLine(line)

      if (lineData.talker === 'PMTK') {
        //response to our command
        if (lineData.type === '182') {
          if (
            lineData.fields[0] === '3' &&
            lineData.fields[1] === '8' &&
            lineData.fields[2]
          ) {
            // MEMORY_USED_RESPONSE
            // console.log(
            //   'memory used:',
            //   lineData.fields[2],
            //   parseInt(lineData.fields[2], 16)
            // )
            return parseInt(lineData.fields[2], 16)
          }
          if (lineData.fields[0] === '8') {
            // DATA_RESPONSE
            // const offset = parseInt(lineData.fields[1], 16)
            //            if (resultData === '' && offset !== 0) {
            //              throw new Error('Error downloading data from tracker, try again')
            //            }
            // console.log('offset', parseInt(lineData.fields[1], 16))
            // console.log('ADDING DATA TO RESULT!')

            resultData += lineData.fields[2]

            // console.log('LENGTH:', resultData.length)
          }
        } else if (lineData.type === '001') {
          if (
            lineData.fields[0] === '182' &&
            lineData.fields[1] === '7' &&
            lineData.fields[2] === '3'
          ) {
            // DATA_DOWNLOAD_COMPLETE
            return resultData
          } else if (
            lineData.fields[0] === '182' &&
            lineData.fields[1] === '6' &&
            lineData.fields[2] === '3'
          ) {
            // DATA_REMOVAL_COMPLETE
            return resultData
          }
        }
      } else if (resultData.length > 0) {
        throw new Error('Received unexpected response while downloading data')
      }
    }

    buffer = incompleteLineBuffer
    incompleteLineBuffer = ''
  }
}

export default getData
