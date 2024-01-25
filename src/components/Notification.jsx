const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 20,
    background: 'lightgray',
    borderSize: 20,
    borderRadius: 3,
    borderStyle: 'solid',
    marginBottom: 10,
    padding: 10,
  }

  if (message === null) {
    return null
  }

  return <div style={notificationStyle}>{message}</div>
}
export default Notification
