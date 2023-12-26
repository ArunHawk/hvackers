import React, { useState } from "react";
import styles from "./TargetListing.module.css";
import {
  PrimaryButton,
  SearchBox,
  FontIcon,
  mergeStyles,
  DefaultButton,
} from "@fluentui/react";
import {
  MessageBar,
  MessageBarType,
  TextField,
  Callout,
  DirectionalHint,
} from "@fluentui/react";
import { useEffect } from "react";
import AddTargetModal from "./AddTargetModal";
import AmTargetModal from "./AmTargetModal";
import { axiosPrivateCall } from "../constants";
import notificationbox from "../assets/notification.png";
import NotificationsBox from "../components/TargetNotification";
import { useLocation, useSearchParams } from "react-router-dom";
import { Spinner, SpinnerSize } from '@fluentui/react';


const iconClass1 = mergeStyles({
  fontWeight: 200,
  fontSize: 12,
  height: 12,
  width: 12,
  margin: "0 ",
  marginLeft: 10,
  color: "#999DA0",
});

const calloutBtnStyles = {
  root: {
    border: "none",
    padding: "0px 10px",
    textAlign: "left",
    height: "20px",
    marginRight: "20px",
  },
};

const formatDateToDMY = (dateString) => {

  const originalDate = new Date(dateString);

  if (isNaN(originalDate)) {
    return 'Invalid Date';
  }

  const day = originalDate.getDate().toString().padStart(2, '0');
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  const year = originalDate.getFullYear();

  return `${day}/${month}/${year}`;
};


const addIcon = { iconName: "Add" };

const messageBarStyles = {
  content: {
    maxWidth: 620,
    minWidth: 450,
  },
};

const narrowTextFieldStyles1 = {
  fieldGroup: {
    width: 50,
    height: 15,
    marginLeft: 20,
    marginBottom: 15,
    border: "none",
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    paddingLeft: "13px",
  },
  field: {
    fontSize: "12px",
    fontFamily: "Lato",
    color: "#5B5F62",
  },
};

const narrowTextFieldStyles = {
  fieldGroup: {
    width: 60,
    height: 15,
    marginLeft: 15,
    marginBottom: 15,
    border: "none",
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    paddingLeft: "13px",
    background: "#CEE5F7 ", //#CEE5F7
  },
  field: {
    fontSize: "12px",
    fontFamily: "Lato",
    color: "#5B5F62",
  },
};
const narrowTextFieldStyles2 = {
  fieldGroup: {
    width: 60,
    height: 15,
    marginLeft: 15,
    marginBottom: 15,
    border: "none",
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    paddingLeft: "13px",
    background: "#FBBABE",
  },
  field: {
    fontSize: "12px",
    fontFamily: "Lato",
    color: "#5B5F62",
  },
};

const narrowTextFieldStyles3 = {
  fieldGroup: {
    width: 60,
    height: 15,
    marginLeft: 15,
    marginBottom: 15,
    border: "none",
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    paddingLeft: "13px",
    background: " #87FFE3",
  },
  field: {
    fontSize: "12px",
    fontFamily: "Lato",
    color: "#5B5F62",
  },
};

// TopData design End Nisha

// BottomData design Start Nisha
const narrowTextFieldStyles0 = {
  fieldGroup: {
    width: 60,
    height: 15,
    marginLeft: 15,
    marginBottom: 15,
    border: "none",
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    paddingLeft: "13px",
    background: "#FBBABE", //#CEE5F7
  },
  field: {
    fontSize: "12px",
    fontFamily: "Lato",
    color: "#5B5F62",
  },
};

const narrowTextFieldStyles22 = {
  fieldGroup: {
    width: 60,
    height: 15,
    marginLeft: 15,
    marginBottom: 15,
    border: "none",
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    paddingLeft: "13px",
    background: "#EED2EB",
  },
  field: {
    fontSize: "12px",
    fontFamily: "Lato",
    color: "#5B5F62",
  },
};

const narrowTextFieldStyles33 = {
  fieldGroup: {
    width: 60,
    height: 15,
    marginLeft: 15,
    marginBottom: 15,
    border: "none",
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    paddingLeft: "13px",
    background: "#87FFE3",
  },
  field: {
    fontSize: "12px",
    fontFamily: "Lato",
    color: "#5B5F62",
  },
};


// BottomData design End

