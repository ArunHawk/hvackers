const leads_services = require("../services/leads_services");


const generateLeadsId = async () => {
    const lead = await leads_services.getLastLead();
    if (lead){
        const lastLeadId = lead.LeadId; 
        console.log(lastLeadId,"as")
        if (lastLeadId) {
            clientCounter = parseInt(lastLeadId.substr(3)) + 1; 
        } else {
            clientCounter = 1;
        }
        const paddedCounter = clientCounter.toString().padStart(6, '0');
        return `L${paddedCounter}`;
    } else {
        return "L000001";
    }
};

const createLeads = {
  controller: async (req, res) => {
    try {
      let new_obj = { ...req.body };
      new_obj["created_by"] = req.auth.user_id;
      new_obj["LeadId"] = await generateLeadsId(); 
      let new_lead = await leads_services.create(new_obj);
      res.respond(new_lead, 200, 'Lead created successfully');
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).send('Internal Server Error');
    }
  },
};


const listLeads = {
    controller: async (req, res) => {
        let employees = await leads_services.getAllLeads(req.query)
        res.respond(employees, 200, 'Leads fetched sucessfully');
    }
}

const updateLead = {
    controller: async (req, res) => {
        let update_obj = req.body;
        console.log(update_obj,"up")
        update_obj["updated_by"] = req.auth.user_id;
        let updateLead =  await leads_services.updateLead(update_obj)
        console.log(updateLead,"up")
        res.respond(updateLead, 200, 'Lead updated successfully.');
    }
}



const deleteLead = {
    controller: async (req, res) => {
       let deleteLead =  await leads_services.deleteLead(req.body._id)
        res.respond(deleteLead, 200, 'Lead deleted successfully.');
    }
}

const EditLead = {
    controller: async (req, res) => {
      let Candidate = await leads_services.getLeadDetail(req.query.Lead_id)
      console.log(Candidate,"can")
      res.respond(Candidate, 200, 'Candidate fetched sucessfully');
    }
  }

  const searchLead = {
    controller: async (req, res) => {
      try {
        const { search_field } = req.query;
        let query_obj = { is_deleted: false };
        const regex = new RegExp(search_field, 'i');
        query_obj['$or'] = [
          { 'company_name': regex },
          { 'source_name': regex }
        ];
  
        const employees = await leads_services.searchLead(query_obj);
        res.respond(employees, 200, 'Employees fetched successfully');
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
  

const updateLeadStatusController = {
  controller: async (req, res) => {
    try {
      let update_obj = req.body;
      update_obj["updated_by"] = req.auth.user_id;
      const updatedLead = await leads_services.updateStatus(update_obj);
      console.log(req.body)
      res.respond(updatedLead, 200, 'Lead status updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const uploadReports = {
  controller: async (req, res) => {
    res.respond({ document: req.file.location }, 200, 'Document uploaded sucessfully');
  }
}

  

module.exports = {
  createLeads,
  listLeads,
  updateLead,
  deleteLead,
  EditLead,
  searchLead,
  updateLeadStatusController,
  uploadReports
};
