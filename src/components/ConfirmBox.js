import * as React from 'react'

// By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL

const ConfirmBox = ({ text, onNegative, onPositive, deviceName }) => (
  <div>
    <div className="modal__overlay" />
    <div className="modal__content">
      <h3>
        Remove data from the {deviceName}?
      </h3>
      <div className="modal__actions">
        <button className="button button--default" onClick={onNegative}>
          Close
        </button>
        <button className="button button--danger" onClick={onPositive}>
          Confirm
        </button>
      </div>
    </div>
  </div>
)

ConfirmBox.defaultProps = {
  deviceName: 'device'
}

export default ConfirmBox
