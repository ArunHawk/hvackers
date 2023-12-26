const fast_connection = require("../connections/fastconnection");

class leads_services {

    static async create(data) {
      try {
        const new_lead = new fast_connection.models.addlead(data);
        console.log(new_lead,"lead")
        return await new_lead.save();
      } catch (error) {
        throw error;
      }
    }
    
    static async getLastLead() {
      try {
        return await fast_connection.models.addlead.findOne().sort({ createdAt: -1 });
      } catch (error) {
        throw error;
      }
    }

    static async getAllLeads({ skip, limit, sort_type, sort_field }) {
      try {
        return await fast_connection.models.addlead.find({ is_deleted: false }).populate([{ path: 'created_by', select: '_id first_name last_name' }]).skip(skip).limit(limit).sort([[sort_field, sort_type]]);
      } catch (error) {
        throw error;
      }
    }

    
  //   static async updateLead(body) {
  //   try {
  //     console.log(body,"lo")
  //     return await fast_connection.models.addlead.findOneAndUpdate({ _id: body._id }, body);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  static async updateLead(body) {
    try {
      console.log(body, "lo");
      const updatedLead = await fast_connection.models.addlead.findOneAndUpdate({ _id: body._id }, body);
      if (!updatedLead) {
        return { success: false, message: 'Lead not found' };
      }
      return { success: true, updatedLead };
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error; // This will propagate the error to the calling function
    }
  }
  

  static async deleteLead(_id) {
    try {
      console.log(_id)
      return await fast_connection.models.addlead.findOneAndUpdate({_id:_id},{is_deleted:true});
    } catch (error) {
      throw error;
    }
  }

  static async getLeadDetail(_id) {
    try {
      return await fast_connection.models.addlead.findOne({ is_deleted: false, _id: _id }).populate("created_by", { _id: 1, first_name: 1, last_name: 1 });
    } catch (error) {
      throw error;
    }
  }

  
  static async searchLead(query_obj) {
    try {
      return await  fast_connection.models.addlead.find(query_obj);
    } catch (error) {
      throw error;
    }
  }
 

  static async updateStatus(req) {
    try {
      const lead = await fast_connection.models.addlead.findOneAndUpdate(req.query);
    if (!lead) {
      throw new Error('Lead not found');
    }
    const currentStatus = lead.status;
    const newStatus = currentStatus === 'active' ? 'passive' : 'active';
    lead.status = newStatus;
    if (currentStatus === 'active' && newStatus === 'passive') {
      lead.noOfDemands = null;
      lead.dueDate = null;
    }
    const updatedLead = await lead.save();
    if (!updatedLead) {
      throw new Error('Failed to update lead status');
    }
    return updatedLead;
  } catch (error) {
    throw error;
  }
}


    
}


module.exports = leads_services;
