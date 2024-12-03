import { Box, Button, InputAdornment, OutlinedInput, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React from 'react'
import Header from '../components/Header'
import data from "../pages/MakerCardJson"
import DownloadingIcon from '@mui/icons-material/Downloading';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SearchIcon from '@mui/icons-material/Search';


const NsdlCardOrder = () => {

    const [page , setPage] = React.useState(0);

  return (
    <Box className="topupContainer" >
        <Header />

        <Box sx={{  display:'flex', alignItems:'center', justifyContent:'center', marginTop:'1.5rem' }} >
            <Box sx={{ backgroundColor:'white',  borderRadius:2, padding:3}} >
                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mt:3 }} >
                    <Button variant='outlined' sx={{ fontFamily:"montserrat", fontWeight:500 }} >submit new request for card</Button>
                    <TextField InputProps={{ startAdornment:( <InputAdornment> <SearchIcon/> </InputAdornment> ) }} size='small' placeholder='search..' />
                </Box>

            <TableContainer  elevation={16} component={Paper} sx={{ mt:1 }} >
                <Table sx={{ width:'75rem' ,backgroundColor:'white' }} aria-label="simple table">  

                    <TableHead>
                    <TableRow sx={{ backgroundColor:'#219bff' }} >
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:"0.9rem" }}   >Sr. No</TableCell>
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:"0.9rem" }}   >Order Date</TableCell>
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:"0.9rem" }}   align="center">Order Id</TableCell>
                        <TableCell  sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:"0.9rem" }}  align="center">File</TableCell>
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:"0.9rem" }}   align="center">Checker Status</TableCell>
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:"0.9rem" }}   align="center">MGR Status</TableCell>
                        <TableCell  sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:"0.9rem" }}  align="center">MRG Remark</TableCell>
                        <TableCell  sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:"0.9rem" }}  align="center">Action</TableCell>

                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        data?.slice((page - 1) * 10, (page - 1) * 10 + 10)?.map((row, index) => (  

                            <TableRow
                             key={index}
                             sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  >{index + 1}</TableCell>
                                <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  >{row.card_created_at}</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  >{row.order_id}</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem", color:"#a200e8"  }}  >{row.file_path === null ? "Topup" : <Button size='small' variant='outlined' sx={{ fontSize:'0.6rem',fontFamily:"montserrat",fontWeight:500 }} >Download</Button> }</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:600 , fontSize:"0.8rem", color:row.is_checked === 1 ? "#ff9900" : row.is_checked === 2 ? "#1bc900" : "red"  }}  >{row.is_checked === 1 ? "PENDING" : row.is_checked === 2 ? "APPROVED" : "REJECTED" }</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:600 , fontSize:"0.8rem", color:row.status === 1 ? "#ff9900" : row.status === 2 ? "#1bc900" : "red"  }}  >{row.status === 1 ? "PENDING" : row.status === 2 ? "APPROVED" : "REJECTED" }</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem" , color:row.remark === "testing" ? "black": "gray" }}  > {row.remark === null ? "N/A" : row.remark} </TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem" , color:'#b5b5b5', cursor:'pointer' }}  > <RemoveRedEyeIcon sx={{ fontSize:'1.2rem' }} /> </TableCell>

                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
                </TableContainer>

                <Pagination
                    size='medium'
                    style={{
                        width: 'auto',
                        padding: 50,
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'center'
                    }}
                    variant='outlined'
                    color='primary'
                    count={(data?.length / 10).toFixed(0)}
                    onChange={(_, value) => {
                        setPage(value);
                        window.scroll(0, 730)
                    }}
                />

            </Box>
        </Box>

    </Box>
  )
}

export default NsdlCardOrder