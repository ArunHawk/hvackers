import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  TextField,
  Checkbox,
  Text,
  Toggle,
  TagPicker,
} from "@fluentui/react";
import styles from "../SeachComponent/SearchPopup.module.css";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { IconButton, PrimaryButton } from "@fluentui/react/lib/Button";
import {
  mergeStyleSets,
  mergeStyles,
  initializeIcons,
  FontIcon,
} from "@fluentui/react";
import { Stack, DefaultButton } from "@fluentui/react";
import { Icon } from "@fluentui/react";
import { axiosPrivateCall } from "../../constants";
import styled from "styled-components";
import companyjason from "./company.json"

//Icons
import depRoldata from "../SeachComponent/DepandRol.json";
import { CloudSwap20Filled } from "@fluentui/react-icons";

initializeIcons();
const stackTokens = { childrenGap: 20 };
const DownArrowIcon = { iconName: "ChevronDownMed" };
const iconProps = { iconName: "FavoriteStar" };
const iconProps1 = { iconName: "FavoriteStarFill" };
const cancelIcon = { iconName: "Cancel" };
const InfoIcon = { iconName: "Info" };

//import styles

const fieldDR = () => {
  return {
    fieldGroup: {
      width: "710px",
    },
  };
};

const custmoPicker = mergeStyles({
  width: "710px",
});

const iconButtonStyles = {
  input: {
    height: "40px",
  },
};

const iconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
  margin: "0 10px",
  color: "#999DA0",
  cursor: "pointer",
  userSelect: "none",
});

const toggleStyles = mergeStyleSets({
  root: { marginBottom: "0px" },
  label: { fontSize: "8px", fontWeight: 400, padding: "0px 0px 0px 0px" },
  container: { width: "300px", height: "10px", border: "none" },
  pill: { borderRadius: "15px" },
  thumb: { width: "2px", height: "2px" },
  thumb2: { backgroundColor: "red" },
});

const checkboxStyles = {
  customLabel: mergeStyles({
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
  }),
};

const rootClass = mergeStyles({
  width: 500,
  margin: "20px",
});

const options = [
  { key: "ResumeTitle", text: "Resume Title" },
  {
    key: "Resumetitleandkeyskills",
    text: "Resume title and keyskills"
    
  },
  {
    key: "Resumesynopsis",
    text: "Resume synopsis",
    value: "Resume synopsis",
  },
  { key: "EntireResume", text: "Entire Resume"},
];




const salaryOptions = [
  { key: 'inr', text: 'INR' },
  { key: 'usd', text: 'USD' },
];


const addStyle = {
  paddingLeft: "8px",
  fontWeight: "700",
  fontSize: "10px",
};

const customDropdownStyles = {
  dropdown: {
    width: 200,
    borderRadius: "",
    border: "none",
    outline: "none",
  },
};

