import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const SnackBar = ({message}) => {

    console.log("message : ",message)

    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
      });
      const { vertical, horizontal, open } = state;
    
      const handleClose = () => {
        setState({ ...state, open: false });
      };

  return (
    <Snackbar
    anchorOrigin={{ vertical, horizontal }}
    open={open}
    onClose={handleClose}
    key={vertical + horizontal}
    >
    <Alert 
    severity='error'
    >{message}</Alert>
    </Snackbar>
  )
}

export default SnackBar