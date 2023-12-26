import React, { useEffect, useState, useId } from "react";
import styles from "./ManageEmployee.module.css"
import {PrimaryButton, SearchBox, FontIcon, mergeStyles,mergeStyleSets} from '@fluentui/react';
import AddSkillModal from "./AddSkillModal";
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



// let data = '[{"_id":"6369351bea7b50c2d86a6324","first_name":"first_name_test","last_name":"last_name_test","email":"testing@123.com","mobile_number":"9876543210","date_of_hire":"12/09/2020","date_of_joining":"18/09/2022","date_of_birth":"23/09/1997","gender":"male","address_line_1":"adresss_1","address_line_2":"address 2","city":"pondy","pincode":"605002","pan_number":"CFTR2345","aadhaar_number":"123458NF84203F23F3","password_hash":"$2b$10$DyHYHgvccS0HTBB94zQz/eOTz18675hjrYcYX5C23JA/4isEaUC6G","role":"founder","status":"ACTIVE","job_role":"CEO","location":"BALI","reports_to":{"_id":"6369351bea7b50c2d86a6324","name":"bruce"},"is_deleted":false,"createdAt":"2022-11-07T16:40:59.864Z","updatedAt":"2022-11-07T16:40:59.864Z","__v":0},{"_id":"6369f95011496caeb00c580e","first_name":"first_name_test","last_name":"last_name_test","email":"arijackson@123.com","mobile_number":"9876543210","date_of_hire":"12/09/2020","date_of_joining":"18/09/2022","date_of_birth":"23/09/1997","gender":"male","address_line_1":"adresss_1","address_line_2":"address 2","city":"pondy","pincode":"605002","pan_number":"CFTR2345","aadhaar_number":"123458NF84203F23F3","password_hash":"$2b$10$bMd4O0WFBM4lPkiD2jcH8ORpiGeAfxMIv/tnPmx1YOPZW2pbwqCRm","role":"founder","status":"ACTIVE","job_role":"CEO","location":"BALI","reports_to":{"_id":"6369351bea7b50c2d86a6324","name":"bruce"},"is_deleted":false,"createdAt":"2022-11-08T06:38:08.740Z","updatedAt":"2022-11-08T06:38:08.740Z","__v":0},{"_id":"636a117362c3cb62caf8df6b","first_name":"first_name_test","last_name":"last_name_test","email":"arijackson@123.com","mobile_number":"9876543210","date_of_hire":"12/09/2020","date_of_joining":"18/09/2022","date_of_birth":"23/09/1997","gender":"male","address_line_1":"adresss_1","address_line_2":"address 2","city":"pondy","pincode":"605002","pan_number":"CFTR2345","aadhaar_number":"123458NF84203F23F3","password_hash":"$2b$10$IirM1dltlYHyaNy/.dQzIOFhoKaJDGn/1q3r5IYaQFpM2BtC.phxy","role":"founder","status":"ACTIVE","job_role":"CEO","location":"BALI","reports_to":{"_id":"6369351bea7b50c2d86a6324","name":"bruce"},"is_deleted":false,"createdAt":"2022-11-08T08:21:07.054Z","updatedAt":"2022-11-08T08:21:07.054Z","__v":0}]';
// let items = JSON.parse(data);

let items = Array(4).fill(null);


  

