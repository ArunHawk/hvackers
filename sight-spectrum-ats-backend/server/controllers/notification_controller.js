const notificationServices = require("../services/notification_service")
// notificationController.js


const addNotification = {
    controller: async (req, res) => {
        let notification = await notificationServices.createNotification(req)
        res.respond(notification, 200, 'Lead fetched sucessfully');
    }
}

const getNotification =  {
    controller: async (req, res) => {
        let notification = await notificationServices.getUserNotification(req)
        res.respond(notification, 200, 'Lead fetched sucessfully');
    }
};

const  readNotification=  {
    controller: async (req, res) => {
        let notification = await notificationServices.readNotification(req)
        res.respond(notification, 200, 'Lead fetched sucessfully');
    }
};

module.exports = {
    addNotification,
    getNotification,
    readNotification,
}