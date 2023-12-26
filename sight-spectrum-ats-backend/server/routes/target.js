const express = require("express");
const router = express.Router();
const Lead_TargetData = require('../controllers/target_controller')

router.post("/addTargetData", Lead_TargetData.addTargetData.controller)
router.post("/updateTargetData", Lead_TargetData.updateTargetData.controller)
router.post("/postRequest", Lead_TargetData.createNotification.controller)


router.get("/getHierarchyEmployeeData", Lead_TargetData.getHierarchyEmployeeData.controller)
router.get("/getTargetData", Lead_TargetData.getTargetData.controller)
router.get("/getHierarchyTargetData", Lead_TargetData.getHierarchyTargetData.controller)

module.exports = router;