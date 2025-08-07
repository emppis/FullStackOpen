import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (!message) return null

  const baseStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const style = {
    ...baseStyle,
    color: message.type === 'error' ? 'red' : 'green',
    borderColor: message.type === 'error' ? 'red' : 'green',
  }

  return <div style={style}>{message.message}</div>
}

Notification.propTypes = {
  message: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })
}

export default Notification