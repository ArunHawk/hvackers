import { Dropdown, Modal, PrimaryButton, mergeStyleSets } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import React, { useEffect, useState } from 'react';
import { axiosPrivateCall } from "../constants";
import styles from './ClientTrackerPopup.module.css';


const dropDownStylesActive = (props, currentHover, error, value) => {
  return {
    dropdown: {
      width: "350px",
      minWidth: "160px",
      minHeight: "23px",

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

const searchFieldStyles = mergeStyleSets({
  root: { minWidth: "140px" },
});


export function ClientTrackerPopup(props) {

  let Id = props?.candidatData
  let resetState = props?.resetState
  const {
    showPopup,
    setShowPopup,
    isModalOpen,
    setIsModalOpen,
    candidatData,
  } = props;

  const [data, setData] = useState([])
  const [candidateData, setCandidateData] = useState([])
  const [selectedValue, setSelectedValue] = useState("")

  useEffect(() => {
    axiosPrivateCall
      .get(
        "/api/v1/client/getClientName").then(res => {
          setData(res?.data?.companyNames)
        }).catch(err => {
        })
    axiosPrivateCall(`/api/v1/submission/getSubmissionDetails?submission_id=${Id}`).then(res => {
      setCandidateData(res.data);
    }).catch(e => {
      console.log(e);
    })
  }, [])

  const transformedData = data?.map((value, index) => ({
    key: value,
    text: value,
  }));

  const dropDownHandler = (e, item, name) => {
    const updatedData = data?.map((value) => value);
    updatedData[name] = item.key;
    setData(updatedData);
    setSelectedValue(item.key)
  };

  const downloadData = () => {
    setTimeout(() => {
      console.log(selectedValue, "hhh");
      axiosPrivateCall
        .get(`/api/v1/client/downloadClientTracker?company_name=${selectedValue}&submission_id=${Id}`, {
          responseType: 'blob',
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${Date.now()}.xlsx`);
          document.body.appendChild(link);
          link.click();
        })
        .catch(e => {
          console.log(e);
        });
    }, 1000);
  };


  return (
    <>
      <Modal isOpen={showPopup} containerClassName={styles.mainContainer}>

        <div className={styles.closePopup}>
          <div className={styles.topContainer}>

            <div className={styles.title}>Client Tracker Template</div>

            <div className={styles.closeButton} onClick={() => {
              setShowPopup(!showPopup);
            }}><Icon iconName='ChromeClose' /></div>

          </div>

          <div className={styles.message}>Choose your required company and download the Submission details accordingly!</div>

          <div className={styles.bottomContainer}>
            <div className={styles.buttonContainer}>


              <Dropdown
                onChange={(e, item) => {
                  dropDownHandler(e, item, "status");
                }}
                placeholder="Select Company name"
                notifyOnReselect
                styles={(props) =>
                  dropDownStylesActive(
                    props,
                    'client',
                    '',
                    "status"
                  )
                }
                options={transformedData}
              />

              <PrimaryButton
                disabled={!selectedValue}
                styles={searchFieldStyles}
                iconProps={{ iconName: "Download" }}
                text="Download"
                onClick={() => {
                  setShowPopup(!showPopup);
                  downloadData();
                  if (props.resetState) {
                    props.resetState();
                  }
                }}
              />
            </div>
          </div>

        </div>
      </Modal>
    </>
  )
}