function TargetListing() { 
  const [showMessageBar, setShowMessageBar] = useState(false);
  const [showWarMessageBar, setShowWarMessageBar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  const searchParams = useSearchParams();
  const [accountManagerTargets, setAccountManagerTargets] = useState([]);
  const [bdeTargets, setBdeTargets] = useState([]);
  const [recruiterTargets, setRecruiterTargets] = useState([]);
  const [teamLeadTargets, setTeamLeadTargets] = useState([]);
  const [match, setMatch] = useState(location.state);
  const [showEditButton, setShowEditButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAccountManagerTargets, setFilteredAccountManagerTargets] = useState([]);
  const [filteredBdeTargets, setFilteredBdeTargets] = useState([]);
  const [filteredRecruiterTargets, setFilteredRecruiterTargets] = useState([]);
  const [filteredTeamLeadTargets, setFilteredTeamLeadTargets] = useState([])
  const [dataPresent, setDataPresent] = useState(false);

  const [reviewedData,setViewedData]=useState([])
  // for notification popup states
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
      setIsPopupOpen(true);
    };
  
  const handleClosePopup = () => {
      setIsPopupOpen(false);
    };


    // Create an array to maintain notification states for each card
  const [cardNotificationStates, setCardNotificationStates] = useState(
    new Array(accountManagerTargets.length).fill(false)
  );

    // Create an array to maintain notification states for each card 2
  const [cardNotificationStates2, setCardNotificationStates2] = useState(
    new Array(bdeTargets.length).fill(false)
  );
  // Function to handle opening the notification for a specific card 2
  const handleOpenCardNotification = (targetId) => {
    const updatedStates = new Array(cardNotificationStates.length).fill(false); // Set all values to false initially
    updatedStates[targetId] = true; // Set the current value to true
    setCardNotificationStates(updatedStates);
  };

  // Function to handle closing the notification for a specific card
  const handleOpenCardNotification2 = (index) => {
    const updatedStates2 = new Array(cardNotificationStates2.length).fill(false); // Set all values to false initially
    updatedStates2[index] = true; // Set the current value to true
    setCardNotificationStates2(updatedStates2);
  };

  // Function to handle closing the notification for a specific card
  const handleCloseCardNotification = (index) => {
    const updatedStates = [...cardNotificationStates];
    updatedStates[index] = false;
    setCardNotificationStates(updatedStates);
  };

  // Function to handle closing the notification for a specific card 2
  const handleCloseCardNotification2 = (index) => {
    const updatedStates2 = [...cardNotificationStates2];
    updatedStates2[index] = false;
    setCardNotificationStates2(updatedStates2);
  };
    // end  

  const token = localStorage.getItem("token");
  let base64Url = token.split(".")[1];
  let decodedValue = JSON.parse(window.atob(base64Url));
  const [userId, setUserId] = useState(decodedValue.user_id);
  const [targetUserId, setTargetUserId] = useState();
  const [targetUserIdbde, setTargetUserIdbde] = useState();
  const [updateCallout, setUpdateCallout] = useState(false);
  const [isTargetEnabled, setIsTargetEnabled] = useState(false);
  const [isContractEnabled, setIsContractEnabled] = useState(false);
  const [isFullTimeEnabled, setIsFullTimeEnabled] = useState(false);
  const [Accept, setAccept] = useState(false);
  const [Request, setRequest] = useState(false);
const [count,setCount]=useState({ topData: [], bottomData: [] })
const [notificationPropup,setNotificationPropup]=useState([])
const isTeamLead = decodedValue.user_role === 'team_lead';
  const isAdmin = decodedValue.user_role === 'admin';
  const isAccountManager = decodedValue.user_role === 'account_manager';
  const isBde = decodedValue.user_role === 'bde';
  const isRecruiter = decodedValue.user_role === 'recruiter';
  const [isTargetEnabled2, setIsTargetEnabled2] = useState(false);
  const [isContractEnabled2, setIsContractEnabled2] = useState(false);
  const [isFullTimeEnabled2, setIsFullTimeEnabled2] = useState(false);
  const [showEditButton2, setShowEditButton2] = useState(false);
  const [acceptUpdatedDates, setAcceptUpdatedDates] = useState([]);
  
  // Determine the top and bottom data based on user role
  let topData;
  let bottomData;

  if (isAdmin) {
    topData = accountManagerTargets; // Display account manager data for admin
    bottomData = bdeTargets; // Display BDE data for admin
  }
  else if(isAccountManager){
    topData = accountManagerTargets; // Display account manager data for admin
    bottomData = teamLeadTargets; 
  }
  else if(isBde){
    topData = bdeTargets;
  }
  else if(isTeamLead){
    topData = teamLeadTargets;
    bottomData = recruiterTargets;
  }
  else if(isRecruiter){
    topData = recruiterTargets;
  }

// Define a search function
const filterTargets = (data, searchTerm) => {
  if (!searchTerm) {
    return data; // If no search term, return the original data
  }
  searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive search

  return data.filter((target) => {
    // Customize this condition based on your search requirements
    return (
      (target.designation && target.designation.toLowerCase().includes(searchTerm)) ||
      (target.name && target.name.toLowerCase().includes(searchTerm)) ||
      (target.target && target.target.toString().includes(searchTerm)) // Check if target.target is not null before calling toString
    );
  });
};


// Filter the topData based on the search term
const filteredTopData = filterTargets(topData, searchTerm);

// Filter the bottomData based on the search term
const filteredBottomData = filterTargets(bottomData, searchTerm);

  const openCallout = (cardId) => {
    setRequest(false);
    setShowEditButton(false);
    setUpdateCallout(cardId);

    // Determine which state to update based on the card clicked
    if (accountManagerTargets.find((target) => target._id === cardId)) {
      setTargetUserId(cardId);
      setTargetUserIdbde(null); // Reset the other state
    } else {
      setTargetUserId(null); // Reset the other state
      setTargetUserIdbde(cardId);
    }
  };

  const closeCallout = () => {
    setUpdateCallout(null);
  };

  const handleIconClick = () => {
    setShowEditButton(!showEditButton);
  };

  useEffect(() => {
    if (showMessageBar) {
      setTimeout(() => {
        setShowMessageBar(false);
      }, 2000);
    }
  }, [showMessageBar]);

  const ISOdateToCustomDate = (value) => {
    const dateFormat = new Date(value);
    let year = dateFormat.getFullYear();
    let month = dateFormat.getMonth() + 1;
    let date = dateFormat.getDate();

    if (date < 10) {
      date = "0" + date;
    }
    if (month < 10) {
      month = "0" + month;
    }

    return date + "/" + month + "/" + year;
  };


  const getNotificationData = async (assigned,updated,created,msg,data) => {

      let readDetails={id:decodedValue.user_id,read:'false'};
     let newNotificationData = {
        assigned: assigned,
        updated_by:updated,
        created_by:created,
        message: msg,
        data:data,
        user:userId,
        isRead:readDetails ,
      };

try{
      // Assuming axiosPrivateCall is a function that sends a POST request
      await axiosPrivateCall.post('api/v1/notification/sendNotification', newNotificationData).then(res=>
    
     {   if(res.data==="already exists"){
         setShowWarMessageBar(true)
        }else{
          setShowMessageBar(true)
        }}
      );
      console.log(newNotificationData,'Data posted successfully');
    } 
    catch (error) { console.error('Error:', error.message);
    }

  };





  useEffect(() => {

    if (showMessageBar) {
      setTimeout(() => {
        setShowMessageBar(false);
      }, 2000);
    }
    if (showWarMessageBar) {
      setTimeout(() => {
        setShowWarMessageBar(false);
      }, 2000);
    }
   

  }, [userId, showMessageBar, searchTerm]);
  
  useEffect(()=>{
    axiosPrivateCall.get(`api/v1/notification/getNotification/${userId}`).then(
      (res)=>{
        setNotificationPropup(res.data)
      })
      },[])

      useEffect(() => {
        const getTargetData = () => {
          axiosPrivateCall
            .get(`api/v1/targetControl/getHierarchyTargetData?employee_id=${userId}`)
            .then((res) => {
              setDataPresent(true);
      
              // Filter data based on designation
              const accountManagerData = res.data.filter((target) => target.designation === "account_manager");
              const bdeData = res.data.filter((target) => target.designation === "bde");
              const recruiterData = res.data.filter((target) => target.designation === "recruiter");
              const teamLeadData = res.data.filter((target) => target.designation === "team_lead");
      
              switch (decodedValue.user_role) {
                case "admin":
                  setAccountManagerTargets(accountManagerData);
                  setBdeTargets(bdeData);
                  break;
                case "account_manager":
                  setAccountManagerTargets(accountManagerData);
                  setTeamLeadTargets(teamLeadData);
                  break;
                case "recruiter":
                  setRecruiterTargets(recruiterData);
                  break;
                case "team_lead":
                  setTeamLeadTargets(teamLeadData);
                  setRecruiterTargets(recruiterData);
                  break;
                // Handle other roles as needed
              }
      
              // Filter the targets based on the search term
              const filteredAccountManagerTargets = filterTargets(accountManagerData, searchTerm);
              const filteredBdeTargets = filterTargets(bdeData, searchTerm);
              const filteredRecruiterTargets = filterTargets(recruiterData, searchTerm);
              const filteredTeamLeadTargets = filterTargets(teamLeadData, searchTerm);
      
              setFilteredAccountManagerTargets(filteredAccountManagerTargets);
              setFilteredBdeTargets(filteredBdeTargets);
              setFilteredRecruiterTargets(filteredRecruiterTargets);
              setFilteredTeamLeadTargets(filteredTeamLeadTargets);
      
              // Check if the data is present or not
              if (accountManagerData.length === 0 && bdeData.length === 0 && recruiterData.length === 0 && teamLeadData.length === 0) {
              } else {
                setDataPresent(true);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        };
      
        getTargetData();

      }, [isModalOpen]);




    const receiveFromChild = (data,id) => {
      const matchedNotifications = filteredAccountManagerTargets.map(target => {
       if(target._id===id){
        setIsTargetEnabled(true);
        setIsContractEnabled(true);
        setIsFullTimeEnabled(true);
        setShowEditButton(true);
        setTargetUserId(target._id);
       }
      
      })
      return matchedNotifications ;
    };



  
const NotificationCount=()=>{
  const matchedNotificationsTopData = topData.map(target => {

    const filteredNotifications = notificationPropup.filter(notification => {
     
      if (notification.isRead.id === userId) {
        return (
          notification.assigned === target._id &&
          notification.isRead.read === 'false' &&
          (notification.updated_by === userId || notification.created_by === userId)
        );
      } else {
        return notification.assigned === target._id && notification.isRead.read === 'false';
      }
      
    });
    return filteredNotifications;
  });
  
  let matchedNotificationsBottomData = []; // Initialize as an empty array
  
  if (bottomData) {
    matchedNotificationsBottomData = bottomData.map(target => {
      const filteredNotifications = notificationPropup.filter(notification => {
        if (notification.isRead.id === userId) {
          return (
            notification.assigned === target._id &&
            notification.isRead.read === 'false' &&
            (notification.updated_by === userId || notification.created_by === userId)
          );
        } else {
          return notification.assigned === target._id && notification.isRead.read === 'false';
        }
      });
      return filteredNotifications;
    });
  }

  const notificationtopCounts = matchedNotificationsTopData.map(filteredNotifications => filteredNotifications.length);
  const notificationbottomCounts = matchedNotificationsBottomData.map(filteredNotifications => filteredNotifications.length);
  
  return {
    topData: notificationtopCounts,
    bottomData: notificationbottomCounts,
  };
}
useEffect(() => {
  const counts = NotificationCount();
  setCount(counts)
}, [filteredAccountManagerTargets, notificationPropup, userId]);


const updateTargetData = async(e) => {
  const updated=e.target.innerText;

  let targetToUpdate = null;
  let targetToUpdatebde = null;
  let selectedId = null;
  if (targetUserId) {
    targetToUpdate = accountManagerTargets.find(
      (target) => target._id === targetUserId
    );
    selectedId = targetUserId;
  }

  if (targetUserIdbde) {
    targetToUpdatebde = bdeTargets.find(
      (target) => target._id === targetUserIdbde
    );
    selectedId = targetUserIdbde;
  }

  if (!selectedId) {
    console.error("No target user ID selected for update.");
    return;
  }

  const updatedTargetData = {
    _id: selectedId,
    target:
      (targetToUpdate && targetToUpdate.target) ||
      (targetToUpdatebde && targetToUpdatebde.target),
    contract:
      (targetToUpdate && targetToUpdate.contract) ||
      (targetToUpdatebde && targetToUpdatebde.contract),
    fulltime:
      (targetToUpdate && targetToUpdate.fulltime) ||
      (targetToUpdatebde && targetToUpdatebde.fulltime),
    message:(Accept === true?"accepted":"request")

  };
if(updated==='Save'){
  await axiosPrivateCall
    .post(`api/v1/targetControl/updateTargetData`, updatedTargetData)
    .then((res) => {
      setShowMessageBar(true);
  
    })
    .catch((e) => {
      console.error(e);
    });
  }
};

  const inputChangeHandler = (e, name, index) => {
    const { value } = e.target;
    console.log("etarget",{value})
    let inputValue = value.trim();
    const updatedTargets = [...accountManagerTargets];
    updatedTargets[index][name] = inputValue;

    if (name === "contract" || name === "fulltime") {
      const contract = parseFloat(updatedTargets[index]["contract"]) || 0;
      const fulltime = parseFloat(updatedTargets[index]["fulltime"]) || 0;
      const revenue = (contract * 1.25 + fulltime * 1);
      updatedTargets[index]["revenue"] = revenue;
    }

    setAccountManagerTargets(updatedTargets);
  };

  const inputChangeHandlerL = (e, name, index) => {
    const { value } = e.target;
    console.log("etarget",{value})
    let inputValue = value.trim();
    const updatedTargets = [...teamLeadTargets];
    updatedTargets[index][name] = inputValue;

    if (name === "contract" || name === "fulltime") {
      const contract = parseFloat(updatedTargets[index]["contract"]) || 0;
      const fulltime = parseFloat(updatedTargets[index]["fulltime"]) || 0;
      const revenue = (contract * 1.25 + fulltime * 1);
      updatedTargets[index]["revenue"] = revenue;
    }

    setAccountManagerTargets(updatedTargets);
  };

    const inputChangeHandlerR = (e, name, index) => {
  
    const { value } = e.target;
    let inputValue = value.trim();
    const updatedTargets = [...recruiterTargets];
    updatedTargets[index][name] = inputValue;

    if (name === "contract" || name === "fulltime") {
      const contract = parseFloat(updatedTargets[index]["contract"]) || 0;
      const fulltime = parseFloat(updatedTargets[index]["fulltime"]) || 0;
      const revenue = (contract * 1.25 + fulltime * 1);
      updatedTargets[index]["revenue"] = revenue;
    }

    setAccountManagerTargets(updatedTargets);
  };

  const inputChangeHandler1 = (e, name, index) => {
    const { value } = e.target;
    let inputValue = value.trim();
    const updatedTargets = [...bdeTargets];
    updatedTargets[index][name] = inputValue;
   
    if (name === "contract" || name === "fulltime") {
      const contract = parseFloat(updatedTargets[index]["contract"]) || 0;
      const fulltime = parseFloat(updatedTargets[index]["fulltime"]) || 0;
      const revenue = (contract * 1.25 + fulltime * 1);
      updatedTargets[index]["revenue"] = revenue;
    }

    setBdeTargets(updatedTargets);
  };

  const acceptDates=(id)=>{
    const acceptedDates = [];

    notificationPropup.forEach(notification => {
      if (notification.message === 'accept' && notification.assigned === id) {
        acceptedDates.push(formatDateToDMY(notification.updatedAt));
      }
    });
  
    return acceptedDates;
  }

  return (
<div >
    {!dataPresent ? (
      <Spinner className={styles.spinnerStyle} size={SpinnerSize.large} label="Loading ..."/>
    ) : (
    <div className={styles.page}>
      <div className={styles.container}>
        {decodedValue.user_role === "admin"
          ? isModalOpen && (
              <AddTargetModal
                showMessageBar={showMessageBar}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setShowMessageBar={setShowMessageBar}
              />
            )
          : isModalOpen && (
              <AmTargetModal
                showMessageBar={showMessageBar}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setShowMessageBar={setShowMessageBar}
              />
            )}
        <div className={styles.nav_container}>
          <div className={styles.title}>Target Listing</div>
      
          {showMessageBar ? (
            <div>
              <MessageBar
              onDismiss={() => setShowMessageBar(!showMessageBar)}
                styles={messageBarStyles}
                dismissButtonAriaLabel="Close"
                messageBarType={MessageBarType.success}
              >
                Target added successfully
              </MessageBar>
            </div>
         ) : showWarMessageBar ? (
            <div>
              <MessageBar
                onDismiss={() => setShowWarMessageBar(!showWarMessageBar)}
                styles={messageBarStyles}
                dismissButtonAriaLabel="Close"
                messageBarType={MessageBarType.error}
              >
                Target Already Updated
              </MessageBar>
            </div>
     ) : null}
          <div className={styles.nav_items}>
          <SearchBox
            placeholder=" "
            value={searchTerm}
            onChange={(e, newValue) => setSearchTerm(newValue)}
            styles={narrowTextFieldStyles1}
            showIcon
          />
            <PrimaryButton
              text="Add Target"
              iconProps={addIcon}
              onClick={() => {
                setIsModalOpen(!isModalOpen);
                setMatch(false);
              }}
            />
          </div>
        </div>
      </div>
      <div className={decodedValue.user_role === 'recruiter'? 
                          styles.targetContainerR:styles.targetContainer }>

        <div className={styles.overall_container}>

        {filteredTopData
        .map((target, index) => (<div key={target._id}>
              <div className={styles.target_AMcard}>
                <div
                  className={styles.target_title}
                  style={{ display: "flex", alignItems: "center" }}
                >
                                {decodedValue.user_role === 'account_manager'? 
                          "Account Manager Target": decodedValue.user_role === 'team_lead'? 
                          "Lead Target": decodedValue.user_role === 'recruiter'?
                          "Recruiter Target": decodedValue.user_role === 'admin'?
                           "Account Manager Target": "Account Manager Target"}
                  <div className= {decodedValue.user_role === 'team_lead'? 
                  styles.target_countL :decodedValue.user_role === 'recruiter'? 
                  styles.target_countR:null} style={{ position: 'relative' }}>
                  
                 {count.topData[index] !== 0 && count.topData[index]!== '' && count.topData[index] !== undefined && (

                      <p style={{
                        fontSize: '7px',
                        position: 'absolute',
                        bottom: '15px',
                        left: '100%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        width: '12px',
                        height: '12px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                       {count.topData[index]}
                      </p>
                    )}
                    <img src={notificationbox} alt="image" onClick={() => handleOpenCardNotification(index)} />
                  </div> 


                  {/* <img src={notificationbox} alt="image"  onClick={() => handleOpenCardNotification(index)}/> */}
               
                  <FontIcon
                    iconName="MoreVertical"
                    className={iconClass1}
                    onClick={() => openCallout(target._id)} // Pass the index to identify the clicked card
                    id={`FO_${target._id}`}
                  />
             
       {updateCallout === target._id && (
  <Callout
    gapSpace={0}
    target={`#FO_${target._id}`}
    onDismiss={() => closeCallout()}
    isBeakVisible={false}
    directionalHint={DirectionalHint.bottomCenter}
  >
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {decodedValue.user_role === 'admin' && (
        <DefaultButton
          text="Edit"
          onClick={() => {
            setIsTargetEnabled(true);
            setIsContractEnabled(true);
            setIsFullTimeEnabled(true);
            setShowEditButton(true);
            setTargetUserId(target._id);
          }}
          styles={calloutBtnStyles} // Add styles if needed
        />
      )}


{(decodedValue.user_role === 'account_manager' || decodedValue.user_role === 'team_lead'|| decodedValue.user_role === 'recruiter') && (

  <>
    <DefaultButton
      text="Accept"
      styles={calloutBtnStyles}
      onClick={() => {
        getNotificationData(target._id, target.assigned_to,target.assigned_by, "accept",
        (decodedValue.user_role === 'account_manager')?accountManagerTargets[index]
        :(decodedValue.user_role ==="team_lead") ? teamLeadTargets[index]: (decodedValue.user_role ==="recruiter")?recruiterTargets[index]:null )
        // setIsTargetEnabled(true)
        setAccept(true)
        setRequest(false)
      }}
    />
    <DefaultButton
      text="Request"
      styles={calloutBtnStyles}
      onClick={() => {
        setIsTargetEnabled(true)
        setIsFullTimeEnabled(true)
        setIsContractEnabled(true)
        setTargetUserId(target._id)
        setRequest(true)
        setAccept(false)

     }}
    />
  </>
)}
    </div>
  </Callout>
)}

                </div>
                {/* where i called the box */}
                <div className={styles.popStyle}>
        
                {cardNotificationStates[index] ? ( 
                  <NotificationsBox
                    isOpen={true}
                    // data={notificationPropup}
                    sendToParent={receiveFromChild}
                    onDismiss={() => handleCloseCardNotification(index)}
                    targetId={target._id} // Make sure this is correctly set
                  />
                
               ):''}  
            
                </div>
                {/* where i called the box */}

                <div className={styles.target_sub_title}>
                  Designation: {target.designation}
                </div>
                <div className={styles.target_name_target}>
                <div className={decodedValue.user_role === ('account_manager')? styles.target_card1: 
                  decodedValue.user_role === ('admin')? styles.target_card1:
                  decodedValue.user_role === 'team_lead'? styles.target_card2:
                  decodedValue.user_role === 'recruiter'? styles.target_card3: null }>
 
                    <div className={styles.target_title_card1}>Name</div>
                    <div className={styles.target_sub_title_card1}>
                      {target.name}
                    </div>
                  </div>
                  <div className={decodedValue.user_role === ('account_manager')? styles.target_card1: 
                  decodedValue.user_role === ('admin')? styles.target_card1:
                  decodedValue.user_role === 'team_lead'? styles.target_card2:
                  decodedValue.user_role === 'recruiter'? styles.target_card3: null }>

                    <div className={styles.target_title_card1}>Target</div>
                    <div className={styles.target_sub_title_card1}>
                    {isTargetEnabled === true  && targetUserId===target._id ? (
                        <TextField
                          value={target.target}
                            // {/* textfield color start Nisha*/}
                          styles={decodedValue.user_role === 'account_manager'? 
                          narrowTextFieldStyles: decodedValue.user_role === 'team_lead'? 
                          narrowTextFieldStyles2: decodedValue.user_role === 'recruiter'?
                          narrowTextFieldStyles3: decodedValue.user_role === 'admin'?
                           narrowTextFieldStyles: narrowTextFieldStyles}
                            //  {/* textfield color end Nisha*/}
                          onChange={(e) =>
                            decodedValue.user_role === ('account_manager')? inputChangeHandler(e, "target", index): 
                            decodedValue.user_role === ('admin')? inputChangeHandler(e, "target", index):
                            decodedValue.user_role === 'team_lead'? inputChangeHandlerL(e, "target", index):
                            decodedValue.user_role === 'recruiter'? inputChangeHandlerR(e, "target", index): null 
                          }
                          disabled={!isTargetEnabled}
                        />
                      ) : (
                        target.target
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.target_name_target}>
                <div className={decodedValue.user_role === ('account_manager')? styles.target_card1: 
                  decodedValue.user_role === ('admin')? styles.target_card1:
                  decodedValue.user_role === 'team_lead'? styles.target_card2:
                  decodedValue.user_role === 'recruiter'? styles.target_card3: null }>
                    <div className={styles.target_title_card1}>Contract</div>
                    <div className={styles.target_sub_title_card1}>
                      {isContractEnabled === true && targetUserId === target._id? (
                        <TextField
                          value={target.contract}
                          styles={decodedValue.user_role === 'account_manager'? 
                          narrowTextFieldStyles: decodedValue.user_role === 'team_lead'? 
                          narrowTextFieldStyles2: decodedValue.user_role === 'recruiter'?
                          narrowTextFieldStyles3: decodedValue.user_role === 'admin'?
                           narrowTextFieldStyles: narrowTextFieldStyles}
                           onChange={(e) =>
                            decodedValue.user_role === ('account_manager')? inputChangeHandler(e, "contract", index): 
                            decodedValue.user_role === ('admin')? inputChangeHandler(e, "contract", index):
                            decodedValue.user_role === 'team_lead'? inputChangeHandlerL(e, "contract", index):
                            decodedValue.user_role === 'recruiter'? inputChangeHandlerR(e, "contract", index): null 
                          }
                          disabled={!isContractEnabled}
                        />
                      ) : (
                        target.contract
                      )}
                    </div>
                  </div>
                  <div className={decodedValue.user_role === ('account_manager')? styles.target_card1: 
                  decodedValue.user_role === ('admin')? styles.target_card1:
                  decodedValue.user_role === 'team_lead'? styles.target_card2:
                  decodedValue.user_role === 'recruiter'? styles.target_card3: null }>
                    <div className={styles.target_title_card1}>Full Time</div>
                    <div className={styles.target_sub_title_card1}>
                  
                      {isFullTimeEnabled === true && targetUserId===target._id  ? (
                        <TextField
                          value={target.fulltime}
                          styles={decodedValue.user_role === 'account_manager'? 
                          narrowTextFieldStyles: decodedValue.user_role === 'team_lead'? 
                          narrowTextFieldStyles2: decodedValue.user_role === 'recruiter'?
                          narrowTextFieldStyles3: decodedValue.user_role === 'admin'?
                           narrowTextFieldStyles: narrowTextFieldStyles}
                           onChange={(e) =>
                            decodedValue.user_role === ('account_manager')? inputChangeHandler(e, "fulltime", index): 
                            decodedValue.user_role === ('admin')? inputChangeHandler(e, "fulltime", index):
                            decodedValue.user_role === 'team_lead'? inputChangeHandlerL(e, "fulltime", index):
                            decodedValue.user_role === 'recruiter'? inputChangeHandlerR(e, "fulltime", index): null 
                          }
                          disabled={!isFullTimeEnabled}
                        />
                      ) : (
                        target.fulltime
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.target_name_target}>
                  <div className={decodedValue.user_role === 'account_manager'? styles.target_card1: 
                  decodedValue.user_role === ('admin')? styles.target_card1:
                  decodedValue.user_role === 'team_lead'? styles.target_card2:
                  decodedValue.user_role === 'recruiter'? styles.target_card3: null }>
                    <div className={styles.target_title_card1}>Revenue</div>
                    <div className={styles.target_sub_title_card1}> 
                   < TextField
                          value={target.revenue} 
                          styles={decodedValue.user_role === 'account_manager'? 
                          narrowTextFieldStyles: decodedValue.user_role === 'team_lead'? 
                          narrowTextFieldStyles2: decodedValue.user_role === 'recruiter'?
                          narrowTextFieldStyles3: decodedValue.user_role === 'admin'?
                           narrowTextFieldStyles: narrowTextFieldStyles}
                          // disabled={!isRevenueEnabled}
                        />

                    </div>
                  </div>
                  <div className={decodedValue.user_role === ('account_manager')? styles.target_card1: 
                  decodedValue.user_role === ('admin')? styles.target_card1:
                  decodedValue.user_role === 'team_lead'? styles.target_card2:
                  decodedValue.user_role === 'recruiter'? styles.target_card3: null }>
                    <div className={styles.target_title_card1}>Achieved</div>
                  </div>
                </div>
                <div className={styles.target_allocated_date}>
                  <div className={styles.button}>
                  {showEditButton === true && targetUserId === target._id ? (
                      <PrimaryButton
                        text="Save"
                        onClick={updateTargetData}
                        style={{ fontSize: "14px" }}
                      />
                    ) : null} {  Request === true && targetUserId === target._id ? (  // 
                      <PrimaryButton
                        text="Save"
                        onClick={()=>{
                          updateTargetData()
                        getNotificationData(target._id, target.assigned_to,target.assigned_by, "request",
                        (decodedValue.user_role === 'account_manager')?accountManagerTargets[index]
                        :(decodedValue.user_role ==="team_lead") ? teamLeadTargets[index]: (decodedValue.user_role ==="recruiter")?recruiterTargets[index]:null )}}
                        style={{ fontSize: "14px" }}
                      />
                    ) : null}
                  </div>
               
                  Allocated Date: {formatDateToDMY(target.createdAt)}
                </div>
                <div className={styles.target_end}>
                  <div className={styles.target_id}>
                    ID: {target.employee_id}
                  </div>
         
             <div className={styles.target_date}>
                 
                    Accepted Date:{acceptDates(target._id)}
                  </div>    
              
                </div>
              </div>
            </div>
          ))}
        </div>
         </div>
        <hr />
        <br />

        {/*----------------- BDE target listing ---------------------*/}
        <div className={styles.BdeContainer}>
          <div className={styles.overall_container2}>
          {filteredBottomData
          ?.map((target, index) => (
           
              <div key={index}>
                <div className={styles.target_AMcard}>
                  <div
                    className={styles.target_title}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                   
                   {decodedValue.user_role === 'account_manager'? 
                          "Lead Target": decodedValue.user_role === 'team_lead'? 
                          "Recruiter Target" : decodedValue.user_role === 'admin'?
                           "BD Target": "BDE"}

                      <div className= {decodedValue.user_role === 'admin'?
                        styles.target_countB:decodedValue.user_role === 'team_lead'? 
                        styles.target_countR : decodedValue.user_role === 'account_manager'?
                        styles.target_countL:null} style={{ position: 'relative' }}>
                         
                    {count.bottomData[index] !== 0 && count.bottomData[index]!== '' && count.bottomData[index] !== undefined && (

<p style={{
  fontSize: '7px',
  position: 'absolute',
  bottom: '15px',
  left: '100%',
  transform: 'translateX(-50%)',
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '50%',
  width: '12px',
  height: '12px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}}>
 {count.bottomData[index]}
</p>
)}
                  <img src={notificationbox} alt="image" onClick={() => handleOpenCardNotification2(index)} />
                  </div>
 

                    <FontIcon
                      iconName="MoreVertical"
                      className={iconClass1}
                      onClick={() => openCallout(target._id)}
                      id={`FO_${target._id}`}
                    />
                    {updateCallout === target._id && (
                      <Callout
                        gapSpace={0}
                        target={`#FO_${target._id}`}
                        onDismiss={() => closeCallout()}
                        isBeakVisible={false}
                        directionalHint={DirectionalHint.bottomCenter}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <DefaultButton
                              text="Edit"
                              onClick={() => {
                                setIsTargetEnabled2(true);
                                setIsContractEnabled2(true);
                                setIsFullTimeEnabled2(true);
                                setShowEditButton2(true);
                                setTargetUserIdbde(target._id);
                              }}
                              styles={calloutBtnStyles} // Add styles if needed
                            />
                      </div>
                      </Callout>
                    )}
                  </div>
                  {/* where i called the box 2nd time */}
                  <div className={styles.popStyle}>
           
                   {cardNotificationStates2[index] &&(
                
                  <NotificationsBox
                   sendToParent={receiveFromChild}
                  //  data={notificationPropup}
                    isOpen={true}
                    targetId={target._id}
                    onDismiss={() => handleCloseCardNotification2(index)} // Close notification for this card
                  />
                )} 
                </div>
                {/* where i called the box 2n time*/}
                  
                  <div className={styles.target_sub_title}>
                    Designation: {target.designation}
                  </div>
                  <div className={styles.target_name_target}>
                  <div className={decodedValue.user_role === ('account_manager')? styles.target_bottomcard1: 
                  decodedValue.user_role === ('admin')? styles.target_bottomcard3:
                  decodedValue.user_role === 'team_lead'? styles.target_bottomcard2: null }>

                      <div className={styles.target_title_card1}>Name</div>
                      <div className={styles.target_sub_title_card1}>
                        {target.name}
                      </div>
                    </div>
                    <div className={decodedValue.user_role === ('account_manager')? styles.target_bottomcard1: 
                  decodedValue.user_role === ('admin')? styles.target_bottomcard3:
                  decodedValue.user_role === 'team_lead'? styles.target_bottomcard2: null }>

                      <div className={styles.target_title_card1}>Target</div>
                      <div className={styles.target_sub_title_card1}>
                        {isTargetEnabled2 ===true &&  targetUserIdbde === target._id? 
                                       <TextField className={styles.back}
                                       value={target.target}
                                       styles={decodedValue.user_role === 'account_manager'? 
                                       narrowTextFieldStyles0: decodedValue.user_role === 'team_lead'? 
                                       narrowTextFieldStyles33: decodedValue.user_role === 'admin'?
                                        narrowTextFieldStyles22: narrowTextFieldStyles0}
                                        onChange={(e) =>
                                          decodedValue.user_role === ('account_manager')? inputChangeHandlerL(e, "target", index): 
                                          decodedValue.user_role === ('admin')? inputChangeHandler1(e, "target", index):
                                          decodedValue.user_role === 'team_lead'? inputChangeHandlerR(e, "target", index): null
                                        
                                        }
                                       disabled={!isTargetEnabled2}
                                     /> 
                      :target.target}
                      </div>
                    </div>
                  </div>
                  <div className={styles.target_name_target}>
                  <div className={decodedValue.user_role === ('account_manager')? styles.target_bottomcard1: 
                  decodedValue.user_role === ('admin')? styles.target_bottomcard3:
                  decodedValue.user_role === 'team_lead'? styles.target_bottomcard2: null }>

                      <div className={styles.target_title_card1}>Contract</div>
                      <div className={styles.target_sub_title_card1}>
                      {isContractEnabled2 ===true &&  targetUserIdbde === target._id? 
                      <TextField className={styles.back}
                        value={target.contract}
                        styles={decodedValue.user_role === 'account_manager'? 
                        narrowTextFieldStyles0: decodedValue.user_role === 'team_lead'? 
                        narrowTextFieldStyles33: decodedValue.user_role === 'admin'?
                         narrowTextFieldStyles22: narrowTextFieldStyles0}

                         onChange={(e) =>
                          decodedValue.user_role === ('account_manager')? inputChangeHandlerL(e, "contract", index): 
                          decodedValue.user_role === ('admin')? inputChangeHandler1(e, "contract", index):
                          decodedValue.user_role === 'team_lead'? inputChangeHandlerR(e, "contract", index): null
                        
                        }
                        disabled={!isContractEnabled2}
                      />
                      :target.contract}
                      </div>
                    </div>
                    <div className={decodedValue.user_role === ('account_manager')? styles.target_bottomcard1: 
                  decodedValue.user_role === ('admin')? styles.target_bottomcard3:
                  decodedValue.user_role === 'team_lead'? styles.target_bottomcard2: null }>

                      <div className={styles.target_title_card1}>Full Time</div>
                      <div className={styles.target_sub_title_card1}>
                      {isFullTimeEnabled2 ===true &&  targetUserIdbde === target._id ? 
                      <TextField className={styles.back}
                        value={target.fulltime}
                        styles={decodedValue.user_role === 'account_manager'? 
                        narrowTextFieldStyles0: decodedValue.user_role === 'team_lead'? 
                        narrowTextFieldStyles33: decodedValue.user_role === 'admin'?
                         narrowTextFieldStyles22: narrowTextFieldStyles0}
                         onChange={(e) =>
                          decodedValue.user_role === ('account_manager')? inputChangeHandlerL(e, "fulltime", index): 
                          decodedValue.user_role === ('admin')? inputChangeHandler1(e, "fulltime", index):
                          decodedValue.user_role === 'team_lead'? inputChangeHandlerR(e, "fulltime", index): null
                        
                        }
                        disabled={!isFullTimeEnabled2}
                      />
                      :target.fulltime}
                      </div>
                    </div>
                  </div>
                  <div className={styles.target_name_target}>
                  <div className={decodedValue.user_role === ('account_manager')? styles.target_bottomcard1: 
                  decodedValue.user_role === ('admin')? styles.target_bottomcard3:
                  decodedValue.user_role === 'team_lead'? styles.target_bottomcard2: null }>

                      <div className={styles.target_title_card1}>Revenue</div>
                      <div className={styles.target_sub_title_card1}>
                      <TextField
                          value={target.revenue}
                          styles={decodedValue.user_role === 'account_manager'? 
                          narrowTextFieldStyles0: decodedValue.user_role === 'team_lead'? 
                          narrowTextFieldStyles33: decodedValue.user_role === 'admin'?
                           narrowTextFieldStyles22: narrowTextFieldStyles0}
                          // disabled={!isRevenueEnabled}
                        />  

                      </div>
                    </div>
                    <div className={decodedValue.user_role === ('account_manager')? styles.target_bottomcard1: 
                  decodedValue.user_role === ('admin')? styles.target_bottomcard3:
                  decodedValue.user_role === 'team_lead'? styles.target_bottomcard2: null }>

                      <div className={styles.target_title_card1}>Achieved</div>
                    </div>
                  </div>
                  <div className={styles.target_allocated_date}>
                    <div className={styles.button}>
                    {showEditButton2 === true && targetUserIdbde === target._id ? (
                      <PrimaryButton
                        text="Save"
                        onClick={updateTargetData}
                        style={{ fontSize: "14px" }}
                      />
                    ) : null}

                    </div>
                    Allocated Date: {formatDateToDMY(target.createdAt)}
                  </div>
                  <div className={styles.target_end}>
                    <div className={styles.target_id}>
                      ID: {target.employee_id}
                    </div>
              
                   
               <div key={index} className={styles.target_date}>
              
              Accepted Date: {acceptDates(target._id)}
              </div>
               
                  </div>
                </div>
              </div>
            ))}
         
        </div>
      </div>
      </div>
          )}
          </div>
  );
}

export default TargetListing;