import React, { useEffect, useState, useRef } from "react";

import { Modal } from "@fluentui/react";
import { Toggle } from "@fluentui/react/lib/Toggle";
import {
  getNumberFromString,
  isAlphaNumeric,
  isAlphaNumericSpecial,
  isEmpty,
  isNumOnly,
  isObjectPropsEmpty,
  isObjectPropsValid,
} from "../utils/validation";

import styles from "./AddDemandModal.module.css";
import { Icon } from "@fluentui/react/lib/Icon";
import {
  DefaultButton,
  PrimaryButton,
  DatePicker,
  ActionButton,
  Persona,
  PersonaSize,
  Callout,
  CommandBarButton,
} from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { TextField } from "@fluentui/react/lib/TextField";
import { Label } from "@fluentui/react/lib/Label";

import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
// import 'draft-js/dist/Draft.css';
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./DraftEditorResetFix.css";

//icons
import boldicon from "../../src/assets/boldicon.svg";
import undoicon from "../../src/assets/undoicon.svg";
import redoicon from "../../src/assets/redoicon.svg";
import { Popup } from "../components/Popup";

// API
import { axiosPrivateCall } from "../constants";
import { mergeStyles, mergeStyleSets } from "@fluentui/react";
import ComboBox from '../components/ComboBox/ComboBox';

//regex
const vendorRegex = /^[a-zA-Z0-9 @,.()-]*$/;
const jobRRRegex = /^[A-Z0-9]*$/;

const contractIconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
  cursor: "pointer",
});

const closeIconClass = mergeStyles({
  fontSize: 16,
  height: 20,
  width: 20,
  cursor: "pointer",
});

const downIconClass = mergeStyles({
  fontSize: 14,
  height: 20,
  width: 20,
  cursor: "pointer",
});

const textFieldColored = (props, currentHover, error, value) => {
  return {
    fieldGroup: {
      width: "160px",
      height: "22px",
      backgroundColor: "#EDF2F6",
      borderColor: error ? "#a80000" : "transparent",

      selectors: {
        ":focus": {
          borderColor: "rgb(96, 94, 92)",
        },
      },
    },
    field: {
      fontSize: 12,
    },
  };
};

const textField = (props, currentHover, error, value) => {
  return {
    fieldGroup: {
      width: "160px",
      height: "22px",
      borderColor: error ? "#a80000" : "transparent",

      selectors: {
        ":focus": {
          borderColor: "rgb(96, 94, 92)",
        },
      },
    },
    field: {
      fontSize: 12,
    },
    errorMessage: {
      paddingTop: 0,
      position: "absolute",
    },
  };
};

const textField1 = (props, currentHover, error, value) => {
  return {
    fieldGroup: {
      width: "100%",
      height: "22px",
      borderColor: error ? "#a80000" : "transparent",

      selectors: {
        ":focus": {
          borderColor: "rgb(96, 94, 92)",
        },
      },
    },
    field: {
      fontSize: 12,
    },
    errorMessage: {
      paddingTop: 0,
      position: "absolute",
    },
  };
};

const dropDownStylesActive = (props, currentHover, error, value) => {
  return {
    dropdown: {
      width: "160px",
      minWidth: "160px",
      minHeight: "20px",

      // selectors:{

      // 	':focus:':{
      // 		border: '1px solid #0078D4',
      // 		':after':{
      // 			border: currentHover===value ? '1px solid #0078D4 ':  'none',
      // 		}
      // 	}
      // }
    },
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
      // border: error ? '1px solid #a80000': currentHover===value ? '1px solid #0078D4 ':  'none',
      // selectors:{
      // 	':hover':{
      // 		border: '1px solid #0078D4'
      // 	},
      // 	':after':{
      // 		border: error ? '1px solid #a80000': currentHover===value ? '1px solid #0078D4 ':  'none'
      // 	},
      // }
    },
    errorMessage: {
      display: "none",
    },
    caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
    dropdownItem: { minHeight: "22px", fontSize: 12 },
    dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
  };
};

const dropDownStyles = (props, currentHover, error, value) => {
  return {
    dropdown: { width: "160px", minWidth: "160px", minHeight: "20px" },
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
    errorMessage: {
      paddingTop: 0,
      position: "absolute",
    },
  };
};

const dropDownRegularStyles = (props, currentHover, error, value) => {
  return {
    dropdown: {
      width: "100%",
      minHeight: "20px",
      // selectors:{
      // 	':focus':{
      // 		 'border': '1px solid #0078D4 ',
      // 	},

      // 	':focus':{
      // 		':after':{
      // 			border: '1px solid #0078D4 '
      // 		},

      // 	}

      // }
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
      // border: error ? '1px solid #a80000': currentHover === value ? '1px solid #0078D4 ':  'none',
      // selectors:{

      // 	':hover':{
      // 		border: '1px solid #0078D4'
      // 	}
      // }
    },
    caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
    dropdownItem: { minHeight: "22px", fontSize: 12 },
    dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
    dropdownItems: {
      height: 100,
      width: 150,
      overflow: "auto",
    },
    errorMessage: {
      paddingTop: 0,
      position: "absolute",
    },
  };
};

const dropDownRegularNoticeStyles = (props, currentHover, error, value) => {
  return {
    dropdown: { width: "100%", minHeight: "20px" },
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
    errorMessage: {
      paddingTop: 0,
      position: "absolute",
    },
  };
};

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
  };
};

const SkillFieldStyles = (props, currentHover, error, value) => {
  return {
    fieldGroup: {
      height: 22,
      width: "100%",
      borderColor: error ? "#a80000" : "transparent",

      selectors: {
        ":focus": {
          borderColor: "rgb(96, 94, 92)",
        },
      },
    },
    field: {
      fontSize: 12,
    },
    errorMessage: {
      paddingTop: 0,
      position: "absolute",
    },
  };
};

const jobDescriptionStyles = (props, currentHover, error) => {
  return {
    fieldGroup: {
      height: 32,
      width: "100%",
      borderColor: error ? "#a80000" : "transparent",
      selectors: {
        ":after": {
          borderColor: error
            ? " #a80000"
            : currentHover
              ? "#0078D4 "
              : "transparent",
        },
        ":focus": {
          borderColor: "#0078D4",
        },
        ":hover": {
          borderColor: "rgb(96, 94, 92)",
        },
      },
    },
  };
};