const SearchPopup = ({ onDismiss, candidate }) => {
  const [searchPopUp, setSearchPopUp] = useState(true);
  const [isChecked, setIsChecked] = useState("");
  const [relay, setRelay] = useState("");
  const [toggle, setToggle] = useState(false);
  const [toggle1, setToggle2] = useState(false);
  const [showExclude, setShowExclude] = useState(false);
  const [selectedOption, setSelectedOption] = useState("EntireResume");
  const [isDroped, setIsDroped] = useState(false);
  const [mandatory, setMandatory] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [tempInputValue, setTempInputValue] = useState("");
  const [findData, setFindData] = useState("");
  const [findData1, setFindData1] = useState("");
  const [findData2, setFindData2] = useState("");
  const [click, setClick] = useState(false);
  const [isFirstDivOpen, setIsFirstDivOpen] = useState(false);
  const [isSecondDivOpen, setIsSecondDivOpen] = useState(false);
  const [isUgDropdown, setUgDropdown] = useState(false);
  const [inputCount, setInputCount] = useState(0);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLocationOptions, setSelectedLocationOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isResumeAttached, setIsResumeAttached] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [candidateGender, setCandidateGender] = useState("");
  const [companyToggle, setCompanyToggle] = useState(false);
  const [excludeToggle, setExcludeToggle] = useState(false);
  const [designationToggle, setDesignationToggle] = useState(false);
  const [selectedTags1, setSelectedTags1] = useState([]);
  const [selectedTags2, setSelectedTags2] = useState([]);
  const [selectedTags3, setSelectedTags3] = useState([]);
  const [selectedTags4, setSelectedTags4] = useState([]);
  const [selectedTags5, setSelectedTags5] = useState([]);
  const [relay1, setRelay1] = useState("");
  const [relay2, setRelay2] = useState("");
  const [relay3, setRelay3] = useState("");
  const [relay4, setRelay4] = useState("");
  const [relay5, setRelay5] = useState("");

  const [tempInputValue1, setTempInputValue1] = useState("");
  const [tempInputValue2, setTempInputValue2] = useState("");
  const [tempInputValue3, setTempInputValue3] = useState("");
  const [tempInputValue4, setTempInputValue4] = useState("");
  const [tempInputValue5, setTempInputValue5] = useState("");

  const [text, setText] = useState("+Add IT Skills");
  const [selectedNoticePeriods, setSelectedNoticePeriods] = useState([]);
  const [showTextFields, setShowTextFields] = useState(false);
  const [inputFields, setInputFields] = useState([
    { id: 1, skill: "", experience: "", mustHave: false },
  ]);
  const [experience, setExperience] = useState({
    minExp: "",
    maxExp: "",
    job_role: "",
    industry_type: "",
    company_name: "",
    designation: "",
    notice_period: [],
    gender: "",
    employment_type: "",
    work_model: "",
    resume_url: "",
    expected_ctc: "",
    current_location: []


  });

  const [generateButtonVisible, setGenerateButtonVisible] = useState(false);
  const [click1, setClick1] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isClickable, setIsClickable] = useState(false);
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [isThirdDivOpen, setIsThirdDivOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentButton, setCurrentButton] = useState(null);
  const [deproldata, setDeproldata] = [];

  const [ExcludeOn, setExcludeOn] = useState(false);
  const [click3, setClick3] = useState(false);
  const [click4, setClick4] = useState(false);
  const [click5, setClick5] = useState(false);
  const [companylist, setCompanyList] = useState(companyjason);
  const [excludelist, setexcludeList] = useState(companyjason);
  const [desginationlist, setdesginationList] = useState(companyjason);

  const [filteredCompanyList, setFilteredCompanyList] = useState([]);
  const [filteredExcludeList, setFilteredExcludeCompanyList] = useState([]);
  const [filteredDesignationList, setFilteredDesignationList] = useState([]);
 
  const [isDroppedRes, setIsDroppedRes] = useState(false);

  const [isDropped, setIsDropped] = useState(false);
  const [isDropped1, setIsDropped1] = useState(false);
  const [isDropped2, setIsDropped2] = useState(false);

  const [selectedOptionCom, setSelectedOptionCom] = useState('currentCompany');
  const [selectedOption3, setSelectedOption3] = useState('currentCompany');
  const [selectedOption4, setSelectedOption4] = useState('currentCompany');

  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [dropdownOpen2, setDropdownOpen2] = useState(false); // Adjust state variable names
  const [dropdownOpen3, setDropdownOpen3] = useState(false);
  
  // You should have a state variable to control dropdown visibility
  const [optionStatus, setOptionStatus] = useState({
    currentCompany: true,
    previousCompany: false,
    currentOrPreviousCompany: false,
  });

  const [textFieldWidth, setTextFieldWidth] = useState(0);
  const [optionStatus1, setOptionStatus1] = useState({
    currentCompany: true,
    previousCompany: false,
    currentOrPreviousCompany: false,
  });

  const [optionStatus2, setOptionStatus2] = useState({
    currentCompany: true,
    previousCompany: false,
    currentOrPreviousCompany: false,
  });

  const [mandatory1, setMandatory1] = useState(false);
  const [mandatory2, setMandatory2] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("INR"); //
  const [workPermit, setWorkPermit] = useState([]);
  const [inputValuePermit, setInputValuePermit] = useState('');
  const [data2, setData2] = useState([
    {  'email': false },
    {  'resume_url': false },
    { 'mobile_number': false }
  ]);
  const [maxSalary, setMaxSalary] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [unAvoid, setUnavoid] = useState("");
  // --------------------------------------dep&rol----------------------------------------------
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedDepName, setSelectedDepName] = useState([]);
  const [selectedOption1, setSelectedOption1] = useState([]);
  const [selectedOption2, setSelectedOption2] = useState([]);
  const [title, setTitle] = useState("");
  const [setedId, setSelectedId] = useState("");
  const [anothrOpt, setAnotOpt] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState({
    dep: [],
    option1: [],
    option2: [],
  });


 const OverallDeptRole =[...selectedDepName,...anothrOpt,...selectedOption2]
  // ------------------------------------------------------------------------------------------------
  const [count, setCount] = useState({});
  // ------------------------------------------------------------------------------------------------
  // -------------------------------------Dep-----------------------------------------------------------
  const [isDropVisible, setDropVisible] = useState(false);
  const [selectedIndName, setSelectedIndName] = useState([]);
  const [selIndName, setSelIndName] = useState([]);
  const [selectedIndOption1, setSelectedIndOption1] = useState([]);
  const [selIndOption1, setSelIndOption1] = useState([]);
  // -------------------------------------Dep-----------------------------------------------------------
  const finalResult = selectedIndOption1.map((option) =>
  option === "Others" ? "" : option
);

 const OverallInd = [...selectedIndName,...finalResult];
  // --------------------------------------dep&rol----------------------------------------------

  // ------------------------------------------------------jsonDepName------------------------
  const DepRoldata = {
    Departmentandrole: [
      {
        id: "1",
        DepName: "BFSI",
        Option: [
          {
            id: "11",
            title: "BFSI , investment & Treading",
            Option1: [
              {
                id: "111",
                Department: "Any Roles",
              },
              {
                id: "112",
                Department: "Banking operation",
                Option2: [
                  {
                    id: "1121",
                    Dep: "notmanager",
                  },
                  {
                    id: "1122",
                    Dep: "yesmanager",
                  },
                  {
                    id: "1123",
                    Dep: "fatmanager",
                  },
                ],
              },
              {
                id: "113",
                Department: "General Insurance",
                Option2: [
                  {
                    id: "1131",
                    Dep: "casekhldsre inv",
                  },
                  {
                    id: "1132",
                    Dep: "cadafsere inv",
                  },
                  {
                    id: "1133",
                    Dep: "sffcasere inv",
                  },
                ],
              },
              {
                id: "114",
                Department: "interrext busin",
                Option2: [
                  {
                    id: "1141",
                    Dep: "casekbusindenv",
                  },
                  {
                    id: "1142",
                    Dep: "businestex tllk",
                  },
                  {
                    id: "1143",
                    Dep: "businesyus",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "2",
        DepName: "Coustomer Success",
        Option: [
          {
            id: "21",
            title: "success in business",
            Option1: [
              {
                id: "211",
                Department: "Any Roles",
              },
              {
                id: "212",
                Department: "Banking operation",
                Option2: [
                  {
                    id: "2121",
                    Dep: "niuweoieoier",
                  },
                  {
                    id: "2122",
                    Dep: "departnot si",
                  },
                  {
                    id: "2123",
                    Dep: "notmklppsu",
                  },
                ],
              },
              {
                id: "213",
                Department: "General Insurance",
                Option2: [
                  {
                    id: "2131",
                    Dep: "casekhldsre inv",
                  },
                  {
                    id: "2132",
                    Dep: "cadafsere inv",
                  },
                  {
                    id: "2133",
                    Dep: "sffcasere inv",
                  },
                ],
              },
              {
                id: "214",
                Department: "interrext busin",
                Option2: [
                  {
                    id: "2141",
                    Dep: "casekbusindenv",
                  },
                  {
                    id: "2142",
                    Dep: "businestex tllk",
                  },
                  {
                    id: "2143",
                    Dep: "businesyus",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  // --------------------------------------jsonDepName------------------------------------------------
  // --------------------------------------jsonIndName------------------------------------------------
  const Industries = {
    IndusDep: [
      {
        id: "1",
        Industries: "Electronics Manufacturing",
        Option: [
          {
            id: "11",
            title: "Electronics Manufacturing",
            Option1: [
              {
                id: "111",
                IndName: "Electronics Manufacturing Services",
              },
              {
                id: "112",
                IndName: "Others",
              },
            ],
          },
        ],
      },
      {
        id: "2",
        Industries: " BPO / Call Centre",
      },
      {
        id: "4",
        Industries: " Hardware & Networking",
      },
      {
        id: "3",
        Industries: "Financial Services",
        Option: [
          {
            id: "31",
            title: "Financial Services",
            Option1: [
              {
                id: "321",
                IndName: "Asset Management",
              },
              {
                id: "322",
                IndName: "Broking",
              },
              {
                id: "323",
                IndName: "Others",
              },
            ],
          },
        ],
      },
    ],
  };
  // --------------------------------------jsonIndName------------------------------------------------

  const [optionStatusResume, setOptionStatusResume] = useState({
    ResumeTitle: false,
    Resumetitleandkeyskills: false,
    Resumesynopsis: false,
    EntireResume: true

  });


  const refDrop2 = useRef(null);
  const refDrop3 = useRef(null);

  const dropdownRef = useRef(null);




  const buttonStyle = (buttonText) => ({
    borderless: true,
    borderRadius: "30px",

    backgroundColor:
      selectedButton === buttonText ? "lightblue" : "transparent",
  });

  const handleButtonClickGender = (buttonText) => {
    setSelectedButton(buttonText);

  };

  const handleButtonClickz = (buttonName) => {
    setSelectedNoticePeriods((prevSelectedNoticePeriods) => {
      const updatedSelectedNoticePeriods = prevSelectedNoticePeriods.includes(buttonName)
        ? prevSelectedNoticePeriods.filter((item) => item !== buttonName)
        : [...prevSelectedNoticePeriods, buttonName];
  
      // Update the experience state with the latest selectedNoticePeriods
      if(updatedSelectedNoticePeriods[0] !== 'any'){
      setExperience((prevExperience) => ({
        ...prevExperience,
        notice_period: [...updatedSelectedNoticePeriods],
      }));
    }
      // Return the updated selectedNoticePeriods
      return updatedSelectedNoticePeriods;
    });
  };

  const isButtonClicked = (buttonName) => {
    return selectedNoticePeriods.includes(buttonName);
  };


  const optionsjob = [
    { key: "Permanent", text: "Permanent", value: "permanent" },
    {
      key: "Full time",
      text: "Full time",
      value: "Full time",
    },
    {
      key: "Contract",
      text: "Contract",
      value: "Contract",
    },
  ];

  const options2 = [
    { key: 'currentCompany', text: 'Current Company' },
    { key: 'previousCompany', text: 'Previous Company' },
    { key: 'currentOrPreviousCompany', text: 'Current or Previous Company' },
  ];


  const workmodeoptions = [
    { key: "Home", text: "Home", value: "Home" },
    {
      key: "Office",
      text: "Office",
      value: "Office",
    },
    {
      key: "Hybrid",
      text: "Hybrid",
      value: "Hybrid",
    },
  ];

  const resumeButton = {
    borderRadius: "30px",
    padding: "20px",
  };

  const customCheckboxStyles = {
    root: {},
    checkbox: {
      width: "14px",
      height: "14px",
    },
    label: {},
  };

  // const handleAttachResume = () => {
  //   setExperience({...experience ,work_model:!isResumeAttached});
  // };

  const handleAttachResume = (newResumeUrl) => {
    setIsResumeAttached(!isResumeAttached);

    // Update the state object based on the key
    setData2((prevData) => {
      return prevData.map((item) => {
        if (Object.keys(item)[0] === 'isResumeAttached') {
          return { ...item, [Object.keys(item)[0]]: !isResumeAttached };
        }
        return item;
      });
    });

  };



  const handleAttachEmail = (newResumeUrl) => {
    setIsEmailVerified(!isEmailVerified);

    // Update the state object based on the key
    setData2((prevData) => {
      return prevData.map((item) => {
        if (Object.keys(item)[0]  === 'isEmailVerified') {
          return { ...item, [Object.keys(item)[0] ]: !isEmailVerified };
        }
        return item;
      });
    });
  };

  const handleAttachMobile = (newResumeUrl) => {
    setIsMobileVerified(!isMobileVerified);

    // Update the state object based on the key
    setData2((prevData) => {
      return prevData.map((item) => {
        if (Object.keys(item)[0]  === 'isMobileVerified') {
          return { ...item, [Object.keys(item)[0]]: !isMobileVerified };
        }
        return item;
      });
    });
  };

  function companyHandleToggle(ev, checked) {
    setCompanyToggle(checked);
    const newTags = selectedTags2.filter((tag) => tag.key !== "");
    setSelectedTags2(newTags);
    setTempInputValue2("");
  }

  function excludeHandleToggle(ev, checked) {
    setExcludeToggle(checked);
    const newTags = selectedTags4.filter((tag) => tag.key !== "");
    setSelectedTags4(newTags);
    setTempInputValue4("");
  }

  // function designationHandleToggle(ev, checked) {
  //   setDesignationToggle(checked);
  
  // }

  function designationHandleToggle(ev, checked) {
    setDesignationToggle(checked);
    const newTags = selectedTags3.filter((tag) => tag.key !== "");
    setSelectedTags3(newTags);
    setTempInputValue3("");
  }


  const handleCheckboxChange1 = (event, checked) => {
    setMandatory1(checked);
  };

  const handleCheckboxChange2 = (event, checked) => {
    setMandatory2(checked);
  };

  const handleCurrencyChange = (event, option) => {
    setSelectedCurrency(option.key);
  };

  // const handleMinSalaryChange = (e) => {
  //   const input = e.target.value;
  //   const sanitizedInput = input.replace(/[^0-9]/g, '');
  //   setMinSalary(sanitizedInput);
  // };

  // const handleMaxSalaryChange = (e) => {
  //   const input = e.target.value;
  //   const sanitizedInput = input.replace(/[^0-9]/g, '');
  //   setMaxSalary(sanitizedInput);
  // };


  // ---------------------------------------titus code end--------------------------------------
  //Notes

  // 1. starvalues = starValues
  // 2. multipls for first text field data,
  // 2. multipls1 for first text field data,
  // 4. skills set in store in -- inputFields

  const refDrop = useRef();
  const refDrop1 = useRef();

  const multipls = selectedTags.map((multiTags) => multiTags.name);
  const starValues = selectedTags
    .filter((prev) => prev.isMandatory === true)
    .map((item) => item.name);

  const multipls1 = selectedTags1.map((multiTags) => multiTags.name);

  const multipls2 = selectedTags2.map((multiTags) => multiTags.name);

  const multipls3 = selectedTags3.map((multiTags) => multiTags.name);

  const multipls4 = selectedTags4.map((multiTags) => multiTags.name);

  const multipls5 = selectedTags5.map((multiTags) => multiTags.name);



  const annual_salary = {
    type: selectedCurrency,
    minimum_salary: minSalary,
    maximum_salary: maxSalary,

  }

  const searchContent = {
    "search": multipls,
    "booleansearch": toggle,
    "starvalues": starValues,
    "itSkills": inputFields,
    "unavi": multipls1,
    "current_Location":experience.current_location,
    "notice_period":experience.notice_period,
    "company_boolean" :companyToggle,
    "company_names" : multipls2,
    "company_search_in" : optionStatus,
    "exclude_boolean" :excludeToggle,
    "exclude_company" : multipls3,
    "exclude_search_in" : optionStatus1,
    "designation_boolean" :designationToggle,
    "designation_names" : multipls4,
    "designation_search_in" : optionStatus2,
    "gender" : selectedButton === 'All' ? "" : selectedButton,
    "employment_type" : experience.employment_type,
    "workmode" : experience.work_model,
    "isResumeAttached" : experience.resume_url,
    "annual_salary":annual_salary ,
    "entireResume":optionStatusResume,
    "conditions":data2,
    "work_permit":multipls5,
    "departmentRole":OverallDeptRole,
    "industry": OverallInd,
    "minExp":experience.minExp,
    "maxExp":experience.maxExp
  }

  console.log(searchContent, "single")

  function handleToggle(ev, checked) {
    setToggle(checked);
    const newTags = selectedTags.filter((tag) => tag.key !== "");
    setSelectedTags(newTags);
    setTempInputValue("");
    setShowExclude(false)
  }

  function excludeOpen() {
    setShowExclude(!showExclude);
    setToggle(false)
  }

  const toggleFirstDiv = () => {
    setIsFirstDivOpen(!isFirstDivOpen);
  };

  const toggleSecondDiv = () => {
    setIsSecondDivOpen(!isSecondDivOpen);
  };

  const toggleThirdtDiv = () => {
    setIsThirdDivOpen(!isThirdDivOpen);
  };

  // search for suggestion skillsets
  useEffect(() => {
    axiosPrivateCall
      .post(
        "/api/v1/candidate/advanceAutoSearch",
        { search: tempInputValue },
        { booleanSearch: toggle }
      )
      .then((res) => {
        console.log(res.data, "apiCall");
        let skillArray = res.data.flatMap?.(
          (item) =>
            item.skillset.map((skillItem) => skillItem.skill.toLowerCase()) // Convert to lowercase
        );
        skillArray = [...new Set(skillArray)];
        setFindData(skillArray);
      })
      .catch((err) => {
        throw err;
      });
    if (relay.length > 0) {
      console.log(relay, "relay");
      axiosPrivateCall
        .post("/api/v1/candidate/advanceAutoSearch", { search: relay })
        .then((res) => {
          console.log(res.data, "apiCall");
          const uniqueSkillsSet = new Set(
            res.data.flatMap?.((item) =>
              item.skillset.map((skillItem) => skillItem.skill.toLowerCase())
            )
          );
          const skillArray = [...uniqueSkillsSet];
          setFindData(skillArray);
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [tempInputValue, relay, toggle]);

  const handleClear = () => {
    setSelectedTags([]);
    setFindData("");
    setTempInputValue("");
    setRelay("");
  };

  const handleClear1 = () => {
    setSelectedTags1([]);
    setFindData1("");
    setTempInputValue1("");
    setRelay1("");
  };



  const handleClear2 = () => {
    setSelectedTags2([]);
    setFindData2("");
    setTempInputValue2("");
    setRelay2("");
  };


  const handleClear3 = () => {
    setSelectedTags3([]);
    setFindData2("");
    setTempInputValue3("");
    setRelay3("");
  };


  const handleClear4 = () => {
    setSelectedTags4([]);
    setFindData2("");
    setTempInputValue4("");
    setRelay4("");
  };


  const handleClear5 = () => {
    setSelectedTags5([]);
    setFindData2("");
    setTempInputValue5("");
    setRelay4("");
  };


  const mandatoryChange = () => {
    setMandatory(!mandatory);
    setSelectedTags((prevTags) =>
      prevTags.map((tag) =>
        tag.key ? { ...tag, isMandatory: !mandatory } : tag
      )
    );
  };
  const starHandle = (tagKey) => {
    setSelectedTags((prevTags) =>
      prevTags.map((tag) =>
        tag.key === tagKey ? { ...tag, isMandatory: !tag.isMandatory } : tag
      )
    );
    setMandatory(false);
  };

  const handleModalDismiss = () => {
    setSearchPopUp(false);
    onDismiss();
  };

  function handleOutsideClick(e) {
    if (!refDrop.current?.contains(e.target)) {
      setIsDroped(false);
      setRelay("");
      setFindData("");
    }
  }

  // const handlePermit = (event) => {
  //   const value = event.target.value;
  //   setInputValuePermit(value);

  //   // Add the current value to the workPermit state array
  //   setWorkPermit([value]);
  // }


  const handleSelectResume = (selectedValue) => {
    // Update the selected option
    setSelectedOption(selectedValue);
  
    // Update the optionStatus state
   const optionStatusResume = {
    ResumeTitle: false,
    Resumetitleandkeyskills: false,
    Resumesynopsis: false,
    EntireResume: false
   }
   optionStatusResume[selectedValue] = true;
   setOptionStatusResume(optionStatusResume)
    // Set isDroppedRes to true
    setIsDroppedRes(true);
  };
  


  const handleSelect = (selectedValue) => {
    setSelectedOptionCom(selectedValue);

    // Create an object to map option keys to true/false values
    const optionStatus = {
      currentCompany: false,
      previousCompany: false,
      currentOrPreviousCompany: false,
    };
  
    // Set the selected option to true and the rest to false
    optionStatus[selectedValue] = true;
  
    // Set the options to their respective status
    setOptionStatus(optionStatus);
  
    setIsDropped(true);
  };

  const handleSelect1 = (selectedValue) => {
    setSelectedOption3(selectedValue);
   // Create an object to map option keys to true/false values
    const optionStatus1 = {
      currentCompany: false,
      previousCompany: false,
      currentOrPreviousCompany: false,
    };
  
    // Set the selected option to true and the rest to false
    optionStatus1[selectedValue] = true;
  
    // Set the options to their respective status
    setOptionStatus1(optionStatus1);
  
    setIsDropped1(true);
  };


  const handleSelect2 = (selectedValue) => {
    setSelectedOption4(selectedValue);
    // Create an object to map option keys to true/false values
    const optionStatus2 = {
      currentCompany: false,
      previousCompany: false,
      currentOrPreviousCompany: false,
    };
  
    // Set the selected option to true and the rest to false
    optionStatus2[selectedValue] = true;
  
    // Set the options to their respective status
    setOptionStatus2(optionStatus2);
  
    setIsDropped2(true);
  };

  const handleMap = (item) => {
    const value = item.item;
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    if (tags.length > 0) {
      const newTags = tags.map((tag) => ({ key: tag, name: tag }));
      setSelectedTags([...selectedTags, ...newTags]);
      setClick(true);
      setRelay(value);
    }
    setTempInputValue("");
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
  }, []);


  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // Click occurred outside of the dropdown
        // Close the dropdown or perform other actions
        setDropdownOpen(false);
        setDropdownOpen2(false)
        setDropdownOpen3(false) // Adjust this based on your state management
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => { }, [options]);







  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (refDrop.current && !refDrop.current.contains(event.target)) {
  //       setIsDropped(false);
  //     }
  //   }
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  const onTagChange = (items) => {
    setSelectedTags(items);
  };

  const handleTabKeyPress = (event) => {
    if ((event.key === "Tab" || event.key === ",") && tempInputValue !== "") {
      event.preventDefault();
      const tags = tempInputValue
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      if (tags.length > 0) {
        const newTags = tags.map((tag) => ({ key: tag, name: tag }));
        setSelectedTags([...selectedTags, ...newTags]);
      }
      setTempInputValue("");
    }
  };

  

  const getButtonStyles = (buttonName) => {
    const styles = {
      backgroundColor: isButtonClicked(buttonName) ? '#F1F9FE' : '',
      fontWeight: isButtonClicked(buttonName) ? '500' : 'normal',
    };
    return styles;
  };




  const getIconStyles = (buttonName) => {
    const iconStyle = {
      fontSize: isButtonClicked(buttonName) ? '11.6px' : '10px', // Adjust the font size as needed
    };
    // Merge the styles from addStyle with iconStyle
    return { ...addStyle, ...iconStyle };
};

  const handleInputChange = (newValue) => {
    setTempInputValue(newValue);
    setSelectedTags((prevTags) =>
      prevTags.map((tag) => ({ ...tag, isMandatory: false }))
    );
    setClick(false);
  };
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value.trim();
    if (!value) return;

    const onlyAlphabetic = /^[a-zA-Z\s]*$/;

    if (!onlyAlphabetic.test(value)) {
      // Alert the user if the input contains non-alphabetic characters
      // alert('Please enter only alphabetic characters.');
      return;
    }
    if (data.includes(data)) return
    setData([...data, value])
    // Assuming experience is a state object
      // alert("Please enter only alphabetic characters.");
 
 

    setExperience({
      ...experience,
      current_location: [...data, value],
    });

    e.target.value = ''; // Clear the input field after handling the Enter key press
  }

  const RemoveIntex = (index) => {
    setData(data.filter((el, i) => i !== index));
  };
  const handleTextFieldChange = (event) => {
    const { value } = event.target;
    console.log(value);
    const vals = value.split(",").map((val) => val);
    const newTags = vals.map((val) => ({ key: val, name: val }));
    setTempInputValue(value);
    setSelectedTags(newTags);
    // if()
    if (vals.length === 0 || vals.every((val) => val === "")) {
      setSelectedTags([]);
      setFindData("");
      setTempInputValue("");
    }
  };

  // -----------------------------------------------------------dep&role---------------------

  // ----------------------------------------------------------

  const renderItem = (props) => {
    const tagStyles = {
      backgroundColor: "lightblue",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginLeft: "5px",
    };

    const hoveredStyles = {
      backgroundColor: "lightcoral",
    };
    const isMandatoryIcon = mandatory ? true : props.item.isMandatory;

    return (
      <>
        {toggle ? (
          <div>{props.item.name}</div>
        ) : (
          <div
            style={{
              ...tagStyles,
              ...(props.onRenderItemState?.isHovered && hoveredStyles),
            }}
            onMouseEnter={props.onRenderItemState?.onMouseEnter}
            onMouseLeave={props.onRenderItemState?.onMouseLeave}
            className={styles.TagPickerMain}
          >
            <div
              className={styles.starOption}
              onClick={() => starHandle(props.item.key)}
            >
              {isMandatoryIcon ? (
                <IconButton
                  iconProps={{ iconName: "FavoriteStarFill" }}
                  className={styles.starInputs}
                />
              ) : (
                <IconButton
                  iconProps={{ iconName: "FavoriteStar" }}
                  className={styles.starInputs}
                />
              )}
            </div>
            <div className={styles.pickerText}>{props.item.name}</div>
            {props.onRemoveItem && (
              <IconButton
                iconProps={{ iconName: "Cancel" }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onRemoveItem(props.item);
                }}
                className={styles.pickerButton}
                styles={{
                  root: {
                    color: "white",
                  },
                  icon: {
                    fontSize: "12px",
                  },
                }}
              />
            )}
          </div>
        )}
      </>
    );
  };
  // -----------------------------------------------depand role---------------------------
  // ---------------------------------------------------------
  const handleInputClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };
 
  const handleDepNameClick = (depName) => { 
    let updatedDeps = [];
    if (selectedDepName.includes(depName)) {
      updatedDeps = selectedDepName.filter((item) => item !== depName);
      
    } else {
      updatedDeps = [depName,...selectedDepName] ;
      // updatedDeps =[...selectedDepName,depName]
    }
    setSelectedDepName(updatedDeps);
  
    const selectedDep = DepRoldata.Departmentandrole.find(
      (item) => item.DepName === depName
    );
    setTitle(selectedDep?.Option[0]?.title);
   setSelectedId(selectedDep.id);
    const option1 = selectedDep?.Option[0]?.Option1 || [];
    
    setSelectedOption1(option1);
    setSelectedOption2([]);
  
    let anyRolesOption = option1.find((opt) => opt.Department === "Any Roles");
    if (anyRolesOption && !(selectedRadio.option1 && selectedDep.id == setedId)) {
      handleOption1Click(anyRolesOption,selectedDep.id);
    } else {
      setSelectedRadio({ dep: [], option1: [], option2: [] });
    }
  
    setDropdownVisible(true);
  };
    
  const handleOption1Click = (option1,myId,deppar) => {
  let din =["Any Roles"]
  if((option1.Department !== "Any Roles" && (!anothrOpt.includes(option1.Department))))
  {

     anothrOpt.push(option1.Department)
      din = anothrOpt;
  }else{
    if(anothrOpt.includes(option1.Department))
    {
       din = anothrOpt.filter(e=> e=="Any Roles" ? e!="Any Roles": e!= option1.Department)
      setAnotOpt(din);
    }
   
  }
     

    let updatedRadio = myId==setedId? { ...selectedRadio, option1:[ ] } :{...selectedRadio,option1:[...din]};
    
    if (option1.Option2) {
      const allOption2Deps = option1.Option2.map((opt) => opt.Dep);
      if (! anothrOpt.includes("Any Roles")) {
        
        if (!selectedRadio.option2.some((dep) => allOption2Deps.includes(dep))) {
          updatedRadio.option2 = [...selectedRadio.option2, ...allOption2Deps];
          setSelectedOption2(updatedRadio.option2);
        } else if (selectedRadio.option2.length > 0) {
          updatedRadio.option2 = selectedRadio.option2.filter(
            (dep) => !allOption2Deps.includes(dep)
          );
          setSelectedOption2(updatedRadio.option2);
        }
      } else {
        if (selectedRadio.option2.length === 0) {
          updatedRadio.option2 = allOption2Deps;
          setSelectedOption2(allOption2Deps);
        }
      }
    }
      if(option1.Department=="Any Roles")
      {
        updatedRadio.option2 = [];
        setSelectedOption2(updatedRadio.option2);
        setAnotOpt([]);
        // updatedRadio.option1 =[];
      }
      setCount({...count,[deppar]:updatedRadio.option2.length})
    setSelectedRadio(updatedRadio);
  };

  const handleOption2Click = (option2,to) => {
    let updatedOption2 = [];
    if (selectedOption2.includes(option2.Dep)) {
      updatedOption2 = selectedOption2.filter((item) => item !== option2.Dep);
    } else  {
      updatedOption2=[option2.Dep,...selectedOption2];
    }
    setCount({...count,[to]:updatedOption2.length})
    setSelectedOption2(updatedOption2);

    if (updatedOption2.length === 0) {
      const selectedDep = DepRoldata.Departmentandrole.find(
        (item) => item.DepName === selectedDepName[0]
      );
      const option1 = selectedDep?.Option[0]?.Option1 || [];
      const allOption2Deps = option1.reduce((deps, opt1) => {
        return opt1.Option2 ? deps.concat(opt1.Option2.map((opt2) => opt2.Dep)) : deps;
      }, []);
      if (allOption2Deps.every((dep) => selectedOption2.includes(dep))) {
        setSelectedRadio({ ...selectedRadio, option1: '', option2: [] });
      }
    }
  };

  //  ----------------------------------------------------depandrole-----------------------------------------
  //  ----------------------------------------------------indName-----------------------------------------
  const handleIndInputClick = () => {
    setDropVisible(!isDropVisible);
  };
 
  const industriesWithNoOption = Industries.IndusDep.filter((industry) => !industry.Option);
  const arrayOfNames = industriesWithNoOption.map((obj) => obj.Industries);


  const handleIndNameClick = (indname) => {
    setSelIndOption1(indname);
    let updatedDeps = [];
    if (selectedIndName.includes(indname)) {
      updatedDeps = selectedIndName.filter((item) => item !== indname);
    } else {
      updatedDeps = [...selectedIndName,indname];
      
    }
    setSelectedIndName(updatedDeps);
    setDropVisible(true);
  };
    const handleIndOption1Click = (option1) => {
      let updateOption1 = [];
      if (selectedIndOption1.includes(option1)) {
        updateOption1 = selectedIndOption1.filter((item) => item !== option1);
      } else {
        updateOption1 = [option1, ...selectedIndOption1];
      }
      setSelectedIndOption1(updateOption1);
    }
  //  ----------------------------------------------------indName-----------------------------------------

  const submitHandler = () => {
    const searchData = {
      skills: inputFields,
      allFields: experience,
    };

      axiosPrivateCall
        .post("/api/v1/adbSearch/boolean", searchContent)
        .then((response) => {
          candidate(response.data, searchContent);
          onDismiss();
        })
        .catch((error) => {
          console.error("Error sending data:", error);
        });
 
  };
  const parsedCandidateData = () => {
    console.log(multipls, "xxxxxx");
    axiosPrivateCall
      .post(`/api/v1/adbSearch/boolean`, searchContent)
      // http://localhost:4001/api/v1/adbSearch/boolean
      // .post(`/api/v1/candidate/advanceSearch`,  searchContent )
      .then((res) => {
        console.log(res.data, "multivalues");
        candidate(res.data, searchContent);
        onDismiss();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const ugDropdown = () => {
    setUgDropdown(!isUgDropdown);
  };

  const renderContent = () => {
    if (inputCount === 1) {
      return (
        <div>
          <p>
            Any UG - Candidates with any UG qualification will appear in the
            result
          </p>
          <h2>Institute</h2>
          <input type="text" placeholder="Input 1" />
        </div>
      );
    } else if (inputCount === 2) {
      return (
        <div>
          <div>
            <h2>Choose Course</h2>
            <input
              type="text"
              placeholder="Type or select UG course from list"
            />
          </div>
          <div>
            <h2>Institute</h2>
            <input type="text" placeholder="Select Institute" />
          </div>
        </div>
      );
    } else if (inputCount === 3) {
      return (
        <div>
          <p>
            No UG qualification - Candidates who have only completed 10th or
            12th but are not pursuing/ have pursued graduation will appear in
            the result
          </p>
        </div>
      );
    }
    return null;
  };
  const toggleText = () => {
    if (text === "+Add IT Skills") {
      setText("IT Skills");
      setShowTextFields(true);
      if (inputFields.length > 1) {
        setInputFields([{ id: 1, skill: "", experience: "", mustHave: false }]);
      }
    } else {
      setText("+Add IT Skills");
      setShowTextFields(false);
    }
  };

  const handleExperienceClick = (id) => {
    const updatedInputFields = inputFields.map((field) =>
      field.id === id ? { ...field } : field
    );

    setInputFields(updatedInputFields);
  };
  const handleskillButtonClick = (setId) => {
    if (setId === 1) {
      toggleText();
    } else {
      setInputFields((prevInputFields) =>
        prevInputFields.filter((field) => field.id !== setId)
      );
    }
  };

  const iconProps = {
    iconName: "FavoriteStar",
  };

  const iconProps1 = {
    iconName: "FavoriteStarFill",
  };

  const toggleIcon = () => {
    setIsClickable(!isClickable);
  };

  const currentIconProps = isClickable ? iconProps1 : iconProps;

  console.log(isClickable, "iscli");

  const toggleDropdown = (locationId) => {
    if (selectedLocations.includes(locationId)) {
      setSelectedLocations(
        selectedLocations.filter((item) => item !== locationId)
      );
      setSelectedLocationOptions([]);
      setSelectedOptions([]);
    } else {
      setSelectedLocations([...selectedLocations, locationId]);
      setSelectedLocationOptions([]);
      setSelectedOptions([]);
    }
  };

  const toggleLocationOption = (option) => {
    if (selectedLocationOptions.includes(option)) {
      setSelectedLocationOptions(
        selectedLocationOptions.filter((item) => item !== option)
      );
    } else {
      setSelectedLocationOptions([...selectedLocationOptions, option]);
    }
  };

  const handleDeselectLocationOption = (option) => {
    setSelectedLocationOptions(
      selectedLocationOptions.filter((item) => item !== option)
    );
  };

  const handleDeselectOption = (option) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  };

  const handleChangeHandler = (field, newValue) => {
    setExperience({
      ...experience,
      [field]: newValue,
    });
  };
  const handleExperience = (field, newValue) => {
    let parsedValue = parseInt(newValue, 10);
    if (!isNaN(parsedValue)) {
      parsedValue *= 12;
      setExperience({
        ...experience,
        [field]: parsedValue,
      });
    } else {
      setExperience({
        ...experience,
        [field]: "",
      });
    }
  };


  const AddExcludeHandle =  () => {
    setExcludeOn(!ExcludeOn);
  }


  const handleNoticePeriodClick = (noticePeriod) => {
    setExperience({
      ...experience,
      notice_period: noticePeriod,
    });
  };

  const handleDropdownHandler = (property, newValue) => {
    setExperience({
      ...experience,
      [property]: newValue.key, // Assuming that the key of the selected option represents the value you want to store
    });
  };

  const fieldL = () => {
    return {
      fieldGroup: {
        width: "710px",
      },
    };
  };

  const handleTabKeyPress1 = (event) => {
    if ((event.key === "Tab" || event.key === ",") && tempInputValue1 !== "") {
      event.preventDefault();
      const tags = tempInputValue1
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      if (tags.length > 0) {
        const newTags = tags.map((tag) => ({ key: tag, name: tag }));
        setSelectedTags1([...selectedTags1, ...newTags]);
      }
      setTempInputValue1("");
    }
  };

    
  const handleTabKeyPress2 = (event) => {
    if ((event.key === "Tab" || event.key === ",") && tempInputValue2 !== "") {
      event.preventDefault();
      const tags = tempInputValue2
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      if (tags.length > 0) {
        const newTags = tags.map((tag) => ({ key: tag, name: tag }));
        setSelectedTags2([...selectedTags2, ...newTags]);
      }
      setTempInputValue2("");
    }
  };

  const handleTabKeyPress3 = (event) => {
    if ((event.key === "Tab" || event.key === ",") && tempInputValue3 !== "") {
      event.preventDefault();
      const tags = tempInputValue3
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      if (tags.length > 0) {
        const newTags = tags.map((tag) => ({ key: tag, name: tag }));
        setSelectedTags3([...selectedTags3, ...newTags]);
      }
      setTempInputValue3("");
    }
  };


  const handleTabKeyPress4 = (event) => {
    if ((event.key === "Tab" || event.key === ",") && tempInputValue4 !== "") {
      event.preventDefault();
      const tags = tempInputValue4
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      if (tags.length > 0) {
        const newTags = tags.map((tag) => ({ key: tag, name: tag }));
        setSelectedTags4([...selectedTags4, ...newTags]);
      }
      setTempInputValue4("");
    }
  };
  

  const handleTabKeyPress5 = (event) => {
    if ((event.key === "Tab" || event.key === ",") && tempInputValue5 !== "") {
      event.preventDefault();
      const tags = tempInputValue5
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      if (tags.length > 0) {
        const newTags = tags.map((tag) => ({ key: tag, name: tag }));
        setSelectedTags5([...selectedTags5, ...newTags]);
      }
      setTempInputValue5("");
    }
  };




  const handleInputChange1 = (newValue) => {
    setTempInputValue1(newValue);
    setSelectedTags1((prevTags) =>
      prevTags.map((tag) => ({ ...tag, isMandatory: false }))
    );
    setClick1(false);
  };

  // const handleInputChange2 = (newValue) => {
  //   setTempInputValue2(newValue);
  //   setSelectedTags2((prevTags) =>
  //     prevTags.map((tag) => ({ ...tag, isMandatory: false }))
  //   );
  //   setClick3(false);
  // };


  const handleInputChange2 = (newValue) => {
    // Clear the selected tags and reset Click3
    setSelectedTags2((prevTags) =>
      prevTags.map((tag) => ({ ...tag, isMandatory: false }))
    );
    setClick3(false);
  
    // Filter the company list based on the user's input
    const input = newValue.toLowerCase();
    const filteredCompanies = companylist.filter((company) =>
      company.company.toLowerCase().includes(input)
    );
  
    // Update the filtered company list
    setFilteredCompanyList(filteredCompanies);
  
    // Update the temporary input value
    setTempInputValue2(newValue);
  };
  
  const handleInputChange3 = (newValue) => {
    // Clear the selected tags and reset Click3
    setSelectedTags3((prevTags) =>
      prevTags.map((tag) => ({ ...tag, isMandatory: false }))
    );
    setClick4(false);
  
    // Filter the company list based on the user's input
    const input = newValue.toLowerCase();
    const filteredCompanies = desginationlist.filter((company) =>
      company.company.toLowerCase().includes(input)
    );
  
    // Update the filtered company list
    setFilteredDesignationList(filteredCompanies);
  
    // Update the temporary input value
    setTempInputValue3(newValue);
  };


  const handleInputChange4 = (newValue) => {
    // Clear the selected tags and reset Click3
    setSelectedTags4((prevTags) =>
      prevTags.map((tag) => ({ ...tag, isMandatory: false }))
    );
    setClick5(false);
  
    // Filter the company list based on the user's input
    const input = newValue.toLowerCase();
    const filteredCompanies = excludelist.filter((company) =>
      company.company.toLowerCase().includes(input)
    );
  
    // Update the filtered company list
    setFilteredExcludeCompanyList(filteredCompanies);
  
    // Update the temporary input value
    setTempInputValue4(newValue);
  };
  


  
  const handleInputChange5 = (newValue) => {
    // Clear the selected tags and reset Click3
    setSelectedTags5((prevTags) =>
      prevTags.map((tag) => ({ ...tag,}))
    );
    // setClick5(false);
  
    // Filter the company list based on the user's input
    // const input = newValue.toLowerCase();
    // const filteredCompanies = excludelist.filter((company) =>
    //   company.company.toLowerCase().includes(input)
    // );
  
    // // Update the filtered company list
    // setFilteredExcludeCompanyList(filteredCompanies);
  
    // Update the temporary input value
    setTempInputValue5(newValue);
  };



  const handleButtonCl = (setId) => {
    if (setId === 1) {
      if (inputFields.length > 1) {
        const newInputFields = inputFields.slice(0, -1);
        setInputFields(newInputFields);
      } else {
        toggleText();
      }
    } else {
      setInputFields((prevInputFields) =>
        prevInputFields.filter((field) => field.id !== setId)
      );
    }
  };

  const generateNewFields = () => {
    const newInputFields = [...inputFields];
    const lastId = newInputFields[newInputFields.length - 1].id;

    newInputFields.push({
      id: lastId + 1,
      skill: "",
      experience: "",
      mustHave: false,
    });

    setInputFields(newInputFields);
  };

  const handleInputChan = (id, fieldName, newValue) => {
    const updatedInputFields = inputFields.map((field) =>
      field.id === id ? { ...field, [fieldName]: newValue } : field
    );

    setInputFields(updatedInputFields);

    if (id === inputFields.length && fieldName === "skill" && newValue !== "") {
      setGenerateButtonVisible(true);
    } else {
      setGenerateButtonVisible(false);
    }
  };

  const handleExperienceChange = (id, value) => {
    const updatedInputFields = inputFields.map((field) =>
      field.id === id ? { ...field, experience: value } : field
    );

    console.log(updatedInputFields, "updated");
    setInputFields(updatedInputFields);
  };

  const handleButtonClick1 = (id) => {
    const rowToUpdate = inputFields.find((field) => field.id === id);
    rowToUpdate.mustHave = !rowToUpdate.mustHave; // Toggle the mustHave property
    setSelectedRow(id);
    const updatedInputFields = inputFields.map((field) =>
      field.id === id ? rowToUpdate : field
    );
    setInputFields(updatedInputFields);
  };
  const handleButtonClick = (id) => {
    if (id === 1) {
      // If it's the first row, clear both text and dropdown values
      setInputFields((prevInputFields) =>
        prevInputFields.map((field) =>
          field.id === id
            ? { ...field, skill: "", experience: "", mustHave: false }
            : field
        )
      );
    } else {
      const updatedInputFields = inputFields.filter((field) => field.id !== id);
      setInputFields(updatedInputFields);
    }
  };

  const handleClearAll = () => {
    setInputFields([{ id: 1, skill: "", experience: "", mustHave: false }]);
    setGenerateButtonVisible(false);
  };

  useEffect(() => {
    axiosPrivateCall
      .post("/api/v1/candidate/advanceAutoSearch", { search: tempInputValue1 })
      .then((res) => {
        console.log(res.data, "apiCall");
        let skillArray = res.data.flatMap?.((item) =>
          item.skillset.map((skillItem) => skillItem.skill.toLowerCase())
        );
        skillArray = [...new Set(skillArray)];
        setFindData1(skillArray);
      })
      .catch((err) => {
        throw err;
      });
    if (relay.length > 0) {
      console.log(relay, "relay");
      axiosPrivateCall
        .post("/api/v1/candidate/advanceAutoSearch", { search: relay })
        .then((res) => {
          console.log(res.data, "apiCall");
          const uniqueSkillsSet = new Set(
            res.data.flatMap?.((item) =>
              item.skillset.map((skillItem) => skillItem.skill.toLowerCase())
            )
          );
          const skillArray = [...uniqueSkillsSet];
          setFindData1(skillArray);
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [tempInputValue1, relay]);


  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };



  useEffect(() => {
    axiosPrivateCall
      .post("/api/v1/candidate/advanceAutoSearch", { search: tempInputValue2 })
      .then((res) => {
        console.log(res.data, "apiCall");
        let skillArray = res.data.flatMap?.(
          (item) =>
            item.skillset.map((skillItem) => skillItem.skill.toLowerCase()) // Convert to lowercase
        );
        skillArray = [...new Set(skillArray)];
        setFindData2(skillArray);
      })
      .catch((err) => {
        throw err;
      });
    if (relay.length > 0) {
      console.log(relay, "relay");
      axiosPrivateCall
        .post("/api/v1/candidate/advanceAutoSearch", { search: relay2 })
        .then((res) => {
          console.log(res.data, "apiCall");
          const uniqueSkillsSet = new Set(
            res.data.flatMap?.((item) =>
              item.skillset.map((skillItem) => skillItem.skill.toLowerCase())
            )
          );
          const skillArray = [...uniqueSkillsSet];
          setFindData2(skillArray);
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [tempInputValue2, relay]);

  useEffect(() => {
    axiosPrivateCall
      .post(
        "/api/v1/candidate/advanceAutoSearch",
        { search: tempInputValue },
        { booleanSearch: toggle }
      )
      .then((res) => {
        console.log(res.data, "apiCall");
        let skillArray = res.data.flatMap?.(
          (item) =>
            item.skillset.map((skillItem) => skillItem.skill.toLowerCase()) // Convert to lowercase
        );
        skillArray = [...new Set(skillArray)];
        setFindData(skillArray);
      })
      .catch((err) => {
        throw err;
      });
    if (relay.length > 0) {
      console.log(relay, "relay");
      axiosPrivateCall
        .post("/api/v1/candidate/advanceAutoSearch", { search: relay })
        .then((res) => {
          console.log(res.data, "apiCall");
          const uniqueSkillsSet = new Set(
            res.data.flatMap?.((item) =>
              item.skillset.map((skillItem) => skillItem.skill.toLowerCase())
            )
          );
          const skillArray = [...uniqueSkillsSet];
          setFindData(skillArray);
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [tempInputValue, relay, toggle]);

  function handleOutsideClick(e) {
    if (!refDrop.current?.contains(e.target)) {
      setIsDroped(false);
      setRelay("");
      setFindData("");
    }
  }

  const handleMinSalaryChange = (event) => {
    const e = event.target.value;
    const removedString = e.replace(/\D/g, "");
    setMinSalary(removedString);
    setExperience({
      ...experience,
      minSalary: removedString,
    });
  };

  const handleMaxSalaryChange = (event) => {
    const e = event.target.value;
    const removedString = e.replace(/\D/g, "");
    setExperience({
      ...experience,
      maxSalary: removedString,
    });
    setMaxSalary(removedString);
  };

  const handleTextFieldChange1 = (event) => {
    const { value } = event.target;
    console.log(value);
    const vals = value.split(",").map((val) => val);
    const newTags = vals.map((val) => ({ key: val, name: val }));
    setTempInputValue2(value);
    setSelectedTags2(newTags);

    if (vals.length === 0 || vals.every((val) => val === "")) {
      setSelectedTags2([]);
      setFindData2("");
      setTempInputValue2("");
    }
  };


  const handleTextFieldChange2 = (event) => {
    const { value } = event.target;
    console.log(value);
    const vals = value.split(",").map((val) => val);
    const newTags = vals.map((val) => ({ key: val, name: val }));
    setTempInputValue3(value);
    setSelectedTags3(newTags);

    if (vals.length === 0 || vals.every((val) => val === "")) {
      setSelectedTags3([]);
      // setFindData2("");
      setTempInputValue3("");
    }
  };


  const handleTextFieldChange3 = (event) => {
    const { value } = event.target;
    console.log(value);
    const vals = value.split(",").map((val) => val);
    const newTags = vals.map((val) => ({ key: val, name: val }));
    setTempInputValue4(value);
    setSelectedTags4(newTags);

    if (vals.length === 0 || vals.every((val) => val === "")) {
      setSelectedTags4([]);
      // setFindData2("");
      setTempInputValue4("");
    }
  };

  

  const handleMap1 = (item) => {
    const value = item.item;
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    if (tags.length > 0) {
      const newTags = tags.map((tag) => ({ key: tag, name: tag }));
      setSelectedTags1([...selectedTags1, ...newTags]);
      setClick1(true);
      setRelay1(value);
    }
    setTempInputValue1("");
  };


  const handleMap2 = (com) => {
    // Ensure 'com' is an array
    if (Array.isArray(com)) {
      const newTags = com.map((item) => ({ key: item.company, name: item.company }));
      console.log(newTags, "lop");
      setSelectedTags2([...selectedTags2, ...newTags]);
      setClick3(true);
      // You can't set 'value' as an array, so you might want to set 'value' to the first item's company name, for example.
      if (com.length > 0) {
        setRelay2(com[0].company);
      }
      setTempInputValue2("");
    } else {
      console.error("Invalid input: 'com' should be an array.");
    }
  };
  
  const handleMap3 = (des) => {
    // Ensure 'com' is an array
    if (Array.isArray(des)) {
      const newTags = des.map((item) => ({ key: item.company, name: item.company }));
      setSelectedTags3([...selectedTags3, ...newTags]);
      setClick4(true);
      // You can't set 'value' as an array, so you might want to set 'value' to the first item's company name, for example.
      if (des.length > 0) {
        setRelay3(des[0].company);
      }
      setTempInputValue3("");
    } else {
      console.error("Invalid input: 'com' should be an array.");
    }
  };
  
  const handleMap4 = (exl) => {
    // Ensure 'com' is an array
    if (Array.isArray(exl)) {
      const newTags = exl.map((item) => ({ key: item.company, name: item.company }));
      setSelectedTags4([...selectedTags4, ...newTags]);
      setClick5(true);
      // You can't set 'value' as an array, so you might want to set 'value' to the first item's company name, for example.
      if (exl.length > 0) {
        setRelay4(exl[0].company);
      }
      setTempInputValue4("");
    } else {
      console.error("Invalid input: 'com' should be an array.");
    }
  };

  

  const onTagChange1 = (items) => {
    setSelectedTags1(items);
  };

  const onTagChange2 = (items) => {
    setSelectedTags2(items);
  };

  const onTagChange3 = (items) => {
    setSelectedTags3(items);
  };

  const onTagChange4 = (items) => {
    setSelectedTags4(items);
  };


  const onTagChange5 = (items) => {
    setSelectedTags5(items);
  };

  const handleStarClick = (id) => {
    const updatedInputFields = inputFields.map((field) =>
      field.id === id ? { ...field, mustHave: !field.mustHave } : field
    );
    setInputFields(updatedInputFields);
    console.log(updatedInputFields.find((field) => field.id === id).mustHave);
  };

  const renderSecondItem = (props) => {
    const tagStyles = {
      backgroundColor: "lightblue",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginLeft: "5px",
    };

    const hoveredStyles = {
      backgroundColor: "lightcoral",
    };

    return (
      <>
        {toggle ? (
          <div>{props.item.name}</div>
        ) : (
          <div
            style={{
              ...tagStyles,
              ...(props.onRenderItemState?.isHovered && hoveredStyles),
            }}
            onMouseEnter={props.onRenderItemState?.onMouseEnter}
            onMouseLeave={props.onRenderItemState?.onMouseLeave}
            className={styles.TagPickerMain1}
          >
            <div
              className={styles.starOption}
              onClick={() => starHandle(props.item.key)}
            ></div>
            <div className={styles.pickerText}>{props.item.name}</div>
            {props.onRemoveItem && (
              <IconButton
                iconProps={{ iconName: "Cancel" }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onRemoveItem(props.item);
                }}
                className={styles.pickerButton}
                styles={{
                  root: {
                    color: "white",
                  },
                  icon: {
                    fontSize: "12px",
                  },
                }}
              />
            )}
          </div>
        )}
      </>
    );
  };



  const renderThirdItem = (props) => {
    const tagStyles = {
      backgroundColor: "lightblue",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginLeft: "5px",
    };

    const hoveredStyles = {
      backgroundColor: "lightcoral",
    };
    // const isMandatoryIcon = mandatory ? true : props.item.isMandatory;

    return (
      <>
        {companyToggle ? (
          <div>{props.item.name}</div>
        ) : (
          <div
            style={{
              ...tagStyles,
              ...(props.onRenderItemState?.isHovered && hoveredStyles),
            }}
            onMouseEnter={props.onRenderItemState?.onMouseEnter}
            onMouseLeave={props.onRenderItemState?.onMouseLeave}
            className={styles.TagPickerMain1}
          >
            <div
              className={styles.starOption}
              onClick={() => starHandle(props.item.key)}
            ></div>
            <div className={styles.pickerText}>{props.item.name}</div>
            {props.onRemoveItem && (
              <IconButton
                iconProps={{ iconName: "Cancel" }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onRemoveItem(props.item);
                }}
                className={styles.pickerButton}
                styles={{
                  root: {
                    color: "white",
                  },
                  icon: {
                    fontSize: "12px",
                  },
                }}
              />
            )}
          </div>
        )}
      </>
    );
  };




  
  const renderfifthItem = (props) => {
    const tagStyles = {
      backgroundColor: "lightblue",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginLeft: "5px",
    };

    const hoveredStyles = {
      backgroundColor: "lightcoral",
    };
    // const isMandatoryIcon = mandatory ? true : props.item.isMandatory;

    return (
      <>
        {excludeToggle ? (
          <div>{props.item.name}</div>
        ) : (
          <div
            style={{
              ...tagStyles,
              ...(props.onRenderItemState?.isHovered && hoveredStyles),
            }}
            onMouseEnter={props.onRenderItemState?.onMouseEnter}
            onMouseLeave={props.onRenderItemState?.onMouseLeave}
            className={styles.TagPickerMain1}
          >
            <div
              className={styles.starOption}
              onClick={() => starHandle(props.item.key)}
            ></div>
            <div className={styles.pickerText}>{props.item.name}</div>
            {props.onRemoveItem && (
              <IconButton
                iconProps={{ iconName: "Cancel" }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onRemoveItem(props.item);
                }}
                className={styles.pickerButton}
                styles={{
                  root: {
                    color: "white",
                  },
                  icon: {
                    fontSize: "12px",
                  },
                }}
              />
            )}
          </div>
        )}
      </>
    );
  };


  const renderfourthItem = (props) => {
    const tagStyles = {
      backgroundColor: "lightblue",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginLeft: "5px",
    };

    const hoveredStyles = {
      backgroundColor: "lightcoral",
    };
    // const isMandatoryIcon = mandatory ? true : props.item.isMandatory;

    return (
      <>
        {designationToggle ? (
          <div>{props.item.name}</div>
        ) : (
          <div
            style={{
              ...tagStyles,
              ...(props.onRenderItemState?.isHovered && hoveredStyles),
            }}
            onMouseEnter={props.onRenderItemState?.onMouseEnter}
            onMouseLeave={props.onRenderItemState?.onMouseLeave}
            className={styles.TagPickerMain1}
          >
            <div
              className={styles.starOption}
              onClick={() => starHandle(props.item.key)}
            ></div>
            <div className={styles.pickerText}>{props.item.name}</div>
            {props.onRemoveItem && (
              <IconButton
                iconProps={{ iconName: "Cancel" }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onRemoveItem(props.item);
                }}
                className={styles.pickerButton}
                styles={{
                  root: {
                    color: "white",
                  },
                  icon: {
                    fontSize: "12px",
                  },
                }}
              />
            )}
          </div>
        )}
      </>
    );
  }
  ;


  const rendersixItem = (props) => {
    const tagStyles = {
      backgroundColor: "lightblue",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginLeft: "5px",
    };

    const hoveredStyles = {
      backgroundColor: "lightcoral",
    };
    // const isMandatoryIcon = mandatory ? true : props.item.isMandatory;

    return (
      <>
        {designationToggle ? (
          <div>{props.item.name}</div>
        ) : (
          <div
            style={{
              ...tagStyles,
              ...(props.onRenderItemState?.isHovered && hoveredStyles),
            }}
            onMouseEnter={props.onRenderItemState?.onMouseEnter}
            onMouseLeave={props.onRenderItemState?.onMouseLeave}
            className={styles.TagPickerMain1}
          >
            <div
              className={styles.starOption}
              onClick={() => starHandle(props.item.key)}
            ></div>
            <div className={styles.pickerText}>{props.item.name}</div>
            {props.onRemoveItem && (
              <IconButton
                iconProps={{ iconName: "Cancel" }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onRemoveItem(props.item);
                }}
                className={styles.pickerButton}
                styles={{
                  root: {
                    color: "white",
                  },
                  icon: {
                    fontSize: "12px",
                  },
                }}
              />
            )}
          </div>
        )}
      </>
    );
  }
  ;

  return (
    <Modal
      isOpen={searchPopUp}
      onDismiss={handleModalDismiss}
      isBlocking={false}
    >
      <div className={styles.ee}>
        <div className={styles.ser_container}>
          <div className={styles.title}>Search Candidates</div>
        </div>

        <div className={styles.middle_container}>
          <div className={styles.keyword}>keywords</div>

          <div className={styles.toggle_design_div1}>
            <Toggle
              onText="boolean on"
              offText="boolean off"
              // styles={toggleStyles}
              checked={toggle}
              onChange={handleToggle}
            />
          </div>
        </div>

        <div className={styles.containerPop}>
          <div className={styles.text_container}>
            {toggle ? (
              <TextField
                type="text"
                placeholder="Enter keywords like skills, designation and company"
                value={
                  tempInputValue
                    ? tempInputValue
                    : selectedTags.map((tag) => tag.name)
                }
                onChange={handleTextFieldChange}
                styles={fieldL}
              />
            ) : (
              <div className={custmoPicker}>
                <TagPicker
                  removeButtonAriaLabel="Remove"
                  onResolveSuggestions={() => []}
                  selectedItems={selectedTags}
                  onChange={onTagChange}
                  onInputChange={handleInputChange}
                  inputProps={{
                    placeholder:
                      selectedTags.length > 0
                        ? "Type another keyword"
                        : "Enter keywords like skills, designation and company",
                    className: `${styles.inputContainerWithTags}`,
                    onKeyDown: handleTabKeyPress,
                    value: tempInputValue,
                  }}
                  onRenderItem={renderItem}
                />
              </div>
            )}

            {(!toggle && selectedTags.length > 1) ||
            (toggle && (selectedTags.length > 1 || selectedTags.length > 0)) ? (
              <div onClick={handleClear} className={styles.clearText}>
                Clear All
              </div>
            ) : null}
            {(tempInputValue || relay) && (
              <div
                className={
                  click ? styles.transition : styles.dropdown_container
                }
                ref={refDrop}
              >
                {findData?.map?.((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    onClick={() => handleMap({ item })}
                    className={
                      click ? styles.roundcard : styles.dropdown_option
                    }
                  >
                    <div className={styles.popUpItems}>{item}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ///////////////////////////////////////////////// */}
        <div className={ toggle ? styles.bottonContainer1 : styles.bottonContainer}>
          {toggle ? (
           ""
          ) : (
            <div className={showExclude ? styles.check_box1 :styles.check_box }>
              <div>
                <Checkbox
                  id="myCheckbox"
                  checked={mandatory}
                  onChange={mandatoryChange}
                  className={styles.customCheckboxStyle}
                  styles={customCheckboxStyles}
                />
              </div>

              <label htmlFor="myCheckbox" className={styles.customLabel}>
                Mark all keywords as mandatory
              </label>
            </div>
          )}

          {showExclude  ? (
            ""
          ) : (
            
<div className={styles.drop_downRes}>
                  <p className={styles.searchdrop}>Search in</p>

      <div className={styles.combo_container}>

        
        <div className={styles.input_containerCom} onClick={() => setIsDroppedRes(!isDroppedRes)}>

          <div className={styles.resume_dropdownCom}>
            {options.find((opt) => opt.key === selectedOption)?.text}
              
              <div className={styles.din}>
            <Icon iconName={DownArrowIcon.iconName} />
            </div>
          </div>


          <div>
          {isDroppedRes && (
                
            <div className={`${styles.dropdown_contCom} ${isDropped ? styles.showCom : ''}`} ref={refDrop}>
{options.map((value) => (
  <div
    key={value.key}
    onClick={() => handleSelectResume(value.key)}
    className={`${styles.dropdown_opt} ${optionStatusResume[value.key] ? styles.selectedOption : ''}`}
  >
    {value.text}
  </div>
))}
  
  <div>
      
    </div>
            </div>
          )}
          </div>


        </div>
      </div>

        </div>
          )}
        </div>




        {toggle ? (""):( <div className={styles.addText}>
          <p className={styles.plustext} onClick={excludeOpen}>
            {showExclude ? "" : "+ Add Exclude Keywords"}
          </p>
          {showExclude && (
            <div className={styles.main}>
              <div className={styles.duma}>
                <div className={styles.displayStyle}>
                  {
                    <div className={custmoPicker}>
                      <p className={styles.exclude_keywords}>
                        Exclude Keywords
                      </p>
                      <TagPicker
                        className={styles.TagPicker}
                        removeButtonAriaLabel="Remove"
                        onResolveSuggestions={() => []}
                        selectedItems={selectedTags1}
                        onChange={onTagChange1}
                        onInputChange={handleInputChange1}
                        inputProps={{
                          placeholder:
                            selectedTags1.length > 0
                              ? "Type another keyword"
                              : "Enter keywords like skills, designation and company",
                          className:
                            selectedTags1.length > 0
                              ? styles.inputContainerWithTags
                              : styles.inputContainerNoTags,
                          style: {
                            display: "flex",
                            alignItem: "center",
                            marginLeft: "2px",
                            // paddingBottom: "10px",
                            // marginBottom:'4px'
                          },
                          onKeyDown: handleTabKeyPress1,
                          value: tempInputValue1,
                        }}
                        onRenderItem={renderSecondItem}
                      />
                    </div>
                  }
                </div>

                {selectedTags1.length > 1 ||
                selectedTags1.length > 1 ||
                selectedTags1.length > 0 ? (
                  <div onClick={handleClear1} className={styles.clearTextEd}>
                    Clear All
                  </div>
                ) : null}
                {(tempInputValue1 || relay1) && (
                  <div
                    className={
                      click1 ? styles.transition : styles.dropdown_container
                    }
                    ref={refDrop}
                  >
                    {findData1?.map?.((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        onClick={() => handleMap1({ item })}
                        className={styles.dropdown_option}
                      >
                        <div className={styles.popUpItems}>{item}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {showExclude ? (
                   
                  <div className={ showExclude ? styles.bottonContainer2: "" }>
                  <div className={styles.drop_downRes}>
                  <p className={styles.searchdropShow}>Search in</p>

      <div className={styles.combo_container}>

        
        <div className={styles.input_containerCom} onClick={() => setIsDroppedRes(!isDroppedRes)}>

          <div className={styles.resume_dropdownCom}>
            {options.find((opt) => opt.key === selectedOption)?.text}
              
              <div className={styles.din}>
            <Icon iconName={DownArrowIcon.iconName} />
            </div>
          </div>


          <div>
          {isDroppedRes && (
                
            <div className={`${styles.dropdown_contCom} ${isDropped ? styles.showCom : ''}`} ref={refDrop2}>
{options.map((value) => (
  <div
    key={value.key}
    onClick={() => handleSelectResume(value.key)}
    className={`${styles.dropdown_opt} ${optionStatus[value.key] ? styles.selectedOption : ''}`}
  >
    {value.text}
  </div>
))}
  
  <div>
      
    </div>
            </div>
          )}
          </div>


        </div>
      </div>

        </div>
        </div>
              ) : (
                " "
              )}
            </div>
          )}
        </div>)}

        {/* ----------------------------------------------------------------------skill------------------------------------------------ */}
        <div className={styles.four}>
          {text === "+Add IT Skills" ? (
            <Text className={styles.five} onClick={toggleText}>
              {text}
            </Text>
          ) : (
            <div>
              <Text className={styles.it_skill}>{text}</Text>
            </div>
          )}
          {showTextFields && (
            <div className="textFields">
              <p className={styles.skills_information}>
                <span>
                  <Icon
                    iconName={InfoIcon.iconName}
                    className={styles.IconStyle}
                  />
                </span>
                Candidates often miss filling the IT skills section in their
                profiles. Searching for them based on IT skills might lead to
                limited search results.
              </p>
              {inputFields.map((field) => (
                <div key={field.id}>
                  <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <div className={styles.skillcontainer}>
                      <div className={styles.starIcon}>
                        <IconButton
                          className={styles.iconskill}
                          iconProps={field.mustHave ? iconProps1 : iconProps}
                          onClick={() => handleButtonClick1(field.id)}
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          className={styles.skillstyle}
                          placeholder={`Add Skill`}
                          onChange={(e, newValue) =>
                            handleInputChan(field.id, "skill", newValue)
                          }
                        />
                      </div>
                      <Dropdown
                        className={styles.dropskillstyle}
                        placeholder="Select Experience"
                        options={[
                          { key: "ANY", text: "ANY" },
                          { key: "1", text: "< 1 YEAR" },
                          { key: "1", text: "1 YEAR+" },
                          { key: "2", text: "2 YEARS+" },
                          { key: "3", text: "3 YEARS+" },
                          { key: "4", text: "4 YEARS+" },
                          { key: "5", text: "5 YEARS+" },
                        ]}
                        selectedKey={field.experience}
                        onChange={(e, item) =>
                          handleExperienceChange(field.id, item.key)
                        }
                      />
                      <IconButton
                        className={styles.iconskill}
                        iconProps={cancelIcon}
                        onClick={() => handleButtonClick(field.id)}
                      />
                    </div>
                  </Stack>
                </div>
              ))}
            </div>
          )}
          {generateButtonVisible && (
            <p className={styles.skillbutton} onClick={generateNewFields}>
              + Add Experience
            </p>
          )}
        </div>

        <div className={styles.Experiance_container}>
          <div className={styles.Experiance}>
            <div className={styles.Experience_title}>Experience</div>
          </div>
          <div className={styles.keyExperiance}>
            <TextField
              className={styles.exptextStyle}
              type="text"
              placeholder="Min experience"
              value={experience.minExp !== "" ? experience.minExp / 12 : ""}
              onChange={(e, newValue) => handleExperience("minExp", newValue)}
            />
            <div className={styles.letter}>to</div>
            <TextField
              className={styles.exptextStyle1}
              type="text"
              placeholder="Max experience"
              value={experience.maxExp !== "" ? experience.maxExp / 12 : ""}
              onChange={(e, newValue) => handleExperience("maxExp", newValue)}
            />

            <div className={styles.letter}>Years</div>
          </div>
        </div>

        {/* ----------------------------------------location------------------------- */}

        <div className={styles.loc_exp}>
          <div className={styles.keyword_title}>
            Current location of candidate
          </div>
          <div className={styles.text_field_container}>
            {data.map((tag, index) => (
              <DefaultButton
                key={index}
                className={styles.loc_button_style}
                onClick={() => RemoveIntex(index)}
              >
                {tag} &#10006;
              </DefaultButton>
            ))}

            <input
              placeholder="Add Location"
              type="text"
              onKeyDown={handleKeyDown}
              className={styles.drop_text_field}
              // value={locationValue}
            />
          </div>
          {/* <div className={styles.loc_drop_down}>
      <div className={styles.loc_sub_div}>
        {/* <div className={styles.dropdown_buttons}> */}
          {/* {jsonData.location.map((location) => (
            <Checkbox
              key={location.id}
              label={location.label}
              className={styles.loc_check}
              checked={selectedLocations.includes(location.id)}
              onChange={() => toggleDropdown(location.id)}
            />
          ))} */}
          {/* </div> */}
          {/* </div>
      <div className={styles.loc_check_2}>
        {selectedLocations.map((locationId) => (
          <div key={locationId} className={styles.{dropdown-content ${selectedLocations.includes(locationId) ? 'open' : ''}}}>
            <h3>{jsonData.location.find((location) => location.id === locationId).label}</h3>
            <ul>
              {jsonData.location.find((location) => location.id === locationId).options.map((option) => (
                <li key={option.value}>
                  <Checkbox
                    label={option.value}
                    checked={selectedLocationOptions.includes(option.value)}
                    onChange={() => toggleLocationOption(option.value)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      </div> */}
          {/* </div> */}
</div>


<div className={styles.salary_checkbox}>
           <div className={styles.check_box1}>
              <div>
                <Checkbox
                  id="myCheckbox1"
                  checked={mandatory1}
                  onChange={handleCheckboxChange1}
                  className={styles.customCheckboxStyle}
                  styles={customCheckboxStyles}
                />
              </div>

              <label htmlFor="myCheckbox1" className={styles.customLabel}>
                Includes candidates who prefer to relocate to above locations
              </label>
            </div>
          </div>

         <div className={styles.salary_checkbox1}>
            <div className={styles.check_box1}>
               <div>
               <Checkbox
                 id="myCheckbox2"
                 checked={mandatory2}
                 onChange={handleCheckboxChange2}
                 className={styles.customCheckboxStyle}
                 styles={customCheckboxStyles}
               />
              </div>

              <label htmlFor="myCheckbox2" className={styles.customLabel}>
                Exclude candidates who have mentioned Anywhere in..
              </label>
            </div>
        </div>

        {/* -------------------annual salary----------------- */}
 
        <div className={styles.annual_div}>
      <Dropdown
        className={styles.payment_type}
        selectedKey={selectedCurrency}
        onChange={handleCurrencyChange}
        placeholder="INR"
        options={salaryOptions}
      />

      <TextField
        className={styles.exptextStyle}
        placeholder="minimum salary"
        value={minSalary}
        onChange={handleMinSalaryChange}
      />

      <p className={styles.to_style}>to</p>

      <TextField
        className={styles.exptextStyle}
        placeholder="maximum salary"
        value={maxSalary}
        onChange={handleMaxSalaryChange}
      />

      <p className={styles.to_style}>Lacs</p>
      </div>


        <div className={styles.dropdown_Text}>
          <div className={styles.all}>
            <div className={styles.employee_title}>Employment Details</div>
            <div className={styles.arrowContainer}>
              <div className={styles.arrowStyles}>
                <div className={`arrow ${isFirstDivOpen ? "open" : ""}`}>
                  <Icon
                    className={styles.downIconStyles}
                    onClick={toggleFirstDiv}
                    iconName={isFirstDivOpen ? "ChevronUp" : "ChevronDown"}
                  />
                </div>
              </div>
            </div>

            {isFirstDivOpen && (
              <div className="collapsible-content">
                {/* -------------------------------------------------------- */}
                <div className={styles.Department}>
                  <div className={styles.Department}>Department and Role</div>
                  {/* -----------------------------depANDrole------------------------------------------------------- */}
                  <div className={styles.con}>
                    <div className={styles.input_con}>
                      <div onClick={handleInputClick}>
                        <div className={custmoPicker}>
                        <TagPicker
                          type="text"
                          inputProps={{
                            placeholder: "Write Something",
                          }}
                          onResolveSuggestions={() => []}
                          selectedItems={Array.from(selectedDepName)}
                          onRenderItem={(props) => (
                            // <button
                            //   className={styles.inputDep}
                            //   onClick={() => handleDepNameClick(props.item)}
                            // >
                            //   <p>{props.item}</p>
                            //   <p>{count[props.item]}</p>
                            //   <IconButton
                            //     className={styles.iconDep}
                            //     iconProps={cancelIcon}
                            //   />
                            // </button>
                            <div
                              key={props.item} 
                              className={styles.inputDep}
                              onClick={() => handleDepNameClick(props.item)}
                            >
                                <p>{props.item}</p>
                                <p>{count[props.item]}</p>
                                <IconButton
                                  className={styles.iconDep}
                                  iconProps={cancelIcon}
                                />
                              </div>
                          )}
                        />
                        </div>
                      </div>
                      {isDropdownVisible && (
                        <div className={styles.drop}>
                          <ul className={styles.TO}>
                            {DepRoldata.Departmentandrole.map((DepNameitem) => {
                              return (
                                <li key={DepNameitem.id}>
                                  <label className={styles.Deplabel}>
                                    <input
                                      type="checkbox"
                                      className={styles.checkDeps}
                                      name="depNameCheckbox"
                                      value={DepNameitem.DepName}
                                      checked={selectedDepName.includes(
                                        DepNameitem.DepName
                                      )}
                                      onChange={() => {
                                        console.log(DepNameitem.DepName);
                                        handleDepNameClick(DepNameitem.DepName);
                                      }}
                                    />
                                    <h4 className={styles.DepNamef}>
                                      {DepNameitem.DepName}
                                    </h4>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                          <div className={styles.main}>
                            {selectedDepName.length > 0 && (
                              <div className={styles.yellow}>
                                {selectedDepName.map(
                                  (departmentName, index) => {
                                    const selectedDep =
                                      DepRoldata.Departmentandrole.find(
                                        (item) =>
                                          item.DepName === departmentName
                                      );
                                    return (
                                      <div key={selectedDep.id}>
                                        {index > 0 && <hr />}
                                        <div className={styles.section}>
                                          <p>{selectedDep.Option[0].title}</p>
                                          {selectedDep.Option[0].Option1.map(
                                            (option1) => (
                                              <div key={option1.id}>
                                                <label
                                                  className={
                                                    styles.Departmentlabel
                                                  }
                                                >
                                                  <input
                                                    type="checkbox"
                                                    className={styles.checkDeps}
                                                    name={`option1Checkbox-${option1.id}`}
                                                    checked={selectedRadio.option1.includes(
                                                      option1.Department
                                                    )}
                                                    onChange={() =>
                                                      handleOption1Click(option1, "", selectedDep.DepName
                                                      )
                                                    }
                                                  />
                                                  <span
                                                    className={
                                                      selectedRadio.option1 ===
                                                      option1.Department
                                                        ? ""
                                                        : "checked"
                                                    }
                                                  >
                                                    <h4
                                                      className={
                                                        styles.DepartmentNamef
                                                      }
                                                    >
                                                      {option1.Department}
                                                    </h4>
                                                  </span>
                                                </label>
                                                {option1.Option2 &&
                                                  option1.Option2.map(
                                                    (option2) => (
                                                      <div key={option2.id}>
                                                        <label
                                                          className={
                                                            styles.Delabel
                                                          }
                                                        >
                                                          <input
                                                            className={
                                                              styles.checkDeps
                                                            }
                                                            type="checkbox"
                                                            name={`option2Checkbox-${option2.id}`}
                                                            checked={selectedOption2.includes(
                                                              option2.Dep
                                                            )}
                                                            onChange={() =>
                                                              handleOption2Click(
                                                                option2,
                                                                selectedDep.DepName
                                                              )
                                                            }
                                                          />
                                                          <span
                                                            className={
                                                              selectedOption2.includes(
                                                                option2.Dep
                                                              )
                                                                ? "checked"
                                                                : ""
                                                            }
                                                          >
                                                            {option2.Dep}
                                                          </span>
                                                        </label>
                                                      </div>
                                                    )
                                                  )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* --------------------------------------------------- */}
                  <div className={styles.Industry}>Industry</div>
                  <div className={styles.cont}>
                    <div className={styles.input_cont}>
                      <div onClick={handleIndInputClick}>
                        <div className={custmoPicker}>
                        <TagPicker
                          type="text"
                          inputProps={{
                            placeholder: "Write Something",
                          }}
                          onResolveSuggestions={() => []}
                          selectedItems={Array.from(selectedIndName)}
                          onRenderItem={(props) => (
                            // <button
                            //   onClick={() => handleIndNameClick(props.item)}
                            //   className={styles.inputDep}
                            // >
                            //   <p>{props.item}</p>
                            //   <IconButton
                            //     className={styles.iconDep}
                            //     iconProps={cancelIcon}
                            //   />
                            // </button>

                            <div
                                key={props.item} 
                                onClick={() => handleIndNameClick(props.item)}
                                className={styles.inputDep}
                              >
                                <p>{props.item}</p>
                                <IconButton
                                  className={styles.iconDep}
                                  iconProps={cancelIcon}
                                />
                              </div>
                          )}
                        />
                        </div>
                      </div>
                      {isDropVisible && (
                        <div className={styles.drop}>
                          <ul className={styles.TO}>
                            {Industries.IndusDep.map((dep) => (
                              <li key={dep.id}>
                                <label className={styles.Deplabel}>
                                  <input
                                    type="checkbox"
                                    className={styles.checkDeps}
                                    name="depNameCheckbox"
                                    value={dep.Industries}
                                    checked={selectedIndName.includes(
                                      dep.Industries
                                    )}
                                    onChange={() =>
                                      handleIndNameClick(dep.Industries)
                                    }
                                  />
                                  <h4 className={styles.DepNamef}>
                                    {dep.Industries}
                                  </h4>
                                </label>
                              </li>
                            ))}
                          </ul>
                          <div className="main">
                            {selectedIndName.length > 0 && (!arrayOfNames.includes(selIndOption1)) && (
                              <div className={styles.yellow}>
                                {Industries.IndusDep.map((dep) => {
                                  if (
                                    selectedIndName.includes(dep.Industries) &&
                                    dep.Option &&
                                    dep.Option[0].title &&
                                    dep.Option[0].Option1
                                  ) {
                                    return (
                                      <div key={dep.id}>
                                        <div className={styles.section}>
                                          <p>{dep.Option[0].title}</p>
                                          {dep.Option[0].Option1.map(
                                            (option1, index) => (
                                              <div key={index}>
                                                <label>
                                                  <input
                                                    type="checkbox"
                                                    className={styles.checkDeps}
                                                    name={`option1Checkbox-${option1.id}`}
                                                    checked={
                                                      selectedIndOption1.includes(option1.IndName)
                                                    }
                                                    onChange={() => handleIndOption1Click(option1.IndName)}
                                                  />
                                                  <span
                                                    className={
                                                      selectedIndOption1 ===
                                                      option1.IndName
                                                        ? "checked"
                                                        : ""
                                                    }
                                                  >
                                                    {option1.IndName}
                                                  </span>
                                                </label>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* -------------------------------------------------------------- */}
                  <div className={styles.all}>
                    <div className={styles.xt}>
                    <div >Company</div> 
                    <div className={styles.tog}>
                      <Toggle
                        onText="Boolean on"
                        offText="Boolean off"
                        // styles={toggleStyles}
                        checked={companyToggle}
                        onChange={companyHandleToggle}
                      />
                      </div>
                    
                    </div>
                    </div>

                    <div className={styles.topc}>
                    <div className={styles.containerPop1}>
          <div className={styles.text_container1}>
                       
                       {companyToggle ? (
              <TextField
                // className={styles.keyword_text}
                // borderless={true}
                type="text"
                placeholder="Enter keywords like skills, designation and company"
                value={
                  tempInputValue2
                    ? tempInputValue2
                    : selectedTags2.map((tag) => tag.name)
                }
                onChange={handleTextFieldChange1}
                styles={fieldL}
              />
            ) :(  
              <div className={custmoPicker}>
              <TagPicker
              className={styles.TagPicker}
              removeButtonAriaLabel="Remove"
              onResolveSuggestions={() => []}
              selectedItems={selectedTags2}
              onChange={onTagChange2}
              onInputChange={handleInputChange2}
              inputProps={{
                placeholder:
                  selectedTags2.length > 0
                    ? "Type another keyword"
                    : "Enter keywords like skills, designation and company",
                className:
                  selectedTags2.length > 0
                    ? styles.inputContainerWithTags
                    : styles.inputContainerNoTags,
                style: {
                  display: "flex",
                  alignItem: "center",
                  marginLeft: "2px",
                  // marginBottom:'4px'
                },
                onKeyDown: handleTabKeyPress2,
                value: tempInputValue2,
              }}
              onRenderItem={renderThirdItem}
            /></div>)}

                 {selectedTags2.length > 1 ||
                  selectedTags2.length > 1 ||
                  selectedTags2.length > 0 ? (
                  <div onClick={handleClear2} className={styles.clearText2}>
                    Clear All
                  </div>
                ) : null}


</div>
    </div>
                {(tempInputValue2 || relay2 && dropdownOpen ) && (
                  <div
                    className={
                      click ? styles.transition : styles.dropdown_container
                    }
                    ref={refDrop1}
                  >
 
                       <div ref={dropdownRef}>
                   {filteredCompanyList.map((com, index) => {
  const isCompanySelected = selectedTags2.some((tag) => tag.key === com.company);
  return (
    <div
      key={`${com}-${index}`}
      onClick={() => handleMap2([com])}
      className={`${styles.dropdown_option} ${isCompanySelected ? styles.disabledCompany : ''}`}
    >
      <div className={styles.popUpItems}>{com.company}</div>
    </div>
  );
})}</div>
</div>
    )}
    </div>


    
                 

                  {/* <p className={styles.searchdrop}>Search in current company</p> */}

                  <div className={companyToggle ? styles.drop_downCom1: styles.drop_downCom}>
                  <p className={styles.searchdrop}>Search in</p>

      <div className={styles.combo_container}>

        
        <div className={styles.input_containerCom} onClick={() => setIsDropped(!isDropped)}>

          <div className={styles.resume_dropdownCom}>
            {options2.find((opt) => opt.key === selectedOptionCom)?.text}
            <div className={styles.din}>
            <Icon iconName={DownArrowIcon.iconName} />
            </div>
          </div>
          

          <div>
          {isDropped && (
                
            <div className={`${styles.dropdown_contCom} ${isDropped ? styles.showCom : ''}`} ref={refDrop2}>
{options2.map((value) => (
  <div
    key={value.key}
    onClick={() => handleSelect(value.key)}
    className={`${styles.dropdown_opt} ${optionStatus[value.key] ? styles.selectedOption : ''}`}
  >
    {value.text}
  </div>
))}

            </div>
          )}
          </div>


        </div>
      </div>
                 </div>


                 
                    {ExcludeOn ? (<div className={styles.all}>
                      <div className={styles.xt}>
                      <div>Exclude Company</div>

                    <div className={styles.tog}>
                      <Toggle
                        onText="Boolean on"
                        offText="Boolean off"
                        // styles={toggleStyles}
                        checked={excludeToggle}
                        onChange={excludeHandleToggle}
                      />
                    </div>
                    </div>
                    
                    <div className={styles.topc}>
                    <div className={styles.containerPop1}>
          <div className={styles.text_container1}>

{excludeToggle ? (
              <TextField
                // className={styles.keyword_text}
                // borderless={true}
                type="text"
                placeholder="Enter keywords like skills, designation and company"
                value={
                  tempInputValue4
                    ? tempInputValue4
                    : selectedTags4.map((tag) => tag.name)
                }
                onChange={handleTextFieldChange3}
                styles={fieldL}
              />
            ) :(  
              <div className={custmoPicker}>
              <TagPicker
              className={styles.TagPicker}
              removeButtonAriaLabel="Remove"
              onResolveSuggestions={() => []}
              selectedItems={selectedTags4}
              onChange={onTagChange4}
              onInputChange={handleInputChange4}
              inputProps={{
                placeholder:
                  selectedTags4.length > 0
                    ? "Type another keyword"
                    : "Enter keywords like skills, designation and company",
                className:
                  selectedTags4.length > 0
                    ? styles.inputContainerWithTags
                    : styles.inputContainerNoTags,
                style: {
                  display: "flex",
                  alignItem: "center",
                  marginLeft: "2px",
                  // marginBottom:'4px'
                },
                onKeyDown: handleTabKeyPress4,
                value: tempInputValue4,
              }}
              onRenderItem={renderfifthItem}
            /></div>)}

                 {selectedTags4.length > 1 ||
                  selectedTags4.length > 1 ||
                  selectedTags4.length > 0 ? (
                  <div onClick={handleClear4} className={styles.clearText2}>
                    Clear All
                  </div>
                ) : null}

                </div>
                </div>
                {(tempInputValue4 || relay4 && dropdownOpen2) && (
                  <div
                    className={
                      click ? styles.transition : styles.dropdown_container
                    }
                    ref={refDrop}
                  >
      
                   
                   {filteredExcludeList.map((exl, index) => {
  const isCompanySelected = selectedTags4.some((tag) => tag.key === exl.company);
  return (
    <div
      key={`${exl}-${index}`}
      onClick={() => handleMap4([exl])}
      className={`${styles.dropdown_option} ${isCompanySelected ? styles.disabledCompany : ''}`}
    >
      <div className={styles.popUpItems}>{exl.company}</div>
    </div>
  );
})}


                  </div>
                )}

                  </div>

<div className={excludeToggle ? styles.drop_downCom1 :styles.drop_downCom}>
                  <p className={styles.searchdrop}>Search in</p>

      <div className={styles.combo_container}>

        
        <div className={styles.input_containerCom} onClick={() => setIsDropped1(!isDropped1)}>

          <div className={styles.resume_dropdownCom}>
            {options2.find((opt) => opt.key === selectedOption3)?.text}
            <div className={styles.din}>
            <Icon iconName={DownArrowIcon.iconName} />
            </div>
          </div>
          

          <div>
          {isDropped1 && (
                
            <div className={`${styles.dropdown_contCom} ${isDropped ? styles.showCom : ''}`} ref={refDrop2}>
{options2.map((value) => (
  <div
    key={value.key}
    onClick={() => handleSelect1(value.key)}
    className={`${styles.dropdown_opt} ${optionStatus[value.key] ? styles.selectedOption : ''}`}
  >
    {value.text}
  </div>
))}

            </div>
          )}
          </div>


        </div>
      </div>
                 </div>
                    </div> ) : ( <div className={styles.all}>
                    <div className={styles.exclude_title} onClick={AddExcludeHandle}>
                      
                      + Add Exclude Company{" "} 
                    </div>
                    
                    </div> )}
                    
                  {/* <p className={styles.searchdrop} >Search in current company </p> */}
                  {/* ----------------------------------third------------------------------------------- */}
                   
                  <div className={styles.all}>
                    <div className={styles.xt}>
                    <div>Designation</div>
                    <div className={styles.tog}>    
                      <Toggle
                        onText="Boolean on"
                        offText="Boolean off"
                        // styles={toggleStyles}
                        checked={designationToggle}
                        onChange={designationHandleToggle}
                      />
                      
                    </div>
                    </div>
                    </div>
                 
                 <div className={styles.topc}>
                
                 <div className={styles.containerPop1}>
          <div className={styles.text_container1}>

               {designationToggle ? (
              <TextField
                // className={styles.keyword_text}
                // borderless={true}
                type="text"
                placeholder="Enter keywords like skills, designation and company"
                value={
                  tempInputValue3
                    ? tempInputValue3
                    : selectedTags3.map((tag) => tag.name)
                }
                onChange={handleTextFieldChange2}
                styles={fieldL}
              />
            ) :(   
                 <div className={custmoPicker}>
              <TagPicker
              className={styles.TagPicker}
              removeButtonAriaLabel="Remove"
              onResolveSuggestions={() => []}
              selectedItems={selectedTags3}
              onChange={onTagChange3}
              onInputChange={handleInputChange3}
              inputProps={{
                placeholder:
                  selectedTags3.length > 0
                    ? "Type another keyword"
                    : "Enter keywords like skills, designation and company",
                className:
                  selectedTags3.length > 0
                    ? styles.inputContainerWithTags
                    : styles.inputContainerNoTags,
                style: {
                  display: "flex",
                  alignItem: "center",
                  marginLeft: "2px",
                  // marginBottom:'4px'
                },
                onKeyDown: handleTabKeyPress3,
                value: tempInputValue3,
              }}
              onRenderItem={renderfourthItem}
            /></div>)}

                 {selectedTags3.length > 1 ||
                  selectedTags3.length > 1 ||
                  selectedTags3.length > 0 ? (
                  <div onClick={handleClear3} className={styles.clearText2}>
                    Clear All
                  </div>
                ) : null}

                </div>
                </div>
                {(tempInputValue3 || relay3 && dropdownOpen3) && (
                  <div
                    className={
                      click ? styles.transition : styles.dropdown_container
                    }
                    ref={refDrop}
                  >
                  
                   
                   {filteredDesignationList.map((des, index) => {
  const isCompanySelected = selectedTags3.some((tag) => tag.key === des.company);
  return (
    <div
      key={`${des}-${index}`}
      onClick={() => handleMap3([des])}
      className={`${styles.dropdown_option} ${isCompanySelected ? styles.disabledCompany : ''}`}
    >
      <div className={styles.popUpItems}>{des.company}</div>
    </div>
  );
})}


                  </div>
                )}
                 </div>


                 {/* <div className={styles.drop_downDes}>
                  <p className={styles.searchdrop}>Search in</p>

      <div className={styles.combo_container}>
        <div className={styles.input_container} onClick={() => setIsDropped2(!isDropped2)}>
          <div className={styles.resume_dropdown2}>
            {options2.find((opt) => opt.key === selectedOption4)?.text}
          </div>
          {isDropped2 && (
            <div className={`${styles.dropdown_cont2} ${isDropped ? styles.show : ''}`} ref={refDrop2}>

{options2.map((value) => (
  <div
    key={value.key}
    onClick={() => handleSelect2(value.key)}
    className={`${styles.dropdown_opt} ${optionStatus2[value.key] ? styles.selectedOption : ''}`}
  >
    {value.text}
  </div>
))}
            </div>
          )}
        </div>
      </div>
                  </div> */}


<div className={styles.drop_downCom}>
                  <p className={styles.searchdrop}>Search in</p>

      <div className={styles.combo_container}>

        
        <div className={styles.input_containerCom} onClick={() => setIsDropped2(!isDropped2)}>

          <div className={styles.resume_dropdownCom}>
            {options2.find((opt) => opt.key === selectedOption4)?.text}
            <div className={styles.din}>
            <Icon iconName={DownArrowIcon.iconName} />
            </div>
          </div>
          

          <div>
          {isDropped2 && (
                
            <div className={`${styles.dropdown_contCom} ${isDropped ? styles.showCom : ''}`} ref={refDrop2}>
{options2.map((value) => (
  <div
    key={value.key}
    onClick={() => handleSelect2(value.key)}
    className={`${styles.dropdown_opt} ${optionStatus[value.key] ? styles.selectedOption : ''}`}
  >
    {value.text}
  </div>
))}

            </div>
          )}
          </div>


        </div>
      </div>
                 </div>
         
                  <p className={styles.searchdrop}>
                    {/* Search in Current designation */}
                  </p>
                  <p className={styles.noticediv}>
                    Notice Period/ Availabilty to join.
                  </p>
                  <div className={styles.divnoticeperiod}>
                  <button
        style={getButtonStyles('any')}
        onClick={() => handleButtonClickz('any')}
      >
        Any     
      </button>

      <button
        style={getButtonStyles('0-15')}
        onClick={() => handleButtonClickz('0-15')}
      >
        0-15 days
        <Icon
          iconName={isButtonClicked('0-15') ? 'Accept' : 'Add'}
          style={getIconStyles('0-15')}
        />
      </button>

      <button
        style={getButtonStyles('1 month')}      
        onClick={() => handleButtonClickz('1 month')}
      >
        1 month
        <Icon
          iconName={isButtonClicked('1 month') ? 'Accept' : 'Add'}
          style={getIconStyles('1 month')}
        />
      </button>

      <button
        style={getButtonStyles('2 month')}
        onClick={() => handleButtonClickz('2 month')}
      >
        2 months
        <Icon
          iconName={isButtonClicked('2 month') ? 'Accept' : 'Add'}
          style={getIconStyles('2 month')}
        />
      </button>

      <button
        style={getButtonStyles('3 month')}

        onClick={() => handleButtonClickz('3 month')}
      >
        3 months
        <Icon
          iconName={isButtonClicked('3 month') ? 'Accept' : 'Add'}
          style={getIconStyles('3 month')}
        />
      </button>

      <button
        style={getButtonStyles('More than 3 month')}
        onClick={() => handleButtonClickz('More than 3 month')}
      >
        More than 3 months
        <Icon
          iconName={isButtonClicked('More than 3 month') ? 'Accept' : 'Add'}
          style={getIconStyles('More than 3 month')}
        />
      </button>

      <button
        style={getButtonStyles('Currently serving notice period')}
        onClick={() => handleButtonClickz('Currently serving notice period')}
      >
        Currently serving notice period
        <Icon
          iconName={isButtonClicked('Currently serving notice period') ? 'Accept' : 'Add'}
          style={getIconStyles('Currently serving notice period')}
        />
      </button>     
      
        </div>
                </div>
              </div>
            )}
          </div>
          <hr className={styles.hr} />

          {/* -----------------------------Anand code------------------------------------ */}
          <div className={styles.AdditionalDetails}>
            <div>
              <div className={styles.DiversityAddHead}>
                Diversity and Additional Details
              </div>

              <div className={styles.arrowStyles1}>
                <div className={`arrow ${isSecondDivOpen ? "open" : ""}`}>
                  <Icon
                    onClick={toggleThirdtDiv}
                    iconName={isThirdDivOpen ? "ChevronUp" : "ChevronDown"}
                  />
                </div>
              </div>
            </div>


            {isThirdDivOpen && (
              <div className={styles.AdddetailCon}>
                <div className={styles.DiversityCon}>Diversity details</div>

                <div className={styles.GenderCon}>
                  <p>Gender</p>
                </div>

                <div className={styles.middButtonCon}>
                  <div className={styles.buttonsStyles}>
                    <DefaultButton
                      borderless={true}
                      text="All Candidates"
                      // className={styles.canstyle}
                      style={buttonStyle("All")}
                      onClick={() => handleButtonClickGender("All")}
                    />
                    <DefaultButton
                      borderless={true}
                      text="Male Candidates"
                      style={buttonStyle("Male")}
                      onClick={() => handleButtonClickGender("Male")}
                    />

                    <DefaultButton
                      borderless={true}
                      text="Female Candidates"
                      style={buttonStyle("Female")}
                      onClick={() =>
                        handleButtonClickGender("Female")
                      }
                    />
                  </div>
                </div>
           
             
               
               
    

              <div className={styles.workHead}>Work details</div>

              <div className={styles.subHeadseek}>
                <p>Show candidates seeking</p>
              </div>
              <div className={styles.dropdownCon}>
                <Stack tokens={stackTokens} horizontal={20}>
                  <Dropdown
                    className={styles.workdropdown}
                    placeholder="Job type"
                    calloutProps={{ doNotLayer: true }}
                    options={optionsjob}
                    styles={customDropdownStyles}
                    selectedKey={experience.employment_type}
                    onChange={(e, newValue) => handleDropdownHandler("employment_type", newValue)}

                  />

                  <Dropdown
                    className={styles.workdropdown}
                    placeholder="Work Mode"
                    options={workmodeoptions}
                    styles={customDropdownStyles}
                    selectedKey={experience.work_model}
                    onChange={(e, newValue) => handleDropdownHandler("work_model", newValue)}

                  />
                </Stack>
              </div>

              
              <div className={styles.workPermit}>
                Work permit for
              </div>
                 

                 <div className={styles.permitText}>

                 <div className={custmoPicker}>
              <TagPicker
              className={styles.TagPicker}
              removeButtonAriaLabel="Remove"
              onResolveSuggestions={() => []}
              selectedItems={selectedTags5}
              onChange={onTagChange5}
              onInputChange={handleInputChange5}
              inputProps={{
                placeholder:
                  selectedTags5.length > 0
                    ? "Type another keyword"
                    : "Choose  Cateogory",
                className:
                  selectedTags5.length > 0
                    ? styles.inputContainerWithTags
                    : styles.inputContainerNoTags,
                style: {
                  display: "flex",
                  alignItem: "center",
                  marginLeft: "2px",
                  // marginBottom:'4px'
                },
                onKeyDown: handleTabKeyPress5,
                value: tempInputValue5,
              }}
              onRenderItem={rendersixItem}
            /></div>

{selectedTags5.length > 1 ||
                  selectedTags5.length > 1 ||
                  selectedTags5.length > 0 ? (
                <div onClick={handleClear5} className={styles.clearTextpermit}>
                    Clear All
                  </div>
                ) : null}
               
                

                 
               </div>
              


              
              <div className={styles.displayhead}>Display details</div>

              <div className={styles.showHead}>
                <p>Show only candidates with</p>
              </div>

              <div className={styles.attachbtn}>
                <DefaultButton
                  onClick={() => handleAttachResume(isResumeAttached)}
                  style={resumeButton}
                  borderless={true}

                >
                  {isResumeAttached ? (
                    <>
                      Attached resume
                      <Icon
                        iconName="Accept"
                        style={{ marginLeft: "5px", fontWeight: "600" }}
                      />
                    </>
                  ) : (
                    <>
                      Attached resume
                      <Icon
                        iconName="Add"
                        style={{
                          marginLeft: "5px",
                          fontWeight: "700",
                          fontSize: "14px",
                        }}
                      />
                    </>
                  )}
                </DefaultButton>

                <DefaultButton
                  onClick={() => handleAttachMobile(isMobileVerified)}
                  style={resumeButton}
                  borderless={true}

                >
                  {isMobileVerified ? (
                    <>
                      Verified Mobile Number
                      <Icon
                        iconName="Accept"
                        style={{ marginLeft: "5px", fontWeight: "600" }}
                      />
                    </>
                  ) : (
                    <>
                       Verified Mobile Number
                      <Icon
                        iconName="Add"
                        style={{
                          marginLeft: "5px",
                          fontWeight: "700",
                          fontSize: "14px",
                        }}
                      />
                    </>
                  )}
                </DefaultButton>


                <DefaultButton
                  onClick={() => handleAttachEmail(isEmailVerified)}
                  style={resumeButton}
                  borderless={true}
                >
                  {isEmailVerified ? (
                    <>
                       Verified Email ID
                      <Icon
                        iconName="Accept"
                        style={{ marginLeft: "5px", fontWeight: "600" }}
                      />
                    </>
                  ) : (
                    <>
                      Verified Email ID
                      <Icon
                        iconName="Add"
                        style={{
                          marginLeft: "5px",
                          fontWeight: "700",
                          fontSize: "14px",
                        }}
                      />
                    </>
                  )}
                </DefaultButton>
              
                

          </div>
          </div>
          )}
          {/* -----------------------------Anand code------------------------------------ */}
        </div>
        <div className={styles.saveButton}>
          <PrimaryButton
            className={styles.searchCandidate}
            // disabled={multipls.length <= 0}
            text="Search Candidate"
            // onClick={parsedCandidateData}
            onClick={submitHandler}
          />
        </div>
      </div>
      </div>
    </Modal>

  );
};


export default SearchPopup;
