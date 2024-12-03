import React, { useRef } from 'react';
import { lazy, Suspense } from 'react';
import Header from '../components/Header'
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Typography, Select, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Pagination, TextField, InputAdornment, Divider, LinearProgress, Fade, Grow, Slide, Dialog, DialogTitle, DialogContent, DialogContentText, CircularProgress, Snackbar, Alert, Menu } from '@mui/material'
import cardLeft from '../images/cardOrderss.png'
import { motion } from 'framer-motion';
import data from "../pages/MakerCardJson";
import DownloadIcon from '@mui/icons-material/Download';
import DownloadingIcon from '@mui/icons-material/Downloading';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import eezib from "../images/eezib.png"
import CloseIcon from '@mui/icons-material/Close';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import uuid from 'react-uuid';
import Footer from './Footer';
import moment from 'moment';

const CardOrder = () => {

    const [age, setAge] = React.useState('');
    const [age2, setAge2] = React.useState('');
    const [age3, setAge3] = React.useState('');
    const [page , setPage] = React.useState(1);
    const [userToken , setUserToken] = React.useState('');
    const [category , setCategory] = React.useState();
    const [subCategoryCard, setSubCategoryCard] = React.useState();
    const [ bin, setBin ] = React.useState()
    const [productBinData, setProductBinData] = React.useState();
    const [progress1, setProgress1] = React.useState(false);
    const [progress2, setProgress2] = React.useState(false);
    const [progress3, setProgress3] = React.useState(false);
    const [userTableData , setUserTableData] = React.useState([]);
    const [ actionData , setActionData ] = React.useState();
    const [openAction , setOpenAction ] = React.useState(false);
    const [ actionProgress , setActionProgress ] = React.useState(false);
    const [tableView , setTableView ] = React.useState(false);
    const  [ handleErr , setHandleErr] = React.useState(false);
    const [handleSuccess , setHandleSuccess ] = React.useState(false);
    const [ jsonError , setJsonError ] = React.useState('');
    const [jsonSuccess , setJsonSuccess ] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [properCat , setProperCat] = React.useState("");

    const [ orderAmount , setOrderAmount ] = React.useState(''); 
    const [base64 , setBase64] = React.useState('');
    const [ fileType, setFileType ] = React.useState('');

    const [orderProgress , setOrderProgress] = React.useState(false);
    const [ enableAmount , setEnableAmount ] = React.useState(false);

    const downloadMenu = Boolean(anchorEl);
    const inputRef = useRef(null)

    const location = useLocation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleDownloadClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleDownloadClose = () => {
      setAnchorEl(null);
    }

    const handleErrClose = () => {
      setHandleErr(false)
    }

    const HandleSuccessClose = () => {
      setHandleSuccess(false);
    }
  

    React.useEffect(() => {
      if(location.state){
          const tokenData = location.state?.data.token;
          setUserToken(tokenData)
      }
  },[])

  const handleActionClose = () => {
    setOpenAction(false);
  }

  const authAccess = Cookies.get('demoAuth');
  const userId = Cookies.get('userId');


  const getCategory = async() => {
    try{

      setProgress1(true)

        const url = process.env.REACT_APP_URL

    
        const data = await fetch(`${url}/api/maker/category`,{
          headers:{
            "Accept":"application/json",
            "Authorization":`Bearer ${authAccess}`
          }
        });
        const json = await data.json();

        if(json){
          if(json.status === "success"){
            setCategory(json.data.category_list);
            setProgress1(false)
          }
        }
        if(json.message === "Unauthenticated." ){
          setHandleErr(true);
          setJsonError(json.message);
          Cookies.remove("demoAuth");
          setTimeout(() => {
            window.location.replace(`${url}/logout`);
          },500);
      }
      }catch(err){
      setHandleErr(true); 
      setJsonError(err)
      setTimeout(() => {
        navigate("/");
        Cookies.remove("demoAuth");
      })
    }
  }


  const subCategory = async() => {
    try{

      setProgress2(true)
  
      const url = process.env.REACT_APP_URL
  
      const data = await fetch(`${url}/api/maker/subcategory/${age}`, {
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${authAccess}`
        }
      });
      const json = await data.json();
      
      if(json){
        if(json.status === "success"){
          setSubCategoryCard(json.data.subcategory_list)
          setProgress2(false)

          if(json.data?.subcategory_list[0].format?.length === 1){
            setEnableAmount(true);
          }else{
            setEnableAmount(false);
          }

        }
        if(json.status === "error"){
          setHandleErr(true);
          setJsonError(json.message)
        }
        if(json.message === "Unauthenticated."){
          setHandleErr(true);
          setJsonError(json.message);
          Cookies.remove("demoAuth")
          setTimeout(() => {
            window.location.replace(`${url}/logout`);
          },1000)
      }
      }
    }catch(err){
      setHandleErr(true);
      setJsonError(err);
      Cookies.remove("demoAuth")
          setTimeout(() => {
            navigate('/')
          },1000)
    }
  }


  const productBin = async() => {

    try{

    const url = process.env.REACT_APP_URL
    setProgress3(true);
    const data = await fetch(`${url}/api/maker/product_bin/${age2}`,{
      headers:{
        "Accept":"application/json",
        "Authorization":`Bearer ${authAccess}`
      }
    });
    const json = await data.json();
    if(json){
      if(json.status === "success"){
        setProductBinData(json.data.bin_list);
        setBin(json.data.format)
        setProgress3(false)
      }
      if(json.status === "error"){
        setHandleErr(true);
        setJsonError(json.message)
      }
      if(json.message === "Unauthenticated."){
        setHandleErr(true);
        setJsonError(json.message);
        Cookies.remove("demoAuth")
        setTimeout(() => {
          window.location.replace(`${url}/logout`);
        },1000)
    }
    }

    }catch(err){
      setHandleErr(true);
      setJsonError(err);
      navigate("/");
      setTimeout(() => {
        navigate("/")
      },500)
    }

    
  }

  React.useEffect(() => {
    getCategory();
  },[])

  React.useEffect(() => {
    if(age){
      subCategory();
    }
  },[age])

  React.useEffect(() => {
    if(age2){
      productBin();
    }
  },[age2])
  

    const handleChange = (event) => {
      setAge(event.target.value);
      setAge2(null);
      setAge3(null);
    };

    const handleChange2 = (event) => {
        setAge2(event.target.value);
        setAge3(null);
      };

      const handleChange3 = (event) => {
        setAge3(event.target.value);
      }

      const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if(selectedFile){
          const fileName = selectedFile.name;

          const fileType = fileName?.split(".")[1];
          setFileType(fileType);

          const allowedExtension = ['.csv', '.xls', '.xlsx'];
          const fileExtension = selectedFile.name.slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2);
      
          if(allowedExtension.includes('.' + fileExtension.toLowerCase())){
      
            const reader = new FileReader();
      
      
            reader.onload = () => {
              const base64String = reader.result;
              const base64Data = base64String.split(",")[1]
              setBase64(base64Data);
            }
                  reader.readAsDataURL(selectedFile);
      
          } else {
          }
        }
      }
      
   
      const handlePlaceOrder = async() => {

        setOrderProgress(false);

        try{
          
          setTableView(true);

        const url = process.env.REACT_APP_URL


        const fetchData = await fetch(`${url}/api/maker/makercard_view`,{
          headers:{
            "Accept":"application/json",
            "Authorization":`Bearer ${authAccess}`
          }
        });
        const json = await fetchData.json();
        setTableView(false);
        setOrderProgress(false);
        if(json){

          if(json.status === "success" && json.statuscode == 200){
              setUserTableData(json.data.order_details)
          }
          if(json.status === "error"){
            setHandleErr(true);
            setJsonError(json.message)
          }
          if(json.message === "Unauthenticated." ){
              setHandleErr(true);
              setJsonError(json.message);
              setTimeout(() => {
            window.location.replace(`${url}/logout`);
              },1000)
          }
        }

        }catch(err){
          setHandleErr(true);
          setJsonError(err);
        }

        
      }

      React.useEffect(() => {
        handlePlaceOrder()
      },[])

      const handleCardAction = async(e) => {
        try{

          setActionProgress(true);

        setOpenAction(true);


        const url = process.env.REACT_APP_URL


        const fetchData = await fetch( `${url}/api/maker/makercard_action/${e}` , {
            headers:{
              "Accept":"application/json",
              "Authorization":`Bearer ${authAccess}`
            }
        });
        const json = await fetchData.json();

        if(json){
          setOpenAction(true);
          if(json.status === "success" ){
            setActionProgress(false);
            setActionData(json.data.order_details);
          }
          if(json.status === "error"){
            setHandleErr(true);
            setJsonError(json.message);
          }
          if(json.message === "Unauthenticated."){
            setHandleErr(true);
            setJsonError(json.message);
            Cookies.remove("demoAuth")
            setTimeout(() => {
            window.location.replace(`${url}/logout`);
            },1000)
        }
        }

        }catch(err){
          setHandleErr(true);
          setJsonError(err);
        }
        
        
      }


      const submitCardOrder = async(e) => {

        e.preventDefault();

          setOrderProgress(true);

        try{

          const url = process.env.REACT_APP_URL

          const randomNum = Math.floor( Math.random() * 100000000 );
          
        const fetchData = await fetch(`${url}/api/maker/placeorder`, {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Accept":":application/json",
            "Authorization":`Bearer ${authAccess}`
          },
          body:JSON.stringify( !orderAmount ? { "user_id":userId, "category_id": age, "subcategory_id":age2, "bin":age3 , "excel_file":base64, "unique_no":randomNum, "file_type":`.${fileType}` } : {  "user_id":userId , "category_id": age, "subcategory_id":age2, "bin":age3 , "amount":orderAmount })
        });

        const json = await fetchData.json();
        setOrderProgress(false);

        if(json){
          if(json.status === "success" ){
            setHandleSuccess(true);
            setJsonSuccess(json.message);

            setAge("");
            setAge2("");
            setAge3("");
            setOrderAmount('');

           !orderAmount ? fileInputRef.current.value="" : setOrderAmount('');

           if(json.data && json.data.File_Path !== null 
            // && json.data.File_Path 
           ){
            const fileRedirect = json.data.File_Path
            const url = process.env.REACT_APP_URL
            window.open(`${url}${fileRedirect}` , "")
           }
            handlePlaceOrder()           
          }

          if( json.status === "error" ){

            
            const fileRedirect = json?.data?.File_Path
            if(fileRedirect){
              const url = process.env.REACT_APP_URL
              window.open(`${url}${fileRedirect}` , "")
            }
            setHandleErr(true);
            setJsonError(json.message);
            
            setAge("");
            setAge2("");
            setAge3("");

            !orderAmount ? fileInputRef.current.value="" : setOrderAmount('');
          }

          

          if(json.message === "Unauthenticated."){
            setHandleErr(true);
            setJsonError(json.message);
            Cookies.remove("demoAuth")
            setTimeout(() => {
            window.location.replace(`${url}/logout`);
            },1000)
        }
        }

        
      }catch(err){
        setOrderProgress(false);
        setHandleErr(true);
        setJsonError(err);
      }
      
    }

    const handlelExcel = (e) => {     
      
       const data = [e]

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(blob, `${properCat}.xlsx`);
  };

  const handleAmount = (e) => {
    const value = e.target.value;
    const regex = /^\d{0,7}$/

    const data = regex?.test(value);

    if(data){
      setOrderAmount(value);
    }

  }
    

  return (
    <motion.div initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }} transition={{ delay:0.1 }} >

    <Header/>

    <Box className="cardOrderContainer"  sx={{ display:'flex', alignItems:"center", justifyContent:'center', flexDirection:'column' }} >

    <Box sx={{   width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:{lg:"row", md:'row', sm:'column', xs:"column" } }} >
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', marginTop:1, width:'60%' }}>
        <Box component='img' src={cardLeft}sx={{ width:{ lg:"45rem", md:"38rem", sm:"32rem", xs:"21rem" } }} />
      </Box>

        {/* <Spline scene="https://prod.spline.design/b4yYK6B2JRMtRmkp/scene.splinecode" /> */}

      <Box sx={{ width:{lg:'60%', md:"60%", sm:"60%", xs:"30%" },mt:5}} >

        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center'}} >

          <Box  >

            <form onSubmit={submitCardOrder} >

          <Paper elevation={18} sx={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' , border:'2px solid white' , padding:{ lg:'1.5rem 2.5rem', sm:'1.5rem 2.5rem', md:'1.5rem 2.5rem', xs:"0.8rem 1.2rem"}, gap:1, borderRadius:2 }} >
          <Typography sx={{ fontFamily:'montserrat', fontWeight:700, fontSize:{lg:'1.6rem', sm:'1.4rem', md:'1.6rem', xs:"1.2rem" }, textTransform:'capitalize', color:"#2085f7", mb:1 }} >place order</Typography>
          <Box sx={{ display:'grid', gridTemplateColumns:'repeat(,1fr)', gap:2 , backgroundColor:'transparent'}} >

          <FormControl size='large' sx={{ width:{lg:'22rem', sm:"22rem", md:"22rem", xs:"18rem" } }} >
        <InputLabel id="demo-simple-select-label" sx={{ fontFamily:'montserrat', fontWeight:500 }} >category Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="category Name"
          onChange={handleChange}
          required
          sx={{ fontFamily:'montserrat', fontWeight:500 }}
        >
          { progress1 ? <LinearProgress /> : 
            category?.map((row, index) => (
              <MenuItem value={row.id} key={index} sx={{ fontFamily:'montserrat', fontWeight:500 }} >{row.category_name}</MenuItem>
            ))
          }

          

        </Select>
        </FormControl>

        <FormControl disabled={!age} sx={{ width:{lg:'22rem', sm:"22rem", md:"22rem", xs:"18rem" }}} >
        <InputLabel id="demo-simple-select-label" sx={{ fontFamily:'montserrat', fontWeight:500 }} >Sub Category Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age2}
          label="Sub Category Name"
          onChange={handleChange2}
          required
          sx={{ fontFamily:'montserrat', fontWeight:500 }}
        >
          { progress2 ? <LinearProgress /> : 
            subCategoryCard?.map((row) => (
              <MenuItem value={row.id} onClick={() => setProperCat(row.sub_category_name) } sx={{ fontFamily:'montserrat', fontWeight:500, fontSize:'0.9rem' }} >{row.sub_category_name}</MenuItem>
            ))
          }
      
        </Select>
        </FormControl>

        <FormControl disabled={!age2} sx={{ width:{lg:'22rem', sm:"22rem", md:"22rem", xs:"18rem" } }} >
        <InputLabel id="demo-simple-select-label" sx={{ fontFamily:'montserrat', fontWeight:500 }} >Product Bin</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age3}
          label="Product Bin"
          onChange={handleChange3}
          required
          sx={{ fontFamily:'montserrat', fontWeight:500 }}
        >
        { progress3 ? <LinearProgress/> : 
        Array.isArray(productBinData) && productBinData?.map((row) => (
            <MenuItem value={row.id} sx={{ fontFamily:'montserrat', fontWeight:500 }} >{row.bin}</MenuItem>
          ))
        }
          

        </Select>
        </FormControl>
        {
          enableAmount ? <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:"row", gap:1.5 }} >

            <TextField required={enableAmount} InputLabelProps={{ style:{ fontFamily:"montserrat", fontWeight:500 }}} InputProps={{ style:{ fontFamily:"montserrat ", fontWeight:500 } }}  onChange={handleAmount} value={orderAmount} label="Amount" fullWidth />
          </Box> : 
          <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }} >
          <input 
          ref={fileInputRef}
          required={!enableAmount}
          id='file_input'
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          type='file' style={{  width:'13rem' }}
          onChange={handleFileChange}
          
          />
          {
            !age2 || !age || !age3 ? null : 
          <Box  sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'  }} >
          <DownloadingIcon onClick={() => handlelExcel(bin)} sx={{ color:'#2e71e6 ', cursor:"pointer" }} />
          <Typography sx={{ fontFamily:'montserrat', fontWeight:500 , color:'gray', fontSize:'0.6rem' }} >Sample File</Typography>
          </Box>
          }
          </Box>
        }
  
         
          
          </Box>

          {
            orderProgress ? <CircularProgress sx={{ mt:2 }} /> : 
          <Button fullWidth sx={{ mt:2 }} variant='contained' type="submit" >SUBMIT</Button>
          }

          </Paper>
          </form>
        </Box>
        </Box>
      </Box>

      </Box>
    
    <Box sx={{  marginTop:3, width:{lg:"90%", md:'90%', sm:"90%", xs:"95%" } }} >
          <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', gap:1 }} >
                <Typography sx={{ textAlign:'center', fontFamily:'montserrat', fontWeight:800, fontSize:{lg:'1.3rem', md:"1.3rem", sm:"1.3rem", xs:"0.9rem" }, color:'#0078f0', textTransform:'capitalize' }} > previous order history  </Typography>
                <ArrowDownwardIcon sx={{ color:"#0078f0", fontSize:"1.7rem" }} />
              </Box>
              <Box sx={{ backgroundColor:'white',  borderRadius:2, padding:{lg:3, md:3, sm:3, xs:1 }}} >
                
                {
                  tableView ? <LinearProgress sx={{ mt:4 }} /> :
                

            <TableContainer  elevation={16} component={Paper} sx={{ mt:1 }} >
                <Table sx={{ width:'100%' }} aria-label="simple table">  

                    <TableHead>
                    <TableRow sx={{ backgroundColor:'#219bff' }} >
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:{lg:"0.9rem", md:"0.9rem", sm:"0.9rem", xs:"0.75rem"  } }}   >Sr. No</TableCell>
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:{lg:"0.9rem", md:"0.9rem", sm:"0.9rem", xs:"0.75rem"  } }}   >Order Date</TableCell>
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:{lg:"0.9rem", md:"0.9rem", sm:"0.9rem", xs:"0.75rem"  } }}   align="center">Order Id</TableCell>
                        <TableCell  sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:{lg:"0.9rem", md:"0.9rem", sm:"0.9rem", xs:"0.75rem"  } }}  align="center">File</TableCell>
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:{lg:"0.9rem", md:"0.9rem", sm:"0.9rem", xs:"0.75rem"  } }}   align="center">Checker Status</TableCell>
                        <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:{lg:"0.9rem", md:"0.9rem", sm:"0.9rem", xs:"0.75rem"  } }}   align="center">Order Status</TableCell>
                        <TableCell  sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:{lg:"0.9rem", md:"0.9rem", sm:"0.9rem", xs:"0.75rem"  } }}  align="center"> Remark</TableCell>
                        <TableCell  sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:{lg:"0.9rem", md:"0.9rem", sm:"0.9rem", xs:"0.75rem"  } }}  align="center"> Category</TableCell>
                        <TableCell  sx={{ fontFamily:'montserrat', fontWeight:500 , color:'white', fontSize:{lg:"0.9rem", md:"0.9rem", sm:"0.9rem", xs:"0.75rem" }, position:{xs:"sticky", md:null, lg:null}, right:{xs:0, md:null, lg:null}, zIndex:{xs:3, md:null, lg:null} , backgroundColor:{xs:"#2196f3", md:"transparent", lg:"transparent"} }}  align="center">Action</TableCell>

                    </TableRow>
                    </TableHead>
                    
                    <TableBody>
                    {
                        userTableData.slice((page - 1) * 10, (page - 1) * 10 + 10)?.map((row, index) => (  
                          <Slide direction='up' mountOnEnter unmountOnExit in={ userTableData } >
                            
                            <TableRow
                             key={index}
                             sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  >{index + 1}</TableCell>
                                <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:{lg:"0.8rem", sm:"0.75rem", xs:'0.7rem',md:'0.8rem' }  }}  >{ moment(row.created_at).format("DD MMMM YYYY - hh:mm a")}</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  >{row.order_id}</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem", color:"#a200e8"  }}  >{row.file_path === null ? "Topup" : <DownloadingIcon color='primary' size={10} variant='outlined' sx={{fontFamily:"montserrat",fontWeight:500, cursor:'pointer' }} onClick={() => window.open(`  ${row.file_path}`)} /> }</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:600 , fontSize:"0.8rem", color:row.Corporate_Status === 1 ? "#ff9900" : row.Corporate_Status === 2 ? "#3cb82e" : row.Corporate_Status === 3 ? "red" : row.Corporate_Status === 4 ? "#21d10d" : null }}  >{row.Corporate_Status === 1 ? "PENDING" : row.Corporate_Status === 2 ? "APPROVED" : row.Corporate_Status === 3 ? "REJECTED" : row.Corporate_Status === 4 ? "COMPLETE" : null }</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:600 , fontSize:"0.8rem", color:row.status === 1 ? "#ff9900" : row.status === 2 ? "#1bc900" : row.status === 3 ? "red": row.status === 4 ? "#3fc462" : null  }}  >{row.status === 1 ? "PENDING" : row.status === 2 ? "APPROVED" : row.status === 3 ? "REJECTED" : row.status === 4 ? "COMPLETE" : null  }</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem" , color:row.remark === "testing" ? "black": "gray" }}  > {row.remark} </TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem" , color:"#1662f2" }}  >{row.category_name}</TableCell>
                                <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem" , color:'#b5b5b5', cursor:'pointer',  position:{xs:"sticky", md:null, lg:null, sm:null }, right:{xs:0, md:null, lg:null}, zIndex:{xs:3, md:null, lg:null} , backgroundColor:{xs:"white", md:"transparent", lg:"transparent"} }} onClick={() => handleCardAction(row.id)}  > <RemoveRedEyeIcon sx={{ fontSize:'1.2rem' }} /> </TableCell>
                            </TableRow>
                            </Slide>
                        ))
                    }
                    </TableBody>
                </Table>
                </TableContainer>
                }

                <Pagination
                    size='medium'
                    style={{
                        width: 'auto',
                        paddingTop:50,
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'center',
                        marginBottom:20
                    }}
                    variant='outlined'
                    color='primary'
                    count={(userTableData?.length / 10).toFixed(0)}
                    onChange={(_, value) => {
                        setPage(value);
                        window.scroll(0,450)
                    }}
                />

            </Box>
            </Box>
            
            <Dialog
            open={openAction}
            onClose={handleActionClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
              sx={{
                
                "& .MuiDialog-container": {
                  "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: 1100, 
                  },
                },
              }}
            
          >

            <DialogTitle sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', margin:"0rem 1rem" }}  id="alert-dialog-title">
              <Typography sx={{ fontFamily:'montserrat', fontWeight:500, fontSize:"1.2rem", textTransform:'capitalize', textAlign:'center' }} > order details</Typography>
              
              <Box component='img'  src={eezib} sx={{ width:'5rem', cursor:'pointer', ml:-10 }} />

              <CancelPresentationIcon onClick={() => setOpenAction(false)} sx={{ color:'#7d7675', cursor:"pointer" }} />
            </DialogTitle>
            <DialogContent>
            { actionProgress ? <LinearProgress sx={{ mt:"0.5rem" }} fullWidth /> :
                <TableContainer elevation={16} component={Paper} sx={{ marginTop:0 }} >
                    <Table sx={{ minWidth: 650 ,backgroundColor:'white' }} aria-label="simple table">
                        <TableHead>
                        <TableRow sx={{ backgroundColor:'#219bff' }} >
                            <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }} align="center"  >Sr. No</TableCell>
                            <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }} align="center"  >Name</TableCell>
                            <TableCell  sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}  align="center">Amount</TableCell>
                            <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}   align="center">Mobile No</TableCell>
                            <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}   align="center">Email ID</TableCell>
                            <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}   align="center">Reference Number</TableCell>
                        </TableRow>
                        </TableHead>
                        {/* {
                          actionData?.[0] === null ? <Typography>NO data</Typography>
                        } */}
                        <TableBody>
                        { Array.isArray(actionData) &&  actionData?.map((row, index) => (
                                <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell align="center" sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.95rem"  }}  >{ index + 1}</TableCell>
                                    <TableCell align="center" sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.95rem" , color:"#03136b"   }}  >{row.NAME}</TableCell>
                                    <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.95rem"  }}  >₹{ row.AMOUNT }</TableCell>
                                    <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.95rem"  }}  >{row.MOBILENO}</TableCell>
                                    <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.95rem"  }}  >{row.EMAIL_ID}</TableCell>
                                    <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.95rem"  }}  >{row.REF_NO}</TableCell>

                                </TableRow>
                            ))
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
        }
            </DialogContent>
            
          </Dialog>
            </Box>

            <Snackbar
            anchorOrigin={{ vertical:"top", horizontal:"right" }}
            open={handleErr}
            onClose={handleErrClose}
            autoHideDuration={2500}
            >
              <Alert severity='error' >{jsonError}..</Alert>
            </Snackbar>


      
      <Snackbar
      anchorOrigin={{ vertical:"top", horizontal:"right" }}
      open={handleSuccess}
      onClose={HandleSuccessClose}
      autoHideDuration={2500}
      >
        <Alert severity='success' >{jsonSuccess}..</Alert>
      </Snackbar>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={downloadMenu}
        onClose={handleDownloadClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      
      >
        <MenuItem  sx={{ fontFamily:"montserrat", fontWeight:500, fontSize:"0.9rem" }} disabled >Download Format</MenuItem>
        {
          subCategoryCard?.map((data) => {
            console.log("excel data : ",data);
              return(

                data.file_path === null ? 
                <MenuItem onClick={() => handlelExcel(data.format)} sx={{ fontFamily:"montserrat", fontWeight:500, fontSize:"0.9rem" }} >{data.sub_category_name}</MenuItem> 
                : 
                <MenuItem onClick={() => window.open(data.file_path ,"")} sx={{ fontFamily:"montserrat", fontWeight:500, fontSize:"0.9rem" }} >{data.sub_category_name}</MenuItem>  
              )
          }
          )
        }
      </Menu>
        {/* <MenuItem sx={{ fontFamily:"montserrat", fontWeight:500, fontSize:"0.9rem" }} >Euronet Prepaid Physical</MenuItem> */}

    <Footer/>

    </motion.div>
    
      )
  }
           

export default CardOrder