const personaStyles = {
  primaryText: {
    height: 16,
  },
};

const personaDropDownStyles = {
  root: {
    margin: "0px 5px",
  },
  primaryText: {
    height: "16",
  },
};

const personaCalloutStyles = {
  calloutMain: {
    "::webkit-scrollbar": {
      display: "none",
    },
  },
};

const addButtonStyles = {
  icon: {
    color: "rgb(50, 49, 48)",
    fontSize: 14,
  },
};

const removeIconClass = mergeStyles({
  fontSize: 10,
  height: "12px",
  width: "12px",
  cursor: "pointer",
  color: "red",
});

const editorToolbarOptions = {
  options: ["inline", "list", "link", "history"],
  inline: {
    bold: { icon: boldicon, className: undefined },
    options: ["bold", "italic", "underline"],
  },
  list: {
    options: ["unordered", "ordered"],
  },
  link: {
    options: ["link"],
  },
  history: {
    options: ["undo", "redo"],
    undo: { icon: undoicon },
    redo: { icon: redoicon },
  },
  // fontFamily: {
  //   options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
  // },
};

const dropDownStatus = [
  { key: "open", text: "Open" },
  { key: "close", text: "Close" },
  { key: "on hold", text: "On Hold" },
  { key: "in progress", text: "In Progress" },
];

const dropDownPriority = [
  { key: "low", text: "Low" },
  { key: "medium", text: "Medium" },
  { key: "high", text: "High" },
];

const dropDownNoticePeriod = [
  { key: "lt15", text: "Immediate" },
  { key: "lt15", text: "< 15 Days" },
  { key: "lt30", text: "< 30 Days" },
  { key: "lt60", text: "< 60 Days" },
  { key: "gt60", text: "> 60 Days" },
];

const dropDownMonth = [
  { key: "0 month", text: "0 month" },
  { key: "1 month", text: "1 month" },
  { key: "2 months", text: "2 months" },
  { key: "3 months", text: "3 months" },
  { key: "4 months", text: "4 Months" },
  { key: "5 months", text: "5 months" },
  { key: "6 months", text: "6 months" },
  { key: "7 months", text: "7 months" },
  { key: "8 months", text: "8 months" },
  { key: "9 months", text: "9 months" },
  { key: "10 months", text: "10 months" },
  { key: "11 months", text: "11 months" },
  { key: "12 months", text: "12 months" },
];

const dropDownYear = [
  { key: "0 year", text: "0 year" },
  { key: "1 year", text: "1 year" },
  { key: "2 years", text: "2 years" },
  { key: "3 years", text: "3 years" },
  { key: "4 years", text: "4 years" },
  { key: "5 years", text: "5 years" },
  { key: "6 years", text: "6 years" },
  { key: "7 years", text: "7 years" },
  { key: "8 years", text: "8 years" },
  { key: "9 years", text: "9 years" },
  { key: "10 years", text: "10 years" },
  { key: "11 years", text: "11 years" },
  { key: "12 years", text: "12 years" },
  { key: "13 years", text: "13 years" },
  { key: "14 years", text: "14 years" },
  { key: "15+ years", text: "15+ years" },
];

const modeOfHireDropdown = [
  { key: "C2H (contract to Hire)", text: "C2H (contract to Hire)" },
  { key: "Permanent", text: "Permanent" },
];

const initialState = {
  job_title: "",
  assigned_to: [],
  status: "",
  no_of_positions: "",
  priority: "",
  client: "",
  job_description: "",
  additional_details: "",
  due_date: "",
  notice_period: "",
  minimum_experience_months: "",
  minimum_experience_years: "",
  maximum_experience_months: "",
  maximum_experience_years: "",
  mode_of_hire: "",
  vendor_name: "",
  poc_vendor: "",
  job_rr_id: "",
};

const sanitizeObject = {
  job_title: "",
  assigned_to: "",
  status: "",
  no_of_positions: "",
  priority: "",
  client: "",
  job_description: "",
  additional_details: "",
  due_date: "",
  notice_period: "",
  minimum_experience: "",
  maximum_experience: "",
  mode_of_hire: "",
  vendor_name: "",
  poc_vendor: "",
  job_rr_id: "",
  skillset: [],
};

