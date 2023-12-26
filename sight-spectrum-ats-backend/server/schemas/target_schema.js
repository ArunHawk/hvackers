const mongoose = require('mongoose');
const Schema = mongoose.Schema

const target_schema = new Schema({
    employee_id: { type: String },
    name: { type: String },
    designation: { type: String },
    target: { type: String },
    contract: { type: String },
    fulltime: { type: String },
    revenue: { type: String },
    empanelment: {type : String},
    allocated_date: { type: String },
    accepted_date: { type: String },
    achieved: { type: String },
    message: { type: String },
    assigned_by:{ type: Schema.Types.ObjectId, ref: 'employee' },
    assigned_to: { type: Schema.Types.ObjectId, ref: 'employee' },
    created_by: { type: Schema.Types.ObjectId, ref: 'employee' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'employee' }
}, {
    timestamps: true
})

module.exports = target_schema;