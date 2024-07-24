

const vendorColumns = [
    { field: "vendorNumber", headerName: "Vendor ID", width: 70 },
    { field: "vendorName", headerName: "Vendor Name", width: 200 },
    { field: "lastAuditDate", headerName: "Last Audit Date", width: 150, type: "date", editable: true },
    { field: "nextAuditDate", headerName: "Next Audit Date", width: 150, type: "date", editable: true },
    { field: "status", headerName: "Status", width: 100, editable: true },
    { field: "comments", headerName: "Comments", width: 200, editable: true },
    { field: "approvalType", headerName: "Approval Type", width: 150, editable: true },
    { field: "VendorCapabilities", headerName: "Capabilities", width: 200, editable: true },
    { field: "email", headerName: "Email", width: 200 },
    { field: "streetAddress", headerName: "Street Address", width: 200 },
    { field: "city", headerName: "City", width: 150 },
    { field: "state", headerName: "State", width: 100 },
    { field: "zipCode", headerName: "Zip Code", width: 100 },
    { field: "country", headerName: "Country", width: 100 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "qualityRepName", headerName: "Quality Rep Name", width: 200 },
    { field: "salesRepName", headerName: "Sales Rep Name", width: 200 },
    { field: "certificationName", headerName: "Certification Name", width: 200 },
    { field: "certificationText", headerName: "Certification Text", width: 200 },
    { field: "issuedDate", headerName: "Issued Date", type: "date", width: 150 },
    { field: "issuedBy", headerName: "Issued By", width: 200 },
    { field: "expirationDate", headerName: "Expiration Date", type: "date", width: 150 },
    { field: "fileReference", headerName: "File Reference", width: 200 },
    { field: "certificationNotes", headerName: "Certification Notes", width: 300 },
  ];
  
  export default vendorColumns;
  