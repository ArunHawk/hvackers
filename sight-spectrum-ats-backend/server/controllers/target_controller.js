const leadTargetServices = require("../services/target_services")
const submissionTracker=require("../services/submission_tracker_services")
const getHierarchyEmployeeData = {
    controller: async (req, res) => {
        let leadFinds = await leadTargetServices.leadFetch(req.query)
        res.respond(leadFinds, 200, 'Lead fetched sucessfully');
    }
}

const addTargetData = {
    controller: async (req, res) => {
        let new_obj = req.body;
        let targetAssign = await leadTargetServices.target_leads(new_obj)
        res.respond(targetAssign, 200, "Target Assigned Successfully")
    }
}

const getTargetData = {
    controller: async (req, res) => {
        let target_Data = await leadTargetServices.getLeadData(req.query)
        res.respond(target_Data, 200, "Target Fetched Successfully")
    }
}

const getHierarchyTargetData = {
    controller: async (req, res) => {
        const hierarchyData = await leadTargetServices.hierarchyTargetData(req.query);
        const currentDate = new Date();
      
       const currentMonth = currentDate.getMonth()+1;
       const currentYear = currentDate.getFullYear();
       
        const achievedData=await  submissionTracker.GetOnBoardedData(currentMonth,currentYear )
      
       hierarchyData.forEach(item1 => {
        const name = item1.name;

        const matches = achievedData.filter(item2 => {
            return (
              item2.submitted_by?.first_name === name ||
              (item2.submitted_by?.reports_to?.first_name === name) ||
              (item2.submitted_by?.reports_to?.reports_to?.first_name === name) ||
              (item2.submitted_by?.reports_to?.reports_to?.reports_to?.first_name === name)
            );
          });
        item1.achieved = matches.length;
      });
    
        res.respond(hierarchyData, 200, 'Hierarchy data fetched successfully');

    }
}
const updateTargetData = {
    controller: async (req, res) => {
        try {
            const update_obj = { ...req.body };

            const updateData = await leadTargetServices.updateTarget(update_obj);
            console.log(updateData,update_obj, "update"); // Log the updateData here
            res.respond(updateData, 200, 'Target updated successfully.');
        } catch (error) {
            console.error(error); // Log any errors that occur during the update
            res.respond(error.message, 500, 'An error occurred while updating the target.');
        }
    }
}



const createNotification = {
    controller : async (req,res) =>{
        try{
            const option = {...req.body}
            console.log(option,"option")
            const post = await leadTargetServices.getNotification(option)
            res.respond(post, 200, 'post requested.');
          }catch(error){
            console.log(error)
        }
        
    }

}

module.exports = {
    getHierarchyEmployeeData,
    addTargetData,
    getTargetData,
    getHierarchyTargetData,
    updateTargetData,
    createNotification
}