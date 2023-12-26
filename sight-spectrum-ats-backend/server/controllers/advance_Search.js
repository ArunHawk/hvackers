const BooleanSearch = require("../services/advanceSearch_services");

const advanceBoolean = {
  controller: async (req, res) => {
    let searchTerms = req.body
    let leadFinds = await BooleanSearch.advanceBoolean(searchTerms)
    res.respond(leadFinds, 200, 'Search has been made!!');
  }
}

const advanceBooleanControl = {
  controller: async (req, res) => {
    let AScandidate = await BooleanSearch.BooleanascCandidate(req.body);
    res.respond(AScandidate, 200, 'Candidates fetched sucessfully');
  }
}
const searchFeild = {
  controller: async (req, res) => {
    let docExtract = await BooleanSearch.searchFeild(req.body);
    res.respond(docExtract, 200, 'DocumentExtraction done')
  }
}

const upgradeboolean ={
  controller: async (req,res)=>{
    let advanceUpgrade = await BooleanSearch.UpgradeSearch(req.body);
    res.respond(advanceUpgrade, 200, "Results Fetched");
  }
}


module.exports = {
  advanceBoolean,
  advanceBooleanControl,
  searchFeild,
  upgradeboolean
}