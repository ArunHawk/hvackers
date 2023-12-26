import React, { useState, useEffect, useCallback } from "react";
import { Toggle } from "@fluentui/react/lib/Toggle";
import styles from "./AddCandidateModal.module.css";
import { Icon } from "@fluentui/react/lib/Icon";
import {
  TextField,
  PrimaryButton,
  DefaultButton,
  DatePicker,
} from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { mergeStyles, mergeStyleSets } from "@fluentui/react";
import { axiosPrivateCall, axiosJsonCall } from "../constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import ComboBox from '../components/ComboBox/ComboBox';

// regex
const nameInputRegex = /^[a-zA-Z]+$/;
const panInputRegex = /^[a-zA-Z0-9]*$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+(in|com|org)))$/;
const mobileRegex = /^[6-9]\d{9}$/;
const pinInputRegex = /^\d{0,6}$/;

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
const closeIconClass2 = mergeStyles({
  fontSize: 14,
  height: "5px",
  width: "5px",
  cursor: "pointer",
});

const tableCloseIconClass = mergeStyles({
  fontSize: 10,
  height: "12px",
  width: "12px",
  cursor: "pointer",
  color: "red",
});

const calendarClass = mergeStyleSets({
  root: {
    "*": {
      minWidth: "80px",
      maxWidth: "120px",
      fontSize: 12,
      height: "22px !important",
      lineHeight: "20px !important",
      borderColor: "rgba(255, 255, 255, 0.1) !important",
    },
  },
  icon: {
    height: 10,
    width: 10,
    left: "85%",
    padding: "0px 0px",
    color: "white",
  },
  fieldGroup: { border: "0.5px solid grey !important" },
  statusMessage: { marginBottom: "-25px" },
});

