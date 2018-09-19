import * as React from 'react'

import Loading from './Loading'
import ConfirmBox from './ConfirmBox'

import getListOfDevices from '../device-api/connect'
import initializeDownload from '../device-api/download'
import initializeRemove from '../device-api/remove'

class ConnectWebUsb extends React.Component {
  state = {
    device: null,
    isDownloaded: false,
    isDownloading: false,
    isRemoving: false,
    isRemoved: false,
    displayModal: false,
    hasDownloadError: false,
    estimatedSize: 0,
    downloadedSize: 0
  }

  _setEstimatedValues = ({ estimatedSize, downloadedSize } = {}) =>
    this.setState({
      estimatedSize,
      downloadedSize
    })

  _getListOfDevices = async () => {
    const device = await getListOfDevices()

    this.setState({
      device,
      hasDownloadError: false
    })
  }

  _initializeDownload = async () => {
    this.setState({
      isDownloading: true,
      isDownloaded: false,
      estimatedSize: 0,
      downloadedSize: 0
    })

    try {
      await initializeDownload(this.state.device, this._setEstimatedValues)

      this.setState({
        isDownloading: false,
        isDownloaded: true,
        isRemoved: false,
        hasDownloadError: false
      })
    } catch (err) {
      this.setState({
        isDownloading: false,
        isDownloaded: false,
        isRemoved: false,
        hasDownloadError: true,
        device: null
      })
    }
  }

  _initializeRemove = async () => {
    this.setState({
      displayModal: false,
      isDownloaded: false,
      isRemoving: true,
      estimatedSize: 0,
      downloadedSize: 0
    })

    try {
      await initializeRemove(this.state.device)

      this.setState({
        isRemoved: true,
        isRemoving: false,
        isDownloaded: false,
        hasDownloadError: false
      })
    } catch (error) {
      console.log('err', error)
      this.setState({
        isDownloading: false,
        isDownloaded: false,
        isRemoved: false,
        hasDownloadError: true,
        device: null
      })
    }
  }

  render() {
    const {
      isDownloading,
      isDownloaded,
      isRemoving,
      isRemoved,
      device,
      displayModal,
      hasDownloadError,
      estimatedSize,
      downloadedSize
    } = this.state

    const deviceName = device ? `${device.productName}` : 'device'
    let estimatedSizeUI = ''

    if (estimatedSize) {
      estimatedSizeUI = estimatedSize <= 1024
        ? `(${Math.ceil(estimatedSize)}B)`
        : `(${Math.ceil(estimatedSize / 1000)}KB)`
    }

    if (!navigator.usb)
      return (
        <h2 className="text--center">
          Your browser is not supporting WebUSB API, please use in Google Chrome
        </h2>
      )

    const isLoading = isDownloading || isRemoving
    const downloadInfo = `(${Math.ceil(downloadedSize / 1000)}/${Math.ceil(estimatedSize / 1000)}KB)`
    let isLoadingText = 'Loading'

    if (isDownloading) {
      isLoadingText = `Fetching data from the ${deviceName}`
    }

    if (isRemoving) {
      isLoadingText = `Removing data from the ${deviceName}`
    }

    return (
      <div className="app-wrapper">
        <h2>
          {device
            ? `${deviceName} (${device.manufacturerName}) connected`
            : 'No device connected'}
        </h2>
        <div className="buttons--horizontal">
          {!device &&
            <button
              onClick={this._getListOfDevices}
              className={`button ${device && 'button--disabled'}`}
              disabled={device}
            >
              Connect via WebUSB
            </button>}

          {device &&
            <button
              onClick={this._initializeDownload}
              className={`button button--secondary ${!device && 'button--disabled'}`}
              disabled={!device}
            >
              Download
            </button>}
          {device &&
            <button
              onClick={() => this.setState({ displayModal: true })}
              className={`button button--danger ${!device && 'button--disabled'}`}
              disabled={!device}
            >
              Delete
            </button>}

        </div>
        {isLoading
          ? <Loading text={isLoadingText} downloadInfo={downloadInfo} />
          : null}
        {displayModal
          ? <ConfirmBox
              onPositive={this._initializeRemove}
              onNegative={() => this.setState({ displayModal: false })}
              deviceName={deviceName}
            />
          : null}
        {isDownloaded &&
          !isRemoved &&
          <span className="info">Download successful</span>}
        {isRemoved &&
          !isDownloaded &&
          <span className="info">Data removed</span>}
        {hasDownloadError &&
          <span className="error">
            Operation failed, please reconnect and try again
          </span>}
      </div>
    )
  }
}

export default ConnectWebUsb
