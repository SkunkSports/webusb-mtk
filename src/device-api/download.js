import getData from './get-device-data'

import numberToHex from '../utils/number-to-hex'
import calculateCheckSum from '../utils/calculate-checksum'
import convertDate from '../utils/convert-date'

const startDownload = async (device, totalSize, cb) => {
  const encoder = new TextEncoder()
  // const chunkSize = 2048
  // const chunkSize = 8192
  const chunkSize = 16384
  let offset = 0
  let data = []
  let retryCount = 0

  while (offset < totalSize) {
    const size = offset + chunkSize > totalSize ? totalSize - offset : chunkSize

    let command = `PMTK182,7,${numberToHex(offset)},${numberToHex(size)}`
    command = `$${command}*${calculateCheckSum(command)}\r\n`

    await device.transferOut(1, encoder.encode(command))

    // callback fn to update UI with download info
    cb({ downloadedSize: offset, estimatedSize: totalSize })

    const result = await getData(device)
    if (result.length !== 2 * size) {
      //      throw new Error(`Expecting ${size} bytes but received ${result.length} bytes...`)
      console.log(
        `Expecting ${size} bytes but received ${result.length} bytes... retrying`
      )
      retryCount++
      continue
    }

    const byteData = []
    for (let i = 0; i < result.length; i += 2) {
      let parsedInt = parseInt(result.substring(i, i + 2), 16)

      // Shifting bytes so we have 32bit unsigned integer
      // http://blog.vjeux.com/2013/javascript/conversion-from-uint8-to-int8-x-24.html
      let shiftedInt = parsedInt << 24 >> 24
      byteData.push(shiftedInt)
    }

    data.push.apply(data, byteData)
    offset += size
  }

  console.log(`Retry count: ${retryCount}`)
  return data
}

const initializeDownload = async (device, cb) => {
  if (device === null) {
    console.log('not connected')
    return
  }

  const a = document.createElement('a')
  const body = document.getElementById('app')

  body.appendChild(a)

  const command = '$PMTK182,2,8*33\r\n'

  const enc = new TextEncoder()

  try {
    await device.transferOut(1, enc.encode(command))

    const memoryUsed = await getData(device)

    let result = await startDownload(device, memoryUsed, cb)

    const intArray = new Int8Array(result)
    const file = new Blob([intArray], { type: 'application/octet-stream' })

    a.href = URL.createObjectURL(file)

    a.download = `tracker.${convertDate(new Date())}.bin`
    a.click()
  } catch (error) {
    throw new Error('download failed')
  }
}

export default initializeDownload
