import { useState, useEffect, useCallback } from "react";
import { Toggle } from "@fluentui/react/lib/Toggle";
import styles from "./AddEmployeeModal.module.css";
import { TextField, PrimaryButton, DatePicker } from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { mergeStyles, mergeStyleSets } from "@fluentui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { generatePassword } from "../utils/generatePassword";
import { axiosPrivateCall, axiosJsonCall } from "../constants";
import { toLowerCaseUnderScore } from "../utils/helpers";
import { Label } from "@fluentui/react/lib/Label";
import {isEmpty} from "../utils/validation";
import ComboBox from '../components/ComboBox/ComboBox';

const passIcon = { iconName: "Hide3" };

// regex
const nameInputRegex = /^[a-zA-Z\u00c0-\u024f\u1e00-\u1eff]*$/;
const panInputRegex = /^[a-zA-Z0-9]*$/;
const cityRegex = /^[a-zA-Z0-9\s]*$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+(in|com|org)))$/; 
const nameRegex = /^[A-Za-z]+$/;
const mobileRegex = /^[6-9]\d{9}$/;
const panNumberRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
const adhaarNumberRegex = /[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
const pincodeRegex = /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/;
const passRegex = /[A-Za-zÀ-ÖØ-öø-ÿ0-9~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/)]/;
const passwordRegex = /[A-Za-zÀ-ÖØ-öø-ÿ0-9~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/)]/;
// password Validation /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
const pinRegex = /^[1-9][0-9]{5}$/;
const pinInputRegex = /^[1-9]{1}[0-9]{0,5}$/;
const addressRegex = /^[a-zA-Z0-9 .,\/\\\-#&:()[\]]*$/;

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

const hierarchyReportingInRole = {
  admin: "admin",
  bde: "admin",
  account_manager: "bde",
  team_lead: "account_manager",
  recruiter: "team_lead",
};
const textfieldStyle=(props, currentHover, error, value) => {
  return {
    fieldGroup: {
      height: "22px",
      width: "100%",
      backgroundColor: "#EDF2F6",
      borderColor: error
        ? "#a80000"
        : currentHover === value
        ? "rgb(96, 94, 92)"
        : "transparent",
      selectors: {
        ":focus": {
          borderColor: "rgb(96, 94, 92)",
        },
      },
    },
    field: { lineHeight: "24px", fontSize: 12 },
  };}
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

// const reportsToList =  [
// 	{ key: 'Bruce Wayne', text: 'Bruce Wayne' },
// 	{ key: 'Tommy Shelby', text: 'Tommy Shelby' },
// ];

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

const EditEmployee = () => {
  const [autoGeneratePass, setAutoGeneratePass] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [reportsToList, setReportsToList] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [dropDownCities, setDropDownCities] = useState([]);

  const initialValues = {
    employee_id:"",
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
    demandCreator: false
  };

  const sanitizeObject = {
    employee_id:"employee_id",
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
    demandCreator: "demand_creator"
  };
  function handleToggle(ev, checked) {
    setToggle(checked);
    setEmployeeData({
      ...employeeData,
      demandCreator : checked,
    });
  }

  useEffect(() => {

    axiosJsonCall
    .get("/b/643fa67bebd26539d0ae2903")
    .then((res) => {
      let buffer = res.data.record;
      let dropdown_data = buffer.map((obj) => {return {key: obj.name , text: obj.name}});
      setDropDownCities(dropdown_data)
    })
    .catch((e) => {});

  },[])

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

    sanitizedData["_id"] = searchParams.get("employee_id");

    return sanitizedData;
  };

  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
 
  const sanitizeApiData = (data) => {
    const sanitizedData = {};
    console.log(data);
    setToggle(data.demand_creator)
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
      `api/v1/employee/getEmployeeDetails?employee_id=${searchParams.get(
        "employee_id"
      )}`
    )
      .then((res) => {
        console.log(sanitizeApiData(res.data));
        setEmployeeId(res.data.employee_id);
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
      [name]: item.key,
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
    if (name === "employee_id" && (inputValue === "" || !isNaN(inputValue))) {
      isNameValid = true;
    }
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
    if (name === "city" && cityRegex.test(inputValue)) {
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
//Error Handling 
const employeeDataError=(obj)=> {
  const errors = {};
  
  Object.keys(obj).map((key) => {
  let dateofhire=obj.dateOfHire.toString();
  let dateofjoin=obj.dateOfJoin.toString();
if(key==='password'){
  console.log(passwordRegex.test(obj[key]))
  if(!passwordRegex.test(obj[key])){
  return (errors[key] = "Invalid password");
  }
}
if(key==='email'){
  if(!emailRegex.test(obj[key])){
    return (errors[key] = "Invalid Email Id");
  }
}
if(key==='mobile'){
  if(!mobileRegex.test(obj[key])){
    return (errors[key] = "Invalid Mobile Number");
  }
}
   if(key==="dateOfJoin"){
    if(new Date(dateofhire)>new Date(dateofjoin)){
      return(errors[key]="can't be greater then date of hire")
  }}
   if (isEmpty(obj[key])) {
      return (errors[key] = "Required");
    } else {
      return (errors[key] = "");
    }
  })

  return errors;
}


// //Create Employee
// const createEmployee=()=>{
//  axiosPrivateCall 
//  .post("/api/v1/employee/updateEmployee", sanitizer(employeeData))
//   .then((res) => {
//     console.log(res);
//     console.log(employeeData);
//     submitForm();
//   })
//   .catch((error) => {
//     console.log(e)
    
//         if (error.response.data === "Employee with the same email already exists.") {
//       setErrors({
//         ...errors,
//         email: "Already exist",
//       });
//     } 
//   } else {
//     setErrors(errors);
//   });

// console.log(sanitizer(employeeData));
// }
//Create Employee
const createEmployee = () => {
  axiosPrivateCall
    .post("/api/v1/employee/updateEmployee", sanitizer(employeeData))
    .then((res) => {
      console.log(res);
      console.log(employeeData);
      submitForm();
    })
    .catch((error) => {
      console.log(error); 

      if (
        error.response &&
        error.response.data === "Employee with the same email already exists."
      ) {
        setErrors({
          ...errors,
          email: "Already exist",
        });
      } else {
        setErrors(errors); 
      }
    });

  console.log(sanitizer(employeeData));
};


function submitHandler(e) {
  e.preventDefault();

  const errors =  employeeDataError(employeeData);
  console.log(errors)
  setErrors(errors);
  if (isEmployeeDataValid(employeeData)) {
    console.log("valid");
    createEmployee();
  } else {
    console.log("not valid");
  }
}

//To remove unwanted required field 
const isEmployeeDataValid = (obj) => {
  const excludedFields = [
    "role",
    "status",
    "jobRole",
    "location",
    "employee_id",
    "firstName",
    "lastName",
    "mobile",
    "email",
    "dateOfHire",
    "dateOfJoin",
  ];

  for (const [key, value] of Object.entries(obj)) {
    console.log(obj[key])
    if (!excludedFields.includes(key)) {
      continue; // skip validation for excluded fields
    }
    let dateofhire=obj.dateOfHire.toString();
    let dateofjoin=obj.dateOfJoin.toString();
  if(key==='password'){
  
    if(!passwordRegex.test(obj[key])){
      return false;
    }
  }
  if(key==='email'){
    if(!emailRegex.test(obj[key])){
      return false;
    }
  }
  if(key==='mobile'){
    if(!mobileRegex.test(obj[key])){
      return false;
    }
  }
     if(key==="dateOfJoin"){
      if(new Date(dateofhire)>new Date(dateofjoin)){
        return false;
    }}
 
    if (isEmpty(value)) {
      return false;
    }
  }
  return true;
};

 

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

  function closeHandler() {
    setShowPopup(!showPopup);
  }

  function submitForm() {
    resetState();
    navigateTo("/employee/manageemployee");
    // setIsModalOpen(false);
  }

  const escKeyHandler = (event) => {
    if (event.key === "Escape") {
      closeHandler();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escKeyHandler, { capture: true });
    return () => {
      document.removeEventListener("keydown", escKeyHandler, { capture: true });
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
  let minDate = new Date(employeeData.dateOfHire)
  return (
    <div className={styles.pages}>
      <form>
        <div className={styles.addemployee_modal_header_container}>
          <div className={styles.header_tag_expand_close_icon_container}>
            <div className={styles.header_tag_container}>Employee</div>
          </div>

          <div className={styles.header_content_container}>
            <div className={styles.header_content_title_role_container}>
              {/* <div className={styles.header_content_title_container}>
                Employee Id : {employeeId ? employeeId : ""}
              </div> */}

              <div className={styles.header_content_role_save_container}>
                <div className={styles.main_role_dropdown_container}>
                  <div className={styles.main_role_title}>
                    <Label className={styles.required_field} required>ROLE</Label>
                  </div>
                  <div onClick={() => hoverHandler("role")}>
                    <Dropdown
                      placeholder="Select Role"
                      selectedKey={toLowerCaseUnderScore(employeeData.role)}
                      styles={(props) =>
                        dropDownStyles(props, currentHover, errors.role, "role")
                      }
                      onChange={(e, item) => roleHandler(e, item, "role")}
                      options={dropDownRole}
                    />
                  </div>
                </div>

                <div className={styles.header_employeeid_save_close_container}>
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
                  <div className={styles.main_teamlead_title}>
                    <Label className={styles.required_field} required>Employee Id</Label>
                 </div>
                  <div id="employee_id" onClick={() => hoverHandler("employee_id")}>
                    <TextField
                     disabled
                    name="employee_id"
                      styles={(props) =>
                        textfieldStyle(
                          props,
                          currentHover,
                          errors.reportsTo,
                          "employee_id"
                        )
                      }
                      value={employeeData.employee_id}
                      errorMessage={errors.employee_id}
                      onChange={(e) => {
                        inputChangeHandler(e, "employee_id");
                        setCurrentHover("");
                      }}
                      
                      // className={styles.loc_dropdown_teamlead}
                    />
                </div>
                </div>
              <div className={styles.main_dropdown_container}>
                <div className={styles.main_teamlead_title}>
                   <Label className={styles.required_field} required>Reports To</Label>
                </div>
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
                    onChange={(e, item) => {
                      reportsToHandler(e, item);
                      setCurrentHover("");
                    }}
                    disabled={
                      !employeeData.role ||
                      employeeData.role === "admin" ||
                      employeeData.role === "account_manager"
                    }
                    className={styles.loc_dropdown_teamlead}
                  />
                </div>
              </div>

              <div className={styles.main_dropdown_container}>
                <div className={styles.main_status_title}>
                  <Label className={styles.required_field} required>Status</Label>
                </div>
                <div id="status" onClick={() => hoverHandler("status")}>
                  <Dropdown
                    placeholder="Select"
                    styles={(props) =>
                      dropDownStylesActive(
                        props,
                        currentHover,
                        errors.status,
                        "status"
                      )
                    }
                    options={dropDownStatus}
                    selectedKey={employeeData.status}
                    onChange={(e, item) => {
                      dropDownHandler(e, item, "status");
                      fieldsChecks();
                      setCurrentHover("");
                    }}
                    className={styles.loc_dropdown_status}
                  />
                </div>
              </div>
            </div>

            <div className={styles.subcontainer}>
              <div className={styles.main_dropdown_container}>
                <div className={styles.main_repotingmanager_title}>
                  <Label className={styles.required_field} required>Job Role</Label>
                </div>
                <div id="jobRole" onClick={() => hoverHandler("jobRole")}>
                  <Dropdown
                    placeholder="Select"
                    styles={(props) =>
                      dropDownStylesActive(
                        props,
                        currentHover,
                        errors.jobRole,
                        "jobRole"
                      )
                    }
                    options={dropDownJobRole}
                    selectedKey={employeeData.jobRole}
                    onChange={(e, item) => {
                      dropDownHandler(e, item, "jobRole");
                      fieldsChecks();
                      setCurrentHover("");
                    }}
                    className={styles.loc_dropdown_reportingmanager}
                  />
                </div>
              </div>

              <div className={styles.main_dropdown_container}>
                <div className={styles.main_location_title}>
                   <Label className={styles.required_field} required>Location</Label>
                </div>
                <div id="location" onClick={() => hoverHandler("location")}>
                  <Dropdown
                    placeholder="Select"
                    styles={(props) =>
                      dropDownStylesActive(
                        props,
                        currentHover,
                        errors.location,
                        "location"
                      )
                    }
                    options={dropDownLocation}
                    selectedKey={employeeData.location}
                    onChange={(e, item) => {
                      dropDownHandler(e, item, "location");
                      fieldsChecks();
                      setCurrentHover("");
                    }}
                    className={styles.loc_dropdown_location}
                  />
                </div>
              </div>
              <div className={styles.main_dropdown_container}>
                <div className={styles.main_location_title}>Demand creator</div>
                <Toggle
                      onText="Yes"
                      offText="No"
                      styles={toggleStyles}
                      checked={toggle}
                      onChange={handleToggle}
                    />
              </div>
            </div>
          </div>

          <div className={styles.main_information_container}>
            <div className={styles.main_basic_information_container}>
              <div className={styles.main_basic_information_title}>
                BASIC INFORMATION
              </div>

              <div className={styles.main_basic_information_content_container}>
                <div className={styles.main_from_field}>
                  <div className={styles.main_sub_from_field}>
                    <div><Label className={styles.required_field} required>First Name</Label></div>
                    <div onClick={() => setCurrentHover("firstName")}>
                      <TextField
                        type="text"
                        name="firstName"
                        onChange={(e) => {
                          inputChangeHandler(e, "firstName");
                          fieldsChecks();
                        }}
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
                  <div><Label className={styles.required_field} required>Last Name</Label></div>
                    <div onClick={() => setCurrentHover("lastName")}>
                      <TextField
                        type="text"
                        name="lastName"
                        styles={(props) =>
                          textField(
                            props,
                            currentHover,
                            errors.lastName,
                            "lastName"
                          )
                        }
                        onChange={(e) => {
                          inputChangeHandler(e, "lastName");
                          fieldsChecks();
                        }}
                        value={employeeData.lastName}
                        errorMessage={errors.lastName}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.main_from_field}>
                  <div className={styles.main_sub_from_field}>
                  <div><Label className={styles.required_field} required>Email ID</Label></div>
                    <div onClick={() => setCurrentHover("email")}>
                      <TextField
                        type="text"
                        name="email"
                        errorMessage={errors.email}
                        styles={(props) =>
                          textField(props, currentHover, errors.email, "email")
                        }
                        onChange={(e) => {
                          inputChangeHandler(e, "email");
                          fieldsChecks();
                        }}
                        value={employeeData.email}
                      />
                    </div>
                  </div>

                  <div className={styles.main_sub_from_field}>
                  <div><Label className={styles.required_field} required>Mobile Number</Label></div>
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
                </div>

                <div className={styles.main_from_field}>
                  <div className={styles.main_sub_from_field}>
                  <div><Label className={styles.required_field} required>Date of hire</Label></div>
                    <div
                      id="dateOfHire"
                      onClick={() => hoverHandler("dateOfHire")}
                    >
                      <DatePicker
                        placeholder="DD/MM/YYYY"
                        onSelectDate={(date) => {
                          dateHandler(date, "dateOfHire");
                          fieldsChecks();
                          setCurrentHover("");
                        }}
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
                    <div className={styles.errorfield}>{errors.dateOfHire}</div>
                  </div>

                  <div className={styles.main_sub_from_field}>
                  <div><Label className={styles.required_field} required>Date of Joining</Label></div>
                    <div
                      id="dateOfJoin"
                      onClick={() => hoverHandler("dateOfJoin")}
                    >
                      <DatePicker
                         minDate={minDate}
                        placeholder="DD/MM/YYYY"
                        onSelectDate={(date) => {
                          dateHandler(date, "dateOfJoin");
                          fieldsChecks();
                          setCurrentHover("");
                        }}
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
                    <div className={styles.errorfield}>{errors.dateOfJoin}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.main_basic_information_container}>
              <div className={styles.main_basic_information_title}>
                PERSONAL DETAILS
              </div>

              <div className={styles.main_basic_information_content_container}>
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
                            // errors.dateOfBirth,
                            // "dateOfBirth"
                          )
                        }
                        value={ employeeData.dateOfBirth
                          ? new Date(employeeData.dateOfBirth)
                          : null // Set value to null if date is not available or not set
                      }
                      />
                    </div>
                    <div className={styles.errorfield}>
                      {/* {errors.dateOfBirth} */}
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
                        // errorMessage={errors.maritalStatus}
                        styles={(props) =>
                          dropDownStyles(
                            props,
                            currentHover,
                            // errors.maritalStatus,
                            // "maritalStatus"
                          )
                        }
                        selectedKey={employeeData.maritalStatus}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.main_from_field}>
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
                        // errorMessage={errors.gender}
                        styles={(props) =>
                          dropDownStyles(
                            props,
                            currentHover,
                            // errors.gender,
                            // "gender"
                          )
                        }
                        selectedKey={employeeData.gender}
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
                        maxLength={50}
                        name="address1"
                        styles={(props) =>
                          textField(
                            props,
                            currentHover,
                            // errors.city,
                            // "address1"
                          )
                        }
                        onChange={(e) => {
                          inputChangeHandler(e, "address1");
                          fieldsChecks();
                        }}
                        value={employeeData.address1}
                        // errorMessage={errors.address1}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.main_from_field}>
                  <div className={styles.main_sub_from_field}>
                    <div>Address Line 2</div>
                    <div onClick={() => setCurrentHover("address2")}>
                      <TextField
                        type="text"
                        name="address2"
                        maxLength={50}
                        styles={(props) =>
                          textField(
                            props,
                            currentHover,
                            // errors.city,
                            // "address2"
                          )
                        }
                        onChange={(e) => {
                          inputChangeHandler(e, "address2");
                          fieldsChecks();
                        }}
                        value={employeeData.address2}
                        // errorMessage={errors.address2}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.main_from_field}>
                  <div className={styles.main_sub_from_field}>
                    <div>City</div>
                    <div>
                      {/* <TextField
                        type="text"
                        name="city"
                        styles={(props) =>
                          textField(props, currentHover, 
                            // errors.city, "city"
                            )
                        }
                        onChange={(e) => {
                          inputChangeHandler(e, "city");
                          fieldsChecks();
                        }}
                        value={employeeData.city}
                        errorMessage={errors.city}
                      /> */}

                      <ComboBox 
                      type='text'
                      name='city'
                      inputChangeHandler = {inputChangeHandler}
                      setInfo = {setEmployeeData}
                      setInfoErrors = {setErrors}
                      value={employeeData.city}
                      // errorMessage={errors.city}
                      dropdown={dropDownCities} 
                      placeholder= 'City'/>
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
                            // errors.pincode,
                            // "pincode"
                          )
                        }
                        onChange={(e) => {
                          inputChangeHandler(e, "pincode");
                          fieldsChecks();
                        }}
                        value={employeeData.pincode}
                        // errorMessage={errors.pincode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.main_basic_information_container}>
              <div className={styles.main_basic_information_title}>
                IDENTITY INFORMATION
              </div>

              <div className={styles.main_basic_information_content_container}>
                <div className={styles.main_from_field}>
                  <div className={styles.main_sub_from_field}>
                    <div>PAN Number</div>
                    <div onClick={() => setCurrentHover("panNumber")}>
                      <TextField
                        type="text"
                        name="panNumber"
                        styles={(props) =>
                          textField(
                            props,
                            currentHover,
                            // errors.panNumber,
                            // "panNumber"
                          )
                        }
                        onChange={(e) => {
                          inputChangeHandler(e, "panNumber");
                          fieldsChecks();
                        }}
                        value={employeeData.panNumber}
                        // errorMessage={errors.panNumber}
                      />
                    </div>
                  </div>

                  <div className={styles.main_sub_from_field}>
                    <div>Aadhaar Number</div>
                    <div onClick={() => setCurrentHover("adhaarNumber")}>
                      <TextField
                        type="text"
                        name="adhaarNumber"
                        styles={(props) =>
                          textField(
                            props,
                            currentHover,
                            // errors.adhaarNumber,
                            // "adhaarNumber"
                          )
                        }
                        onChange={(e) => {
                          inputChangeHandler(e, "adhaarNumber");
                          fieldsChecks();
                        }}
                        value={employeeData.adhaarNumber}
                        // errorMessage={errors.adhaarNumber}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className={styles.main_basic_information_title}>
									ACCOUNT
								</div> */}

              {/* <div className={styles.main_basic_information_content_container_toggle}>

									<div className={styles.main_from_field_pass}>
										
										<Toggle label="Autogenerate Password" 
										defaultChecked={false} onText="Yes"  
										offText="No" 
										styles={toggleStyles} 
										onChange={()=>{setAutoGeneratePass(!autoGeneratePass)}}/>

										<div className={styles.main_sub_from_field}>
											<div>Password</div>
											{ autoGeneratePass && <div className={styles.passContainer}>
												<TextField
												type='password'
												readOnly 
												name="pass"
												value={employeeData.password}  
												styles={passField}
												canRevealPassword
                  								revealPasswordAriaLabel="Show password" />

											</div> 
											}

											{! autoGeneratePass && <div className={styles.passContainer}>
											<div >
												<TextField
												type='password'
												name="pass"
												onChange={(e)=>{inputChangeHandler(e,'password'); fieldsChecks(); }}
												value={employeeData.password} 
												canRevealPassword
                  								revealPasswordAriaLabel="Show password"
												errorMessage={errors.password}
												styles={passField} />
												
											</div>

											</div>}
										</div>
									</div>
								</div> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  function resetState() {
    setEmployeeData(initialValues);
    setErrors({});
    setAutoGeneratePass(false);
    // setIsSaveVisible(true);
    setCurrentHover("");
  }

  function passField(props) {
    return {
      fieldGroup: [
        { height: "22px", width: "100%", border: "0.5px solid transparent" },
      ],
      field: [{ lineHeight: "24px" }],
      revealButton: [
        {
          backgroundColor: "transparent",
          height: "20px",
          color: "grey",
          "&:hover": {
            backgroundColor: "transparent",
            height: "20px",
            color: "grey",
          },
        },
      ],
    };
  }

  function Field(props) {
    return {
      fieldGroup: [
        { height: "22px", width: "100%", border: "0.5px solid transparent" },
      ],
      field: [{ lineHeight: "24px" }],
    };
  }
};
export default EditEmployee;
