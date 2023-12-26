import React, { useEffect, useRef, useState } from 'react';
import { axiosPrivateCall } from '../constants';

import { Dropdown, Modal } from '@fluentui/react';

import { PrimaryButton, Checkbox } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import styles from './AssignDemandModal.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';

// import 'draft-js/dist/Draft.css';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './DraftEditorResetFix.css';



// API
import { mergeStyles } from '@fluentui/react';
import axios from 'axios';


const contractIconClass = mergeStyles({
	fontSize: 20,
	height: 20,
	width: 20,
	cursor: 'pointer',
});

const closeIconClass = mergeStyles({
	fontSize: 16,
	height: 20,
	width: 20,
	cursor: 'pointer'

})

const assignDemandDropdownOptions =[

	{key:'recruiter' , text: 'Recruiter'},
	{key:'team_lead' , text: 'Team Lead'},
	{key:'account_manager' , text:'Account Manager'},
	{key: 'bde', text:'BDE'}

]


const dropDownStylesActive = (props,currentHover,error,value)=>{

	return {
		dropdown: {width: '160px', minWidth: '160px', minHeight:'20px',
	
	  // selectors:{
			
		// 	':focus:':{
		// 		border: '1px solid #0078D4',
		// 		':after':{
		// 			border: currentHover===value ? '1px solid #0078D4 ':  'none',
		// 		}
		// 	}
		// }
	
	 },
		title :{ 
			height: '22px', 
			lineHeight:'18px', 
			fontSize: '12px',
			backgroundColor: '#EDF2F6',
			borderColor: error ? '#a80000' : currentHover === value ? 'rgb(96, 94, 92)' : 'transparent' 
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
		errorMessage:{
			display: 'none'
		},
		caretDownWrapper : {height: '22px', lineHeight:'20px !important', },
		dropdownItem : {minHeight: '22px', fontSize: 12},
		dropdownItemSelected: {minHeight: '22px', fontSize: 12, }, 
	}
}


const columns=[
	{
		columnKey: '',
		label:''
	},
	{
		columnKey: 'Employee ID',
		label:'Employee ID'
	},
	{
		columnKey: 'Full Name',
		label: 'Full Name'
	},
	{
		columnKey: 'Designation',
		label: 'Designation'
	},
	// {
	// 	columnKey: 'Lead',
	// 	label: 'Lead'
	// },
	// {
	// 	columnKey: 'Manager',
	// 	label: 'Manager',
		 
	// },
	{
		columnKey: 'Mobile',
		label: 'Mobile'
	},
	{
		columnKey: 'Email ID',
		label: 'Email ID'
	},

]






const AssignDemandModal = (props) => {
 
  const {isModalOpen,setIsModalOpen,showMessageBar,setShowMessageBar} = props;

	console.log(props.assignDemandId)

	const [assignee, setAssignee] = useState([]);
	const [checkedAssignee, setCheckedAssignees] = useState([]);

	const [currentHover,setCurrentHover] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	
	const [isModalShrunk,setIsModalShrunk] = useState(true)



	const modalSizeHandler =()=>{
     setIsModalShrunk(!isModalShrunk)
	}


	const roleHandler = (e,item)=>{
		

		axiosPrivateCall.get(`/api/v1/employee/getHierarchyList?type=${item.key}`).then(res=>{

			let results = res.data

			setAssignee(results)

		
		}).catch(e=>{
			console.log(e)
		})

	}

	const checkHandler = (event,id,type) =>{

		const checked = event.target.checked

		if(checked && type==='normal'){

			console.log(id, assignee.filter((assigneeObj) =>  assigneeObj._id === id ))
			setCheckedAssignees( [...checkedAssignee,...assignee.filter((assigneeObj) =>  assigneeObj._id === id )])
			setAssignee(assignee.filter((assigneeObj) =>  assigneeObj._id !== id ) )
		}



		if(!checked && type==='checkedbox'){
			let objToBeAssigned = checkedAssignee.filter(assigneeObj=> assigneeObj._id=== id)[0];
	
			setCheckedAssignees(checkedAssignee.filter(assigneeObj=> assigneeObj._id!== id))
			setAssignee([...assignee,objToBeAssigned])

		}


	}

	const updateDemand = (arr) => {
    axiosPrivateCall
      .post("/api/v1/demand/updateDemand", {_id: props.assignDemandId, assigned_to: arr })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };


	const assignDemandHandler = ()=>{

		const assigned_to_ids = checkedAssignee.map(({_id})=> _id);

		if(assigned_to_ids.length){
			updateDemand(assigned_to_ids)
			setIsModalOpen(false)

		}
		


	}


	const escKeyHandler = (event) => {
		if (event.key === 'Escape') {
		  event.preventDefault();
		  // Optionally, you can add your close logic here
		}
	  };
	  
	  useEffect(() => {
		const handleKeyDown = (event) => {
		  escKeyHandler(event);
		};
	  
		document.addEventListener('keydown', handleKeyDown, { capture: true });
	  
		return () => {
		  document.removeEventListener('keydown', handleKeyDown, { capture: true });
		};
	  }, []);
	  
	



	return (

		<div>
			
			<Modal id="Modal12" scrollableContentClassName={styles.adddemand_modal_scrollable_content} containerClassName={`${isModalShrunk ? styles.adddemand_modal_container_shrunk : styles.adddemand_modal_container}`}
			  isOpen={isModalOpen}>
				<div  className={styles.adddemand_modal_header_container}>
					<div className={styles.header_tag_expand_close_icon_container}>

						<div className={styles.header_tag_container}>
							Assign Demand
						</div>

						
						<div className={styles.header_expand_close_icon_container}>
							<div onClick={modalSizeHandler} className={styles.header_expand_icon_container}>
								{isModalShrunk ? <Icon iconName='FullScreen' className={contractIconClass}/>:
								<Icon iconName='BackToWindow' className={contractIconClass}/>}
							</div>
							<div onClick={()=>setIsModalOpen(false)} className={styles.header_close_icon_container}>
								<Icon iconName='ChromeClose' className={closeIconClass}/>
							</div>

						</div>


		
					</div>

					<div className={styles.header_content_container}>
						<div className={styles.header_content_job_description_unassigned_save_container}>

						
							
						
								
							<div className={styles.header_save_close_btns_container}>
								

								<PrimaryButton onClick={assignDemandHandler}  text="Assign Demand" iconProps={{iconName:"Save"}}/>



							</div>

						</div>
					</div>
				</div>
					<div className={styles.main_filter_options_container}>

					<div className={styles.main_role_dropdown_container}>

						<div className={styles.main_role_title}>Role </div>
						<div onClick={()=>setCurrentHover('priority')} >
							<Dropdown onChange={roleHandler}  placeholder='Select' styles={dropDownStylesActive} notifyOnReselect options={assignDemandDropdownOptions} />
						</div>
					</div>
					


					</div>

					<div id='scrollableDiv' className={styles.table_container}>
						{/* <InfiniteScroll style={{overflow: 'visible', height: '100%'}} scrollableTarget="scrollableDiv">
						</InfiniteScroll> */}
						<table>
							<thead className={styles.table_header}>
							<tr className={styles.table_row}>
                                    {columns.map((column) => 
                                        <th className={styles.table_headerContents} key={column.columnKey}>
                                            <div 
                                              className={styles.table_heading}>
                                                <div>{column.label}</div>
                                                {/* {column?.icon ? <FontIcon iconName={column.icon} className={iconClass1} /> : null} */}
                                            </div>
                                    </th>)}
                </tr>

							</thead>
							<tbody>


								{ 
								checkedAssignee.length ? checkedAssignee.map(assignee=>{

									return(

										<tr  className={styles.table_row}>
											<td className={styles.table_dataContents}> <input key={`CA${assignee._id}`} type="checkbox" checked  onChange={(e)=>checkHandler(e,assignee._id,'checkedbox')}></input> </td>
											<td className={styles.table_dataContents}>{assignee.employee_id}</td>
											<td className={styles.table_dataContents}>{assignee.first_name + " " +assignee.last_name }</td>
											<td className={styles.table_dataContents}>{assignee.role}</td>
											{/* <td className={styles.table_dataContents}>{}</td>
											<td className={styles.table_dataContents}>{}</td> */}
											<td className={styles.table_dataContents}>{assignee.mobile_number}</td>
											<td className={styles.table_dataContents}>{assignee.email}</td>
										</tr>
									)








								}) : ''




								}

								{
									assignee.length ? 


						
									
									
									
									
									
									assignee.map(assignee=>{

										return(

											<tr className={styles.table_row}>
												<td className={styles.table_dataContents}> <input key={`A${assignee._id}`}  type="checkbox" onChange={(e)=>checkHandler(e,assignee._id,'normal')}></input> </td>
												<td className={styles.table_dataContents}>{assignee.employee_id}</td>
												<td className={styles.table_dataContents}>{assignee.first_name + " " +assignee.last_name }</td>
												<td className={styles.table_dataContents}>{assignee.role}</td>
												{/* <td className={styles.table_dataContents}>{}</td>
												<td className={styles.table_dataContents}>{}</td> */}
												<td className={styles.table_dataContents}>{assignee.mobile_number}</td>
												<td className={styles.table_dataContents}>{assignee.email}</td>
											</tr>
										)


									}) : ''

										

								}




						

							

							</tbody>


						</table>


						

						



					</div>

				
       

			</Modal>

		</div>
		
	)
}


export default AssignDemandModal;
