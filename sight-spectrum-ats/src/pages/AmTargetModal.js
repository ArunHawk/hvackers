import React, { useState, useEffect, useCallback } from 'react'
import { Dropdown, Label, Modal } from '@fluentui/react'
import styles from './AddTargetModal.module.css'
import { Icon } from '@fluentui/react/lib/Icon';
import { TextField, PrimaryButton, DefaultButton, DatePicker } from '@fluentui/react';
import { mergeStyles, mergeStyleSets } from '@fluentui/react';
import { Popup } from "../components/Popup";
import { useNavigate } from 'react-router-dom';
import { axiosPrivateCall } from "../constants";
import InfiniteScroll from 'react-infinite-scroll-component';

const vendorRegex = /^[a-zA-Z0-9 @,.()-]*$/;

const contractIconClass = mergeStyles({
    fontSize: 20,
    height: '20px',
    width: '20px',
    cursor: 'pointer',
});

const closeIconClass = mergeStyles({
    fontSize: 16,
    height: '20px',
    width: '20px',
    cursor: 'pointer'

});

const textFieldStyles = (props, currentHover, error, value) => {
    return {
        fieldGroup: {
            width: "138px",
            height: "18px",
            backgroundColor: "#FFFFFF",
            borderColor: "rgba(144, 144, 144, 1)",
            marginLeft: "11px",
            lineHeight: "10px",
            marginTop: "8px",
        },
        field: {
            fontSize: 12,
            font: "Lato",
            textAlign: "center"

        },
    };
};
const dropDownStyles = mergeStyleSets({
    dropdown: {
        minHeight: "18px", width: "138px",
        marginLeft: "11px",
        marginTop: "8px"
    },
    title: {
        height: "18px",
        lineHeight: "18px",
        fontSize: "12px",
        borderColor: "rgba(144, 144, 144, 1)",
    },
    caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
    dropdownItem: { minHeight: "22px", fontSize: 12 },
    dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
});

const calendarClass = (props, currentHover, error, value) => {
    return {
        root: {
            "*": {
                width: "142px",
                fontSize: "12px !important",
                height: "18px !important",
                lineHeight: "17px !important",
                paddingTop: "1.5px",
                borderColor: error
                    ? "rgb(168,0,0)"
                    : currentHover === value
                        ? "rgb(50, 49, 48) !important "
                        : "transparent !important",
                selectors: {
                    ":hover": {
                        borderColor: "rgb(50, 49, 48) !important",
                    },
                },
            },
        },

        icon: { height: 10, width: 10, left: "120px", padding: "0px 0px" },
        statusMessage: { marginBottom: "-25px" },
    };
};


const dropDownValue = [
    { key: "0", text: "0" },
    { key: "1", text: "1" },
    { key: "2", text: "2" },
    { key: "3", text: "3" },
    { key: "4", text: "4" },
    { key: "5", text: "5" },
    { key: "6", text: "6" },
    { key: "7", text: "7" },
    { key: "8", text: "8" },
    { key: "9", text: "9" },
    { key: "10", text: "10" },

];

