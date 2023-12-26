import { useState, useEffect, useCallback } from "react";
import { Modal } from "@fluentui/react";
import { Toggle } from "@fluentui/react/lib/Toggle";
import styles from "./AddEmployeeModal.module.css";
import { Icon } from "@fluentui/react/lib/Icon";
import { TextField, PrimaryButton, DatePicker } from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { mergeStyles, mergeStyleSets } from "@fluentui/react";
import { Popup } from "../components/Popup";
import { axiosPublicCall } from "../constants";
import { axiosPrivateCall, axiosJsonCall } from "../constants";
import { useNavigate } from "react-router-dom";
import { isEmpty, } from "../utils/validation";
import { generatePassword } from "../utils/generatePassword";
import { toLowerCaseUnderScore } from "../utils/helpers";
import { useConst } from "@fluentui/react-hooks";
import ComboBox from '../components/ComboBox/ComboBox';
import { Label } from "@fluentui/react/lib/Label";


const passIcon = { iconName: "Hide3" };

// regex
const nameInputRegex = /^[a-zA-Z\u00c0-\u024f\u1e00-\u1eff ]*$/;
const panInputRegex = /^[a-zA-Z0-9]*$/;
const cityRegex = /^[a-zA-Z0-9\s]*$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+(in|com|org)))$/;
const nameRegex = /^[A-Za-z]+$/;
const mobileRegex = /^[6-9]\d{9}$/;
const panNumberRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
const adhaarNumberRegex = /[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
const pincodeRegex = /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/;
const passRegex = /[A-Za-zÀ-ÖØ-öø-ÿ0-9~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/)]/;
const pinRegex = /^[1-9][0-9]{5}$/;
const passwordRegex = /[A-Za-zÀ-ÖØ-öø-ÿ0-9~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/)]/;
// password Validation /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
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
const textfieldStyle = (props, currentHover, error, value) => {
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
  };
}
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

