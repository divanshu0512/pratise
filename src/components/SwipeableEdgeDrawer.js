import * as React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Divider } from '@mui/material';
import walletImage from "../images/walletImg.png";
import logo from '../images/intLogo.png';
import { useNavigate } from 'react-router-dom';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '10%',
  backgroundColor: grey[100],

}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',

}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',

}));

function SwipeableEdgeDrawer(props) {
  const { window } = props;
  console.log(props);
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;

  const navigate = useNavigate();

  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }} >
      <Box onClick={toggleDrawer(true)} sx={{ display:'flex', alignItems:'center', justifyContent:'center', mt:2, backgroundColor:'white', padding:"0.5rem 0.8rem", gap:'0.9rem', borderRadius:2 }} >
        <AccountCircleIcon sx={{ color:'#c9c9c9', fontSize:"1.7rem" }}  />
          <Typography sx={{ fontFamily:'montserrat', fontWeight:500, fontSize:"1rem" }} >{`${props.name.substring(0,10)}..` }</Typography>
          <ArrowDropDownIcon sx={{ color:'#c9c9c9' }} />
      </Box>
    <Root>
      {/* <CssBaseline /> */}
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
     
        }}
      />

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary', textAlign:'center', mt:0.5 }}>{props.corporateName}</Typography>
          <Divider />
        </StyledBox>
        <StyledBox sx={{ px: 2, pb: 2, height: '950%', overflow: 'auto', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
          {/* <Skeleton variant="rectangular" height="100%" /> */}
          <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', gap:"2rem" }} >
            <Box component='img' src={walletImage} alt="walletImg" sx={{ width:"5rem" }} />
            <Box>
            <Typography sx={{ fontFamily:"montserrat", fontWeight:500, color:"#808080", fontSize:"0.9rem" }} >Main Wallet</Typography>
            <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'center' }} >
                    {/* <Box component='img' src={logo} sx={{ width: "1.5rem" }} />&nbsp; */}
                    <Typography sx={{ fontFamily: 'montserrat', fontSize: '1.2rem', fontWeight: 400 }} >{props.mainWallet}</Typography>
                  </Box>            </Box>
          </Box>

              <Divider sx={{  width:"100%", marginTop:'0.6rem', marginBottom:'0.6rem' }} />

              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', gap:"3rem" }} >
              <Box component='img' src={walletImage} alt="walletImg" sx={{ width:"5rem" }} />
                    {/* <Box component='img' src={logo} sx={{ width: "3rem" }} /> */}
          <Box>
          <Typography sx={{ fontFamily:"montserrat", fontWeight:500, color:"#808080", fontSize:"0.9rem" }} >PPI Wallet</Typography>
          <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'center' }} >
                    <Typography sx={{ fontFamily: 'montserrat', fontSize: '1.2rem', fontWeight: 400 }} >{props.ppiWallet}</Typography>
                  </Box> 
                   </Box>

          </Box>
                  {/* <Divider sx={{ width:"100%" }} />         */}
                   <Button onClick={() => navigate("/addbalance")} elevation={12} fullWidth variant='contained' sx={{ marginTop: '1rem', fontFamily: 'Poppins', fontSize: '1rem' }} >Add Balance</Button>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
    </Box>
  );
}
export default SwipeableEdgeDrawer;