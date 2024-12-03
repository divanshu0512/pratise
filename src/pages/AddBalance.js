import React from 'react'
import Header from '../components/Header'
import { Alert, Box, Button, CircularProgress, LinearProgress, Paper, Snackbar, TextField, Typography } from '@mui/material'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Footer from './Footer';
import { useRef } from 'react';

const AddBalance = () => {

    const [error, setError] = React.useState('');
    const [amount , setAmount] = React.useState('');
    const [ confirmAmount , setConfirmAmount ] = React.useState('');
    const [ txnNumber , setTxnNumber ] = React.useState('');
    const [ remark , setRemark ] = React.useState('');
    const [image , setImage ] = React.useState(false);
    const [imageFile , setImageFile] = React.useState('');
    const [handleSuccess , setHandleSuccess ] = React.useState(false);
    const  [ handleErr , setHandleErr] = React.useState(false);
    const [ jsonError , setJsonError ] = React.useState('');
    const [jsonSuccess , setJsonSuccess ] = React.useState('');
    const [progress , setProgress] = React.useState(false);

    const auth = Cookies.get("demoAuth");

    const navigate = useNavigate();
    const inputFile = useRef(null);
    
    const handleErrClose = () => {
      setHandleErr(false)
    }

    const balance = async() => {
      try{


        if(amount < 100){
          setHandleErr(true);
          setJsonError("Amount cannot be less then 100");
          return
        }

        setProgress(true);
  
        const url = process.env.REACT_APP_URL
  
        const fetchData = await fetch(`${url}/api/maker/storemakeramount`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${auth}`
          },
          body:JSON.stringify({ "amount":amount, "amount_confirmation":confirmAmount, "transaction_number":txnNumber , "receipt":imageFile, "remark":remark })
        });
        const json = await fetchData.json();
        setProgress(false);
        if(json){
          if(json.status === "success"){
            setHandleSuccess(true);
            setJsonSuccess(json.message);
            setAmount('');
            setTxnNumber('');
            setRemark('');
            inputFile.current.value=''
            
           // window.location.reload();
          }
          if(json.status === "error"){
            setJsonError(json.message);
            setHandleErr(true);
          }

          if(json.message === "Unauthenticated."){
            setHandleErr(true);
            setJsonError(json.message);
            setTimeout(() => {
              window.location.replace(`${url}/logout`);
            },500)
        }
        }
      }catch(err){
        setHandleErr(true);
        setJsonError(err);
        setTimeout(() => {
            Cookies.remove("demoAuth");
            navigate("/")
        },1500)
      }

    }


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          // Handle file upload here
          
          setError('');
          setImage(true);

          // convert base64

          const reader = new FileReader();
          
          reader.onloadend = () => {
            const base64String = reader.result;
            const base64DataRegex = /^data:image\/\w+;base64,/;
            const base64Data = base64String.replace(base64DataRegex,'');
            setImageFile(base64Data);
          };
          reader.readAsDataURL(file);


        } else {
          setError('Please select a valid image file.');
        }
      };

      const HandleSuccessClose = () => {
        setHandleSuccess(false);
      }

  return (
    <Box className="cardOrderContainer" sx={{ height:"100vh" }} >
        <Header/>
        <ArrowBackIcon onClick={() => navigate(-1)} sx={{ position:'absolute' , left:10, mt:2, backgroundColor:"#5e85f2", padding:0.5, color:'white', borderRadius:"50%" }} />

    <Box sx={{ display:'flex', alignItems:'center', justifyContent:"center", flexDirection:'column', width:"100%" }} >
        <Paper elevation={18} sx={{ backgroundColor:'white', p:{lg:4, md:4, md:4, xs:3}, mt:{lg:5, md:5, md:3, xs:5}, borderRadius:3 }} >
            <Typography sx={{ fontFamily:'montserrat', fontWeight:600, fontSize:'1.5rem', textAlign:'center', mb:2, color:"#3d85bf", margin:"1rem 0rem" }} >Add Balance</Typography>

        <Box sx={{ display:'grid', gridTemplateColumns:{lg:'repeat(2,1fr)', md:'repeat(2,1fr)', sm:'repeat(2,1fr)', xs:'repeat(1,1fr)' }, gap:2, gridColumnGap:"2rem", gridRowGap:"1.5rem" }} >

            <TextField type='number' error={amount.includes('.')} helperText={ amount.includes('.') ? "Please Enter Valid Amount" : null } onChange={(e) => setAmount(e.target.value)} value={amount}  InputLabelProps={{ style:{fontFamily:'Poppins', fontWeight:500}}} sx={{ width:{lg:"25rem", md:"25rem", sm:"23rem", xs:"18rem"} }} label="Enter Amount" InputProps={{ style:{fontFamily:'Poppins', fontWeight:500} }} />
            <TextField onChange={(e) => setTxnNumber(e.target.value)} value={txnNumber} InputLabelProps={{ style:{fontFamily:'montserrat', fontWeight:500}}} sx={{ width:{lg:"25rem", md:"25rem", sm:"23rem", xs:"18rem"} }} label="Bank Transaction Number" InputProps={{ style:{fontFamily:'Poppins', fontWeight:500} }} />
            <Box>
            <input
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept="image/*"
            ref={inputFile}
            onChange={handleFileChange}
        />
      {error && <p style={{ color: 'red' }}>{error}</p>}
            </Box>

        </Box>
      <TextField value={remark} onChange={(e) => setRemark(e.target.value)} InputLabelProps={{ style:{fontFamily:'montserrat', fontWeight:500}}} sx={{ mt:2 }} fullWidth label="Enter Remark" InputProps={{ style:{fontFamily:'Poppins', fontWeight:500} }} />
      {
        progress ? <LinearProgress sx={{ mt:2.5 }} /> : 
        <Button onClick={balance} disabled={ !amount || !txnNumber || !remark || !image || amount.includes(".") } sx={{ mt:2 }} variant='contained' fullWidth >SUBMIT</Button>

      }
        </Paper>

    </Box>
        <Box sx={{ position:"absolute", bottom:0 , display:'flex', alignItems:'center', flexDirection:"column", width:"100%" }} >
          <Footer sx={{ width:"100%" }} />
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

    </Box>
  )
}

export default AddBalance