import React,{useState, useEffect, useCallback} from 'react'
import { Dropdown } from '@fluentui/react'
import styles from './AddVendorModal.module.css'
import { Icon } from '@fluentui/react/lib/Icon';
import { TextField, PrimaryButton,} from '@fluentui/react';
import { mergeStyles, mergeStyleSets} from '@fluentui/react';
import { axiosPrivateCall, axiosJsonCall } from '../constants';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "@fluentui/react/lib/Label";
import ComboBox from '../components/ComboBox/ComboBox';


// regex
const nameInputRegex = /^[a-zA-Z0-9- '.\u00c0-\u024f\u1e00-\u1eff]*$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const mobileRegex=/^[6-9]\d{9}$/;
const websiteRegex=/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;



const contractIconClass = mergeStyles({
	fontSize: 20,
	height: '20px',
	width: '20px',
	cursor: 'pointer',
});

const closeIconClass = mergeStyles({
	fontSize: 16,
	height: '20px',
	width: '20px',
	cursor: 'pointer'

});

const tableCloseIconClass = mergeStyles({
	fontSize: 10,
	height: '12px',
	width: '12px',
	cursor: 'pointer',
	color: 'red'

});

const dropDownStyles = (props, currentHover, error, value) => {
    return {
      dropdown: { minWidth: "120px", minHeight: "20px" },
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
      },
      caretDownWrapper: { height: "22px", lineHeight: "20px !important" },
      dropdownItem: { minHeight: "22px", fontSize: 12 },
      dropdownItemSelected: { minHeight: "22px", fontSize: 12 },
    };
  };

//add transperant here in title: border

const dropdownTeam =  [
	{ key: 'Technical Skill', text: 'Technical Skill' },
	{ key: 'Soft Skill', text: 'Soft Skill' },
	{ key: 'Others', text: 'Others'},
];


const Field = mergeStyleSets( {
	fieldGroup: {height:'22px', minWidth: '80px', maxWidth: '120px', border:'0.5px solid transparent', fontSize: '12px',},
	field: {fontSize: '12px',}
});

const FieldL = mergeStyleSets( {
	fieldGroup: {height:'22px', minWidth: '160px', maxWidth: '240px', border:'0.5px solid transparent', fontSize: '12px',},
	field: {fontSize: '12px',}
});

const Field1 = mergeStyleSets( {
	fieldGroup: {height:'22px', minWidth: '80px', maxWidth: '120px', border:'0.5px solid transparent', backgroundColor: '#EDF2F6', fontSize: '12px'},
	field: {fontSize: '12px'}
});

const FieldError = mergeStyleSets( {
	fieldGroup: {height:'22px', minWidth: '80px', maxWidth: '120px', border:'0.5px solid #a80000', backgroundColor: '#EDF2F6', fontSize: '12px'},
	field: {fontSize: '12px'}
});


