
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useTable } from 'react-table';

// Function to convert JSON data to PDF
const JsonToPdf = (jsonData) => {
  const keys = Object.keys(jsonData);
  const values = Object.values(jsonData);

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4',
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: { margin: 'auto', flexDirection: 'row' },
    tableCell: { margin: 'auto', padding: 5, borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  });

  const Table = ({ columns, data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
      columns,
      data,
    });

    return (
      <View {...getTableProps()} style={styles.table}>
        <View>
          {headerGroups.map(headerGroup => (
            <View {...headerGroup.getHeaderGroupProps()} style={styles.tableRow}>
              {headerGroup.headers.map(column => (
                <View {...column.getHeaderProps()} style={styles.tableCell}>
                  <Text>{column.render('Header')}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <View {...row.getRowProps()} style={styles.tableRow}>
                {row.cells.map(cell => {
                  return (
                    <View {...cell.getCellProps()} style={styles.tableCell}>
                      <Text>{cell.render('Cell')}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Table
            columns={[{ Header: 'Keys', accessor: 'key' }, { Header: 'Values', accessor: 'value' }]}
            data={keys.map((key, index) => ({ key, value: values[index] }))}
          />
        </View>
      </Page>
    </Document>
  );

  return MyDocument;
};

// React component
const PDFViewerComponent = ({ jsonData }) => {
  const MyDocument = JsonToPdf(jsonData);

  return (
    <PDFViewer width="100%" height="500px">
      <MyDocument />
    </PDFViewer>
  );
};

export default PDFViewerComponent;