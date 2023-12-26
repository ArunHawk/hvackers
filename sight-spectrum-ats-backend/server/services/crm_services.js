const fast_connection = require("../connections/fastconnection");


class crm_services {

    static async initializeCounter() {
        try {
            const counter = await fast_connection.models.counter.findOne({ _id: 'opportunityIdCounter' });
            if (!counter) {
                const newCounter = new fast_connection.models.counter({ _id: 'opportunityIdCounter', sequenceValue: 10080 });
                await newCounter.save();
            }
        } catch (error) {
            throw error;
        }
    }
    static async addNew(req, res, next, clientId) {
        try {
            const counter = await fast_connection.models.counter.findById('opportunityIdCounter');
            let sequenceValue = counter.sequenceValue;
            counter.sequenceValue++;
            await counter.save();

            const addNewDetails = new fast_connection.models.salespipelinesheet({
                opportunity_id: sequenceValue.toString(),
                ...req.body,
                client_objId: clientId
            });
            await addNewDetails.save();
            res.status(200).send('Added New Customer');
        } catch (error) {
            next(error);
        }
    }
    static async checkClientId(clientId) {
        try {
            const client = await fast_connection.models.client.findOne({ ClientId: clientId });
            // console.log(client)
            return client;
        } catch (error) {
            throw error;
        }
    }

    static async getAllClient() {
        try {
            return await fast_connection.models.salespipelinesheet.find({ is_deleted: false }).sort({ updatedAt: -1 });;
        } catch (error) {
            throw error;
        }
    }

    static async getClientById(_id) {
        try {
            return await fast_connection.models.salespipelinesheet.findById({ is_deleted: false, _id });
        }
        catch (error) {
            throw error;
        }
    }
    static async updateData(_id, newData) {
        try {
            return await fast_connection.models.salespipelinesheet.findByIdAndUpdate(
                _id,
                newData,
                { new: true });
        } catch (error) {
            throw error;
        }
    }
    static async deleteData(_id) {
        try {
            return await fast_connection.models.salespipelinesheet.findByIdAndUpdate(_id, { is_deleted: true }, { new: true });
        } catch (error) {
            throw error;
        }
    }

    static async searchClient(field_name, filed_value) {
        try {
            let query_obj = { is_deleted: false }
            const regex = new RegExp(filed_value, 'i');
            query_obj[field_name] = regex;
            return await fast_connection.models.salespipelinesheet.find(query_obj).populate([{ path: 'created_by', select: '_id first_name last_name' }]);
        } catch (error) {
            throw error;
        }
    }
}
module.exports = crm_services;
