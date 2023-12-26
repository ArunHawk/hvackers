import React,{ useState } from "react";
import styles from "./ManageEmployee.module.css"
import {PrimaryButton, SearchBox, FontIcon, mergeStyles, Dropdown } from '@fluentui/react';
import { DefaultButton,Callout,DirectionalHint} from '@fluentui/react';
import { Shimmer} from '@fluentui/react';
import AddDemandModal from "./AddDemandModal";
import AddSubmissionModal from "./AddSubmissionModal";
import AssignDemandModal from "./AssignDemandModal";
import { MessageBar, MessageBarType } from "@fluentui/react";
import { useEffect } from "react";
import { axiosPrivateCall } from "../constants";
import { ISOdateToCustomDate } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import {DeletePopup}  from "../components/DeletePopup";
import { ContractDownLeft16Filled } from "@fluentui/react-icons";
import { ClientTrackerPopup } from "../components/ClientTrackerPopup";
import { useSearchParams } from 'react-router-dom';
import Nomatchimg from "../assets/no.png"
import { useLocation } from 'react-router-dom';

import { MatchProfilePopup} from "../components/MatchProfilePopup";

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
  });

const messageBarStyles={
  content:{
      maxWidth: 620,
      minWidth: 450,
  }
}

const calloutBtnStyles = {
    root:{
      border: 'none',
      padding: '0px 10px',
      textAlign: 'left',
      height: '20px'
  
    }
  }
  const CalloutNameStyles ={
    calloutMain:{
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

    const [showMessageBar,setShowMessageBar] = useState(false);
    const [showdeleteMessageBar,setShowDeleteMessageBar] = useState(false);
    const [ showSubStauts, setShowSubStatus] = useState(false);
    const [showPopup,setShowPopup]=useState(false);

    const [showProfilePopup,setShowProfilePopup]=useState(true);
    const [matchProfile,setMatchProfile]=useState(false)
    const [matchData,setMatchData]=useState([])
    const location = useLocation();
     const [match, setMatch] = useState(location.state);
    const[ updateId,setUpdateId]=useState('')
    const [deleteId,setDeleteID]=useState('')
    const [isModalOpen , setIsModalOpen] = useState(false);
    const [subIsModalOpen, setSubIsModalOpen] = useState(false);
    const [showAssignDemandmodal, setShowAssignDemandModal] = useState(false);
    const [demandList,setDemandList] = useState([]);
    const [demandId,setDemandId] = useState('');
    const [assignDemandId, setAssignDemandId] = useState();
    const [demandViewId,setDemandViewId] = useState('');
    const [isDataLoaded, setIsDataLoaded]= useState(false);
    const[isUserSearching,setIsUserSearching] = useState(false)
    const [isClientTrackerOpen, setIsClientTrackerOpen] = useState(false)
    const [fetchOptions,setFetchOptions] = useState({
        skip: 0,
        limit: 15,
        sort_field:'updatedAt',
        sort_type:-1,
        search_field: ''
      })
    const [rowId,setRowId] = useState('');
    const [updateCallout,setUpdateCallout] = useState(false);
    const [hasMore,setHasMore] = useState(true)
    const navigateTo = useNavigate();
    const demandCreator = localStorage.getItem("demand_creator")
    const [hoverCallout,setHoverCallout]= useState('');
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
  

    const [searchParams, setSearchParams] = useSearchParams();

    const userId = searchParams.get('user_id')

    const columns = [
      {
      columnKey: 'Demand ID',
      label: 'Demand ID',
    }, {
      columnKey: 'Requirement',
      label: 'Requirement',
    }, 
    {
      columnKey: 'createdAt',
      icon: `${ fetchOptions.sort_field=== 'createdAt' && fetchOptions.sort_type === 1 ?  'SortUp' : 'SortDown' }`,
      label: 'Received Date',
    }, 
    // {
    //   columnKey: 'Overall Submission',
    //   label: 'Overall Submission'
    // },
    {
      columnKey: 'POC',
      label: 'POC'
    },{
      columnKey: 'Sub Vendor',
      label: 'Sub Vendor'
    },{
      columnKey: 'Client',
      label: 'Client'
    },{
      columnKey: 'Min Experience',
      label: 'Min Experience',
    },{
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
    },{
      columnKey: 'More Options',
      label: ' '
  }];

useEffect(() => {
    if (showMessageBar) {
      setTimeout(() => {
        setShowMessageBar(false);
      }, 2000);
    }
  }, [showMessageBar]);
  

    useEffect(()=>{
        getDemandList()
        setHasMore(true)
        setFetchOptions({...fetchOptions,skip: 0,limit: 15})
    },[isModalOpen,fetchOptions.sort_field,fetchOptions.sort_type,])


    useEffect(() => {

      getDemandList()
      setHasMore(true)
      setFetchOptions({...fetchOptions,skip: 0,limit: 15})
      
    }, [showAssignDemandmodal])
    
    const getDemandList= ()=>{
        setIsDataLoaded(false)
        if (userId) {
          axiosPrivateCall
            .get(`/api/v1/aggregate/listUserLevelDemands?user_id=${userId}`)
            .then((res) => {
              setDemandList(res.data);
              setIsDataLoaded(true);
            })
            .catch((e) => {
              console.log(e);
            });
        }  
      
        else if(match){
          axiosPrivateCall
          .get(`api/v1/candidate/matchDemands?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
          .then((res) => {
            setMatchData(res.data);
            setIsDataLoaded(true)
          }).catch(err=>console.log('falied'))
        }else {
          axiosPrivateCall
            .get(
              `/api/v1/demand/listDemands?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`
            )
            .then((res) => {
              setDemandList(res.data);
              setIsDataLoaded(true);
            })
            .catch((e) => {
              console.log(e);
            });
            setShowProfilePopup(true)
        }

    }

  const [DropdownSearch, setDropdownSearch] = useState('')
  const [SearchData, setSearchData] = useState('')
  const [searchTerm, setSearchTerm] = React.useState('');
  const [SplitedData, setSplitedData] = useState('')
  
  const handleDropdownChange = (e,item)=>{
    setDropdownSearch(item.key)
    setSearchTerm('')
  }
  // const options = [
  //   { key: 'DemandId', text: 'Demand Id' },
  //   { key: 'job_title', text: 'Requirement' },
  //   { key: 'skillset', text: 'Skill' },
  // ];
    const handleSearchInputChange = (event) => {
      if (!event || !event.target) {
        setSearchTerm('');
        return;
      }
    const { value } = event.target;

    if (DropdownSearch === 'DemandId' && value && !/^[0-9a-zA-Z]+$/.test(event.target.value)) {
      return;
    }
 setSearchTerm(value);
  };   


  const searchDemandList = (e) =>{

    const searchValue =  e

    if(searchValue === ''){
      getDemandList();
      return
    }



    setIsDataLoaded(false)
    setIsUserSearching(true)

    setFetchOptions(prevData=>{
      return{
        ...prevData,
        search_field: searchValue
      }
    })
     axiosPrivateCall.get(`/api/v1/demand/searchDemand?skip=0&limit=15&field_name=${DropdownSearch}&field_value=${searchValue}`)
     .then(res=>{
      console.log(res)
      setSearchData(res.data)
      setSplitedData(15)
      setDemandList(res.data.slice(0,15));
      setIsDataLoaded(true)
      setHasMore(true)
     }).catch(e=>{
      console.log(e)
     })
  }

    const clearSearchBox= ()=>{
      setIsUserSearching(false)

      setFetchOptions(prevData=>{
        return{
          ...prevData,
          search_field: ''
        }
      })
      setSearchTerm(''); 
      getDemandList();
      setHasMore(true)
    }

 
  

    const fetchMoreData =()=>{

      if(isUserSearching){
        const moreDemands = SearchData.slice(SplitedData, SplitedData + 15)
        setSplitedData(SplitedData + 15)
        if(SplitedData >= SearchData.length){
          setHasMore(false)
        }
      } else if(match){
        axiosPrivateCall.get(`/api/v1/candidate/matchDemands?skip=${fetchOptions.skip+fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then(res=>{
          const moreDemands =res.data;
          console.log(moreDemands.length)
          setMatchData([...matchData,...moreDemands])
          if(moreDemands.length < 15 || moreDemands.length === 0){
            setHasMore(false)
          }
          setFetchOptions((prevState)=>{
            return{
              ...prevState,
              skip: fetchOptions.skip+fetchOptions.limit,
            }    
          })
        }).catch(e=>{
          console.log(e)
        })
      }else {
        axiosPrivateCall.get(`/api/v1/demand/listDemands?skip=${fetchOptions.skip+fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then(res=>{
          const moreDemands =res.data;
          console.log(moreDemands.length)
          setDemandList([...demandList,...moreDemands])
          if(moreDemands.length < 15 || moreDemands.length === 0){
            setHasMore(false)
          }
  
          setFetchOptions((prevState)=>{
  
            return{
  
              ...prevState,
              skip: fetchOptions.skip+fetchOptions.limit,
            }
               
          })
        }).catch(e=>{
          console.log(e)
        })
  
      }
      console.log('getting more data')
    }

    const clickSortHandler =(key)=>{

      console.log(key)

      if(!isDataLoaded) return;
     
       if(key==='createdAt'){
         setFetchOptions(
           {...fetchOptions,
             sort_field: key,
             sort_type: fetchOptions.sort_type===-1 ? 1 : -1,
           }
         )

       }
   }

    const deleteDemand = (id) =>{
    
       setUpdateCallout(!updateCallout)
       setShowPopup(!showPopup);
       const deleteObj= {_id:id.DemandId}
       setDeleteID(deleteObj)  
      setUpdateId({_id:id._id})  
    }

    const downloadDemands = () => {
      setLoading(true);
      setTimeout(() => {
        axiosPrivateCall
          .get(`/api/v1/demand/downloadDemands?&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`,{
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
    

    function handleAddSubmision(id,viewId) {
      setDemandId(id);
      setSubIsModalOpen(true);
      setDemandViewId(viewId);
    };

    const assignDemandModalHandler = (_id) =>{

      setShowAssignDemandModal(true)

      setAssignDemandId(_id)

    }
    
    const handleUpdate=(showpop)=>{
      const deleteObj=updateId
    if(!showpop){
      setShowPopup(!showPopup)
     axiosPrivateCall.post(`/api/v1/demand/deleteDemand`,deleteObj).then(res=>{
               
                    setShowDeleteMessageBar(!showdeleteMessageBar)      
                    const demandArrList = demandList
                    setDemandList(demandArrList.filter(demand=>demand._id!==deleteObj._id));
                  
        }).catch(e=>{
            console.log(e)
            setUpdateCallout(false)
        })
     
     }
    }

    const addEllipsisToName = (name) => {
      // console.log(name, name.length);
  
      if(name.length > 14)
      {
        let new_name=name.substring(0,12).padEnd(15,'.')
  
        return new_name
      }
      else return name;
    };

    function skillLister (Arr) {
      let skills = '';
  
      if (Arr.length > 2)
      {
        Arr.map((data, index) => {
          if (index === 2)
          {
            skills = data.skill;
          } 
        })
  
        return skills;
  
      } else {
        return "-";
      }
    }
    
    return(
            <div className={styles.page}>
                <div className={styles.container}>
                <DeletePopup   showPopup={showPopup} setShowPopup={setShowPopup} handleUpdate={handleUpdate} deleteId={deleteId} 
                updateCallout={updateCallout} setUpdateCallout={setUpdateCallout}/>
                    {isModalOpen && <AddDemandModal
                     setMatchProfile={setMatchProfile}
                     showMessageBar={showMessageBar} 
                     isModalOpen = {isModalOpen} 
                     setIsModalOpen = {setIsModalOpen}
                    setShowMessageBar={setShowMessageBar} />}

                    {isClientTrackerOpen && <ClientTrackerPopup showPopup={true} setShowPopup={setIsClientTrackerOpen}/>}

                    {showAssignDemandmodal && <AssignDemandModal assignDemandId={assignDemandId} isModalOpen={showAssignDemandmodal}  setIsModalOpen={setShowAssignDemandModal}/>}

                  { subIsModalOpen && <AddSubmissionModal subIsModalOpen = {subIsModalOpen} 
                                  setSubIsModalOpen = {setSubIsModalOpen}
                                  showSubStauts = {showSubStauts} 
                                  setShowSubStatus = {setShowSubStatus}
                                  demandId = {demandId}   
                                  demandViewId = {demandViewId}  />}

                    <div className={styles.nav_container}>
                        <div className={styles.title}>Demand Listing</div>

                        {showMessageBar &&<div >
                            <MessageBar  onDismiss={()=>setShowMessageBar(!showMessageBar)} styles={messageBarStyles}  dismissButtonAriaLabel="Close"  messageBarType={MessageBarType.success}>
                             Demand added successfully
                            </MessageBar>
                        </div>}

                        {showSubStauts &&<div >
                            <MessageBar  onDismiss={()=>setShowSubStatus(!showSubStauts)} styles={messageBarStyles}  dismissButtonAriaLabel="Close"  messageBarType={MessageBarType.success}>
                             Submission added successfully
                            </MessageBar>
                        </div>}
                            {showdeleteMessageBar &&<div >
                            <MessageBar  onDismiss={()=>setShowDeleteMessageBar(showSubStauts)} styles={messageBarStyles}  dismissButtonAriaLabel="Close"  messageBarType={MessageBarType.success}>
                            Demand deleted successfully
                            </MessageBar>
                        </div>}    
                         
                        {matchProfile?
                        <div >
                        <MatchProfilePopup showProfilePopup={showProfilePopup} setShowProfilePopup={setShowProfilePopup} state='demand' />
                        </div>:'' }
                      

                        <div className={styles.nav_items}>
                            <Dropdown placeholder='Select Search Field' onChange={handleDropdownChange}  options={options} styles={dropdownStyles}/>
                            <SearchBox onChange={handleSearchInputChange} value={searchTerm} onSearch={(e)=>searchDemandList(e)} disabled={DropdownSearch == ""? true:false}  onClear={clearSearchBox} placeholder=" " iconProps={searchIcon} className={styles.search}  
                            showIcon/>
                            <FontIcon iconName="Breadcrumb" className={iconClass} />
                            <PrimaryButton style={{display : (demandCreator == "true") ? 'block' : 'none'}} onClick={(e)=>{  setTimeout(()=>setIsModalOpen(!isModalOpen),0); setMatch(false) }} text="Add Demand" iconProps={addIcon}  />
                            {loading ? (<Spinner size={SpinnerSize.medium} className={iconClass} />) : 
                          completed ? (<FontIcon iconName="CheckMark" className={iconClass} />) :
                          (<FontIcon iconName="Download" onClick={downloadDemands} className={iconClass} />)}

                        </div>
                    </div>

                    <div id="scrollableDiv" className={styles.table_container}>
                    <InfiniteScroll style={{overflow: 'visible', height: '100%'}} dataLength={ !match?demandList.length:matchData.length} loader={isDataLoaded &&(!match?demandList.length >= 15 :matchData.length>=15 )&& <h4>Loading...</h4>}
                            hasMore={hasMore} next={fetchMoreData}  scrollableTarget="scrollableDiv">
                    <table>
                        <thead className={styles.table_header}>
                            <tr className={styles.table_row}>
                                    {columns.map((column) => 
                                        <th onClick={()=>clickSortHandler(column.columnKey)} className={styles.table_headerContents} key={column.columnKey}>
                                            <div className={styles.table_heading}>
                                                <div>{column.label}</div>
                                                {column?.icon ? <FontIcon iconName={column.icon} className={iconClass1} /> : null}
                                            </div>
                                    </th>)}
                            </tr>
                        </thead>
                          <tbody>
    
                          {isDataLoaded && (!match?demandList.length === 0:matchData.length===0)? (
                            <tr>
                             
                              <td className={styles.table_dataContents1} colSpan="13" style={{ textAlign: "center" }}>
                              <img src={Nomatchimg} alt="image" width={"180px"} height={"200px"} />
                              </td>
                            </tr>
                         ) : (
                            <>
                             
                             {isDataLoaded && (!match?demandList.length === 0 : matchData.length===0)? (
                              <tr>
                             
                                <td className={styles.table_dataContents1} colSpan="13" style={{ textAlign: "center" }}>
                                  <img src={Nomatchimg} alt="image" width={"190px"} height={"200px"} />
                                </td>
                            </tr>
                           ) : (
                            <>
                                  {isDataLoaded && (match ?(matchData.map((demand,demand_index) => (
                                    <tr className={styles.table_row} key={demand._id}>

                                        <td onClick={()=>navigateTo(`/demand/editdemand?demand_id=${demand._id}`,{state:{demand:'demandListing'}})} className={styles.table_dataContents}>{demand.DemandId}</td>
                                        <td className={styles.table_dataContents}  
                                          onMouseEnter={()=>setHoverCallout(demand.created_by)} 
                                          onMouseLeave={()=>setHoverCallout('')}  
                                          id={`${demand.created_by?.first_name}_${demand._id}`.replaceAll(" ","_")}>

                                          {addEllipsisToName(demand.job_title)}

                                          {(demand.job_title).length >= 14  && hoverCallout=== demand.created_by && <Callout alignTargetEdge={true} 
                                            isBeakVisible={false} styles={CalloutNameStyles} 
                                            directionalHint={DirectionalHint.bottomLeftEdge} target={`#${demand.created_by?.first_name}_${demand._id}`.replaceAll(" ","_")}>
                                            {demand.job_title}
                                            </Callout>
                                          }
                                        </td>
                                        <td className={styles.table_dataContents}>{ISOdateToCustomDate(demand.createdAt)}</td>
                                        {/* <td className={styles.table_dataContents}>{demand.assigned_to.length}</td> */}
                                        <td className={styles.table_dataContents}>{demand.poc_vendor || '-'}</td>
                                        <td className={styles.table_dataContents}>{demand.vendor_name || '-'}</td>
                                        <td className={styles.table_dataContents}>{demand.client}</td>
                                        <td className={styles.table_dataContents}>{`${Math.floor(demand.minimum_experience/12)} years ${demand.minimum_experience%12} months`}</td>
                                        <td className={styles.table_dataContents}
                                          onMouseEnter={() => setHoverCallout(demand._id)}
                                          onMouseLeave={() => setHoverCallout("")}
                                          id={`primary_skill_${demand._id}`}>

                                          {addEllipsisToName(`${demand.skillset[0]?.skill? demand.skillset[0]?.skill: "-"}`)}

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

                                          {addEllipsisToName(`${demand.skillset[1]?.skill? demand.skillset[1]?.skill: "-"}`)}

                                          {demand.skillset[1]?.skill?.length >= 14 && hoverCallout === demand.DemandId && <Callout alignTargetEdge={true}
                                            isBeakVisible={false} styles={CalloutNameStyles} 
                                            directionalHint={DirectionalHint.bottomLeftEdge} target={`#secondary_skill_${demand.DemandId}`}>
                                            {demand.skillset[1]?.skill}
                                           </Callout>
                                         }
                                        </td>
                                        {/* <td className={styles.table_dataContents}>{ demand.skillset[1]?.skill ? `${Math.floor(demand.skillset[1]?.exp/12)} years ${Math.floor(demand.skillset[1]?.exp%12)} months` : '-' }</td> */}
                                         <td className={styles.table_dataContents}
                                          onMouseEnter={() => setHoverCallout((demand.DemandId)+(demand._id))}
                                          onMouseLeave={() => setHoverCallout("")}
                                          id={`other_skill_${(demand.DemandId)+(demand._id)}`}>

                                          {addEllipsisToName(`${skillLister(demand.skillset)}`)}

                                          {skillLister(demand.skillset).length >= 14 && hoverCallout === (demand.DemandId)+(demand._id) && <Callout alignTargetEdge={true}
                                            isBeakVisible={false} styles={CalloutNameStyles} 
                                            directionalHint={DirectionalHint.bottomLeftEdge} target={`#other_skill_${(demand.DemandId)+(demand._id)}`}>
                                            {skillLister(demand.skillset)}
                                            </Callout>
                                        }
                                       </td>
                              
                                        {/* <td className={styles.table_dataContents}>{demand.skillset[2]?.skill ? `${Math.floor(demand.skillset[2]?.exp/12)} years ${Math.floor(demand.skillset[2]?.exp%12)} months` : '-'}</td> */}
                                        <td className={styles.table_dataContents}>{demand.created_by?.first_name +" "+demand.created_by?.last_name}</td>
                                        <td className={styles.table_dataContents}>
                                          <div id={`Dp${demand._id}`} onClick={()=>{setRowId(demand._id); setUpdateCallout(true)}} className={styles.moreOptions}>
                                               
                                              <FontIcon iconName='MoreVertical' className={iconClass1}/>
                                              {rowId === demand._id && 
                                            updateCallout && <Callout gapSpace={0} target={`#Dp${demand._id}`} onDismiss={()=>setRowId('')}
                                              isBeakVisible={false} directionalHint={DirectionalHint.bottomCenter}>
                                                <div style={{display:'flex', flexDirection:'column'}}>
                                                  <DefaultButton onClick={()=>navigateTo(`/demand/editdemand?demand_id=${demand._id}`,{state:{demand:'demandListing'}})}  text="View/Edit Demand" styles={calloutBtnStyles}/>
                                                  {/* <DefaultButton text="Submission List" styles={calloutBtnStyles}/> */}
                                                  <DefaultButton onClick= {() => {handleAddSubmision(demand._id,demand.DemandId)}}  text="Add Submission" styles={calloutBtnStyles} />
                                                  <DefaultButton text='View Submissions' onClick={()=>navigateTo(`/submission/managesubmissions?demand_id=${demand._id}`)} styles={calloutBtnStyles} />
                                                  <DefaultButton onClick={()=>deleteDemand(demand)}  text="Delete Demand" styles={calloutBtnStyles}/>
                                                  <DefaultButton onClick={()=>assignDemandModalHandler(demand._id)}  text={"Assign Demand"}styles={calloutBtnStyles}/>
                                                </div>
                                              </Callout>
                                               }
                                          </div> 
                                      </td>
                                    </tr>))):
                                   demandList.map((demand,demand_index) => (
                                    <tr className={styles.table_row} key={demand._id}>

                                        <td onClick={()=>navigateTo(`/demand/editdemand?demand_id=${demand._id}`,{state:{demand:'demandListing'}})} className={styles.table_dataContents}>{demand.DemandId}</td>
                                        <td className={styles.table_dataContents}  
                                          onMouseEnter={()=>setHoverCallout(demand.created_by)} 
                                          onMouseLeave={()=>setHoverCallout('')}  
                                          id={`${demand.created_by?.first_name}_${demand._id}`.replaceAll(" ","_")}>

                                          {addEllipsisToName(demand.job_title)}

                                          {(demand.job_title).length >= 14  && hoverCallout=== demand.created_by && <Callout alignTargetEdge={true} 
                                            isBeakVisible={false} styles={CalloutNameStyles} 
                                            directionalHint={DirectionalHint.bottomLeftEdge} target={`#${demand.created_by?.first_name}_${demand._id}`.replaceAll(" ","_")}>
                                            {demand.job_title}
                                            </Callout>
                                          }
                                        </td>
                                        <td className={styles.table_dataContents}>{ISOdateToCustomDate(demand.createdAt)}</td>
                                        {/* <td className={styles.table_dataContents}>{demand.assigned_to.length}</td> */}
                                        <td className={styles.table_dataContents}>{demand.poc_vendor || '-'}</td>
                                        <td className={styles.table_dataContents}>{demand.vendor_name || '-'}</td>
                                        <td className={styles.table_dataContents}>{demand.client}</td>
                                        <td className={styles.table_dataContents}>{`${Math.floor(demand.minimum_experience/12)} years ${demand.minimum_experience%12} months`}</td>
                                        <td className={styles.table_dataContents}
                                          onMouseEnter={() => setHoverCallout(demand._id)}
                                          onMouseLeave={() => setHoverCallout("")}
                                          id={`primary_skill_${demand._id}`}>

                                          {addEllipsisToName(`${demand.skillset[0]?.skill? demand.skillset[0]?.skill: "-"}`)}

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

                                          {addEllipsisToName(`${demand.skillset[1]?.skill? demand.skillset[1]?.skill: "-"}`)}

                                          {demand.skillset[1]?.skill?.length >= 14 && hoverCallout === demand.DemandId && <Callout alignTargetEdge={true}
                                            isBeakVisible={false} styles={CalloutNameStyles} 
                                            directionalHint={DirectionalHint.bottomLeftEdge} target={`#secondary_skill_${demand.DemandId}`}>
                                            {demand.skillset[1]?.skill}
                                           </Callout>
                                         }
                                        </td>
                                        {/* <td className={styles.table_dataContents}>{ demand.skillset[1]?.skill ? `${Math.floor(demand.skillset[1]?.exp/12)} years ${Math.floor(demand.skillset[1]?.exp%12)} months` : '-' }</td> */}
                                         <td className={styles.table_dataContents}
                                          onMouseEnter={() => setHoverCallout((demand.DemandId)+(demand._id))}
                                          onMouseLeave={() => setHoverCallout("")}
                                          id={`other_skill_${(demand.DemandId)+(demand._id)}`}>

                                          {addEllipsisToName(`${skillLister(demand.skillset)}`)}

                                          {skillLister(demand.skillset).length >= 14 && hoverCallout === (demand.DemandId)+(demand._id) && <Callout alignTargetEdge={true}
                                            isBeakVisible={false} styles={CalloutNameStyles} 
                                            directionalHint={DirectionalHint.bottomLeftEdge} target={`#other_skill_${(demand.DemandId)+(demand._id)}`}>
                                            {skillLister(demand.skillset)}
                                            </Callout>
                                        }
                                       </td>
                                        {/* <td className={styles.table_dataContents}>{demand.skillset[2]?.skill ? `${Math.floor(demand.skillset[2]?.exp/12)} years ${Math.floor(demand.skillset[2]?.exp%12)} months` : '-'}</td> */}
                                        <td className={styles.table_dataContents}>{demand.created_by?.first_name +" "+demand.created_by?.last_name}</td>
                                        <td className={styles.table_dataContents}>
                                          <div id={`Dp${demand._id}`} onClick={()=>{setRowId(demand._id); setUpdateCallout(true)}} className={styles.moreOptions}>
                                               
                                              <FontIcon iconName='MoreVertical' className={iconClass1}/>
                                              {rowId === demand._id && 
                                            updateCallout && <Callout gapSpace={0} target={`#Dp${demand._id}`} onDismiss={()=>setRowId('')}
                                              isBeakVisible={false} directionalHint={DirectionalHint.bottomCenter}>
                                                <div style={{display:'flex', flexDirection:'column'}}>
                                                  <DefaultButton onClick={()=>navigateTo(`/demand/editdemand?demand_id=${demand._id}`,{state:{demand:'demandListing'}})}  text="View/Edit Demand" styles={calloutBtnStyles}/>
                                                  {/* <DefaultButton text="Submission List" styles={calloutBtnStyles}/> */}
                                                  <DefaultButton onClick= {() => {handleAddSubmision(demand._id,demand.DemandId)}}  text="Add Submission" styles={calloutBtnStyles} />
                                                  <DefaultButton text='View Submissions' onClick={()=>navigateTo(`/submission/managesubmissions?demand_id=${demand._id}`)} styles={calloutBtnStyles} />
                                                  <DefaultButton onClick={()=>deleteDemand(demand)}  text="Delete Demand" styles={calloutBtnStyles}/>
                                                  <DefaultButton onClick={()=>assignDemandModalHandler(demand._id)}  text={"Assign Demand"}styles={calloutBtnStyles}/>
                                                </div>
                                              </Callout>
                                               }
                                          </div> 
                                      </td>
                                    </tr>)))}
                                    </>
                                )}
                                    { !isDataLoaded && items.map(employee => (
                                  <tr className={styles.table_row} >
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}><Shimmer/></td>
                                      <td className={styles.table_dataContents}>
                                          <div className={styles.moreOptions} >
                                              <FontIcon iconName='MoreVertical' className={iconClass1}/>
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

export default DemandListing;
