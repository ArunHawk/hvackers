import React, { useState } from "react";
import styles from "./ManageEmployee.module.css"
import { PrimaryButton, SearchBox, FontIcon, mergeStyles, Dropdown } from '@fluentui/react';
import { DefaultButton, Callout, DirectionalHint } from '@fluentui/react';
import { Shimmer } from '@fluentui/react';
import AddDemandModal from "./AddDemandModal";
import AddSubmissionModal from "./AddSubmissionModal";
import AssignDemandModal from "./AssignDemandModal";
import { MessageBar, MessageBarType } from "@fluentui/react";
import { useEffect } from "react";
import { axiosPrivateCall } from "../constants";
import { ISOdateToCustomDate } from "../utils/helpers";
import { useNavigate, useSearchParams } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { DeletePopup } from "../components/DeletePopup";
import { debounce } from 'lodash';

const addIcon = { iconName: 'Add' };
const searchIcon = { iconName: 'Search' };




const iconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
  margin: '0 10px',
  color: '#999DA0',
  cursor: 'pointer'
});

const iconClass1 = mergeStyles({
  fontSize: 12,
  height: 12,
  width: 12,
  margin: '0 ',
  color: '#999DA0',
});


const messageBarStyles = {
  content: {
    maxWidth: 620,
    minWidth: 450,
  }
}

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
  { key: 'DemandId', text: 'Demand Id' },
  { key: 'job_title', text: 'Requirement' },
  { key: 'skillset', text: 'Skill' },
];


