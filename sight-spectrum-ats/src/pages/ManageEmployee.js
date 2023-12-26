import React, { useEffect, useState, useId } from "react";
import styles from "./ManageEmployee.module.css"
import {PrimaryButton, SearchBox, FontIcon, mergeStyles,mergeStyleSets,Dropdown} from '@fluentui/react';
import AddEmployeeModal from "./AddEmployeeModal1";
import { DefaultButton,Callout,DirectionalHint} from '@fluentui/react';
import { Shimmer} from '@fluentui/react';
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosPrivateCall } from "../constants";
import {DeletePopup}  from "../components/DeletePopup"; 
import Nomatchimg from "../assets/no.png"
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
	root: {width:'185px',},
});

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
  { key: 'employee_id', text: 'Employee Id' },
  { key: 'email', text: 'Email' },
  { key: 'mobile_number', text: 'Mobile' },
  { key: 'first_name', text: 'Employee Name' },
];


let items = Array(4).fill(null);

function EmployeeListing(props) {
    const [showPopup,setShowPopup]=useState(false)
    const[ updateId,setUpdateId]=useState('')
    const [deleteId,setDeleteID]=useState('')
    const [isSubmitDel, setSubmitDel] = useState(false);
    const [ isModalOpen , setIsModalOpen] = useState(false);
    const [ isSubmitSuccess, setSubmitSuccess] = useState(false);
    const [employeeList,setEmployeeList] = useState('');
    const {showAddEmployee} = props;
    const [isDataLoaded, setIsDataLoaded]= useState(false);
    const [rowId,setRowId] = useState('');
		const [hoverCallout,setHoverCallout]= useState('');
    const [updateCallout,setUpdateCallout] = useState(false);
    const[isUserSearching,setIsUserSearching] = useState(false)
    const [fetchOptions,setFetchOptions] = useState({
      skip: 0,
      limit: 15,
      sort_field:'updatedAt',
      sort_type:-1,
      search_field: ''
    })
   const [loading, setLoading] = useState(false);
   const [completed, setCompleted] = useState(false);

    const [hasMore,setHasMore] = useState(true)

    const navigateTo = useNavigate();

    const columns = [
      {
      columnKey: 'Status',
      label: " "
    },
      {
      columnKey: 'Employee ID',
      label: 'Employee ID',
    }, {
      columnKey: 'first_name',
      label: 'Full Name',
      icon: `${fetchOptions.sort_field=== 'createdAt' ? 'Sort' :  fetchOptions.sort_type === 1 ?  'SortUp' : 'SortDown' }`
    }, {
      columnKey: 'Role',
      label: 'Role',
    }, {
      columnKey: 'Job Role',
      label: 'Job Role',
    },
    //  {
    //   columnKey: 'Lead',
    //   label: 'Lead',
    // },{
    //   columnKey: 'Manager',
    //   label: 'Manager'
    // },
    
    {
      columnKey: 'Mobile',
      label: 'Mobile'
    },{
      columnKey: 'email',
      label: 'Email ID'
    },{
      columnKey: 'Joining Date',
      label: 'Joining Date',
    },{
      columnKey: 'createdAt',
      icon: `${fetchOptions.sort_field=== 'createdAt'  && fetchOptions.sort_type === 1 ?  'SortUp' : 'SortDown' }`,
      label: 'Registered Date',
    },{
      columnKey: 'Updated On',
      label: 'Updated On',
    },{
      columnKey: 'More Options',
      label: ' '
    }];

    
    useEffect(()=>{
      getEmployeeData()
      setHasMore(true)
      setFetchOptions({...fetchOptions,skip: 0,limit: 15})
   
    },[isModalOpen,fetchOptions.sort_field,fetchOptions.sort_type])

  

    


    const getEmployeeData = () =>{
       setIsDataLoaded(false)
       axiosPrivateCall.get(`/api/v1/employee/listEmployee?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`).then(res=>{
        console.log(res.data);
        setEmployeeList(res.data);
        setIsDataLoaded(true)
      }).catch(e=>{
        console.log(e)
      })
  
    }
    const [DropdownSearch, setDropdownSearch] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [SearchData, setSearchData] = useState('')
    const [SplitedData, setSplitedData] = useState('')

    const handleDropdownChange = (e,item)=>{
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
        case 'employee_id':
          if (value && !/^[0-9a-zA-Z]+$/.test(value)) {
            return;
          }
          break;
        case 'email':
          if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return;
          }
          break;
        case 'mobile_number':
          if (value && !/^[0-9]+$/.test(value)) {
            return;
          }
          break;
        case 'first_name':
          if (value && !/^[a-zA-Z\s]+$/.test(value)) {
            return;
          }
          break;
        default:
          break;
      }
      
      setSearchTerm(value);
    };   

    const searchEmployeeList = (e) =>{

      const searchValue =  e
      if(searchValue === ''){
        getEmployeeData();
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
       axiosPrivateCall.get(`/api/v1/employee/searchEmployee?field_name=${DropdownSearch}&field_value=${searchValue}`)
       .then(res=>{
        console.log(res)
        console.log(res.data);
        setSearchData(res.data)
        setSplitedData(15)
        setHasMore(true)
        setEmployeeList(res.data.slice(0,15));
        setIsDataLoaded(true)
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
      getEmployeeData();
      setHasMore(true)
    }

    const fetchMoreData =()=>{
      if(isUserSearching){
        const moreEmployees = SearchData.slice(SplitedData, SplitedData + 15)
        setSplitedData(SplitedData + 15)
        setEmployeeList([...employeeList, ...moreEmployees])
        if(SplitedData >= SearchData.length){
          setHasMore(false)
        }
      }
      else{

        axiosPrivateCall.get(`/api/v1/employee/listEmployee?skip=${fetchOptions.skip+fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then(res=>{
          const moreEmployees =res.data;
          console.log(moreEmployees.length)
          setEmployeeList([...employeeList,...moreEmployees])
          if(moreEmployees.length < 15 || moreEmployees.length === 0){
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
			
				if(key==='first_name'){
					setFetchOptions(
						{...fetchOptions,
							sort_field: key,
							sort_type: fetchOptions.sort_type=== -1 ? 1 : -1,
						}
					)
				}
       console.log(fetchOptions)
        if(key==='createdAt'){
          console.log(key)
					setFetchOptions(
						{...fetchOptions,
							sort_field: key,
							sort_type: fetchOptions.sort_type===-1 ? 1 : -1,
						}
					)

				}
		}

  

    const ISOdateToCustomDate =(value) =>{
      const dateFormat = new Date(value);
      let year = dateFormat.getFullYear();
      let month = dateFormat.getMonth()+1;
      let date = dateFormat.getDate();

      if (date < 10) {
        date = '0' + date;
      }
      if (month < 10) {
        month = '0' + month;
      }
      return date + '/' + month + '/' + year;


    }


		const addEllipsisToName =(name) =>{
      const upper_convert = name.charAt(0).toUpperCase() + name.slice(1);

			if(name.length > 14){
				let new_name=name.substring(0,13).padEnd(16,'.')
        let convert_Upper=new_name.charAt(0).toUpperCase() + new_name.slice(1);
				return convert_Upper
			}
			else return upper_convert
		}

    const updateEmployee =(_id,name,value,index)=>{
       const updateObj= {}
      if(name==='status'){
        updateObj['_id']= _id

        if(value==='Active'){
          updateObj[name] = 'Inactive'
        }
        else{
          updateObj[name] = 'Active'
        }

        console.log(updateObj,_id)
        axiosPrivateCall.post('/api/v1/employee/updateEmployee',updateObj).then(res=>{
         const employeeArrList = employeeList;
         employeeArrList[index][name] = updateObj[name]
         setEmployeeList(employeeArrList)
         setUpdateCallout(false)
        
      }).catch(e=>{
        console.log(e)
        setUpdateCallout(false)
      })
      }
    }


    const deleteEmployee =(id)=>{
      setUpdateCallout(!updateCallout)
      setShowPopup(!showPopup);
      const deleteObj= {_id:id.employee_id}
      setDeleteID(deleteObj)  
      setUpdateId({_id:id._id})  
    }

    const downloadEmployees = () => {
      setLoading(true);
      axiosPrivateCall
        .get(`/api/v1/employee/downloadEmployee?skip=${0}&limit=${employeeList.length}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`, {
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
    };
    
    
    const handleUpdate=(showpop)=>{
      const deleteObj=updateId
     if(!showpop){
         setShowPopup(!showPopup)
      axiosPrivateCall.post('/api/v1/employee/deleteEmployee',deleteObj).then(res=>{
        setSubmitDel(!isSubmitDel) 
        const employeeArrList = employeeList;
        setEmployeeList(employeeArrList.filter(employee=>employee._id!==deleteObj._id))

      }).catch(e=>{
        console.log(e)
        setUpdateCallout(false)
      })
    }
  } 

    return(
            <div className={styles.page}>
                <div className={styles.container}>
                <DeletePopup   showPopup={showPopup} setShowPopup={setShowPopup} handleUpdate={handleUpdate} deleteId={deleteId} 
                updateCallout={updateCallout} setUpdateCallout={setUpdateCallout}/>
                { isModalOpen && <AddEmployeeModal 
                isModalOpen = {isModalOpen} 
                setIsModalOpen = {setIsModalOpen}
                isSubmitSuccess ={isSubmitSuccess}
                setSubmitSuccess={setSubmitSuccess}/>}
                  <div className={styles.nav_container}>
                      <div className={styles.title}>Employee Details</div>

                      {isSubmitSuccess && (<div className={styles.toast}>
                          <div className={styles.toast_title}>
                              <FontIcon iconName="StatusCircleCheckmark" className={iconClassToast} />
                              <div>Employee Added Successfully!</div>
                          </div>

                          <FontIcon iconName="StatusCircleErrorX" className={iconClass} onClick={() => setSubmitSuccess(false)} />
                          </div>)
                      }
                   
                      {isSubmitDel && (<div className={styles.toast}>
                          <div className={styles.toast_title}>
                              <FontIcon iconName="StatusCircleCheckmark" className={iconClassToast} />
                              <div>Employee Deleted Successfully!</div>
                          </div>

                          <FontIcon iconName="StatusCircleErrorX" className={iconClass} onClick={() => setSubmitDel(false)} />
                          </div>)
                      }
                      

                      <div className={styles.nav_items}>
                          <Dropdown placeholder='Select Search Field' onChange={handleDropdownChange}  options={options} styles={dropdownStyles}/>
                          <SearchBox onChange={handleSearchInputChange} value={searchTerm} onSearch={(e)=>searchEmployeeList(e)} disabled={DropdownSearch == ""? true:false} onClear={clearSearchBox} placeholder=" " iconProps={searchIcon} className={styles.search} styles={searchFieldStyles}  
                          showIcon/>
                          <FontIcon iconName="Breadcrumb" className={iconClass} />
                          <PrimaryButton text="Add Employee" iconProps={addIcon} 
                          onClick={() => {setIsModalOpen(!isModalOpen); setSubmitSuccess(false);}} />
                          {loading ? (<Spinner size={SpinnerSize.medium} className={iconClass}/>) : 
                          completed ? (<FontIcon iconName="CheckMark" className={iconClass} />) :
                          (<FontIcon iconName="Download" onClick={downloadEmployees} className={iconClass} />)}
                      </div>
                  </div>

                  <div id="scrollableDiv" className={styles.table_container}>
                      <InfiniteScroll style={{overflow: 'visible', height: '100%'}} dataLength={employeeList.length} loader={isDataLoaded && employeeList.length>= 15 && <h4>Loading...</h4>}
                            hasMore={hasMore} next={fetchMoreData}  scrollableTarget="scrollableDiv">
                      <table>
                          <thead className={styles.table_header}>
                            <tr className={styles.table_row}>
                                    {columns.map((column) => 
                                        <th onClick={()=>clickSortHandler(column.columnKey)} className={styles.table_headerContents} key={column.columnKey}>
                                            <div 
                                              className={styles.table_heading}>
                                                <div>{column.label}</div>
                                                {column?.icon ? <FontIcon iconName={column.icon} className={iconClass1} /> : null}
                                            </div>
                                    </th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {isDataLoaded && employeeList.length === 0 ? (
                            <tr>
                              <td className={styles.table_dataContents1} colSpan="13" style={{ textAlign: "center" }}>
                              <img src={Nomatchimg} alt="image" width={"180px"} height={"200px"} />
                              </td>
                            </tr>
                         ) : (
                            <>
                             {isDataLoaded && employeeList.length === 0 ? (
                              <tr>
                                <td className={styles.table_dataContents1} colSpan="13" style={{ textAlign: "center" }}>
                                  <img src={Nomatchimg} alt="image" width={"190px"} height={"200px"} />
                                </td>
                            </tr>
                           ) : (
                            <>
                              {isDataLoaded && employeeList.map((employee,employee_index) => (
                              
                                  <tr  className={styles.table_row} key={employee._id}>
                                      <td className={styles.table_dataContents}><div className={employee.status === 'Active' ? styles.status : styles.status_inactive} ></div></td>
                                      <td onClick={()=>navigateTo(`/employee/editemployee?employee_id=${employee._id}`)} className={styles.table_dataContents}>{employee.employee_id}</td>
                                        <td onMouseEnter={()=>setHoverCallout(employee._id)} onMouseLeave={()=>setHoverCallout('')}  
																				 id={`ME${employee.first_name}${employee._id}`.replaceAll(" ","_")}  className={`${styles.table_dataContents} `}>
																					{addEllipsisToName(`${employee.first_name} ${employee.last_name}`)}
																					{
																					(employee.first_name+employee.last_name).length >= 14 && hoverCallout=== employee._id && <Callout alignTargetEdge={true} bounds={e => {console.log('log',e)}}  isBeakVisible={false} styles={CalloutNameStyles} directionalHint={DirectionalHint.bottomLeftEdge} target={`#ME${employee.first_name}${employee._id}`.replaceAll(" ","_")}>
																						{`${employee.first_name} ${employee.last_name}`}
																					</Callout>
																				}
						                          </td>
                                      <td className={styles.table_dataContents}>{employee.role}</td>
                                      <td className={styles.table_dataContents}>{employee.job_role}</td>
                                      {/* <td className={styles.table_dataContents}>{employee.reports_to.name}</td> */}
                                      {/* <td className={styles.table_dataContents}>test</td>
                                      <td className={styles.table_dataContents}>test</td> */}
                                      <td className={styles.table_dataContents}>{employee.mobile_number}</td>
                                      <td className={styles.table_dataContents}>{employee.email}</td>
                                      <td className={styles.table_dataContents}>{ISOdateToCustomDate(employee.date_of_joining)}</td>
                                      <td className={styles.table_dataContents}>{ISOdateToCustomDate(employee.createdAt)}</td>
                                      <td className={styles.table_dataContents}>{ISOdateToCustomDate(employee.updatedAt)}</td>
                                      <td className={styles.table_dataContents}>
                                          <div id={`FO_${employee._id}`} onClick={()=>{setRowId(employee._id);setUpdateCallout(true)}} className={styles.moreOptions}>
                                               <FontIcon iconName='MoreVertical' className={iconClass1}/>
                                                  {rowId === employee._id && (
                                                 updateCallout && <Callout gapSpace={0} target={`#FO_${employee._id}`} onDismiss={()=>setRowId('')}
                                              isBeakVisible={false} directionalHint={DirectionalHint.bottomRightEdge}>
                                                <div style={{display:'flex', flexDirection:'column'}}>
                                                  <DefaultButton text="Edit" onClick={()=>navigateTo(`/employee/editemployee?employee_id=${employee._id}`)}  styles={calloutBtnStyles}/>
                                                  <DefaultButton onClick={()=>updateEmployee(employee._id,'status',employee.status,employee_index)} text={employee.status === 'Active' ? 'Mark Inactive' : 'Mark Active' } styles={calloutBtnStyles}/>
                                                  <DefaultButton onClick={()=>deleteEmployee(employee)} text="Delete" styles={calloutBtnStyles}/>
                                                </div>
                                              </Callout>
                                              )}
                                          </div>
                                      </td>
                                  </tr>))}
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

export default EmployeeListing;







