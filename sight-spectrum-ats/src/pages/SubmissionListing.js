import React from "react";
import styles from "./ManageEmployee.module.css"
import { PrimaryButton, SearchBox, initializeIcons, FontIcon, mergeStyles, mergeStyleSets, Dropdown } from '@fluentui/react';
import AddSubmissionModal from "./AddSubmissionModal";
import { useState, useEffect } from "react";
import { DefaultButton, Callout, DirectionalHint } from '@fluentui/react';
import { Shimmer } from '@fluentui/react';
import { useNavigate, useSearchParams } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosPrivateCall } from "../constants";
import { DeletePopup } from "../components/DeletePopup";
import Nomatchimg from "../assets/no.png"
import { ClientTrackerPopup } from "../components/ClientTrackerPopup";
import { Spinner, SpinnerSize } from "@fluentui/react";

const addIcon = { iconName: 'Add' };
const searchIcon = { iconName: 'Search' };


const iconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
  margin: '0 10px',
  color: '#999DA0',
  cursor: 'pointer',
  userSelect: 'none',
});

const iconClass1 = mergeStyles({
  fontSize: 12,
  height: 12,
  width: 12,
  margin: '0 ',
  color: '#999DA0',
  cursor: 'pointer'
});

const iconClassToast = mergeStyles({
  fontSize: 24,
  height: 24,
  width: 24,
  color: '#107C10',
});

const searchFieldStyles = mergeStyleSets({
  root: { width: '185px', },
});

const calloutBtnStyles = {
  root: {
    border: 'none',
    padding: '0px 10px',
    textAlign: 'left',
    height: '20px'
  }
}

const CalloutNameStyles = {
  calloutMain: {
    background: '#EDF2F6',
    padding: '2',
  },
}



let items = Array(4).fill(null);


