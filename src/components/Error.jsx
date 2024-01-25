const Error = ({ message }) => {
  const errorStyle = {
    color: 'red',
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

  return <div className='error' style={errorStyle}>{message}</div>
}
export default Error
