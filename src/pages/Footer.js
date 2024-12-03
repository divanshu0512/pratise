import { Box, Typography } from '@mui/material'
import React from 'react'

const Footer = () => {
  return (
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', backgroundColor:"#b0b0b0", p:0.5 , width:"100%", position:'fixed', bottom:0 }} >
      <Typography sx={{ fontFamily:"montserrat", fontWeight:400, color:'white', marginLeft:2, fontSize:{ lg:"1rem", md:"1rem", sm:'1rem', xs:"0.6rem" } }} >© 2021 copyright. All rights reserved.</Typography>
      <Typography sx={{ fontFamily:"montserrat", fontWeight:400, color:'white', marginRight:5, fontSize:{ lg:"1rem", md:"1rem", sm:'1rem', xs:"0.6rem" } }} >Design by <span onClick={() => window.scroll(0,0)} style={{ color:"#32029c", cursor:"pointer" }} > eezib</span> </Typography>
      </Box>
  )
}

export default Footer