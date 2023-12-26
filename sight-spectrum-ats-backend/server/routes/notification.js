const express = require("express");
const router = express.Router();
const notificationRouter= require('../controllers/notification_controller')

router.post("/sendNotification", notificationRouter.addNotification.controller)
router.get("/getNotification/:userId", notificationRouter.getNotification.controller)
router.put("/readNotification/:id", notificationRouter.readNotification.controller)


// router.get("/getHierarchyEmployeeData", Lead_TargetData.getHierarchyEmployeeData.controller)
// router.get("/getTargetData", Lead_TargetData.getTargetData.controller)
// router.get("/getHierarchyTargetData", Lead_TargetData.getHierarchyTargetData.controller)

module.exports = router;