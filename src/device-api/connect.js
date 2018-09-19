const getListOfDevices = async () => {
  if (!navigator.usb) {
    return null
  }

  const device = await navigator.usb.requestDevice({
    filters: [
      {
        vendorId: 0x0e8d
      }
    ]
  })

  // console.log('open', device)

  await device.open()

  if (device.configuration === null) {
    await device.selectConfiguration(1)
  }

  // console.log('interfaces:', device.configuration.interfaces)

  await device.claimInterface(1)

  await device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 0x22,
    value: 0x13,
    index: 0x01
  })

  // console.log('open port on interface 1', result)

  await device.claimInterface(0)

  return device
}

export default getListOfDevices
