import React, { useState, useEffect, useCallback } from "react";
import {
  PrimaryButton,
  DefaultButton,
  TextField,
  FontIcon,
  mergeStyles,
  mergeStyleSets,
  Dropdown,
  Label,
  DatePicker,
  Callout,
  DirectionalHint
} from "@fluentui/react";
import { axiosPrivateCall } from "../constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
// import 'draft-js/dist/Draft.css';
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./DraftEditorResetFix.css";
import { Modal } from "@fluentui/react";
// import { PublishContentIcon } from "@fluentui/react/lib/Icon";
import { Icon } from "@fluentui/react/lib/Icon";
import { v4 as uuidv4 } from 'uuid'; 
import { MessageBar, MessageBarType } from "@fluentui/react";

import { Spinner, SpinnerSize } from "@fluentui/react";



import styles from "./TrackSubmission.module.css";
import thumbsdowngrey from "../assets/thumbsdowngrey.svg";
import thumbsupwhite from "../assets/thumbsupwhite.svg";
import thumbsdownwhite from "../assets/thumbsdownwhite.svg";


//icons
import boldicon from "../../src/assets/boldicon.svg";
import undoicon from "../../src/assets/undoicon.svg";
import redoicon from "../../src/assets/redoicon.svg";

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


const workModeOption = [
  { key: "Full Time", text: "Full Time" },
  { key: "Contract", text: "Contract" },
  { key: "Commission", text: "Commission" },
];


