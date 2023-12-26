import React,{useState, useEffect, useCallback} from 'react'
import {  Modal } from '@fluentui/react'
import styles from './AddSkillModal.module.css'
import { Icon } from '@fluentui/react/lib/Icon';
import { TextField, PrimaryButton} from '@fluentui/react';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { mergeStyles, mergeStyleSets} from '@fluentui/react';
import { axiosPrivateCall } from '../constants';
import {Popup}  from '../components/Popup';
import { Label } from "@fluentui/react/lib/Label";


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

const textField = (props, currentHover, error, value) => {
    return {
      fieldGroup: {
        height: "22px",
        width: "50%",
        borderColor: error ? "#a80000" : "transparent",
        selectors: {
          ":focus": {
            borderColor: "rgb(96, 94, 92)",
          },
        },
      },
      field: { lineHeight: "24px", fontSize: 12 },
    };
  };

  const dropDownStyles = (props, currentHover, error, value) => {
    return {
      dropdown: { minWidth: "160px", minHeight: "20px" },
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


const AddSkillModal = (props) => {

	let isModalOpen = props.isModalOpen;
	const  setIsModalOpen = props.setIsModalOpen;
	const setSubmitSuccess = props.setSubmitSuccess;
	const [isModalShrunk,setIsModalShrunk] = useState(false);
	const [currentHover,setCurrentHover] = useState('');

	const hoverHandler =(name)=>{
		setCurrentHover(name);
	}

		
	let defaultbasicInfo = {
		skill_category:'',
		skill_name:'',
	}
	
	const [basicInfo, setBasicInfo] = useState({...defaultbasicInfo});
	const [basicInfoerrors,setBasicInfoErrors] = useState({...defaultbasicInfo});

	const [showPopup, setShowPopup] = useState(false);
	
	const modalSizeHandler =()=>{
     setIsModalShrunk(!isModalShrunk)
	}


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

		
        setData((prevState) => {
            return {...prevState, [name]: inputValue}
        })
        
        setErrors((prevState) => {
            return {...prevState, [name]: ""}
        }) 

	};


	

	useEffect(() => {console.log('rendering..')},[basicInfo, basicInfoerrors,])


	function validate (values) {

        const errors = {}

        if(!values.skill_name)
        {
            errors.skill_name = 'Required'
        } 

        if(!values.skill_category)
        {
            errors.skill_category = 'Required'
        }

        

        return errors;
    }

	

	function sanitizer (obj, arrobj1, arrobj2) {
		let payload = {...obj};
		console.log(payload)
		return payload;
	}


	function submitHandler(e)  {
        e.preventDefault();
		let errorsBasicInfoSet;
		
		errorsBasicInfoSet = validate(basicInfo)
		let stage1 = (Object.keys(errorsBasicInfoSet).length === 0);
		
		
		if(stage1)
        {
			axiosPrivateCall.post('/api/v1/skill/createSkill',sanitizer(basicInfo,)).then(res=>{
            console.log(res)
			submitForm();
           
			}).catch(e=>{
              console.log(e);
            })

        }
			else {
				setBasicInfoErrors(errorsBasicInfoSet);
				console.log('error');
			}
	
	}

	function submitForm ()
    {
        setSubmitSuccess(true);
        setIsModalOpen(false);
    };

	const closeHandler = () => {
		setShowPopup(true);
	}

	const close = useCallback(
		()=>{
		  let value_temp
				
			setBasicInfo(
				prevState =>{
					value_temp = Object.values(validate(prevState));
					if (value_temp.length === 15)
					{
						closeHandler();
					} else {
						closeHandler();	
					}
					
					return prevState
				}
			)
		},[JSON.stringify(basicInfo)]
	) 

	const escKeyHandler  =  (event)=> {
		if (event.key === 'Escape') {
			closeHandler();
		}
	}

	useEffect(()=>{

		document.addEventListener("keydown", escKeyHandler ,{capture: true}  );
		return()=>{
			document.removeEventListener("keydown", escKeyHandler,{capture : true});

		}
	},[])

	
	
	return (

		<div>
			{<Popup showPopup={showPopup} 
					setShowPopup={setShowPopup} 
					isModalOpen={isModalOpen} 
					setIsModalOpen={setIsModalOpen}/>}
			<Modal scrollableContentClassName={styles.addcandidate_modal_scrollable_content} containerClassName={`${isModalShrunk ? styles.addcandidate_modal_container_shrunk : styles.addcandidate_modal_container}`}
			  isOpen={isModalOpen}>
				<div className={styles.addcandidate_modal_header_container}>
					<div className={styles.header_tag_expand_close_icon_container}>

						<div className={styles.header_tag_container}>
							Skill
						</div>

						
						<div className={styles.header_expand_close_icon_container}>
							<div onClick={modalSizeHandler} className={styles.header_expand_icon_container}>
								{isModalShrunk ? <Icon iconName='FullScreen' className={contractIconClass}/>:
								<Icon iconName='BackToWindow' className={contractIconClass}/>}
							</div>
							<div onClick={()=>close()} className={styles.header_close_icon_container}>
								<Icon iconName='ChromeClose' className={closeIconClass}/>
							</div>

						</div>
		
					</div>

					<div className={styles.header_content_container}>

						<div className={styles.header_content_title_container}>
							<div className={styles.header_content_title_container}>
								Add Skill
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

							<div className={styles.main_dropdown_container1}>
								<div className={styles.main_repotingmanager_title}><Label required className={styles.required_field_heding}>Skill Category</Label></div>
								
                                <div id='skill_category'
                                    className={(basicInfo?.skill_category || basicInfoerrors?.skill_category ) ? styles.showfield : styles.hidefield } >
                                        <Dropdown placeholder='Select' onClick={()=>hoverHandler('skill_category')} 
                                        options={dropdownTeam}
                                        onChange={(e,item)=>{dropDownHandler(e,item,'skill_category',setBasicInfo,setBasicInfoErrors); setCurrentHover('') }}
                                        errorMessage={basicInfoerrors?.skill_category} 
                                        selectedKey={basicInfo?.skill_category}
                                        styles={(props) =>
                                            dropDownStyles(
                                              props,
                                              currentHover,
                                              basicInfoerrors.skill_category,
                                              "skill_category"
                                            )
                                          }/>
                                </div>
							</div>
						</div>

					</div>

					<div className={styles.main_information_container}>


						<div className={styles.main_basic_information_container}>


							<div className={styles.main_basic_information_title2}>
                 				<div>SKILL INFORMATION</div>
							</div>

							<div className={styles.main_basic_information_content_container}>
                            <div className={styles.main_sub_from_field}>
                                <div>Skill Name</div>
                                <div onClick={() => setCurrentHover("skill_name")}>
                                    <TextField
                                    type="text"
                                    name="skill_name"
                                    placeholder="Enter skill name"
                                    onChange={(e) => {
                                        inputChangeHandler(e,"skill_name",setBasicInfo,setBasicInfoErrors);
                                    }}
                                    value={basicInfo.skill_name}
                                    errorMessage={basicInfoerrors.skill_name}
                                    styles={(props) =>
                                       textField(
                                          props,
                                          currentHover,
                                          basicInfoerrors.skill_name,
                                          "skill_name"
                                        )}
                                    
                                    />
                                </div>
                            </div>


							</div>

						</div>
					</div>

				</div>

			</Modal>

		</div>
		
	)

	
}




export default AddSkillModal;







