const express = require("express");
const router = express.Router();
const crm_controller = require("../controllers/crm_controller");

router.post("/addnew", crm_controller.createPipeline.controller);
router.get("/getclientdata", crm_controller.getClientDetails.controller)
router.get("/getclientbyid/:_id", crm_controller.getClientDataById.controller)
router.put("/updateData/:_id", crm_controller.updateClientData.controller)
router.put("/updateStatus/:_id", crm_controller.updateStatus.controller)
router.post("/deleteClientData/:_id", crm_controller.deleteClientData.controller)
router.get("/searchClients", crm_controller.searchClients.controller)
router.get("/downloadClient", crm_controller.downloadClient.controller)

module.exports = router;