function SkillListing(props) {

    const [ isModalOpen , setIsModalOpen] = useState(false);
    const [ isSubmitSuccess, setSubmitSuccess] = useState(false);
    const [skillList,setSkillList] = useState('');
    const {showAddSkill} = props;
    const [isDataLoaded, setIsDataLoaded]= useState(false);
    const [rowId,setRowId] = useState('');
		const [hoverCallout,setHoverCallout]= useState('');
    const [updateCallout,setUpdateCallout] = useState(false);
    const[isUserSearching,setIsUserSearching] = useState(false)
    const [fetchOptions,setFetchOptions] = useState({
      skip: 0,
      limit: 15,
      sort_field:'skill_name',
      sort_type:-1,
      search_field: ''
    })

    const [hasMore,setHasMore] = useState(true)

    const navigateTo = useNavigate();

    const columns = [
    {
      columnKey: 'serial_number',
      label: 'Serial Number',
    }, {
      columnKey: 'skill_name',
      label: 'Skill Name',
      icon: `${fetchOptions.sort_field=== 'skill_name' &&  fetchOptions.sort_type === 1 ?  'SortUp' : 'SortDown' }`
    }, {
      columnKey: 'skill_catrgory',
      label: 'Skill Catrgory',
    },{
      columnKey: 'createdAt',
      icon: `${fetchOptions.sort_field=== 'createdAt'  && fetchOptions.sort_type === 1 ?  'SortUp' : 'SortDown' }`,
      label: 'Created on',
    },{
      columnKey: 'created_by',
      label: 'Created by',
    },{
      columnKey: 'updatedAt',
      label: 'Updated on',
    },{
      columnKey: 'More Options',
      label: ' '
    }];

    
    useEffect(()=>{
      getSkillData()
      setHasMore(true)
      setFetchOptions({...fetchOptions,skip: 0,limit: 15})
   
    },[isModalOpen,fetchOptions.sort_field,fetchOptions.sort_type])

  

    


    const getSkillData = () =>{
			
       setIsDataLoaded(false)
       axiosPrivateCall.get(`/api/v1/skill/listSkills?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`).then(res=>{
        console.log(res.data);
        setSkillList(res.data);
        setIsDataLoaded(true)
     
        
      }).catch(e=>{
        console.log(e)
      })
  
    }


    const searchSkillList = (e) =>{

      const searchValue =  e

      if(searchValue === ''){
        getSkillData();
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
       axiosPrivateCall.get(`/api/v1/skill/searchSkill?field_name=skill_name&field_value=${searchValue}`)
       .then(res=>{
        console.log(res)
        console.log(res.data);
        setSkillList(res.data);
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
        axiosPrivateCall.get(`/api/v1/skill/searchSkill?skip=${fetchOptions.skip+fetchOptions.limit}&limit=${fetchOptions.limit}&field_name=skill_name&field_value=${fetchOptions.search_field}`)
      .then(res=>{
        const moreSkills =res.data;
  

			
        setSkillList([...skillList,...moreSkills])
        if(moreSkills.length < 15 || moreSkills.length === 0){
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

        axiosPrivateCall.get(`/api/v1/skill/listSkills?skip=${fetchOptions.skip+fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then(res=>{
          const moreSkills =res.data;
          console.log(moreSkills.length)
  
        
          setSkillList([...skillList,...moreSkills])
          if(moreSkills.length < 15 || moreSkills.length === 0){
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
			
				if(key==='skill_name'){
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


    const deleteSkill =(_id)=>{
      const deleteObj= {"_id":_id}
      axiosPrivateCall.post('/api/v1/skill/deleteSkill',deleteObj).then(res=>{
        const skillArrList = skillList;
        setSkillList(skillArrList.filter(skill=>skill._id!==_id))

      }).catch(e=>{
        console.log(e)
        setUpdateCallout(false)
      })

    }

    const downloadSkills = ()=>{

      // axiosPrivateCall.get(`/api/v1/skill/downloadSkill?&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`,{
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
                { isModalOpen && <AddSkillModal 
                isModalOpen = {isModalOpen} 
                setIsModalOpen = {setIsModalOpen}
                isSubmitSuccess ={isSubmitSuccess}
                setSubmitSuccess={setSubmitSuccess}/>}

                  

                  <div className={styles.nav_container}>
                      <div className={styles.title}>Manage Skills</div>

                      {isSubmitSuccess && (<div className={styles.toast}>
                          <div className={styles.toast_title}>
                              <FontIcon iconName="StatusCircleCheckmark" className={iconClassToast} />
                              <div>Skill Added Successfully!</div>
                          </div>

                          <FontIcon iconName="StatusCircleErrorX" className={iconClass} onClick={() => setSubmitSuccess(false)} />
                          </div>)
                      }

                      <div className={styles.nav_items}>
                          <SearchBox onSearch={(e)=>searchSkillList(e)} onClear={clearSearchBox} placeholder="Skill Name" iconProps={searchIcon} className={styles.search} styles={searchFieldStyles}  />
                          <FontIcon iconName="Breadcrumb" className={iconClass} />
                          <PrimaryButton text="Add Skill" iconProps={addIcon} 
                          onClick={() => {setIsModalOpen(!isModalOpen); setSubmitSuccess(false);}} />
                          <FontIcon onClick={downloadSkills} iconName="Download" className={iconClass} />
                      </div>
                  </div>

                  <div id="scrollableDiv" className={styles.table_container}>
                      <InfiniteScroll style={{overflow: 'visible', height: '100%'}} dataLength={skillList.length} loader={isDataLoaded && skillList.length>= 15 && <h4>Loading...</h4>}
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
                          
                              {isDataLoaded && skillList?.map((skill,skill_index) => 
                                  <tr key={skill?._id}>
                                      <td className={styles.table_dataContents}>{skill_index + 1}</td>
                                      <td className={styles.table_dataContents}>{skill?.skill_name}</td>
                                      <td className={styles.table_dataContents}>{skill?.skill_category}</td>
                                      <td className={styles.table_dataContents}>{ISOdateToCustomDate(skill?.createdAt)}</td>
                                      <td className={styles.table_dataContents}>{`${skill?.created_by.first_name} ${skill?.created_by.last_name}`}</td>
                                      
                                      <td className={styles.table_dataContents}>{ISOdateToCustomDate(skill?.updatedAt)}</td>
                                      
                                      <td className={styles.table_dataContents}>
                                        <div id={`${skill.pan_number}${skill._id}`} 
                                            onClick={()=>{setRowId(skill._id); setUpdateCallout(true)}} 
                                            className={styles.moreOptions}>
                                            <FontIcon iconName='MoreVertical' className={iconClass1}/>
                                            { rowId === skill._id && updateCallout && <Callout gapSpace={0} 
                                                                        target={`#${skill.pan_number}${skill._id}`} onDismiss={()=>setRowId('')}
                                                                        isBeakVisible={false} 
                                                                        directionalHint={DirectionalHint.bottomCenter}>

                                                                        <div style={{display:'flex', flexDirection:'column'}}>
                                                                            <DefaultButton text="Edit" onClick={()=>navigateTo(`/masterlist/editskill?skill_id=${skill._id}`)}  styles={calloutBtnStyles}/>
                                                                            
                                                                            <DefaultButton onClick={()=>deleteSkill(skill._id)} text="Delete" styles={calloutBtnStyles}/>
                                                                        </div>
                                                                    </Callout>
                                            }
                                        </div>
                                      </td>
                                  </tr>)}

                                { !isDataLoaded && items.map(skill => 
                                <tr className={styles.table_row} >
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

export default SkillListing;







