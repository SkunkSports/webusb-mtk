const convertDate = date => {
  const mm = date.getMonth() + 1 // getMonth() is zero-based
  const dd = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return [
    date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd,
    (hours > 9 ? '' : '0') + hours,
    (minutes > 9 ? '' : '0') + minutes,
    (seconds > 9 ? '' : '0') + seconds
  ].join('')
}

export default convertDate
