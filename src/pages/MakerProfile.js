import { Alert, Box, Button, Divider, Snackbar, TextField, Typography } from '@mui/material'
import React from 'react'
import Header from '../components/Header'
import Cookies from 'js-cookie'
import { is } from 'date-fns/locale'
import profileCard from "../images/profile.png"
import Footer from './Footer'
import { useNavigate } from 'react-router-dom'

const MakerProfile = () => {

    const [name , setName ] = React.useState('');
    const [email , setEmail ] = React.useState('');
    const [phoneNumber , setPhoneNumber ] = React.useState('');
    const [virtualAccount , setVirtualAccount ] = React.useState('');
    const [ifsc , setIfsc ] = React.useState('');
    const [bankName , setBankName ] = React.useState('');
    const [handleSuccess , setHandleSuccess ] = React.useState(false);
    const [jsonSuccess , setJsonSuccess ] = React.useState('');  
    const  [  jsonInfo , setJsonInfo ] = React.useState(false)
    const  [ jsonInfoMsg, setJsonInfoMsg ] = React.useState(false);
    const  [ handleErr , setHandleErr] = React.useState(false);
    const [ jsonError , setJsonError ] = React.useState('');

    const authAccess = Cookies.get("demoAuth");

    const navigate = useNavigate();

    const HandleSuccessClose = () => {
        setHandleSuccess(false);
      }

      const handleInfo = () => {
        setJsonInfo(false)
      }

    const makerProfile = async() => {
        const url = process.env.REACT_APP_URL
        const fetchData = await fetch(`${url}/api/auth/profile`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${authAccess}`
            },
        });
        const json = await fetchData.json();
        if(json){
            if(json.status === "success"){
                const formal = json.data;
                setName(formal.name);
                setEmail(formal.email);
                setPhoneNumber(formal.phone_no);
                setVirtualAccount(formal.virtual_account);
                setIfsc(formal.IFSC_Code);
                setBankName(formal.bank_name);
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
    };

    React.useEffect(() => {
        makerProfile()
    },[])

    const getData = () => {
    }

    const changeUserData = async() => {

        const url = process.env.REACT_APP_URL

        const fetchData = await fetch(`${url}/api/auth/update_profile`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${authAccess}`
            },
            body:JSON.stringify({ "name":name, "phone_no":phoneNumber, "email":email })
        });


        const json = await fetchData.json();

        if(json){
            if(json.status === "success"){
                setJsonSuccess(json.message);
                setHandleSuccess(true);
            }
            if(json.status === "error"){
                setJsonInfoMsg(json.message);
                setJsonInfo(true);
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

    }

  return (
    <Box className="cardOrderContainer" sx={{ minHeight:"100vh" }}>
        <Header/>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', marginTop:{lg:10, md:10, sm:5, xs:2 }, gap:5, flexDirection:{ lg:"row", md:"row", sm:"column", xs:"column" }, mb:"3rem" }} >

            <Box component='img' src={profileCard} sx={{ width:{ lg:"35rem", md:"35rem",sm:'30rem', xs:"22rem" } }} />

        <Box sx={{ backgroundColor:'white', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', borderRadius:3 }} >
             <Typography sx={{ fontFamily:"montserrat", fontWeight:500, fontSize:"1.2rem", padding:1, mt:2 }} > Profile Details </Typography>
                <Divider variant='middle' />
             <Box sx={{  padding:3, display:'flex', alignItems:'center', justifyContent:'center', gap:2 , flexDirection:'column'  }} >


                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', gap:1, flexDirection:{lg:'row', md:"row", sm:'column', xs:"column" }  }}  >
                    <TextField value={name} onChange={(e) => setName(e.target.value)} sx={{ width:{lg:"17rem", md:'17rem', sm:'20rem', xs:'17rem' } }} InputProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} label="Name">{name}</TextField>
                    <TextField variant='filled' InputProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }}  value={phoneNumber} sx={{ width:{lg:"17rem", md:'17rem', sm:'20rem', xs:'17rem' } }} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} label="Phone Number" />

                </Box>

                <Box >
                <TextField variant='filled' InputProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} value={email} sx={{ width:{lg:"34rem", md:"30rem", sm:"20rem", xs:"17rem"} }} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} label="Email" />
                </Box>

                <Box>
                <TextField variant='filled' InputProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} value={virtualAccount} sx={{ width:{lg:"34rem", md:"30rem", sm:"20rem", xs:"17rem"} }} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} label="Virtual Account Number" />
                </Box>

                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', gap:2, flexDirection:{lg:'row', md:"row", sm:'column', xs:"column" } }}>
                <TextField variant='filled' InputProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} value={bankName}  sx={{ width:{lg:"17rem", md:'17rem', sm:'20rem', xs:'17rem' } }} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} label="Bank" />
                <TextField variant='filled' InputProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} sx={{ width:{lg:"17rem", md:'17rem', sm:'20rem', xs:'17rem' } }} value={ifsc}  InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} label="IFSC Code" />

                </Box>

                <Button onClick={() => changeUserData()} variant='outlined' sx={{ fontFamily:'montserrat', fontWeight:500 }} fullWidth >Submit</Button>

             </Box>
        </Box>
        </Box>
        <Box sx={{ position:'fixed', bottom:0, width:"100%" }} >
            <Footer/>
        </Box>


        <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"right" }}
        open={handleSuccess}
        onClose={HandleSuccessClose}
        autoHideDuration={2500}
        >
        <Alert severity='success' >{jsonSuccess}..</Alert>
        </Snackbar>

        <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"right" }}
        open={jsonInfo}
        onClose={handleInfo}
        autoHideDuration={1000}
        >
        <Alert severity='info' >{jsonInfoMsg}..</Alert>
        </Snackbar>

    </Box>
  )
}

export default MakerProfile