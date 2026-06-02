import PropTypes from 'prop-types'
import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (!message) return null

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={message.type}>
      {message.message}
    </Alert>
  )
}

Notification.propTypes = {
  message: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })
}

export default Notification