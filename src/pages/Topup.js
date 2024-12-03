import { Alert, Box, Button, CircularProgress, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Snackbar, TextField, Typography } from '@mui/material'
import React from 'react'
import Header from '../components/Header'
import AddIcon from '@mui/icons-material/Add';
import uuid from 'react-uuid';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Footer from './Footer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme, useMediaQuery } from '@mui/material';

const Topup = () => {

    const [cat, setCat] = React.useState('');
    const [subCat, setSubCat] = React.useState('');
    const [ newField , setNewField] = React.useState([]);
    const [ mobileNumber , setMobileNumber ] = React.useState("");
    const [refNumber , setRefNumber ] = React.useState("");
    const [ amount , setAmount ] = React.useState("");
    const  [ balance , setBalance ] = React.useState('');
    const [handleSuccess , setHandleSuccess ] = React.useState(false);

    const [errors, setErrors] = React.useState({});

    const [originalMobilNumber , setOriginalMobileNumber] = React.useState('');
    const [originalRefNumber , setOriginalRefNumber] = React.useState('');
    const [originalAmount , setOriginalAmount] = React.useState('');
    const [originalBalance , setPriginalBalance] = React.useState('');

    const  [ handleErr , setHandleErr] = React.useState(false);
    const [ jsonError , setJsonError ] = React.useState('');
    const [progress1, setProgress1] = React.useState(false);
    const [category , setCategory] = React.useState();
    const [jsonSuccess , setJsonSuccess ] = React.useState('');

    const [progress , setProgress] = React.useState(false);
    
    const [progress2, setProgress2] = React.useState(false);
    const [age, setAge] = React.useState('');
    
    const [subCategoryCard, setSubCategoryCard] = React.useState();
    const [originalData, setOriginalData] = React.useState([]);

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  
    const authAccess = Cookies.get('demoAuth');
    const navigate = useNavigate();

    const HandleSuccessClose = () => {
      setHandleSuccess(false);
    }

    const handleCat = (event) => {
        setCat(event.target.value);
        setSubCat(null)
        setNewField([])
    };

    const handleCat2 = (event) => {
        setSubCat(event.target.value);
        setNewField([]);
    setOriginalData([]);
    };

    
    const handleErrClose = () => {
      setHandleErr(false)
    }

    const newFieldFunc = () => {
      if (newField.length >= 50) {
        setHandleErr(true); 
        setJsonError("Please Initiate Another Topup Order")
      } else {
          const newDataField = {
              id: uuid(),
              mobileNumber: "",
              refNumber: "",
              amount: "",
              balance: "",
          };
          const updatedNewField = [newDataField, ...newField];
        setNewField(updatedNewField);

        // Deep copy each object in updatedNewField to update originalData
        const updatedOriginalData = updatedNewField.map(obj => ({ ...obj }));
        setOriginalData(updatedOriginalData);
      }
  };

    const getCategory = async() => {
        try{
    
          setProgress1(true)    
            const url = process.env.REACT_APP_URL
    
        
            const data = await fetch(`${url}/api/maker/topup_category`,{
              headers:{
                "Accept":"application/json",
                "Authorization":`Bearer ${authAccess}`
              }
            });
            const json = await data.json();
          
            if(json){
              if(json.status === "success"){
                setCategory(json.data.topup_category);
                setProgress1(false)
              }
              if(json.status === "error"){
                setHandleErr(true); 
              setJsonError(json.message);
              }
            }

            if(json.message === "Unauthenticated."){
              setHandleErr(true); 
              setJsonError(json.message);
              Cookies.remove("demoAuth")
              setTimeout(() => {
                window.location.replace(`${url}/logout`);
              },1000)
            }
            
          }catch(err){
          setHandleErr(true); 
          setJsonError(err)
          setTimeout(() => {
            navigate("/")
            Cookies.remove("demoAuth");
          })
        }
      }


      const subCategory = async() => {

        try{

          setProgress2(true)
    
        const url = process.env.REACT_APP_URL

        // https://uat.eezib.in/api/maker/topup_subcategory/4
    
        const data = await fetch(`${url}/api/maker/topup_subcategory/${cat}`, {
          headers:{
            "Accept":"application/json",
            "Authorization":`Bearer ${authAccess}`
          }
        });
        const json = await data.json();
        if(json){
          if(json.status === "success"){
            setSubCategoryCard(json.data.topup_subcategory)
            setProgress2(false)
    
          }if(json.status === "error"){
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
          setTimeout(() => {
            navigate("/");
            Cookies.remove("demoAuth");
          },800)
        }

        
      }

      
      React.useEffect(() => {
        getCategory();
          setRefNumber("");
            setAmount("");
        
      },[])
    
      React.useEffect(() => {
        if(cat){
          subCategory();
        }
      },[cat]);

      const fetchRef = async() => {

        try{

          const url = process.env.REACT_APP_URL

          const fetchData = await fetch(`${url}/api/maker/topup_ref_data`, {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${authAccess}`
          },
          body:JSON.stringify({
            "cat_id":cat.toString(),
            "sub_cat_id":subCat.toString(),
            "phone":mobileNumber.toString(),
            "ref_data":refNumber.toString(),
           }
           )
        });
         const json = await fetchData.json();
        if(json){
          if(json.status === "success"){
              setRefNumber(json.data.topup_data.ref_no);
              setAmount(json.data.topup_data.amnt);
              setBalance(json.data.topup_data.card_blnc)
              setMobileNumber(json.data.topup_data.mobile_no)

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
            setTimeout(() => {
              navigate("/");
              Cookies.remove("demoAuth");
            },800)
        }

        
      }

      React.useEffect(() => {
        if(mobileNumber?.length === 10 || refNumber.length === 10 ){
            fetchRef();
        }
       
      },[mobileNumber?.length === 10 || refNumber.length  === 10 ]);


      const handleMobileNumberChange = async (value, index) => {

        try{


                  const updatedFields = [...newField];
                  updatedFields[index].mobileNumber = value;
                  setNewField(updatedFields);
          
                  if(value?.length === 10 ){
                    try {
                      const url = process.env.REACT_APP_URL
          
                      const response = await fetch(`${url}/api/maker/topup_ref_data`, {
                        method:"POST",
                        headers:{
                          "Content-Type":"application/json",
                          "Authorization":`Bearer ${authAccess}`
                        },
                        body:JSON.stringify({
                          "cat_id":cat.toString(),
                          "sub_cat_id":subCat.toString(),
                          "phone":value.toString(),
                          "ref_data":refNumber.toString()
                         })
                      });
            // 5539578 
                      const data = await response.json();

                      if (data?.status === "success" && data?.data.topup_data.amnt !== "Limit exceeded" )
                      {
                        
                        setNewField(prevFields => {
                            const updatedFields = [...prevFields];
                            updatedFields[index] = {
                                ...updatedFields[index],
                                mobileNumber: value,
                                refNumber: data.data.topup_data.ref_no,
                                amount: data.data.topup_data.amnt,
                                balance: data.data.topup_data.card_blnc
                            };
                            return updatedFields;
                        });
                        
                        setOriginalData(prevFields => {
                          const updatedFields = [...prevFields];
                          updatedFields[index] = {
                              ...updatedFields[index],
                              mobileNumber: value,
                              refNumber: data.data.ref_no,
                              amount: data.data.amnt,
                              balance: data.data.card_blnc
                          };
                          return updatedFields;
                      });
                    } 

                    if(data.status === "success" && data?.data.amnt === "Limit exceeded" ){
                      setHandleErr(true); 
                      setJsonError(data?.data.amnt);
                    }


                    
                    else if(data.status === "error"){
                      setHandleErr(true); 
                      setJsonError(data.message);
                    }
                    if(data.message === "Unauthenticated."){
                      setHandleErr(true);
                      setJsonError(data.message);
                      Cookies.remove("demoAuth")
                      setTimeout(() => {
                        window.location.replace(`${url}/logout`);
                      },1000)
                  }
                    } catch (error) {
                    }
                  }


                  if(value?.length <= 9  ){
                    setErrors({});

                    setNewField(prevFields => {
                      const updatedFields = [...prevFields];
                      updatedFields[index] = {
                          ...updatedFields[index],
                          mobileNumber:value,
                          refNumber: "",
                          amount: "",
                          balance:""
                      };
                      return updatedFields;
                  });
                  
                  setOriginalData(prevFields => {
                      const updatedFields = [...prevFields];
                      updatedFields[index] = {
                          ...updatedFields[index],
                          mobileNumber:value,
                          refNumber: "",
                          amount: "",
                          balance:""
                      };
                      return updatedFields;
                  });
                  }


                  
                  if(value?.length >= 11  ){
                    setErrors({});

                    setNewField(prevFields => {
                      const updatedFields = [...prevFields];
                      updatedFields[index] = {
                          ...updatedFields[index],
                          mobileNumber:value,
                          refNumber: "",
                          amount: "",
                          balance:""
                      };
                      return updatedFields;
                  });
                  
                  setOriginalData(prevFields => {
                      const updatedFields = [...prevFields];
                      updatedFields[index] = {
                          ...updatedFields[index],
                          mobileNumber:value,
                          refNumber: "",
                          amount: "",
                          balance:""
                      };
                      return updatedFields;
                  });
                  }

        }catch(err){
          setHandleErr(true); 
          setJsonError(err);
          setTimeout(() => {
            navigate("/")
          },800)
        }    
    };

  

     const handleRefDataChange = async(value, index) => {       

      try{
        const updatedField = [...newField];
        updatedField[index].refNumber = value;
        setNewField(updatedField);

      if(value.length >= 10 ){
          const url = process.env.REACT_APP_URL

          const response = await fetch(`${url}/api/maker/topup_ref_data`, {
            method:"POST",
            headers:{
              "Accept":"application/json",
              "Content-Type":"application/json",
              "Authorization":`Bearer ${authAccess}`
            },
            body:JSON.stringify({
              "cat_id":cat.toString(),
              "sub_cat_id":subCat.toString(),
              "phone":mobileNumber.toString(),
            "ref_data":value.toString()
             })
          });
// 5539578 

          const data = await response.json();
          if (data.status === "success"){
            // updatedField[index].mobileNumber = data.Message.mobile_no
            // updatedField[index].balance = data.Message.card_blnc
            // updatedField[index].amount = data.Message.amnt

            setNewField(prevFields => {
              const updatedFields = [...prevFields];
              updatedFields[index] = {
                  ...updatedFields[index],
                  mobileNumber: data.data.topup_data.mobile_no,
                  refNumber: value,
                  amount: data.data.topup_data.amnt,
                  balance: data.data.topup_data.card_blnc
              };
              return updatedFields;
          }); 

          setOriginalData(prevFields => {
            const updatedFields = [...prevFields];
            updatedFields[index] = {
                ...updatedFields[index],
                mobileNumber: data.data.topup_data.mobile_no,
                refNumber: value,
                amount: data.data.topup_data.amnt,
                balance: data.data.topup_data.card_blnc
            };
            return updatedFields;
        }); 


        }
        else if(data.status === "error"){
            setHandleErr(true); 
            setJsonError(data.message);  
            
            setNewField(prevFields => {
              const updatedFields = [...prevFields];
              updatedFields[index] = {
                  ...updatedFields[index],
                  mobileNumber:"",
                  refNumber: value,
                  amount: "",
                  balance:""
              };
              return updatedFields;
          });
          
          setOriginalData(prevFields => {
              const updatedFields = [...prevFields];
              updatedFields[index] = {
                  ...updatedFields[index],
                  mobileNumber:"",
                  refNumber: value,
                  amount: "",
                  balance:""
              };
              return updatedFields;
          });

          }
        else {
          }
       
      }

      if(value?.length <= 9   ){

        setNewField(prevFields => {
          const updatedFields = [...prevFields];
          updatedFields[index] = {
              ...updatedFields[index],
              mobileNumber:"",
              refNumber: value,
              amount: "",
              balance:""
          };
          return updatedFields;
      });
      
      setOriginalData(prevFields => {
          const updatedFields = [...prevFields];
          updatedFields[index] = {
              ...updatedFields[index],
              mobileNumber:"",
              refNumber: value,
              amount: "",
              balance:""
          };
          return updatedFields;
      });
      }

    }catch(err){
    // setHandleErr(true); 
    // setJsonError(err);
    console.log(err)
    // setTimeout(() => {
    //   navigate("/");
    //   Cookies.remove("demoAuth");
    // },800)
    } 
  };
  
  
    
      React.useEffect(() => {
      
            handleRefDataChange(); 

            // setOriginalData(JSON.parse(JSON.stringify(newField)));


      },[refNumber])

    // const handleRefNumberChange = (value, index) => {
    //     setNewField(prevFields => {
    //         const updatedFields = [...prevFields];
    //         updatedFields[index].refNumber = value;
    //         return updatedFields;
    //     });
    // };

    
    const handleAmountChange = (value, index) => {
        setNewField(prevFields => {
            const updatedFields = [...prevFields];
            updatedFields[index].amount = value;
            return updatedFields;
        });
    };

    const submitTopup = async() => {
      setProgress(true)

      try{

        if (newField.some(item => parseInt(item?.amount) < 100)) {
          setHandleErr(true); 
          setJsonError(" Amount cannot be less then 100 ");       
          setProgress(false);   
          return; // Stop API call if amount is less than 100
      }

      const trimmedMobileNumber = mobileNumber.trim();

      if (newField.some(item => String(item.amount)?.includes('.'))) {
        setHandleErr(true); 
        setJsonError(" Amount cannot be in decimal");       
        setProgress(false);   
        return; // Stop API call if amount is less than 100
    }

    
      for (let i = 0; i < newField.length; i++) {
        const currentMobileNumber = newField[i].mobileNumber;
        for (let j = i + 1; j < newField.length; j++) {
            if (currentMobileNumber === newField[j].mobileNumber) {
                setHandleErr(true); 
                setJsonError(`Duplicate mobile number found:   ${currentMobileNumber}`);
                setProgress(false);
                return; // Stop further execution once a duplicate is found
            }
        }
    }
    

    let newErrors = {};
    let hasError = false;
  
    // Loop through newField array from last to first element
    for (let i = newField.length - 1; i >= 0; i--) {
        const newObj = newField[i];
        const originalObj = originalData.find(obj => obj.id === newObj.id);
        if (originalObj && parseInt(newObj.amount) > parseInt(originalObj.amount)) {
            newErrors[newObj.id] = "Max Limit Exceeded";
            hasError = true;
        } else {

          
            delete newErrors[newObj.id];
        }
    }
    
    // If any error was found during the loop, stop execution
    if (hasError) {
        setErrors(newErrors);
        setProgress(false);
        return; // Stop execution
    } else {
        // If no errors, clear the errors state
        setErrors({});
    }




  //   for (let i = 0; i < newField.length; i++) {
  //     const updatedAmount = newField[i].amount;
  //     const originalAmount = originalData[i].amount;

  //     // Compare updated amount with original amount
  //     if (updatedAmount > originalAmount) {
  //         // Handle the case where the updated amount is greater than the original amount
  //         window.alert(`Amount at index ${i} is greater than the original amount.`);
  //         setProgress(false)
  //     } 
  // }


        const refNumbers = newField.map(item => item?.refNumber);
        const mobileNumbers = newField.map(item => item?.mobileNumber);
        const amounts = newField.map(item => item?.amount);

        const formattedData = {
          "category_name":cat,
          "subcategory_name":subCat,
          refno:refNumbers,
          price:mobileNumbers,
          mno:amounts
        }
  
        newField.forEach((field, index) => {
          formattedData.refno[index.toString()] = field.refNumber;
          formattedData.price[index.toString()] = field.amount;
          formattedData.mno[index.toString()] = field.mobileNumber;
        });

          
  
        const url = process.env.REACT_APP_URL;

  
        const fetchData = await fetch(`${url}/api/maker/client_storetopup`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${authAccess}`
          },
          body:JSON.stringify(formattedData)
        });
        const json  = await fetchData.json();
        setProgress(false)
        
        if(json){
          if(json.status === "success"){
            setHandleSuccess(true);
            setJsonSuccess(json.message);
            setTimeout(() => {
              setNewField([]);
            },500)

            setTimeout(() => {
              setCat('');
              setSubCat('');
            },1000)
            
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
        console.log("topup error : ",err);
        setHandleErr(true); 
            setJsonError(err);
            setTimeout(() => {
              setHandleErr(true); 
            setJsonError(err);
            navigate("/");
            Cookies.remove("demoAuth");
            },500)
      }
    }


    const removeField = (indexToRemove) => {
      const updatedFields = newField.filter((_, index) => index !== indexToRemove);
      setNewField(updatedFields);
  };


  // React.useEffect(() => {
  //   // Take a snapshot of newField's data and set it as originalData
  //   setOriginalData(JSON.parse(JSON.stringify(newField)));
  // }, []);

  const resetFields = () => {
    setCat('');
    setSubCat('');
    setNewField([]);
    setOriginalData([]);
  }


  return (
    <Box className='topupContainer' sx={{  }} >
        <Header/>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', padding:2 , mt:5, mb:5 }} >
            <Paper elevation={12} sx={{ backgroundColor:'white', padding:{lg:"1rem 3rem", md:"1rem 3rem", sm:"1rem 3rem" , xs:"1rem 2rem" } }}>
                <Typography sx={{ textAlign:'center', fontFamily:"montserrat", fontWeight:600, fontSize:'1.5rem', color:"#008acf" }} >Request Topup</Typography>
                <Divider sx={{ marginTop:4 }} variant='middle' component='ul' />
                <Box sx={{ marginTop:2, p:1  }} >

                    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', gap:{lg:6, md:6, sm:3, xs:3 }, mt:1, flexDirection:{lg:'row', md:"row", sm:'column', xs:"column" } }} >
                    
                    <Box>
                       <FormControl sx={{ width:{lg:'18rem', md:'18rem', sm:'18rem', xs:"15rem" }, mt:1 }} >
                        <InputLabel sx={{ fontFamily:"montserrat", fontWeight:500, textTransform:'capitalize' }} id="demo-simple-select-label">select category</InputLabel>
                        <Select
                            id="demo-simple-select"
                            value={cat}
                            label="select category"
                            onChange={handleCat}
                            sx={{ fontFamily:"montserrat", fontWeight:500 }}
                        >
                            {
                                category?.map((row) => (

                                    <MenuItem value={row.id} sx={{ fontFamily:"montserrat", fontWeight:500 }} >{row.category_name}</MenuItem>
                                ))
                            }


                        </Select>
                        </FormControl>
                    </Box>

                    <Box>
                       <FormControl disabled={!cat} sx={{ width:{lg:'18rem', md:'18rem', sm:'18rem', xs:"15rem" }, mt:1 }} >
                        <InputLabel sx={{ fontFamily:"montserrat", fontWeight:500, textTransform:'capitalize' }} id="demo-simple-select-label">select sub category</InputLabel>
                        <Select
                            id="demo-simple-select"
                            value={subCat}
                            label="select sub category"
                            onChange={handleCat2}
                            sx={{ fontFamily:"montserrat", fontWeight:500 }}
                        >
                            {
                                subCategoryCard?.map((data) => (
                                    <MenuItem sx={{ fontFamily:"montserrat", fontWeight:500 }} value={data.id}>{data.sub_category_name}</MenuItem>
                                ))
                            }
                            
                        </Select>
                        </FormControl>
                    </Box>
                    </Box>
                </Box>
                
                {
                    !subCat ? null :
                    

                <Box>

                <Divider sx={{ marginTop:4 }} variant='middle' component='ul' />


                {/* <hr style={{ marginTop:20 }} /> */}


                <Box sx={{ mt:2 }} >

                    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:{lg:'row', md:'row', sm:'column', xs:"column" }, gap:{lg:3,md:3, sm:2, xs:1.5 }, mt:2 }} >
                        
                        <Button onClick={() => newFieldFunc()} variant='outlined' startIcon={ <AddIcon/> } sx={{ fontFamily:'montserrat', fontWeight:500 }} >{isXs ? "Add New Row Field" : "Add New Row"}</Button>
                        
                        {
                          isXs ? null : <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:{lg:'row', md:'row', sm:'column', xs:"column" }, gap:{lg:3,md:3, sm:2, xs:1.5 }, flexWrap:'norway' }} >

                        <Box sx={{ display:'flex', alignItems:'center', justifyContent:"center", width:"14rem", }} >
                        <Typography variant='outlined' sx={{ textAlign:'center', fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' , color:"#787878", fontSize:{lg:"1rem", md:"1rem", sm:'0.9rem', xs:"0.8rem" } }}  > Mobile Number  </Typography>
                        <ArrowDropDownIcon sx={{ color:"#1d71de" }} />
                        </Box>


                        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', width:"14rem" }} >
                        <Typography variant='outlined' sx={{ textAlign:'center', fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' , color:"#787878", fontSize:{lg:"1rem", md:"1rem", sm:'0.9rem', xs:"0.8rem" } }}  > Reference Number </Typography>
                        <ArrowDropDownIcon sx={{ color:"#1d71de" }} />
                        </Box>


                        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', width:"10rem" }} >
                        <Typography variant='outlined' sx={{ textAlign:'center', fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' , color:"#787878", fontSize:{lg:"1rem", md:"1rem", sm:'0.9rem', xs:"0.8rem" } }}  > Card Balance </Typography>
                        <ArrowDropDownIcon  sx={{ color:"#1d71de" }} />
                        </Box>


                        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', width:"10rem" }}  >
                        <Typography variant='outlined' sx={{ textAlign:'center', fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' , color:"#787878", fontSize:{lg:"1rem", md:"1rem", sm:'0.9rem', xs:"0.8rem" } }}  > Amount</Typography>
                        <ArrowDropDownIcon sx={{ color:"#1d71de" }} />
                        </Box>
                          </Box>
                        }
                        
                    </Box>
                </Box>
                {
                   Array.isArray(newField) && newField.map((data, index) => (
                    <Box key={data?.id} sx={{ mt:2 }} >
                    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:{lg:'row', md:'row', sm:'column', xs:"column" }, gap:3, mt:2 }} >
                      {
                        isXs ? <Divider sx={{ width:'100%' }} /> : null
                      }
                        <Button color='error' onClick={() => removeField(index)} variant='contained' startIcon={ <RemoveIcon/> } sx={{ fontFamily:'montserrat', fontWeight:500, width:"11.5rem" }} >Remove Row</Button>
                        <TextField type="number"  size='small' value={data.mobileNumber} onChange={(e) => handleMobileNumberChange(e.target.value, index)} label="enter mobile number" sx={{ fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize', width:'14rem', fontSize:"0.8rem" }} InputProps={{ style:{ fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' } }} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' } }} />
                        <TextField size='small' value={data.refNumber} onChange={(e) =>  handleRefDataChange(e.target.value, index)} label="enter reference number" sx={{ fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize',  width:'14rem' }} InputProps={{ style:{ fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' } }} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' } }} />
                        <TextField label="Card Balance" value={data.balance} InputLabelProps={{ style:{fontFamily:"montserrat", fontWeight:'500'} }}  sx={{ width:{lg:"10rem", md:'10rem', sm:"10rem", xs:"14rem"} }} size="small"  />
                        <TextField type='number' error={errors[data.id]} helperText={errors[data.id]} size='small' value={data.amount} onChange={(e) => handleAmountChange(e.target.value, index)} label="enter amount" sx={{ fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize', width:{lg:"10rem", md:'10rem', sm:"10rem", xs:"14rem"} }} InputProps={{ style:{ fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' } }} InputLabelProps={{ style:{ fontFamily:'montserrat', fontWeight:500, textTransform:'capitalize' } }} />
                          {
                            isXs ? 
                            <Button onClick={() => newFieldFunc()} variant='contained' startIcon={ <AddIcon/> } sx={{ fontFamily:'montserrat', fontWeight:500, width:"14rem" }} >Add New Row</Button> : null
                          }


                    </Box>
                </Box>
                    )).reverse()
                }
                </Box>
                }

                    <Divider sx={{ marginTop:4 }} variant='middle' component='ul' />
                {/* <hr style={{ marginTop:20 }} /> */}
                {
                  progress ? <CircularProgress sx={{ float:'right' }} /> : 
                <Button disabled={ !cat || !subCat || newField?.length <= 0 }  onClick={() => submitTopup()} variant='contained' sx={{ fontFamily:'montserrat', fontWeight:500, mt:4, float:'right' }} > submit</Button>
                }
                <Button onClick={() => resetFields()} variant='outlined' color='warning' sx={{ fontFamily:'montserrat', fontWeight:500, mt:4, float:'right', marginRight:2 }} > Reset</Button>

            </Paper>
            
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

    <Box sx={{ position:"fixed", bottom:0, width:"100%" }} >
      <Footer/>
    </Box>

    </Box>
  )
}

export default Topup