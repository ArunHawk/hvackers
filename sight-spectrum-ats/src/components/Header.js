import React, { useState, useEffect } from "react";
import logo from "../Logo1.svg";
import small from "../logo_short.png";
import styles from "./Header.module.css";
import { useUserContext } from "../contexts/UserProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { Callout, Persona, PersonaSize } from "@fluentui/react";
import { useLocationPath } from "../hooks/useLocationPath";
import { axiosPrivateCall } from "../constants";

const profileCalloutStyles = {
  calloutMain: {
    width: 300,
    padding: 14,
  },
};

const defaultUser = {
  text: "Maor Sharett",
  imageInitials: "",
  secondaryText: "maorsharett@gmail.com",
  showSecondaryText: true,
};

const miniPersonaStyles = {
  root: {
    cursor: "pointer",
    alignItems: "flex-start",
    height: 24,
  },
  details: {
    display: "none",
  },
};

const mainPersonaStyles = {
  tertiaryText: {
    color: "#0078D4",
  },
};

function Header(props) {
  const { isCollapsed } = useUserContext();
  const [showProfileCallout, setShowProfileCallout] = useState(false);
  const setIsModalOpen = props.setIsModalOpen;

  const navigate = useNavigate();

  const { path, mainPath, subPath } = useLocationPath();
  const [user, setUser] = useState({});

  let Breadcrumb;

  const token = localStorage.getItem("token");
  let base64Url = token.split(".")[1];
  let decodedValue = JSON.parse(window.atob(base64Url));

  useEffect(() => {
    getEmployeeData();
  }, []);

  function getEmployeeData() {
    axiosPrivateCall
      .get(
        `/api/v1/employee/getEmployeeDetails?employee_id=${decodedValue.user_id}`
      )
      .then((res) => {
        setUser(res.data);
        console.log(decodedValue)
        localStorage.setItem("first_name", res.data.first_name);
        localStorage.setItem("last_name", res.data.last_name);
        localStorage.setItem("demand_creator", res.data.demand_creator);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  let currentUser = user.first_name
    ? {
      text: `${user.first_name} ${user.last_name}`,
      imageInitials: `${user?.first_name?.charAt(0)}${user?.last_name?.charAt(
        0
      )}`.toUpperCase(),
      secondaryText: `${user.email}`,
      showSecondaryText: true,
    }
    : { ...defaultUser };

  if (mainPath === "dashboard") {
    Breadcrumb = { mainpath: "Dashboard" };
  } else if (mainPath === "target") {
    if (subPath === "managetarget") {
      Breadcrumb = { mainpath: "target", subpath: "Manage Target" };
    } else if (subPath === "mytarget") {
      Breadcrumb = { mainpath: "target", subpath: "My Target" };
    }
  } else if (mainPath === "demand") {
    if (subPath === "adddemand") {
      Breadcrumb = { mainpath: "Demand", subpath: "Add Demand" };
    } else if (subPath === "managedemands") {
      Breadcrumb = { mainpath: "Demand", subpath: "Manage Demands" };
    } else if (subPath === "mydemands") {
      Breadcrumb = { mainpath: "Demand", subpath: "My Demands" };
    } else if (subPath === "demandstatus") {
      Breadcrumb = { mainpath: "Demand", subpath: "Demand Status" };
    } else if (subPath === "editdemand") {
      Breadcrumb = { mainpath: "Demand", subpath: "Edit Demand" };
    }
  } else if (mainPath === "submission") {
    if (subPath === "addsubmission") {
      Breadcrumb = { mainpath: "Submission", subpath: "Add Submission" };
    } else if (subPath === "managesubmissions") {
      Breadcrumb = { mainpath: "Submission", subpath: "Manage Submissions" };
    } else if (subPath === "tracksubmission") {
      Breadcrumb = { mainpath: "Submission", subpath: "Track Submission" };
    } else if (subPath === "viewsubmission") {
      Breadcrumb = { mainpath: "Submission", subpath: "View Submission" };
    } else if (subPath === "mysubmissions") {
      Breadcrumb = { mainpath: "Submission", subpath: "My Submissions" };
    }
  } else if (mainPath === "candidatelibrary") {
    if (subPath === "addcandidate") {
      Breadcrumb = { mainpath: "Candidate Library", subpath: "Add Candidate" };
    } else if (subPath === "managecandidates") {
      Breadcrumb = {
        mainpath: "Candidate Library",
        subpath: "Manage Candidates",
      };
    } else if (subPath === "editcandidate") {
      Breadcrumb = { mainpath: "Candidate Library", subpath: "Edit Candidate" };
    }
  } else if (mainPath === "employee") {
    if (subPath === "addemployee") {
      Breadcrumb = { mainpath: "Employee", subpath: "Add Employee" };
    } else if (subPath === "Manageemployee") {
      Breadcrumb = { mainpath: "Employee", subpath: "Manage Employee" };
    } else if (subPath === "editemployee") {
      Breadcrumb = { mainpath: "Employee", subpath: "Edit Employee" };
    }
  }
  else if (mainPath === "managedeals") {
    if (subPath === "managesalespipeline") {
      Breadcrumb = { mainpath: "Manage Deals", subpath: "Manage Deals" };
    }

  } else if (mainPath === "masterlist") {
    if (subPath === "manageclient") {
      Breadcrumb = { mainpath: "Master List", subpath: "Manage Client" };
    }
    else if (subPath === "editclient") {
      Breadcrumb = { mainpath: "Master List", subpath: "Edit Client" };
    }
    else if (subPath === "manageskill") {
      Breadcrumb = { mainpath: "Master List", subpath: "Manage Skillset" };
    }
    else if (subPath === "editskill") {
      Breadcrumb = { mainpath: "Master List", subpath: "Edit Skill" };
    }
    else if (subPath === "managevendor") {
      Breadcrumb = { mainpath: "Master List", subpath: "Manage Vendor" };
    }
    else if (subPath === "editvendor") {
      Breadcrumb = { mainpath: "Master List", subpath: "Edit Vendor" };
    }
  } else if (mainPath === "reports") {
    if (subPath === "recruitersubmission") {
      Breadcrumb = { mainpath: "Repots", subpath: "Recruiter Submission" };
    } else if (subPath === "accountmanager") {
      Breadcrumb = { mainpath: "Repots", subpath: "Account Manager" };
    } else if (subPath === "leaddemand") {
      Breadcrumb = { mainpath: "Repots", subpath: "Lead Demand" };
    } else if (subPath === "clientreport") {
      Breadcrumb = { mainpath: "Repots", subpath: "Client Report" };
    } else if (subPath === "subvendorsubmission") {
      Breadcrumb = { mainpath: "Repots", subpath: "Sub-vendor Submission" };
    } else if (subPath === "clientreportcount") {
      Breadcrumb = { mainpath: "Repots", subpath: "Client Report Coun" };
    }
    else if (subPath === "managesalespipeline") {
      Breadcrumb = { mainpath: "Repots", subpath: "Manage Sales Pipeline" };
    }
    else if (subPath === "editpipeline") {
      Breadcrumb = { mainpath: "Repots", subpath: "Edit Pipeline" };
    }

  }

  const signOutHandler = () => {
    axiosPrivateCall.post('/api/v1/employee/logoutEmployee', {}).then((res) => { console.log(res); localStorage.removeItem("token"); }).catch(e => console.log(e))

    navigate("/");
  };

  return (
    <div className={styles.container}>
      {isCollapsed ? (
        <div className={styles.logo_small}>
          <img src={small} />
        </div>
      ) : (
        <div className={styles.logo_container}>
          <img src={logo} />
        </div>
      )}

      <div
        className={
          isCollapsed ? styles.header_container1 : styles.header_container
        }
      >
        <div>
          {Breadcrumb?.subpath ? (
            <div className={styles.breadContainer}>
              <span
                className={styles.breadcrumbs}
                onClick={() => navigate("/dashboard")}
              >
                <p>Dashboard</p>
              </span>{" "}
              /{" "}
              <span className={styles.breadcrumbs}>
                <p>{Breadcrumb?.subpath}</p>
              </span>{" "}
            </div>
          ) : (
            <div className={styles.breadContainer}>
              <span className={styles.breadcrumbs}>
                <p>Dashboard</p>
              </span>
            </div>
          )}
        </div>

        <div
          id="profileId"
          className={styles.user}
          onClick={() => setShowProfileCallout(!showProfileCallout)}
        >
          <Persona
            {...currentUser}
            size={PersonaSize.size24}
            styles={miniPersonaStyles}
          />
          {showProfileCallout && (
            <Callout
              styles={profileCalloutStyles}
              onDismiss={() => setShowProfileCallout(!showProfileCallout)}
              target={"#profileId"}
              isBeakVisible={false}
              coverTarget
            >
              <div className={styles.profile_callout_container}>
                <div
                  onClick={signOutHandler}
                  className={styles.profile_signout_title}
                >
                  Sign Out
                </div>
                <div className={styles.profile_callout_content}>
                  <div>
                    <Persona
                      {...currentUser}
                      text={currentUser.text}
                      secondaryText={currentUser.secondaryText}
                      size={PersonaSize.size72}
                      styles={mainPersonaStyles}
                    >

                      <div className={styles.profile_callout_content_account_settings} onClick={() => setIsModalOpen(true)}>

                        Account settings
                      </div>

                    </Persona>
                  </div>

                </div>
              </div>
            </Callout>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
