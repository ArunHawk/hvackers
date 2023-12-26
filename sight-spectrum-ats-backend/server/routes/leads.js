const express = require("express");
const router = express.Router();
const leads_controller = require("../controllers/leads_controller")
const { mediaUploadS3 } = require("../utils/s3_helper")

router.post("/addlead", leads_controller.createLeads.controller);
router.post("/updatelead", leads_controller.updateLead.controller)
router.post("/deleteLead", leads_controller.deleteLead.controller)
router.post("/updateStatus", leads_controller.updateLeadStatusController.controller)
router.post("/uploadReports", mediaUploadS3("candidate_reports").single("file"), leads_controller.uploadReports.controller)

router.get("/getlead", leads_controller.listLeads.controller);
router.get("/EditLead", leads_controller.EditLead.controller)
router.get("/searchLead", leads_controller.searchLead.controller)

module.exports = router
