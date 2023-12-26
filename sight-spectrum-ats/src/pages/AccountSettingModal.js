import { useState, useEffect, useCallback } from "react";
import { Modal } from "@fluentui/react";
import styles from "./AccountSettingModal.module.css";
import { Icon } from "@fluentui/react/lib/Icon";
import { TextField, PrimaryButton, DatePicker } from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { mergeStyles, mergeStyleSets } from "@fluentui/react";
import { Popup } from "../components/Popup";
import { axiosPrivateCall } from "../constants";
import { useNavigate } from "react-router-dom";
import { toLowerCaseUnderScore } from "../utils/helpers";
import { generatePassword } from "../utils/generatePassword";
import { useConst } from "@fluentui/react-hooks";

const passIcon = { iconName: "Hide3" };

// regex
const nameInputRegex = /^[a-zA-Z0-9- '.\u00c0-\u024f\u1e00-\u1eff]*$/;
const panInputRegex = /^[a-zA-Z0-9]*$/;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const nameRegex = /^[A-Za-z]+$/;
const mobileRegex = /^[6-9]\d{9}$/;
const panNumberRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
const adhaarNumberRegex = /[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
const pincodeRegex = /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/;
const passRegex = /[A-Za-zÀ-ÖØ-öø-ÿ0-9~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/)]/;
const pinRegex = /^[1-9][0-9]{5}$/;
const pinInputRegex = /^[1-9]{1}[0-9]{0,5}$/;
const addressRegex = /^[a-zA-Z0-9 .,\/\\\-#&:()[\]]*$/;

const contractIconClass = mergeStyles({
  fontSize: 20,
  height: "20px",
  width: "20px",
  cursor: "pointer",
});

const closeIconClass = mergeStyles({
  fontSize: 16,
  height: "20px",
  width: "20px",
  cursor: "pointer",
});

const calendarClass = (props, currentHover, error, value) => {
  return {
    root: {
      "*": {
        width: "100%",
        fontSize: "12px !important",
        height: "22px !important",
        lineHeight: "20px !important",
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

    icon: { height: 10, width: 10, left: "85%", padding: "0px 0px" },
    statusMessage: { marginBottom: "-25px" },
  };
};

// const calendarClass = mergeStyleSets({
// 	root: {'*' : {width: '100%', fontSize: 12, height: '22px !important', lineHeight: '20px !important', borderColor:'rgba(255, 255, 255, 0.1) !important'}},
// 	icon: {height: 10, width: 10, left: '85%', padding: '0px 0px', color:'white'},
// 	fieldGroup:{border:'0.5px solid grey !important'},
// 	statusMessage:{marginBottom:'-25px'},
// });

const calendarClassActive = mergeStyleSets({
  root: {
    "*": {
      width: "100%",
      fontSize: 12,
      height: "22px !important",
      lineHeight: "20px !important",
      borderColor: "grey !important",
    },
  },
  icon: { height: 10, width: 10, left: "85%", padding: "0px 0px" },
  fieldGroup: { border: "0.5px solid grey !important" },
  statusMessage: { marginBottom: "-25px" },
});

const calendarErrorClass = mergeStyleSets({
  root: {
    "*": {
      width: "100%",
      fontSize: 12,
      height: "22px !important",
      lineHeight: "20px !important",
      borderColor: "#a80000",
    },
  },
  icon: {
    height: 10,
    width: 10,
    left: "85%",
    padding: "0px 0px",
    color: "#a80000",
  },
  fieldGroup: { border: "0.5px solid #a80000 !important" },
  statusMessage: { marginBottom: "-25px" },
});

const dropDownStylesActive = (props, currentHover, error, value) => {
  return {
    dropdown: { minWidth: "160px", minHeight: "20px" },
    title: {
      height: "22px",
      lineHeight: "18px",
      fontSize: "12px",
      backgroundColor: "#EDF2F6",
      borderColor: error
        ? "#a80000"
        : currentHover === value
        ? "rgb(96, 94, 92)"
        : "transparent",
    },
    caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
    dropdownItem: { minHeight: "22px", fontSize: 12 },
    dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
  };
};

const dropDownStylesReporting = (props, currentHover, error, value) => {
  return {
    dropdown: { minWidth: "160px", minHeight: "20px" },
    title: {
      height: "22px",
      lineHeight: "18px",
      fontSize: "12px",
      cursor: `${props.disabled ? "not-allowed" : ""}`,
      backgroundColor: "#EDF2F6",
      borderColor: error
        ? "#a80000"
        : currentHover === value
        ? "rgb(96, 94, 92)"
        : "transparent",
    },
    caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
    dropdownItem: { minHeight: "22px", fontSize: 12 },
    dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
  };
};

const dropDownStyles = (props, currentHover, error, value) => {
  return {
    dropdown: { minWidth: "160px", minHeight: "20px" },
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
    dropdownItem: { minHeight: "22px", fontSize: 12 },
    dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
  };
};

const dropDownStyles1 = mergeStyleSets({
  dropdown: { minWidth: "160px", minHeight: "20px" },
  title: {
    height: "22px",
    lineHeight: "18px",
    fontSize: "12px",
    border: "0.5px solid transparent",
    backgroundColor: "#EDF2F6",
  },
  caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
  caretDown: { color: "transparent" },
  dropdownItem: { minHeight: "22px", fontSize: 12 },
  dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
});

const dropDownErrorStyles = mergeStyleSets({
  dropdown: { minWidth: "160px", minHeight: "20px" },
  title: {
    height: "22px",
    lineHeight: "18px",
    fontSize: "12px",
    border: "0.5px solid #a80000",
  },
  caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
  dropdownItem: { minHeight: "22px", fontSize: 12 },
  dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
});

const toggleStyles = mergeStyleSets({
  root: { marginBottom: "0px" },
  label: {
    fontSize: "12px",
    fontWeight: 400,
    padding: "0px 0px 10px 0px",
    minWidth: "150px",
  },
});

const textField = (props, currentHover, error, value) => {
  return {
    fieldGroup: {
      height: "22px",
      width: "100%",
      borderColor: error ? "#a80000" : "transparent",
      selectors: {
        ":focus": {
          borderColor: "rgb(96, 94, 92)",
        },
      },
    },
    field: { lineHeight: "24px", fontSize: 12 },
  };
};

const dropDownRole = [
  { key: "admin", text: "Admin" },
  { key: "bde", text: "BDE" },
  { key: "account_manager", text: "Account Manager" },
  { key: "team_lead", text: "Team Lead" },
  { key: "recruiter", text: "Recruiter" },
];

const hierarchyReportingInRole = {
  admin: "admin",
  bde: "admin",
  account_manager: "bde",
  team_lead: "account_manager",
  recruiter: "team_lead",
};

const dropDownJobRole = [
  { key: "Founder", text: "Founder" },
  { key: "Head - IND", text: "Head - IND" },
  { key: "Head - UAE", text: "Head - UAE" },
  { key: "Head - US", text: "Head - US" },
  { key: "Senior Account Manager", text: "Senior Account Manager" },
  { key: "Business Development Manager", text: "Business Development Manager" },
  { key: "Account Manager", text: "Account Manager" },
  { key: "Business Executives", text: "Business Executives" },
  { key: "Account Lead", text: "Account Lead" },
  { key: "Team Lead", text: "Team Lead" },
  { key: "Recruiters", text: "Recruiters" },
  { key: "Support Team", text: "Support Team" },
];

const dropDownStatus = [
  { key: "Active", text: "Active" },
  { key: "Inactive", text: "Inactive" },
];

const dropDownLocation = [
  { key: "Chennai - MEPZ", text: "Chennai - MEPZ" },
  { key: "Chennai - Guindy", text: "Chennai - Guindy" },
  { key: "Chennai - Tidel Park", text: "Chennai - Tidel Park" },
  { key: "Thanjavur", text: "Thanjavur" },
];

const dropDownMaritalStatus = [
  { key: "Single", text: "Single" },
  { key: "Married", text: "Married" },
  { key: "Divorced", text: "Divorced" },
  { key: "Widow", text: "Widow" },
  { key: `I don't want to day`, text: `I don't want to say` },
];

const dropDownGender = [
  { key: "Male", text: "Male" },
  { key: "Female", text: "Female" },
  { key: "Others", text: "Others" },
];

const AccountSettingModal = (props) => {
  let isModalOpen = props.isModalOpen;
  const setIsModalOpen = props.setIsModalOpen;
  const [isModalShrunk, setIsModalShrunk] = useState(false);
  const [autoGeneratePass, setAutoGeneratePass] = useState(false);
  const [reportsToList, setReportsToList] = useState([]);
  const token = localStorage.getItem("token");
  let base64Url = token.split(".")[1];
  let decodedValue = JSON.parse(window.atob(base64Url));
  const [employeeId, setEmployeeId] = useState(decodedValue.user_id);

  function modalSizeHandler() {
    setIsModalShrunk(!isModalShrunk);
  }

  const initialValues = {
    role: "",
    jobRole: "",
    status: "",
    reportsTo: "",
    location: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dateOfHire: "",
    dateOfJoin: "",
    dateOfBirth: "",
    maritalStatus: "",
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    gender: "",
    panNumber: "",
    adhaarNumber: "",
    password: "",
  };

  const sanitizeObject = {
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
    mobile: "mobile_number",
    dateOfHire: "date_of_hire",
    dateOfJoin: "date_of_joining",
    dateOfBirth: "date_of_birth",
    maritalStatus: "marital_Status",
    gender: "gender",
    address1: "address_line_1",
    address2: "address_line_2",
    city: "city",
    pincode: "pincode",
    panNumber: "pan_number",
    adhaarNumber: "aadhaar_number",
    password: "password_hash",
    role: "role",
    reportsTo: "reports_to",
    status: "status",
    jobRole: "job_role",
    location: "location",
  };

  const getReportsToEmployees = (role) => {
    axiosPrivateCall
      .get(`/api/v1/employee/getHierarchyList?type=${role}`)
      .then((res) => {
        let employeeList = res.data;
        employeeList = employeeList.map((employee) => {
          return {
            key: employee._id,
            text: employee.first_name + "" + employee.last_name,
          };
        });
        setReportsToList(employeeList);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const roleHandler = (e, item, key) => {
    dropDownHandler(e, item, key);
    fieldsSet(e, item);
    fieldsChecks();
    setCurrentHover("");
    getReportsToEmployees(
      hierarchyReportingInRole[toLowerCaseUnderScore(item.text)]
    );
  };

  const reportsToHandler = (e, item) => {
    dropDownRoleHandler(e, item, "reportsTo");
  };

  const dropDownRoleHandler = (e, item, name) => {
    console.log(item, name);
    setEmployeeData({
      ...employeeData,
      [name]: item.key,
    });

    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const sanitizer = (data) => {
    const sanitizedData = {};
    Object.keys(data).forEach((key) => {
      if (key === "reportsTo" && data["role"] === "admin") return;
      if (key === "reportsTo" && data["role"] === "account_manager") return;
      sanitizedData[sanitizeObject[key]] = data[key];
    });

    sanitizedData["_id"] = decodedValue.user_id;

    return sanitizedData;
  };

  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  const sanitizeApiData = (data) => {
    const sanitizedData = {};
    console.log(data);

    Object.keys(data).forEach((value) => {
      if (value === "reports_to") {
        const reportToObj = {
          key: data["reports_to"]["_id"],
          text:
            data["reports_to"]["first_name"] +
            "" +
            data["reports_to"]["last_name"],
        };

        sanitizedData["reportsTo"] = reportToObj.key;
        setReportsToList([reportToObj]);
        return;
      }

      if (getKeyByValue(sanitizeObject, value)) {
        sanitizedData[getKeyByValue(sanitizeObject, value)] = data[value];
      }
    });

    return sanitizedData;
  };

  const [employeeData, setEmployeeData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  const [currentHover, setCurrentHover] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axiosPrivateCall(
      `api/v1/employee/getEmployeeDetails?employee_id=${decodedValue.user_id}`
    )
      .then((res) => {
        console.log(sanitizeApiData(res.data));

        setEmployeeData(sanitizeApiData(res.data));
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const navigateTo = useNavigate();

  const hoverHandler = (name) => {
    setCurrentHover(name);
  };

  const dropDownHandler = (e, item, name) => {
    setEmployeeData({
      ...employeeData,
      [name]: item.text,
    });

    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const dateHandler = (date, name) => {
    setEmployeeData({
      ...employeeData,
      [name]: date,
    });

    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const inputChangeHandler = (e, name) => {
    const { value } = e.target;
    let inputValue = value;

    let isNameValid = false;

    if (name === "firstName" && nameInputRegex.test(inputValue)) {
      if (inputValue.length > 40) inputValue = inputValue.slice(0, 40);
      isNameValid = true;
    }

    if (name === "lastName" && nameInputRegex.test(inputValue)) {
      if (inputValue.length > 40) inputValue = inputValue.slice(0, 40);
      isNameValid = true;
    }

    if (name === "email") {
      if (inputValue.length > 320) inputValue = inputValue.slice(0, 320);
      isNameValid = true;
    }

    if (name === "mobile" && (inputValue === "" || !isNaN(inputValue))) {
      if (inputValue.length > 10) inputValue = inputValue.slice(0, 10);
      isNameValid = true;
    }

    if (name === "panNumber" && panInputRegex.test(inputValue)) {
      if (inputValue.length > 10) inputValue = inputValue.slice(0, 10);
      isNameValid = true;
    }

    if (name === "adhaarNumber" && (inputValue === "" || !isNaN(inputValue))) {
      if (inputValue.length > 12) inputValue = inputValue.slice(0, 12);
      isNameValid = true;
    }

    if (name === "address1" && addressRegex.test(inputValue)) {
      isNameValid = true;
    }

    if (name === "address2" && addressRegex.test(inputValue)) {
      isNameValid = true;
    }

    if (name === "city") {
      isNameValid = true;
    }

    if (
      name === "pincode" &&
      (inputValue === "" || !isNaN(inputValue)) &&
      (pinInputRegex.test(inputValue) || inputValue === "") &&
      inputValue.length < 7
    ) {
      isNameValid = true;
    }

    if (
      !autoGeneratePass &&
      name === "password" &&
      (passRegex.test(inputValue) || inputValue === "")
    ) {
      if (inputValue.length > 64) {
        inputValue = inputValue.slice(0, 64);
      }
      isNameValid = true;
    }

    if (isNameValid) {
      setEmployeeData({
        ...employeeData,
        [name]: inputValue,
      });

      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  function submitHandler(e) {
    e.preventDefault();

    const errors = validate(employeeData);
    console.log(
      errors,
      Object.keys(errors).length === 0,
      Object.keys(errors).length
    );
    if (Object.keys(errors).length === 0) {
      axiosPrivateCall
        .post("/api/v1/employee/updateEmployee", sanitizer(employeeData))
        .then((res) => {
          console.log(res);
          console.log(employeeData);
          submitForm();
        })
        .catch((e) => {
          console.log(e);
        });

      console.log(sanitizer(employeeData));
    } else {
      setErrors(errors);
    }
  }

  function validate(values) {
    const errors = {};

    if (!values.role) {
      errors.role = "Required";
    }

    if (!values.jobRole) {
      errors.jobRole = "Required";
    }

    if (values.role !== "admin" && values.role !== "account_manager") {
      if (!values.reportsTo) {
        errors.reportsTo = "Required";
      }
    }

    if (!values.status) {
      errors.status = "Required";
    }

    if (!values.location) {
      errors.location = "Required";
    }

    if (!values.firstName) {
      errors.firstName = "Required";
    } else if (!nameInputRegex.test(values.firstName)) {
      errors.firstName = "Invalid name";
    }

    if (!values.lastName) {
      errors.lastName = "Required";
    } else if (!nameInputRegex.test(values.lastName)) {
      errors.lastName = "Invalid name";
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Invalid Email Id";
    }

    if (!values.mobile) {
      errors.mobile = "Required";
    } else if (!mobileRegex.test(values.mobile)) {
      errors.mobile = "Invalid Mobile Number";
    }

    if (!values.dateOfHire) {
      errors.dateOfHire = "Required";
    }

    if (!values.dateOfJoin) {
      errors.dateOfJoin = "Required";
    }

    if (!values.dateOfBirth) {
      errors.dateOfBirth = "Required";
    }

    if (!values.maritalStatus) {
      errors.maritalStatus = "Required";
    }

    if (!values.gender) {
      errors.gender = "Required";
    }

    if (!values.address1) {
      errors.address1 = "Required";
    }

    if (!values.address2) {
      errors.address2 = "Required";
    }

    if (!values.city) {
      errors.city = "Required";
    }

    if (!values.pincode) {
      errors.pincode = "Required";
    } else if (!pinRegex.test(values.pincode)) {
      errors.pincode = "Invalid Pincode";
    }

    // if (!values.adhaarNumber) {
    //   errors.adhaarNumber = "Required";
    // } else if (!adhaarNumberRegex.test(values.adhaarNumber)) {
    //   errors.adhaarNumber = "Invalid Aadhaar Number";
    // }

    // if (!values.panNumber) {
    //   errors.panNumber = "Required";
    // } else if (!panNumberRegex.test(values.panNumber)) {
    //   errors.panNumber = "Invalid Pan Number";
    // }

    if (values.adhaarNumber) {
      if (!adhaarNumberRegex.test(values.adhaarNumber)) {
        errors.adhaarNumber = "Invalid Aadhaar Number";
      }
    }

    if (values.panNumber) {
      if (!panNumberRegex.test(values.panNumber)) {
        errors.panNumber = "Invalid Pan Number";
      }
    }

    // if(!values.password)
    //     {
    //         errors.password = 'Required'
    //     } else if(values.password.length <8 || values.password.length >64 ) {
    //         errors.password = 'Invalid Password'
    //     } else if(!passRegex.test(values.password)) {
    //         errors.password = 'Invalid Password'
    //     }

    return errors;
  }

  function fieldsChecks() {
    // let employeeDataArr = Object.values(employeeData);
    // let employeeDataFiltered = employeeDataArr.filter(i => i !== "");
    // if (employeeDataFiltered.length === (fieldRequired - 1))
    // {
    // 	setIsSaveVisible(false);
    // };
  }

  function fieldsSet(e, item) {
    if (item.text === "Admin") {
      setEmployeeData((prevState) => {
        return {
          ...prevState,
          reportsTo: "NaN",
        };
      });
    } else {
      setEmployeeData((prevState) => {
        return {
          ...prevState,
          reportsTo: "",
        };
      });
    }
  }
  // REPUSH

  function closeHandler() {
    setShowPopup(!showPopup);
  }

  function submitForm() {
    resetState();
    navigateTo("/employee/manageemployee");
    setIsModalOpen(false);
  }

  const escKeyHandler = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      // Optionally, you can add your close logic here
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      escKeyHandler(event);
    };
  
    document.addEventListener('keydown', handleKeyDown, { capture: true });
  
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);
  

  useEffect(() => {
    if (autoGeneratePass) {
      setEmployeeData((prevState) => {
        return {
          ...prevState,
          password: generatePassword(),
        };
      });
    } else {
      setEmployeeData((prevState) => {
        return {
          ...prevState,
          password: "",
        };
      });
    }
  }, [autoGeneratePass]);

  window.addEventListener("beforeunload", function (e) {
    // Cancel the event
    e.returnValue = "Are you sure?";
  });
  window.addEventListener("unload", function (e) {
    // Cancel the event
    axiosPrivateCall.post('/api/v1/employee/logoutEmployee',{}).then((res)=>{console.log(res); localStorage.removeItem("token"); }).catch(e=>console.log(e))
  });

  return (
    <div>
      {
        <Popup
          resetState={resetState}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      }

      <Modal
        scrollableContentClassName={styles.addemployee_modal_scrollable_content}
        containerClassName={
          isModalShrunk
            ? styles.addemployee_modal_container_shrunk
            : styles.addemployee_modal_container
        }
        isOpen={isModalOpen}
      >
        <form>
          <div className={styles.addemployee_modal_header_container}>
            <div className={styles.header_tag_expand_close_icon_container}>
              <div className={styles.header_tag_container}>
                Account Settings
              </div>

              <div className={styles.header_expand_close_icon_container}>
                <div
                  onClick={modalSizeHandler}
                  className={styles.header_expand_icon_container}
                >
                  {isModalShrunk ? (
                    <Icon iconName="FullScreen" className={contractIconClass} />
                  ) : (
                    <Icon
                      iconName="BackToWindow"
                      className={contractIconClass}
                    />
                  )}
                </div>

                <div
                  onClick={() => closeHandler()}
                  className={styles.header_close_icon_container}
                >
                  <Icon iconName="ChromeClose" className={closeIconClass} />
                </div>
              </div>
            </div>

            <div className={styles.header_content_container}>
              <div className={styles.header_content_title_role_container}>
                <div className={styles.header_content_role_save_container}>
                  <div className={styles.main_role_dropdown_container}>
                    <div className={styles.header_content_title_container}>
                      {employeeData.firstName} {employeeData.lastName}
                    </div>
                  </div>

                  <div
                    className={styles.header_employeeid_save_close_container}
                  >
                    <div className={styles.header_save_close_btns_container}>
                      <PrimaryButton
                        text={`Save & Close`}
                        iconProps={{ iconName: "Save" }}
                        disabled={isSaveVisible}
                        onClick={submitHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.addemployee_modal_main_container}>
            <div className={styles.main_filter_options_container}>
              <div className={styles.subcontainer}>
                <div className={styles.main_dropdown_container}>
                  <div className={styles.main_repotingmanager_title}>
                    Employee ID
                  </div>
                  <div
                    id="employeeID"
                    onClick={() => hoverHandler("employeeID")}
                  >
                    <TextField
                      type="text"
                      name="employeeID"
                      value={decodedValue.employee_id}
                      disabled
                      className={styles.loc_dropdown_teamlead}
                      styles={(props) =>
                        textField(props, currentHover, errors._id, "employeeID")
                      }
                    />
                  </div>
                </div>
              </div>

              <div className={styles.subcontainer}>
                <div className={styles.main_dropdown_container}>
                  <div className={styles.main_teamlead_title}>Reports To</div>
                  <div id="reportsTo" onClick={() => hoverHandler("reportsTo")}>
                    <Dropdown
                      placeholder="Select"
                      styles={(props) =>
                        dropDownStylesReporting(
                          props,
                          currentHover,
                          errors.reportsTo,
                          "reportsTo"
                        )
                      }
                      options={reportsToList}
                      selectedKey={employeeData.reportsTo}
                      disabled={
                        !employeeData.role ||
                        employeeData.role === "admin" ||
                        employeeData.role === "account_manager"
                      }
                      className={styles.loc_dropdown_teamlead}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.main_information_container}>
              <div className={styles.main_basic_information_container}>
                <div className={styles.main_basic_information_title}>
                  BASIC INFORMATION
                </div>

                <div
                  className={styles.main_basic_information_content_container}
                >
                  <div className={styles.main_from_field}>
                    <div className={styles.main_sub_from_field}>
                      <div>First Name</div>
                      <div onClick={() => setCurrentHover("firstName")}>
                        <TextField
                          type="text"
                          name="firstName"
                          disabled
                          value={employeeData.firstName}
                          errorMessage={errors.firstName}
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              errors.firstName,
                              "firstName"
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Last Name</div>
                      <div onClick={() => setCurrentHover("lastName")}>
                        <TextField
                          type="text"
                          name="lastName"
                          disabled
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              errors.lastName,
                              "lastName"
                            )
                          }
                          value={employeeData.lastName}
                          errorMessage={errors.lastName}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Designation</div>
                      <div onClick={() => setCurrentHover("lastName")}>
                        <TextField
                          type="text"
                          name="lastName"
                          disabled
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              errors.lastName,
                              "lastName"
                            )
                          }
                          value={employeeData.jobRole}
                          errorMessage={errors.lastName}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Email ID</div>
                      <div onClick={() => setCurrentHover("email")}>
                        <TextField
                          type="text"
                          name="email"
                          disabled
                          errorMessage={errors.email}
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              errors.email,
                              "email"
                            )
                          }
                          value={employeeData.email}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Date of hire</div>
                      <div
                        id="dateOfHire"
                        onClick={() => hoverHandler("dateOfHire")}
                      >
                        <DatePicker
                          placeholder="DD/MM/YYYY"
                          disabled
                          styles={(props) =>
                            calendarClass(
                              props,
                              currentHover,
                              errors.dateOfHire,
                              "dateOfHire"
                            )
                          }
                          value={new Date(employeeData.dateOfHire)}
                        />
                      </div>
                      <div className={styles.errorfield}>
                        {errors.dateOfHire}
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Date of Joining</div>
                      <div
                        id="dateOfJoin"
                        onClick={() => hoverHandler("dateOfJoin")}
                      >
                        <DatePicker
                          placeholder="DD/MM/YYYY"
                          disabled
                          styles={(props) =>
                            calendarClass(
                              props,
                              currentHover,
                              errors.dateOfJoin,
                              "dateOfJoin"
                            )
                          }
                          value={new Date(employeeData.dateOfJoin)}
                        />
                      </div>
                      <div className={styles.errorfield}>
                        {errors.dateOfJoin}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.main_personal_information_container}>
                <div className={styles.main_personal_information_title}>
                  PERSONAL DETAILS
                </div>

                <div
                  className={styles.main_personal_information_content_container}
                >
                  <div className={styles.main_from_field}>
                    <div className={styles.main_sub_from_field}>
                      <div>Date of Birth</div>
                      <div
                        id="dateOfBirth"
                        onClick={() => hoverHandler("dateOfBirth")}
                      >
                        <DatePicker
                          placeholder="DD/MM/YYYY"
                          onSelectDate={(date) => {
                            dateHandler(date, "dateOfBirth");
                            fieldsChecks();
                            setCurrentHover("");
                          }}
                          styles={(props) =>
                            calendarClass(
                              props,
                              currentHover,
                              errors.dateOfBirth,
                              "dateOfBirth"
                            )
                          }
                          value={
                            employeeData.dateOfBirth
                              ? new Date(employeeData.dateOfBirth)
                              : null // Set value to null if date is not available or not set
                          }
                        />
                      </div>
                      <div className={styles.errorfield}>
                        {errors.dateOfBirth}
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Marital Status</div>
                      <div
                        id="maritalStatus"
                        onClick={() => hoverHandler("maritalStatus")}
                        className={
                          employeeData.maritalStatus ||
                          errors.maritalStatus ||
                          currentHover === "maritalStatus"
                            ? styles.showfield
                            : styles.hidefield
                        }
                      >
                        <Dropdown
                          placeholder="select an option"
                          options={dropDownMaritalStatus}
                          onChange={(e, item) => {
                            dropDownHandler(e, item, "maritalStatus");
                            fieldsChecks();
                            setCurrentHover("");
                          }}
                          errorMessage={errors.maritalStatus}
                          styles={(props) =>
                            dropDownStyles(
                              props,
                              currentHover,
                              errors.maritalStatus,
                              "maritalStatus"
                            )
                          }
                          selectedKey={employeeData.maritalStatus}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field_gender}>
                      <div>Gender</div>
                      <div
                        id="gender"
                        onClick={() => hoverHandler("gender")}
                        className={
                          employeeData.gender ||
                          errors.gender ||
                          currentHover === "gender"
                            ? styles.showfield
                            : styles.hidefield
                        }
                      >
                        <Dropdown
                          placeholder="select an option"
                          options={dropDownGender}
                          onChange={(e, item) => {
                            dropDownHandler(e, item, "gender");
                            fieldsChecks();
                            setCurrentHover("");
                          }}
                          errorMessage={errors.gender}
                          styles={(props) =>
                            dropDownStyles(
                              props,
                              currentHover,
                              errors.gender,
                              "gender"
                            )
                          }
                          selectedKey={employeeData.gender}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Mobile Number</div>
                      <div onClick={() => setCurrentHover("mobile")}>
                        <TextField
                          type="text"
                          name="mobile"
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              errors.mobile,
                              "mobile"
                            )
                          }
                          errorMessage={errors.mobile}
                          onChange={(e) => {
                            inputChangeHandler(e, "mobile");
                            fieldsChecks();
                          }}
                          value={employeeData.mobile}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>City</div>
                      <div>
                        <TextField
                          type="text"
                          name="city"
                          styles={(props) =>
                            textField(props, currentHover, errors.city, "city")
                          }
                          onChange={(e) => {
                            inputChangeHandler(e, "city");
                            fieldsChecks();
                          }}
                          value={employeeData.city}
                          errorMessage={errors.city}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Pincode</div>
                      <div>
                        <TextField
                          type="text"
                          name="pincode"
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              errors.pincode,
                              "pincode"
                            )
                          }
                          onChange={(e) => {
                            inputChangeHandler(e, "pincode");
                            fieldsChecks();
                          }}
                          value={employeeData.pincode}
                          errorMessage={errors.pincode}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.main_from_field}>
                    <div className={styles.main_sub_from_field}>
                      <div>Address Line 1</div>
                      <div onClick={() => setCurrentHover("address1")}>
                        <TextField
                          type="text"
                          name="address1"
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              errors.city,
                              "address1"
                            )
                          }
                          onChange={(e) => {
                            inputChangeHandler(e, "address1");
                            fieldsChecks();
                          }}
                          value={employeeData.address1}
                          errorMessage={errors.address1}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Address Line 2</div>
                      <div onClick={() => setCurrentHover("address2")}>
                        <TextField
                          type="text"
                          name="address2"
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              errors.city,
                              "address2"
                            )
                          }
                          onChange={(e) => {
                            inputChangeHandler(e, "address2");
                            fieldsChecks();
                          }}
                          value={employeeData.address2}
                          errorMessage={errors.address2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );

  function resetState() {
    setErrors({});
    // setIsSaveVisible(true);
    setCurrentHover("");
    setAutoGeneratePass(false);
  }
};
export default AccountSettingModal;
