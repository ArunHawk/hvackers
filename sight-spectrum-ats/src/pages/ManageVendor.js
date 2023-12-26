import React, { useEffect, useState, useId } from "react";
import styles from "./ManageEmployee.module.css"
import {PrimaryButton, SearchBox, FontIcon, mergeStyles,mergeStyleSets} from '@fluentui/react';
import AddVendorModal from "./AddVendorModal";
import { DefaultButton,Callout,DirectionalHint} from '@fluentui/react';
import { Shimmer} from '@fluentui/react';
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosPrivateCall } from "../constants";


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




let items = Array(4).fill(null);


  

function VendorListing(props) {

    const [ isModalOpen , setIsModalOpen] = useState(false);
    const [ isSubmitSuccess, setSubmitSuccess] = useState(false);
    const [vendorList,setVendorList] = useState('');
    const {showAddVendor} = props;
    const [isDataLoaded, setIsDataLoaded]= useState(false);
    const [rowId,setRowId] = useState('');
		const [hoverCallout,setHoverCallout]= useState('');
    const [updateCallout,setUpdateCallout] = useState(false);
    const[isUserSearching,setIsUserSearching] = useState(false)
    const [fetchOptions,setFetchOptions] = useState({
      skip: 0,
      limit: 15,
      sort_field:'createdAt',
      sort_type:-1,
      search_field: ''
    })

    const [hasMore,setHasMore] = useState(true)

    const navigateTo = useNavigate();

    const columns = [
    {
      columnKey: 'company_name',
      label: 'Company Name',
      icon: `${fetchOptions.sort_field=== 'company_name' && fetchOptions.sort_type === 1 ?  'SortUp' : 'SortDown' }`
    }, {
      columnKey: 'skill_name',
      label: 'Skill Name',
    }, {
      columnKey: 'company_website',
      label: 'Company Website',
    }, {
      columnKey: 'linkedin',
      label: 'LinkedIn URL'
    },{
      columnKey: 'email',
      label: 'Email ID'
    }, {
      columnKey: 'mobile',
      label: 'Mobile',
    }, {
      columnKey: 'head_count',
      label: 'Head Count',
    }, {
      columnKey: 'region',
      label: 'Region',
    }, {
      columnKey: 'Location',
      label: 'location',
    },{
      columnKey: 'More Options',
      label: ' '
    }];

    
    useEffect(()=>{
      getVendorData()
      setHasMore(true)
      setFetchOptions({...fetchOptions,skip: 0,limit: 15})
   
    },[isModalOpen,fetchOptions.sort_field,fetchOptions.sort_type])

  

    


    const getVendorData = () =>{
			
       setIsDataLoaded(false)
       axiosPrivateCall.get(`/api/v1/vendor/listVendors?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`).then(res=>{
        console.log(res.data);
        setVendorList(res.data);
        setIsDataLoaded(true)
     
        
      }).catch(e=>{
        console.log(e)
      })
  
    }


    const searchVendorList = (e) =>{

      const searchValue =  e

      if(searchValue === ''){
        getVendorData();
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
       axiosPrivateCall.get(`/api/v1/vendor/searchVendors?field_name=skill_name&field_value=${searchValue}`)
       .then(res=>{
        console.log(res)
        console.log(res.data);
        setVendorList(res.data);
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
    }

    const fetchMoreData =()=>{


      if(isUserSearching){
        axiosPrivateCall.get(`/api/v1/vendor/searchVendor?skip=${fetchOptions.skip+fetchOptions.limit}&limit=${fetchOptions.limit}&field_name=email&field_value=${fetchOptions.search_field}`)
      .then(res=>{
        const moreVendors =res.data;
  

			
        setVendorList([...vendorList,...moreVendors])
        if(moreVendors.length < 15 || moreVendors.length === 0){
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

      else{

        axiosPrivateCall.get(`/api/v1/vendor/listVendors?skip=${fetchOptions.skip+fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then(res=>{
          const moreVendors =res.data;
          console.log(moreVendors.length)
  
        
          setVendorList([...vendorList,...moreVendors])
          if(moreVendors.length < 15 || moreVendors.length === 0){
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
			
				if(key==='company_name'){
					setFetchOptions(
						{...fetchOptions,
							sort_field: key,
							sort_type: fetchOptions.sort_type=== -1 ? 1 : -1,
						}
					)

				}

        if(key==='createdAt'){
					setFetchOptions(
						{...fetchOptions,
							sort_field: key,
							sort_type: fetchOptions.sort_type===-1 ? 1 : -1,
						}
					)

				}
		}

  


		const addEllipsisToName =(name) =>{
  
			if(name.length > 13){
				let new_name=name.substring(0,13).padEnd(16,'.')
        


				return new_name
			}
			else return name

		}

    


    const deleteVendor =(_id)=>{
      const deleteObj= {"_id":_id}
      axiosPrivateCall.post('/api/v1/vendor/deleteVendor',deleteObj).then(res=>{
        const vendorArrList = vendorList;
        setVendorList(vendorArrList.filter(vendor=>vendor._id!==_id))

      }).catch(e=>{
        console.log(e)
        setUpdateCallout(false)
      })

    }

    const downloadVendors = ()=>{

      // axiosPrivateCall.get(`/api/v1/vendor/downloadVendor?&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`,{
      //   responseType: 'blob',
      // })
      // .then(response=>{
      //     const url = window.URL.createObjectURL(new Blob([response.data]));
      //     const link = document.createElement('a');
      //     link.href = url;
      //     link.setAttribute('download', `${Date.now()}.xlsx`);
      //     document.body.appendChild(link);
      //     link.click();

      // }).catch(e=> console.log(e))
    }
    
      
    return(
            <div className={styles.page}>
                <div className={styles.container}>
                { isModalOpen && <AddVendorModal 
                isModalOpen = {isModalOpen} 
                setIsModalOpen = {setIsModalOpen}
                isSubmitSuccess ={isSubmitSuccess}
                setSubmitSuccess={setSubmitSuccess}/>}

                  

                  <div className={styles.nav_container}>
                      <div className={styles.title}>Manage Vendors</div>

                      {isSubmitSuccess && (<div className={styles.toast}>
                          <div className={styles.toast_title}>
                              <FontIcon iconName="StatusCircleCheckmark" className={iconClassToast} />
                              <div>Vendor Added Successfully!</div>
                          </div>

                          <FontIcon iconName="StatusCircleErrorX" className={iconClass} onClick={() => setSubmitSuccess(false)} />
                          </div>)
                      }

                      <div className={styles.nav_items}>
                          <SearchBox onSearch={(e)=>searchVendorList(e)} onClear={clearSearchBox} placeholder="Skill Name" iconProps={searchIcon} className={styles.search} styles={searchFieldStyles}  />
                          <FontIcon iconName="Breadcrumb" className={iconClass} />
                          <PrimaryButton text="Add Vendor" iconProps={addIcon} 
                          onClick={() => {setIsModalOpen(!isModalOpen); setSubmitSuccess(false);}} />
                          <FontIcon onClick={downloadVendors} iconName="Download" className={iconClass} />
                      </div>
                  </div>

                  <div id="scrollableDiv" className={styles.table_container}>
                      <InfiniteScroll style={{overflow: 'visible', height: '100%'}} dataLength={vendorList.length} loader={isDataLoaded && vendorList.length>= 15 && <h4>Loading...</h4>}
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
                          
                              {isDataLoaded && vendorList?.map((vendor,vendor_index) => 
                                  <tr>
                                    
                                      <td onMouseEnter={()=>setHoverCallout(vendor._id)} onMouseLeave={()=>setHoverCallout('')}  
                                          id={`ME${vendor._id}`}  
                                          className={`${styles.table_dataContents} `}>
                                
                                            {addEllipsisToName(`${vendor.company_name} `)}
                                                                        
                                            {(vendor.company_name).length >= 13  && hoverCallout=== vendor._id && 
                                                <Callout alignTargetEdge={true} 
                                                            bounds={e => {console.log('log',e)}}  
                                                            isBeakVisible={false} styles={CalloutNameStyles} 
                                                            directionalHint={DirectionalHint.bottomLeftEdge} 
                                                            target={`#ME${vendor._id}`}>
                                                        
                                                        {`${vendor.company_name}`}
                                                </Callout>
                                            }                                        
                                      </td>
                                      <td className={styles.table_dataContents}>{vendor.skill_name}</td>
                                      <td className={styles.table_dataContents}>{vendor.people[0]?.website}</td>
                                      <td className={styles.table_dataContents}>{vendor.people[0]?.linkedin}</td>
                                      <td className={styles.table_dataContents}>{vendor.people[0]?.primary_email}</td>
                                      <td className={styles.table_dataContents}>{vendor.people[0]?.primary_mobile}</td>
                                      <td className={styles.table_dataContents}>{vendor.head_count}</td>
                                      <td className={styles.table_dataContents}>{vendor.region}</td>
                                      <td className={styles.table_dataContents}>{vendor.location}</td>
                                      
                                      
                                      <td className={styles.table_dataContents}>
                                        <div id={`${vendor.pan_number}${vendor._id}`} 
                                            onClick={()=>{setRowId(vendor._id); setUpdateCallout(true)}} 
                                            className={styles.moreOptions}>
                                            <FontIcon iconName='MoreVertical' className={iconClass1}/>
                                            { rowId === vendor._id && updateCallout && <Callout gapSpace={0} 
                                                                        target={`#${vendor.pan_number}${vendor._id}`} onDismiss={()=>setRowId('')}
                                                                        isBeakVisible={false} 
                                                                        directionalHint={DirectionalHint.bottomCenter}>

                                                                        <div style={{display:'flex', flexDirection:'column'}}>
                                                                            <DefaultButton text="Edit" onClick={()=>navigateTo(`/masterlist/editvendor?vendor_id=${vendor._id}`)}  styles={calloutBtnStyles}/>
                                                                            <DefaultButton onClick={()=>deleteVendor(vendor._id)} text="Delete" styles={calloutBtnStyles}/>
                                                                        </div>
                                                                    </Callout>
                                            }
                                        </div>
                                      </td>
                                  </tr>)}

                                { !isDataLoaded && items.map(vendor => 
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
                                
                                <td className={styles.table_dataContents}>
                                    <div className={styles.moreOptions} >
        
                                        <FontIcon iconName='MoreVertical' className={iconClass1}/>
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

export default VendorListing;



// {
//   company_name: 'random',
//   skill_name: 'random',
//   head_count: 'random',
//   location: 'random',
//   basic_details:[{
//     contact_person: 'random',
// 		designation:'random',
// 		website:'random',
// 		linkedin:'random',
// 		primary_email:'random',
// 		alternate_email:'random',
// 		primary_mobile:'random',
// 		alternate_mobile:'random',
//   },],
// }



