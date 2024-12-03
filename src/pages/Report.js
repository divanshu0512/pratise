import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Pagination, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React from 'react'
import Header from '../components/Header'
import addDays from 'date-fns/addDays';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import cardSource from "../images/reportCard.png"
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import env from 'react-dotenv';
import Footer from './Footer';
import { CSVLink } from "react-csv";
import { Download, Print } from "@mui/icons-material";
import * as XLSX from "xlsx";
import moment from 'moment';
// import dayjs from 'dayjs';
// import utc from "dayjs/plugin/utc"


const Report = () => {

  const [ startDate, setStartDate ] = React.useState('');
  const [ endDate , setEndDate ] = React.useState('');
  const [tableData , setTableData] = React.useState();
  const [page , setPage] = React.useState(1);
  const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
  const [ errorJson , setErrorJson ] = React.useState('');
  const [handleErr , setHandleErr] = React.useState(false);
  const [process , setProcess] = React.useState(false);
  const [ reportName , setReportName ] = React.useState([]);
  const [ reportId , setReportId ] = React.useState('');
  const [ reportData , setReportData ] = React.useState('');

  console.log("Start data  : ", moment(startDate).format("YYYY-MM-DD") ,"   end date : ",moment(endDate).format("YYYY-MM-DD"));

  const navigate = useNavigate();

  const handleErrClose = () => {
    setHandleErr(false);
  }

  const handleReportChange = (e) => {
    setReportData(e.target.value)
  }

  const startIndex = (page -1)* rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const slicedData = tableData?.slice(startIndex, endIndex);

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }

  const auth = Cookies.get("demoAuth");
  const getReportData = async() => {  

    try{

      const url = env.REACT_APP_URL
      const fetchData = await fetch(`${url}/api/maker/report` , { 
        headers:{
          "Accept":'application/json',
          "Content-Type":"application/json",
          "Authorization":`Bearer ${auth}`
        }
      });
      const json = await fetchData.json();
      if(json){
        if(json.status === "success"){
          setReportName(json.data.report_details);
        }
        if(json.status === "error" ){
          setErrorJson(json.message);
          setHandleErr(true);
        }
        else if(json.message === "Unauthenticated." ){
          setErrorJson(json.message);
          setHandleErr("Unauthenticated");
          setTimeout(() => {
            window.location.replace(`${url}/logout`);
            Cookies.remove("demoAuth")
          },300)
        }
      }
    }catch(err){
      setHandleErr(true);
      setErrorJson(err);
      setTimeout(() => {
          Cookies.remove("demoAuth");
          navigate("/")
      },1500)
  }

  }

  React.useEffect(() => {
    getReportData()
  },[])

  const report = async() => {
    try{
      
      setProcess(true);

      const url = env.REACT_APP_URL

      const fetchData = await fetch(`${url}/api/maker/showreport`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${auth}`
        },
        body:JSON.stringify({ "from":startDate , "to":endDate, "submit":"show", "id":reportId })
      });

      const json = await fetchData.json();
      setProcess(false);
      if(json){
        if(json.status === "success"){
            setTableData(json.data.report_data);
            setTimeout(() => {
              window.scroll(0,450)
            },500)
        }
        else if(json.status === "error"){
          setHandleErr(true);
          setErrorJson(json.message);
          setTableData();
        }
      }

    }catch(err){
            setHandleErr(true);
            setErrorJson(err);
            setTimeout(() => {
                Cookies.remove("demoAuth");
                navigate("/")
            },800)
        }
   
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }; 


  const exportPdf = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
  
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(7);
    const headers = ['Date', 'Party Name', 'Category Name', 'Sub Category Name', 'Mobile No', 'Amount'];

    const data = tableData?.map((items) => [
        items.date,
        items.party_name,
        items.category_name,
        items.sub_category_name,
        items.mobileno,
        items.amount
     ]
    );
  
    let content = {
      startY: 50,
      head: [headers],
      body: data,
    };
  
    doc?.autoTable(content);
    doc?.save("myreport.pdf");
  };

  const generatePDF = () => {
    if (tableData.length === 0) {
      alert("No data available to generate PDF");
      return;
    }
  
    const pdf = new jsPDF();
    const keys = Object.keys(tableData[0]);
  
    // Set initial x and y position
    let xPos = 10;
    let yPos = 10;
  
    // Set cell width and height
    const cellWidth = 30;
    const minHeight = 8;
  
    // Set font size
    const fontSize = 6;
    pdf.setFontSize(fontSize);
  
    // Add headers
    keys.forEach((key, index) => {
      pdf.rect(xPos, yPos, cellWidth, minHeight, 'S');
      pdf.text(xPos + 1, yPos + 5, key);
      xPos += cellWidth;
    });
  
    // Reset x position and increment y position
    xPos = 10;
    yPos += minHeight;
  
    // Add data
    tableData.forEach(data => {
      keys.forEach((key, index) => {
        const value = data[key] || '';
        const valueLines = pdf.splitTextToSize(value.toString(), cellWidth - 2);
        const cellHeight = Math.max(minHeight, valueLines.length * fontSize / 2); // Adjust for font size
        pdf.text(xPos + 1, yPos + 5, valueLines);
        pdf.rect(xPos, yPos, cellWidth, cellHeight, 'S');
        xPos += cellWidth;
      });
      xPos = 10;
      yPos += minHeight;
    });
  
    pdf.save('download.pdf');
  };



 
const generateExcel = () => {
  if (tableData.length === 0) {
    alert("No data available to generate Excel");
    return;
  }

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(tableData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Write the workbook to a file
  XLSX.writeFile(workbook, 'download.xlsx');

  alert("Excel file generated successfully");
};

  
  const exportCsv = () => {
    const csvData = tableData.map((items) => ({
      Date: items.date,
      Party_Name: items.party_name,
      Category_Name: items.category_name,
      Sub_category_Name: items.sub_category_name,
      Mobile_No: items.mobileno,
      Amount: items.amount,
    }));
  
    return (
      <CSVLink
        data={csvData}
        filename={"MyCSVData.csv"}
      >
        Download CSV
        <span className="ml-2">
          <Download />
        </span>
      </CSVLink>
    );
    
  };



  const exportXlxs = () => {
    const headers = ['Date', 'Party Name', 'Category Name', 'Sub Category Name', 'Mobile No', 'Amount'];
    const data = [
      headers,
      ...tableData.map((items) => [
        items.date,
        items.party_name,
        items.category_name,
        items.sub_category_name,
        items.mobileno,
        items.amount
      ]),
    ];
  
    const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Report_Sheet.xlsx");
  };


//   const handleClick = () => {
//     const doc = new jsPDF();
//     let y = 10;

//     // Define column widths
//     const colWidths = [20, 25, 25, 45, 20, 40, 15];

//     // Add headers
//     doc.setFontSize(7.5);
//     colWidths.reduce((x, width, index) => {
//       const headerText = ['Date', 'Party Name', 'Category Name', 'Sub Category Name', 'Mobile No', 'Reference Number', 'Amount'][index];
//       if (y === 10) { // Check if it's the first row
//         doc.setFillColor(0, 0, 0); // Set fill color to black for the first row
//         doc.setTextColor(255, 255, 255); // Set text color to white for the first row
//       } else {
//         doc.setFillColor(255, 255, 255); // White background color for other rows
//         doc.setTextColor(0, 0, 0); // Black text color for other rows
//       }
//       doc.rect(x, y, width, 10, 'F'); // Draw filled rectangle as header background
//       doc.setFont('helvetica', 'bold'); // Set font style to bold
//       doc.text(headerText, x + width / 2, y + 6, { align: 'center', baseline: 'middle' }); // Add header text with padding
//       return x + width;
//     }, 10);
//     y = y+10;
//      doc.setTextColor(0, 0, 0); // Set font color to black
    
//    // Add data rows
//       tableData.forEach((item) => {
//         // Reset font size for data rows
//         doc.setFontSize(7);
        
//         // Loop through each column
//         colWidths.reduce((x, width, index) => {
//           // Add text at calculated position
//           const content = String(item[Object.keys(item)[index]]);
//           doc.rect(x, y, width, 10); // Draw rectangle as cell background
//           doc.setFont('helvetica', 'normal'); // Reset font style to normal
//           doc.text(content, x + width / 2, y + 6, { align: 'center', baseline: 'middle', maxWidth: width - 4 }); // Add content with padding
//           return x + width;
//         }, 10);
        
//         // Increment y position for next row
//         y += 10;
        
//         // Reset text color to black for subsequent rows
//         doc.setTextColor(0, 0, 0); // Black text color
// });

//     // Save the PDF
//     doc.save("table_data.pdf");
//   }

 const headers = Object.keys( slicedData ? slicedData[0] : {}); 

  return (
    <Box className="topupContainer" >
      <Header/>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-evenly', flexDirection:{lg:'row', sm:"column", md:"row", xs:"column" }}} >

        <Box sx={{  }} >
          <Box component='img' src={cardSource} sx={{ width:{lg:'40rem', xl:'42rem', md:"35rem", sm:'25rem', xs:"20rem" } }} />
        </Box>
        
        <Paper elevation={14} sx={{ backgroundColor:'white', borderRadius:2, marginTop:5, padding:"0.8rem 1rem", display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}} >

          <Typography sx={{  textAlign:'center', fontFamily:"montserrat", fontWeight:600, fontSize:'1.5rem', color:"#008acf" ,mt:2 }} >Report</Typography>
          <Typography sx={{ fontFamily:'montserrat', fontWeight:500, fontSize:'0.9rem', color:'#b3b5b4', mt:1, textTransform:'capitalize' }} >please select start and end date</Typography>
         
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' , padding:{lg:2 , md:2, sm:1.5, xs:1 } ,gap:2 }} >

        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Report Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={reportData}
          label="Select Report Type"
          onChange={handleReportChange}
          sx={{ fontFamily:'montserrat', fontWeight:500, width:"16rem" }}
        >
          {
          Array.isArray(reportName) &&  reportName?.map((data) => (
              <MenuItem sx={{ fontFamily:"montserrat", fontWeight:500 }} onClick={() => setReportId(data.id)}  value={data.id}  >{data.name}</MenuItem>
            ))
          }
  
        </Select>
      </FormControl>

         
        <LocalizationProvider  dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker  disableFuture={true} onChange={(e) => setStartDate(moment(e?.$d).format("YYYY-MM-DD"))}  sx={{ widht:"18rem" }} label="Select Start Date" />
        </DemoContainer>
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker  disableFuture={true} onChange={(e) => setEndDate(moment(e.$d).format("YYYY-MM-DD") )}  sx={{ widht:"18rem" }} label="Select End Date" />
        </DemoContainer>
      </LocalizationProvider>

      </Box>
      {
        process ? <CircularProgress /> : 
      <Button fullWidth onClick={report} variant="contained" sx={{ fontFamily:'montserrat', marginBottom:3, width:300 }} >submit</Button>
      }
        </Paper>
      </Box>
      
      {
        tableData ?
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', mt:5, flexDirection:'column' }} >
        
      
    {/* <TableContainer elevation={16} component={Paper} sx={{ marginTop:1.5, width:"95%" }} >
        <Box sx={{ gap:1, padding:1, display:'flex', alignItems:"center", justifyContent:'right' }} >
        <Button onClick={() => exportPdf()} sx={{ fontFamily:'montserrat', fontWeight:500 }} variant='outlined' size='small' endIcon={<DownloadIcon/>} >PDF</Button>
        <Button onClick={() => exportXlxs()} sx={{ fontFamily:'montserrat', fontWeight:500 }} variant='outlined' size='small' endIcon={<DownloadIcon/>}  >EXCEL</Button>
      </Box>
                      <Table sx={{ minWidth: 650 ,backgroundColor:'white', padding:2 }} aria-label="simple table">
                          <TableHead>
                          <TableRow sx={{ backgroundColor:'#219bff' }} >
                              <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}   >Sr. No</TableCell>
                              <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}   align="center">Date</TableCell>
                              <TableCell  sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}  align="center">Party Name</TableCell>
                              <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }} align="center"  >Category</TableCell>
                              <TableCell  sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}  align="center"> Sub Category Name </TableCell>
                              <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}   align="center">Mobile</TableCell>
                              <TableCell sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}   align="center">Ref No.</TableCell>
                              <TableCell  sx={{ fontFamily:'montserrat', fontWeight:600 , color:'white', fontSize:"0.9rem" }}  align="center">Amount</TableCell>
  
                          </TableRow>
                          </TableHead>
                          <TableBody>
                          {
                          Array.isArray(slicedData) && slicedData?.map((row, index) => (
                                  <TableRow
                                  key={index}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                      <TableCell sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  >{startIndex + index + 1}</TableCell>
                                      <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  > { moment(row.date).format("DD MMMM YYYY hh:mm a") } </TableCell>
                                      <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  > { row.party_name }</TableCell>
                                      <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  >{row.category_name}</TableCell>
                                      <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  >{row.sub_category_name}</TableCell>
                                      <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  > {row.mobileno} </TableCell>
                                      <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:500 , fontSize:"0.8rem"  }}  > {row.ref_no} </TableCell>
                                      <TableCell align='center' sx={{ fontFamily:'montserrat', fontWeight:600 , fontSize:"0.8rem" }}  >{row.amount}</TableCell>
  
                                  </TableRow>
                              ))
                          }
                          </TableBody>
                      </Table>
                  </TableContainer>  */}

            <TableContainer elevation={16} component={Paper} sx={{ marginTop:1.5, width:"95%" }}>
            <Box sx={{ gap:1, padding:1, display:'flex', alignItems:"center", justifyContent:'right' }} >
              <Button onClick={() => generatePDF()} sx={{ fontFamily:'montserrat', fontWeight:500 }} variant='outlined' size='small' endIcon={<DownloadIcon/>} >PDF</Button>
              <Button onClick={() => generateExcel()} sx={{ fontFamily:'montserrat', fontWeight:500 }} variant='outlined' size='small' endIcon={<DownloadIcon/>}  >EXCEL</Button>
            </Box>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor:'#2196f3' }} >
                        {headers.map((header, index) => (
                          <TableCell align='center' sx={{ color:"white", fontFamily:"montserrat", textTransform:"capitalize", fontSize:"0.7rem" }} key={index}>{header}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {slicedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {headers.map((header, headerIndex) => (
                            <TableCell sx={{ fontFamily:"Poppins", color:"black", fontWeight:400, fontSize:"0.8rem" }} key={headerIndex}>
                            {
                              header === "Resend_File" ?( <div dangerouslySetInnerHTML={{ __html:  row[header] }} ></div> ): row[header]
                            }
                            </TableCell>
                            
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                  <Pagination
                  variant="outlined"
                  color="primary"
                  count={Math.ceil(tableData?.length / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  sx={{ m:4 }}
              />
  
        </Box> : null
      }


      <Snackbar
      anchorOrigin={{ vertical:"top", horizontal:"right" }}
      open={handleErr}
      onClose={handleErrClose}
      autoHideDuration={2500}
      >
        <Alert severity='info' >{errorJson}..</Alert>
      </Snackbar>

    <Box sx={{ position: !tableData ? "absolute":"relative" , bottom:0, width:"100%" }} >
    <Footer  />      
    </Box>

    </Box>
  )
}

export default Report