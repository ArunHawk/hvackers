import React from "react";
import styles from "./ManageEmployee.module.css"
import { PrimaryButton, SearchBox, initializeIcons, FontIcon, mergeStyles, mergeStyleSets, Dropdown, Modal } from '@fluentui/react';
import AddCandidateModal from "./AddCandidateModal";
import { useState, useEffect } from "react";
import { DefaultButton, Callout, DirectionalHint } from '@fluentui/react';
import { Shimmer } from '@fluentui/react';
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosPrivateCall } from "../constants";
import { DeletePopup } from "../components/DeletePopup";
import Nomatchimg from "../assets/no.png"
import { Spinner, SpinnerSize } from "@fluentui/react";
import { useLocation } from 'react-router-dom';

import { MatchProfilePopup } from "../components/MatchProfilePopup";
import SearchPopup from "../components/SeachComponent/SearchPopup";

import { useSearchResults } from '../components/SeachComponent/SearchResultsContext';

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

const dropdownStyles = {
  dropdown: { width: 200 },
};

const options = [
  { key: 'CandidateId', text: 'Candidate Id' },
  { key: 'email', text: 'Email' },
  { key: 'mobile_number', text: 'Mobile' },
  { key: 'skillset', text: 'Skill' },
];

let items = Array(4).fill(null);