const EditVendor = (props) => {

	let isModalOpen = props.isModalOpen;
	const  setIsModalOpen = props.setIsModalOpen;
	let isSubmitSuccess = props.isSubmitSuccess;
	const setSubmitSuccess = props.setSubmitSuccess;
	const [currentHover,setCurrentHover] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
	const [dropDownCities, setDropDownCities] = useState([]);
	const [dropDownStates, setDropDownStates] = useState([]);
	const [dropDownSkills, setDropDownSkills] = useState([]);
    const navigateTo = useNavigate();
	
	const hoverHandler =(name)=>{
		setCurrentHover(name);
	}

		
	let defaultbasicInfo = {
		company_name:'',
		skill_name:'',
		head_count:'',
		location:'',
		region:'',
	}
	
	const [basicInfo, setBasicInfo] = useState({...defaultbasicInfo});
	const [basicInfoerrors,setBasicInfoErrors] = useState({...defaultbasicInfo});

	let defaultBasicDetail = {
		contact_person: '',
		designation:'',
		website:'',
		linkedin:'',
		primary_email:'',
		alternate_email:'',
		primary_mobile:'',
		alternate_mobile:'',
	}

	const [basicDetails,setBasicDetails] = useState([{...defaultBasicDetail},])
	const [basicDetailserrors,setBasicDetailserrors] = useState([{...defaultBasicDetail}]);

	useEffect(() => {

		axiosJsonCall
		.get("/b/643fa67bebd26539d0ae2903")
		.then((res) => {
		  let buffer = res.data.record;
		  let dropdown_data = buffer.map((obj) => {return {key: obj.name , text: obj.name}});
		  setDropDownCities(dropdown_data)
		})
		.catch((e) => {});
		
		axiosJsonCall
		.get("/b/643fa973ace6f33a220e556e")
		.then((res) => {
		  let buffer = res.data.record;
		  let dropdown_data = buffer.map((obj) => {return {key: obj.name , text: obj.name}});
		  setDropDownStates(dropdown_data)
		})
		.catch((e) => {});

		axiosPrivateCall
		.get(`/api/v1/skill/listSkills`).then(res=>{
		let buffer = res.data;
		let dropdown_data = buffer.map((obj) => {return {key: obj.skill_name , text: obj.skill_name}});
		setDropDownSkills(dropdown_data)
		}).catch(e=>{
			console.log(e)
		})
	},[])

	const dropDownHandler=(e, item, name, setData, setErrors)=>{
		setData((prevState) =>
		{
			let update = prevState;
			update[name] = item.text;

			return update;
		} );
      
		setErrors((prevState) =>
		{
			let update = prevState;
			update[name] = '';

			return update;
		} );

	};

	const inputChangeHandler =(e,name, setData, setErrors)=>{

		const {value} = e.target
		let inputValue = value

		let isNameValid = false

		if(name==='company_name' && nameInputRegex.test(inputValue) ){
			
			if(inputValue.length > 40 ) inputValue = inputValue.slice(0,40)
			isNameValid= true	
		}

		if(name==='skill_name'  && nameInputRegex.test(inputValue) ){
			if(inputValue.length > 40 ) inputValue = inputValue.slice(0,40)
			isNameValid= true
		}

		if(name==='head_count' && !isNaN(inputValue)){
			if(inputValue.length > 40) inputValue = inputValue.slice(0,40)
			isNameValid=true
		}

		if(name==='location' && nameInputRegex.test(inputValue)){
			if(inputValue.length > 40) inputValue = inputValue.slice(0,40)
			isNameValid= true
		}


		if(isNameValid){
			setData((prevState) => {
				return {...prevState,
				[name]: inputValue}
			})
			
			setErrors((prevState) => {
				return {...prevState,
					[name]: null}
			}) 

		}

	};


	const inputChangeHandler1 =(e,name,key,setData,setErrors)=>{

		const {value} = e.target
		let inputValue = value

		let isNameValid = false

		if(name==='contact_person'){
			isNameValid= true
		}


		if(name==='designation'){
			isNameValid= true
		}

        
		if(name==='primary_email'){
			if(inputValue.length > 320) inputValue = inputValue.slice(0,320)
			isNameValid=true
		}

		if(name==='primary_mobile' && (inputValue=== '' || !isNaN(inputValue))){
			if(inputValue.length > 10) inputValue = inputValue.slice(0,10)
			isNameValid= true
		}

		if(name==='alternate_email'){
			if(inputValue.length > 320) inputValue = inputValue.slice(0,320)
			isNameValid=true
		}

		if(name==='alternate_mobile' && (inputValue=== '' || !isNaN(inputValue))){
			if(inputValue.length > 10) inputValue = inputValue.slice(0,10)
			isNameValid= true
		}

		if(name==='linkedin'){
			isNameValid= true
		}

		if(name==='website'){
			isNameValid= true
		}

		if(isNameValid)
		{
			setData((prevState) =>
			{
				let update = [...prevState];
				update[key][name] = inputValue;

				return update;
			} );

			setErrors((prevState) =>
			{
				let errorupdate = [...prevState];
				errorupdate[key][name] = null;

				return errorupdate;
			} );

			
			// console.log(basicDetailserrors)
		}

	};

    useEffect(() => {
        axiosPrivateCall(
          `/api/v1/vendor/getVendorDetails?vendor_id=${searchParams.get(
            "vendor_id"
          )}`
        )
          .then((res) => {
             setApiData(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }, []);

	useEffect(() => {console.log('rendering..')},[basicDetails, basicInfo, basicInfoerrors, basicDetailserrors]);

    function setApiData(data) {
        setBasicDetails([...data.people])
        setBasicInfo({_id: data._id,
        company_name: data.company_name,
        skill_name: data.skill_name,
        head_count: data.head_count,
        location: data.location,
		region: data.region,
		})
    };


	function validate (values) {

        const errors = {}

        if(!values.company_name)
        {
            errors.company_name = 'Required'
        } else if(!nameInputRegex.test(values.company_name)) {
            errors.company_name = 'Invalid name'
        }

		if(!values.skill_name)
        {
            errors.skill_name = 'Required'
        } else if(!nameInputRegex.test(values.skill_name)) {
            errors.skill_name = 'Invalid name'
        }

        if(!values.head_count)
        {
            errors.head_count = 'Required'
        } 

        if(!values.location)
        {
            errors.location = 'Required'
        }

        return errors;
    }

	function nestedValidate(values) {

		let errorArr = [];
		values.map((detail) => errorArr.push({}));

		values.map((detail, index) => {

			if(!nameInputRegex.test(detail.contact_person)) {
            	errorArr[index].contact_person = 'Invalid name'
        	}

			if(detail.primary_email)
			{
				if(!emailRegex.test(detail.primary_email)) {
					errorArr[index].primary_email = 'Invalid Email Id'
				}
			}

			if(detail.primary_mobile)
			{
				if(!mobileRegex.test(detail.primary_mobile)) {
					errorArr[index].primary_mobile= 'Invalid Mobile Number'
				}
			}

			if(detail.alternate_email)
			{
				if(!emailRegex.test(detail.alternate_email)) {
					errorArr[index].alternate_email = 'Invalid Email Id'
				}
			}

			if(detail.alternate_email)
			{
				if(!mobileRegex.test(detail.alternate_mobile)) {
					errorArr[index].alternate_mobile = 'Invalid Mobile Number'
				}
			}

            if(detail.website)
			{
				if(!websiteRegex.test(detail.website)) {
					errorArr[index].website = 'Invalid Website format'
				}
			}
						
		})

		return errorArr;
	}

	
	function sanitizer (obj, arrobj1) {
		let payload = {...obj};
		payload.people = [...arrobj1]
		console.log(payload)
		return payload;
	}


	function submitHandler(e)  {
        e.preventDefault();
		console.log('submit clicked')
		let errorsBasicInfoSet;
		let errorsBasicDetailSet;
		

		function analyseError(errorDataSet) {

			let answer = true;

			for (let i = 0; i < errorDataSet.length; i++) 
			{
				if(!(Object.keys(errorDataSet[i]).length === 0))
				{
					answer = false;
					break;
				}
			};

			return answer;
		}


		errorsBasicInfoSet = validate(basicInfo)
		errorsBasicDetailSet = nestedValidate(basicDetails);
		

		let stage1 = (Object.keys(errorsBasicInfoSet).length === 0);
		let stage2 = analyseError(errorsBasicDetailSet);
		
		

		// console.log(errorsBasicInfoSet);

		
		if(stage1 && stage2)
        {
            let update = sanitizer(basicInfo,basicDetails);
			axiosPrivateCall.post('/api/v1/vendor/updateVendor', update).then(res=>{
            console.log(res)
			submitForm();
           
			}).catch(e=>{
              console.log(e);
            })

        }
			else {
				setBasicInfoErrors(errorsBasicInfoSet);
				setBasicDetailserrors([...errorsBasicDetailSet]);
				console.log('error');
			}
	
	}

	function submitForm ()
    {
        navigateTo(`/masterlist/managevendor`);
    };

	
	function handleRemoveItem (key, setData, setErrors) {
		
		setData((prevState) => {
			let update = [...prevState];
			let arr1 = update.slice(0, key);
			let arr2 = update.slice((key + 1));
			let newSet = arr1.concat(arr2);
			return newSet;
		});

		setErrors((prevState) => {
			let update = [...prevState];
			let arr1 = update.slice(0, key);
			let arr2 = update.slice((key + 1));
			let newSet = arr1.concat(arr2);

			return newSet;
		});
	};


	
	function addField (setData, setErrors, defaultData)
	{
		setData((prevState) => [...prevState, {...defaultData}]);
		setErrors((prevState) => [...prevState, {...defaultData}]);
	}




	
	return (

		<div>
				<div className={styles.addcandidate_modal_header_container}>
					<div className={styles.header_tag_expand_close_icon_container}>

						<div className={styles.header_tag_container}>
							Vendor
						</div>
					</div>

					<div className={styles.header_content_container}>

						<div className={styles.header_content_title_container}>
							<div className={styles.header_content_title_container}>
								Edit Vendor
							</div>

							<div className={styles.header_content_save_container}>
								
								<div className={styles.header_save_close_btns_container}>
									<PrimaryButton text={`Save & Close`} 
									onClick={submitHandler} 
									iconProps={{iconName:"Save"}}/>
								</div>
								
							</div>
						</div>
					</div>
				</div>

				<div className={styles.addemployee_modal_main_container}>

					<div className={styles.main_filter_options_container}>

						<div className={styles.subcontainer}>

							<div className={styles.main_dropdown_container2}>
								<div className={styles.main_repotingmanager_title}><Label required className={styles.required_field_heding}>Company Name</Label></div>
								<div className={(basicInfo.company_name || basicInfoerrors.company_name)? styles.showfield : styles.hidefield } >
									<TextField  type="text" 
									name="company_name"
									onChange={(e)=>{inputChangeHandler(e,'company_name',setBasicInfo,setBasicInfoErrors); }} 
									value = {basicInfo.company_name}
									placeholder={'Enter the Name'}
									styles={basicInfoerrors.company_name ? FieldError : Field1}/>
								</div>
							</div>

							<div className={styles.main_dropdown_container11}>
								<div className={styles.main_repotingmanager_title}><Label required className={styles.required_field_heding}>Skill Name</Label></div>
								<div className={(basicInfo.skill_name || basicInfoerrors.skill_name)? styles.showfield : styles.hidefield } >
									{/* <TextField  type="text" 
									name="skill_name" 
									onChange={(e)=>{inputChangeHandler(e,'skill_name',setBasicInfo,setBasicInfoErrors); }} 
									value = {basicInfo.skill_name}
									placeholder={'Enter the Skill'}
									styles={basicInfoerrors.skill_name ? FieldError : Field1}/> */}

									<ComboBox 
									type='text'
									name='skill_name'
									textfield='color'
									width={'200px'}
									inputChangeHandler = {inputChangeHandler}
									setInfo = {setBasicInfo}
									setInfoErrors = {setBasicInfoErrors}
									value={basicInfo.skill_name}
									errorMessage={basicInfoerrors.skill_name}
									dropdown={dropDownSkills} 
									placeholder= 'Enter the Skill'/>
								</div>
							</div>

						</div>

						<div className={styles.subcontainer}>

						

							<div className={styles.main_dropdown_container1}>
								<div className={styles.main_repotingmanager_title}><Label required className={styles.required_field_heding}>Head Count</Label></div>
								<div className={(basicInfo.head_count || basicInfoerrors.head_count)? styles.showfield : styles.hidefield } >
									<TextField  type="text" 
									name="head_count" 
									onChange={(e)=>{inputChangeHandler(e,'head_count',setBasicInfo,setBasicInfoErrors); }} 
									value = {basicInfo.head_count}
									placeholder={`Enter the Head Count`}
									styles={basicInfoerrors.head_count ? FieldError : Field1}/>
								</div>
							</div>

							<div className={styles.main_dropdown_container2}>
								<div className={styles.main_repotingmanager_title}><Label required className={styles.required_field_heding}>Location</Label></div>
								<div className={(basicInfo.location || basicInfoerrors.location)? styles.showfield : styles.hidefield } >
									{/* <TextField  type="text" 
									name="location" 
									onChange={(e)=>{inputChangeHandler(e,'location',setBasicInfo,setBasicInfoErrors); }} 
									value = {basicInfo.location}
									placeholder={'Enter the Location'}
									styles={basicInfoerrors.location ? FieldError : Field1}/> */}

									<ComboBox 
									type='text'
									name='location'
									textfield='color'
									width={'200px'}
									inputChangeHandler = {inputChangeHandler}
									setInfo = {setBasicInfo}
									setInfoErrors = {setBasicInfoErrors}
									value={basicInfo.location}
									errorMessage={basicInfoerrors.location}
									dropdown={dropDownCities} 
									placeholder= 'Enter the Location'/>
								</div>
							</div>

						</div>

						<div className={styles.subcontainer}>

							<div className={styles.main_dropdown_container11}>
								<div className={styles.main_repotingmanager_title}><Label required className={styles.required_field_heding}>Region</Label></div>
								<div id='region'
                                    className={(basicInfo?.region || basicInfoerrors?.region ) ? styles.showfield : styles.hidefield } >
                                        <Dropdown placeholder='Select' onClick={()=>hoverHandler('region')} 
                                        options={dropdownTeam}
                                        onChange={(e,item)=>{dropDownHandler(e,item,'region',setBasicInfo,setBasicInfoErrors); setCurrentHover('') }}
                                        errorMessage={basicInfoerrors?.region} 
                                        selectedKey={basicInfo?.region}
										value={basicInfo?.region}
                                        styles={(props) =>
                                            dropDownStyles(
                                              props,
                                              currentHover,
                                              basicInfoerrors.region,
                                              "region"
                                            )
                                          }/>
                                </div>
							</div>

						</div>


					</div>

					<div className={styles.main_information_container}>


						<div className={styles.main_basic_information_container}>


							<div className={styles.main_basic_information_title2}>
                 				<div>BASIC INFORMATION</div>
								<div className={styles.add_btn} onClick={() => addField(setBasicDetails, setBasicDetailserrors, defaultBasicDetail)}>+ Add</div>
							</div>

							<div className={styles.main_basic_information_content_container}>

								<div className={styles.table_container}>
									<table>
										<thead className={styles.table_header}>
											<tr className={styles.table_row1}>

												<th className={styles.table_headerContents} >
													<div className={styles.table_heading}>
														Name of Contact Person
													</div>
												</th>

												<th className={styles.table_headerContents} >
													<div className={styles.table_heading}>
														Designation
													</div>
												</th>

												<th className={styles.table_headerContents} >
													<div className={styles.table_heading}>
														Company Website URL
													</div>
												</th>

												<th className={styles.table_headerContents} >
													<div className={styles.table_heading}>
														LinkedIn URL
													</div>
												</th>

												<th className={styles.table_headerContents} >
													<div className={styles.table_heading}>
														Primary Email Address
													</div>
												</th>

												<th className={styles.table_headerContents} >
													<div className={styles.table_heading}>
														Alternate Email Address
													</div>
												</th>

												<th className={styles.table_headerContents} >
													<div className={styles.table_heading}>
														Mobile Number
													</div>
												</th>

												<th className={styles.table_headerContents} >
													<div className={styles.table_heading}>
														Alternate Mobile Number
													</div>
												</th>

												<th className={styles.table_headerContents} >
													<div className={styles.table_heading}>
														
													</div>
												</th>
											</tr>
										</thead>
										
										<tbody>
											{	basicDetails?.map((detail , index) => 
													(<tr key={index} className={styles.table_row}>

														<td className={styles.table_dataContents}>
															
															<div className={(basicDetails[index]?.contact_person || basicDetailserrors[index]?.contact_person)? styles.showfield : styles.hidefield } >
																<TextField  type="text" 
																name="contact_person" 
																onChange={(e)=>{inputChangeHandler1(e,'contact_person',index,setBasicDetails,setBasicDetailserrors); }} 
																value = {basicDetails[index]?.contact_person}
																placeholder={'Enter the Name'}
																errorMessage={basicDetailserrors[index]?.contact_person} 
																styles={Field} />
															</div>
															
															
														</td>

														<td className={styles.table_dataContents}>
															
															<div className={(basicDetails[index]?.designation || basicDetailserrors[index]?.designation)? styles.showfield : styles.hidefield } >
																<TextField  type="text" 
																name="designation" 
																onChange={(e)=>{inputChangeHandler1(e,'designation',index,setBasicDetails,setBasicDetailserrors); }} 
																value = {basicDetails[index]?.designation}
																placeholder={'Enter the Designation'}
																errorMessage={basicDetailserrors[index]?.designation} 
																styles={Field} />
															</div>
															
															
														</td>

														<td className={styles.table_dataContents}>
															
															<div className={(basicDetails[index]?.website || basicDetailserrors[index]?.website)? styles.showfield : styles.hidefield } >
																<TextField  type="text" 
																name="website" 
																onChange={(e)=>{inputChangeHandler1(e,'website',index,setBasicDetails,setBasicDetailserrors); }} 
																value = {basicDetails[index]?.website}
																placeholder={'Paste the URL'}
																errorMessage={basicDetailserrors[index]?.website} 
																styles={Field} />
															</div>
															
															
														</td>

                                                        <td className={styles.table_dataContents}>
															
															<div className={(basicDetails[index]?.linkedin || basicDetailserrors[index]?.linkedin)? styles.showfield : styles.hidefield } >
																<TextField  type="text" 
																name="linkedin" 
																onChange={(e)=>{inputChangeHandler1(e,'linkedin',index,setBasicDetails,setBasicDetailserrors); }} 
																value = {basicDetails[index]?.linkedin}
																placeholder={'Paste the URL'}
																errorMessage={basicDetailserrors[index]?.linkedin} 
																styles={Field} />
															</div>
															
															
														</td>
														
														

														<td className={styles.table_dataContents}>
															
															<div className={(basicDetails[index]?.primary_email || basicDetailserrors[index]?.primary_email)? styles.showfield : styles.hidefield } >
																<TextField  type="text" 
																name="primary_email" 
																onChange={(e)=>{inputChangeHandler1(e,'primary_email',index,setBasicDetails,setBasicDetailserrors); }} 
																value = {basicDetails[index]?.primary_email}
																placeholder={'Email ID'}
																errorMessage={basicDetailserrors[index]?.primary_email} 
																styles={Field} />
															</div>
															
															
														</td>

														<td className={styles.table_dataContents}>
															
															<div className={(basicDetails[index]?.alternate_email || basicDetailserrors[index]?.alternate_email)? styles.showfield : styles.hidefield } >
																<TextField  type="text" 
																name="alternate_email" 
																onChange={(e)=>{inputChangeHandler1(e,'alternate_email',index,setBasicDetails,setBasicDetailserrors); }} 
																value = {basicDetails[index]?.alternate_email}
																placeholder={'Email ID'}
																errorMessage={basicDetailserrors[index]?.alternate_email} 
																styles={Field} />
															</div>
															
															
														</td>

														<td className={styles.table_dataContents}>
															
															<div className={(basicDetails[index]?.primary_mobile || basicDetailserrors[index]?.primary_mobile)? styles.showfield : styles.hidefield } >
																<TextField  type="text" 
																name="primary_mobile" 
																onChange={(e)=>{inputChangeHandler1(e,'primary_mobile',index,setBasicDetails,setBasicDetailserrors); }} 
																value = {basicDetails[index]?.primary_mobile}
																placeholder={'Mobile Number'}
																errorMessage={basicDetailserrors[index]?.primary_mobile} 
																styles={Field} />
															</div>
															
															
														</td>

														<td className={styles.table_dataContents}>
															
															<div className={(basicDetails[index]?.alternate_mobile || basicDetailserrors[index]?.alternate_mobile)? styles.showfield : styles.hidefield } >
																<TextField  type="text" 
																name="alternate_mobile" 
																onChange={(e)=>{inputChangeHandler1(e,'alternate_mobile',index,setBasicDetails,setBasicDetailserrors); }} 
																value = {basicDetails[index]?.alternate_mobile}
																placeholder={'Mobile Number'}
																errorMessage={basicDetailserrors[index]?.alternate_mobile} 
																styles={Field} />
															</div>
															
															
														</td>

														
														<td className={styles.table_dataContents}>
															<div className={(basicDetails[index]?.id || basicDetailserrors[index]?.id) ? styles.showfield : styles.hidefield } >
																<Icon key={index} iconName='ChromeClose' className={tableCloseIconClass} onClick={() => {if (basicDetails.length > 1) handleRemoveItem(index,setBasicDetails ,setBasicDetailserrors)}}/>
															</div>
														</td>

													</tr>))}
										</tbody>

									</table>
								</div>

							</div>

						</div>
					</div>

				</div>

		</div>
		
	)

	
}




export default EditVendor;







