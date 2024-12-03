import { Typography } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {

    const navigate = useNavigate();

    const handlePage = () => {
      setTimeout(() => {
        navigate(-1)
      },800)
    }

    React.useEffect(() => {
        handlePage();
    },[])

  return (
    <Typography sx={{ fontFamily:"montserrat", fontWeight:600, mt:10, textAlign:'center', fontSize:"3rem", color:"#0052e0", textTransform:'capitalize' }} >enter valid url</Typography>
  )
}

export default NotFound