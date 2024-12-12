import { Alert, AppBar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, Grow, InputLabel, LinearProgress, Menu, MenuItem, NativeSelect, Pagination, Paper, Radio, RadioGroup, Select, Skeleton, Slide, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Tooltip, Typography } from '@mui/material'
import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import Spline from '@splinetool/react-spline';
import eezib from "../images/eezib.png"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import user from "../images/user.png"
import Cookies from 'js-cookie';
import Header from '../components/Header';
import moment from 'moment';
import RefreshIcon from '@mui/icons-material/Refresh';
import Footer from './Footer';
import logo from '../images/intLogo.png';
import DownloadingIcon from '@mui/icons-material/Downloading';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { ContactSupportOutlined } from '@mui/icons-material';
import noData from "../images/noData.jpg";
import { useTheme, useMediaQuery } from '@mui/material';
import SwipeableEdgeDrawer from '../components/SwipeableEdgeDrawer';

const Dashboard = () => {

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [userToken, setUserToken] = React.useState('');
  const [tableData, setTableData] = React.useState();
  const [cardData, setCardData] = React.useState();
  const [progress, setProgress] = React.useState(false);
  const [corporateName, setCorporateName] = React.useState('');
  const [tableView, setTableView] = React.useState(false);
  const [name, setName] = React.useState('');
  const [wallet, setWallet] = React.useState('');
  const [handleErr, setHandleErr] = React.useState(false);
  const [jsonError, setJsonError] = React.useState('');
  const [jsonSuccess, setJsonSuccess] = React.useState('');
  const [handleSuccess, setHandleSuccess] = React.useState(false);
  const [jsonInfo, setJsonInfo] = React.useState(false)
  const [jsonInfoMsg, setJsonInfoMsg] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState('false');
  const [orderProgress, setOrderProgress] = React.useState(false);
  const [userTableData, setUserTableData] = React.useState([]);
  const [refreshProg, setRefreshProg] = React.useState(false);
  const [cardProg, setCardProg] = React.useState(false);
  const [limitFilter, setLimitFilter] = React.useState();
  const [mainWallet, setMainWallet] = React.useState('');
  const [ppiWallet, setPpiWallet] = React.useState('');
  const [openClip, setOpenClip] = React.useState(false)

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));

  const location = useLocation();

  const handleClipClose = () => {
    setOpenClip(false);
  }

  const handleErrClose = () => {
    setHandleErr(false)
  }

  const handleInfo = () => {
    setJsonInfo(false)
  }

  const HandleSuccessClose = () => {
    setHandleSuccess(false);
  }


  React.useEffect(() => {
    const tokenData = Cookies.get('demoAuth')
    setUserToken(tokenData);
    if (!tokenData) {
      setHandleErr(true);
      setJsonError("unAuthorized");
      setTimeout(() => {
        navigate('/')
      }, 1000)
    }
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slicedData = tableData?.slice(startIndex, endIndex);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openOrder = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const openName = Boolean(anchorEl2);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();



  const fetchTableDta = async () => {

    try {

      setCardProg(true);

      const authAccess = Cookies.get('demoAuth')

      const url = process.env.REACT_APP_URL

      setRefreshProg(true);

      const data = await fetch(`${url}/api/maker/all_wallet_request`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authAccess}`
        },
      })
      const jsonData = await data.json();
      setCardProg(false);

      setRefreshProg(false);
      if (jsonData) {
        if (jsonData.status === "success")
          setTableData(jsonData.data.wallet_request)
        setCardData((jsonData.data.wallet_request)?.slice(0, 6))
      }
      if (jsonData.message === 'User does not have the right roles.') {
        setHandleErr(true);
        setJsonError(jsonData.message);
        setTimeout(() => {
          Cookies.remove("demoAuth");
          navigate("/", {replace:true})
        }, 1500)
      }
      if (jsonData.message === "Unauthenticated.") {
        setHandleErr(true);
        setJsonError(jsonData.message);
        Cookies.remove("demoAuth")
        setTimeout(() => {
          window.location.replace(`${url}/logout`);
        }, 500)
      }
      if (jsonData.status === "error") {
        setHandleErr(true);
        setJsonError(jsonData.message);
        setTableData();
      }
    } catch (err) {
      setHandleErr(true);
      setJsonError(err);
      setTimeout(() => {
        Cookies.remove("demoAuth");
        navigate("/")
      }, 1500)
    }


  }

  // *********************** PLace Order Card Data *******************************


  const handlePlaceOrder = async () => {

    setOrderProgress(false);
    setCardProg(true);

    try {

      setTableView(true);

      const url = process.env.REACT_APP_URL;

      const fetchData = await fetch(`${url}/api/maker/makercard_view`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authAccess}`
        }
      });
      const json = await fetchData.json();
      setTableView(false);
      setOrderProgress(false);
      setCardProg(false);

      if (json) {
        if (json.status === "success" && json.statuscode == 200) {
          setTableData(json.data.order_details);
          setCardData((json.data.order_details)?.slice(0, 6))
          console.log("tabledata length : ",json.data.order_details?.length);
        }
        if (json.status === "error") {
          setHandleErr(true);
          setJsonError(json.message);
          setTableData();
        }
        if (json.message === "Unauthenticated.") {
          setHandleErr(true);
          setJsonError(json.message);
          setTimeout(() => {
            window.location.replace(`${url}/logout`);
          }, 500)
        }
      }

    } catch (err) {
      setHandleErr(true);
      setJsonError(err);
    }
  }




  React.useEffect(() => {
    if (radioValue === 'false') {
      fetchTableDta()
    } else if (radioValue === 'true') {
      handlePlaceOrder()
    } else {
      fetchTableDta()
    }
  }, [radioValue]);



  const paginationStyle = {
    padding: 20,
    width: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 20
  };

  const authAccess = Cookies.get('demoAuth');

  const userDetail = async () => {


    const url = process.env.REACT_APP_URL


    const fetchData = await fetch(`${url}/api/maker/user_details`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authAccess}`
      },
    });

    const json = await await fetchData.json();
    if (json) {
      if (json.status === "success") {
        const corporate = json.data.Corporate_name;
        const name = json.data.Name;
        setCorporateName(corporate);
        setName(name);
        const walletbalance = json.data.Wallet_Balance;
        setWallet(walletbalance)
        const userId = json.data.User_ID
        Cookies.set("userId", userId);

      }
      if (json.message === "Unauthenticated.") {
        setHandleErr(true);
        setJsonError(json.message);
        setTimeout(() => {
          window.location.replace(`${url}/logout`);
        }, 500)
      }
    }

  }

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };


  React.useEffect(() => {
    userDetail();
  }, [])

  const refreshData = () => {
    fetchTableDta();
    setJsonInfo(true);
    setJsonInfoMsg("Refreshing Data..")

  }

  const handleDashboardCards = () => {
    const data = tableData?.filter((data) =>
      data?.status !== 3
    )
    return data;
  }

  const walletBal = async () => {
    try {

      const url = process.env.REACT_APP_URL
      const fetchData = await fetch(`${url}/api/maker/wallet_balance`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authAccess}`
        },
        body: JSON.stringify()
      });
      const json = await fetchData.json();
      if (json) {
        if (json.status === "success") {
          setMainWallet(json.data.wallet_balance.main_wallet);
          setPpiWallet(json.data.wallet_balance.ppi_wallet);
        }


      }

    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    walletBal()
  }, [])

  const handleClipboard = (e) => {

    if (e?.transaction_number) {
      const textarea = document.createElement("textarea");
      textarea.value = e?.transaction_number;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy"); // For older browsers
      document.body.removeChild(textarea);      setOpenClip(true);

    }
    else if (e?.order_id) {
      const textarea = document.createElement("textarea");
      textarea.value = e?.order_id;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy"); // For older browsers
      document.body.removeChild(textarea);      setOpenClip(true);

    }

    // console.log( 'clipboard : ', e);
    // setOpenClip(true);
  }


  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClipClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box sx={{ height: "auto", display: 'flex', flexDirection: { lg: 'row', xl: 'row', sm: 'column', xs: 'column', md: "row" }, overflow:'hidden' }} >
      {
        isXs || isSm ? null :

          <Box className="dash1" sx={{ width: { lg: "25%", xs: '100%', sm: "100%", md: "25%" }, minHeight: '100vh', position:'fixed', top:0, left:0, overflow:'auto', zIndex:1000 }} >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "0rem", flexDirection: 'column', padding: 2 }} >

              <Box component='img' src={eezib} sx={{ width: "6rem", marginTop: 1 }} />
              <Box component='img' src={user} sx={{ width: "14rem" }} />

              <Typography sx={{ fontFamily: 'montserrat', fontSize: 25, fontWeight: 600, textTransform: "capitalize" }} >{name}</Typography>
              <Typography sx={{ fontFamily: 'montserrat', fontSize: 15, fontWeight: 600, color: '#1783ff' }} >({corporateName})</Typography>

              <Box sx={{ marginTop: '3rem', width: "100%" }} >

                <Paper elevation={24} sx={{ backgroundColor: '#52b4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
                  <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: "1.3rem", color: 'white', letterSpacing: 1, textShadow: '0px 1px 10px #4d4d4d' }} >Main Wallet</Typography>
                  <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'center' }} >
                    <Box component='img' src={logo} sx={{ width: "1.5rem" }} />&nbsp;
                    <Typography sx={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 500 }} >{mainWallet}</Typography>
                  </Box>
                </Paper>

                <Paper elevation={24} sx={{ backgroundColor: '#52b4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '2rem' }} >
                  <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: "1.3rem", color: 'white', letterSpacing: 1, textShadow: '0px 1px 10px #4d4d4d' }} >PPI Wallet</Typography>
                  <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'center' }} >
                    <Box component='img' src={logo} sx={{ width: "1.5rem" }} />&nbsp;
                    <Typography sx={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 500 }} >{ppiWallet}</Typography>
                  </Box>
                </Paper>

                <Button onClick={() => navigate("/addbalance")} elevation={12} fullWidth variant='contained' sx={{ marginTop: '2rem', fontFamily: 'Poppins', fontSize: '1rem' }} >Add Balance</Button>

              </Box>
            </Box>
          </Box>

      }

      <Box sx={{ flexGrow: { lg: 1, md:1,  xs: "none" }, backgroundColor: "#bfebff", overflowY:"auto",       marginLeft: { lg: "25%", xs: 0, sm: 0, md: "25%" }, 
 }} >

        <Header />
        {/* <Button size='small' sx={{mb:-1, mt:1 }} variant='outlined' endIcon={ <RefreshIcon/> } >refresh</Button> */}
        <Box>


          {
            isXs || isSm ?  
            <Box sx={{ width:"100%" }} >
              
              <SwipeableEdgeDrawer name={name} corporateName={corporateName} mainWallet={mainWallet} ppiWallet={ppiWallet} />

          </Box>
           : null
          }


          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, flexDirection: 'column' }} >

            {/* ********************************** Tiles Data Change ********************************** */}

            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={radioValue}

                onChange={handleRadioChange}
                row
                defaultChecked={false}
              >
                <FormControlLabel sx={{ fontFamily: "montserrat", fontWeight: 500 }} value="false" control={<Radio />} label={<Typography sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize:{lg:'1rem', md:"1rem", sm:"0.9rem", xs:"0.8rem" } }} >Wallet History</Typography>} />
                <FormControlLabel value="true" control={<Radio />} label={<Typography sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize:{lg:'1rem', md:"1rem", sm:"0.9rem", xs:"0.8rem" } }} >Order History</Typography>} />
              </RadioGroup>


            </FormControl>

            <Box sx={{ backgroundColor: 'white', padding: { lg: 2.5, md: 2, sm: 2, xs:1.5 }, borderRadius: 3 }} >

              {tableData === undefined || tableData?.length === 0 ?
                <Box sx={{mt:"1rem"}} >
                  <Box component='img' src={noData} sx={{ width: "14rem",  }} />
                  <Divider />
                  <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '1rem', textAlign: 'center', mt: 2 }} >No record found</Typography>
                </Box>
                :
              
               <Box sx={{ display: 'grid', gridTemplateColumns: { lg: 'repeat(3,1fr)', md: 'repeat(3,1fr)', sm: 'repeat(2,1fr)', xs:"repeat(2,1fr)" }, gridColumnGap: { lg: "2rem", md: "1rem", sm: "2rem", xs: "1rem" }, gridRowGap: { lg: "2rem", md: "1rem", sm: "1.5rem", xs: "1rem" } }} >
               {
                 Array.isArray(handleDashboardCards()) && handleDashboardCards()?.slice(0, 6).map((row) => (
                   <Paper elevation={6} sx={{ borderRadius: 2 }} >
                     <Slide direction='down' mountOnEnter unmountOnExit in={cardData} >
                       {
                         !tableData || cardProg ? <Skeleton variant="rectangular" sx={{ width: { lg: "18rem", md: "16rem" }, borderRadius:2 }} height={isXs|| isSm ? 80 : 158} /> :
                           <Box className='dashBoardTile' sx={{ width: { lg: "18rem", md: "16rem", xs:"9rem", sm:"17rem" }, borderRadius: isXs ? 1 : 2 }} >

                             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding:isXs ? 0.5 : 1 }} >
                               <Typography sx={{ fontFamily: 'montserrat', fontWeight: 600, fontSize: isXs ? '0.7rem':'1rem', color: row.status === 1 ? "#ff9900" : row.status === 2 ? "#3bbf5e" : row.status === 3 ? "red" : row.status === 4 ? "#30cf5a" : "black", textTransform: 'uppercase' }} >{row.status === 1 ? "PENDING" : row.status === 2 ? "APPROVED" : row.status === 3 ? "REJECTED" : row.status === 4 ? "COMPLETED" : "--"}</Typography>
                               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                 <Box component='img' src={logo} sx={{ width: "1rem" }} /> &nbsp;
                                 <Typography sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize: isXs ? "0.7rem":'1rem' }} >{row.amount}</Typography>
                               </Box>
                             </Box>

                             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 1, marginTop: isXs ? -0.5 : 1 }} >
                               <Typography sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize: isXs ? '0.6rem' : '0.8rem', color: '#00224f' }} > {moment(row.created_at).format("DD MMM YYYY - hh:mm a")} </Typography>
                             </Box>

                             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 1, marginTop: isXs ? -1 : 1 }} >
                               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }} >
                                 <Typography sx={{ marginTop: 1, color: "#4d4d4d", fontFamily: "montserrat", fontWeight: 500, fontSize: { lg: "0.8rem", md: "0.7rem", sm: "0.7rem", xs: "0.5rem" } }} >Txn No:- {radioValue == "true" ? isXs ? `${row.order_id?.substring(0,7)}..` : `${row.order_id?.substring(0,13)}..` : isXs ?  `${row.transaction_number?.substring(0, 7)}..` : `${row.transaction_number?.substring(0, 15)}..`  }</Typography>
                                 <ContentCopyIcon onClick={() => handleClipboard(row)} sx={{ color: "#878787", fontSize: isXs ? "0.7rem" : "1rem", cursor: 'pointer' }} />
                               </Box>
                               <DownloadIcon sx={{ color: "#0077c7", cursor: 'pointer',fontSize: isXs ? "0.9rem" : "1rem" }} onClick={() => window.open(`${row.file_path}`, "")} />
                             </Box>

                           </Box>
                       }



                     </Slide>
                   </Paper>
                 ))
               }
             </Box>
              }

            </Box>


            {/* TABLE COMPONENT FOR USER RECORD */}
            {
              tableData === undefined || tableData.length === 0 ? null :


                <Box sx={{ width: { lg: '95%', md: "93%", sm: "95%", xs:"95%" }, marginTop: 3 }} >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'spaceBetween' }} >
                    <Typography sx={{ textAlign: 'center', fontFamily: 'montserrat', fontWeight: 800, fontSize:{ lg:'1.3rem', md:"1rem", sm:"0.9rem", xs:"0.9rem" }, color: '#219bff' }} > {radioValue == "false" ? "Wallet" : radioValue == "true" ? "Order" : null} History </Typography>
                    {/* <Button size='small' onClick={fetchTableDta} sx={{ marginLeft:'auto', fontFamily:'montserrat', fontWeight:500 }} variant='outlined' endIcon={ <RefreshIcon/> } >refresh</Button> */}
                    {
                      refreshProg ? <CircularProgress sx={{  }} /> :
                        <Button endIcon={<RefreshIcon />} onClick={() => window.location.reload()} variant='outlined' size='small' sx={{ fontFamily: 'montserrat', fontWeight: 500, marginLeft: 'auto', position: 'relative' }} >Refresh</Button>
                    }
                  </Box>
                  {
                    cardProg ? <LinearProgress sx={{ marginTop: 5 }} /> :
                      <>
                        {
                          radioValue == "false" ?
                            <TableContainer elevation={16} component={Paper} sx={{ marginTop: 1.5 }} >
                              <Table sx={{ minWidth:{ lg: '95%', md: "93%", sm: "95%", xs:"95%" }, backgroundColor: 'white' }} aria-label="simple table">
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: '#219bff' }} >
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 600, color: 'white', fontSize: { lg: "0.9rem", md: "0.8rem", sm: "0.75rem", xs: "0.75rem" } }} >Sr. No</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 600, color: 'white', fontSize: { lg: "0.9rem", md: "0.8rem", sm: "0.75rem", xs: "0.75rem" } }} align="center" >Requester Name</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 600, color: 'white', fontSize: { lg: "0.9rem", md: "0.8rem", sm: "0.75rem", xs: "0.75rem" } }} align="center">Amount</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 600, color: 'white', fontSize: { lg: "0.9rem", md: "0.8rem", sm: "0.75rem", xs: "0.75rem" } }} align="center"> Corporate Status</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 600, color: 'white', fontSize: { lg: "0.9rem", md: "0.8rem", sm: "0.75rem", xs: "0.75rem" } }} align="center"> Order Status</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 600, color: 'white', fontSize: { lg: "0.9rem", md: "0.8rem", sm: "0.75rem", xs: "0.75rem" } }} align="center">Txn Receipt</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 600, color: 'white', fontSize: { lg: "0.9rem", md: "0.8rem", sm: "0.75rem", xs: "0.75rem" } }} align="center">Created At</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {
                                    Array.isArray(slicedData) && slicedData?.map((row, index) => (
                                      <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                        <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize:{lg: "0.9rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }}  >{startIndex + index + 1}</TableCell>
                                        <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize:{lg: "0.8rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }}  >{row.requester_name}</TableCell>
                                        <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize:{lg: "0.9rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }}  >{Math.floor(row.amount)}</TableCell>
                                        <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize:{lg: "0.9rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" }, color: row.Corporate_Status === 1 ? "#ff9900" : row.Corporate_Status === 2 ? "#1bc900" : "red" }}  >{row.Corporate_Status === 1 ? "PENDING" : row.Corporate_Status === 2 ? "APPROVED" : row.Corporate_Status === 3 ? "REJECTED" : row.Corporate_Status === 4 ? "COMPLETE" : null}</TableCell>
                                        <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize:{lg: "0.9rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" }, textTransform: 'uppercase', fontWeight: 500, color: "#3e56f0" }}  >{row.Final_Status}</TableCell>
                                        <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize:{lg: "0.9rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }}  > <DownloadIcon sx={{ color: '#389cff', cursor: 'pointer' }} onClick={() => window.open(`${row.file_path}`, "")} /> </TableCell>
                                        <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize:{ lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" }, }}  > {moment(row.created_at).format("DD MMM YYYY - hh:mm a")}</TableCell>

                                      </TableRow>
                                    ))
                                  }
                                </TableBody>
                              </Table>
                            </TableContainer> :


                            <TableContainer elevation={16} component={Paper} sx={{ mt: 1 }} >
                              <Table sx={{ width:{ lg: '95%', md: "93%", sm: "95%", xs:"95%" } }} aria-label="simple table">

                                <TableHead>
                                  <TableRow sx={{ backgroundColor: '#219bff' }} >
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, color: 'white', fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }}   >Sr. No</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, color: 'white', fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }}   >Order Date</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, color: 'white', fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }} align="center">Order Id</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, color: 'white', fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }} align="center">File</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, color: 'white', fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }} align="center">Checker Status</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, color: 'white', fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }} align="center">Order Status</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, color: 'white', fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }} align="center"> Remark</TableCell>
                                    <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, color: 'white', fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }} align="center"> Category</TableCell>

                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {
                                    tableData?.slice((page - 1) * 8, (page - 1) * 8 + 8)?.map((row, index) => (
                                      <Slide direction='up' mountOnEnter unmountOnExit in={tableData} >

                                        <TableRow
                                          key={index}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                          <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }}  >{index + 1}</TableCell>
                                          <TableCell sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }}  > {moment(row.created_at).format("DD MMMM YYYY - hh:mm a")}</TableCell>
                                          <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" } }}  >{row.order_id}</TableCell>
                                          <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" }, color: "#a200e8" }}  >{row.file_path === null ? "Topup" : <DownloadingIcon color='primary' size={10} variant='outlined' sx={{ fontFamily: "montserrat", fontWeight: 500, cursor: 'pointer' }} onClick={() => window.open(`${row.file_path}`)} />}</TableCell>
                                          <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 600, fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" }, color: row.Corporate_Status === 1 ? "#ff9900" : row.Corporate_Status === 2 ? "#3bbf5e" : row.Corporate_Status === 3 ? "red" : row.Corporate_Status === 4 ? "#1bc900" : "red", textTransform: 'uppercase' }}  >{row.Corporate_Status === 1 ? "PENDING" : row.Corporate_Status === 2 ? "APPROVED" : row.Corporate_Status === 3 ? "REJECTED" : row.Corporate_Status === 4 ? "COMPLETED" : null}</TableCell>
                                          <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 600, fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" }, color: row.status === 1 ? "#ff9900" : row.status === 2 ? "#1bc900" : row.status === 3 ? "red" : row.status === 4 ? "#3fc462" : null, textTransform: "uppercase" }}  >{row.Final_Status}</TableCell>
                                          <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" }, color: row.remark === "testing" ? "black" : "gray" }}  > {row.remark} </TableCell>
                                          <TableCell align='center' sx={{ fontFamily: 'montserrat', fontWeight: 500, fontSize: { lg:"0.75rem", md:"0.8rem", sm:"0.75rem", xs:"0.7rem" }, color: "#1662f2" }}  >{row.category_name}</TableCell>

                                        </TableRow>
                                      </Slide>
                                    ))
                                  }
                                </TableBody>
                              </Table>
                            </TableContainer>

                        }


                        <Pagination
                          style={paginationStyle}
                          variant="outlined"
                          color="primary"
                          count={Math.ceil(tableData?.length / 8)}
                          page={page}
                          onChange={handleChangePage}
                          sx={{ marginBottom:"2rem" }}
                        />


                      </>
                  }



                </Box>

            }
            {/* here will end */}

          </Box>
        </Box>
      </Box>


      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openOrder}
        onClose={handleClose}
        onMouseLeave={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => navigate('/makerCard')} sx={{ fontFamily: 'Poppins', fontWeight: 450, color: '#5c5c5c' }} >NSDL Card Order</MenuItem>
        <MenuItem onClick={handleClose} sx={{ fontFamily: 'Poppins', fontWeight: 450, color: '#5c5c5c' }} >Topup</MenuItem>
      </Menu>

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
        <MenuItem onClick={() => navigate('/uploadcard', { state: { data: { 'token': userToken } } })} sx={{ fontFamily: 'Poppins', fontWeight: 450, color: '#5c5c5c' }} > Card </MenuItem>
        <MenuItem onClick={() => navigate('/topup')} sx={{ fontFamily: 'Poppins', fontWeight: 450, color: '#5c5c5c' }} >Eezib Topup</MenuItem>
      </Menu>



      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={handleErr}
        onClose={handleErrClose}
        autoHideDuration={2500}
      >
        <Alert severity='error' >{jsonError}..</Alert>
      </Snackbar>



      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={handleSuccess}
        onClose={HandleSuccessClose}
        autoHideDuration={2500}
      >
        <Alert severity='success' >{jsonSuccess}..</Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={jsonInfo}
        onClose={handleInfo}
        autoHideDuration={1000}
      >
        <Alert severity='info' >{jsonInfoMsg}..</Alert>
      </Snackbar>

      <Snackbar
        open={openClip}
        autoHideDuration={2000}
        onClose={handleClipClose}
        message="Copied To Clipboard"
        action={action}
      />

      <Footer />


    </Box>

  )
}

export default Dashboard