let items = Array(4).fill(null);
function DemandListing() {
  const [showPopup, setShowPopup] = useState(false)
  const [updateId, setUpdateId] = useState('')
  const [deleteId, setDeleteID] = useState('')
  const [isSubmitDel, setSubmitDel] = useState(false);
  const [showMessageBar, setShowMessageBar] = useState(false);
  const [showSubStauts, setShowSubStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subIsModalOpen, setSubIsModalOpen] = useState(false);
  const [showAssignDemandmodal, setShowAssignDemandModal] = useState(false);
  const [demandList, setDemandList] = useState([]);
  const [demandId, setDemandId] = useState('');
  const [assignDemandId, setAssignDemandId] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isUserSearching, setIsUserSearching] = useState(false)
  const [fetchOptions, setFetchOptions] = useState({
    skip: 0,
    limit: 15,
    sort_field: 'createdAt',
    sort_type: -1,
    search_field: ''
  })
  const [rowId, setRowId] = useState('');
  const [updateCallout, setUpdateCallout] = useState(false);
  const [hasMore, setHasMore] = useState(true)
  const navigateTo = useNavigate();
  const demandCreator = localStorage.getItem("demand_creator")
  const [hoverCallout, setHoverCallout] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();


  const userId = searchParams.get("user_id");



  const columns = [
    {
      columnKey: 'Demand ID',
      label: 'Demand ID',
    }, {
      columnKey: 'Requirement',
      label: 'Requirement',
    }, {
      columnKey: 'createdAt',
      // icon: `${ fetchOptions.sort_field=== 'createdAt' && fetchOptions.sort_type === 1 ?  'SortUp' : 'SortDown' }`,
      label: 'Received Date',
    },
    // {
    //   columnKey: 'Overall Submission',
    //   label: 'Overall Submission'
    // },
    {
      columnKey: 'POC',
      label: 'POC'
    }, {
      columnKey: 'Sub Vendor',
      label: 'Sub Vendor'
    }, {
      columnKey: 'Client',
      label: 'Client'
    }, {
      columnKey: 'Min Experience',
      label: 'Min Experience',
    }, {
      columnKey: 'Primary Skill',
      label: 'Primary Skill '
    },
    // {
    //   columnKey: 'Primary Skill Experience',
    //   label: 'Primary Skill Experience',
    // },
    {
      columnKey: 'Secondary Skill',
      label: 'Secondary Skill '
    },
    // {
    //   columnKey: 'Secondary Skill Experience',
    //   label: 'Secondary Skill Experience',
    // }, 
    {
      columnKey: 'Other Skill',
      label: 'Other Skill',
    },
    // {
    //   columnKey: 'Other Skill Experience',
    //   label: 'Other Skill Experience',
    // },
    {
      columnKey: 'Created By',
      label: 'Created By'
    }, {
      columnKey: 'More Options',
      label: ' '
    }];


  useEffect(() => {

    if (showMessageBar) {

      setTimeout(() => {
        setShowMessageBar(!showMessageBar)
      }, 3500)
    }

  }, [showMessageBar])

  useEffect(() => {

    getDemandList();
    setHasMore(true);
    setFetchOptions({ ...fetchOptions, skip: 0, limit: 15 });
  }, [isModalOpen]);

  useEffect(() => {

    getDemandList();
    setHasMore(true);
    setFetchOptions({ ...fetchOptions, skip: 0, limit: 15 });
  }, [showAssignDemandmodal]);


  const getDemandList = debounce(() => {
    setIsDataLoaded(false);
    if (userId) {
      axiosPrivateCall
        .get(`/api/v1/BDE/listUserLevelActiveDemands?user_id=${userId}&skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then((res) => {
          console.log(res.data);
          setDemandList(res.data.demands);
          setIsDataLoaded(true);
          setHasMore(true)
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axiosPrivateCall.get(`/api/v1/demand/listUserCreatedDemands`)
        .then(res => {
          console.log(res.data);
          setDemandList(res.data);
          setIsDataLoaded(true);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, 500);
  const [DropdownSearch, setDropdownSearch] = useState('')

  const handleDropdownChange = (e, item) => {
    setDropdownSearch(item.key)
  }

  const searchDemandList = (e) => {

    const searchValue = e

    if (searchValue === '') {
      getDemandList();
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
    axiosPrivateCall.get(`/api/v1/demand/searchUserCreatedDemands?skip=0&limit=15&field_name=${DropdownSearch}&field_value=${searchValue}`)
      .then(res => {
        console.log(res)
        console.log(res.data);
        setDemandList(res.data);
        setIsDataLoaded(true)
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
  }




  const fetchMoreData = () => {

    if (isUserSearching) {
      axiosPrivateCall.get(`/api/v1/demand/searchUserCreatedDemands?skip=${fetchOptions.skip + fetchOptions.limit}&limit=${fetchOptions.limit}&field_name=job_title&field_value=${fetchOptions.search_field}`)
        .then(res => {
          const moreDemands = res.data;
          // console.log(moreDemands.length)


          setDemandList([...demandList, ...moreDemands])
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
    } else if (userId) {
      axiosPrivateCall
        .get(`/api/v1/BDE/listUserLevelActiveDemands?user_id=${userId}&skip=${fetchOptions.skip + fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then((res) => {
          const moreDemands = res.data.demands;

          console.log(moreDemands.length)
          setDemandList([...demandList, ...moreDemands])
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
    }

    else {
      axiosPrivateCall.get(`/api/v1/demand/listDemands?skip=${fetchOptions.skip + fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then(res => {
          const moreDemands = res.data;
          console.log(moreDemands.length)


          setDemandList([...demandList, ...moreDemands])
          if (moreDemands.length < 15 || moreDemands.length === 0) {
            setHasMore(false)
          }

          // setFetchOptions((prevState)=>{

          //   return{

          //     ...prevState,
          //     skip: fetchOptions.skip+fetchOptions.limit,
          //   }

          // })
        }).catch(e => {
          console.log(e)
        })

    }



    console.log('getting more data')
  }

  const clickSortHandler = (key) => {

    console.log(key)

    if (!isDataLoaded) return;

    if (key === 'createdAt') {
      setFetchOptions(
        {
          ...fetchOptions,
          sort_field: key,
          sort_type: fetchOptions.sort_type === -1 ? 1 : -1,
        }
      )

    }
  }

  const deleteDemand = (id) => {

    setUpdateCallout(!updateCallout)
    setShowPopup(!showPopup);
    const deleteObj = { _id: id.DemandId }
    setDeleteID(deleteObj)
    setUpdateId({ _id: id._id })

  }

  function handleAddSubmision(id) {
    setDemandId(id);
    setSubIsModalOpen(true);
  };

  const assignDemandModalHandler = (_id) => {
    setShowAssignDemandModal(true)
    setAssignDemandId(_id)

  }
  const handleUpdate = (showpop) => {
    const deleteObj = updateId
    if (!showpop) {
      setShowPopup(!showPopup)

      axiosPrivateCall.post(`/api/v1/demand/deleteDemand`, deleteObj).then(res => {
        setSubmitDel(!isSubmitDel)
        const demandArrList = demandList
        setDemandList(demandArrList.filter(demand => demand._id !== deleteObj._id));
      }).catch(e => {
        console.log(e)
        setUpdateCallout(false)
      })
    }
  }

  const addEllipsisToName = (name) => {
    // console.log(name, name.length);

    if (name.length > 14) {
      let new_name = name.substring(0, 12).padEnd(15, '.')

      return new_name
    }
    else return name;
  };

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
        {isModalOpen && <AddDemandModal showMessageBar={showMessageBar} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
          setShowMessageBar={setShowMessageBar} focus={false} />}

        {showAssignDemandmodal && <AssignDemandModal assignDemandId={assignDemandId} isModalOpen={showAssignDemandmodal} setIsModalOpen={setShowAssignDemandModal} />}

        {subIsModalOpen && <AddSubmissionModal subIsModalOpen={subIsModalOpen}
          setSubIsModalOpen={setSubIsModalOpen}
          showSubStauts={showSubStauts}
          setShowSubStatus={setShowSubStatus}
          demandId={demandId} />}

        <div className={styles.nav_container}>
          <div className={styles.title}>Demand Listing</div>

          {showMessageBar && <div >
            <MessageBar onDismiss={() => setShowMessageBar(!showMessageBar)} styles={messageBarStyles} dismissButtonAriaLabel="Close" messageBarType={MessageBarType.success}>
              Demand added successfully
            </MessageBar>
          </div>}
          {isSubmitDel && <div >
            <MessageBar onDismiss={() => setSubmitDel(!isSubmitDel)} styles={messageBarStyles} dismissButtonAriaLabel="Close" messageBarType={MessageBarType.success}>
              Demand Deleted successfully
            </MessageBar>
          </div>}

          {showSubStauts && <div >
            <MessageBar onDismiss={() => setShowSubStatus(!showSubStauts)} styles={messageBarStyles} dismissButtonAriaLabel="Close" messageBarType={MessageBarType.success}>
              Submission added successfully
            </MessageBar>
          </div>}
          {/* <div className={styles.search_dropdown}>
                         <Dropdown placeholder='select search field' onChange={handleDropdownChange}  options={options} styles={dropdownStyles}/>
                        </div> */}

          <div className={styles.nav_items}>
            {/* <SearchBox onSearch={(e)=>searchDemandList(e)} disabled={DropdownSearch == ""? true:false}  onClear={clearSearchBox} placeholder=" " iconProps={searchIcon} className={styles.search}  /> */}
            <FontIcon iconName="Breadcrumb" className={iconClass} />
            <PrimaryButton style={{ display: (demandCreator == "true") ? 'block' : 'none' }} onClick={(e) => { setTimeout(() => setIsModalOpen(!isModalOpen), 0); }} text="Add Demand" iconProps={addIcon} />
            {/* <FontIcon onClick={downloadDemands} iconName="Download" className={iconClass} /> */}
            <FontIcon iconName="Download" className={iconClass} />

          </div>
        </div>

        <div id="scrollableDiv" className={styles.table_container}>
          <InfiniteScroll style={{ overflow: 'visible', height: '100%' }} dataLength={demandList.length} loader={isDataLoaded && demandList.length >= 15 && <h4>Loading...</h4>}
            hasMore={hasMore} next={fetchMoreData} scrollableTarget="scrollableDiv">
            <table>
              <thead className={styles.table_header}>
                <tr className={styles.table_row}>
                  {columns.map((column) =>
                    <th onClick={() => clickSortHandler(column.columnKey)} className={styles.table_headerContents} key={column.columnKey}>
                      <div className={styles.table_heading}>
                        <div>{column.label}</div>
                        {column?.icon ? <FontIcon iconName={column.icon} className={iconClass1} /> : null}
                      </div>
                    </th>)}
                </tr>
              </thead>


              <tbody>
                {isDataLoaded && demandList.map((demand, demand_index) =>
                  <tr className={styles.table_row} key={demand._id}>

                    <td onClick={() => navigateTo(`/demand/editdemand?demand_id=${demand._id}`, { state: { demand: 'mydemand' } })} className={styles.table_dataContents}>{demand.DemandId}</td>
                    <td className={styles.table_dataContents}
                      onMouseEnter={() => setHoverCallout(demand.created_by)}
                      onMouseLeave={() => setHoverCallout('')}
                      id={`${demand.created_by?.first_name}_${demand._id}`.replaceAll(" ", "_")}>

                      {addEllipsisToName(demand.job_title)}

                      {(demand.job_title).length >= 14 && hoverCallout === demand.created_by && <Callout alignTargetEdge={true}
                        isBeakVisible={false} styles={CalloutNameStyles}
                        directionalHint={DirectionalHint.bottomLeftEdge} target={`#${demand.created_by?.first_name}_${demand._id}`.replaceAll(" ", "_")}>
                        {demand.job_title}
                      </Callout>
                      }
                    </td>
                    <td className={styles.table_dataContents}>{ISOdateToCustomDate(demand.createdAt)}</td>
                    {/* <td className={styles.table_dataContents}>{demand.assigned_to.length}</td> */}
                    <td className={styles.table_dataContents}>{demand.poc_vendor}</td>
                    <td className={styles.table_dataContents}>{demand.vendor_name}</td>
                    <td className={styles.table_dataContents}>{demand.client}</td>
                    <td className={styles.table_dataContents}>{`${Math.floor(demand.minimum_experience / 12)} years ${demand.minimum_experience % 12} months`}</td>
                    <td className={styles.table_dataContents}
                      onMouseEnter={() => setHoverCallout(demand._id)}
                      onMouseLeave={() => setHoverCallout("")}
                      id={`primary_skill_${demand._id}`}>

                      {addEllipsisToName(`${demand.skillset[0]?.skill ? demand.skillset[0]?.skill : "-"}`)}

                      {demand.skillset[0]?.skill?.length >= 14 && hoverCallout === demand._id && <Callout alignTargetEdge={true}
                        isBeakVisible={false} styles={CalloutNameStyles}
                        directionalHint={DirectionalHint.bottomLeftEdge} target={`#primary_skill_${demand._id}`}>
                        {demand.skillset[0]?.skill}
                      </Callout>
                      }
                    </td>
                    {/* <td className={styles.table_dataContents}>{`${Math.floor(demand.skillset[0]?.exp/12)} years ${Math.floor(demand.skillset[0]?.exp%12)} months`}</td> */}
                    <td className={styles.table_dataContents}
                      onMouseEnter={() => setHoverCallout(demand.DemandId)}
                      onMouseLeave={() => setHoverCallout("")}
                      id={`secondary_skill_${demand.DemandId}`}>

                      {addEllipsisToName(`${demand.skillset[1]?.skill ? demand.skillset[1]?.skill : "-"}`)}

                      {demand.skillset[1]?.skill?.length >= 14 && hoverCallout === demand.DemandId && <Callout alignTargetEdge={true}
                        isBeakVisible={false} styles={CalloutNameStyles}
                        directionalHint={DirectionalHint.bottomLeftEdge} target={`#secondary_skill_${demand.DemandId}`}>
                        {demand.skillset[1]?.skill}
                      </Callout>
                      }
                    </td>
                    {/* <td className={styles.table_dataContents}>{ demand.skillset[1]?.skill ? `${Math.floor(demand.skillset[1]?.exp/12)} years ${Math.floor(demand.skillset[1]?.exp%12)} months` : '-' }</td> */}
                    <td className={styles.table_dataContents}
                      onMouseEnter={() => setHoverCallout((demand.DemandId) + (demand._id))}
                      onMouseLeave={() => setHoverCallout("")}
                      id={`other_skill_${(demand.DemandId) + (demand._id)}`}>

                      {addEllipsisToName(`${skillLister(demand.skillset)}`)}

                      {skillLister(demand.skillset).length >= 14 && hoverCallout === (demand.DemandId) + (demand._id) && <Callout alignTargetEdge={true}
                        isBeakVisible={false} styles={CalloutNameStyles}
                        directionalHint={DirectionalHint.bottomLeftEdge} target={`#other_skill_${(demand.DemandId) + (demand._id)}`}>
                        {skillLister(demand.skillset)}
                      </Callout>
                      }
                    </td>
                    {/* <td className={styles.table_dataContents}>{demand.skillset[2]?.skill ? `${Math.floor(demand.skillset[2]?.exp/12)} years ${Math.floor(demand.skillset[2]?.exp%12)} months` : '-'}</td> */}
                    <td className={styles.table_dataContents}>{demand.created_by?.first_name + " " + demand.created_by?.last_name}</td>
                    <td className={styles.table_dataContents}>
                      <div id={`Dp${demand._id}`} onClick={() => { setRowId(demand._id); setUpdateCallout(true) }} className={styles.moreOptions}>
                        <FontIcon iconName='MoreVertical' className={iconClass1} />
                        {rowId === demand._id &&
                          updateCallout && <Callout gapSpace={0} target={`#Dp${demand._id}`} onDismiss={() => setRowId('')}
                            isBeakVisible={false} directionalHint={DirectionalHint.bottomCenter}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <DefaultButton onClick={() => navigateTo(`/demand/editdemand?demand_id=${demand._id}`, { state: { demand: 'mydemand' } })} text="View/Edit Demand" styles={calloutBtnStyles} />
                              {/* <DefaultButton text="Submission List" styles={calloutBtnStyles}/> */}
                              <DefaultButton onClick={() => { handleAddSubmision(demand._id) }} text="Add Submission" styles={calloutBtnStyles} />
                              <DefaultButton text='View Submissions' onClick={() => navigateTo(`/submission/managesubmissions?demand_id=${demand._id}`)} styles={calloutBtnStyles} />
                              <DefaultButton onClick={() => deleteDemand(demand)} text="Delete Demand" styles={calloutBtnStyles} />
                              <DefaultButton onClick={() => assignDemandModalHandler(demand._id)} text={"Assign Demand"} styles={calloutBtnStyles} />
                            </div>
                          </Callout>
                        }
                      </div>
                    </td>
                  </tr>)}
                {!isDataLoaded && items.map(employee =>
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
                    <td className={styles.table_dataContents}>
                      <div className={styles.moreOptions} >
                        <FontIcon iconName='MoreVertical' className={iconClass1} />
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );

};

export default DemandListing;







