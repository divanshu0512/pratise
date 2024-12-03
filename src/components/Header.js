import React, { useRef } from 'react'
import { Alert, AppBar, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControl, InputLabel, LinearProgress, Menu, MenuItem, Select, Snackbar, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import eezibLogo from "../images/eezib.png"
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Cookies from 'js-cookie';
import Footer from '../pages/Footer';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ListItemIcon from '@mui/material/ListItemIcon';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import excelIcon from "../images/uploadIcon.png";
import * as XLSX from 'xlsx';
import CloseIcon from '@mui/icons-material/Close';
import DownloadingIcon from '@mui/icons-material/Downloading';
import { saveAs } from 'file-saver';
import { useTheme, useMediaQuery } from '@mui/material';


const Header = () => {

  const navigate = useNavigate();
  const fileInputRef= useRef();




  const [openPassword , setOpenPassword] = React.useState(false); 
  const [oldPass , setOldPass] = React.useState("");
  const [newPass , setNewPass] = React.useState("");
  const [confirmPass , setConfirmPass] = React.useState("");
  const  [ handleErr , setHandleErr] = React.useState(false);
  const [ jsonError , setJsonError ] = React.useState('');
  const [jsonSuccess , setJsonSuccess ] = React.useState('');
  const [handleSuccess , setHandleSuccess ] = React.useState(false);

  const [process1 , setProcess1] = React.useState(false);
  const [process2 , setProcess2] = React.useState(false);

  const [ openExcelupload , setOpenExcelUpload ] = React.useState(false);
  const [ categories , setCategories ] = React.useState(  );

  const [anchorElCat, setAnchorElCat] = React.useState(null);
  const openCat = Boolean(anchorElCat);

  const [ base64 , setBase64 ] = React.useState('');

  const [ catId , setCatId ] = React.useState("");
  const [ subCatId ,setSubCatId ] = React.useState(""); 

  
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));

  const userCred = (category ,subCatategory) => {
    console.log(category, subCatategory)

    setCatId(category);
    setSubCatId(subCatategory);

  }

  const handleCatClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCatClose = () => {
    setAnchorEl(null);
  };

  const handleExcelClose = () => {
    setOpenExcelUpload(false);
  }

  const handlePasswordClose = () => {
    setOpenPassword(false)
  }

  const handleErrClose = () => {
    setHandleErr(false)
  }

  const HandleSuccessClose = () => {
    setHandleSuccess(false);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);

  const openMenu2 = Boolean(anchorE2);

  const openOrder = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const openName = Boolean(anchorEl2);

  const [anchorEl3, setAnchorEl3] = React.useState(null);

  const [ cat , setCat ] = React.useState("");

  const openMenu = Boolean(anchorEl3);

  const handlelCloseMenu2 = (event) =>{
    setAnchorE2(null)
  }

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl3(null);
  }

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

 // console.log("location data : ",window.location);

  const authAccess = Cookies.get("demoAuth");

  const handlePassChange = async() => {

    try{
      setProcess1(true)

      const url = process.env.REACT_APP_URL
      const fetchData = await fetch(`${url}/api/auth/update_password`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${authAccess}`
        },
        body:JSON.stringify({ 
          "oldpassword":oldPass,
       "newpassword":newPass,
       "confirmpassword":confirmPass
         })
      });
      const json = await fetchData.json();
      setProcess1(false);
  
      if(json){
        if(json.status === "error"){
          setHandleErr(true); 
          setJsonError(json.message);
        }
        if(json.status === "success"){
          setHandleSuccess(true);
          setJsonSuccess(json.message);
          setOldPass("");
          setNewPass("");
          setConfirmPass("");
          setOpenPassword(false);
        }
      }

    }catch(err){
      setHandleErr(true); 
      setJsonError(err);
    }


  }

  const handleLogout = async() => {

    setProcess2(true);

    try{

      const url = process.env.REACT_APP_URL
    const fetchData = await fetch(`${url}/api/auth/logout`, {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${authAccess}`
      },
      body:JSON.stringify({  })
    });
    const json = await fetchData.json();
    setProcess2(false);
    if(json){
      if(json.status === "error"){
        setHandleErr(true); 
        setJsonError(json.message);
      }
      if(json.status === "success"){
        setTimeout(() => {
          Cookies.remove("demoAuth")
          window.location.replace(`${url}/logout`)
        },0)
      }
    }

    }catch(err){
      setHandleErr(true); 
      setJsonError(err);
    }
  }

  const url = process.env.REACT_APP_URL

  const manageDashboard = () => {
    const data = window.location.pathname
    console.log("window location : ",data); 

    if(data === "/makerui/dashboard"){
      window.location.reload();
    }else{
      navigate("/dashboard");
    }
  }

  const manageReport = () => {
    const data = window.location.pathname
    console.log("window location : ",data); 

    if(data === "/makerui/report"){
      window.location.reload();
    }else{
      navigate("/report");
    }
  }
  
  // navigate("/uploadcard" , {state : {data : {}}}

  const manageCardOrder = () => {
    const data = window.location.pathname
    console.log("window location : ",data); 

    if(data === "/makerui/uploadcard"){
      window.location.reload();
    }else{
      navigate("/uploadcard" , {state : {data : {}}});
    }
  }












  // *********************************** Header Part ***************************************

  const initialSeconds = 3600; 
  
    const [seconds, setSeconds] = React.useState(initialSeconds);
  
    React.useEffect(() => {
      const storedStartTime = Math.floor(parseInt(localStorage.getItem('timerStartTime'), 10));
      const currentTime = Math.floor(Date.now());
  
      const calculateInitialTimer = () => {
        if (!storedStartTime || (currentTime - storedStartTime) > initialSeconds * 1000) {
          // If there is no stored start time or the elapsed time is greater than the initial seconds,
          // set a new start time and reset the timer.
          localStorage.setItem('timerStartTime', Math.floor(currentTime));
          localStorage.setItem('timerSeconds', initialSeconds);
          setSeconds(initialSeconds);
        } else {
          // Calculate the remaining time based on the elapsed time.
          const elapsedTime = Math.floor((currentTime - storedStartTime) / 1000);
          const newSeconds = Math.floor(Math.max(0, initialSeconds - elapsedTime));
          setSeconds(newSeconds);
  
          if (newSeconds === 0) {
            // Timer has reached 0, navigate to the desired page (e.g., '/')
            navigate('/');
          }
        }
      };

      const url = process.env.REACT_APP_URL
  
      const handleAddThirtyMinutes = async() => {
  
        const data = await fetch(`${url}/api/auth/validate_login`, {
          method:"POST",
          headers:{
              "Access-Control-Allow-Origin":"*",
              "Accept":"application/json",
              "Authorization":`Bearer ${authAccess}`
          }
      });
        const json = await data.json();
        console.log("jon refresh data : ",json);
  
        if(json){
  
          if(json.Status === "Success"){
            console.log("enter access");

              const shouldAddTime = window.confirm('Session about to expire. Extend session ?');
              if (shouldAddTime) {
                // Add 60 minutes to the timer
                const extendedTime = seconds + 3600; // 60 minutes in seconds = 3600
                const newStartTime = Math.floor(Date.now());
                localStorage.setItem('timerStartTime', newStartTime);
                localStorage.setItem('timerSeconds', extendedTime);
                setSeconds(extendedTime);
  
                Cookies.remove("demoAuth");
                Cookies.set("demoAuth",json.Message.Token);
                console.log("token : ",json.Message.Token)

              }else{
                localStorage.clear();
                Cookies.remove("demoAuth");
                window.location.replace(`${process.env.REACT_APP_URL}/logout`)
              }
            }
  
        }
  
  
        
      };
  
      calculateInitialTimer();
  
      // Set up a timer interval to update the timer every second
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = Math.floor(Math.max(0, prevSeconds - 1));
          localStorage.setItem('timerSeconds', newSeconds);
  
          // Check if the timer has reached 15 seconds
          if (newSeconds === 10) {
            console.log("entered 10")
            handleAddThirtyMinutes();
          }
  
          // Check if the timer has reached 0, and navigate to the desired page (e.g., '/')
          if (newSeconds === 0) {
            localStorage.clear();
            Cookies.remove("demoAuth");
            window.location.replace(`${process.env.REACT_APP_URL}/logout`)
          }
  
          return newSeconds;
        });
      }, 1000);
  
      // Clear the interval on component unmount
      return () => clearInterval(intervalId);
    }, [initialSeconds, seconds, navigate]);
  
    const formatTime = (timeInSeconds) => {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = Math.floor(timeInSeconds % 60);
  
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
  
    const handleCategoryChange = (event) => {
      setCat(event.target.value)
    }

    const getCategory = async() => {

      try{

        const url = process.env.REACT_APP_URL;

        const fetchData = await fetch(`${url}/api/gpr/gpr_category`, {
          method:"GET",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json",
            "Authorization":`Bearer ${authAccess}`
          }
        })
        const json = await fetchData.json();
        console.log("json data : ",json);
  
        if(json){
          if(json.status === "success"){
            setCategories(json.data);
            // setHandleSuccess(true);
            // setJsonSuccess(json.message)
          }
          if(json.status === "error"){
            setHandleErr(true);
            setJsonError(json.message);
          }
        }
      }catch(err){
            setHandleErr(true);
            setJsonError(err);
      }

    }

    React.useEffect(() => {
    getCategory()
    },[])

    const handleFileChange = (event) => {

      const file = event.target.files[0]

      console.log("file : ",file)
      if(!file){
        return
      }

      if( file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ){
        setHandleErr(true);
        setJsonError("Please Upload Valid .xlsx File");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }


      const reader = new FileReader();

      reader.onload = (e) => {
          const data = e.target.result;
          const base64String = btoa(data);
          setBase64(base64String);
          console.log(base64String); 

          const workbook = XLSX.read(data, { type: 'binary' });

          // Assuming the first sheet contains the data you want
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName]; 

          // Convert sheet data to JSON format
          const sheetData = XLSX.utils.sheet_to_json(sheet);

          const requiredHeaders = ['Name', 'Mobile', 'Email'];

          // Validate headers
          const headers = Object.keys(sheetData[0]);
          const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

          if (missingHeaders.length > 0) {
              // Display error message for missing headers
              setHandleErr(true);
              setJsonError(`The following headers are missing => ${missingHeaders.join(', ')}`);

              if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the file input
              }
              // setTimeout(() => {
              //   window.location.reload();
              // },1500)
              // fileInputRef?.current?.value = ""

             

          } else {
              // Clear any previous error message
              console.log(sheetData);
          }

         const mobileNumbers = new Set();



          sheetData.forEach((row, index) => {
            requiredHeaders.forEach(( header ) => {
              if(row[header] === undefined || row[header] === null || row[header].toString().trim() === "" ){
                setHandleErr(true);
                setJsonError(`Row ${index + 1}: ${header} is required.`);
                console.log('error found')
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""; // Clear the file input
                }
              }
            })

            
            // if (row.Mobile)
            //   if (!/^\d{10}$/.test(row.Mobile.toString().trim())){
            //   setHandleErr(true);
            //   setJsonError(`Row ${index + 1}: Mobile number must be exactly 10 digits.\n`);
            //   // errorMessage += `Row ${index + 1}: Mobile number must be exactly 10 digits.\n`;
            // }
            // else if (mobileNumbers.has(row.Mobile)) {

            //   setHandleErr(true);
            //   setJsonError(`Row ${index + 1}: Mobile number ${row.Mobile} is duplicated.\n`);

            // }

            console.log("movile list : ",row.Mobile);

            if (row.Mobile) {
              const mobileStr = row.Mobile.toString().trim();
              console.log("mobile ste : ",mobileStr);
              if (!/^\d{10}$/.test(mobileStr)) {
               setHandleErr(true);
               setJsonError(`Row ${index + 1}: Mobile number must be exactly 10 digits.`);      

               if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the file input
              }        

              } else if (mobileNumbers.has(mobileStr)) {
                setHandleErr(true);
                setJsonError(`Row ${index + 1}: Mobile number ${mobileStr} is duplicated.\n`); 

                   if (fileInputRef.current) {
                      fileInputRef.current.value = ""; // Clear the file input
                    }

                  setTimeout(() => {
                    // window.location.reload();
                  },1500)
                return;
              } else {
                mobileNumbers.add(mobileStr);
              }
            }

          const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (row.Email && (!emailRegex.test(row.Email.toString().trim()))) {
            // errorMessage += `Row ${index + 1}: Email format is invalid.\n`;
            setHandleErr(true);
            setJsonError(`Row ${index + 1}: Email format is invalid.`)

            if (fileInputRef.current) {
              fileInputRef.current.value = ""; // Clear the file input
            }

          }

          })

        


          const jsonSheet = sheetData?.map( row =>  ({ ...row, "Name":row.Name,  "Mobile":row.Mobile , "Email":row.Email }) )
          // setJsonData(jsonSheet);

          console.log("json sheet : ",jsonSheet)



      };

      reader.readAsBinaryString(file);

    }

    // console.log("json categories : ",categories)

    // http://ankur.local/eezib/api/gpr/store_gpr


    const submitForm = async() => {

      setProcess1(true);

      const userId = Cookies.get("userId");

      try{

        const url = process.env.REACT_APP_URL


        const fetchData = await fetch(`${url}/api/gpr/store_gpr`, {
          method:"POST",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json",
            "Authorization":`Bearer ${authAccess}`
          },
          body:JSON.stringify({ "user_id":userId, "category_id":catId, "subcategory_id":subCatId, "excel_file":base64, "file_type":".xlsx" })
        })
        const json = await fetchData.json();
        console.log("json data : ",json);

        setProcess1(false);

        if(fetchData.status === 500 ){
          setHandleErr(true);
          setJsonError(json.message);
        }
  
        if(json){
          if(json.status === "success"){
            setHandleSuccess(true);
            setJsonSuccess(json.message);
            window.open(`${url}/${json.data}`);

            if (fileInputRef.current) {
              fileInputRef.current.value = ""; // Clear the file input
            }

            // setTimeout(() => {
            //   window.location.reload();
            // },2500)
          }

          if(json.status === "error"){
            setHandleErr(true);
            setJsonError(json.message);
          }

          if(json.message === "Unauthenticated."){
            setHandleErr(true);
            setJsonError("Session Expire, Please login again.");
            Cookies.remove("demoAuth");

            setTimeout(() => {
              window.location.replace(`${url}/logout`);
            },500);

          }
        }
      }catch(err){
            setHandleErr(true);
            setJsonError(err);
      }

    }

    const handlelExcel = (e) => {     
      
      const data = [[ "Name", "Mobile", "Email" ]]

     const workbook = XLSX.utils.book_new();
     const worksheet = XLSX.utils.aoa_to_sheet(data);

     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

     const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
     const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

     saveAs(blob, `bulk sample.xlsx`);
 };


  return (
    <Box sx={{ width:'100%', overflow:'hidden' }} >
    <AppBar position='relative' sx={{ backgroundColor:'white' }} >
            <Toolbar>
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-evenly', width:'100%' }} >
                {
                  window.location.pathname === "/dashboard" ? null :
                  <Box component='img' src={eezibLogo} sx={{ width:{ lg:'7rem', md:'7rem', sm:'6rem', xs:'4rem' } }} />
                }

              
                <Box  sx={{ display:'flex', alignItems:'center', gap:{lg:4, md:4, sm:4, xs:2 }, marginLeft:'auto'}} >
                    <Typography onClick={() => manageDashboard() } className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:500, fontSize:{ lg:"1rem",md:'1rem', sm:'1rem', xs:"0.8rem" } }} >DashBoard</Typography>

                    <Box onClick={handleClick2} sx={{ display:'flex', alignItems:'center', justifyContent:'center' }} >
                        <Typography className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:500, fontSize:{ lg:"1rem",md:'1rem', sm:'1rem', xs:"0.9rem"} }} >Place Order</Typography>
                        <KeyboardArrowDownIcon sx={{ color:"#33439B", fontSize:{ lg:"1rem",md:'1rem', sm:'1rem', xs:"0.8rem" } }} />
                    </Box>
                    <MenuIcon onClick={handleClick3} sx={{ backgroundColor:"#ccc9c2", color:'white', p:0.5, borderRadius:"50%", cursor:'pointer' }} />
                </Box>
                </Box>
            </Toolbar>
            
        </AppBar>
        <AppBar position='static' sx={{ color:'black', backgroundColor:'white'}} >
          <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center' }} >

            <Typography sx={{ marginLeft:'auto', fontFamily:"montserrat", fontWeight:400, fontSize:{lg:"0.9rem", md:'0.9rem', sm:'0.9rem', xs:"0.75rem" }, marginRight:'0.5rem' }} >session expiring in -  </Typography>
            <AccessTimeIcon sx={{ color:"#949494", fontSize:"1.2rem" }} /> &nbsp;
            <Typography sx={{  fontFamily:"montserrat", fontWeight:400, fontSize:{lg:"0.9rem", md:'0.9rem', sm:'0.9rem', xs:"0.75rem" }, marginRight:'0.5rem' }} >  {formatTime(seconds)} </Typography>
          </Box>


        </AppBar>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl2}
        open={openName}
        onClose={handleClose2}
        onMouseLeave={handleClose2}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem className="appBarLetters" onClick={() => manageCardOrder() } sx={{ fontFamily:'Poppins', fontWeight:450, color:'#5c5c5c' }} >Cards</MenuItem>
        <MenuItem className="appBarLetters" onClick={() => navigate('/topup')} sx={{ fontFamily:'Poppins', fontWeight:450, color:'#5c5c5c' }} >Eezib Topup</MenuItem>
        <MenuItem onClick={() => window.open(`${url}/maker/api`, '')} className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:500, color:'#5c5c5c' }} > Eezib Gift Cards </MenuItem>
        <MenuItem onClick={() => window.open(`${url}/maker/dmt`,'')} className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:500, color:'#5c5c5c' }} >Secure Pay</MenuItem>

      </Menu>


      <Menu
        id="basic-menu"
        anchorEl={anchorE2}
        open={openMenu2}
        onClose={handlelCloseMenu2}
        onMouseLeave={handlelCloseMenu2}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => manageReport() } className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:500, color:'#5c5c5c' }} >Report</MenuItem>
        <MenuItem onClick={() => window.open('https://prepaid.nsdlbank.co.in/', '')} className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:450, color:'#5c5c5c' }} >NSDL Card Reset Pin</MenuItem>
        <MenuItem onClick={() => setOpenExcelUpload(true)} className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:450, color:'#5c5c5c' }} >Bulk GPR</MenuItem>        
      </Menu>


      <Menu
        id="basic-menu"
        anchorEl={anchorEl3}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <MenuItem onClick={() => navigate('/makerProfile')} className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:450, color:'#5c5c5c' }} >Profile</MenuItem>
        <MenuItem onClick={() => setOpenPassword(true) } className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:450, color:'#5c5c5c' }} > Update Password </MenuItem>
        <MenuItem onClick={(event) => setAnchorE2(event.currentTarget)}>
          <Typography variant="inherit" sx={{ fontFamily:"montserrat", fontWeight:600, color:'#5c5c5c' }} > Tools </Typography>
          <ListItemIcon>
            <ArrowRightIcon  />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleLogout} className="appBarLetters" sx={{ fontFamily:'Poppins', fontWeight:450, color:'#5c5c5c' }} > Logout</MenuItem>
      </Menu>
       
       

      <Dialog
        open={openPassword}
        onClose={handlePasswordClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CloseIcon onClick={() => setOpenPassword(false)} sx={{ position:'absolute', right:0, color:"red" }} />
        <DialogTitle sx={{ fontFamily:"montserrat", fontWeight:500, textAlign:"center", mt:2 }} id="alert-dialog-title">
          {"Change Your Password"}
        </DialogTitle>
        <DialogContent>
            <Box>
        <Divider variant='middle' />

            <Box sx={{ display:'grid', gridTemplateColumns:"repeat(1,1fr)", gap:2, marginTop:'1rem' }} >
              <TextField type='password' value={oldPass} onChange={(e) => setOldPass(e.target.value)} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} label="Enter Old Password" sx={{ width:{lg:'22rem', md:'20rem', sm:"18rem", xs:"15rem" } }} />
              <TextField type='password' value={newPass} onChange={(e) => setNewPass(e.target.value)} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} label="Enter New Password" />
              <TextField type='password' value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500 } }} label="Confirm New Password" />
              {
                process1 ? <LinearProgress/> : 
                <Button onClick={() => handlePassChange()} disabled={!confirmPass || !newPass || !oldPass} variant='contained' sx={{  fontFamily:'montserrat' }} > change password </Button>
              }
              
            </Box>

            </Box>
        </DialogContent>
      </Dialog>



              {/* Excel upload download */}

              <Dialog
              open={ openExcelupload }
              // onClose={handleExcelClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              scroll='paper'
            > 
            <CloseIcon onClick={() => setOpenExcelUpload(false)} sx={{ marginLeft:"auto", color:"#808080", cursor:'pointer' }} />
              <DialogTitle sx={{ fontFamily:"montserrat", fontWeight:500, textAlign:"center" }} id="alert-dialog-title">
                <Box component="img" src={eezibLogo} sx={{ width:{lg:"5rem", xs:"5rem"} }} />
                <Typography sx={{ fontFamily:"montserrat", fontWeight:500 }} >Please Upload Your Excel Here</Typography>
              </DialogTitle>
              <DialogContent sx={{ display:'flex', alignItems:'center', justifyContent:'center' }} >
                  <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:"column"  }} >
              <Divider variant='middle' sx={{ zIndex:100 }} />

                  <Box component="img" src={ excelIcon} sx={{ width:{lg:"25rem", md:"25rem", sm:"23rem", xs:"17rem" } }} />

                      <FormControl sx={{ width:{lg:"18rem", md:"18rem", sm:"17rem", xs:"15rem"  } }}>
                              <InputLabel sx={{ fontFamily:"montserrat", fontWeight:500 }} id="demo-simple-select-label">Choose Category</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={cat}
                                label="Choose Category"
                                onChange={handleCategoryChange}
                               sx={{ fontFamily:"montserrat", fontWeight:500 }} 
                              >
                                {
                                 Array.isArray(categories) && categories?.map((row, index) => (                                    
                                    <MenuItem sx={{ fontFamily:"montserrat", fontWeight:500, fontSize:{lg:"1rem", sm:"1rem", md:"1rem", xs:"0.8rem" } }} onClick={() => userCred(row.cat_id, row.sub_cat_id )} value={10}>{row?.sub_category_name}</MenuItem>
                                  ))
                                }
                              </Select>
                            </FormControl>
                                          
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginTop:"1rem", gap:"1rem" }} >
                  <input className="excelUpload" type='file' accept='.xlsx' ref={fileInputRef} onChange={ handleFileChange }  style={{  width: isXs ? "13rem" : "15rem" }} />
                  
                  <Tooltip title="Download Sample" sx={{ fontFamily:'montserrat' }} >
                  <DownloadingIcon onClick={()=>handlelExcel()} color="primary" sx={{ fontSize:"1.8rem", cursor:"pointer" }} />
                  </Tooltip>

                  </div>
                 
                 
                  {
                    process1 ? < CircularProgress sx={{ mt:"1rem" }} /> : 
                  <Button variant='contained' disabled={ !catId || !subCatId || !base64 } onClick={() => submitForm()} size="small" sx={{ fontFamily:"montserrat", fontWeight:500, fontSize:"0.9rem", width:"18rem", marginTop:"1.5rem" }} >Submit</Button>
                  }
                  </Box>
              </DialogContent>
              
            </Dialog>





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

export default Header