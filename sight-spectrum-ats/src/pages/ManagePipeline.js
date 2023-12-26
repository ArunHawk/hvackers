import React, { useEffect, useState } from "react";
import styles from "./ManageEmployee.module.css"
import { PrimaryButton, SearchBox, FontIcon, mergeStyles, mergeStyleSets, DefaultButton, Callout, DirectionalHint, MessageBar, MessageBarType, Dropdown } from '@fluentui/react';
import { Shimmer } from '@fluentui/react';
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosPrivateCall } from "../constants";
import AddPipeline from "./AddPipelineModal";
import { DeletePopup } from "../components/DeletePopup";
import { UploadPopup } from '../components/UploadModal';
import { EditUploadPopup } from "../components/EditUploadModal";

const addIcon = { iconName: 'Add' };
const searchIcon = { iconName: 'Search' };

const iconClass = mergeStyles({
    fontSize: 20,
    height: 20,
    width: 20,
    margin: '0 10px',
    color: '#999DA0',
    cursor: 'pointer'
});

const iconClass1 = mergeStyles({
    fontSize: 12,
    height: 12,
    width: 12,
    margin: '0 ',
    color: '#999DA0',
    cursor: 'pointer'
});

const messageBarStyles = {
    content: {
        maxWidth: 620,
        minWidth: 450,
    }
}

const searchFieldStyles = mergeStyleSets({
    root: { width: '185px', },
});

const calloutBtnStyles = {
    root: {
        border: 'none',
        padding: '0px 10px',
        textAlign: 'left',
        height: '20px',
    }
}

const dropDownStylesActive = (props, currentHover, error, value) => {
    return {
        dropdown: {
            width: "90px",
            minWidth: "60px",
            minHeight: "20px",
        },
        title: {
            height: "22px",
            lineHeight: "18px",
            fontSize: "12px",
            borderColor: error
                ? "#a80000"
                : currentHover === value
                    ? "rgb(96, 94, 92)"
                    : "transparent",
        },

        caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
        dropdownItem: { minHeight: "20px", fontSize: 12 },
        dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
    };
};

const shortStatusOptions = [
    { key: "Prospect", text: "Prospect" },
    { key: "Lead", text: "Lead" },
    { key: "Presales", text: "Presales" },
    { key: "Sales", text: "Sales" },
    { key: "Closure", text: "Closure" },
    { key: "Negotiate", text: "Negotiate" },
    { key: "Won", text: "Won" },
    { key: "Lost", text: "Lost" },
    { key: "Hold", text: "Hold" },
    { key: "Drop", text: "Drop" },
    { key: "N/A", text: "N/A" }

]
const dropdownOptions = [
    { key: 'client_id', text: 'Client ID' },
    { key: 'opportunity_id', text: 'Deal Id' },
    { key: 'customer_name', text: 'Customer Name' },
    { key: 'business_Unit', text: 'Business Unit' }
];

const dropdownStyles = mergeStyles({
    dropdown: { width: '200' }
});
let items = Array(4).fill(null);

