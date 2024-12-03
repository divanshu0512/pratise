import { Alert, Box, Button, CircularProgress, Dialog, DialogContent, Paper, Snackbar, TextField, Typography, capitalize } from '@mui/material'
import React from 'react'
import handCard from "../images/handCard.png";
import imageLogo from "../images/eezib.png";
import imageLogo2 from "../images/eezib2.png"
import { Link, useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Formik, useFormik } from 'formik';
import Cookies from 'js-cookie'; 
import CloseIcon from '@mui/icons-material/Close';
import forgetPass from "../images/forgetPass.png"
import otpImage from "../images/otpImage.png";
import newPassImage from "../images/new pass.png"
import { useTheme, useMediaQuery } from '@mui/material';

const Login = () => {
  
  const [email, setEmail] = React.useState('');
  const [password , setPassword] = React.useState('');
  const [emailError , setEmailError] = React.useState('');
  const [error , setError] = React.useState(false);
  const [progress, setProgress] = React.useState(false)
  const [jsonError, setJsonError] = React.useState('');
  const [open , setOpen] = React.useState(false);
  const [forgotPass , setForgotPass] = React.useState(false);
  const  [forgotOtp , setForgotOtp] = React.useState('');
  const [otp , setOtp] = React.useState('');
  const [newPass , setNewPass] = React.useState(false);
  const [newPassword , SetNewPassword] = React.useState('');
  const [fPassNo, setFpassNo] = React.useState('');
  const [jsonSuccess , setJsonSuccess] = React.useState('');
  const [openError , setOpenError] = React.useState(false);
  
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));

  const submitFPassNo = async() => {
    let url = process.env.REACT_APP_UAPI_URL
    const fetchData = await fetch(`${url}/api/forgotPassword`, {
      method:"POST",
      headers:{
        "Content-Type":"application/json", 
      },
      body:JSON.stringify({ "phone_no": fPassNo })
    })

    const json = await fetchData.json();
    
    if(json){
      if(json.status === "success"){
        setOpen(true);
        setJsonSuccess(json.message);
        setForgotPass(false);
        setForgotOtp(true);
      }
      else if(json.status === "error"){
        setOpenError(true)
        setJsonError(json.message);
      }
    }

  }

  
  const handleClose = () => {
    setOpen(false)
  };
  
  
  const handleForgotPasssClose = () => {
    setForgotPass(false)
  }

  const navigate = useNavigate();

  const checkEmail = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const checkButton = password.length < 4 && password.length > 1

  const isSubmitData = !password || !checkEmail




  const checkLoginFunc = () => {
    if(window.location.search?.includes("?home") ){

      const urlAuth = window.location.search;
      const token = urlAuth.replace("?home=","")

      navigate('/validate' , {state : {data : {"token":token }}})
    }
  }

  React.useEffect(() => {
    checkLoginFunc();
  },[])
  
  async function getNextAccess(){

    setProgress(true)

    let url = process.env.REACT_APP_URL
    
    const fetchHanlde = await fetch(`${url}/api/auth/login`, {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({"email":email, "password":password})
    })
    const json = await fetchHanlde.json();
    setProgress(false)

    if(json){
      if(json.status === 'error' ){
        setOpen(true)
        setJsonError(json.message)
      } 
      else if(json.status === 'success'){
        const token = json.data.original.access_token
        Cookies.set("demoAuth",token)
        navigate('/validate' , {state : {data : {"token":token }}})
      }
    }
  }

  let url = process.env.REACT_APP_URL

  

  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:"100vh", backgroundImage: isXs || isSm ? "linear-gradient(20deg, white,  #3243a6db)" : null }} >

