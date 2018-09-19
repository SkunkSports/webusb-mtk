import getData from './get-device-data'

const initializeRemove = async device => {
  if (device === null) {
    console.log('not connected')
    return
  }

  const command = '$PMTK182,6,1*3E\r\n'

  const enc = new TextEncoder()

  try {
    await device.transferOut(1, enc.encode(command))
    await getData(device)
  } catch (err) {
    throw new Error('Error while removing')
  }
}

export default initializeRemove
