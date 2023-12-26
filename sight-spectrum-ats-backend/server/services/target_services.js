const fast_connection = require("../connections/fastconnection");

class leadTargetServices {
  static async leadFetch({ employee_id }) {
    try {
      if (employee_id === "6414487f47038cf77ecc7c46") {
        const targetEmployeeId = ["641451d847038cf77ecc7cf7", employee_id];
        const employeeData = await fast_connection.models.employee.find({
          $or: [{ _id: targetEmployeeId }, { reports_to: targetEmployeeId }]
        });
        return employeeData;
      }
      else {
        return await fast_connection.models.employee.find({ reports_to: employee_id });
      }
    } catch (error) {
      throw error;
    }
  }

  static async target_leads(data) {
    const filteredData = data.filter(item => item.target.trim() !== '');
   
    if (filteredData.length > 0) {
      try {
        
        const leadsAssign = await fast_connection.models.addTarget.insertMany(filteredData);
      return leadsAssign;
    } catch (error) {
      throw error;
    }
  }
  }

  static async getLeadData({ assignedToId }) {
    try {
      const getLeadDatas = await fast_connection.models.addTarget.find({ assigned_to: assignedToId }).sort({ updatedAt: -1 });
      return getLeadDatas
    } catch (error) {
      throw error
    }
  }

  static async hierarchyTargetData({ employee_id }) {

    try {
  
      const directReportsData = await fast_connection.models.employee
        .find({ reports_to: employee_id })
        .exec();

   
      const currentUserTarget = await fast_connection.models.addTarget
        .find({ assigned_to: employee_id })
        .exec();

      const targetEmployeeIds = directReportsData.map(employee => employee._id);

      const hierarchyTargetData = await fast_connection.models.addTarget
        .find({ assigned_to: { $in: targetEmployeeIds } })
        .exec();
        if (employee_id === "6414487f47038cf77ecc7c46") {
          const targetEmployeeId = ["641451d847038cf77ecc7cf7", employee_id];
          const employeeData = await fast_connection.models.addTarget.find({
            $or: [{ _id: targetEmployeeId }, { reports_to: targetEmployeeId }]
          }) .sort({ updatedAt: -1 })
          const totalData = [...employeeData];
            return  totalData
        }
        else{
          const totalData = [...hierarchyTargetData, ...currentUserTarget];
          
          return totalData
        }

    } catch (error) {
      throw error;
    }
  }


  static async updateTarget(body) {
    try {
      return await fast_connection.models.addTarget.findOneAndUpdate({ _id: body._id }, body);

    } catch (error) {
      throw error;
    }
  }

  static async getTargetDetails(_id) {
    try {
      return await fast_connection.models.addTarget.findOne({ is_deleted: false, _id: _id }).populate();
    } catch (error) {
      throw error;
    }
  }

  
  // static async getNotification(data) {
  //     try { 
  //       const notificationPost =  await fast_connection.models.notification(data);
  //       return await notificationPost.save();
  //      } catch (error) {
  //       throw error;
  //     }
  //   }


}

module.exports = leadTargetServices;