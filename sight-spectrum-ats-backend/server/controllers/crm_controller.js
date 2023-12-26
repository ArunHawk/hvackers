const crm_services = require("../services/crm_services");
const crypto = require('crypto')
const { ISOdateToCustomDate } = require('../utils/ISO_date_helper')
const Excel = require('exceljs')
const fs = require('fs')
const demand_services = require("../services/demand_services")


const createPipeline = {
    controller: async (req, res, next) => {
        try {
            const clientIdExists = await crm_services.checkClientId(req.body.client_id);
            if (!clientIdExists) {
                return res.status(400).send('Client ID does not exist');
            }
            const clientId = clientIdExists._id;
            console.log(clientId)
            await crm_services.initializeCounter();

            await crm_services.addNew(req, res, next, clientId);
        } catch (error) {
            next(error);
        }
    }
};
const getClientDetails = {
    controller: async (req, res) => {
        let client = await crm_services.getAllClient();
        res.respond(client, 200, 'Client fetched sucessfully');

    }
};

const getClientDataById = {
    controller: async (req, res) => {
        const { _id } = req.params;
        let databyid = await crm_services.getClientById(_id);
        res.respond(databyid, 200, 'client fetched successfully');

    }
}

const updateClientData = {
    controller: async (req, res) => {
        const clientIdExists = await crm_services.checkClientId(req.body.client_id);
        if (!clientIdExists) {
            return res.status(400).send('Client ID does not exist');
        }
        const clientId = clientIdExists._id;
        console.log(clientId)
        const { _id } = req.params;
        const newData = req.body;
        console.log('ID:', _id);
        console.log('New Data:', newData);
        let updatedata = await crm_services.updateData(_id,
            newData,
            clientId,
            { new: true });
        res.respond(updatedata, 200, 'client updated Succesfully')

    }
}
const updateStatus = {
    controller: async (req, res) => {

        const { _id } = req.params;
        const newData = req.body;
        console.log('ID:', _id);
        console.log('New Data:', newData);
        let updatedata = await crm_services.updateData(_id,
            newData,
            { new: true });
        res.respond(updatedata, 200, 'client updated Succesfully')

    }
}

const deleteClientData = {
    controller: async (req, res) => {
        const { _id } = req.params;
        await crm_services.deleteData(_id);
        res.respond("Demand deleted successfully", 200, 'Demand deleted successfully.');
    },
};

const searchClients = {
    controller: async (req, res) => {
        let clients = await crm_services.searchClient(req.query.field_name, req.query.field_value)
        res.respond(clients, 200, 'clients fetched sucessfully');
    }
}

const downloadClient = {
    controller: async (req, res) => {

        let random_prefix = crypto.randomBytes(20).toString('hex')
        let client = await crm_services.getAllClient(req.query)


        let excel_client = client.map(e => {
            let transformed = {
                client_id: e?.client_id,
                deal_id: e?.opportunity_id,
                deal_name: e?.Deal_name,
                customer_name: e?.customer_name,
                owner: e?.owner,
                reports_to: e?.reports_to,
                industry: e?.industry,
                status: e?.status,
                business_Unit: e?.business_Unit,
                values: e?.values,
                currency: e?.currency,
                start_date: ISOdateToCustomDate(e?.entry_date),
                closure_date: ISOdateToCustomDate(e?.closure_date),
                confidence: e?.confidence,
                delivery_poc: e?.delivery_poc,
                next_action_date: ISOdateToCustomDate(e?.next_action_date),
                lead_Reference: e?.lead_Reference,
                documents: e?.documents,
                opportunity_description: e?.opportunity_description,
                addtional_remarks: e?.addtional_remarks,
                registered_date: ISOdateToCustomDate(e?.createdAt),
                updated_date: ISOdateToCustomDate(e?.updatedAt),
                timestamp: ISOdateToCustomDate(e?.updatedAt)
            }
            return transformed
        })
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet("client_list");

        worksheet.columns = [
            { header: 'client_id', key: 'client_id' },
            { header: 'deal_id', key: 'deal_id' },
            { header: 'deal_name', key: 'deal_name' },
            { header: 'customer_name', key: 'customer_name' },
            { header: 'owner', key: 'owner' },
            { header: 'reports_to', key: 'reports_to' },
            { header: 'industry', key: 'industry' },
            { header: 'status', key: 'status' },
            { header: 'business_Unit', key: 'business_Unit' },
            { header: 'values', key: 'values' },
            { header: 'currency', key: 'currency' },
            { header: 'start_date', key: 'start_date' },
            { header: 'closure_date', key: 'closure_date' },
            { header: 'confidence', key: 'confidence' },
            { header: 'delivery_poc', key: 'delivery_poc' },
            { header: 'next_action_date', key: 'next_action_date' },
            { header: 'lead_Reference', key: 'lead_Reference' },
            { header: 'opportunity_description', key: 'opportunity_description' },
            { header: 'addtional_remarks', key: 'addtional_remarks' },

        ]

        console.log(excel_client, "excel")
        worksheet.addRows(excel_client);
        await workbook.xlsx
            .writeFile(`./${random_prefix}_list.xlsx`)
            .then(function () {
                res.download(`./${random_prefix}_list.xlsx`, 'list.xlsx', function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        fs.unlink(`./${random_prefix}_list.xlsx`, function () {
                            console.log(`${random_prefix}_list.xlsx file deleted`)
                        });
                    }
                })
            });
    }
}


module.exports = {
    getClientDetails,
    createPipeline,
    getClientDataById,
    updateClientData,
    deleteClientData,
    searchClients,
    downloadClient,
    updateStatus

};