const calendarClassActive = mergeStyleSets({
  root: {
    "*": {
      minWidth: "80px",
      maxWidth: "120px",
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
      minWidth: "80px",
      maxWidth: "120px",
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

const dropDownStylesActive = mergeStyleSets({
  dropdown: { minWidth: "80px", maxWidth: "120px", minHeight: "20px" },
  title: {
    height: "22px",
    lineHeight: "18px",
    fontSize: "12px",
    border: "0.5px solid #333333",
  },
  caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
  dropdownItem: { minHeight: "22px", fontSize: 12 },
  dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
});

const dropDownStylesActive1 = mergeStyleSets({
  dropdown: {
    minWidth: "80px",
    maxWidth: "120px",
    width: "120px",
    minHeight: "20px",
  },
  title: {
    height: "22px",
    lineHeight: "18px",
    fontSize: "12px",
    border: "0.5px solid #333333",
    backgroundColor: "#EDF2F6",
  },
  caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
  dropdownItem: { minHeight: "22px", fontSize: 12 },
  dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
});
//add transperant here in title: border
const dropDownStyles = mergeStyleSets({
  dropdown: { minWidth: "80px", maxWidth: "120px", minHeight: "20px" },
  title: {
    height: "22px",
    lineHeight: "18px",
    fontSize: "12px",
    border: "0.5px solid transparent",
  },
  caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
  caretDown: { color: "transparent" },
  dropdownItem: { minHeight: "22px", fontSize: 12 },
  dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
});
//add transperant here in title: border
const dropDownStyles1 = mergeStyleSets({
  dropdown: {
    minWidth: "80px",
    maxWidth: "120px",
    width: "120px",
    minHeight: "20px",
  },
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
  dropdown: { minWidth: "80px", maxWidth: "120px", minHeight: "20px" },
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

const dropDownErrorStyles1 = mergeStyleSets({
  dropdown: {
    minWidth: "80px",
    maxWidth: "120px",
    width: "120px",
    minHeight: "20px",
  },
  title: {
    height: "22px",
    lineHeight: "18px",
    fontSize: "12px",
    border: "0.5px solid #a80000",
    backgroundColor: "#EDF2F6",
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

const dropDownWorkModel = [
  { key: "Remote", text: "Remote" },
  { key: "Office", text: "Office" },
  { key: "Hybrid", text: "Hybrid" },
  { key: "To be modified", text: "To be modified" }
];

const dropDownPreferedHireMode = [
  {
    key: "C2H (contract to Hire) - Client side",
    text: "C2H (contract to Hire) - Client side",
  },
  {
    key: "Permanent  - Internal recruitment",
    text: "Permanent  - Internal recruitment",
  },
  { key: "To be modified", text: "To be modified" }
];

const dropDownNoticePeriod = [
  { key: "Immediate", text: "Immediate" },
  { key: "< 15 days", text: "< 15 days" },
  { key: "< 30 Days", text: "< 30 Days" },
  { key: "< 60 Days", text: "< 60 Days" },
  { key: "> 60 days", text: "> 60 days" },
];

const dropDownStatus = [
  { key: "Active", text: "Active" },
  { key: "Inprogress", text: "In progress" },
];



const dropDownEmploymentType = [
  { key: "Contract", text: "Contract" },
  { key: "Permanent", text: "Permanent" },
  { key: "Freelancing", text: "Freelancing " },
  { key: "To be modified", text: "To be modified" },
];

const dropDownGender = [
  { key: "Male", text: "Male" },
  { key: "Female", text: "Female" },
  { key: "Others", text: "Others" },
];

const EditCandidate = (props) => {
  let isModalOpen = props.isModalOpen;
  const setIsModalOpen = props.setIsModalOpen;
  const [isModalShrunk, setIsModalShrunk] = useState(false);
  const [currentHover, setCurrentHover] = useState("");
  const [toggle, setToggle] = useState(false);
  const [fileTitle, setFileTitle] = useState("");
  const [btnIcon, setBtnIcon] = useState("Add");
  const [searchParams, setSearchParams] = useSearchParams();
  const [candidateId, setCandidateId] = useState("");
  const [dropDownCities, setDropDownCities] = useState([]);
  const [dropDownStates, setDropDownStates] = useState([]);
  const [dropDownSkills, setDropDownSkills] = useState([]);
  const navigateTo = useNavigate();

  const hoverHandler = (name) => {
    setCurrentHover(name);
  };

  let defaultbasicInfo = {
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    gender: "",
    state: "",
    city: "",
    pincode: "",
    current_location: "",
    willing_to_relocate: false,
    prefered_location: "",
    expected_ctc: "",
    notice_period: "",
    status: "",
    prefered_mode_of_hire: "",
    resume_url: "",
  };

  const [basicInfo, setBasicInfo] = useState({ ...defaultbasicInfo });
  const [basicInfoerrors, setBasicInfoErrors] = useState({
    ...defaultbasicInfo,
  });

  let defaultEmployDetail = {
    company_name: "",
    start_date: "",
    end_date: "",
    job_role: "",
    work_model: "",
    ctc: "",
    employment_type: "",
    industry_type: "",
    c2h_payroll: "",
    job_skills: "",
    is_current: "",
  };

  const [employmentDetails, setEmploymentDetails] = useState([
    { ...defaultEmployDetail },
  ]);
  const [employmentDetailserrors, setEmploymentDetailErrors] = useState([
    { ...defaultEmployDetail },
  ]);

  let defaultSkillSet = {
    skill: "",
    years: "",
    months: "",
  };

  const [skillSet, setSkillSet] = useState([{ ...defaultSkillSet }]);
  const [skillseterrors, setSkillSetErrors] = useState([
    { ...defaultSkillSet },
  ]);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {

    axiosJsonCall
      .get("/b/643fa67bebd26539d0ae2903")
      .then((res) => {
        let buffer = res.data.record;
        let dropdown_data = buffer.map((obj) => { return { key: obj.name, text: obj.name } });
        setDropDownCities(dropdown_data)
      })
      .catch((e) => { });

    axiosJsonCall
      .get("/b/643fa973ace6f33a220e556e")
      .then((res) => {
        let buffer = res.data.record;
        let dropdown_data = buffer.map((obj) => { return { key: obj.name, text: obj.name } });
        setDropDownStates(dropdown_data)
      })
      .catch((e) => { });


    axiosPrivateCall.get(`/api/v1/skill/listSkills`).then(res => {
      let buffer = res.data;
      let dropdown_data = buffer.map((obj) => { return { key: obj.skill_name, text: obj.skill_name } });
      setDropDownSkills(dropdown_data)
    }).catch(e => {
      console.log(e)
    })

  }, [])

  const modalSizeHandler = () => {
    setIsModalShrunk(!isModalShrunk);
  };

  const dropDownHandler = (e, item, name, setData, setErrors) => {
    setData((prevData) => {
      return {
        ...prevData,
        [name]: item.text,
      };
    });
    setErrors((prevData) => {
      return { ...prevData, [name]: "" };
    });
  };

  const dropDownHandler1 = (e, item, name, key, setData, setErrors) => {
    setData((prevState) => {
      let update = [...prevState];
      update[key][name] = item.text;

      return update;
    });

    setErrors((prevState) => {
      let update = [...prevState];
      update[key][name] = "";

      return update;
    });
  };

  const dateHandler = (date, name, key, setData, setErrors) => {
    setData((prevState) => {
      let update = [...prevState];
      update[key][name] = date;
      return update;
    });
    setErrors((prevState) => {
      let update = [...prevState];
      update[key][name] = "";
      return update;
    });
  };


  const inputChangeHandler = (e, name, setData, setErrors) => {
    const { value } = e.target;
    let inputValue = value;

    let isNameValid = false;

    if (name === "first_name" && nameInputRegex.test(inputValue)) {
      if (inputValue.length > 40) inputValue = inputValue.slice(0, 40);
      isNameValid = true;
    }

    if (name === "last_name" && nameInputRegex.test(inputValue)) {
      if (inputValue.length > 40) inputValue = inputValue.slice(0, 40);
      isNameValid = true;
    }

    if (name === "email") {
      if (inputValue.length > 320) inputValue = inputValue.slice(0, 320);
      isNameValid = true;
    }

    if (name === "mobile_number" && (inputValue === "" || !isNaN(inputValue))) {
      if (inputValue.length > 10) inputValue = inputValue.slice(0, 10);
      isNameValid = true;
    }

    if (name === "panNumber" && panInputRegex.test(inputValue)) {
      if (inputValue.length > 10) inputValue = inputValue.slice(0, 10);
      isNameValid = true;
    }

    if (name === "state") {
      isNameValid = true;
    }

    if (name === "city") {
      isNameValid = true;
    }

    if (name === "expected_ctc") {
      isNameValid = true;
    }

    if (name === "notice_period") {
      isNameValid = true;
    }

    if (name === "current_location") {
      isNameValid = true;
    }

    if (name === "prefered_location") {
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

    if (isNameValid) {
      setData((prevState) => {
        return { ...prevState, [name]: inputValue };
      });

      setErrors((prevState) => {
        return { ...prevState, [name]: null };
      });
    }
  };

  const inputChangeHandler1 = (e, name, key, setData, setErrors) => {
    const { value } = e.target;
    let inputValue = value;

    let isNameValid = false;

    if (name === "company_name") {
      isNameValid = true;
    }

    if (name === "job_role") {
      isNameValid = true;
    }

    if (name === "ctc") {
      isNameValid = true;
    }

    if (name === "industry_type") {
      isNameValid = true;
    }

    if (name === "c2h_payroll") {
      isNameValid = true;
    }

    if (name === "job_skills") {
      isNameValid = true;
    }

    if (name === "skill") {
      isNameValid = true;
    }

    if (name === "years" && (inputValue === "" || !isNaN(inputValue))) {
      isNameValid = true;
    } else if (name === "years") {
      setErrors((prevState) => {
        let errorupdate = [...prevState];
        errorupdate[key][name] = " ";
        return errorupdate;
      });
    }

    if (name === "months" && (inputValue === "" || !isNaN(inputValue))) {
      isNameValid = true;
    } else if (name === "months") {
      setErrors((prevState) => {
        let errorupdate = [...prevState];
        errorupdate[key][name] = " ";
        return errorupdate;
      });
    }

    if (isNameValid) {
      setData((prevState) => {
        let update = [...prevState];
        update[key][name] = inputValue;
        return update;
      });

      setErrors((prevState) => {
        let errorupdate = [...prevState];
        errorupdate[key][name] = null;
        return errorupdate;
      });
    }
  };

  function sanitizeApiData(data) {
    const sanitizedData = data;
    console.log(data);
    let apiSkill = [...data.skillset];

    let convertedSkill = apiSkill.map((detail) => {
      if (detail.exp) {
        return {
          skill: detail.skill,
          years: Math.round(detail.exp / 12),
          months: detail.exp % 12,
        };
      } else {
        return {
          skill: detail.skill,
          years: detail.years,
          months: detail.months,
        };
      }

    });


    setSkillSet(convertedSkill);

    // Initialize skillSetErrors array
    const skillSetErrors = [];
    convertedSkill.forEach((data) => {
      const error = {
        skill: "",
        years: "",
        months: "",
      };
      if (data.months >= 0) {
        error.months = "";
      }

      skillSetErrors.push(error);
    });

    setSkillSetErrors(skillSetErrors);

    // Other code to sanitize data and set state

    setSkillSet([...convertedSkill]);
    setEmploymentDetails([...data.employment_details]);
    setBasicInfo({ ...data });
    setToggle(data.willing_to_relocate);
    convertedSkill.map((data) =>
      setSkillSetErrors((prevState) => [...prevState, { ...defaultSkillSet }])
    );
    data.employment_details.map((data) =>
      setEmploymentDetailErrors((prevState) => [
        ...prevState,
        { ...defaultEmployDetail },
      ])
    );
    return sanitizedData;
  }

  useEffect(() => {
    console.log("rendering..");
  }, [
    employmentDetails,
    basicInfo,
    basicInfoerrors,
    skillSet,
    employmentDetailserrors,
    toggle,
  ]);
  useEffect(() => {
    axiosPrivateCall(
      `/api/v1/candidate/getCandidateDetails?candidate_id=${searchParams.get(
        "candidate_id"
      )}`
    )
      .then((res) => {
        console.log(sanitizeApiData(res.data));
        setCandidateId(res.data.CandidateId);

        // setCandidateData(sanitizeApiData(res.data))
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function validate(values) {
    const errors = {};

    if (!values.expected_ctc) {
      errors.expected_ctc = "Required";
    }

    if (!values.notice_period) {
      errors.notice_period = "Required";
    }

    if (!values.status) {
      errors.status = "Required";
    }

    if (!values.prefered_mode_of_hire) {
      errors.prefered_mode_of_hire = "Required";
    }

    if (!values.first_name) {
      errors.first_name = "Required";
    } else if (!nameInputRegex.test(values.first_name)) {
      errors.first_name = "Invalid name";
    }

    if (!values.last_name) {
      errors.last_name = "Required";
    } else if (!nameInputRegex.test(values.last_name)) {
      errors.last_name = "Invalid name";
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Invalid Email Id";
    }

    if (!values.mobile_number) {
      errors.mobile_number = "Required";
    } else if (!mobileRegex.test(values.mobile_number)) {
      errors.mobile_number = "Invalid Mobile Number";
    }

    if (!values.gender) {
      errors.gender = "Required";
    }

    if (!values.state) {
      errors.state = "Required";
    }

    if (!values.city) {
      errors.city = "Required";
    }

    if (!values.pincode) {
      errors.pincode = "Required";
    } else if (!pinInputRegex.test(values.pincode) || (values.pincode.length < 6)) {
      errors.pincode = "Invalid Pincode";
    }

    if (!values.current_location) {
      errors.current_location = "Required";
    }

    if (!values.prefered_location) {
      if (values.willing_to_relocate) {
        errors.prefered_location = "Required";
      }
    }

    if (!values.resume_url) {
      errors.resume_url = "Required";
      setBtnIcon("Add");
    }

    return errors;
  }

  function nestedValidate(values) {
    let errorArr = [];
    values.map((detail) => errorArr.push({}));
    values.map((detail, index) => {
      console.log(detail, "hhihuhu", errorArr[index].end_date);
      if (!detail.company_name) {
        errorArr[index].company_name = "Required";
      }
      if (!detail.job_role) {
        errorArr[index].job_role = "Required";
      }
      if (!detail.ctc) {
        errorArr[index].ctc = "Required";
      }
      if (!detail.industry_type) {
        errorArr[index].industry_type = "Required";
      }
      if (detail.employment_type !== "Permanent" && !detail.c2h_payroll) {
        errorArr[index].c2h_payroll = "Required";
      }
      if (!detail.job_skills) {
        errorArr[index].job_skills = "Required";
      }
      if (!detail.end_date) {
        errorArr[index].end_date = "Required";
      }
      if (!detail.start_date) {
        errorArr[index].start_date = "Required";
      }
      if (!detail.work_model) {
        errorArr[index].work_model = "Required";
      }
      if (!detail.employment_type) {
        errorArr[index].employment_type = "Required";
      }
      if (!detail.is_current) {
        errorArr[index].is_current = "Required";
      }
      // Check if start_date is greater than end_date
      if (detail.start_date && detail.end_date) {
        const start = new Date(detail.start_date);
        const end = new Date(detail.end_date);
        if (start > end) {
          errorArr[index].end_date = "End date cannot be before start date";
        }
      }
    });
    return errorArr;
  }


  function nestedValidate1(values) {
    let errorArr = [];
    values.map((detail) => errorArr.push({}));

    values.map((detail, index) => {
      if (!detail.skill) {
        errorArr[index].skill = "Required";
      }

      if (!detail.years || isNaN(detail.years)) {
        errorArr[index].years = " ";
      }

      if (!detail.months || isNaN(detail.months)) {
        errorArr[index].months = " ";
      }
    });

    return errorArr;
  }

  function sanitizer(obj, arrobj1, arrobj2) {
    let payload = { ...obj };
    let skills = [...arrobj1];

    let skillsets = skills.map((data) => {
      return { skill: data.skill, exp: +data.years * 12 + +data.months };
    });

    payload.skillset = [...skillsets];
    payload.employment_details = [...arrobj2];
    console.log(payload);

    return payload;
  }

  function submitHandler(e) {
    e.preventDefault();
    console.log("submit clicked");
    let errorsBasicSet;
    let errorsEmploySet;
    let errorsSkillSet;

    function analyseError(errorDataSet) {
      let answer = true;

      for (let i = 0; i < errorDataSet.length; i++) {
        if (!(Object.keys(errorDataSet[i]).length === 0)) {
          answer = false;
          break;
        }
      }

      return answer;
    }

    errorsBasicSet = validate(basicInfo);
    errorsEmploySet = nestedValidate(employmentDetails);
    errorsSkillSet = nestedValidate1(skillSet);

    let stage1 = Object.keys(errorsBasicSet).length === 0;
    let stage2 = analyseError(errorsEmploySet);
    let stage3 = analyseError(errorsSkillSet);

    console.log(errorsBasicSet);
    console.log(stage1);
    console.log(errorsEmploySet);
    console.log(stage2);
    console.log(errorsSkillSet);
    console.log(stage3);

    if (stage1 && stage2 && stage3) {
      axiosPrivateCall
        .post(
          "/api/v1/candidate/updateCandidate",
          sanitizer(basicInfo, skillSet, employmentDetails)
        )
        .then((res) => {
          console.log(res);
          submitForm();
        })
        .catch((e) => {
          console.log(e);
        });

      // sanitizer(basicInfo, skillSet, employmentDetails);

      submitForm();
    } else {
      setBasicInfoErrors(errorsBasicSet);
      setEmploymentDetailErrors([...errorsEmploySet]);
      setSkillSetErrors([...errorsSkillSet]);
      console.log("error");
    }
  }

  function submitForm() {
    navigateTo("/candidatelibrary/managecandidates");
  }

  const closeHandler = () => {
    setIsModalOpen(false);
  };

  const close = useCallback(() => {
    setBasicInfo((prevState) => {
      const value_temp = Object.values(validate(prevState));
      if (value_temp.length === 15) {
        closeHandler();
      }
      return prevState;
    });
  }, [basicInfo]);

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


  function handleRemoveItem(key, setData, setErrors) {
    setData((prevState) => {
      let update = [...prevState];
      let arr1 = update.slice(0, key);
      let arr2 = update.slice(key + 1);
      let newSet = arr1.concat(arr2);

      return newSet;
    });

    setErrors((prevState) => {
      let update = [...prevState];
      let arr1 = update.slice(0, key);
      let arr2 = update.slice(key + 1);
      let newSet = arr1.concat(arr2);

      return newSet;
    });
  }

  function addField(setData, setErrors, defaultData) {
    setData((prevState) => [...prevState, { ...defaultData }]);
    setErrors((prevState) => [...prevState, { ...defaultData }]);
  }

  function handleCurrentCompany(key) {
    setEmploymentDetails((prevState) => {
      let update = [...prevState];
      update.map((data, index) => {
        if (key === index) {
          data.is_current = "yes";
        } else {
          data.is_current = "no";
        }
      });

      return update;
    });

    setEmploymentDetailErrors((prevState) => {
      let update = [...prevState];
      update.map((data) => {
        data.is_current = null;
      });

      return update;
    });
  }

  function handleToggle() {
    if (!toggle) {
      setBasicInfo((prevState) => {
        return { ...prevState, prefered_location: "Na" };
      });
    }

    setBasicInfo((prevState) => {
      return { ...prevState, willing_to_relocate: !toggle };
    });

    setToggle((prevState) => !prevState);
  }

  function uploadHandler(e) {
    if (
      e.target.files[0].type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      e.target.files[0].type === "application/pdf" ||
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/png"
    ) {
      let files = e.target.files[0];
      let formdata = new FormData();
      formdata.append("file", files);

      axiosPrivateCall
        .post("/api/v1/candidate/uploadCandidateResume", formdata)
        .then((res) => {
          // console.log(res.data.document);
          setBasicInfo((prevState) => {
            return { ...prevState, resume_url: res.data.document, resume_text:res.data.resume_text };
          });

          setBasicInfoErrors((prevState) => {
            return { ...prevState, resume_url: "",resume_text:"" };
          });

          setBtnIcon("Accept");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setBasicInfoErrors((prevState) => {
        return { ...prevState, resume_url: "Invalid" };
      });
      setBtnIcon("Cancel");
    }
  }

  function handleRemoveResume() {
    setFileTitle("");
  }
  const today = new Date();

  return (
    <div className={styles.editContainer}>
      {/* {<Popup showPopup={showPopup} setShowPopup={setShowPopup} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>} */}

      <div className={styles.addcandidate_modal_header_container}>
        <div className={styles.header_tag_expand_close_icon_container}>
          <div className={styles.header_tag_container}>Candidate</div>
        </div>

        <div className={styles.header_content_container}>
          <div className={styles.header_content_title_container}>
            <div className={styles.header_content_title_container}>
              Candidate Id : {candidateId ? candidateId : ""}
            </div>

            <div className={styles.header_content_save_container}>
              <div className={styles.header_save_close_btns_container}>
                <div className={styles.resume_conatiner}>
                  <DefaultButton
                    text={
                      basicInfoerrors.resume_url
                        ? basicInfoerrors.resume_url === "Invalid"
                          ? `Invalid Format`
                          : `Update Resume`
                        : `Update Resume`
                    }
                    iconProps={{ iconName: `${btnIcon}` }}
                    className={`${styles.resumeEl} ${basicInfoerrors.resume_url
                        ? styles.errorBtn
                        : styles.regularBtn
                      }`}
                  />

                  <input
                    className={`${styles.resumeEl} ${styles.resume}`}
                    style={{ opacity: "0" }}
                    type="file"
                    name="resume"
                    id="resume-upload"
                    onChange={(e) => uploadHandler(e)}
                  />
                </div>

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

      <div className={styles.addemployee_modal_main_container}>
        <div className={styles.main_filter_options_container}>
          <div className={styles.subcontainer}>
            <div className={styles.main_dropdown_container1}>
              <div className={styles.flex_model}>
                Status <div className={styles.color}>*</div>
              </div>{" "}
              <div
                id="status"
                onClick={() => hoverHandler("status")}
                className={
                  basicInfo.status ||
                    basicInfoerrors.status ||
                    currentHover === "status"
                    ? styles.showfield
                    : styles.hidefield
                }
              >
                <Dropdown
                  placeholder="select"
                  options={dropDownStatus}
                  selectedKey={basicInfo.status}
                  onChange={(e, item) => {
                    dropDownHandler(
                      e,
                      item,
                      "status",
                      setBasicInfo,
                      setBasicInfoErrors
                    );
                    setCurrentHover("");
                  }}
                  styles={
                    basicInfoerrors.status
                      ? dropDownErrorStyles1
                      : currentHover === "status"
                        ? dropDownStylesActive1
                        : dropDownStyles1
                  }
                />
              </div>
            </div>

            <div className={styles.main_dropdown_container1}>
              <div className={styles.flex_model}>
                Notice Period <div className={styles.color}>*</div>
              </div>
              <div
                id="notice_period"
                onClick={() => hoverHandler("notice_period")}
                className={
                  basicInfo.notice_period ||
                    basicInfoerrors.notice_period ||
                    currentHover === "notice_period"
                    ? styles.showfield
                    : styles.hidefield
                }
              >
                <TextField
                  type="text"
                  name="notice_period"
                  onChange={(e) => {
                    inputChangeHandler(
                      e,
                      "notice_period",
                      setBasicInfo,
                      setBasicInfoErrors
                    );
                  }}
                  value={basicInfo.notice_period}
                  placeholder={"Notice Period"}
                  styles={basicInfoerrors.notice_period ? FieldError : Field1}
                />
              </div>
            </div>
          </div>

          <div className={styles.subcontainer}>
            <div className={styles.main_dropdown_container}>
              <div className={styles.flex_model}>
                Expected CTC <div className={styles.color}>*</div>
              </div>
              <div
                className={
                  basicInfo.expected_ctc || basicInfoerrors.expected_ctc
                    ? styles.showfield
                    : styles.hidefield
                }
              >
                <TextField
                  type="text"
                  name="expected_ctc"
                  onChange={(e) => {
                    inputChangeHandler(
                      e,
                      "expected_ctc",
                      setBasicInfo,
                      setBasicInfoErrors
                    );
                  }}
                  value={basicInfo.expected_ctc}
                  placeholder={"CTC"}
                  styles={basicInfoerrors.expected_ctc ? FieldError : Field1}
                />
              </div>
            </div>

            <div className={styles.main_dropdown_container}>
              <div className={styles.main_location_title}>
                Prefered Mode of Hire
              </div>
              <div
                id="prefered_mode_of_hire"
                onClick={() => hoverHandler("prefered_mode_of_hire")}
                className={
                  basicInfo.prefered_mode_of_hire ||
                    basicInfoerrors.prefered_mode_of_hire ||
                    currentHover === "prefered_mode_of_hire"
                    ? styles.showfield
                    : styles.hidefield
                }
              >
                <Dropdown
                  placeholder="select"
                  options={dropDownPreferedHireMode}
                  onChange={(e, item) => {
                    dropDownHandler(
                      e,
                      item,
                      "prefered_mode_of_hire",
                      setBasicInfo,
                      setBasicInfoErrors
                    );
                    setCurrentHover("");
                  }}
                  selectedKey={basicInfo.prefered_mode_of_hire}
                  styles={
                    basicInfoerrors.prefered_mode_of_hire
                      ? dropDownErrorStyles1
                      : currentHover === "prefered_mode_of_hire"
                        ? dropDownStylesActive1
                        : dropDownStyles1
                  }
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

            <div className={styles.main_basic_information_content_container}>
              <div className={styles.main_from_field}>
                <div className={styles.main_sub_from_field}>
                  <div className={styles.flex_model}>
                    First Name <div className={styles.color}>*</div>
                  </div>{" "}
                  <div
                    className={
                      basicInfo.first_name || basicInfoerrors.first_name
                        ? styles.showfield
                        : styles.hidefield
                    }
                  >
                    <TextField
                      type="text"
                      name="first_name"
                      onChange={(e) => {
                        inputChangeHandler(
                          e,
                          "first_name",
                          setBasicInfo,
                          setBasicInfoErrors
                        );
                      }}
                      value={basicInfo.first_name}
                      errorMessage={basicInfoerrors.first_name}
                      styles={Field}
                    />
                  </div>
                </div>

                <div className={styles.main_sub_from_field}>
                  <div className={styles.flex_model}>
                    Last Name <div className={styles.color}>*</div>
                  </div>{" "}
                  <div
                    className={
                      basicInfo.last_name || basicInfoerrors.last_name
                        ? styles.showfield
                        : styles.hidefield
                    }
                  >
                    <TextField
                      type="text"
                      name="last_name"
                      onChange={(e) => {
                        inputChangeHandler(
                          e,
                          "last_name",
                          setBasicInfo,
                          setBasicInfoErrors
                        );
                      }}
                      value={basicInfo.last_name}
                      errorMessage={basicInfoerrors.last_name}
                      styles={Field}
                    />
                  </div>
                </div>

                <div className={styles.main_sub_from_field}>
                  <div className={styles.flex_model}>
                    Email ID <div className={styles.color}>*</div>
                  </div>
                  <div
                    className={
                      basicInfo.email || basicInfoerrors.email
                        ? styles.showfield
                        : styles.hidefield
                    }
                  >
                    <TextField
                      type="text"
                      name="email"
                      onChange={(e) => {
                        inputChangeHandler(
                          e,
                          "email",
                          setBasicInfo,
                          setBasicInfoErrors
                        );
                      }}
                      value={basicInfo.email}
                      errorMessage={basicInfoerrors.email}
                      styles={Field}
                    />
                  </div>
                </div>

                <div className={styles.main_sub_from_field}>
                  <div className={styles.flex_model}>
                    Mobile Number <div className={styles.color}>*</div>
                  </div>{" "}
                  <div
                    className={
                      basicInfo.mobile_number || basicInfoerrors.mobile_number
                        ? styles.showfield
                        : styles.hidefield
                    }
                  >
                    <TextField
                      type="text"
                      name="mobile_number"
                      onChange={(e) => {
                        inputChangeHandler(
                          e,
                          "mobile_number",
                          setBasicInfo,
                          setBasicInfoErrors
                        );
                      }}
                      value={basicInfo.mobile_number}
                      errorMessage={basicInfoerrors.mobile_number}
                      styles={Field}
                    />
                  </div>
                </div>

                <div className={styles.main_sub_from_field_gender}>
                  <div>Gender</div>
                  <div
                    id="gender"
                    onClick={() => hoverHandler("gender")}
                    className={
                      basicInfo.gender ||
                        basicInfoerrors.gender ||
                        currentHover === "gender"
                        ? styles.showfield
                        : styles.hidefield
                    }
                  >
                    <Dropdown
                      placeholder="select"
                      options={dropDownGender}
                      selectedKey={basicInfo.gender}
                      onChange={(e, item) => {
                        dropDownHandler(
                          e,
                          item,
                          "gender",
                          setBasicInfo,
                          setBasicInfoErrors
                        );
                        setCurrentHover("");
                      }}
                      errorMessage={basicInfoerrors.gender}
                      styles={
                        basicInfoerrors.gender
                          ? dropDownErrorStyles
                          : currentHover === "gender"
                            ? dropDownStylesActive
                            : dropDownStyles
                      }
                    />
                  </div>
                </div>

                <div className={styles.main_sub_from_field}>
                  <div>State</div>
                  <div
                    className={
                      basicInfo.state || basicInfoerrors.state
                        ? styles.showfield
                        : styles.hidefield
                    }
                  >
                    {/* <TextField
                      type="text"
                      name="state"
                      onChange={(e) => {
                        inputChangeHandler(
                          e,
                          "state",
                          setBasicInfo,
                          setBasicInfoErrors
                        );
                      }}
                      value={basicInfo.state}
                      errorMessage={basicInfoerrors.state}
                      styles={Field}
                    /> */}

                    <ComboBox
                      type='text'
                      name='state'
                      inputChangeHandler={inputChangeHandler}
                      setInfo={setBasicInfo}
                      setInfoErrors={setBasicInfoErrors}
                      value={basicInfo.state}
                      errorMessage={basicInfoerrors.state}
                      dropdown={dropDownStates}
                      placeholder='State' />
                  </div>
                </div>

                <div className={styles.main_sub_from_field}>
                  <div>City</div>
                  <div
                    className={
                      basicInfo.city || basicInfoerrors.city
                        ? styles.showfield
                        : styles.hidefield
                    }
                  >
                    {/* <TextField
                      type="text"
                      name="city"
                      onChange={(e) => {
                        inputChangeHandler(
                          e,
                          "city",
                          setBasicInfo,
                          setBasicInfoErrors
                        );
                      }}
                      value={basicInfo.city}
                      errorMessage={basicInfoerrors.city}
                      styles={Field}
                    /> */}

                    <ComboBox
                      type='text'
                      name='city'
                      inputChangeHandler={inputChangeHandler}
                      setInfo={setBasicInfo}
                      setInfoErrors={setBasicInfoErrors}
                      value={basicInfo.city}
                      errorMessage={basicInfoerrors.city}
                      dropdown={dropDownCities}
                      placeholder='City' />
                  </div>
                </div>

                <div className={styles.main_sub_from_field}>
                  <div>Pincode</div>
                  <div
                    className={
                      basicInfo.pincode || basicInfoerrors.pincode
                        ? styles.showfield
                        : styles.hidefield
                    }
                  >
                    <TextField
                      type="text"
                      name="pincode"
                      onChange={(e) => {
                        inputChangeHandler(
                          e,
                          "pincode",
                          setBasicInfo,
                          setBasicInfoErrors
                        );
                      }}
                      value={basicInfo.pincode}
                      errorMessage={basicInfoerrors.pincode}
                      styles={Field}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.main_basic_information_container}>
            <div className={styles.main_basic_information_title2}>
              <div>EMPLOYMENT DETAILS</div>
              <div
                className={styles.add_btn}
                onClick={() =>
                  addField(
                    setEmploymentDetails,
                    setEmploymentDetailErrors,
                    defaultEmployDetail
                  )
                }
              >
                + Add
              </div>
            </div>

            <div className={styles.main_basic_information_content_container}>
              <div className={styles.table_container}>
                <table>
                  <thead className={styles.table_header}>
                    <tr className={styles.table_row1}>
                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}></div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>Company Name</div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>Start Date</div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>End Date</div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>Job Role</div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>Work Model</div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>CTC</div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>
                          Employment Type
                        </div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>
                          Industry Type
                        </div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>C2H Payroll</div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}>Job Skills</div>
                      </th>

                      <th className={styles.table_headerContents}>
                        <div className={styles.table_heading}></div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {employmentDetails?.map((detail, index) => (
                      <tr key={index} className={styles.table_row}>
                        <td className={styles.table_dataContents}>
                          <div className={styles.tooltip}>
                            <div
                              className={`${employmentDetails[index]?.is_current ||
                                  employmentDetailserrors[index]?.is_current
                                  ? styles.showfield
                                  : styles.hidefield
                                }
																${employmentDetailserrors[index]?.is_current && styles.errorRadio}`}
                            >
                              <input
                                type="radio"
                                checked={
                                  (employmentDetails[index]?.is_current === "yes" || employmentDetails[index]?.is_current === true)
                                }
                                onChange={() => handleCurrentCompany(index)}
                              />
                            </div>

                            <span className={styles.tooltiptext}>
                              Set Current Company
                            </span>
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            className={
                              employmentDetails[index]?.company_name ||
                                employmentDetailserrors[index]?.company_name
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <TextField
                              type="text"
                              name="company_name"
                              onChange={(e) => {
                                inputChangeHandler1(
                                  e,
                                  "company_name",
                                  index,
                                  setEmploymentDetails,
                                  setEmploymentDetailErrors
                                );
                              }}
                              value={employmentDetails[index]?.company_name}
                              errorMessage={
                                employmentDetailserrors[index]?.company_name
                              }
                              styles={Field}
                            />
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            className={
                              employmentDetails[index]?.start_date ||
                                employmentDetailserrors[index]?.start_date
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <div
                              id="start_date"
                              onClick={() => hoverHandler("start_date")}
                              onMouseEnter={() => hoverHandler("start_date")}
                              onMouseLeave={() => setCurrentHover("")}
                              className={
                                employmentDetails[index]?.start_date ||
                                  employmentDetailserrors[index]?.start_date ||
                                  currentHover === "start_date"
                                  ? styles.showfield
                                  : styles.hidefield
                              }
                            >
                              <DatePicker placeholder="DD/MM/YYYY"
                                maxDate={today}
                                onSelectDate={(date) => {
                                  dateHandler(
                                    date,
                                    "start_date",
                                    index,
                                    setEmploymentDetails,
                                    setEmploymentDetailErrors
                                  );
                                  setCurrentHover("");
                                }}
                                styles={
                                  employmentDetailserrors[index]?.start_date
                                    ? calendarErrorClass
                                    : currentHover === "start_date"
                                      ? calendarClassActive
                                      : calendarClass
                                }
                                value={
                                  employmentDetails[index]?.start_date
                                    ? new Date(employmentDetails[index]?.start_date)
                                    : null
                                } className={styles.date_align} />
                            </div>
                            <div className={styles.errorfield}>
                              {employmentDetailserrors[index]?.start_date}
                            </div>
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            className={
                              employmentDetails[index]?.end_date ||
                                employmentDetailserrors[index]?.end_date
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <div
                              id="end_date"
                              onClick={() => hoverHandler("end_date")}
                              onMouseEnter={() => hoverHandler("end_date")}
                              onMouseLeave={() => setCurrentHover("")}
                              className={
                                employmentDetails[index]?.end_date ||
                                  employmentDetailserrors[index]?.end_date ||
                                  currentHover === "end_date"
                                  ? styles.showfield
                                  : styles.hidefield
                              }
                            >
                              <DatePicker
                                placeholder="DD/MM/YYYY"
                                disabled={employmentDetails[index].start_date === "" ? true : false}
                                minDate={employmentDetails[index].start_date ? new Date(employmentDetails[index].start_date) : undefined}
                                onSelectDate={(date) => {
                                  dateHandler(
                                    date,
                                    "end_date",
                                    index,
                                    setEmploymentDetails,
                                    setEmploymentDetailErrors
                                  );
                                  setCurrentHover("");
                                }}
                                styles={
                                  employmentDetailserrors[index]?.end_date
                                    ? calendarErrorClass
                                    : currentHover === "end_date"
                                      ? calendarClassActive
                                      : calendarClass
                                }
                                value={
                                  employmentDetails[index]?.end_date
                                    ? new Date(employmentDetails[index]?.end_date)

                                    : null
                                }
                                className={styles.date_align} />
                            </div>
                            <div className={styles.errorfield}>
                              {employmentDetailserrors[index]?.end_date}
                            </div>
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            className={
                              employmentDetails[index]?.job_role ||
                                employmentDetailserrors[index]?.job_role
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <TextField
                              type="text"
                              name="job_role"
                              onChange={(e) => {
                                inputChangeHandler1(
                                  e,
                                  "job_role",
                                  index,
                                  setEmploymentDetails,
                                  setEmploymentDetailErrors
                                );
                              }}
                              value={employmentDetails[index]?.job_role}
                              errorMessage={
                                employmentDetailserrors[index]?.job_role
                              }
                              styles={Field}
                            />
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            id="work_model"
                            onClick={() => hoverHandler("work_model")}
                            className={
                              employmentDetails[index]?.work_model ||
                                employmentDetailserrors[index]?.work_model ||
                                currentHover === "work_model"
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <Dropdown
                              placeholder="select"
                              options={dropDownWorkModel}
                              onChange={(e, item) => {
                                dropDownHandler1(
                                  e,
                                  item,
                                  "work_model",
                                  index,
                                  setEmploymentDetails,
                                  setEmploymentDetailErrors
                                );
                                setCurrentHover("");
                              }}
                              selectedKey={employmentDetails[index]?.work_model}
                              errorMessage={
                                employmentDetailserrors[index]?.work_model
                              }
                              styles={
                                employmentDetailserrors[index]?.work_model
                                  ? dropDownErrorStyles
                                  : currentHover === "work_model"
                                    ? dropDownStylesActive
                                    : dropDownStyles
                              }
                            />
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            className={
                              employmentDetails[index]?.ctc ||
                                employmentDetailserrors[index]?.ctc
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <TextField
                              type="text"
                              name="ctc"
                              onChange={(e) => {
                                inputChangeHandler1(
                                  e,
                                  "ctc",
                                  index,
                                  setEmploymentDetails,
                                  setEmploymentDetailErrors
                                );
                              }}
                              value={employmentDetails[index]?.ctc}
                              errorMessage={employmentDetailserrors[index]?.ctc}
                              styles={Field}
                            />
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            id="employment_type"
                            onClick={() => hoverHandler("employment_type")}
                            className={
                              employmentDetails[index]?.employment_type ||
                                employmentDetailserrors[index]?.employment_type ||
                                currentHover === "employment_type"
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <Dropdown
                              placeholder="select"
                              options={dropDownEmploymentType}
                              onChange={(e, item) => {
                                dropDownHandler1(
                                  e,
                                  item,
                                  "employment_type",
                                  index,
                                  setEmploymentDetails,
                                  setEmploymentDetailErrors
                                );
                                setCurrentHover("");
                              }}
                              errorMessage={
                                employmentDetailserrors[index]?.employment_type
                              }
                              selectedKey={
                                employmentDetails[index]?.employment_type
                              }
                              styles={
                                employmentDetailserrors[index]?.employment_type
                                  ? dropDownErrorStyles
                                  : currentHover === "employment_type"
                                    ? dropDownStylesActive
                                    : dropDownStyles
                              }
                            />
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            className={
                              employmentDetails[index]?.industry_type ||
                                employmentDetailserrors[index]?.industry_type
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <TextField
                              type="text"
                              name="industry_type"
                              onChange={(e) => {
                                inputChangeHandler1(
                                  e,
                                  "industry_type",
                                  index,
                                  setEmploymentDetails,
                                  setEmploymentDetailErrors
                                );
                              }}
                              value={employmentDetails[index]?.industry_type}
                              errorMessage={
                                employmentDetailserrors[index]?.industry_type
                              }
                              styles={Field}
                            />
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            className={
                              employmentDetails[index]?.c2h_payroll ||
                                employmentDetailserrors[index]?.c2h_payroll
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <TextField
                              type="text"
                              name="c2h_payroll"
                              onChange={(e) => {
                                inputChangeHandler1(
                                  e,
                                  "c2h_payroll",
                                  index,
                                  setEmploymentDetails,
                                  setEmploymentDetailErrors
                                );
                              }}
                              value={employmentDetails[index]?.c2h_payroll}
                              errorMessage={
                                employmentDetailserrors[index]?.c2h_payroll
                              }
                              styles={Field}
                            />
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            className={
                              employmentDetails[index]?.job_skills ||
                                employmentDetailserrors[index]?.job_skills
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <TextField
                              type="text"
                              name="job_skills"
                              onChange={(e) => {
                                inputChangeHandler1(
                                  e,
                                  "job_skills",
                                  index,
                                  setEmploymentDetails,
                                  setEmploymentDetailErrors
                                );
                              }}
                              value={employmentDetails[index]?.job_skills}
                              errorMessage={
                                employmentDetailserrors[index]?.job_skills
                              }
                              styles={Field}
                            />
                          </div>
                        </td>

                        <td className={styles.table_dataContents}>
                          <div
                            className={
                              employmentDetails[index]?.id ||
                                employmentDetailserrors[index]?.id
                                ? styles.showfield
                                : styles.hidefield
                            }
                          >
                            <Icon
                              key={index}
                              iconName="ChromeClose"
                              className={tableCloseIconClass}
                              onClick={() =>
                                handleRemoveItem(
                                  index,
                                  setEmploymentDetails,
                                  setEmploymentDetailErrors
                                )
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.main_information_container2}>
              <div className={styles.preference}>
                <div className={styles.main_basic_information_title}>
                  PREFERENCES
                </div>

                <div className={styles.main_basic_information_container2}>
                  <div className={styles.main_sub_from_field}>
                    <div>Current Location</div>
                    <div
                      id="current_location"
                      onClick={() => hoverHandler("current_location")}
                      className={
                        basicInfo.current_location ||
                          basicInfoerrors.current_location ||
                          currentHover === "current_location"
                          ? styles.showfield
                          : styles.hidefield
                      }
                    >
                      {/* <TextField
                        type="text"
                        name="current_location"
                        onChange={(e) => {
                          inputChangeHandler(
                            e,
                            "current_location",
                            setBasicInfo,
                            setBasicInfoErrors
                          );
                        }}
                        value={basicInfo.current_location}
                        errorMessage={basicInfoerrors.current_location}
                        styles={Field}
                      /> */}

                      <ComboBox
                        type='text'
                        name='current_location'
                        inputChangeHandler={inputChangeHandler}
                        setInfo={setBasicInfo}
                        setInfoErrors={setBasicInfoErrors}
                        value={basicInfo.current_location}
                        errorMessage={basicInfoerrors.current_location}
                        dropdown={dropDownCities}
                        placeholder='Current Location' />
                    </div>
                  </div>

                  <div className={styles.main_sub_from_field}>
                    <div>Willing to relocate</div>
                    <Toggle
                      onText="Yes"
                      offText="No"
                      styles={toggleStyles}
                      checked={toggle}
                      onChange={() => handleToggle()}
                    />
                  </div>

                  <div
                    className={
                      toggle
                        ? `${styles.main_sub_from_field}`
                        : `${styles.main_sub_from_field} ${styles.hider}`
                    }
                  >
                    <div>Prefered Location</div>
                    <div
                      id="prefered_location"
                      onClick={() => hoverHandler("prefered_location")}
                      className={
                        basicInfo.prefered_location ||
                          basicInfoerrors.prefered_location ||
                          currentHover === "prefered_location"
                          ? styles.showfield
                          : styles.hidefield
                      }
                    >
                      {/* <TextField
                        type="text"
                        name="prefered_location"
                        onChange={(e) => {
                          inputChangeHandler(
                            e,
                            "prefered_location",
                            setBasicInfo,
                            setBasicInfoErrors
                          );
                        }}
                        value={basicInfo.prefered_location}
                        errorMessage={basicInfoerrors.prefered_location}
                        styles={Field}
                      /> */}

                      <ComboBox
                        type='text'
                        name='prefered_location'
                        inputChangeHandler={inputChangeHandler}
                        setInfo={setBasicInfo}
                        setInfoErrors={setBasicInfoErrors}
                        value={basicInfo.prefered_location}
                        errorMessage={basicInfoerrors.prefered_location}
                        dropdown={dropDownCities}
                        placeholder='Preferred Location' />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.skillSet}>
                <div className={styles.main_basic_information_title2}>
                  <div>SKILL SET</div>
                  <div
                    className={styles.add_btn}
                    onClick={() =>
                      addField(setSkillSet, setSkillSetErrors, defaultSkillSet)
                    }
                  >
                    + Add
                  </div>
                </div>

                {skillSet.map((detail, index) => (
                  <div
                    key={index}
                    className={styles.main_basic_information_container2}
                  >
                    <div className={styles.main_sub_from_field1}>
                      <div className>Skill Set</div>
                      <div
                        className={
                          skillSet[index]?.skill || skillseterrors[index]?.skill
                            ? styles.showfield
                            : styles.hidefield
                        }
                      >
                        {/* <TextField
                          type="text"
                          name="skill"
                          placeholder={
                            index === 0
                              ? "Primary"
                              : index === 1
                              ? "Secondary"
                              : "Others"
                          }
                          onChange={(e) => {
                            inputChangeHandler1(
                              e,
                              "skill",
                              index,
                              setSkillSet,
                              setSkillSetErrors
                            );
                          }}
                          value={skillSet[index]?.skill}
                          errorMessage={skillseterrors[index]?.skill}
                          styles={Field}
                        /> */}

                        <ComboBox
                          type='text'
                          name='skill'
                          index={index}
                          inputChangeHandler={inputChangeHandler1}
                          setInfo={setSkillSet}
                          setInfoErrors={setSkillSetErrors}
                          value={skillSet[index]?.skill}
                          errorMessage={skillseterrors[index]?.skill}
                          dropdown={dropDownSkills}
                          placeholder={
                            index === 0
                              ? "Primary Skill"
                              : index === 1
                                ? "Secondary Skill"
                                : "Other Skill"
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field1}>
                      <div className={styles.overText}>
                        Relevant Skill Experience
                      </div>
                      <div
                        className={
                          skillSet[index]?.years || skillseterrors[index]?.years
                            ? styles.showfield
                            : styles.hidefield
                        }
                      >
                        <TextField
                          type="text"
                          name="years"
                          placeholder="Years"
                          onChange={(e) => {
                            inputChangeHandler1(
                              e,
                              "years",
                              index,
                              setSkillSet,
                              setSkillSetErrors
                            );
                          }}
                          value={skillSet[index]?.years}
                          errorMessage={skillseterrors[index]?.years}
                          styles={Field}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field1}>
                      <div className={styles.overText1}>
                        Relevant Skill Experience
                      </div>
                      <div
                        className={
                          skillSet[index]?.months ||
                            skillseterrors[index]?.months
                            ? styles.showfield
                            : styles.hidefield
                        }
                      >
                        <TextField
                          type="text"
                          name="months"
                          placeholder="Months"
                          onChange={(e) => {
                            inputChangeHandler1(
                              e,
                              "months",
                              index,
                              setSkillSet,
                              setSkillSetErrors
                            );
                          }}
                          value={skillSet[index]?.months}
                          errorMessage={skillseterrors[index]?.months}
                          styles={Field}
                        />
                      </div>
                    </div>

                    <div className={styles.main_sub_from_field1}>
                      <div
                        className={
                          skillSet[index]?.id || skillseterrors[index]?.id
                            ? styles.showfield
                            : styles.hidefield
                        }
                      >
                        <Icon
                          iconName="ChromeClose"
                          className={tableCloseIconClass}
                          onClick={() =>
                            handleRemoveItem(
                              index,
                              setSkillSet,
                              setSkillSetErrors
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Field(props) {
  return {
    fieldGroup: [
      {
        height: "22px",
        minWidth: "80px",
        maxWidth: "120px",
        border: "0.5px solid transparent",
      },
    ],
  };
}

function Field1(props) {
  return {
    fieldGroup: [
      {
        height: "22px",
        minWidth: "80px",
        maxWidth: "120px",
        border: "0.5px solid transparent",
        backgroundColor: "#EDF2F6",
      },
    ],
  };
}

function FieldError(props) {
  return {
    fieldGroup: [
      {
        height: "22px",
        minWidth: "80px",
        maxWidth: "120px",
        border: "0.5px solid #a80000",
        backgroundColor: "#EDF2F6",
      },
    ],
  };
}

export default EditCandidate;
