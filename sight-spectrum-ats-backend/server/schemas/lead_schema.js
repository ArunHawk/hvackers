const mongoose = require("mongoose");
const Schema = mongoose.Schema

const lead_schema = new Schema({
    LeadId: { type: String, unique: true },
    company_name : {type:String},
    spoc: {type:String},
    designation_spoc : {type:String},
    status : {type:String},
    noOfDemands : {type:String},
    dueDate : {type:String},
    position : {type:String},
    name_spoc : {type:String},
    reports_to : {type:String},
    designation : {type:String},
    industry_type : {type:String},
    primary_email : {type:String},
    alternative_email : {type:String},
    mobile_number : {type:String},
    alternative_mobile : {type:String},
    additional_information:[{type:Object}],
    source : {type:String},
    source_name : {type:String},
    source_designation : {type:String},
    source_mail : {type:String},    
    source_mobile : {type:String},
    source_company_name : {type:String},
    attach_file : {type:String},
    is_deleted: { type: Boolean, default: false },
    created_by: {type: Schema.Types.ObjectId, ref: 'employee'},
    updated_by: {type: Schema.Types.ObjectId, ref: 'employee'},
},
{
    timestamps: true
})

module.exports = lead_schema;