const AmTargetModal = (props) => {
    const navigate = useNavigate()
    const { isModalOpen, setIsModalOpen, showMessageBar, setShowMessageBar } = props;
    const [amTargetData, setAmTargetData] = useState([]);
    const [LeadTargetDAta, setLeadTargetDAta] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isModalShrunk, setIsModalShrunk] = useState(false);
    const [page, setPage] = useState(1);

    const token = localStorage.getItem('token');
    let base64Url = token.split('.')[1];
    let decodedValue = JSON.parse(window.atob(base64Url));
    const userId = decodedValue.user_id

    let firstTitle, secondTitle, role1, role2;
    switch (decodedValue.user_role) {
        case 'admin':
            firstTitle = "ACCOUNT MANAGER TARGET";
            role1 = "account_manager"
            secondTitle = "BD TARGET";
            role2 = "bde"
            break;
        case 'account_manager':
            firstTitle = "ACCOUNT MANAGER TARGET";
            role1 = "account_manager"
            secondTitle = "LEAD APLIT UP";
            role2 = "team_lead"
            break;
        case 'team_lead':
            firstTitle = "LEAD TARGET";
            role1 = "team_lead"
            secondTitle = "RECRUITER SPLIT UP";
            role2 = "recruiter"
            break;
        default:

            break;
    }


    const modalSizeHandler = () => {
        setIsModalShrunk(!isModalShrunk)
    }
    useEffect(() => {
        getTargetData();
        getAssignedTarget();

    }, []);


    const getTargetData = useCallback(() => {
        axiosPrivateCall
            .get(`api/v1/targetControl/getHierarchyEmployeeData?employee_id=${userId}`)
            .then((res) => {


                const updatedBdeTargetData = res.data
                    .filter((employee) => employee.role === role2)
                    .map((item) => ({
                        assigned_to: item._id,
                        employee_id: item.employee_id,
                        name: item.first_name,
                        designation: item.role,
                        assigned_by:item.reports_to,
                        target: "",
                        contract: "",
                        fulltime: "",
                        revenue: "",
                        allocated_date: "",
                        accepted_date: "",
                        achieved: "",

                    }));

                setLeadTargetDAta(updatedBdeTargetData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [page, userId]);


    const getAssignedTarget = () => {
        axiosPrivateCall.get(`api/v1/targetControl/getTargetData?assignedToId=${userId}`)
            .then((res) => {
                setAmTargetData(res.data)
            })
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        const filterLeadData= LeadTargetDAta.filter(item => item.target !== "");
        const bdeResponse = await axiosPrivateCall.post("api/v1/targetControl/addTargetData",  filterLeadData);

        setLeadTargetDAta(bdeResponse.data);
        setIsModalOpen(!isModalOpen);


    };


    const dateHandler = (date, name, index) => {
        const timezoneOffset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (timezoneOffset * 60 * 1000));
        setLeadTargetDAta((prevData) => {
            const updatedData = [...prevData];
            updatedData[index][name] = date;
            return updatedData;
        });
    }


    const dropDownHandler = (item, index, name, role) => {
        const updatedTargetData = [...LeadTargetDAta];
        updatedTargetData[index][name] = item.text;

        const targetValue = updatedTargetData[index].target
        const contractValue = updatedTargetData[index].contract
        const fullTimeValue = updatedTargetData[index].fulltime
        const contract = parseInt(contractValue, 10) || 0;
        const fullTime = parseInt(fullTimeValue, 10) || 0;
        const calculatedRevenue = (contract * 1.25 + fullTime * 1).toFixed(2);
        updatedTargetData[index]["revenue"] = calculatedRevenue
        setLeadTargetDAta(updatedTargetData);

        const contractOptions = [];
        for (let i = 0; i <= targetValue; i++) {
            contractOptions.push({ key: i.toString(), text: i.toString() });
        }
        updatedTargetData[index]["contractOptions"] = contractOptions;
        const remainingValue = parseInt(targetValue) - parseInt(contractValue)

        const fulltimeOptions = [];
        for (let i = 0; i <= remainingValue; i++) {
            fulltimeOptions.push({ key: i.toString(), text: i.toString() });
        }
        updatedTargetData[index]["fulltimeOptions"] = fulltimeOptions;
    }


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    let minDate = new Date();

    return (
        <div>
            {
                <Popup
                    resetState={() => ""}
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            }
            <Modal scrollableContentClassName={styles.addcandidate_modal_scrollable_content} containerClassName={`${isModalShrunk ? styles.addcandidate_modal_container_shrunk : styles.addcandidate_modal_container}`}
                isOpen={isModalOpen}>
                <div className={styles.addcandidate_modal_header_container}>
                    <div className={styles.header_tag_expand_close_icon_container}>
                        <div className={styles.header_tag_container}>Add Target</div>

                        <div className={styles.header_expand_close_icon_container}>
                            <div
                                onClick={modalSizeHandler}
                                className={styles.header_expand_icon_container}
                            >
                                {isModalShrunk ? (
                                    <Icon iconName="FullScreen" className={contractIconClass} />
                                ) : (
                                    <Icon iconName="BackToWindow" className={contractIconClass} />
                                )}
                            </div>
                            <div
                                onClick={() => setShowPopup(!showPopup)} className={styles.header_close_icon_container}
                            >
                                <Icon iconName="ChromeClose" className={closeIconClass} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.header_content_container}>
                        <div className={styles.header_content_title_container}>
                            <div className={styles.header_content_save_container}>
                                <div className={styles.header_save_close_btns_container}>
                                    <PrimaryButton
                                        text={`Save & Close`}
                                        onClick={submitHandler}
                                        iconProps={{ iconName: "Save" }}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={styles.add_modal_main_container}>
                    <div>
                        <div className={styles.title_container}>
                            <div className={styles.title_name_container}>{firstTitle}</div>
                        </div>
                        <div className={styles.border}></div>
                        <div className={styles.empcontainer}>
                            <InfiniteScroll
                                dataLength={amTargetData.length}
                                style={{
                                    height: '34vh'
                                }}
                            >
                                <table className={styles.table_container}>
                                    <thead className={styles.Label_container}>
                                        <tr>
                                            <th className={styles.required_field}>Employee ID</th>
                                            <th className={styles.required_field}>AM Name</th>
                                            <th className={styles.required_field}>Designation</th>
                                            <th className={styles.required_field}>Target</th>
                                            <th className={styles.required_field}>Contract</th>
                                            <th className={styles.required_field}>Full Time</th>
                                            <th className={styles.required_field}>Revenue</th>
                                            <th className={styles.required_field}>Allocated date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {amTargetData &&
                                            amTargetData
                                                .filter((employee) => employee.designation === role1)
                                                .map((employee, index) => (
                                                    <tr key={index} className={styles.textFieldStyle}>
                                                        <td>
                                                            <div>
                                                                <TextField
                                                                    readOnly
                                                                    styles={textFieldStyles}
                                                                    value={employee.employee_id}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <TextField readOnly
                                                                    styles={textFieldStyles}
                                                                    value={employee.name}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <TextField readOnly
                                                                    styles={textFieldStyles}
                                                                    value={employee.designation}
                                                                />
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <div>
                                                                <TextField
                                                                    readOnly
                                                                    styles={textFieldStyles}
                                                                    value={employee.target}
                                                                />

                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <TextField
                                                                    readOnly
                                                                    styles={textFieldStyles}
                                                                    value={employee.contract}
                                                                />

                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <TextField
                                                                    readOnly
                                                                    styles={textFieldStyles}
                                                                    value={employee.fulltime}
                                                                />

                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <TextField
                                                                    readOnly
                                                                    styles={textFieldStyles}
                                                                    value={employee.revenue}

                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <TextField
                                                                    readOnly
                                                                    styles={textFieldStyles}
                                                                    value={formatDate(employee.allocated_date)}

                                                                />


                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </InfiniteScroll>
                        </div>
                    </div>


                    <div className={styles.title_container_bde}>
                        <div className={styles.title_name_container}>{secondTitle}</div>
                    </div>
                    <div className={styles.border}></div>
                    <div id="scrollableDiv" className={styles.table_containermain}>
                        <InfiniteScroll
                            dataLength={LeadTargetDAta.length}
                            style={{
                                height: '34vh'
                            }}
                        >
                            <table className={styles.table_container}>
                                <thead className={styles.Label_container}>
                                    <tr>
                                        <th className={styles.required_field}>Employee ID</th>
                                        <th className={styles.required_field}>AM Name</th>
                                        <th className={styles.required_field}>Designation</th>
                                        <th className={styles.required_field}>Target</th>
                                        <th className={styles.required_field}>Contract</th>
                                        <th className={styles.required_field}>Full Time</th>
                                        <th className={styles.required_field}>Revenue</th>
                                        <th className={styles.required_field}>Allocated date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {LeadTargetDAta &&
                                        LeadTargetDAta
                                            .filter((employee) => employee.designation === role2)
                                            .map((employee, index) => (
                                                <tr key={index} className={styles.textFieldStyle}>
                                                    <td>
                                                        <div>
                                                            <TextField
                                                                readOnly
                                                                styles={textFieldStyles}
                                                                value={employee.employee_id}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <TextField readOnly
                                                                styles={textFieldStyles}
                                                                value={employee.name}

                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <TextField readOnly
                                                                styles={textFieldStyles}
                                                                value={employee.designation}
                                                            />
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div>
                                                            <Dropdown

                                                                placeholder="Select"
                                                                styles={dropDownStyles}
                                                                options={dropDownValue}
                                                                onChange={(event, selectedItem) => {
                                                                    if (selectedItem) {
                                                                        dropDownHandler(selectedItem, index, "target", role2);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <Dropdown
                                                                placeholder="Select"
                                                                styles={dropDownStyles}
                                                                options={employee.contractOptions || []}
                                                                onChange={(event, selectedItem) => {
                                                                    if (selectedItem) {
                                                                        dropDownHandler(selectedItem, index, "contract", role2);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <Dropdown
                                                                placeholder="Select"
                                                                styles={dropDownStyles}
                                                                options={employee.fulltimeOptions || []}
                                                                onChange={(event, selectedItem) => {
                                                                    if (selectedItem) {
                                                                        dropDownHandler(selectedItem, index, "fulltime", role2);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <TextField
                                                                styles={textFieldStyles}
                                                                value={employee.revenue}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <DatePicker
                                                                minDate={minDate}
                                                                placeholder="DD/MM/YYYY"
                                                                styles={calendarClass}
                                                                value={LeadTargetDAta[index].allocated_date ? new Date(LeadTargetDAta[index].allocated_date) : null}
                                                                onSelectDate={(date) => dateHandler(date, 'allocated_date', index)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                </tbody>
                            </table>

                        </InfiniteScroll>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default AmTargetModal;