const AddEmployeeModal = (props) => {
  let isModalOpen = props.isModalOpen;
  const setIsModalOpen = props.setIsModalOpen;
  let isSubmitSuccess = props.isSubmitSuccess;
  const setSubmitSuccess = props.setSubmitSuccess;
  let fieldRequired = 20;
  const [isModalShrunk, setIsModalShrunk] = useState(false);
  const [autoGeneratePass, setAutoGeneratePass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [reportsToList, setReportsToList] = useState([]);
  const [today, setToday] = useState(useConst(new Date(Date.now())));
  const [toggle, setToggle] = useState(false);
  const [dropDownCities, setDropDownCities] = useState([]);

  const initialValues = {
    role: "",
    employee_id: "",
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
    demandCreator: false,
    created_by: ""
  };

  const sanitizeObject = {
    employee_id: "employee_id",
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
    demandCreator: "demand_creator",
    created_by: "created_by"
  };
  function handleToggle(ev, checked) {
    setToggle(checked);
    setEmployeeData({
      ...employeeData,
      demandCreator: checked,
    });
  }


  useEffect(() => {

    axiosJsonCall
      .get("/b/643fa67bebd26539d0ae2903")
      .then((res) => {
        let buffer = res.data.record;
        let dropdown_data = buffer.map((obj) => { return { key: obj.name, text: obj.name } });
        setDropDownCities(dropdown_data)
      })
      .catch((e) => { });

  }, [])

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

  const roleHandler = (e, item) => {
    dropDownRoleHandler(e, item, "role");

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

    console.log(sanitizedData);

    return sanitizedData;
  };

  const [employeeData, setEmployeeData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  const [currentHover, setCurrentHover] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigateTo = useNavigate();

  const hoverHandler = (name) => {
    setCurrentHover(name);
  };

  const modalSizeHandler = () => {
    setIsModalShrunk(!isModalShrunk);
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
      // console.log("inside if", name, value);
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
  //  function submitHandler(e) {
  //   e.preventDefault();

  //   const errors = validate(employeeData);

  //   if (Object.keys(errors).length === 0) {
  //     axiosPublicCall
  //       .post("/api/v1/employee/createEmployee", sanitizer(employeeData))
  //       .then((res) => {
  //         console.log(res);
  //         console.log(employeeData);
  //         submitForm();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         if (error.response && error.response.status === "Employee with the same employee ID already exists.") {
  //           setErrors({
  //             ...errors,
  //             employee_id: "Employee with the same employee ID already exists.",
  //           });
  //         }else  if (error.response && error.response === "Employee with the same email already exists.") {
  //           setErrors({
  //             ...errors,
  //             email: "Employee with the same email ID already exists.",
  //           });
  //         }

  //         else {
  //     setErrors(errors);
  //   }
  // }

  function submitHandler(e) {
    e.preventDefault();

    const errors = validate(employeeData);

    if (Object.keys(errors).length === 0) {
      axiosPublicCall
        .post("/api/v1/employee/createEmployee", sanitizer(employeeData))
        .then((res) => {
          console.log(res);
          console.log(employeeData);
          submitForm();
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 403) {
            if (error.response.data === "Employee with the same employee ID already exists.") {
              setErrors({
                ...errors,
                employee_id: "Already exist",
              });
            } else if (error.response.data === "Employee with the same email already exists.") {
              setErrors({
                ...errors,
                email: "Already exist",
              });
            }
          } else {
            setErrors(errors);
          }
        });
    } else {
      setErrors(errors);
    }
  }


  function validate(values) {
    const errors = {};
    const nameInputRegex = /^[a-zA-Z0-9- '\u00c0-\u024f\u1e00-\u1eff]*$/;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+(in|com|org)))$/;
    const mobileRegex = /^[0-9]{10}$/;
    const pinRegex = /^[0-9]{6}$/;
    const adhaarNumberRegex = /^[0-9]{12}$/;
    const panNumberRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!values.role) {
      errors.role = "Required";
    }

    if (!values.jobRole) {
      errors.jobRole = "Required";
    }

    if (
      values.role !== "admin" &&
      values.role !== "account_manager" &&
      !values.reportsTo
    ) {
      errors.reportsTo = "Required";
    }

    if (!values.status) {
      errors.status = "Required";
    }

    if (!values.location) {
      errors.location = "Required";
    }
    if (!values.employee_id) {
      errors.employee_id = "  "
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

    if (errors)

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

    // if (values.pincode) {
    //   if (!pinRegex.test(values.pincode)) {
    //     errors.pincode = "Invalid Pincode";
    //   }
    // }

    // if (values.adhaarNumber) {
    //   if (!adhaarNumberRegex.test(values.adhaarNumber)) {
    //     errors.adhaarNumber = "Invalid Aadhaar Number";
    //   }
    // }

    // if (values.panNumber) {
    //   if (!panNumberRegex.test(values.panNumber)) {
    //     errors.panNumber = "Invalid Pan Number";
    //   }
    // }

    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8 || values.password.length > 64) {
      errors.password = "Invalid Password";
    } else if (!passRegex.test(values.password)) {
      errors.password = "Invalid Password";
    }

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

  function closeHandler() {
    setShowPopup(!showPopup);
  }

  function submitForm() {
    resetState();
    setSubmitSuccess(true);
    setIsModalOpen(false);
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

      console.log("removed key handler");
    };
  }, []);
  console.log(employeeData.password, "employeee")


  useEffect(() => {
    if (autoGeneratePass) {
      setEmployeeData((prevState) => {
        const password = generatePassword();
        console.log(password, "useEFf")
        return {
          ...prevState,
          password: password,

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    let base64Url = token.split(".")[1];
    let decodedValue = JSON.parse(window.atob(base64Url));
    console.log(decodedValue.created_by, "nul")
    setEmployeeData({
      ...employeeData,
      created_by: decodedValue.user_id,
    });
  }, [])

  console.log(employeeData.password, 'neww')

  window.addEventListener("beforeunload", function (e) {
    // Cancel the event
    e.returnValue = "Are you sure?";
  });
  window.addEventListener("unload", function (e) {
    // Cancel the event
    axiosPrivateCall.post('/api/v1/employee/logoutEmployee', {}).then((res) => { console.log(res); localStorage.removeItem("token"); }).catch(e => console.log(e))
  });

  let minDate = new Date(employeeData.dateOfHire)

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
              <div className={styles.header_tag_container}>Employee</div>

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
                <div className={styles.header_content_title_container}>
                  Add Employee
                </div>

                <div className={styles.header_content_role_save_container}>
                  <div className={styles.main_role_dropdown_container}>
                    <div className={styles.main_role_title}>
                      <Label className={styles.required_field} required>ROLE</Label>
                    </div>
                    <div onClick={() => hoverHandler("role")}>
                      <Dropdown
                        placeholder="Select Role"
                        selectedKey={employeeData.role}
                        styles={(props) =>
                          dropDownStyles(
                            props,
                            currentHover,
                            errors.role,
                            "role"
                          )
                        }
                        onChange={(e, item) => roleHandler(e, item)}
                        options={dropDownRole}
                      />
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
                  <div className={styles.main_teamlead_title}>
                    <Label className={styles.required_field} required>Employee Id</Label></div>
                  <div onClick={() => setCurrentHover("employee_id")}>
                    <TextField
                      type="text"
                      name="employee_id"

                      onChange={(e) => {
                        inputChangeHandler(e, "employee_id");
                        fieldsChecks();
                      }}
                      value={employeeData.employee_id}
                      errorMessage={errors.employee_id}
                      styles={(props) =>
                        textField(
                          props,
                          currentHover,
                          errors.employee_id,
                          "employee_id"
                        )
                      }
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
                      onChange={(e, item) => {
                        reportsToHandler(e, item, "reportsTo");
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
                      onChange={(e, item) => {
                        dropDownHandler(e, item, "jobRole");
                        fieldsChecks();
                        setCurrentHover("");
                      }}
                      className={styles.loc_dropdown_reportingmanager}
                    />

                    {/* <ComboBox dropdown={dropDownJobRole} width='120px'/> */}
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

                <div
                  className={styles.main_basic_information_content_container}
                >
                  <div className={styles.main_from_field}>
                    <div className={styles.main_sub_from_field}>
                      <div><Label className={styles.required_field} required>First Name</Label></div>
                      <div onClick={() => setCurrentHover("firstName")}>
                        <TextField
                          type="text"
                          name="firstName"
                          placeholder="First Name"
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
                          placeholder="Last Name"
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
                          placeholder="Email ID"
                          errorMessage={errors.email}
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              errors.email,
                              "email"
                            )
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
                          placeholder="Mobile Number"
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
                          value={employeeData.dateOfHire}
                        />
                      </div>
                      <div className={styles.errorfield}>
                        {errors.dateOfHire}
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div><Label className={styles.required_field} required>Date of Joining</Label></div>
                      <div
                        id="dateOfJoin"
                        onClick={() => hoverHandler("dateOfJoin")}
                      >
                        <DatePicker
                          placeholder="DD/MM/YYYY"
                          minDate={minDate}
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
                          value={employeeData.dateOfJoin}
                        />
                      </div>
                      <div className={styles.errorfield}>
                        {errors.dateOfJoin}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.main_basic_information_container}>
                <div className={styles.main_basic_information_title}>
                  PERSONAL DETAILS
                </div>

                <div
                  className={styles.main_basic_information_content_container}
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
                          maxDate={today}
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
                          value={employeeData.dateOfBirth}
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
                      >
                        <Dropdown
                          placeholder="Select"
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
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.main_from_field}>
                    <div className={styles.main_sub_from_field_gender}>
                      <div>Gender</div>
                      <div id="gender" onClick={() => hoverHandler("gender")}>
                        <Dropdown
                          placeholder="Select"
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
                          placeholder="Enter your Address"
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              // errors.address1,
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
                          placeholder="Enter your Address"
                          styles={(props) =>
                            textField(
                              props,
                              currentHover,
                              // errors.address2,
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
                      <div onClick={() => setCurrentHover("city")}>
                        {/* <TextField
                          type="text"
                          name="city"
                          placeholder="Enter City"
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
                          inputChangeHandler={inputChangeHandler}
                          setInfo={setEmployeeData}
                          setInfoErrors={setErrors}
                          value={employeeData.city}
                          errorMessage={errors.city}
                          dropdown={dropDownCities}
                          placeholder='City' />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field}>
                      <div>Pincode</div>
                      <div onClick={() => hoverHandler("pincode")}>
                        <TextField
                          type="text"
                          placeholder="Enter Pincode"
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

                <div
                  className={styles.main_basic_information_content_container}
                >
                  <div className={styles.main_from_field}>
                    <div className={styles.main_sub_from_field}>
                      <div>PAN Number</div>
                      <div onClick={() => setCurrentHover("panNumber")}>
                        <TextField
                          type="text"
                          name="panNumber"
                          placeholder="Enter PAN number"
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
                          placeholder="Enter Aadhaar number"
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

                <div className={styles.main_basic_information_title}>
                  ACCOUNT
                </div>

                <div
                  className={
                    styles.main_basic_information_content_container_toggle
                  }
                >
                  <div className={styles.main_from_field_pass}>
                    <Toggle
                      label="Autogenerate Password"
                      defaultChecked={false}
                      onText="Yes"
                      offText="No"
                      styles={toggleStyles}
                      onChange={() => {
                        setAutoGeneratePass(!autoGeneratePass);
                        setShowPass(false);
                      }}
                    />
                    <div className={styles.main_sub_from_field}>
                      <div><Label className={styles.required_field} required>Password</Label></div>
                      {autoGeneratePass && (
                        <div className={styles.passContainer}>
                          <TextField
                            type="password"
                            readOnly
                            name="pass"
                            value={employeeData.password}
                            styles={passField}
                            canRevealPassword
                            revealPasswordAriaLabel="Show password"
                          />
                        </div>
                      )}

                      {!autoGeneratePass && (
                        <div className={styles.passContainer}>
                          <div>
                            <TextField
                              type="password"
                              name="pass"
                              onChange={(e) => {
                                inputChangeHandler(e, "password");
                                fieldsChecks();
                              }}
                              value={employeeData.password}
                              canRevealPassword
                              revealPasswordAriaLabel="Show password"
                              errorMessage={errors.password}
                              styles={passField}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Toggle
                    label="Send Welcome Mail"
                    defaultChecked
                    onText="Yes"
                    offText="No"
                    styles={toggleStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );


  function resetState() {
    setEmployeeData(initialValues);
    setErrors({});
    setAutoGeneratePass(false);
    fieldRequired = 20;
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
export default AddEmployeeModal;