function SubmissionListing(props) {
  const [showPopup, setShowPopup] = useState(false)
  const [updateId, setUpdateId] = useState('')
  const [deleteId, setDeleteID] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitSuccess, setSubmitSuccess] = useState(false);
  const [candidateList, setCandidateList] = useState('');
  const { showAddCandidate } = props;
  const [isSubmitDel, setSubmitDel] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [rowId, setRowId] = useState('');
  const [hoverCallout, setHoverCallout] = useState('');
  const [updateCallout, setUpdateCallout] = useState(false);
  const [fetchOptions, setFetchOptions] = useState({ skip: 0, limit: 15, sort_field: 'createdAt', sort_type: -1 });
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isClientTrackerOpen, setIsClientTrackerOpen] = useState(false)
  const [candidatData, setCandidatData] = useState([])
  const [clientShowPopup, setClientShowPopup] = useState(false)


  const navigateTo = useNavigate();



  const userId = searchParams.get('user_id')

  const [sortIcon, setSortIcon] = useState(0);
  const [isUserSearching, setIsUserSearching] = useState(false)
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  initializeIcons();


  const dropdownStyles = {
    dropdown: { width: 200 },
  };

  const options = [
    { key: "SubmissionId", text: "SubmissionId", value: "SubmissionId" },
    { key: "candidate.email", text: "Candidate Email", value: "candidate.email" },
    { key: "demand.DemandId", text: "Demand ID", value: "demand.DemandId" },
    { key: "candidate.CandidateId", text: "Candidate ID", value: "candidate.CandidateId" },
    { key: "candidate.skillset", text: "Skill", value: "candidate.skillset" },
  ];

  let demand_id = searchParams.get('demand_id')

  const columns = [
    {
      columnKey: 'DemandID',
      label: 'Demand ID'
    }, {
      columnKey: 'Recruiter',
      label: 'Recruiter',
    }, {
      columnKey: 'SubmissionID',
      label: 'Submission ID',

    }, {
      columnKey: 'SubmissionDate',
      label: 'Submission Date',
      icon: `${sortIcon ? fetchOptions.sort_type === 1 ? 'SortUp' : 'SortDown' : 'Sort'}`
    }, {
      columnKey: 'CandidateID',
      label: 'Candidate ID'
    }, {
      columnKey: 'CandidateName',
      label: 'Candidate Name'
    }, {
      columnKey: 'Mobile',
      label: 'Mobile'
    }, {
      columnKey: 'email',
      label: 'Email ID'
    }, {
      columnKey: 'TotalExperience',
      label: 'Total Experience',
    }, {
      columnKey: 'Primary Skill',
      label: 'Primary Skill '
    },
    // {
    //   columnKey: 'PrimarySkillExperience',
    //   label: 'Primary Skill Experience',
    // },
    {
      columnKey: 'SecondarySkill',
      label: 'Secondary Skill '
    },
    // {
    //   columnKey: 'SecondarySkillExperience',
    //   label: 'Secondary Skill Experience',
    // },
    // {
    //   columnKey: 'OtherSkills',
    //   label: 'Other Skills '
    // },{
    //   columnKey: 'CurrentCompany',
    //   label: 'Current Company',
    // },{
    //   columnKey: 'CurrentMOH',
    //   label: 'Current MOH',
    // },{
    //   columnKey: 'NoticePeriod',
    //   label: 'Notice Period',
    // },{
    //   columnKey: 'CurrentCtc',
    //   label: 'Current CTC',
    // },{
    //   columnKey: 'ExpectedCtc',
    //   label: 'Expected CTC',
    // },{
    //   columnKey: 'CurrentLocation',
    //   label: 'Current Location',
    // },{
    //   columnKey: 'PreferedLocation',
    //   label: 'Preferred Location',
    // },
    {
      columnKey: 'Resume',
      label: 'Resume',
    },
    {
      columnKey: 'More Options',
      label: ' '
    },
  ];

  useEffect(() => {
    getCandidateData();
    setHasMore(true);
    setFetchOptions({ ...fetchOptions, skip: 0, limit: 15 });
  }, [isModalOpen, fetchOptions.sort_field, fetchOptions.sort_type, isSubmitSuccess]);


  const getCandidateData = () => {
    setIsDataLoaded(false);

    if (userId) {
      axiosPrivateCall.get(`/api/v1/aggregate/listUserLevelSubmissions?user_id=${userId}`).then(res => {
        console.log(res.data);
        setCandidateList(res.data);
        setIsDataLoaded(true)
      }).catch(e => {
        console.log(e)
      });


    }

    else if (demand_id) {

      axiosPrivateCall.get(`/api/v1/submission/getSubmissionByDemand?demand_id=${demand_id}`).then(res => {
        console.log(res.data);
        setCandidateList(res.data);
        setIsDataLoaded(true)
      }).catch(e => {
        console.log(e)
      });


    }

    else {

      axiosPrivateCall.get(`/api/v1/submission/listSubmissions?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`).then(res => {
        console.log(res.data);
        setCandidateList(res.data);
        setIsDataLoaded(true)
      }).catch(e => {
        console.log(e)
      });

    }
  };
  const [SearchData, setSearchData] = useState('')
  const [SplitedData, setSplitedData] = useState('')

  const fetchMoreData = () => {


    if (isUserSearching) {
      const moreCandidates = SearchData.slice(SplitedData, SplitedData + 15)
      setSplitedData(SplitedData + 15)
      setCandidateList([...candidateList, ...moreCandidates])
      if (SplitedData >= SearchData.length) {
        setHasMore(false)
      }
    }

    else {

      axiosPrivateCall.get(`/api/v1/submission/listSubmissions?skip=${fetchOptions.skip + fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then(res => {
          const moreCandidates = res.data;
          console.log(moreCandidates.length);
          setCandidateList([...candidateList, ...moreCandidates]);
          if (moreCandidates.length < 15 || moreCandidates.length === 0) {
            setHasMore(false)
          }

          setFetchOptions((prevState) => {

            return {
              ...prevState,
              skip: fetchOptions.skip + fetchOptions.limit,
            };

          })
        }).catch(e => {
          console.log(e)
        });

    }
    console.log('getting more data');
  };


  const clickSortHandler = (key) => {

    if (!isDataLoaded) return;

    if (key === 'SubmissionDate') {
      setSortIcon(fetchOptions.sort_type);
      setFetchOptions(
        {
          ...fetchOptions,
          sort_type: fetchOptions.sort_type === -1 ? 1 : -1,
        }
      );
    };

  };


  const ISOdateToCustomDate = (value) => {
    const dateFormat = new Date(value);
    let year = dateFormat.getFullYear();
    let month = dateFormat.getMonth() + 1;
    let date = dateFormat.getDate();

    if (date < 10) {
      date = '0' + date;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return date + '/' + month + '/' + year;
  };


  const addEllipsisToName = (name) => {
    // console.log(name, name.length);

    if (name.length > 14) {
      let new_name = name.substring(0, 12).padEnd(15, '.')

      return new_name
    }
    else return name;
  };


  const deleteCandidate = (id) => {

    setUpdateCallout(!updateCallout)
    setShowPopup(!showPopup);
    const deleteObj = { _id: id.SubmissionId }
    setDeleteID(deleteObj)
    setUpdateId({ _id: id._id })

  }

  function skillLister(Arr) {
    let skills = '';

    if (Arr.length > 2) {
      Arr?.map((data, index) => {
        if (index === 2) {
          skills = data.skill;
        }
      })

      return skills;

    } else {
      return "-";
    }
  }

  function calcTotalExp(Arr) {
    let total = { years: 0, months: 0, }

    Arr?.map((detail, index) => {
      let startYear = new Date(detail.start_date).getFullYear();
      let endYear = new Date(detail.end_date).getFullYear();
      let startMonth = new Date(detail.start_date).getMonth() + 1;
      let endMonth = new Date(detail.end_date).getMonth() + 1;

      total.years = total.years + (endYear - startYear);
      total.months = total.months + (endMonth - startMonth);
    })

    return total;
  };

  function getCurrentCompany(Arr) {
    let currCompany = { name: '', ctc: '' };

    Arr?.map((data) => {
      if (data.is_current === 'yes') {
        currCompany.name = data.company_name;
        currCompany.ctc = data.ctc;
      }
    });

    return currCompany;

  }


  const [DropdownSearch, setDropdownSearch] = useState('')
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleDropdownChange = (e, item) => {
    setDropdownSearch(item.key)
    setSearchTerm('')
  }


  const handleSearchInputChange = (event) => {
    if (!event || !event.target) {
      setSearchTerm('');
      return;
    }
    const { value } = event.target;

    switch (DropdownSearch) {
      case 'SubmissionId':
        if (value && !/^[0-9a-zA-Z]+$/.test(value)) {
          return;
        }
        break;
      case 'demand.DemandId':
        if (value && !/^[0-9a-zA-Z]+$/.test(value)) {
          return;
        }
        break;
      case 'candidate.CandidateId':
        if (value && !/^[0-9a-zA-Z]+$/.test(value)) {
          return;
        }
        break;
      case 'candidate.email':
        if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return;
        }
        break;
      default:
        break;
    }

    setSearchTerm(value);
  };

  const searchCandidateList = (e) => {
    const searchValue = e;

    if (searchValue === '') {
      getCandidateData();
      return;
    }

    setIsDataLoaded(false);
    setIsUserSearching(true);

    axiosPrivateCall
      .get(`/api/v1/submission/searchSubmission?field_name=${DropdownSearch}&field_value=${searchValue}`)
      .then((res) => {
        console.log(res.data);
        setSearchData(res.data)
        setSplitedData(15)
        setHasMore(true)
        setCandidateList(res.data.slice(0, 15));
        setIsDataLoaded(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };


  const clearSearchBox = () => {
    setIsUserSearching(false)

    setFetchOptions(prevData => {
      return {
        ...prevData,
        search_field: ''
      }
    })
    getCandidateData()
    setHasMore(true)
  }

  const download = () => {
    setLoading(true);
    setTimeout(() => {
      axiosPrivateCall
        .get(`/api/v1/submission/downloadSubmissions?&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`, {
          responseType: 'blob',
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${Date.now()}.xlsx`);
          document.body.appendChild(link);
          link.click();
          setCompleted(true);
          setTimeout(() => {
            setCompleted(false);
          }, 4000);
          setLoading(false);
        })
        .catch(e => {
          console.log(e);
          setLoading(false);
        });
    }, 1000);
  };


  const handleUpdate = (showpop) => {
    const deleteObj = updateId
    if (!showpop) {
      setShowPopup(!showPopup)
      setSubmitDel(!isSubmitDel)
      axiosPrivateCall.post('/api/v1/submission/deleteSubmission', deleteObj).then(res => {
        const candidateArrList = candidateList;
        setCandidateList(candidateArrList.filter(candidate => candidate?._id !== deleteObj._id))
      }).catch(e => {
        console.log(e);
        setUpdateCallout(false);
      });

    }
  }
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <DeletePopup showPopup={showPopup}
          setShowPopup={setShowPopup}
          handleUpdate={handleUpdate}
          deleteId={deleteId}
          updateCallout={updateCallout}
          setUpdateCallout={setUpdateCallout}
        />
        {clientShowPopup && <ClientTrackerPopup
          showPopup={clientShowPopup}
          setShowPopup={setClientShowPopup}
          candidatData={candidatData}
          setIsModalOpen={ClientTrackerPopup}
        //  resetState={resetState}
        />
        }
        <div className={styles.nav_container}>
          <div className={styles.title}>Submission Listing</div>

          {isSubmitDel && (<div className={styles.toast}>
            <div className={styles.toast_title}>
              <FontIcon iconName="StatusCircleCheckmark" className={iconClassToast} />
              <div>Candidate Deleted!</div>
            </div>

            <FontIcon iconName="StatusCircleErrorX" className={iconClass} onClick={() => setSubmitDel(false)} />
          </div>)
          }

          <div className={styles.nav_items}>
            <Dropdown placeholder='Select Search Field' onChange={handleDropdownChange} options={options} styles={dropdownStyles} />
            <SearchBox onChange={handleSearchInputChange} value={searchTerm} onSearch={(e) => searchCandidateList(e)} disabled={DropdownSearch == "" ? true : false} onClear={clearSearchBox} placeholder=" " iconProps={searchIcon} className={styles.search}
              showIcon />
            <FontIcon iconName="Breadcrumb" className={iconClass} />
            {/* <PrimaryButton text="Add Submission" iconProps={addIcon} 
                        disabled/> */}
            {loading ? (<Spinner size={SpinnerSize.medium} className={iconClass} />) :
              completed ? (<FontIcon iconName="CheckMark" className={iconClass} />) :
                (<FontIcon iconName="Download" onClick={download} className={iconClass} />)}
          </div>
        </div>

        <div id="scrollableDiv" className={styles.table_container}>
          <InfiniteScroll style={{ overflow: 'visible', height: '100%' }} dataLength={candidateList.length} loader={isDataLoaded && candidateList.length >= 15 && <h4>Loading...</h4>}
            hasMore={hasMore} next={fetchMoreData} scrollableTarget="scrollableDiv">

            <table>
              <thead className={styles.table_header}>
                <tr className={styles.table_row}>
                  {columns?.map((column) =>
                    <th onClick={() => clickSortHandler(column.columnKey)}
                      className={styles.table_headerContents}
                      key={column.columnKey}>

                      <div className={styles.table_heading}>
                        <div>{column.label}</div>
                        {column?.icon ? <FontIcon iconName={column.icon} className={iconClass1} /> : null}
                      </div>
                    </th>)
                  }
                </tr>
              </thead>


              <tbody>
                {isDataLoaded && candidateList.length === 0 ? (
                  <tr>
                    <td className={styles.table_dataContents1} colSpan="13" style={{ textAlign: "center" }}>
                      <img src={Nomatchimg} alt="image" width={"180px"} height={"200px"} />
                    </td>
                  </tr>
                ) : (
                  <>
                    {isDataLoaded && candidateList.length === 0 ? (
                      <tr>
                        <td className={styles.table_dataContents1} colSpan="13" style={{ textAlign: "center" }}>
                          <img src={Nomatchimg} alt="image" width={"190px"} height={"200px"} />
                        </td>
                      </tr>
                    ) : (
                      <>
                        {isDataLoaded && candidateList?.map((data, candidate_index) => (
                          <tr className={styles.table_row} >
                            <td onClick={() => navigateTo(`/demand/editdemand?demand_id=${data?.demand?._id}`)} className={styles.table_dataContents}>{data?.demand?.DemandId}</td>

                            <td className={styles.table_dataContents}
                              onMouseEnter={() => setHoverCallout(data?.submitted_by)}
                              onMouseLeave={() => setHoverCallout('')}
                              id={`${data?.submitted_by?.first_name}_${data?._id}`.replaceAll(" ", "_")}>

                              {addEllipsisToName(`${data?.submitted_by?.first_name} ${data?.submitted_by?.last_name}`)}

                              {((data?.submitted_by?.first_name) + (data?.submitted_by?.last_name)).length >= 14 && hoverCallout === data?.submitted_by && <Callout alignTargetEdge={true}
                                isBeakVisible={false} styles={CalloutNameStyles}
                                directionalHint={DirectionalHint.bottomLeftEdge} target={`#${data?.submitted_by?.first_name}_${data?._id}`.replaceAll(" ", "_")}>
                                {`${data?.submitted_by?.first_name} ${data?.submitted_by?.last_name}`}
                              </Callout>
                              }
                            </td>

                            <td onClick={() => navigateTo(`/submission/viewsubmission?submission_id=${data?._id}`)} className={styles.table_dataContents}>{data.SubmissionId}</td>
                            <td className={styles.table_dataContents} style={{ textAlign: 'center' }}>{ISOdateToCustomDate(data.createdAt)}</td>
                            <td onClick={() => navigateTo(`/candidatelibrary/editcandidate?candidate_id=${data.candidate?._id}`)} className={styles.table_dataContents}>{data.candidate?.CandidateId}</td>
                            <td className={styles.table_dataContents}
                              onMouseEnter={() => setHoverCallout(data.candidate?.first_name)}
                              onMouseLeave={() => setHoverCallout('')}
                              id={`${data.candidate?.first_name}_${data.candidate?._id}`.replaceAll(" ", "_")}>

                              {addEllipsisToName(`${data.candidate?.first_name} ${data.candidate?.last_name}`)}

                              {(data.candidate?.first_name + data.candidate?.last_name).length >= 14 && hoverCallout === data.candidate?.first_name && <Callout alignTargetEdge={true}
                                isBeakVisible={false} styles={CalloutNameStyles}
                                directionalHint={DirectionalHint.bottomLeftEdge} target={`#${data.candidate?.first_name}_${data.candidate?._id}`.replaceAll(" ", "_")}>
                                {`${data.candidate?.first_name} ${data.candidate?.last_name}`}
                              </Callout>
                              }

                            </td>
                            <td className={styles.table_dataContents}>{data.candidate?.mobile_number}</td>
                            <td className={styles.table_dataContents}>{data.candidate?.email}</td>
                            <td className={styles.table_dataContents}>{calcTotalExp(data.candidate?.employment_details).years} Years {calcTotalExp(data.candidate?.employment_details).months} Months</td>
                            <td className={styles.table_dataContents}
                              onMouseEnter={() => setHoverCallout(data._id)}
                              onMouseLeave={() => setHoverCallout("")}
                              id={`primary_skill_${data._id}`}>

                              {addEllipsisToName(`${data.candidate?.skillset[0]?.skill ? (data.candidate?.skillset[0]?.skill) : '-'}`)}

                              {data.candidate?.skillset[0]?.skill && data.candidate?.skillset[0]?.skill.length >= 14 && hoverCallout === data._id && (
                                <Callout alignTargetEdge={true} isBeakVisible={false} styles={CalloutNameStyles} directionalHint={DirectionalHint.bottomLeftEdge}
                                  target={`#primary_skill_${data._id}`}
                                >
                                  {data.candidate?.skillset[0]?.skill ? (data.candidate?.skillset[0]?.skill) : '-'}
                                </Callout>
                              )}
                            </td>
                            {/* <td className={styles.table_dataContents}>{data.candidate?.skillset[0]?.exp ? (`${Math.floor(data.candidate?.skillset[0]?.exp / 12)} Years ${data.candidate?.skillset[0]?.exp % 12} Months`) : '-'}</td> */}
                            <td className={styles.table_dataContents}
                              onMouseEnter={() => setHoverCallout(data.SubmissionId)}
                              onMouseLeave={() => setHoverCallout("")}
                              id={`secondary_skill_${data.SubmissionId}`}>

                              {addEllipsisToName(`${data.candidate?.skillset[1]?.skill ? (data.candidate?.skillset[1]?.skill) : '-'}`)}

                              {(data.candidate?.skillset[1]?.skill ? (data.candidate?.skillset[1]?.skill) : '-').length >= 14 && hoverCallout === data.SubmissionId && <Callout alignTargetEdge={true}
                                isBeakVisible={false} styles={CalloutNameStyles}
                                directionalHint={DirectionalHint.bottomLeftEdge} target={`#secondary_skill_${data.SubmissionId}`}>
                                {data.candidate?.skillset[1]?.skill ? (data.candidate?.skillset[1]?.skill) : '-'}
                              </Callout>
                              }
                            </td>
                            {/* <td className={styles.table_dataContents}>{data.candidate?.skillset[1]?.exp ? (`${Math.floor(data.candidate?.skillset[1]?.exp / 12)} Years ${data.candidate?.skillset[1]?.exp % 12} Months`) : '-'}</td> */}
                            {/* <td className={styles.table_dataContents}
                                          onMouseEnter={() => setHoverCallout((data.SubmissionId)+(data._id))}
                                          onMouseLeave={() => setHoverCallout("")}
                                          id={`other_skill_${(data.SubmissionId)+(data._id)}`}>

                                          {addEllipsisToName(`${skillLister(data.candidate?.skillset)}`)}

                                          {skillLister(data.candidate?.skillset).length >= 14 && hoverCallout === (data.SubmissionId)+(data._id) && <Callout alignTargetEdge={true}
                                            isBeakVisible={false} styles={CalloutNameStyles} 
                                            directionalHint={DirectionalHint.bottomLeftEdge} target={`#other_skill_${(data.SubmissionId)+(data._id)}`}>
                                            {skillLister(data.candidate?.skillset)}
                                            </Callout>
                                        }
                                  </td> */}
                            {/* <td className={styles.table_dataContents}
                                    onMouseEnter={()=>setHoverCallout(data.candidate._id)} 
                                    onMouseLeave={()=>setHoverCallout('')}  
                                    id={`current_company_${data.candidate._id}`}>

                                    {addEllipsisToName(`${getCurrentCompany(data.candidate?.employment_details).name}`)}

                                    {(getCurrentCompany(data.candidate?.employment_details).name).length >= 14  && hoverCallout===data.candidate._id && <Callout alignTargetEdge={true} 
                                            isBeakVisible={false} styles={CalloutNameStyles} 
                                            directionalHint={DirectionalHint.bottomLeftEdge} target={`#current_company_${data.candidate._id}`}>
                                           {getCurrentCompany(data.candidate?.employment_details).name}
                                            </Callout>
                                    }
                                  </td> */}
                            {/* <td className={styles.table_dataContents}>{data.candidate?.prefered_mode_of_hire}</td>
                                  <td className={styles.table_dataContents}>{data.candidate?.notice_period}</td>
                                  <td className={styles.table_dataContents}>{getCurrentCompany(data.candidate?.employment_details).ctc}</td> */}
                            {/* <td className={styles.table_dataContents}>{data.candidate?.expected_ctc}</td>
                                  <td className={styles.table_dataContents}>{data.candidate?.current_location}</td>
                                  <td className={styles.table_dataContents}>{data.candidate?.prefered_location || '-'}</td> */}
                            <td className={styles.table_dataContents}><a href={data.candidate?.resume_url} target="_blank">Link</a></td>
                            <td className={styles.table_dataContents}>
                              <div className={styles.moreOptions}
                                id={`SL${data._id}`}
                                onClick={() => { setRowId(data?._id); setUpdateCallout(true) }}>
                                <FontIcon iconName='MoreVertical' className={iconClass1} />

                                {rowId === data?._id &&
                                  updateCallout && <Callout gapSpace={0} target={`#SL${data._id}`} onDismiss={() => setRowId('')}
                                    isBeakVisible={false} directionalHint={DirectionalHint.bottomCenter}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <DefaultButton text="View / Edit" onClick={() => navigateTo(`/submission/viewsubmission?submission_id=${data?._id}`)} styles={calloutBtnStyles} />
                                      <DefaultButton onClick={() => deleteCandidate(data)} text="Delete" styles={calloutBtnStyles} />
                                      <DefaultButton onClick={() => navigateTo(`/submission/tracksubmission?submission_id=${data?._id}`)} text="Track Submission" styles={calloutBtnStyles} />
                                      <DefaultButton
                                        onClick={() => {
                                          setClientShowPopup(!clientShowPopup);
                                          setCandidatData(data?._id);
                                        }}
                                        text="Client tracker"
                                        styles={calloutBtnStyles}
                                      />


                                    </div>
                                  </Callout>
                                }
                              </div>
                            </td>
                          </tr>))}
                      </>
                    )}


                    {!isDataLoaded && items?.map(candidate => (
                      <tr className={styles.table_row} >
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}>
                          <div className={styles.moreOptions} >
                            <FontIcon iconName='MoreVertical' className={iconClass1} />
                          </div>
                        </td>
                      </tr>))
                    }
                  </>
                )}
              </tbody>
            </table>

          </InfiniteScroll>
        </div>
      </div>
    </div>
  );

};

export default SubmissionListing;





