const mongoose = require('mongoose');
const Schema = mongoose.Schema

const notification_schema = new Schema({
    message: { type: String },
    data:{type:Array},
    assigned: { type: Schema.Types.ObjectId, ref: 'employee' },
    created_by: { type: Schema.Types.ObjectId, ref: 'employee' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'employee' },
    isRead:{type:Object}
}, {
    timestamps: true
})

module.exports = notification_schema;