function ManagePipeline(props) {
    const [showMessageBar, setShowMessageBar] = useState(false);
    const [showSubStauts, setShowSubStatus] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false)
    const [isSubmitSuccess, setSubmitSuccess] = useState(false);
    const [clientData, setClientData] = useState('');
    const [deleteId, setDeleteID] = useState('')
    const [updateId, setUpdateId] = useState([])
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [rowId, setRowId] = useState('');
    const [updateCallout, setUpdateCallout] = useState(false);
    const [showdeleteMessageBar, setShowDeleteMessageBar] = useState(false);
    const [opportunityId, setOpportunity] = useState()
    const [hasMore, setHasMore] = useState(true)
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [selectedRowId, setSelectedRowId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [dropdownSearch, setDropdownSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pipelineData, setPipelineData] = useState({
        client_id: '',
        Deal_name: '',
        customer_name: '',
        status: '',
        closure_date: '',
        entry_date: '',
        owner: '',
        reports_to: '',
        industry: '',
        business_Unit: '',
        currency: '',
        values: '',
        confidence: '',
        delivery_poc: '',
        lead_Reference: '',
        next_action_date: '',
        lead_Reference: '',
        opportunity_description: '',
        addtional_remarks: '',
        documents: [],

    })
    const [loading, setLoading] = useState(false);
    const [isUserSearching, setIsUserSearching] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [fetchOptions, setFetchOptions] = useState({
        skip: 0,
        limit: 15,
        sort_field: 'updatedAt',
        sort_type: -1,
        search_field: ''
    })
    const navigateTo = useNavigate();


    const columns = [
        {
            columnKey: "Client ID",
            label: "Client ID"
        },
        {
            columnKey: "Deal ID",
            label: "Deal ID"
        }, {
            columnKey: "Deal Name",
            label: "Deal Name"
        }, {
            columnKey: "Customer Name",
            label: "Customer Name"
        }, {
            columnKey: "Start Date",
            label: "Start Date"
        }, {
            columnKey: "Close Date",
            label: "Close Date"
        }, {
            columnKey: "Owner",
            label: "Owner"
        },
        {
            columnKey: "Reports To",
            label: "Reports To"
        }, {
            columnKey: "Industry",
            label: "Industry"
        }, {
            columnKey: "Business Unit",
            label: "Business Unit"
        }, {
            columnKey: "Values",
            label: "Values"
        },
        {
            columnKey: "Currency",
            label: "Currency"
        },
        {
            columnKey: "Confidence",
            label: "Confidence"
        },

        {
            columnKey: "Delivery Lead",
            label: "Delivery Lead"
        },
        {
            columnKey: "Lead Reference",
            label: "Lead Reference"
        },
        {
            columnKey: "Next Action Date",
            label: "Next Action Date"
        },


        {
            columnKey: "Documents",
            label: "Documents"
        },
        {
            columnKey: "Status",
            label: "Status"
        },
    ]

    useEffect(() => {
        getClientData()
    }, [isModalOpen])

    const getClientData = () => {
        setIsDataLoaded(false)
        axiosPrivateCall.get('/api/v1/crm/getclientdata').then(res => {
            setClientData(res.data);
            setIsDataLoaded(true)
        })
    }

    const handleDropdownChange = (event, option) => {
        setDropdownSearch(option.key);
        setSearchTerm('');
    };

    const handleSearchInputChange = (event) => {
        if (!event || !event.target) {
            setSearchTerm('');
            return;
        }
        const value = event.target.value;

        switch (dropdownSearch) {
            case 'customer_name':
                if (value && !/^[a-zA-Z\s]+$/.test(value)) {
                    return;
                }
                break;
            case 'client_id':
                if (value && !/^[0-9a-zA-Z]+$/.test(value)) {
                    return;
                }
                break;
            case 'opportunity_id':
                if (value && !/^[0-9a-zA-Z]+$/.test(value)) {
                    return;
                }
                break;
            case 'business_Unit':
                if (value && !/^[a-zA-Z\s]+$/.test(value)) {
                    return;
                }
                break;
            default:
                break;
        }

        setSearchTerm(value);
    };

    const searchClientList = (e) => {
        const searchValue = e;

        if (searchValue === '') {
            getClientData();
            return;
        }

        setIsDataLoaded(false);
        setIsUserSearching(true);

        setFetchOptions((prevData) => {
            return {
                ...prevData,
                search_field: searchValue,
            };
        });

        axiosPrivateCall
            .get(`/api/v1/crm/searchClients?field_name=${dropdownSearch}&field_value=${searchValue}`)
            .then((res) => {
                setClientData(res.data);
                setIsDataLoaded(true);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const clearSearchBox = () => {
        setIsUserSearching(false)

        setFetchOptions(prevData => {
            return {
                ...prevData,
                search_field: ''
            }
        })
    }

    const deletePipeline = (id) => {

        setUpdateCallout(!updateCallout)
        setShowPopup(!showPopup);
        const deleteObj = { _id: id.opportunity_id }
        setDeleteID(deleteObj)
        setUpdateId({ _id: id._id })
    }
    useEffect(() => {
        if (showdeleteMessageBar) {
            setTimeout(() => {
                setShowDeleteMessageBar(!showdeleteMessageBar)
            }, 3500)
        }

    }, [showdeleteMessageBar])

    useEffect(() => {

        if (showMessageBar) {
            setTimeout(() => {
                setShowMessageBar(!showMessageBar)
            }, 3500)
        }

    }, [showMessageBar])


    const downloadClients = () => {
        setLoading(true);
        setTimeout(() => {
            axiosPrivateCall
                .get(`api/v1/crm/downloadClient?&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`, {
                    responseType: 'blob',
                })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${Date.now()}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    setCompleted(true);
                    setTimeout(() => {
                        setCompleted(false);
                    }, 4000);
                    setLoading(false);
                })
                .catch(e => {
                    console.log(e);
                    setLoading(false);
                });
        }, 1000);
    };

    const handleUpdate = (showpop) => {
        const deleteObj = { _id: updateId };
        if (!showpop) {
            setShowPopup(!showPopup)
            axiosPrivateCall.post(`/api/v1/crm/deleteClientData/${deleteObj._id._id}`).then(res => {
                setShowDeleteMessageBar(!showdeleteMessageBar)
                const demandArrList = clientData
                setClientData(demandArrList.filter(clientData => clientData._id !== deleteObj._id._id));
            }).catch(e => {
                setUpdateCallout(false)
            })
        }
    }

    function UploadHandler(data) {
        setShowUploadPopup(true);
        setPipelineData(data)

    }
    function handleDel() {
        setClientData((prev) => {
            let buffer = { ...prev }
            buffer.documents = [];
            return buffer;
        })
    }

    const handleStatusCellClick = async (rowId, initialStatus) => {
        setSelectedRowId(rowId);
        setIsEditing(true);
        setSelectedStatus(initialStatus);

    };
    const handleStatusChange = async (selectedStatus) => {
        // Find the data for the selected row based on the rowId
        const updatedData = clientData.map((data) => {
            if (data._id === selectedRowId) {
                return { ...data, status: selectedStatus };
            }
            return data;
        });

        try {
            // Make an API request to update the status
            const response = await axiosPrivateCall.put(`/api/v1/crm/updateStatus/${selectedRowId}`, { status: selectedStatus });
            console.log(response, "Status updated successfully.");

            // Update the clientData state with the updated data
            setClientData(updatedData);
        } catch (error) {
            console.error("Error updating status:", error);
        }

        // Reset editing state
        setIsEditing(false);
    };

    const dropDownHandler = (e, item, name) => {
        setClientData((prevData) => {
            return {
                ...prevData,
                [name]: item.text,
            };
        });
    };


    function openResume(documentUrl) {
        // Open the PDF document in a new tab
        window.open(documentUrl, '_blank');
    }

    const renderStatusCell = (data) => {
        return (
            <td className={styles.table_dataContents}
                onClick={() => handleStatusCellClick(data._id)}>
                {isEditing && selectedRowId === data._id ? (
                    <Dropdown
                        onChange={(e, item) => {
                            dropDownHandler(e, item, "status");
                            handleStatusChange(item.key);
                            // setCurrentHover("");
                            setClientData({ ...clientData, status: item.key });
                        }}
                        placeholder="Select"
                        options={shortStatusOptions}
                        selectedKey={data.status}
                        notifyOnReselect
                        styles={dropDownStylesActive}
                    // errorMessage={validationErrors.status}
                    />
                ) : (
                    <div onClick={() => handleStatusCellClick(data._id)}>{data.status}</div>
                )}
            </td>
        );
    }
    return (
        <>
            <div className={styles.page}>
                <div className={styles.container}>
                    {<EditUploadPopup
                        showPopup={showUploadPopup}
                        setShowPopup={setShowUploadPopup}
                        basicInfo={pipelineData}
                        setBasicInfo={setPipelineData}

                    />}
                    <DeletePopup showPopup={showPopup}
                        setShowPopup={setShowPopup}
                        handleUpdate={handleUpdate}
                        deleteId={deleteId}
                        updateCallout={updateCallout}
                        setUpdateCallout={setUpdateCallout}
                        opportunityId={opportunityId}
                    />

                    {isModalOpen && <AddPipeline
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        isSubmitSuccess={isSubmitSuccess}
                        setSubmitSuccess={setSubmitSuccess}
                        setShowMessageBar={setShowMessageBar}
                        showMessageBar={showMessageBar}

                    />}

                    <div className={styles.nav_container}>
                        <div className={styles.title}>Manage Deals</div>

                        {showMessageBar && <div >
                            <MessageBar onDismiss={() => setShowMessageBar(!showMessageBar)} styles={messageBarStyles} dismissButtonAriaLabel="Close" messageBarType={MessageBarType.success}>
                                Added Successfully
                            </MessageBar>
                        </div>}

                        {showdeleteMessageBar && <div >
                            <MessageBar onDismiss={() => setShowDeleteMessageBar(showSubStauts)} styles={messageBarStyles} dismissButtonAriaLabel="Close" messageBarType={MessageBarType.success}>
                                Deleted successfully
                            </MessageBar>
                        </div>}

                        <div className={styles.nav_items}>
                            <Dropdown
                                placeholder="Select Search Field"
                                options={dropdownOptions}
                                styles={dropdownStyles}
                                onChange={handleDropdownChange}
                                selectedKey={dropdownSearch}
                                className={styles.customDropdown}
                            />

                            <SearchBox
                                styles={searchFieldStyles}
                                onChange={handleSearchInputChange}
                                onSearch={(e) => searchClientList(e)}
                                onClear={clearSearchBox}
                                disabled={dropdownSearch === ""}
                                placeholder=" "
                                iconProps={searchIcon}
                                className={styles.search}
                                value={searchTerm}
                                showIcon
                            />




                            <FontIcon iconName="Breadcrumb" className={iconClass} />
                            <PrimaryButton text="Add New" iconProps={addIcon}
                                onClick={() => { setIsModalOpen(!isModalOpen); setSubmitSuccess(false); }} />
                            <FontIcon onClick={downloadClients} iconName="Download" className={iconClass} />
                        </div>
                    </div>

                    <div id="scrollableDiv" className={styles.table_container}>
                        <InfiniteScroll style={{ overflow: 'visible', height: '100%' }} dataLength={clientData.length} loader={isDataLoaded && clientData.length >= 15
                        }
                            hasMore={hasMore} scrollableTarget="scrollableDiv">
                            <table>
                                <thead className={styles.table_header}>
                                    <tr className={styles.table_row}>
                                        {columns.map((column) =>
                                            <th className={styles.table_headerContents} key={column.columnKey}>
                                                <div
                                                    className={styles.table_heading}>
                                                    <div>{column.label}</div>
                                                    {column?.icon ? <FontIcon iconName={column.icon} className={iconClass1} /> : null}
                                                </div>
                                            </th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isDataLoaded && Array.isArray(clientData) && clientData.map((data) =>
                                        <tr className={data.status ? `${styles.table_row}` : `${styles.table_row_idle}`} key={data._id}>
                                            <td onClick={() => navigateTo(`/masterlist/editclient?client_id=${data.client_objId}`)} className={styles.table_dataContents}>{data.client_id || '-'}</td>
                                            <td onClick={() => navigateTo(`/managedeals/editpipeline?client_id=${data._id}`, { state: data })} className={styles.table_dataContents}>{data.opportunity_id || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.Deal_name || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.customer_name || '-'}</td>
                                            <td className={styles.table_dataContents}>{(new Date(data.entry_date)).toLocaleDateString('en-GB')}</td>
                                            <td className={styles.table_dataContents}>{(new Date(data.closure_date)).toLocaleDateString('en-GB')}</td>
                                            <td className={styles.table_dataContents}>{data.owner || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.reports_to || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.industry || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.business_Unit || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.values || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.currency || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.confidence || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.delivery_poc || '-'}</td>
                                            <td className={styles.table_dataContents}>{data.lead_Reference || '-'}</td>
                                            <td className={styles.table_dataContents}>{(new Date(data.next_action_date)).toLocaleDateString('en-GB') || '-'}</td>

                                            <td className={styles.table_dataContents}>
                                                {data.documents.length > 0 ? (
                                                    <div>
                                                        <a
                                                            href="javascript:void(0);"
                                                            onClick={() => {
                                                                const iframeHTML = data.documents.map((document) => (
                                                                    `<iframe src="${document.document}" style="width: 80%; height: 700px;"></iframe>`
                                                                )).join('');
                                                                const newWindow = window.open('', '_blank');
                                                                newWindow.document.open();
                                                                newWindow.document.write(iframeHTML);
                                                                newWindow.document.close();
                                                            }}
                                                        >
                                                            Link
                                                        </a>
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            {renderStatusCell(data)}
                                            <td className={styles.table_dataContents}>
                                                <div id={`Dp${data._id}`} onClick={() => { setRowId(data._id); setUpdateCallout(true) }} className={styles.moreOptions}>
                                                    <FontIcon iconName='MoreVertical' className={iconClass1} />
                                                    {rowId === data._id &&
                                                        updateCallout && <Callout gapSpace={0} target={`#Dp${data._id}`} onDismiss={() => setRowId('')}
                                                            isBeakVisible={false} directionalHint={DirectionalHint.bottomCenter}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <DefaultButton onClick={() => navigateTo(`/reports/editpipeline?client_id=${data._id}`, { state: data })} text="View/Edit" styles={calloutBtnStyles} />
                                                                <DefaultButton onClick={() => UploadHandler(data)} text="Upload" styles={calloutBtnStyles} />
                                                                <DefaultButton onClick={() => deletePipeline(data)} text="Delete" styles={calloutBtnStyles} />
                                                            </div>
                                                        </Callout>
                                                    }
                                                </div>
                                            </td>
                                        </tr>)
                                    }
                                    {!isDataLoaded && items.map(client =>
                                        <tr className={styles.table_row} >
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}><Shimmer /></td>
                                            <td className={styles.table_dataContents}>
                                                <div className={styles.moreOptions} >
                                                    <FontIcon iconName='MoreVertical' className={iconClass1} />
                                                </div>
                                            </td>
                                        </tr>)}
                                </tbody>
                            </table>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ManagePipeline;

