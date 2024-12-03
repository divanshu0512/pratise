import { Box, CircularProgress, Typography } from '@mui/material'
import Cookies from 'js-cookie';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ValidateUser = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const locationData = location.state.data;
    const auth = locationData.token;
    const url = process.env.REACT_APP_URL

    const validateUser = async() => {

        const url = process.env.REACT_APP_URL
        const fetchData = await fetch(`${url}/api/auth/validate_login`, {
            method:"POST",
            headers:{
                "Access-Control-Allow-Origin":"*",
                "Accept":"application/json",
                "Authorization":`Bearer ${auth}`
            }
        });
        const json = await fetchData.json();

        if(json){
            if(json.status === "success"){
                Cookies.set("demoAuth",json.data.Token);
                localStorage.clear();
                navigate('/dashboard' , {state : {data : {"token":json.data.Token}}})
            }

            if (json.status === "error"){
                navigate("/")
            }

            if(json.message === "Unauthenticated." ){
                window.alert("Unauthenticated")
                window.location.replace(`${url}/logout`);
            }
        }
    }

    React.useEffect(() => {
         validateUser();
    },[])

  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }} >
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center' }} >
            <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center' , flexDirection:'column', marginTop:-5, gap:5}} >
                <CircularProgress size={150} thickness={1} />
                <Typography sx={{ fontFamily:'montserrat', fontWeight:600 , fontSize:{ lg:'1.5rem', md:"1.2rem", sm:"1rem", xs:"1rem" }, textTransform:'capitalize'  }} >Validating user.. </Typography>
                </Box>
        </Box>
    </Box>
    )
}

export default ValidateUser