function CandidateListing(props) {

  const [showProfilePopup, setShowProfilePopup] = useState(true);
  const location = useLocation();
  const [match, setMatch] = useState(location.state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false)
  const [updateId, setUpdateId] = useState('')
  const [deleteId, setDeleteID] = useState('')
  const [isSubmitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitDel, setSubmitDel] = useState(false);
  const [primaryLs, setPrimaryLs] = useState('');
  const [candidateList, setCandidateList] = useState('');
  const { showAddCandidate } = props;
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [rowId, setRowId] = useState('');
  const [hoverCallout, setHoverCallout] = useState('');
  const [updateCallout, setUpdateCallout] = useState(false);
  const [fetchOptions, setFetchOptions] = useState({ skip: 0, limit: 15, sort_field: 'updatedAt', sort_type: -1 });
  const [hasMore, setHasMore] = useState(true);
  const [sortIcon, setSortIcon] = useState(0);
  const [isUserSearching, setIsUserSearching] = useState(false)
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [matchProfile, setMatchProfile] = useState(false)
  const [matchAPI, setMatchAPI] = useState([]);
  const [isSearchVal, setIsSearchVal] = useState([]);
  const [booleanCheck, setBooleanCheck] = useState(false);
  // const [searchResult, setSearchResult] = useState([]);
  // console.log(searchResults, "bolena")
  const [gaintValue, setGaintValue] = useState([])
  const navigateTo = useNavigate();
  initializeIcons();

  const { searchResults, setSearchResults } = useSearchResults();

  const columns = [
    {
      columnKey: 'CandidateID',
      label: 'Candidate ID'
    }, {
      columnKey: 'CandidateName',
      label: 'Candidate Name'
    }, {
      columnKey: 'DateofSourcing',
      label: 'Date of Sourcing',
      icon: `${sortIcon ? fetchOptions.sort_type === 1 ? 'SortUp' : 'SortDown' : 'Sort'}`
    }, {
      columnKey: 'Mobile',
      label: 'Mobile'
    }, {
      columnKey: 'email',
      label: 'Email ID'
    }, {
      columnKey: 'Recruiter',
      label: 'Recruiter',
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
    // },
    {
      columnKey: 'TotalExperience',
      label: 'Total Experience',
    },
    // {
    //   columnKey: 'NoticePeriod',
    //   label: 'Notice Period',
    // },{
    //   columnKey: 'CurrentCompany',
    //   label: 'Current Company',
    // },{
    //   columnKey: 'CurrentLocation',
    //   label: 'Current Location',
    // },{
    //   columnKey: 'CurrentCtc',
    //   label: 'Current CTC',
    // },{
    //   columnKey: 'ExpectedCtc',
    //   label: 'Expected CTC',
    // },{
    //   columnKey: 'PreferedLocation',
    //   label: 'Preferred Location',
    // },
    {
      columnKey: 'Resume',
      label: 'Resume',
    },
    {
      columnKey: 'Status',
      label: 'Status',
    },
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
    setHasMore(true);


    setTimeout(() => {
      getCandidateData();
      setIsSearchVal([])
    }, 1000)
    setFetchOptions({ ...fetchOptions, skip: 0, limit: 15 });
  }, [isModalOpen, fetchOptions.sort_field, fetchOptions.sort_type]);

  const candidateDataToDisplay = searchResults.length > 0 ? searchResults : candidateList;


  const updateCandidateData = (data, vals, starValues, searchContent) => {
    setTimeout(() => {
      console.log(vals, "qqqqqq")
      setCandidateList(data);

      setSearchResults(data);

      setIsSearchVal(vals, "llll")
      setBooleanCheck(vals.booleansearch)
      setGaintValue(vals.starvalues)
    }, 2000);
  };

  console.log(isSearchVal?.search?.length > 0, "111")

  const getCandidateData = () => {
    setIsDataLoaded(false);
    if (match) {
      axiosPrivateCall
        .get(`api/v1/demand/matchCandidate?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then((res) => {
          setMatchAPI(res.data);
          setIsDataLoaded(true)
        }).catch(err => console.log('falied'))
    } else {
      axiosPrivateCall.get(`/api/v1/candidate/listCandidates?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`).then(res => {
        setCandidateList(res.data);
        setPrimaryLs(res.data);
        setIsDataLoaded(true)
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 2000);
      }).catch(e => {
        console.log(e)
      });
    };
  }

  const [isModels, setIsModels] = useState(false)
  const handleModel = () => {
    setIsModels(true)
  }

  const handleModelClose = () => {
    setIsModels(false)
  }


  const [SearchData, setSearchData] = useState('')
  const [SplitedData, setSplitedData] = useState('')
  const fetchMoreData = () => {

    if (isUserSearching) {
      const moreCandidates = SearchData.slice(SplitedData, SplitedData + 15)
      setSplitedData(SplitedData + 15)
      setCandidateList([...candidateList, ...moreCandidates]);
      if (SplitedData >= SearchData.length) {
        setHasMore(false)
      }
    } else if (match) {
      axiosPrivateCall.get(`api/v1/demand/matchCandidate?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then(res => {
          const moreDemands = res.data;
          console.log(moreDemands.length)
          setMatchAPI([...matchAPI, ...moreDemands])
          if (moreDemands.length < 15 || moreDemands.length === 0) {
            setHasMore(false)
          }
          setFetchOptions((prevState) => {
            return {
              ...prevState,
              skip: fetchOptions.skip + fetchOptions.limit,
            }
          })
        }).catch(e => {
          console.log(e)
        })
    } else {
      if (isSearchVal?.search?.length > 0) {
        console.log(isSearchVal, "isSearchVal")
        const adsValue = isSearchVal

        axiosPrivateCall.post(`/api/v1/adbSearch/booleanList`, { skip: fetchOptions.skip + fetchOptions.limit, limit: fetchOptions.limit, search: isSearchVal.search, booleansearch: booleanCheck, starvalues: gaintValue, unavi: isSearchVal.unavi, itSkills: isSearchVal.itSkills, current_Location: isSearchVal.current_Location, notice_period: isSearchVal.notice_period, company_boolean: isSearchVal.company_boolean, company_names: isSearchVal.company_name, company_search_in: isSearchVal.company_search_in, exclude_boolean: isSearchVal.exclude_boolean, exclude_company: isSearchVal.exclude_company, exclude_search_in: isSearchVal.exclude_search_in, designation_boolean: isSearchVal.designation_boolean, designation_names: isSearchVal.designation_names, designation_search_in: isSearchVal.designation_search_in, gender: isSearchVal.gender, employment_type: isSearchVal.employment_type, workmode: isSearchVal.workmode, annual_salary: isSearchVal.annual_salary, entireResume: isSearchVal.entireResume, conditions: isSearchVal.conditions, work_permit: isSearchVal.work_permit, departmentRole: isSearchVal.departmentRole, industry: isSearchVal.industry, minExp: isSearchVal.minExp, maxExp: isSearchVal.maxExp }).then(res => {
          // http://localhost:4001/api/v1/adbSearch/booleanList    
          const moreCandidates = res.data;
          console.log(moreCandidates.length);
          console.log(booleanCheck)
          console.log(gaintValue)
          setCandidateList([...candidateList, ...moreCandidates]);
          setSearchResults([...candidateList, ...moreCandidates])
          setPrimaryLs([...candidateList, ...moreCandidates]);
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
      } else {

        axiosPrivateCall.get(`/api/v1/candidate/listCandidates?skip=${fetchOptions.skip + fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
          .then(res => {
            const moreCandidates = res.data;
            console.log(moreCandidates.length);
            setCandidateList([...candidateList, ...moreCandidates]);
            setPrimaryLs([...candidateList, ...moreCandidates]);
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

  }
  const clickSortHandler = (key) => {

    if (!isDataLoaded) return;

    if (key === 'DateofSourcing') {
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
    const deleteObj = { _id: id.CandidateId }
    setDeleteID(deleteObj)
    setUpdateId({ _id: id._id })
  }

  function skillLister(Arr) {
    let skills = '';

    if (Arr.length > 2) {
      Arr.map((data, index) => {
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

    Arr.map((detail, index) => {

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

    Arr.map((data) => {
      if (data.is_current === 'yes' || data.is_current === true) {
        currCompany.name = data.company_name;
        currCompany.ctc = data.ctc;
      }
    });

    return currCompany;

  }
  const [DropdownSearch, setDropdownSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
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
      case 'CandidateId':
        if (value && !/^[0-9a-zA-Z]+$/.test(value)) {
          return;
        }
        break;
      case 'email':
        if (value && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{4,}))$/.test(value)) {
          return;
        }
        break;
      case 'mobile_number':
        if (value && !/^[0-9]+$/.test(value)) {
          return;
        }
        break;
      default:
        break;
    }

    setSearchTerm(value);
  };

  const searchCandidateList = (e) => {

    const searchValue = e

    if (searchValue === '') {
      getCandidateData();
      return
    }



    setIsDataLoaded(false)
    setIsUserSearching(true)

    setFetchOptions(prevData => {
      return {
        ...prevData,
        search_field: searchValue
      }
    })
    axiosPrivateCall.get(`/api/v1/candidate/searchCandidates?field_name=${DropdownSearch}&field_value=${searchValue}`)
      .then(res => {
        setSearchData(res.data)
        setSplitedData(15)
        setCandidateList(res.data.slice(0, 15));
        setIsDataLoaded(true)
        setHasMore(true)
      }).catch(e => {
        console.log(e)
      })
  }

  const clearSearchBox = () => {
    setIsUserSearching(false)

    setFetchOptions(prevData => {
      return {
        ...prevData,
        search_field: ''
      }
    })
    setSearchTerm('');
    getCandidateData();
    setHasMore(true)
  }

  const download = () => {
    setLoading(true);
    axiosPrivateCall
      .get(`/api/v1/candidate/downloadCandidates?&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`, {
        responseType: 'blob',
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
        setCompleted(true);
        setTimeout(() => {
          setCompleted(false);
        }, 4000);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleUpdate = (showpop) => {
    const deleteObj = updateId
    if (!showpop) {
      setShowPopup(!showPopup)
      axiosPrivateCall.post('/api/v1/candidate/deleteCandidate', deleteObj).then(res => {
        setSubmitDel(!isSubmitDel)
        const candidateArrList = candidateList;
        setCandidateList(candidateArrList.filter(candidate => candidate._id !== deleteObj._id))
        setPrimaryLs(candidateArrList.filter(candidate => candidate._id !== deleteObj._id))
      }).catch(e => {
        console.log(e);
        setUpdateCallout(false);
      });

      setTimeout(() => {
        setSubmitDel(false);
      }, 2000);

      setSubmitDel(true);

    }
  }

  function openResume(resumeString) {

    // Split the resume string into an array of lines

    const lines = resumeString.split(/\r?\n/);
    const promptLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (line.startsWith("?")) {
        promptLines.push(`\n${line.replace("?", "")}`);
      } else if (line.includes(":")) {
        const [key, value] = line.split(":");
        promptLines.push(`\n- ${key.trim()}: ${value.trim()}`);
      } else if (line.length > 0) {
        promptLines.push(line);
      }
    }






    // Open the HTML content in a new tab
    var newTab = window.open();
    newTab.document.open();
    newTab.document.write(promptLines.join("\n"));
    newTab.document.close();
  }

  const rowsToRender = searchResults?.length > 0 ? searchResults : candidateList;

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
        {isModalOpen && <AddCandidateModal isModalOpen={isModalOpen}
          setMatchProfile={setMatchProfile}
          setIsModalOpen={setIsModalOpen}
          isSubmitSuccess={isSubmitSuccess}
          setSubmitSuccess={setSubmitSuccess} />
        }

        <div className={styles.nav_container}>
          <div className={styles.title}>Candidate Listing</div>

          {isSubmitSuccess && (<div className={styles.toast}>
            <div className={styles.toast_title}>
              <FontIcon iconName="StatusCircleCheckmark" className={iconClassToast} />
              <div>Candidate Added Successfully!</div>
            </div>

            <FontIcon iconName="StatusCircleErrorX" className={iconClass} onClick={() => setSubmitSuccess(false)} />
          </div>)
          }

          {isSubmitDel && (<div className={styles.toast}>
            <div className={styles.toast_title}>
              <FontIcon iconName="StatusCircleCheckmark" className={iconClassToast} />
              <div>Candidate Deleted!</div>
            </div>

            <FontIcon iconName="StatusCircleErrorX" className={iconClass} onClick={() => setSubmitDel(false)} />
          </div>)
          }
          {/* <div className={styles.search_dropdown}>
                         <Dropdown placeholder='select search field' onChange={handleDropdownChange}  options={options} styles={dropdownStyles}/>
                    </div> */}

          {matchProfile &&
            <div >
              <MatchProfilePopup showProfilePopup={showProfilePopup} setShowProfilePopup={setShowProfilePopup} state='candidate' />
            </div>
          }

          <div className={styles.nav_items}>
            {/* Advance Profile Search 25/07/2023 */}
            <PrimaryButton text="Search Profile" iconProps={searchIcon} onClick={handleModel} />
            {isModels ? <SearchPopup onDismiss={handleModelClose} candidate={updateCandidateData} /> : ""}

            {/* <Dropdown placeholder='Select Search Field' onChange={handleDropdownChange} options={options} styles={dropdownStyles} />
            <SearchBox onChange={handleSearchInputChange} value={searchTerm} onSearch={(e) => searchCandidateList(e)} onClear={clearSearchBox} disabled={DropdownSearch == "" ? true : false} placeholder=" " iconProps={searchIcon} className={styles.search}
              showIcon /> */}
            <FontIcon iconName="Breadcrumb" className={iconClass} />
            <PrimaryButton text="Add Candidate" iconProps={addIcon}
              onClick={() => { setIsModalOpen(!isModalOpen); setSubmitSuccess(false); setMatch(false) }} />
            {loading ? (<Spinner size={SpinnerSize.medium} className={iconClass} />) :
              completed ? (<FontIcon iconName="CheckMark" className={iconClass} />) :
                (<FontIcon iconName="Download" onClick={download} className={iconClass} />)}

            {/* <FontIcon iconName="Download" onClick={download} className={iconClass} /> */}
          </div>
        </div>

        <div id="scrollableDiv" className={styles.table_container}>
          <InfiniteScroll style={{ overflow: 'visible', height: '100%' }} dataLength={(!match ? candidateList.length : matchAPI.length)} loader={isDataLoaded && (!match ? candidateList.length >= 15 : matchAPI.length >= 15) && <h4>Loading...</h4>}
            hasMore={hasMore} next={fetchMoreData} scrollableTarget="scrollableDiv">

            <table>
              <thead className={styles.table_header}>
                <tr className={styles.table_row}>
                  {columns.map((column) =>
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
                {isDataLoaded && (!match ? candidateList.length === 0 : matchAPI.length === 0) ? (
                  <tr>

                    <td className={styles.table_dataContents1} colSpan="13" style={{ textAlign: "center" }}>
                      <img src={Nomatchimg} alt="image" width={"180px"} height={"200px"} />
                    </td>
                  </tr>
                ) : (
                  <>
                    {isDataLoaded && (!match ? candidateList.length === 0 : matchAPI.length === 0) ? (
                      <tr>
                        <td className={styles.table_dataContents1} colSpan="13" style={{ textAlign: "center" }}>
                          <img src={Nomatchimg} alt="image" width={"190px"} height={"200px"} />
                        </td>
                      </tr>
                    ) : (
                      <>
                        {isDataLoaded && (match ? (matchAPI.map((candidate, candidate_index) => (
                          <tr className={styles.table_row} >
                            <td onClick={() => navigateTo(`/candidatelibrary/editcandidate?candidate_id=${candidate._id}`)} className={styles.table_dataContents}>{candidate.CandidateId}</td>
                            <td className={styles.table_dataContents}
                              onMouseEnter={() => setHoverCallout(candidate.first_name)}
                              onMouseLeave={() => setHoverCallout('')}
                              id={`${candidate.first_name}${candidate._id}`.replaceAll(" ", "")}>

                              {addEllipsisToName(`${candidate.first_name} ${candidate.last_name}`)}

                              {(candidate.first_name + candidate.last_name).length >= 14 && hoverCallout === candidate.first_name && <Callout alignTargetEdge={true}
                                isBeakVisible={false} styles={CalloutNameStyles}
                                directionalHint={DirectionalHint.bottomLeftEdge} target={`#${candidate.first_name}${candidate._id}`.replaceAll(" ", "")}>
                                {`${candidate.first_name} ${candidate.last_name}`}
                              </Callout>
                              }
                            </td>
                            <td className={styles.table_dataContents} style={{ textAlign: 'center' }}>{ISOdateToCustomDate(candidate.createdAt)}</td>
                            <td className={styles.table_dataContents}>{candidate.mobile_number}</td>
                            <td className={styles.table_dataContents}>{candidate.email}</td>
                            <td className={styles.table_dataContents}
                              onMouseEnter={() => setHoverCallout(candidate.created_by)}
                              onMouseLeave={() => setHoverCallout('')}
                              id={`${candidate.created_by?.first_name}${candidate._id}`.replaceAll(" ", "")}>

                              {addEllipsisToName(`${candidate.created_by?.first_name} ${candidate.created_by?.last_name}`)}

                              {(candidate.created_by?.first_name + candidate.created_by?.last_name).length >= 14 && hoverCallout === candidate.created_by && <Callout alignTargetEdge={true}
                                isBeakVisible={false} styles={CalloutNameStyles}
                                directionalHint={DirectionalHint.bottomLeftEdge} target={`#${candidate.created_by?.first_name}${candidate._id}`.replaceAll(" ", "")}>
                                {`${candidate.created_by.first_name} ${candidate.created_by.last_name}`}
                              </Callout>
                              }
                            </td>
                            <td className={styles.table_dataContents}
                              onMouseEnter={() => setHoverCallout(candidate._id)}
                              onMouseLeave={() => setHoverCallout("")}
                              id={`primary_skill_${candidate._id}`}>

                              {addEllipsisToName(`${candidate.skillset[0]?.skill ? candidate.skillset[0]?.skill : "-"}`)}

                              {candidate.skillset[0]?.skill?.length >= 14 && hoverCallout === candidate._id && <Callout alignTargetEdge={true}
                                isBeakVisible={false} styles={CalloutNameStyles}
                                directionalHint={DirectionalHint.bottomLeftEdge} target={`#primary_skill_${candidate._id}`}>
                                {candidate.skillset[0]?.skill}
                              </Callout>
                              }
                            </td>
                            <td className={styles.table_dataContents}>{candidate.skillset[0]?.skill ? (candidate.skillset[0]?.skill) : 'Nil'}</td>
                            {/* <td className={styles.table_dataContents}>{candidate.skillset[0]?.exp ? (`${Math.floor(candidate.skillset[0]?.exp / 12)} Years ${candidate.skillset[0]?.exp % 12} Months`) : (candidate.skillset[0]?.years) ? `${candidate.skillset[0]?.years} Years ${candidate.skillset[0]?.months} Months` : 'Nil'}</td> */}
                            {/* <td className={styles.table_dataContents}>{candidate.skillset[1]?.skill ? (candidate.skillset[1]?.skill) : 'Nil'}</td> */}
                            {/* <td className={styles.table_dataContents}>{candidate.skillset[1]?.exp ? (`${Math.floor(candidate.skillset[1]?.exp / 12)} Years ${candidate.skillset[1]?.exp % 12} Months`) : (candidate.skillset[1]?.years) ? `${candidate.skillset[1]?.years} Years ${candidate.skillset[1]?.months} Months` : 'Nil'}</td> */}
                            {/* <td className={styles.table_dataContents}>{skillLister(candidate.skillset)}</td> */}
                            <td className={styles.table_dataContents}>{(candidate.total_experience) ? candidate.total_experience : `${calcTotalExp(candidate.employment_details).years} Years ${calcTotalExp(candidate.employment_details).months} Months`}</td>
                            {/* <td className={styles.table_dataContents}>{candidate.notice_period}</td> */}
                            {/* <td className={styles.table_dataContents}>{getCurrentCompany(candidate.employment_details).name}</td> */}
                            {/* <td className={styles.table_dataContents}>{candidate.current_location}</td> */}
                            {/* <td className={styles.table_dataContents}>{getCurrentCompany(candidate.employment_details).ctc}</td> */}
                            {/* <td className={styles.table_dataContents}>{candidate.expected_ctc}</td>
                                 <td className={styles.table_dataContents}>{candidate.prefered_location}</td> */}
                            <td className={styles.table_dataContents}>{(candidate.resume_cv) ? <div onClick={() => openResume(candidate.resume_cv)}>link</div> : <a href={candidate.resume_url} target="_blank">Link</a>}</td>
                            <td className={styles.table_dataContents}>{candidate.status}</td>
                            <td className={styles.table_dataContents}><a href={candidate.resume_url} target="_blank">Link</a></td>
                            <td className={styles.table_dataContents}>
                              <div className={styles.moreOptions}
                                id={`FO_${candidate.mobile_number}`}
                                onClick={() => {
                                  setRowId(candidate._id);
                                  setUpdateCallout(true)
                                }}>
                                <FontIcon iconName='MoreVertical' className={iconClass1} />
                                {rowId === candidate._id &&
                                  updateCallout && <Callout gapSpace={0} target={`#FO_${candidate.mobile_number}`} onDismiss={() => setRowId('')}
                                    isBeakVisible={false} directionalHint={DirectionalHint.bottomCenter}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <DefaultButton text="View / Edit" onClick={() => navigateTo(`/candidatelibrary/editcandidate?candidate_id=${candidate._id}`)} styles={calloutBtnStyles} />
                                      <DefaultButton onClick={() => deleteCandidate(candidate)} text="Delete" styles={calloutBtnStyles} />

                                    </div>
                                  </Callout>
                                }
                              </div>
                            </td>
                          </tr>))) :
                          rowsToRender.map((candidate, candidate_index) => (
                            <tr className={styles.table_row} >
                              <td onClick={() => navigateTo(`/candidatelibrary/editcandidate?candidate_id=${candidate._id}`)} className={styles.table_dataContents}>{candidate.CandidateId}</td>
                              <td className={styles.table_dataContents}
                                onMouseEnter={() => setHoverCallout(candidate.first_name)}
                                onMouseLeave={() => setHoverCallout('')}
                                id={`${candidate.first_name}${candidate._id}`.replaceAll(" ", "")}>

                                {addEllipsisToName(`${candidate.first_name} ${candidate.last_name}`)}

                                {(candidate.first_name + candidate.last_name).length >= 14 && hoverCallout === candidate.first_name && <Callout alignTargetEdge={true}
                                  isBeakVisible={false} styles={CalloutNameStyles}
                                  directionalHint={DirectionalHint.bottomLeftEdge} target={`#${candidate.first_name}${candidate._id}`.replaceAll(" ", "")}>
                                  {`${candidate.first_name} ${candidate.last_name}`}
                                </Callout>
                                }
                              </td>
                              <td className={styles.table_dataContents} style={{ textAlign: 'center' }}>{ISOdateToCustomDate(candidate.createdAt)}</td>
                              <td className={styles.table_dataContents}>{candidate.mobile_number}</td>
                              <td className={styles.table_dataContents}>{candidate.email}</td>
                              <td className={styles.table_dataContents}
                                onMouseEnter={() => setHoverCallout(candidate.created_by)}
                                onMouseLeave={() => setHoverCallout('')}
                                id={`${candidate.created_by?.first_name}${candidate._id}`.replaceAll(" ", "")}>

                                {addEllipsisToName(`${candidate.created_by?.first_name} ${candidate.created_by?.last_name}`)}

                                {(candidate.created_by?.first_name + candidate.created_by?.last_name).length >= 14 && hoverCallout === candidate.created_by && <Callout alignTargetEdge={true}
                                  isBeakVisible={false} styles={CalloutNameStyles}
                                  directionalHint={DirectionalHint.bottomLeftEdge} target={`#${candidate.created_by?.first_name}${candidate._id}`.replaceAll(" ", "")}>
                                  {`${candidate.created_by.first_name} ${candidate.created_by.last_name}`}
                                </Callout>
                                }
                              </td>
                              <td className={styles.table_dataContents}
                                onMouseEnter={() => setHoverCallout(candidate._id)}
                                onMouseLeave={() => setHoverCallout("")}
                                id={`primary_skill_${candidate._id}`}>

                                {addEllipsisToName(`${candidate.skillset[0]?.skill ? candidate.skillset[0]?.skill : "-"}`)}

                                {candidate.skillset[0]?.skill?.length >= 14 && hoverCallout === candidate._id && <Callout alignTargetEdge={true}
                                  isBeakVisible={false} styles={CalloutNameStyles}
                                  directionalHint={DirectionalHint.bottomLeftEdge} target={`#primary_skill_${candidate._id}`}>
                                  {candidate.skillset[0]?.skill}
                                </Callout>
                                }
                              </td>
                              <td className={styles.table_dataContents}>{candidate.skillset[0]?.skill ? (candidate.skillset[0]?.skill) : 'Nil'}</td>
                              {/* <td className={styles.table_dataContents}>{candidate.skillset[0]?.exp ? (`${Math.floor(candidate.skillset[0]?.exp / 12)} Years ${candidate.skillset[0]?.exp % 12} Months`) : (candidate.skillset[0]?.years) ? `${candidate.skillset[0]?.years} Years ${candidate.skillset[0]?.months} Months` : 'Nil'}</td> */}
                              {/* <td className={styles.table_dataContents}>{candidate.skillset[1]?.skill ? (candidate.skillset[1]?.skill) : 'Nil'}</td> */}
                              {/* <td className={styles.table_dataContents}>{candidate.skillset[1]?.exp ? (`${Math.floor(candidate.skillset[1]?.exp / 12)} Years ${candidate.skillset[1]?.exp % 12} Months`) : (candidate.skillset[1]?.years) ? `${candidate.skillset[1]?.years} Years ${candidate.skillset[1]?.months} Months` : 'Nil'}</td> */}
                              {/* <td className={styles.table_dataContents}>{skillLister(candidate.skillset)}</td> */}
                              <td className={styles.table_dataContents}>{(candidate.total_experience) ? candidate.total_experience : `${calcTotalExp(candidate.employment_details).years} Years ${calcTotalExp(candidate.employment_details).months} Months`}</td>
                              {/* <td className={styles.table_dataContents}>{candidate.notice_period}</td> */}
                              {/* <td className={styles.table_dataContents}>{getCurrentCompany(candidate.employment_details).name}</td> */}
                              {/* <td className={styles.table_dataContents}>{candidate.current_location}</td> */}
                              {/* <td className={styles.table_dataContents}>{getCurrentCompany(candidate.employment_details).ctc}</td> */}
                              {/* <td className={styles.table_dataContents}>{candidate.expected_ctc}</td>
                                  <td className={styles.table_dataContents}>{candidate.prefered_location}</td> */}
                              <td className={styles.table_dataContents}>{(candidate.resume_cv) ? <div onClick={() => openResume(candidate.resume_cv)}>link</div> : <a href={candidate.resume_url} target="_blank">Link</a>}</td>
                              <td className={styles.table_dataContents}>{candidate.status}</td>
                              <td className={styles.table_dataContents}><a href={candidate.resume_url} target="_blank">Link</a></td>
                              <td className={styles.table_dataContents}>
                                <div className={styles.moreOptions}
                                  id={`FO_${candidate.mobile_number}`}
                                  onClick={() => {
                                    setRowId(candidate._id);
                                    setUpdateCallout(true)
                                  }}>
                                  <FontIcon iconName='MoreVertical' className={iconClass1} />
                                  {rowId === candidate._id &&
                                    updateCallout && <Callout gapSpace={0} target={`#FO_${candidate.mobile_number}`} onDismiss={() => setRowId('')}
                                      isBeakVisible={false} directionalHint={DirectionalHint.bottomCenter}>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <DefaultButton text="View / Edit" onClick={() => navigateTo(`/candidatelibrary/editcandidate?candidate_id=${candidate._id}`)} styles={calloutBtnStyles} />
                                        <DefaultButton onClick={() => deleteCandidate(candidate)} text="Delete" styles={calloutBtnStyles} />

                                      </div>
                                    </Callout>
                                  }
                                </div>
                              </td>
                            </tr>)))}
                      </>
                    )}
                    {!isDataLoaded && items.map(candidate => (
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
                        <td className={styles.table_dataContents}>
                          <div className={styles.moreOptions} >
                            <FontIcon iconName='MoreVertical' className={iconClass1} />
                          </div>
                        </td>
                      </tr>))}
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

export default CandidateListing