{
  isXs || isSm ? null : 
<Box sx={{  height:"100vh", width:'55%', position:'relative', overflow:'hidden', backgroundColor:'#3243a6db' , borderRadius:'0px 0px 520px 0px ' }} >
        <Typography sx={{ position:'relative', textAlign:'center', textTransform:'capitalize', fontFamily:"montserrat", marginTop:'5%', fontWeight:600, color:'white', fontSize:38, textShadow:'0px 0px 2.5px white' }} >welcome to eezib </Typography>
            <Box component='img' src={handCard} sx={{ zIndex:1, position:'fixed', width:{lg:580 , md:560 , sm:500, xs:550}, bottom:0, }} />
    </Box>
}

    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center',  width:'45%' }} >
      <Paper elevation={ 10 } sx={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:3.5, padding:{lg:'2rem 2rem', sm:'2rem 2rem', md:'2rem 2rem', xs:'2rem 2rem' }, borderRadius:5 }} >          
        <Box component='img' src={imageLogo} sx={{ width:{lg:150, md:150, sm:180, xs:130 } }} />
        <TextField name='email' error={ !checkEmail && email.length >= 1  } helperText={ !/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && email.length >= 1 ? "enter valid email" : null} onChange={(e) => setEmail(e.target.value)} value={email} label="Enter email address" variant='standard' size='medium' InputLabelProps={{ style:{ fontFamily:'Poppins'} }} inputProps={{ style:{fontFamily:'Poppins' } }} sx={{ width:{lg:360 , md:320, sm:230 ,xs:250 } , borderRadius:150  }} />
        <TextField type='password' name="password" error={ checkButton } helperText={ password.length >= 1 && password.length < 4 ? "minimum length must be 6" : null} onChange={(e) => setPassword(e.target.value)} value={password} label="Enter password" variant='standard' size='medium' InputLabelProps={{ style:{ fontFamily:'Poppins'} }} inputProps={{ style:{fontFamily:'Poppins'} }} sx={{ width:{lg:360 , md:320, sm:230 ,xs:250 } , borderRadius:150  }} />
        <Box sx={{ display:'flex', alignItems:"center", justifyContent:'space-between', width:"100%" }} >
        <Typography sx={{ fontFamily:'Poppins', fontWeight:400 , color:'#0d55ff', fontSize:12, marginTop:-1.5 , marginBottom:-1.5, cursor:'pointer', marginLeft:'auto' }} >Forgot password ?</Typography>
        </Box>
        {
          progress ? <CircularProgress/> : 
          <Button onClick={getNextAccess} disabled={ isSubmitData } variant='contained' sx={{ width:{lg:360 , md:320, sm:230 ,xs:250 }, fontWeight:500, fontFamily:'Poppins', letterSpacing:1.5 }} >LOGIN</Button>
        }
        {/* <Link to="https://uat.eezib.in/register"  >Get Your Eezib Corporate Account Now</Link> */}
          
      <Box elevation={8} sx={{ display:'flex', alignItems:'center', justifyContent:'space-around', padding:0.5,  width:"100%" }} >
        <FacebookIcon onClick={() => window.open('https://www.facebook.com/eezibindia/','')} sx={{ fontSize:'2.2rem', color:'#0043d4', cursor:'pointer' }} />
        <TwitterIcon onClick={() => window.open('https://twitter.com/i/flow/login?redirect_after_login=%2Feezibtech', "")} sx={{ fontSize:'2.2rem', color:"#00bfff" , cursor:'pointer' }} />
        <InstagramIcon onClick={() =>  window.open("https://www.instagram.com/eezibtech/", "") } sx={{ fontSize:'2.2rem' , cursor:'pointer', color:"#d573ff" }} />
      </Box>

        <Typography onClick={() => window.open(`${url}/register`, "") } sx={{ fontFamily:'Poppins', fontWeight:400 , color:'gray', fontSize:15, marginTop:-1.5 , marginBottom:-1.5, cursor:'pointer' }} >create corporate account</Typography>
      </Paper>
    </Box>

    <Snackbar
    anchorOrigin={{ vertical:"top", horizontal:"right" }}
    open={open}
    onClose={handleClose}
    autoHideDuration={2500}
    >
      <Alert severity='error' >{jsonError}..</Alert>
    </Snackbar>

    <Dialog
        open={forgotPass}
        onClose={handleForgotPasssClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        
      >
        <CloseIcon onClick={() => setForgotPass(false)} sx={{ marginLeft:'auto', color:'white', backgroundColor:'red', fontSize:"1.1rem", cursor:'pointer' }}  />

        <DialogContent sx={{ backgroundColor:'white', margin:0, padding:1, width:"20rem" }} >
          <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:1 }} >
            <Box>
              <Box component='img' src={forgetPass} sx={{ width:"15rem" }} />
            </Box>

            <Box>
              <Typography sx={{ fontFamily:'montserrat', fontWeight:600, fontSize:'1.2rem', textAlign:'center' }} > Forgot Password !</Typography>
              <Box>
              <Typography sx={{ textAlign:'center', fontFamily:'montserrat', fontWeight:500, fontSize:'0.8rem', marginTop:'1rem', textTransform:"capitalize", color:'#a4a6a5' }} >please enter registered mobile number</Typography>
              <TextField helperText={ fPassNo.length >= 1 && (fPassNo.length < 10 ||  fPassNo.length < 10 )? "Enter Valid Mobile Number" : null } fullWidth type='tel' label="enter mobile number" value={fPassNo} onChange={(e) => setFpassNo( e.target.value )} inputProps={{ style:{fontFamily:'Poppins' } }} InputLabelProps={{ style:{ fontFamily:'Poppins', textTransform:"capitalize"} }} sx={{ marginTop:"0.6rem" }} />
              <Button  disabled={ fPassNo.length > 10 || fPassNo.length < 10 } fullWidth sx={{ fontFamily:'montserrat', fontWeight:500, mt:'1rem' }} variant='contained' >get otp</Button>
              </Box>
            </Box>

          </Box>
        </DialogContent>
       
      </Dialog>

    </Box>
  )
}

export default Login