const AddDemandModal = (props) => {
  const { isModalOpen, setIsModalOpen, showMessageBar, setShowMessageBar } =
    props;
  const setMatchProfile=props.setMatchProfile;
  const [showPopup, setShowPopup] = useState(false);
  const [currentHover, setCurrentHover] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [personaList, setPersonaList] = useState("");
  const [personaText, setPersonaText] = useState("");
  const [isModalShrunk, setIsModalShrunk] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [dropDownVendors, setDropDownVendors] = useState([]);
  const [dropDownClients, setDropDownClients] = useState([]);
  const [dropDownSkills, setDropDownSkills] = useState([]);

  const personaRef = useRef(null);

  const [isPersonaListLoaded, setIsPersonaListLoaded] = useState(false);

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const [editorState2, setEditorState2] = React.useState(() =>
    EditorState.createEmpty()
  );

  const [errorMessage, setErrorMessage] = useState('');





  useEffect(() => {
    axiosPrivateCall.get(`/api/v1/vendor/listVendors`).then(res => {
      let buffer = res.data;
      let dropdown_data = buffer.map((obj) => { return { key: obj.company_name, text: obj.company_name } });
      setDropDownVendors(dropdown_data)
    }).catch(e => {
      console.log(e)
    })

    axiosPrivateCall.get(`/api/v1/client/listClients`).then(res => {
      let buffer = res.data;
      let dropdown_data = buffer.map((obj) => { return { key: obj.company_name, text: obj.company_name } });
      setDropDownClients(dropdown_data)
    }).catch(e => {
      console.log(e)
    })

    axiosPrivateCall.get(`/api/v1/skill/listSkills`).then(res => {
      let buffer = res.data;
      let dropdown_data = buffer.map((obj) => { return { key: obj.skill_name, text: obj.skill_name } });
      setDropDownSkills(dropdown_data)
    }).catch(e => {
      console.log(e)
    })

  }, [])

  useEffect(() => {
    const contentLength = editorState.getCurrentContent().getPlainText().trim().length;
    if (contentLength === 0) {
      setDemandData((prevData) => {
        return {
          ...prevData,
          job_description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          additional_details: draftToHtml(convertToRaw(editorState2.getCurrentContent())),
        };
      });
    } else if (contentLength < 10) {
      setDemandData((prevData) => {
        return {
          ...prevData,
          job_description: "",
          additional_details: draftToHtml(convertToRaw(editorState2.getCurrentContent())),
        };
      });

    }
    else if (contentLength >= 10) {
      setDemandData((prevData) => {
        return {
          ...prevData,
          job_description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          additional_details: draftToHtml(convertToRaw(editorState2.getCurrentContent())),
        };
      });
    }
  }, [editorState, editorState2]);


  const handleEditorStateChange = (newEditorState) => {
    const content = newEditorState.getCurrentContent().getPlainText().trim();
    if (content.length === 0) {
      setErrorMessage('');
    }
    else if (content.length < 10) {
      setErrorMessage('Minimum 10 characters Required');
    }

    else {
      setErrorMessage('');
    }
    setEditorState(newEditorState);
  };
  useEffect(() => {
    axiosPrivateCall
      .get("/api/v1/employee/getReportsToHierarchy")
      .then((res) => {
        const personaArr = res.data;

        if (personaArr.length) {
          setPersonaList(
            personaArr.map((persona) => {
              return {
                text: persona["first_name"] + " " + persona["last_name"],
                id: persona["_id"],
                imageInitials:
                  persona["first_name"].slice(0, 1).toUpperCase() +
                  persona["last_name"].slice(0, 1).toUpperCase(),
                secondaryText: persona["email"],
                showSecondaryText: true,
              };
            })
          );

          setIsPersonaListLoaded(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function closeHandler() {
    // const demandDataClone =  Object.assign({}, demandData);

    // // deleting array in demandData
    // delete demandDataClone.skillset

    // console.log(isObjectPropsEmpty(demandDataClone),demandDataClone)

    setShowPopup(!showPopup);
  }

  const escKeyHandler = (event) => {
    if (event.key === "Escape") {
      closeHandler();
    }
  };
  const [max_experience, setMax_Experience] = useState([]);
  const list_format = [];

  const maximum_eperience_filter = (min_experience) => {
    dropDownYear.map((value, index) => {
      if (min_experience === value.text) {
        for (let i = index; i <= dropDownYear.length - 1; i++) {
          list_format.push(dropDownYear[i]);
        }

        return setMax_Experience(list_format);
      }
    });
  };
  const [min_experience, setMin_Experience] = useState([]);

  const min_experience_list = [];
  const minimum_eperience_filter = (max_experience) => {
    dropDownYear.map((value, index) => {
      if (max_experience === value.text) {
        for (let i = index; i > 0; i--) {
          min_experience_list.push(dropDownYear[i]);
        }
        console.log(min_experience_list, "mmm");
        return setMin_Experience(min_experience_list);
      }
    });
  };
  useEffect(() => {
    maximum_eperience_filter();
    minimum_eperience_filter();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escKeyHandler, { capture: true });
    return () => {
      document.removeEventListener("keydown", escKeyHandler, { capture: true });

      console.log("removed key handler");
    };
  }, []);

  const [demandData, setDemandData] = useState({
    ...initialState,
    skillset: [
      {
        skill: "",
        years: "",
        months: "",
      },
    ],
  });

  const [errors, setErrors] = useState({
    ...initialState,
    skillset: [
      {
        skill: "",
        years: "",
        months: "",
      },
    ],
  });

  const dropDownHandler = (e, item, name) => {
    setDemandData((prevData) => {
      return {
        ...prevData,
        [name]: item.text,
      };
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const hoverHandler = (name) => {
    setCurrentHover(name);
  };

  const skillSetDropDownHandler = (e, item, name, index, arr) => {
    const skillsetArr = arr;

    skillsetArr[index][name] = item;
    setDemandData((prevData) => {
      return {
        ...prevData,
        skillset: skillsetArr,
      };
    });

    setErrors((prevData) => {
      const skillsetArr = errors.skillset;
      skillsetArr[index][name] = "";
      return {
        ...prevData,
        skillset: skillsetArr,
      };
    });
  };

  const skillSetInputHandler = (e, name, index, arr) => {
    const skillsetArr = arr;

    let value = e.target.value;

    let isSkillInputValid = true;

    if (name === "years") {
      if (!isNumOnly(value)) {
        isSkillInputValid = false;
      }

      if (isEmpty(value)) {
        isSkillInputValid = true;
      }
    }

    if (name === "months") {
      if (!isNumOnly(value) || value > 12) {
        isSkillInputValid = false;
      }

      if (isEmpty(value)) {
        isSkillInputValid = true;
      }
    }

    if (isSkillInputValid) {
      skillsetArr[index][name] = value;
      setDemandData((prevData) => {
        return {
          ...prevData,
          skillset: skillsetArr,
        };
      });

      setErrors((prevData) => {
        const skillsetArr = prevData["skillset"];
        skillsetArr[index][name] = "";
        return {
          ...prevData,
          skillset: skillsetArr,
        };
      });
    }
  };

  const removeSkill = (skillData, index, arr) => {
    if (index === 0) return;

    const newskillsetArr = arr.filter((val) => val !== skillData);

    setDemandData((prevData) => {
      return {
        ...prevData,
        skillset: newskillsetArr,
      };
    });

    const newskillsetErrArr = errors.skillset.filter((val, i) => i !== index);

    setErrors((prevData) => {
      return {
        ...prevData,
        skillset: newskillsetErrArr,
      };
    });
  };

  const dateHandler = (date, name) => {
    setDemandData((prevData) => {
      return {
        ...prevData,
        [name]: date,
      };
    });
    setErrors({
      ...errors,
      [name]: "",
    });

    setCurrentHover("");
  };

  const inputChangeHandler = (e, inputName) => {
    e.preventDefault();
    const { value } = e.target;
    let inputValue = value;

    let isInputValid = true;

    if (inputName === "no_of_positions") {
      if (!isNumOnly(value)) {
        isInputValid = false;
      }

      if (isEmpty(value)) {
        isInputValid = true;
      }
    }

    if (inputName === "vendor_name") {
      isInputValid = vendorRegex.test(value);
    }

    if (inputName === "job_rr_id") {
      // if(!isAlphaNumeric(value)){
      // 	isInputValid = false;
      // }
      // if(isEmpty(value)){
      // 	isInputValid =true
      // }
      isInputValid = jobRRRegex.test(value);
    }

    if (inputName === "no_of_positions") {
      inputValue = Number(inputValue);

      if (isEmpty(value)) {
        inputValue = "";
      }
    }

    if (isInputValid) {
      setDemandData({
        ...demandData,
        [inputName]: inputValue,
      });
      setErrors({
        ...errors,
        [inputName]: "",
      });
    }
  };

  const addSkillSet = () => {
    const skillsetArr = demandData.skillset;
    skillsetArr.push({
      skill: "",
      years: "",
      months: "",
    });

    setDemandData((prevData) => {
      return {
        ...prevData,
        skillset: skillsetArr,
      };
    });

    const skillsetErrArr = errors.skillset;

    skillsetErrArr.push({
      skill: "",
      years: "",
      months: "",
    });

    setErrors((prevData) => {
      return {
        ...prevData,
        skillset: skillsetErrArr,
      };
    });
  };

  const modalSizeHandler = () => {
    setIsModalShrunk(!isModalShrunk);
  };

  const personaClickHandler = (persona) => {
    setDemandData((prevState) => {
      setPersonaText(persona.secondaryText);

      console.log(persona);
      return {
        ...prevState,
        assigned_to: persona.id,
        // assigned_to: '6387afcc7c36709133213e03',
      };
    });

    setErrors((prevData) => {
      return {
        ...prevData,
        assigned_to: "",
      };
    });
    setIsPersonaOpen(!isPersonaOpen);
  };

  const getErrorObj = (obj) => {
    const errorObj = {};
    let min_month = (parseInt(getNumberFromString(obj.minimum_experience_months)))
    let max_month = (parseInt(getNumberFromString(obj.maximum_experience_months)))
    let min_year = (parseInt(getNumberFromString(obj.minimum_experience_years)))
    let max_year = (parseInt(getNumberFromString(obj.maximum_experience_years)))
    for (const [key, value] of Object.entries(obj)) {
      // if (key === "job_description") {
      //   if (value.length <= 17) {
      //     errorObj[key] = "Required";
      //     continue;
      //   }
      // }

      if (Array.isArray(value)) {
        errorObj[key] = [];
        value.map((data, index) => {
          let newErrObj = {};

          Object.keys(data).map((key) => {
            if (isEmpty(data[key])) {
              return (newErrObj[key] = "Required");
            } else {
              return (newErrObj[key] = "");
            }
          });
          return (errorObj[key][index] = newErrObj);
        });
      } else if (isEmpty(value)) {
        errorObj[key] = "Required";
      } else {
        errorObj[key] = "";
      }
      if (min_year > max_year) {
        errorObj["maximum_experience_years"] = " Min exp exceeds max exp."
      } else if (key === 'maximum_experience_months') {
        const min_experience_total = min_year * 12 + min_month;
        const max_experience_total = max_year * 12 + max_month;
        if (min_experience_total > max_experience_total) {
          errorObj[key] = "Min exp exceeds max exp."
        }
      }
    }

    return errorObj;
  };

  const sanitizer = (data) => {
    const sanitizedData = {};

    console.log(data, "oooooooo");
    Object.keys(data).forEach((key) => {
      if (key === "skillset") {
        sanitizedData[key] = [];

        data["skillset"].map((skillObj, index) => {
          console.log(skillObj, index);
          sanitizedData[key].push({});
          sanitizedData[key][index]["skill"] = skillObj["skill"];
          sanitizedData[key][index]["exp"] =
            Number(skillObj["years"] * 12) + Number(skillObj["months"]);
        });
        return;
      }

      if (key === "minimum_experience_years") {
        return (sanitizedData["minimum_experience"] = sanitizedData[
          "minimum_experience"
        ]
          ? parseInt(data[key]) * 12 + sanitizedData["minimum_experience"]
          : parseInt(getNumberFromString(data[key]) * 12));
      }

      if (key === "minimum_experience_months") {
        return (sanitizedData["minimum_experience"] = sanitizedData[
          "minimum_experience"
        ]
          ? parseInt(data[key]) + sanitizedData["minimum_experience"]
          : parseInt(getNumberFromString(data[key])));
      }

      if (key === "maximum_experience_years") {
        return (sanitizedData["maximum_experience"] = sanitizedData[
          "maximum_experience"
        ]
          ? parseInt(data[key]) * 12 + sanitizedData["maximum_experience"]
          : parseInt(getNumberFromString(data[key]) * 12));
      }

      if (key === "maximum_experience_months") {
        return (sanitizedData["maximum_experience"] = sanitizedData[
          "maximum_experience"
        ]
          ? parseInt(data[key]) + sanitizedData["maximum_experience"]
          : parseInt(getNumberFromString(data[key])));
      }

      sanitizedData[key] = data[key];
    });

    return sanitizedData;
  };

  const createDemand = () => {
    axiosPrivateCall
      .post("/api/v1/demand/createDemand", sanitizer(demandData))
      .then((res) => {
        
        setMatchProfile(res.data.match)
        setIsLoading(false);
        setShowMessageBar(!showMessageBar);
        setIsModalOpen(!isModalOpen);
      })
      .catch((e) => {
        console.log(e);
      });
  };





  const submitHandler = () => {
    if (!isLoading) {
      setIsLoading(true);
    }

    const errorObj = getErrorObj(demandData);
    console.log(errorObj);
    setErrors(errorObj);

    if (isDemandDataValid(demandData)) {
      console.log("valid");
      createDemand();
    } else {
      console.log("not valid");
    }
  };







  // validations

  // const isDemandDataValid = (obj) => {
  //   for (const [key, value] of Object.entries(obj)) {
  //     if (key === "job_description" && value.length <= 17) {
  //       return false;
  //     }

  //     if (Array.isArray(value)) {
  //       return value.every((data, index) => {
  //         return Object.values(data).every((val) => !isEmpty(val));
  //       });
  //     }

  //     if (isEmpty(value)) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const isDemandDataValid = (obj) => {
    const excludedFields = [
      "vendor_name",
      "poc_vendor",
      "job_rr_id",
      "assigned_to",
    ];
    let min_month = (parseInt(getNumberFromString(obj.minimum_experience_months)))
    let max_month = (parseInt(getNumberFromString(obj.maximum_experience_months)))
    let min_year = (parseInt(getNumberFromString(obj.minimum_experience_years)))
    let max_year = (parseInt(getNumberFromString(obj.maximum_experience_years)))
    for (const [key, value] of Object.entries(obj)) {
      if (excludedFields.includes(key)) {
        continue; // skip validation for excluded fields
      }

      // if (key === "job_description" && value.length <= 17) {
      //   return false;
      // }

      if (Array.isArray(value)) {
        return value.every((data, index) => {
          return Object.values(data).every((val) => !isEmpty(val));
        });
      }

      if (isEmpty(value)) {
        return false;
      }
      if (errors.maximum_experience_years === "Min exp exceeds max exp.") {
        return false;
      }
      const min_experience_total = min_year * 12 + min_month;
      const max_experience_total = max_year * 12 + max_month;
      if (min_experience_total > max_experience_total) {
        return false;
      }
    }
    return true;
  };

  // added refresh key

  window.addEventListener("beforeunload", function (e) {
    // Cancel the event
    e.returnValue = "Are you sure?";
  });
  window.addEventListener("unload", function (e) {
    // Cancel the event
    axiosPrivateCall.post('/api/v1/employee/logoutEmployee', {}).then((res) => { console.log(res); localStorage.removeItem("token"); }).catch(e => console.log(e))
  });

  //   const [dueDate, setDueDate] = useState(null);
  let minDate = new Date(); // Today's date as minimum date

  //   const handleDueDateChange = (date) => {
  // 	if (date < minDate) {
  // 	  // Prevent selecting past dates
  // 	  setDueDate(null);
  // 	//   alert('Please select a future date for the due date.');
  // 	} else {
  // 	  setDueDate(date);
  // 	}
  //   };

  // POC Vendor Name 
  function isValidInput(input) {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(input);
  }
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
      <Modal
        id="Modal12"
        scrollableContentClassName={styles.adddemand_modal_scrollable_content}
        containerClassName={`${isModalShrunk
            ? styles.adddemand_modal_container_shrunk
            : styles.adddemand_modal_container
          }`}
        isOpen={isModalOpen}
      >
        <div className={styles.adddemand_modal_header_container}>
          <div className={styles.header_tag_expand_close_icon_container}>
            <div className={styles.header_tag_container}>Demand</div>

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
                onClick={() => setShowPopup(!showPopup)}
                className={styles.header_close_icon_container}
              >
                <Icon iconName="ChromeClose" className={closeIconClass} />
              </div>
            </div>
          </div>

          <div className={styles.header_content_container}>
            <div
              className={
                styles.header_content_job_description_unassigned_save_container
              }
            >
              <div
                className={
                  styles.header_content_job_description_unassigned_container
                }
              >
                <div
                  className={styles.header_content_job_description_container}
                >
                  <div onClick={() => setCurrentHover("job_title")}>
                    <TextField
                      value={demandData.job_title}
                      onChange={(e) => {
                        inputChangeHandler(e, "job_title");
                      }}
                      styles={(props) =>
                        jobDescriptionStyles(
                          props,
                          currentHover,
                          errors.job_title
                        )
                      }
                      placeholder="Enter the Job Requirement Title"
                      resizable={false}
                    />
                  </div>
                </div>
                <div>
                  <div
                    ref={personaRef}
                    id="personaId"
                    // onClick={() => {
                    //   setCurrentHover("assigned_to");
                    //   setIsPersonaOpen(!isPersonaOpen);
                    // }}
                    className={styles.unassigned_container}
                  >
                    <div className={styles.unassigned_title_icon_container}>
                      <div className={styles.unassigned_title_container}>
                        {/* {demandData.assigned_to === ""
                          ? "Unassigned"
                          : personaList
                              .filter(
                                (person) => person.id === demandData.assigned_to
                              )
                              .map((person) => (
                                <Persona
                                  {...person}
                                  styles={personaStyles}
                                  text={person.text}
                                  secondaryText={personaText}
                                  size={PersonaSize.size24}
                                />
                              ))} */}
                        {"Unassigned"}
                      </div>
                      {/* <div className={styles.unassigned_icon_container}>
                        {
                          <Icon
                            iconName="ChevronDown"
                            className={downIconClass}
                          />
                        }
                      </div> */}
                    </div>
                    {isPersonaOpen && (
                      <Callout
                        isBeakVisible={false}
                        calloutMaxHeight={145}
                        target={"#personaId"}
                        onDismiss={() => {
                          setIsPersonaOpen(false);
                          setCurrentHover("");
                        }}
                      >
                        {isPersonaListLoaded &&
                          personaList.map((person) => {
                            return (
                              <div
                                onClick={() => {
                                  personaClickHandler(person);
                                  setCurrentHover("");
                                }}
                                className={styles.persona_list}
                              >
                                <Persona
                                  {...person}
                                  text={person.text}
                                  styles={personaDropDownStyles}
                                  secondaryText={person.secondaryText}
                                  size={PersonaSize.size24}
                                />
                              </div>
                            );
                          })}
                      </Callout>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.header_save_close_btns_container}>
                <PrimaryButton
                  onClick={submitHandler}
                  text="Save & Close"
                  iconProps={{ iconName: "Save" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.main_filter_options_container}>
          <div className={styles.main_filter_options_sub_container}>
            <div className={styles.main_role_dropdown_container}>
              <div className={styles.main_role_title}>
                <Label className={styles.required_field} required>
                  Status
                </Label>
              </div>
              <div onClick={() => setCurrentHover("status")}>
                <Dropdown
                  onChange={(e, item) => {
                    dropDownHandler(e, item, "status");
                    setCurrentHover("");
                  }}
                  placeholder="Select"
                  notifyOnReselect
                  styles={(props) =>
                    dropDownStylesActive(
                      props,
                      currentHover,
                      errors.status,
                      "status"
                    )
                  }
                  errorMessage={errors.status}
                  options={dropDownStatus}
                />
              </div>
            </div>
            <div className={styles.main_role_dropdown_container}>
              <div className={styles.main_role_title}>
                <Label className={styles.required_field} required>
                  No of Positions
                </Label>
              </div>
              <div onClick={() => setCurrentHover("no_of_positions")}>
                {/* <Dropdown  onChange={(e,item)=>{dropDownHandler(e,item,"no_of_positions")}} placeholder='select an option' styles={errors.no_of_positions ? dropDownErrorStyles : dropDownStyles} options={dropDownOptions}/> */}
                <TextField
                  value={demandData.no_of_positions}
                  onChange={(e) => {
                    inputChangeHandler(e, "no_of_positions");
                  }}
                  placeholder={"Enter the count"}
                  styles={(props) =>
                    textFieldColored(
                      props,
                      currentHover,
                      errors.no_of_positions,
                      "no_of_positions"
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div className={styles.main_filter_options_sub_container}>
            <div className={styles.main_role_dropdown_container}>
              <div className={styles.main_role_title}>
                <Label className={styles.required_field} required>
                  Priority
                </Label>{" "}
              </div>
              <div onClick={() => setCurrentHover("priority")}>
                <Dropdown
                  onChange={(e, item) => {
                    dropDownHandler(e, item, "priority");
                    setCurrentHover("");
                  }}
                  placeholder="Select"
                  notifyOnReselect
                  styles={(props) =>
                    dropDownStylesActive(
                      props,
                      currentHover,
                      errors.priority,
                      "priority"
                    )
                  }
                  options={dropDownPriority}
                />
              </div>
            </div>
            <div className={styles.main_role_dropdown_container}>
              <div className={styles.main_role_title}>
                <Label className={styles.required_field} required>
                  Client
                </Label>
              </div>
              <div onClick={() => setCurrentHover("client")}>
                {/* <TextField
                  value={demandData.client}
                  onChange={(e, item) => {
                    inputChangeHandler(e, "client");
                  }}
                  placeholder="Enter Client Name"
                  styles={(props) =>
                    textFieldColored(
                      props,
                      currentHover,
                      errors.client,
                      "client"
                    )
                  }
                /> */}

                <ComboBox
                  type='text'
                  name='client'
                  inputChangeHandler={inputChangeHandler}
                  setInfo={setDemandData}
                  setInfoErrors={setErrors}
                  value={demandData.client}
                  errorMessage={errors.client}
                  dropdown={dropDownClients}
                  textfield='color'
                  placeholder='Enter client name' />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.main_information_container}>
          <div className={styles.main_information_sub_container_left}>
            <div
              className={styles.main_job_description_demand_vendor_container}
            >
              <div className={styles.main_basic_information_title}>
                {/* <Label style={{ fontSize: "12px" }} required> */}
                JOB DESCRIPTION
                {/* </Label> */}
              </div>

              <div
                className={`${styles.main_wysiwyg_container} ${errors.job_description
                    ? styles.main_wysiwyg_container_error
                    : ""
                  } 
								${demandData.job_description.length > 8
                    ? styles.main_wysiwyg_container_focus
                    : ""
                  }`}
              >
                <Editor
                  wrapperClassName={styles.editor_wrapper}
                  toolbar={editorToolbarOptions}
                  toolbarOnFocus
                  toolbarClassName={styles.editor_toolbar}
                  editorClassName={styles.editor_editor}
                  placeholder="Click to add description (Minimum 10 characters)"
                  editorState={editorState}
                  onEditorStateChange={handleEditorStateChange}
                />
              </div>
              <div className={styles.error}>{errorMessage && <p>{errorMessage}</p>}</div>
            </div>
            <div
              className={styles.main_job_description_demand_vendor_container}
            >
              <div className={styles.main_basic_information_title}>
                <Label style={{ fontSize: "12px" }}>
                  ADDITIONAL INFORMATION
                </Label>
              </div>

              <div
                className={`${styles.main_wysiwyg_container} ${demandData.additional_details.length > 8
                    ? styles.main_wysiwyg_container_focus
                    : ""
                  }`}
              >
                <Editor
                  wrapperClassName={styles.editor_wrapper}
                  placeholder="Click to add description"
                  toolbarOnFocus
                  toolbarClassName={styles.editor_toolbar}
                  editorClassName={styles.editor_editor}
                  toolbar={editorToolbarOptions}
                  editorState={editorState2}
                  onEditorStateChange={(editorState2) =>
                    setEditorState2(editorState2)
                  }
                />
              </div>
            </div>
          </div>
          <div className={styles.main_information_sub_container_right}>
            <div className={styles.main_right_demand_vendor_info_container}>
              <div className={styles.main_right_demand_info_container}>
                <div className={styles.main_basic_information_title}>
                  <Label style={{ fontSize: "12px" }} required>
                    DEMAND INFORMATION
                  </Label>
                </div>
                <div
                  className={styles.main_right_demand_info_content_container}
                >
                  <div
                    className={
                      styles.demand_info_duedate_min_experience_container
                    }
                  >
                    <div className={styles.demand_info_due_date_title}>
                      <Label className={styles.required_field} required>
                        Due Date
                      </Label>
                    </div>
                    <div
                      className={styles.demand_info_due_date_dropdown_container}
                    >
                      <div onClick={() => setCurrentHover("due_date")}>
                        <DatePicker
                          placeholder={"DD/MM/YYYY"}
                          minDate={minDate}
                          styles={(props) =>
                            calendarClass(
                              props,
                              currentHover,
                              errors.due_date,
                              "due_date"
                            )
                          }
                          onSelectDate={(date) => {
                            dateHandler(date, "due_date");
                          }}
                        />
                        {errors.due_date && (
                          <div className={styles.custom_error_message}>
                            <span>{errors.due_date}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.demand_info_min_experience_title}>
                      <Label className={styles.required_field} required>
                        Minimum Experience
                      </Label>
                    </div>
                    <div
                      className={
                        styles.demand_info_min_experience_dropdown_container
                      }
                    >
                      <div
                        className={
                          styles.demand_info_min_experience_dropdown_container_half
                        }
                      >
                        <div
                          onClick={() =>
                            setCurrentHover("minimum_experience_years")
                          }
                        >
                          <Dropdown
                            onChange={(e, item) => {
                              dropDownHandler(
                                e,
                                item,
                                "minimum_experience_years"
                              );
                              maximum_eperience_filter(item.key);
                              setCurrentHover("");
                            }}
                            defaultSelectedKey={
                              demandData.minimum_experience_years
                            }
                            errorMessage={errors.minimum_experience_years}
                            placeholder="Years"
                            notifyOnReselect
                            styles={(props) =>
                              dropDownRegularStyles(
                                props,
                                currentHover,
                                errors.minimum_experience_years,
                                "minimum_experience_years"
                              )
                            }
                            options={
                              demandData.maximum_experience_years === ""
                                ? dropDownYear
                                : min_experience
                            }
                          />
                        </div>
                      </div>
                      <div
                        className={
                          styles.demand_info_min_experience_dropdown_container_half
                        }
                      >
                        <div
                          onClick={() =>
                            setCurrentHover("minimum_experience_months")
                          }
                        >
                          <Dropdown
                            onChange={(e, item) => {
                              dropDownHandler(
                                e,
                                item,
                                "minimum_experience_months"
                              );
                              setCurrentHover("");
                            }}
                            errorMessage={errors.minimum_experience_months}
                            placeholder="Months"
                            notifyOnReselect
                            styles={(props) =>
                              dropDownRegularStyles(
                                props,
                                currentHover,
                                errors.minimum_experience_months,
                                "minimum_experience_months"
                              )
                            }
                            options={dropDownMonth}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      styles.demand_info_notice_period_min_experience_container
                    }
                  >
                    <div className={styles.demand_info_notice_period_title}>
                      <Label className={styles.required_field} required>
                        Notice Period
                      </Label>
                    </div>
                    <div
                      className={
                        styles.demand_info_notice_period_dropdown_container
                      }
                    >
                      <div onClick={() => setCurrentHover("notice_period")}>
                        <Dropdown
                          onChange={(e, item) => {
                            dropDownHandler(e, item, "notice_period");
                            setCurrentHover("");
                          }}
                          placeholder={"Select"}
                          notifyOnReselect
                          errorMessage={errors.notice_period}
                          styles={(props) =>
                            dropDownRegularNoticeStyles(
                              props,
                              currentHover,
                              errors.notice_period,
                              "notice_period"
                            )
                          }
                          options={dropDownNoticePeriod}
                        />
                      </div>
                    </div>
                    <div className={styles.demand_info_max_experience_title}>
                      <Label className={styles.required_field} required>
                        Maximum Experience
                      </Label>
                    </div>
                    <div
                      className={
                        styles.demand_info_max_experience_dropdown_container
                      }
                    >
                      <div
                        className={
                          styles.demand_info_min_experience_dropdown_container_half
                        }
                      >
                        <div
                          onClick={() =>
                            setCurrentHover("maximum_experience_years")
                          }
                        >
                          <Dropdown
                            onChange={(e, item) => {
                              dropDownHandler(
                                e,
                                item,
                                "maximum_experience_years"
                              );
                              minimum_eperience_filter(item.key);
                              setCurrentHover("");
                            }}
                            defaultSelectedKey={
                              demandData.maximum_experience_years
                            }
                            placeholder="Years"
                            notifyOnReselect
                            errorMessage={errors.maximum_experience_years}
                            styles={(props) =>
                              dropDownRegularStyles(
                                props,
                                currentHover,
                                errors.maximum_experience_years,
                                "maximum_experience_years"
                              )
                            }
                            options={
                              demandData.minimum_experience_years === ""
                                ? dropDownYear
                                : max_experience
                            }
                          />
                        </div>
                      </div>
                      <div
                        className={
                          styles.demand_info_min_experience_dropdown_container_half
                        }
                      >
                        <div
                          onClick={() =>
                            setCurrentHover("maximum_experience_months")
                          }
                        >
                          <Dropdown
                            onChange={(e, item) => {
                              dropDownHandler(
                                e,
                                item,
                                "maximum_experience_months"
                              );
                              setCurrentHover("");
                            }}
                            placeholder="Months"
                            notifyOnReselect
                            errorMessage={errors.maximum_experience_months}
                            styles={(props) =>
                              dropDownRegularStyles(
                                props,
                                currentHover,
                                errors.maximum_experience_months,
                                "maximum_experience_months"
                              )
                            }
                            options={dropDownMonth}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.vendor_info_mode_of_hire_title}>
                    <Label className={styles.required_field} required>
                      Mode of Hire
                    </Label>
                  </div>
                  <div
                    className={
                      styles.vendor_info_mode_of_hire_dropdown_container
                    }
                  >
                    <div onClick={() => setCurrentHover("mode_of_hire")}>
                      <Dropdown
                        onChange={(e, item) => {
                          dropDownHandler(e, item, "mode_of_hire");
                          setCurrentHover("");
                        }}
                        placeholder="Select"
                        notifyOnReselect
                        styles={(props) =>
                          dropDownStyles(
                            props,
                            currentHover,
                            errors.mode_of_hire,
                            "mode_of_hire"
                          )
                        }
                        options={modeOfHireDropdown}
                        errorMessage={errors.mode_of_hire}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.main_right_vendor_info_container}>
                <div className={styles.main_basic_information_title}>
                  <Label style={{ fontSize: "12px" }}>
                    VENDOR INFORMATION{" "}
                  </Label>
                </div>
                <div
                  className={styles.main_right_vendor_info_content_container}
                >
                  <div
                    className={
                      styles.vendor_info_mode_of_hire_point_of_contact_vendor_job_rr_id_container
                    }
                  >
                    <div
                      className={
                        styles.vendor_info_point_of_contact_vendor_title
                      }
                    >
                      <Label className={styles.required_field}>
                        Vendor Name
                      </Label>
                    </div>
                    <div
                      className={
                        styles.vendor_info_point_of_contact_vendor_dropdown_container
                      }
                    >
                      <div onClick={() => setCurrentHover("vendor_name")}>
                        {/* <TextField
                            value={demandData.vendor_name}
                            onChange={(e) => {
                              inputChangeHandler(e, "vendor_name");
                              setCurrentHover("");
                            }}
                            placeholder={"Vendor Name"}
                            // errorMessage={errors.vendor_name}
                            styles={(props) =>
                              textField(
                                props,
                                currentHover
                                // errors.vendor_name,
                                // "vendor_name"
                              )
                            }
                          /> */}

                        <ComboBox
                          type='text'
                          name='vendor_name'
                          inputChangeHandler={inputChangeHandler}
                          setInfo={setDemandData}
                          setInfoErrors={setErrors}
                          value={demandData.vendor_name}
                          // errorMessage={errors.vendor_name}
                          dropdown={dropDownVendors}
                          placeholder='Vendor Name' />
                      </div>
                    </div>

                    <div
                      className={
                        styles.vendor_info_point_of_contact_vendor_title
                      }
                    >
                      <Label className={styles.required_field}>
                        Point of contact Vendor
                      </Label>
                    </div>
                    <div
                      className={
                        styles.vendor_info_point_of_contact_vendor_dropdown_container
                      }
                    >
                      <div onClick={() => setCurrentHover("poc_vendor")}>
                        <TextField
                          value={demandData.poc_vendor}
                          onChange={(e) => {
                            if (isValidInput(e.target.value)) {
                              inputChangeHandler(e, "poc_vendor");
                              setCurrentHover("");
                            }
                          }}
                          placeholder={"POC Vendor Name"}
                          styles={(props) =>
                            textField(
                              props,
                              currentHover
                              // errors.poc_vendor,
                              // "poc_vendor"
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.vendor_info_job_rr_id_title}>
                      <Label className={styles.required_field}>Job/RR ID</Label>
                    </div>
                    <div
                      className={
                        styles.vendor_info_job_rr_id_dropdown_container
                      }
                    >
                      <div>
                        {/* <Dropdown onChange={(e,item)=>{dropDownHandler(e,item,"job_rr_id")}}
													errorMessage={errors.job_rr_id} placeholder='Select' styles={dropDownStyles} options={dropDownOptions}/> */}
                        <TextField
                          value={demandData.job_rr_id}
                          onChange={(e) => {
                            inputChangeHandler(e, "job_rr_id");
                          }}
                          placeholder={"Enter ID"}
                          // errorMessage={errors.job_rr_id}
                          styles={(props) =>
                            textField(
                              props,
                              currentHover
                              // errors.job_rr_id,
                              // "poc_vendor"
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.main_right_skillset_container}>
              <div
                className={styles.main_right_skill_set_title_add_icon_container}
              >
                <div className={styles.main_right_skill_set_title}>
                  <Label style={{ fontSize: "12px" }} required>
                    SKILL SET
                  </Label>
                </div>
                <div
                  onClick={addSkillSet}
                  className={styles.main_right_add_icon_container}
                >
                  <CommandBarButton
                    styles={addButtonStyles}
                    iconProps={{ iconName: "Add" }}
                    text="Add "
                  />
                </div>
              </div>
              <div className={styles.main_right_skill_set_experience_container}>
                <div
                  className={
                    styles.main_right_skill_set_title_dropdown_container
                  }
                >
                  <div className={styles.main_right_skill_set_title_sub_title}>
                    <Label className={styles.required_field} required>
                      Skill Set
                    </Label>
                  </div>
                  {demandData.skillset.map((skillData, index, arr) => {
                    return (
                      <div
                        className={
                          styles.main_right_skill_set_dropdown_container
                        }
                      >
                        <div>
                          {/* <Dropdown   selectedKey={skillData.skill ? skillData.skill.key : undefined}  onChange={(e,item)=>{skillSetDropDownHandler(e,item,'skill',index,arr)}} placeholder='Select'
													errorMessage={errors.skillset[index]?.skill} styles={dropDownMediumStyles} options={dropDownOptions}/> */}
                          {/* <TextField
                            value={demandData.skillset[index]?.skill}
                            onClick={() => setCurrentHover(`skill${index}`)}
                            onChange={(e) => {
                              skillSetInputHandler(e, "skill", index, arr);
                              setCurrentHover("");
                            }}
                            errorMessage={errors.skillset[index]?.skill}
                            placeholder={
                              index === 0
                                ? "Primary Skill Set"
                                : index === 1
                                ? "Secondary Skill Set"
                                : "Other Skills"
                            }
                            styles={(props) =>
                              textField1(
                                props,
                                currentHover,
                                errors.skillset[index]?.skill,
                                `skill${index}`
                              )
                            }
                          />  */}


                          <ComboBox
                            type='text'
                            name={`skill`}
                            index={index}
                            skillArr={true}
                            arr={arr}
                            setInfo={setDemandData}
                            setInfoErrors={setErrors}
                            inputChangeHandler={skillSetInputHandler}
                            value={demandData.skillset[index]?.skill}
                            errorMessage={errors.skillset[index]?.skill}
                            dropdown={dropDownSkills}
                            placeholder={
                              index === 0
                                ? "Primary Skill Set"
                                : index === 1
                                  ? "Secondary Skill Set"
                                  : "Other Skills"
                            } />


                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.main_right_skill_experience_container}>
                  <div
                    className={
                      styles.main_right_skill_experience_title_sub_title
                    }
                  >
                    <Label className={styles.required_field} required>
                      Relevant Skill Experience
                    </Label>
                  </div>

                  <div>
                    {demandData.skillset.map((skillData, index, arr) => {
                      return (
                        <div
                          className={
                            styles.main_right_skill_experience_dropdown_remove_icon_container
                          }
                        >
                          <div
                            className={
                              styles.main_right_skill_experience_dropdown_container
                            }
                          >
                            <div
                              onClick={() => setCurrentHover(`years${index}`)}
                            >
                              <TextField
                                value={demandData.skillset[index]?.years}
                                errorMessage={errors.skillset[index]?.years}
                                onChange={(e) => {
                                  skillSetInputHandler(e, "years", index, arr);
                                }}
                                placeholder="Years"
                                styles={(props) =>
                                  SkillFieldStyles(
                                    props,
                                    currentHover,
                                    errors.skillset[index]?.years,
                                    `years${index}`
                                  )
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                value={demandData.skillset[index]?.months}
                                errorMessage={errors.skillset[index]?.months}
                                onChange={(e) => {
                                  skillSetInputHandler(e, "months", index, arr);
                                }}
                                placeholder="Months"
                                styles={(props) =>
                                  SkillFieldStyles(
                                    props,
                                    currentHover,
                                    errors.skillset[index]?.months,
                                    `years${index}`
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Icon
                              iconName="ChromeClose"
                              className={removeIconClass}
                              onClick={() => removeSkill(skillData, index, arr)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddDemandModal;
