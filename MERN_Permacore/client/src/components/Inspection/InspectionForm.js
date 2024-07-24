import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styling for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    borderBottom: '1px solid #ccc',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  detailSection: {
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 18,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  detailContent: {
    fontSize: 14,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    width: '48%',
  },
});

// Function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const InspectionReportPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Inspection Report</Text>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Inspector Name:</Text>
          <Text style={styles.detailContent}>{data.inspectorFirstName} {data.inspectorLastName}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Inspector Badge Number:</Text>
          <Text style={styles.detailContent}>{data.inspectorBadgeNumber}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Date of Inspection:</Text>
          <Text style={styles.detailContent}>{formatDate(data.createdAt)}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Order Number:</Text>
              <Text style={styles.detailContent}>{data.orderNumber}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Vendor Name:</Text>
              <Text style={styles.detailContent}>{data.vendorName}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Vendor ID:</Text>
              <Text style={styles.detailContent}>{data.vendorId}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Work Order Number:</Text>
              <Text style={styles.detailContent}>{data.workOrderNumber}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Rework Number:</Text>
              <Text style={styles.detailContent}>{data.reworkNumber}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Purchase Order Number:</Text>
              <Text style={styles.detailContent}>{data.purchaseOrderNumber}</Text>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Quantity Received:</Text>
              <Text style={styles.detailContent}>{data.quantityReceived}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Quantity Accepted:</Text>
              <Text style={styles.detailContent}>{data.quantityAccepted}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Quantity Rejected:</Text>
              <Text style={styles.detailContent}>{data.quantityRejected}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Rejection Code:</Text>
              <Text style={styles.detailContent}>{data.rejectionCode}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>At Fault:</Text>
              <Text style={styles.detailContent}>{data.atFault}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Discrepancy Details:</Text>
          <Text style={styles.detailContent}>{data.discrepancyDetails}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Notes:</Text>
          <Text style={styles.detailContent}>{data.notes}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InspectionReportPDF;
