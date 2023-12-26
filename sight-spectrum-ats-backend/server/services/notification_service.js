const fast_connection = require("../connections/fastconnection");
let requestMessageCount = 0; 
let acceptMessageCount = 0; 
class notification{

  static async createNotification(req,res) {
    try {
    
      const { message, isRead, data, assigned, created_by, updated_by } = req.body;
      // if (message === 'accept') {
      //   const existingNotification = await fast_connection.models.notification.findOne({
      //     assigned,
      //     message,
      //   });

      //   if (existingNotification) {
      //     return 'already exists';
      //   }
        const new_notification = new fast_connection.models.notification({
          message,
          isRead,
          data,
          assigned,
          created_by,
          updated_by,
        });
        // acceptMessageCount++;
        return await new_notification.save();
      // }
      
  
         // If no existing notification and message is "accept," create a new one
          // console.log(req.body)
        // if (message === 'request' && requestMessageCount < 2) {
        // Check if the message is "request" and the limit has not been reached
        // const existingNotification = await fast_connection.models.notification.findOne({
        //   assigned,
        //   message,
        // });
  
        // if (existingNotification) {
        //   return 'already exists';
        // }
  
        // // If no existing notification and message is "request," create a new one
        // const new_notification = new fast_connection.models.notification({
        //   message,
        //   isRead,
        //   data,
        //   assigned,
        //   created_by,
        //   updated_by,
        // });
  
        // Increment the "request" message count
        // requestMessageCount++;
  
        // return await new_notification.save();
      // } else {
        // return 'Invalid message.';
      // }
    }
     catch (error) {
      console.error(error);
      return 'Internal server error';
    }
  }
  

  static async getUserNotification(req,res) {
    const object_id = req.params.userId;
    try {
     
    //   if (object_id === "6414487f47038cf77ecc7c46") {
    //     const targetEmployeeId = ["641451d847038cf77ecc7cf7", object_id];
    //     const employeeData = await fast_connection.models.notification.find({
    //       $or: [{ _id: targetEmployeeId }, { reports_to: targetEmployeeId }]
    //     }).populate('updated_by');
    //     return employeeData;
    //   }
    //   else {
        return await fast_connection.models.notification.find().populate('updated_by');
      }
     catch (error) {
      throw error;
    }
  }

  static async readNotification(req,res) {
    try {
        const notificationId = req.params.id;
        const isRead = req.body.isRead;
        const { read } = isRead;
        const readNotification=fast_connection.models.notification.findByIdAndUpdate(notificationId, { 'isRead.read': read }, { new: true });
      return readNotification;
    } catch (error) {
      throw error;
    }
  }



}

module.exports = notification;
