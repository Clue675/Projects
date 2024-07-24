const mongoose = require('mongoose');

const supplierSurveySchema = new mongoose.Schema({
  supplierName: String,
  supplierNumber: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  telephone: String,
  fax: String,
  contactName: String,
  contactTitle: String,
  contactTelephone: String,
  contactEmail: String,
  businessType: [String],
  qualitySystemCompliance: [{
    standard: String,
    expiryDate: Date,
  }],
  certificationInfo: {
    name: String,
    title: String,
    date: Date,
  },
  supplierStatus: String,
  classification: String,
  riskFactor: Number,
  auditSurveyCycle: String,
  qualityEngineeringRemarks: String,
  dirQualityAssuranceRemarks: String,
  dateReviewed: Date,
  qualitySystem: {
    hasQualitySystem: Boolean,
    manualReviewedUpdated: Boolean,
    revisionLevel: String,
    revisionDate: Date,
    subjectToInternalAudits: Boolean,
    hasOrganizationalChart: Boolean,
  },
  procurement: {
    hasProceduresForRegulatoryConformance: Boolean,
    purchaseOrdersStateRegulatoryRequirements: Boolean,
  },
  // Add additional sections as per your requirements...
}, { timestamps: true });

const SupplierSurvey = mongoose.model('SupplierSurvey', supplierSurveySchema);
module.exports = SupplierSurvey;