const calendarClass = (props, currentHover, error, value) => {
	return {
	  root: {
		"*": {
		  width: "100%",
		  fontSize: "12px !important",
		  height: "22px !important",
		  lineHeight: "20px !important",
		  borderColor: error
			? "#a80000"
			: currentHover === value
			? "#a80000"
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



  const calloutBtnStyles = {
    root: {
      border: 'none',
      padding: '0px 10px',
      textAlign: 'left',
      height: '20px'
    }
  }

 
const iconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
  margin: "0 30px",
  marginTop: "10px",
  color: "#999DA0",
  cursor: "pointer",
  userSelect: 'none',
});

const icee = mergeStyleSets({
  fontSize: 500,
  height: 50,
  width:200,
  cursor:"pointer"
})

const messageBarStyles={
  content:{
      maxWidth: 420,
      minWidth: 250,
  }
}

// const submissionStatusOptions = [
//   { key: "initial_screening_select", text: "Initial Screening Select" },
//   { key: "initial_screening_reject", text: "Initial Screening Reject" },
//   { key: "level_1_select", text: "Level 1 Select" },
//   { key: "level_1_reject", text: "Level 1 Reject" },
//   { key: "level_2_select", text: "Level 2 Select" },
//   { key: "level_2_reject", text: "Level 2 Reject" },
//   { key: "final_select", text: "Final Select" },
//   { key: "final_reject", text: "Final Reject" },
//   { key: "offer_accept", text: "Offer Accept" }, // Added new option
//   { key: "offer_denied", text: "Offer Denied" }, // Added new option
//   { key: "onboard_select", text: "Onboard Select" },
//   { key: "onboard_reject", text: "Onboard Reject" },
//   { key: "bg_verification_select", text: "BG Verification Select" },
//   { key: "bg_verification_reject", text: "BG Verification Reject" },
// ];

const textFieldStyle = (props, currentHover, error, value) => {
  return {
    fieldGroup: {
      width: "160px",
      height: "22px",
      // backgroundColor: '#EDF2F6',
      borderColor: "transparent",
    },
    field: {
      fontSize: 12,
    },
  };
};

const textFieldColored = (props, currentHover, error, value) => {
  return {
    fieldGroup: {
      width: "160px",
      height: "22px",
      // backgroundColor: "#EDF2F6",
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

const dropDownStyles = (props, currentHover, error, value) => {
  return {
    dropdown: { width: "160px", minWidth: "160px", minHeight: "20px" },
    title: {
      height: "22px",
      lineHeight: "18px",
      fontSize: "12px",
      borderColor: currentHover === value ? "rgb(96, 94, 92)" : "transparent",
    },
    caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
    dropdownItem: { minHeight: "22px", fontSize: 12 },
    dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
  };
};

const initialState = {
  _id: "",
  submission_id: "",
  candidate_id: "",
  demand_id: "",
  status: "",
  failed: "",
  remarks: [],
  offeredCtc: "",
  billingRate: "",
  join_date: "",
  file_reports:[],
  work_mode:"",
  Fee:""
};

let remarksArr = [
  {
    status: "initial_screening",
    remark: "",
    failed: "",
  },
  {
    status: "level_1",
    remark: "",
    failed: "",
  },
  {
    status: "level_2",
    remark: "",
    failed: "",
  },
  {
    status: "final_select",
    remark: "",
    failed: "",
  },
  {
    status: "offered",
    remark: "",
    failed: "",
  },
  {
    status: "onboard",
    remark: "",
    failed: "",
  },
  {
    status: "bg_verification",
    remark: "",
    failed: "",
  },
];

const TrackSubmission = () => {
  const navigateTo = useNavigate();

  const [candidateId, setCandidateId] = useState("");
  const [demandId, setDemandId] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [btnIcon, setBtnIcon] = useState("Add");



  const [searchParams, setSearchParams] = useSearchParams();

  const [currentHover, setCurrentHover] = useState("");

  const [currentLevel, setCurrentLevel] = useState(0);

  const [rejectionLevel, setRejectionLevel] = useState("");
      
  const [isClicked, setIsClicked] = useState(false);

  const [calloutStates, setCalloutStates] = useState({});
  
  const [loading, setLoading] = useState(false);

  const [completed, setCompleted] = useState(false);
  
  const [toast, setToast] = useState(false);

  const [toastupload, setToastUpload] = useState(false);


  const defaultIconStyle = mergeStyles({
    color: "white",
    fontSize:'20px',
    zIndex:'1',
    
  });
  const uploadedIconStyle = mergeStyles({
    color: "blue",
    fontSize:'20px',
    zIndex:'1',
    
  });
  const handleClick = () => {
    setIsClicked(!isClicked);
  };



  const openCallout = (iconId) => {
    setCalloutStates((prevState) => ({
      ...prevState,
      [iconId]: true,
    }));

    
  };

   

  const closeCallout = (iconId) => {
    setCalloutStates((prevState) => ({
      ...prevState,
      [iconId]: false,
    }));
  };



  const [errors, setErrors] = useState({
    ...initialState,
    join_date:"",
    offeredCtc:"",
    billingRate:"",
    work_mode:"",
    Fee:""
  });
  useEffect(() => {
    // Set the initial value of `rejectionLevel` here
    setRejectionLevel();
  }, []);
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const [submissionData, setSubmissionData] = useState({ ...initialState });
  const [presubmissionData, setPreSubmissionData] = useState({
	  ...initialState,
	});
  const sanitize = (obj) => {
    const sanitizedData = {};

    Object.keys(initialState).map((key) => {
      if (key === "remarks") {
        if (obj[key].length === 0) {
          sanitizedData[key] = remarksArr;
        } else sanitizedData[key] = obj[key];
      } else sanitizedData[key] = obj[key];
    });
    return sanitizedData;
  };

  const getSubmissionTrackingDetails = () => {
    console.log("firi", searchParams);

    axiosPrivateCall
      .get(
        `/api/v1/submission/getSubmissionTracker?submission_id=${searchParams.get(
          "submission_id"
        )}`
      )
      .then((res) => {
        console.log(res,'lllll');
        const sanitizedData = sanitize(res.data);
        checkRejectionLevel(sanitizedData.status);
        setSubmissionData(sanitizedData);
        setSubmissionId(res.data.SubmissionId);
        setCandidateId(res.data.candidate_id.CandidateId);
        setDemandId(res.data.demand_id.DemandId);

        setPreSubmissionData(sanitizedData);
        setEditorStateFromHtml(sanitizedData["remarks"][0]["remark"]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateSubmissionTrackingDetails = () => {
    const updatedErrors = { ...errors };
    let hasErrors = false;
    if (submissionData['remarks'][3]?.['failed'] === false) {
      if (!submissionData.join_date) {
        updatedErrors.join_date = "Date of onboard is required.";
        hasErrors = true;
      } else {
        updatedErrors.join_date = ""; // Clear the error if the date is provided
      }
  
      if (!submissionData.offeredCtc) {
        updatedErrors.offeredCtc = "OfferedCtc is Required";
        hasErrors = true;
      } else {
        updatedErrors.offeredCtc = "";
      }
  
      if (!submissionData.billingRate) {
        updatedErrors.billingRate = "Billing Rate is Required";
        hasErrors = true;
      } else {
        updatedErrors.billingRate = "";
      }
      
      setErrors(updatedErrors);
      
      // Proceed with saving the data if there are no errors
      if (!hasErrors) {
        axiosPrivateCall
        .post(`api/v1/submission/updateSubmissionTracker`, submissionData)
        .then((res) => {
          console.log(res);
          // if(submissionData.file_reports[in])
            // checkfinalStatus();
          // setHasUploadedFile(false);
          navigateTo("/submission/managesubmissions");
        })
        .catch((e) => console.log(e));
      }
    }else{
      axiosPrivateCall
        .post(`api/v1/submission/updateSubmissionTracker`, submissionData)
        .then((res) => {
          console.log(res);
          navigateTo("/submission/managesubmissions");
        })
        .catch((e) => console.log(e));
    }
  };
  const checkRejectionLevel = (status) => {
    if (status === "initial_screening_reject") {
      setRejectionLevel(0);
    }

    if (status === "level_1_reject" || status === "Interview_Drop_1" ) {
      setRejectionLevel(1);
    }

    if (status === "level_2_reject" || status === "Interview_Drop_2" ) {
      setRejectionLevel(2);
    }

    if (status === "final_reject" || status === "Interview_Drop_3" ) {
      setRejectionLevel(3);
    }

    if (status === "offer_denied") {
      setRejectionLevel(4);
    }

    if (status === "onboard_reject") {
      setRejectionLevel(6);
    }
    if (status === "bg_verification_reject") {
      setRejectionLevel(5);
    }
  };


  const statusDropdownHandler = (e, item, index) => {
    const remarksArr = submissionData["remarks"];
     
    if ((item.key === "level_1_select" || item.key === "level_1_reject" || item.key === "Interview_Drop_1") && (submissionData.file_reports[0] ? false: true)) {
      setToast(true);
      
      return;
    } else if ((item.key === "level_2_select" || item.key === "level_2_reject" || item.key === "Interview_Drop_2") && (submissionData.file_reports[1] ? false: true)){

      setToast(true);
      return;
    } else if (((item.key === "final_select" || item.key === "final_reject" || item.key === "Interview_Drop_3") && (submissionData.file_reports[2] ? false: true))
    ){
      setToast(true);
      return;
    } else if ((( item.key === "offer_accept" || item.key === "offer_denied" ) && (submissionData.file_reports[3] ? false: true)) 
    ){
      setToast(true);
      return;
    } else if (((item.key === "onboard_select" || item.key === "onboard_reject") && (submissionData.file_reports[4] ? false: true)) 
    ){
      setToast(true);
      return;
    } else if (((item.key === "bg_verification_select" || item.key === "bg_verification_reject") && (submissionData.file_reports[5] ? false: true)) 
    ) {
      setToast(true);
      return;
    }
    
  
  
    if (item.key === "initial_screening_select") {
      remarksArr[0]["failed"] = false;
      setRejectionLevel(7);
    }
  
    if (item.key === "initial_screening_reject") {
      remarksArr[0]["failed"] = true;
      setRejectionLevel(0);
    }
  
    if (item.key === "level_1_select") {
      remarksArr[1]["failed"] = false;
      setRejectionLevel(7);
    }
  
    if (item.key === "level_1_reject" || item.key === "Interview_Drop_1") {
      remarksArr[1]["failed"] = true;
      setRejectionLevel(1);
    }
  
    if (item.key === "level_2_select" ) {
      remarksArr[2]["failed"] = false;
      setRejectionLevel(7);
    }
  
    if (item.key === "level_2_reject" || item.key === "Interview_Drop_2") {
      remarksArr[2]["failed"] = true;
      setRejectionLevel(2);
    }
  
    if (item.key === "final_select") {
      remarksArr[3]["failed"] = false;
      setRejectionLevel(7);
    }
  
    if (item.key === "final_reject"  || item.key === "Interview_Drop_3") {
      remarksArr[3]["failed"] = true;
      setRejectionLevel(3);
    }
  
    if (item.key === "offer_accept") {
      remarksArr[4]["failed"] = false;
      setRejectionLevel(7);
    }
  
    if (item.key === "offer_denied") {
      remarksArr[4]["failed"] = true;
      setRejectionLevel(4);
    }
  
    if (item.key === "onboard_select") {
      remarksArr[5]["failed"] = false;
      setRejectionLevel(7);
    }
  
    if (item.key === "onboard_reject") {
      remarksArr[5]["failed"] = true;
      setRejectionLevel(5); // Use 5 for Offer Denied
    }
  
    if (item.key === "bg_verification_select") {
      remarksArr[6]["failed"] = false;
      setRejectionLevel(7);
    }
  
    if (item.key === "bg_verification_reject") {
      remarksArr[6]["failed"] = true;
      setRejectionLevel(6);
    }
  
    setSubmissionData((prevData) => {
      setCurrentHover("");
  
      return {
        ...prevData,
        status: item.key,
        remarks: [...remarksArr],
      };
    });
  };
  
  
  
  const setEditorStateFromHtml = (html) => {
    const contentBlocks = convertFromHTML(html);

    const contentState = ContentState.createFromBlockArray(
      contentBlocks.contentBlocks,
      contentBlocks.entityMap
    );

    setEditorState(EditorState.createWithContent(contentState));
  };

  const editorStateHandler = (editorState) => {
    const remarksArr = submissionData["remarks"];

    remarksArr[currentLevel]["remark"] = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    setSubmissionData((prevData) => {
      return {
        ...prevData,
        remarks: remarksArr,
      };
    });

    setEditorState(editorState);
  };

  useEffect(() => {
    getSubmissionTrackingDetails();
    console.log("iji");
  }, []);

  useEffect(() => {
    if (
      submissionData["remarks"][currentLevel]?.remark ||
      submissionData["remarks"][currentLevel]?.remark === ""
    ) {
      const html = submissionData["remarks"][currentLevel]?.remark;

      setEditorStateFromHtml(html);
    }
  }, [currentLevel, submissionData]);

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }

    else {
     
      setTimeout(() => {
        setToastUpload(false);
      }, 2000);
    }
  }, [toast,toastupload]);

  function dynamicStatus(status) {
    let requiredStatus = [];

    if (status === "") {
      requiredStatus = [
        { key: "initial_screening_select", text: "Initial Screening Select" },
        { key: "initial_screening_reject", text: "Initial Screening Reject" },
        { key: "Interview_Drop", text: "Interview Drop" },

      ];
    }

    if (status === "initial_screening_select") {
      requiredStatus = [
        { key: "level_1_select", text: "Level 1 Select" },
        { key: "level_1_reject", text: "Level 1 Reject" },
        { key: "Interview_Drop_1", text: "Interview Drop" },

      ];
    } else if (status === "initial_screening_select") {
      requiredStatus = [];
    }

    if (status === "level_1_select") {
      requiredStatus = [
        { key: "level_2_select", text: "Level 2 Select" },
        { key: "level_2_reject", text: "Level 2 Reject" },
        { key: "Interview_Drop_2", text: "Interview Drop" },

      ];
    } else if (status === "level_1_reject") {
      requiredStatus = [];
    }

    if (status === "level_2_select") {
      requiredStatus = [
        { key: "final_select", text: "Final Select" },
        { key: "final_reject", text: "Final Reject" },
        { key: "Interview_Drop_3", text: "Interview Drop" },

      ];
    } else if (status === "level_2_reject") {
      requiredStatus = [];
    }

    if (status === "final_select") {
      requiredStatus = [
        
        { key: "offer_accept", text: "Offer Accept" },
        { key: "offer_denied", text: "Offer Denied" },

        
      ];
    } else if (status === "final_reject") {
      requiredStatus = [];
    }

    if (status === "offer_accept") {
      requiredStatus = [
        { key: "onboard_select", text: "Onboard Select" },
        { key: "onboard_reject", text: "Onboard Reject" },
      ];
    } else if (status === "offer_denied") {
      requiredStatus = [];
    }

    if (status === "onboard_select") {
      requiredStatus = [
        { key: "bg_verification_select", text: "BG Verification Select" },
        { key: "bg_verification_reject", text: "BG Verification Reject" },
      ];
    } else if (status === "onboard_reject") {
      requiredStatus = [];
    }

    return requiredStatus;
  }

  const downloadEmployees = () => {
    setLoading(true);
    axiosPrivateCall
      .get(
        `api/v1/submission/downloadTrackSubmissions?submission_id=${searchParams.get(
          "submission_id"
        )}`,
        {
          responseType: "blob",
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setCompleted(true);
        setTimeout(() => {
          setCompleted(false);
        }, 4000);
        setLoading(false);

      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const inputChangeHandler = (e, inputName) => {
    const {value} = e.target
    let inputVlaue = value
    e.preventDefault();
    setSubmissionData({
      ...submissionData,
      [inputName]: inputVlaue,
    });
    setErrors({
      ...errors,
      [inputName]: "",
    });
    setCurrentHover("");
  };

 
  function uploadHandler(e, index) {
    if (e.target.files && e.target.files[0]) {
      if (
        e.target.files[0].type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        e.target.files[0].type === "application/pdf" ||
        e.target.files[0].type === "application/docx" ||
        e.target.files[0].type === "application/msword" ||
        e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/png" ||
        e.target.files[0].type === "image/jpg"
      )
       {
        setFileTitle("uploading");
        let files = e.target.files[0]; // Use files[0] instead of files[1]
        let formdata = new FormData();
        formdata.append("file", files);
   
        console.log(formdata,"formdata")
  
        axiosPrivateCall
          .post("api/v1/submission/uploadReports", formdata)
          .then((res) => {
            setSubmissionData((prevState) => {
              const newReports = [...prevState.file_reports];
              newReports[index] = res.data.document;
              return { ...prevState, file_reports: newReports };
            });
  
            setPreSubmissionData((prevState) => {
              const newReports = [...prevState.file_reports];
              newReports[index] = "";
              return { ...prevState, file_reports: newReports };
            });
             
            setFileTitle(" ");
            setBtnIcon("Accept");
            setToastUpload(true);
          })
          .catch((e) => {});
      } else {
        setPreSubmissionData((prevState) => {
          const newReports = [...prevState.file_reports];
          newReports[index] = "Invalid";
          return { ...prevState, file_reports: newReports };
        });
        setFileTitle("Invalid Format");
        setBtnIcon(
          e.target.files[0].type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            e.target.files[0].type === "application/vnd.ms-excel"
            ? "Invalid"
            : "Cancel"
        );
      }
    }
  }
  

  const dateHandler = (date, name) => {
    setSubmissionData({
      ...submissionData,
      [name]: date,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
    setCurrentHover(""); // Reset the currentHover state
  };
  const hoverHandler = (name) => {
    setCurrentHover(name);
  };
  let minDate = new Date();
  

  return (
    <div className={styles.track_contaienr}>
      <div className={styles.track_modal_header_container}>
        <div className={styles.header_tag_expand_close_icon_container}>
          <div className={styles.header_tag_container}>Submission Tracker</div>
        </div>
         
        <div className={styles.header_content_container}>
          <div className={styles.header_content_title_container}>
            <div className={styles.header_submission_id_container}>
              Submission Id : {submissionId}
            </div>

                        {toast &&<div >
                            <MessageBar onDismiss={()=>setToast(!toast)} styles={messageBarStyles}  dismissButtonAriaLabel="Close" messageBarType={MessageBarType.error}>
                             Upload the feedback form to change status
                            </MessageBar>
                        </div>}

                        {toastupload &&<div >
                            <MessageBar onDismiss={()=>setToastUpload(!toastupload)} styles={messageBarStyles} dismissButtonAriaLabel="Close" messageBarType={MessageBarType.success}>
                              feedback form uploaded successfully !
                            </MessageBar>
                        </div>}

            <div className={styles.header_save_close_btns_container}>
            {loading ? (<Spinner size={SpinnerSize.medium} className={iconClass} />) : 
              completed ? (<FontIcon iconName="CheckMark" className={iconClass} />) :
             (<FontIcon iconName="Download" onClick={downloadEmployees} className={iconClass} />)}

              <PrimaryButton
                text={`Save & Close`}
                onClick={updateSubmissionTrackingDetails}
                iconProps={{ iconName: "Save" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={styles.track_submission_demand_candidate_status_container}
      >
        <div className={styles.track_submission_demand_id_container}>
          <div className={styles.track_submission_demand_id_title}>
            Demand ID
          </div>
          <TextField readOnly value={demandId} styles={textFieldStyle} />
        </div>
        <div className={styles.track_submission_candidate_id_container}>
          <div className={styles.track_submission_candidate_id_title}>
            Candidate ID
          </div>

          <TextField readOnly value={candidateId} styles={textFieldStyle} />
        </div>
        <div className={styles.track_submission_status_dropdown_container}>
          <div className={styles.track_submission_dropdown_title}>Status</div>
          <div onClick={() => setCurrentHover("status")}>
            <Dropdown
              placeholder="Select"
              options={dynamicStatus(presubmissionData.status)}
              selectedKey={submissionData.status}
              notifyOnReselect
              styles={(props) =>
                dropDownStyles(props, currentHover, "error", "status")
              }
              onChange={statusDropdownHandler}
            />
          </div>
        </div>
        
        { submissionData['remarks'][3]?.['failed'] === false ? (
          <>
       <div className={styles.track_submission_status_dropdown_container}>
          <div className={styles.track_submission_dropdown_title}>Work mode</div>
          <div onClick={() => setCurrentHover("work_mode")}>
            <Dropdown
              placeholder="Select"
              options={workModeOption}
              selectedKey={submissionData.work_mode}
              value={submissionData.work_mode}
              notifyOnReselect
              styles={(props) =>
                dropDownStyles(props, currentHover, "error", "work_mode")
              }
              onChange={(event, option) => setSubmissionData({...submissionData, work_mode: option.key})}
              />
          </div>
        </div></> ):(<></>)}
          </div>



      {submissionData['remarks'][3]?.['failed'] === false ? (
        <>
          <div
            className={
              styles.track_submission_demand_candidate_status_container
            }
          >
            <div className={styles.track_submission_demand_id_container}>
              <div className={styles.track_submission_demand_id_title}>
                Date of onboard
              </div>
              <div id="join_date" onClick={() => hoverHandler("join_date")}>
                <DatePicker
                  placeholder={"DD/MM/YYYY"}
                  minDate={minDate}
                  styles={(props) =>
                    calendarClass(
                      props,
                      currentHover,
                      errors.join_date,
                      "join_date"
                    )
                  }
                  onSelectDate={(date) => {
                    dateHandler(date, "join_date");
                  }}
				  value={submissionData?.join_date ? new Date(submissionData?.join_date) : ""}
				  
                />
              </div>
            </div>
            <div className={styles.track_submission_candidate_id_container}>
              <div className={styles.track_submission_candidate_id_title}>
                Offered CTC
              </div>
              <TextField
                styles={(props) =>
                  textFieldColored(
                    props,
                    currentHover,
                    errors.offeredCtc,
                    "offeredCtc"
                  )
                }
                onChange={(e) => {
                  inputChangeHandler(
                    e,
                    "offeredCtc",
                  );
                }}
                value={submissionData.offeredCtc}
                placeholder={"offered ctc"}
                // styles={basicInfoerrors.expected_ctc ? FieldError : Field1}
              />
            </div>
            <div className={styles.track_submission_status_dropdown_container}>
              <div className={styles.track_submission_dropdown_title}>
                Billing Rate
              </div>
              <TextField
                styles={(props) =>
                  textFieldColored(
                    props,
                    currentHover,
                    errors.billingRate,
                    "billingRate"
                  )
                }
                onChange={(e) => {
                  inputChangeHandler(
                    e,
                    "billingRate",
                  );
                }}
                value={submissionData.billingRate}
                placeholder={"billing Rate"}
                // styles={basicInfoerrors.expected_ctc ? FieldError : Field1}
              />
            </div>

            <div className={styles.track_submission_status_dropdown_container}>
              <div className={styles.track_submission_dropdown_title}>
                % Fee
              </div>
              <TextField
                styles={(props) =>
                  textFieldColored(
                    props,
                    currentHover,
                    errors.Fee,
                    "Fee"
                  )
                }
                onChange={(e) => {
                  inputChangeHandler(
                    e,
                    "Fee",
                  );
                }}
                value={submissionData.Fee}
                placeholder={"Fee"}
                // styles={basicInfoerrors.expected_ctc ? FieldError : Field1}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      <div className={styles.track_submission_content_container}>
        <div className={styles.track_submission_demand_candidate_status_thumbs_container}>
          <div className={`${styles.track_submission_progress_thumb_title_container}`}
            data-title={"Initial Screening"}>
             <div onClick={() => setCurrentLevel(0)}
               className={`${styles.track_submission_progress_thumb_container} ${
               currentLevel === 0 ? styles.currentInit:styles.currentInit
              } 
							${
                submissionData.remarks[0]?.failed === ""
                  ? styles.thumb_grey
                  : submissionData.remarks[0]?.failed === false
                  ? styles.thumb_green
                  : styles.thumb_red
              }`}
            >
              <img
                className={styles.track_submission_progress_thumb}
                src={rejectionLevel === 0 ? thumbsdownwhite : thumbsupwhite}
                alt=""
                srcset=""
              />
             
            </div>
            {/* <div  className={styles.track_submission_status_title_container}>
							Initial Discussion
						</div> */}
 
          </div>
          
          <div className={`${styles.uploadIcon}`}>
            <div className={`${styles.trackUploadCont} ${
               remarksArr[0].status === "initial_screening" ? styles.currentStage:styles.currentStage2
              }`}>
              
             <Icon className={submissionData.file_reports[0]?styles.uploadedIconStyle:styles.defaultIconStyle}
                iconName="PublishContent"
                styles={{ root: defaultIconStyle }}
                onClick={() => openCallout('icon1')}
                id={`icon1_${submissionData.submission_id._id}`} 
            />
            {calloutStates['icon1'] && (
            <Callout
                gapSpace={0}
                target={`#icon1_${submissionData.submission_id._id}`} 
                onDismiss={() => closeCallout('icon1')}
                isBeakVisible={false}
                directionalHint={DirectionalHint.bottomCenter}
            >
          <div className={`${styles.iconStylesyes}`}>
       
          <label
           htmlFor="resume-upload"
           className={`${styles.uploadLabel} ${calloutBtnStyles.root}`}>
           Upload
          </label>
            <input
                style={{display: "none",paddingLeft:'12px',width:'5px',background:"red" }}
                type="file"
                name="resume"
                id="resume-upload"
                onChange={(e) => uploadHandler(e,0)}
            />
            <DefaultButton
              text="View"
              styles={calloutBtnStyles}
              href={`https://docs.google.com/viewer?url=${encodeURIComponent(submissionData.file_reports[0]?submissionData.file_reports[0]:"")}`}
              target="_blank"
              rel="noopener noreferrer"
            />            
            {/* <DefaultButton text="Delete" styles={calloutBtnStyles} />  */}
           </div>
        </Callout>
       )}
    </div>
   </div>   
          <div
            className={`${styles.track_submission_progress_thumb_title_container}`}
            data-title={"Level 1"}
          >
            <div
              onClick={() => setCurrentLevel(1)}
              className={`${styles.track_submission_progress_thumb_container} ${
                currentLevel === 1 ? styles.current : null
              }
							${
                submissionData.remarks[1]?.failed === ""
                  ? styles.thumb_grey
                  : submissionData.remarks[1]?.failed === false
                  ? styles.thumb_green
                  : styles.thumb_red
              } `}
            >
              <img
                className={styles.track_submission_progress_thumb}
                src={rejectionLevel <= 1  ? thumbsdownwhite : thumbsupwhite}
                alt=""
                srcset=""
              />
            </div>
          </div>
        
          <div className={`${styles.uploadIcon}`}>
          <div className={`${styles.trackUploadCont} ${
                remarksArr[1].status === "level_1"  ? styles.currentStage:styles.currentStage2
              } 
              ${submissionData.file_reports[0] ? styles.currentStage:styles.currentStage2}
              `}>
             <Icon  className={submissionData.file_reports[1]?styles.uploadedIconStyle:styles.defaultIconStyle}
                iconName="PublishContent"
                styles={{ root: defaultIconStyle }}
                onClick={() => openCallout('icon2')}
                id={`icon2_${submissionData.submission_id._id}`} 
            />
            {calloutStates['icon2'] && (
            <Callout
                gapSpace={0}
                target={`#icon2_${submissionData.submission_id._id}`} 
                onDismiss={() => closeCallout('icon2')}
                isBeakVisible={false}
                directionalHint={DirectionalHint.bottomCenter}
            >
             <div className={`${styles.iconStylesyes}`}>       
            <label htmlFor="resume-upload" className={`${styles.uploadLabel} ${calloutBtnStyles.root}`}>
              Upload
            </label>
            <input style={{display: "none",paddingLeft:'12px',width:'5px',background:"red" }}
              type="file"
              name="resume"
              id="resume-upload"
              onChange={(e) => uploadHandler(e,1)}
            />
            <DefaultButton
              text="View"
              styles={calloutBtnStyles}
              href={`https://docs.google.com/viewer?url=${encodeURIComponent(submissionData.file_reports[1]?submissionData.file_reports[1]:"")}`}
              target="_blank"
              rel="noopener noreferrer"
            />
           {/* <DefaultButton text="Delete" styles={calloutBtnStyles} />  */}
           </div>
        </Callout>
       )}
    </div>
   </div>


          <div
            className={styles.track_submission_progress_thumb_title_container}
            data-title={"Level 2"}
          >
            <div
              onClick={() => setCurrentLevel(2)}
              className={`${styles.track_submission_progress_thumb_container} ${
                currentLevel === 2 ? styles.current : null
              } 
							${
                submissionData.remarks[2]?.failed === ""
                  ? styles.thumb_grey
                  : submissionData.remarks[2]?.failed === false 
                  ? styles.thumb_green
                  : styles.thumb_red
              }`}
            >
              <img
                className={styles.track_submission_progress_thumb}
                src={rejectionLevel <= 2 ? thumbsdownwhite : thumbsupwhite}
                alt=""
                srcset=""
              />
            </div>
          </div>  
          <div className={`${styles.uploadIcon}`}>
          <div className={`${styles.trackUploadCont} ${
               remarksArr[2].status === "level_2" ? styles.currentStage:styles.currentStage2
              }
              ${submissionData.file_reports[1] ? styles.currentStage:styles.currentStage2}
              `}>
             <Icon  className={submissionData.file_reports[2]?styles.uploadedIconStyle:styles.defaultIconStyle}
                iconName="PublishContent"
                styles={{ root: defaultIconStyle }}
                onClick={() => openCallout('icon3')}
                id={`icon3_${submissionData.submission_id._id}`} 
            />
            {calloutStates['icon3'] && (
            <Callout
                gapSpace={0}
                target={`#icon3_${submissionData.submission_id._id}`} 
                onDismiss={() => closeCallout('icon3')}
                isBeakVisible={false}
                directionalHint={DirectionalHint.bottomCenter}
            >
           <div className={`${styles.iconStylesyes}`}>      
       <label htmlFor="resume-upload" className={`${styles.uploadLabel} ${calloutBtnStyles.root}`}>
         Upload
       </label>
       <input style={{display: "none",paddingLeft:'12px',width:'5px',background:"red" }}
         type="file"
         name="resume"
         id="resume-upload"
         onChange={(e) =>  uploadHandler(e,2)}
       />
        <DefaultButton
          text="View"
          styles={calloutBtnStyles}
          href={`https://docs.google.com/viewer?url=${encodeURIComponent(submissionData.file_reports[2]?submissionData.file_reports[2]:"")}`}
          target="_blank"
          rel="noopener noreferrer"
        />      
            {/* <DefaultButton text="Delete" styles={calloutBtnStyles} />  */}
      </div>
      </Callout>
     )}
    </div>
   </div>
          <div
            className={`${styles.track_submission_progress_thumb_title_container}`}
            data-title={"Final Select"}
          >
            <div
              onClick={() => setCurrentLevel(3)}
              className={`${styles.track_submission_progress_thumb_container} ${
                currentLevel === 3 ? styles.current : null
              }
							${
                submissionData.remarks[3]?.failed === ""
                  ? styles.thumb_grey
                  : submissionData.remarks[3]?.failed === false 
                  ? styles.thumb_green
                  : styles.thumb_red
              }`}
            >
              <img
                className={styles.track_submission_progress_thumb}
                src={rejectionLevel <= 3 ? thumbsdownwhite : thumbsupwhite}
                alt=""
                srcset=""
              />
            </div>
          </div>

          <div className={`${styles.uploadIcon}`}>
          <div className={`${styles.trackUploadCont} ${
               remarksArr[3].status === "final_select" ? styles.currentStage:styles.currentStage2
              }
              ${submissionData.file_reports[2] ? styles.currentStage:styles.currentStage2}
              `}>
             <Icon  className={submissionData.file_reports[3]?styles.uploadedIconStyle:styles.defaultIconStyle}
                iconName="PublishContent"
                styles={{ root: defaultIconStyle }}
                onClick={() => openCallout('icon4')}
                id={`icon4_${submissionData.submission_id._id}`} 
            />
            {calloutStates['icon4'] && (
            <Callout
                gapSpace={0}
                target={`#icon4_${submissionData.submission_id._id}`} 
                onDismiss={() => closeCallout('icon4')}
                isBeakVisible={false}
                directionalHint={DirectionalHint.bottomCenter}
            >
           <div className={`${styles.iconStylesyes}`}>      
           <label htmlFor="resume-upload" className={`${styles.uploadLabel} ${calloutBtnStyles.root}`}>
            Upload
           </label>
         <input style={{display: "none",paddingLeft:'12px',width:'5px',background:"red" }}
           type="file"
           name="resume"
           id="resume-upload"
           onChange={(e) =>  uploadHandler(e,3)}
         />
         <DefaultButton
            text="View"
            styles={calloutBtnStyles}
            href={`https://docs.google.com/viewer?url=${encodeURIComponent(submissionData.file_reports[3]?submissionData.file_reports[3]:"")}`}
            target="_blank"
            rel="noopener noreferrer"
         />  
          {/* <DefaultButton text="Delete" styles={calloutBtnStyles} />  */}
     </div>
      </Callout>
    )}
    </div>
  </div> 
     
         <div
            className={`${styles.track_submission_progress_thumb_title_container}`}
            data-title={"Offered"}
          >
            <div
              onClick={() => setCurrentLevel(4)}
              className={`${styles.track_submission_progress_thumb_container} ${
                currentLevel === 4 ? styles.current : null
              } 
							${
                submissionData.remarks[4]?.failed === ""
                  ? styles.thumb_grey
                  : submissionData.remarks[4]?.failed === false
                  ? styles.thumb_green
                  : styles.thumb_red
              }`}
            >
              <img
                className={styles.track_submission_progress_thumb}
                src={rejectionLevel <= 4 ? thumbsdownwhite : thumbsupwhite}
                alt=""
                srcset=""
              />
            </div>
          </div>

          <div className={`${styles.uploadIcon}`}>
          <div className={`${styles.trackUploadCont} ${
               remarksArr[4].status === "offered"? styles.currentStage:styles.currentStage2
              }
              ${submissionData.file_reports[3] ? styles.currentStage:styles.currentStage2}
              `}>
             <Icon  className={submissionData.file_reports[4]?styles.uploadedIconStyle:styles.defaultIconStyle}
                iconName="PublishContent"
                styles={{ root: defaultIconStyle }}
                onClick={() => openCallout('icon5')}
                id={`icon5_${submissionData.submission_id._id}`} 
            />
            {calloutStates['icon5'] && (
            <Callout
                gapSpace={0}
                target={`#icon5_${submissionData.submission_id._id}`} 
                onDismiss={() => closeCallout('icon5')}
                isBeakVisible={false}
                directionalHint={DirectionalHint.bottomCenter}
            >
          <div className={`${styles.iconStylesyes}`}>     
       <label htmlFor="resume-upload" className={`${styles.uploadLabel} ${calloutBtnStyles.root}`}>
         Upload
       </label>
       <input style={{display: "none",paddingLeft:'12px',width:'5px',background:"red" }}
         type="file"
         name="resume"
         id="resume-upload"
         onChange={(e) =>  uploadHandler(e,4)}
       />
       <DefaultButton
          text="View"
          styles={calloutBtnStyles}
          href={`https://docs.google.com/viewer?url=${encodeURIComponent(submissionData.file_reports[4]?submissionData.file_reports[4]:"")}`}
          target="_blank"
          rel="noopener noreferrer"
        /> 
        {/* <DefaultButton text="Delete" styles={calloutBtnStyles} />  */}
  </div>
      </Callout>
    )}
  </div>
</div>
          <div
            className={`${styles.track_submission_progress_thumb_title_container}`}
            data-title={"Onboard"}
          >
            
            <div
              onClick={() => setCurrentLevel(5)}
              className={`${styles.track_submission_progress_thumb_container} ${
                currentLevel === 5 ? styles.current : null
              } ${
                submissionData.remarks[5]?.failed === ""
                  ? styles.thumb_grey
                  : submissionData.remarks[5]?.failed === false
                  ? styles.thumb_green
                  : styles.thumb_red
              }`}
            >
              <img
                className={styles.track_submission_progress_thumb}
                src={rejectionLevel <= 5 ? thumbsdownwhite : thumbsupwhite}
                alt=""
                srcSet=""
              />
            </div>
          </div>

          <div className={`${styles.uploadIcon}`}>
          <div className={`${styles.trackUploadCont} ${
               remarksArr[5].status === "Onboard" ? styles.currentStage:styles.currentStage2
              }
              ${submissionData.file_reports[4] ? styles.currentStage:styles.currentStage2}
              `}>
             <Icon className={submissionData.file_reports[5]?styles.uploadedIconStyle:styles.defaultIconStyle}
                iconName="PublishContent"
                styles={{ root: defaultIconStyle }}
                onClick={() => openCallout('icon6')}
                id={`icon6_${submissionData.submission_id._id}`} 
            />
            {calloutStates['icon6'] && (
            <Callout
                gapSpace={0}
                target={`#icon6_${submissionData.submission_id._id}`} 
                onDismiss={() => closeCallout('icon6')}
                isBeakVisible={false}
                directionalHint={DirectionalHint.bottomCenter}
            >
           <div className={`${styles.iconStylesyes}`}>       
       <label htmlFor="resume-upload" className={`${styles.uploadLabel} ${calloutBtnStyles.root}`}>
         Upload
       </label>
       <input style={{display: "none",paddingLeft:'12px',width:'5px',background:"red" }}
         type="file"
         name="resume"
         id="resume-upload"
         onChange={(e) =>  uploadHandler(e,5)}
       />
       <DefaultButton
          text="View"
          styles={calloutBtnStyles}
          href={`https://docs.google.com/viewer?url=${encodeURIComponent(submissionData.file_reports[5]?submissionData.file_reports[5]:"")}`}
          target="_blank"
          rel="noopener noreferrer"
        />
        <DefaultButton text="Delete" styles={calloutBtnStyles} /> 
  </div>
      </Callout>
    )}
  </div>
</div>

          <div
            onClick={() => setCurrentLevel(6)}
            className={styles.track_submission_progress_thumb_title_container}
            data-title={"BG Verification"}
          >
            <div
              className={`${styles.track_submission_progress_thumb_container} ${
                currentLevel === 6 ? styles.current : null
              }
							${
                submissionData.remarks[6]?.failed === ""
                  ? styles.thumb_grey
                  : submissionData.remarks[6]?.failed === false
                  ? styles.thumb_green
                  : styles.thumb_red
              }`}
            >
              <img
                className={styles.track_submission_progress_thumb}
                src={rejectionLevel <= 6 ? thumbsdownwhite : thumbsupwhite}
                alt=""
                srcset=""
              />
            </div>
          </div>

         
        </div>
        <div className={styles.track_submission_remarks_container}>
          <div className={styles.track_submission_remarks_title}>REMARKS</div>

          <div
            className={`${styles.main_wysiwyg_container} ${
              submissionData["remarks"][currentLevel]?.remark.length > 0
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
              placeholder="Click to Add Remarks"
              editorState={editorState}
              onEditorStateChange={editorStateHandler}
            />
          </div>
      
        </div>
      </div>
    </div>
  );
};

export default TrackSubmission;