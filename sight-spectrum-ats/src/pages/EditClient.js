import React, { useState, useEffect, useCallback } from 'react'
import styles from './AddClientModal.module.css'
import { Icon } from '@fluentui/react/lib/Icon';
import { TextField, PrimaryButton, DefaultButton, DatePicker } from '@fluentui/react';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { mergeStyles, mergeStyleSets } from '@fluentui/react';
import { axiosPrivateCall, axiosJsonCall } from '../constants';
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontIcon } from '@fluentui/react/lib/Icon';
import { UploadPopup } from '../components/UploadModal';
import { Label } from "@fluentui/react/lib/Label";
import ComboBox from '../components/ComboBox/ComboBox';
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";


// regex
const nameInputRegex = /^[a-zA-Z0-9- '.\u00c0-\u024f\u1e00-\u1eff]*$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const mobileRegex = /^[6-9]\d{9}$/;
const websiteRegex = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;



const tableCloseIconClass = mergeStyles({
	fontSize: 10,
	height: '12px',
	width: '12px',
	cursor: 'pointer',
	color: 'red'

});

//add transperant here in title: border
const dropDownStyles = mergeStyleSets({
	dropdown: { minWidth: '80px', maxWidth: '120px', minHeight: '20px', },
	title: { height: '22px', lineHeight: '18px', fontSize: '12px', border: '0.5px solid transparent', },
	caretDownWrapper: { height: '22px', lineHeight: '20px !important', },
	caretDown: { color: 'grey' },
	dropdownItem: { minHeight: '22px', fontSize: 12 },
	dropdownItemSelected: { minHeight: '22px', fontSize: 12, },
});

const dropDownActive = mergeStyleSets({
	dropdown: { minWidth: '80px', maxWidth: '120px', minHeight: '20px', },
	title: { height: '22px', lineHeight: '18px', fontSize: '12px', border: '0.5px solid black', },
	caretDownWrapper: { height: '22px', lineHeight: '20px !important', },
	caretDown: { color: 'grey' },
	dropdownItem: { minHeight: '22px', fontSize: 12 },
	dropdownItemSelected: { minHeight: '22px', fontSize: 12, },
});

//add transperant here in title: border

const dropDownErrorStyles = mergeStyleSets({
	dropdown: { minWidth: '80px', maxWidth: '120px', minHeight: '20px', },
	title: { height: '22px', lineHeight: '18px', fontSize: '12px', border: '0.5px solid #a80000' },
	caretDownWrapper: { height: '22px', lineHeight: '20px !important' },
	dropdownItem: { minHeight: '22px', fontSize: 12 },
	dropdownItemSelected: { minHeight: '22px', fontSize: 12 },
});


const Field = mergeStyleSets({
	fieldGroup: { height: '22px', minWidth: '80px', maxWidth: '120px', border: '0.5px solid transparent', fontSize: '12px', },
	field: { fontSize: '12px', }
});

const FieldL = mergeStyleSets({
	fieldGroup: { height: '22px', minWidth: '160px', maxWidth: '240px', border: '0.5px solid transparent', fontSize: '12px', },
	field: { fontSize: '12px', }
});

const Field1 = mergeStyleSets({
	fieldGroup: { height: '22px', minWidth: '80px', maxWidth: '120px', border: '0.5px solid transparent', backgroundColor: '#EDF2F6', fontSize: '12px' },
	field: { fontSize: '12px' }
});

const FieldError = mergeStyleSets({
	fieldGroup: { height: '22px', minWidth: '80px', maxWidth: '120px', border: '0.5px solid #a80000', backgroundColor: '#EDF2F6', fontSize: '12px' },
	field: { fontSize: '12px' }
});


const dropdownTeam = [
	{ key: 'Tag Team', text: 'Tag Team' },
	{ key: 'Business Team', text: 'Business Team' },
	{ key: 'Others', text: 'Others' },
];


const AddCandidateModal = (props) => {


	const [currentHover, setCurrentHover] = useState('');
	const [fileTitle, setFileTitle] = useState('');
	const [file, setFile] = useState({});
	const [btnIcon, setBtnIcon] = useState('Add');
	const [searchParams, setSearchParams] = useSearchParams();
	const [dropDownCities, setDropDownCities] = useState([]);
	const [dropDownStates, setDropDownStates] = useState([]);
	const navigateTo = useNavigate();

	const hoverHandler = (name) => {
		setCurrentHover(name);
	}


	let defaultbasicInfo = {
		company_name: '',
		empanelment: '',
		source_person_name: '',
		expansion: '',
		source_person_designation: '',
		passthrough_company_name: '',
		documents: [],
		template: []
	}

	const [basicInfo, setBasicInfo] = useState({ ...defaultbasicInfo });
	const [basicInfoerrors, setBasicInfoErrors] = useState({ ...defaultbasicInfo });

	let defaultBasicDetail = {
		contact_person: '',
		designation: '',
		reports_to: '',
		team: '',
		primary_email: '',
		alternate_email: '',
		primary_mobile: '',
		alternate_mobile: '',
	}

	const [basicDetails, setBasicDetails] = useState([{ ...defaultBasicDetail },])
	const [basicDetailserrors, setBasicDetailserrors] = useState([{ ...defaultBasicDetail }]);


	let defaultClientDetail = {
		company_address: '',
		city: '',
		state: '',
		website: '',
		linkedin: '',
		location: '',
	}

	const [clientDetails, setClientDetails] = useState([{ ...defaultClientDetail },])
	const [clientDetailserrors, setClientDetailserrors] = useState([{ ...defaultClientDetail }]);
	const [showUploadPopup, setShowUploadPopup] = useState(false);
	const [clientId, setClientId] = useState("")

	useEffect(() => {

		axiosJsonCall
			.get("/b/643fa67bebd26539d0ae2903")
			.then((res) => {
				let buffer = res.data.record;
				let dropdown_data = buffer.map((obj) => { return { key: obj.name, text: obj.name } });
				setDropDownCities(dropdown_data)
			})
			.catch((e) => { });

		axiosJsonCall
			.get("/b/643fa973ace6f33a220e556e")
			.then((res) => {
				let buffer = res.data.record;
				let dropdown_data = buffer.map((obj) => { return { key: obj.name, text: obj.name } });
				setDropDownStates(dropdown_data)
			})
			.catch((e) => { });
	}, [])

	const dropDownHandler = (e, item, name, key, setData, setErrors) => {
		setData((prevState) => {
			let update = [...prevState];
			update[key][name] = item.text;

			return update;
		});

		setErrors((prevState) => {
			let update = [...prevState];
			update[key][name] = '';

			return update;
		});

	};



	const inputChangeHandler = (e, name, setData, setErrors) => {

		const { value } = e.target
		let inputValue = value

		let isNameValid = false

		if (name === 'company_name' && nameInputRegex.test(inputValue)) {

			if (inputValue.length > 40) inputValue = inputValue.slice(0, 40)
			isNameValid = true
		}

		if (name === 'passthrough_company_name' && nameInputRegex.test(inputValue)) {
			if (inputValue.length > 40) inputValue = inputValue.slice(0, 40)
			isNameValid = true
		}

		if (name === 'source_person_name' && nameInputRegex.test(inputValue)) {
			if (inputValue.length > 40) inputValue = inputValue.slice(0, 40)
			isNameValid = true
		}

		if (name === 'source_person_designation' && nameInputRegex.test(inputValue)) {
			if (inputValue.length > 40) inputValue = inputValue.slice(0, 40)
			isNameValid = true
		}
		if (name === 'expansion' && nameInputRegex.test(inputValue)) {
			if (inputValue.length > 40) inputValue = inputValue.slice(0, 40)
			isNameValid = true
		}
		if (name === 'empanelment' && nameInputRegex.test(inputValue)) {
			if (inputValue.length > 40) inputValue = inputValue.slice(0, 40)
			isNameValid = true
		}



		if (isNameValid) {
			setData((prevState) => {
				return {
					...prevState,
					[name]: inputValue
				}
			})

			setErrors((prevState) => {
				return {
					...prevState,
					[name]: null
				}
			})

		}

	};


	const inputChangeHandler1 = (e, name, key, setData, setErrors) => {

		const { value } = e.target
		let inputValue = value

		let isNameValid = false

		if (name === 'contact_person') {
			isNameValid = true
		}

		if (name === 'company_address') {
			isNameValid = true
		}

		if (name === 'designation') {
			isNameValid = true
		}

		if (name === 'reports_to') {
			isNameValid = true
		}

		if (name === 'primary_email') {
			if (inputValue.length > 320) inputValue = inputValue.slice(0, 320)
			isNameValid = true
		}

		if (name === 'primary_mobile' && (inputValue === '' || !isNaN(inputValue))) {
			if (inputValue.length > 10) inputValue = inputValue.slice(0, 10)
			isNameValid = true
		}

		if (name === 'alternate_email') {
			if (inputValue.length > 320) inputValue = inputValue.slice(0, 320)
			isNameValid = true
		}

		if (name === 'alternate_mobile' && (inputValue === '' || !isNaN(inputValue))) {
			if (inputValue.length > 10) inputValue = inputValue.slice(0, 10)
			isNameValid = true
		}

		if (name === 'state') {
			isNameValid = true
		}

		if (name === 'city') {
			isNameValid = true
		}

		if (name === 'location') {
			isNameValid = true
		}

		if (name === 'linkedin') {
			isNameValid = true
		}

		if (name === 'website') {
			isNameValid = true
		}

		if (isNameValid) {
			setData((prevState) => {
				let update = [...prevState];
				update[key][name] = inputValue;

				return update;
			});

			setErrors((prevState) => {
				let errorupdate = [...prevState];
				errorupdate[key][name] = null;

				return errorupdate;
			});


			// console.log(basicDetailserrors)
		}

	};

	useEffect(() => {
		axiosPrivateCall(
			`/api/v1/client/getClientDetails?client_id=${searchParams.get(
				"client_id"
			)}`
		)
			.then((res) => {
				setApiData(res.data);
				setClientId(res.data.ClientId)
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	useEffect(() => { console.log('rendering..') }, [basicDetails, basicInfo, basicInfoerrors, basicDetailserrors, clientDetails, clientDetailserrors])

	function setApiData(data) {
		setBasicDetails([...data.basic_details])
		setClientDetails([...data.client_details])
		setBasicInfo({
			_id: data._id,
			company_name: data.company_name,
			passthrough_company_name: data.passthrough_company_name,
			source_person_name: data.source_person_name,
			source_person_designation: data.source_person_designation,
			expansion: data.expansion,
			empanelment: data.empanelment,
			documents: [...data.documents],
			template: [...data.template]
		})
	}
	console.log(basicInfo.template);
	function validate(values) {

		const errors = {}

		if (!values.company_name) {
			errors.company_name = 'Required'
		} else if (!nameInputRegex.test(values.company_name)) {
			errors.company_name = 'Invalid name'
		}

		if (!nameInputRegex.test(values.passthrough_company_name)) {
			errors.passthrough_company_name = 'Invalid name'
		}

		if (!values.source_person_name) {
			errors.source_person_name = 'Required'
		} else if (!nameInputRegex.test(values.source_person_name)) {
			errors.source_person_name = 'Invalid name'
		}

		if (!values.source_person_designation) {
			errors.source_person_designation = 'Required'
		} else if (!nameInputRegex.test(values.source_person_designation)) {
			errors.source_person_designation = 'Invalid name'
		}


		return errors;
	}

	function nestedValidate(values) {

		let errorArr = [];
		values.map((detail) => errorArr.push({}));

		values.map((detail, index) => {

			if (!nameInputRegex.test(detail.contact_person)) {
				errorArr[index].contact_person = 'Invalid name'
			}

			if (detail.primary_email) {
				if (!emailRegex.test(detail.primary_email)) {
					errorArr[index].primary_email = 'Invalid Email Id'
				}
			}

			if (detail.primary_mobile) {
				if (!mobileRegex.test(detail.primary_mobile)) {
					errorArr[index].primary_mobile = 'Invalid Mobile Number'
				}
			}

			if (detail.alternate_email) {
				if (!emailRegex.test(detail.alternate_email)) {
					errorArr[index].alternate_email = 'Invalid Email Id'
				}
			}

			if (detail.alternate_email) {
				if (!mobileRegex.test(detail.alternate_mobile)) {
					errorArr[index].alternate_mobile = 'Invalid Mobile Number'
				}
			}

		})

		return errorArr;
	}

	function nestedValidate1(values) {

		let errorArr = [];
		values.map((detail) => errorArr.push({}));

		values.map((detail, index) => {

			if (!detail.company_address) {
				errorArr[index].company_address = 'Required'
			}


			if (detail.website) {
				if (!websiteRegex.test(detail.website)) {
					errorArr[index].website = 'Invalid Website format'
				}
			}


			if (!detail.state) {
				errorArr[index].state = 'Required'
			}

			if (!detail.city) {
				errorArr[index].city = 'Required'
			}

		})

		return errorArr;
	}



	function sanitizer(obj, arrobj1, arrobj2) {
		let payload = { ...obj };
		payload.basic_details = [...arrobj1]
		payload.client_details = [...arrobj2];
		console.log(payload)
		return payload;
	}


	function submitHandler(e) {
		e.preventDefault();
		console.log('submit clicked')
		let errorsBasicInfoSet;
		let errorsBasicDetailSet;
		let errorsClientDetailSet;

		function analyseError(errorDataSet) {

			let answer = true;

			for (let i = 0; i < errorDataSet.length; i++) {
				if (!(Object.keys(errorDataSet[i]).length === 0)) {
					answer = false;
					break;
				}
			};

			return answer;
		}


		errorsBasicInfoSet = validate(basicInfo)
		errorsBasicDetailSet = nestedValidate(basicDetails);
		errorsClientDetailSet = nestedValidate1(clientDetails);

		let stage1 = (Object.keys(errorsBasicInfoSet).length === 0);
		let stage2 = analyseError(errorsBasicDetailSet);
		let stage3 = analyseError(errorsClientDetailSet);


		// console.log(errorsBasicInfoSet);


		if (stage1 && stage2 && stage3) {
			let update = sanitizer(basicInfo, basicDetails, clientDetails);

			axiosPrivateCall.post('/api/v1/client/updateClient', update).then(res => {
				console.log(res)
				submitForm();

			}).catch(e => {
				console.log(e);
			})

		}
		else {
			setBasicInfoErrors(errorsBasicInfoSet);
			setBasicDetailserrors([...errorsBasicDetailSet]);
			setClientDetailserrors([...errorsClientDetailSet]);
			console.log('error');
		}

	}

	function submitForm() {

		navigateTo(`/masterlist/manageclient`);

	};


	function handleRemoveItem(key, setData, setErrors) {

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



	function addField(setData, setErrors, defaultData) {
		setData((prevState) => [...prevState, { ...defaultData }]);
		setErrors((prevState) => [...prevState, { ...defaultData }]);
	}


	function UploadHandler() {
		setShowUploadPopup(true);
	}

	function handleDel() {
		setBasicInfo((prev) => {
			let buffer = { ...prev }
			buffer.documents = [];
			return buffer;
		})
	}

	function uploadExcel(e) {
		if (
			e.target.files[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
			e.target.files[0].type === "application/vnd.ms-excel" ||
			e.target.files[0].type === "application/excel"
		) {
			setFileTitle("uploading");
			let files = e.target.files[0];
			let formdata = new FormData();
			formdata.append("files", files);

			axiosPrivateCall
				.post("/api/v1/client/addClientTemplate", formdata)
				.then((res) => {
					console.log(res, "ress")
					setBasicInfo((prevState) => {
						return { ...prevState, template: res.data.template };
					});
					setBasicInfoErrors((prevState) => {
						return { ...prevState, template: "" };
					});
					setFileTitle(" ");
					setBtnIcon("Accept");
				})
				.catch((e) => {
					console.log(e, "err");
				});

			console.log(file);
		} else {
			setBasicInfoErrors((prevState) => {
				return { ...prevState, template: "Invalid" };
			});
			setFileTitle(" ");
			setBtnIcon("Cancel");
			console.log(btnIcon, "lkkk");
		}
	}

	function deleteExcel() {
		setBasicInfo((prev) => {
			let buffer = { ...prev }
			buffer.template = [];
			return buffer;
		})
		setBtnIcon("Add")
	}


	return (

		<div className={styles.pages}>
			{<UploadPopup showPopup={showUploadPopup}
				setShowPopup={setShowUploadPopup}
				basicInfo={basicInfo}
				setBasicInfo={setBasicInfo} />}

			<div className={styles.addcandidate_modal_header_container}>
				<div className={styles.header_tag_expand_close_icon_container}>

					<div className={styles.header_tag_container}>
						Client
					</div>

				</div>

				<div className={styles.header_content_container}>

					<div className={styles.header_content_title_container}>
						<div className={styles.header_content_title_container}>
							Client Id : {clientId ? clientId : ""}
						</div>

						<div className={styles.header_content_save_container}>

							<div className={styles.header_save_close_btns_container}>

								<div className={styles.resumeConsole}>
									<div className={styles.resume_conatiner} >
										<DefaultButton onClick={() => UploadHandler()} className={`${styles.resumeEl} ${basicInfoerrors.resume_url ? styles.errorBtn : styles.regularBtn}`}>
											<div className={styles.resumebtn}>
												<div className={styles.statusIcn} >
													<FontIcon className={styles.Icn} iconName={(basicInfo.documents.length) ? 'Accept' : `Add`} />
												</div>

												<div className={styles.statustxt}>{`Attach File`}</div>
											</div>

										</DefaultButton>

									</div>

									{(basicInfo.documents.length) ? <Icon title='Delete all uploaded documents' iconName='ChromeClose' className={tableCloseIconClass} onClick={() => handleDel()} /> : null}

								</div>

								<PrimaryButton text={`Save & Close`}
									onClick={submitHandler}
									iconProps={{ iconName: "Save" }} />
							</div>

						</div>
					</div>
				</div>
			</div>

			<div className={styles.addemployee_modal_main_container}>

				<div className={styles.main_filter_options_container}>

					<div className={styles.subcontainer}>

						<div className={styles.main_dropdown_container1}>
							<div className={styles.main_repotingmanager_title}><Label required className={styles.required_field_heding}>Company Name</Label></div>
							<div className={(basicInfo.company_name || basicInfoerrors.company_name) ? styles.showfield : styles.hidefield} >
								<TextField type="text"
									name="company_name"
									onChange={(e) => { inputChangeHandler(e, 'company_name', setBasicInfo, setBasicInfoErrors); }}
									value={basicInfo.company_name}
									placeholder={'Enter the Name'}
									styles={basicInfoerrors.company_name ? FieldError : Field1} />
							</div>
						</div>

						<div className={styles.main_dropdown_container}>
							<div className={styles.main_repotingmanager_title}>Empanelment</div>
							<div className={(basicInfo.empanelment || basicInfoerrors.empanelment) ? styles.showfield : styles.hidefield} >
								<TextField type="text"
									name="empanelment"
									onChange={(e) => { inputChangeHandler(e, 'empanelment', setBasicInfo, setBasicInfoErrors); }}
									value={basicInfo.empanelment}
									placeholder={'Enter the Details'}
									styles={basicInfoerrors.empanelment ? FieldError : Field1} />
							</div>
						</div>

					</div>


					<div className={styles.subcontainer}>

						<div className={styles.main_dropdown_container}>
							<div className={styles.main_repotingmanager_title}><Label required className={styles.required_field_heding}>Source Person's Name</Label></div>
							<div className={(basicInfo.source_person_name || basicInfoerrors.source_person_name) ? styles.showfield : styles.hidefield} >
								<TextField type="text"
									name="source_person_name"
									onChange={(e) => { inputChangeHandler(e, 'source_person_name', setBasicInfo, setBasicInfoErrors); }}
									value={basicInfo.source_person_name}
									placeholder={`Enter the Name`}
									styles={basicInfoerrors.source_person_name ? FieldError : Field1} />
							</div>
						</div>

						<div className={styles.main_dropdown_container}>
							<div className={styles.main_repotingmanager_title}>Expansion</div>
							<div className={(basicInfo.expansion || basicInfoerrors.expansion) ? styles.showfield : styles.hidefield} >
								<TextField type="text"
									name="expansion"
									onChange={(e) => { inputChangeHandler(e, 'expansion', setBasicInfo, setBasicInfoErrors); }}
									value={basicInfo.expansion}
									placeholder={'Enter the Details'}
									styles={basicInfoerrors.expansion ? FieldError : Field1} />
							</div>
						</div>
					</div>

					<div className={styles.subcontainer}>

						<div className={styles.main_dropdown_container}>
							<div className={styles.main_repotingmanager_title}><Label required className={styles.required_field_heding}>Designation of Source Person</Label></div>
							<div className={(basicInfo.source_person_designation || basicInfoerrors.source_person_designation) ? styles.showfield : styles.hidefield} >
								<TextField type="text"
									name="source_person_designation"
									onChange={(e) => { inputChangeHandler(e, 'source_person_designation', setBasicInfo, setBasicInfoErrors); }}
									value={basicInfo.source_person_designation}
									placeholder={'Enter the Designation'}
									styles={basicInfoerrors.source_person_designation ? FieldError : Field1} />
							</div>
						</div>


						<div className={styles.main_dropdown_container}>
							<div className={styles.main_repotingmanager_title}>Passthrough Company Name</div>
							<div className={(basicInfo.passthrough_company_name || basicInfoerrors.passthrough_company_name) ? styles.showfield : styles.hidefield} >
								<TextField type="text"
									name="passthrough_company_name"
									onChange={(e) => { inputChangeHandler(e, 'passthrough_company_name', setBasicInfo, setBasicInfoErrors); }}
									value={basicInfo.passthrough_company_name}
									placeholder={'Enter the Name'}
									styles={basicInfoerrors.passthrough_company_name ? FieldError : Field1} />
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
													Reports to
												</div>
											</th>

											<th className={styles.table_headerContents} >
												<div className={styles.table_heading}>
													Team
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
										{basicDetails?.map((detail, index) =>
										(<tr key={index} className={styles.table_row}>

											<td className={styles.table_dataContents}>

												<div className={(basicDetails[index]?.contact_person || basicDetailserrors[index]?.contact_person) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="contact_person"
														onChange={(e) => { inputChangeHandler1(e, 'contact_person', index, setBasicDetails, setBasicDetailserrors); }}
														value={basicDetails[index]?.contact_person}
														placeholder={'Enter the Name'}
														errorMessage={basicDetailserrors[index]?.contact_person}
														styles={Field} />
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(basicDetails[index]?.designation || basicDetailserrors[index]?.designation) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="designation"
														onChange={(e) => { inputChangeHandler1(e, 'designation', index, setBasicDetails, setBasicDetailserrors); }}
														value={basicDetails[index]?.designation}
														placeholder={'Enter the Designation'}
														errorMessage={basicDetailserrors[index]?.designation}
														styles={Field} />
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(basicDetails[index]?.reports_to || basicDetailserrors[index]?.reports_to) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="reports_to"
														onChange={(e) => { inputChangeHandler1(e, 'reports_to', index, setBasicDetails, setBasicDetailserrors); }}
														value={basicDetails[index]?.reports_to}
														placeholder={'Enter their Reporting Person'}
														errorMessage={basicDetailserrors[index]?.reports_to}
														styles={Field} />
												</div>


											</td>

											<td className={styles.table_dataContents}>
												<div id='team'
													className={(basicDetails[index]?.team || basicDetailserrors[index]?.team) ? styles.showfield : styles.hidefield} >
													<Dropdown placeholder='Select' onClick={() => hoverHandler('team')}
														options={dropdownTeam}
														onChange={(e, item) => { dropDownHandler(e, item, 'team', index, setBasicDetails, setBasicDetailserrors); setCurrentHover('') }}
														errorMessage={basicDetailserrors[index]?.team}
														selectedKey={basicDetails[index]?.team}
														styles={basicDetailserrors[index]?.team ? dropDownErrorStyles : currentHover === 'team' ? dropDownActive : dropDownStyles} />
												</div>
											</td>

											<td className={styles.table_dataContents}>

												<div className={(basicDetails[index]?.primary_email || basicDetailserrors[index]?.primary_email) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="primary_email"
														onChange={(e) => { inputChangeHandler1(e, 'primary_email', index, setBasicDetails, setBasicDetailserrors); }}
														value={basicDetails[index]?.primary_email}
														placeholder={'Email ID'}
														errorMessage={basicDetailserrors[index]?.primary_email}
														styles={Field} />
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(basicDetails[index]?.alternate_email || basicDetailserrors[index]?.alternate_email) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="alternate_email"
														onChange={(e) => { inputChangeHandler1(e, 'alternate_email', index, setBasicDetails, setBasicDetailserrors); }}
														value={basicDetails[index]?.alternate_email}
														placeholder={'Email ID'}
														errorMessage={basicDetailserrors[index]?.alternate_email}
														styles={Field} />
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(basicDetails[index]?.primary_mobile || basicDetailserrors[index]?.primary_mobile) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="primary_mobile"
														onChange={(e) => { inputChangeHandler1(e, 'primary_mobile', index, setBasicDetails, setBasicDetailserrors); }}
														value={basicDetails[index]?.primary_mobile}
														placeholder={'Mobile Number'}
														errorMessage={basicDetailserrors[index]?.primary_mobile}
														styles={Field} />
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(basicDetails[index]?.alternate_mobile || basicDetailserrors[index]?.alternate_mobile) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="alternate_mobile"
														onChange={(e) => { inputChangeHandler1(e, 'alternate_mobile', index, setBasicDetails, setBasicDetailserrors); }}
														value={basicDetails[index]?.alternate_mobile}
														placeholder={'Mobile Number'}
														errorMessage={basicDetailserrors[index]?.alternate_mobile}
														styles={Field} />
												</div>


											</td>


											<td className={styles.table_dataContents}>
												<div className={(basicDetails[index]?.id || basicDetailserrors[index]?.id) ? styles.showfield : styles.hidefield} >
													<Icon key={index} iconName='ChromeClose' className={tableCloseIconClass} onClick={() => { if (basicDetails.length > 1) handleRemoveItem(index, setBasicDetails, setBasicDetailserrors) }} />
												</div>
											</td>

										</tr>))}
									</tbody>

								</table>
							</div>

						</div>

					</div>




					<div className={styles.main_basic_information_container}>


						<div className={styles.main_basic_information_title2}>
							<div>CLIENT INFORMATION</div>
							<div className={styles.add_btn} onClick={() => addField(setClientDetails, setClientDetailserrors, defaultClientDetail)}>+ Add</div>
						</div>

						<div className={styles.main_basic_information_content_container}>

							<div className={styles.table_container}>
								<table>
									<thead className={styles.table_header}>
										<tr className={styles.table_row1}>

											<th className={styles.table_headerContents} >
												<div className={styles.table_heading}>
													<Label className={styles.required_field_heding} required>Company Address</Label>
												</div>
											</th>

											<th className={styles.table_headerContents} >
												<div className={styles.table_heading}>
													<Label className={styles.required_field_heding} required>City</Label>
												</div>
											</th>

											<th className={styles.table_headerContents} >
												<div className={styles.table_heading}>
													<Label className={styles.required_field_heding} required>State</Label>
												</div>
											</th>

											<th className={styles.table_headerContents} >
												<div className={styles.table_heading}>
													LinkedIn URL
												</div>
											</th>

											<th className={styles.table_headerContents} >
												<div className={styles.table_heading}>
													Company Website
												</div>
											</th>

											<th className={styles.table_headerContents} >
												<div className={styles.table_heading}>
													Location
												</div>
											</th>

											<th className={styles.table_headerContents} >
												<div className={styles.table_heading}>

												</div>
											</th>
										</tr>
									</thead>

									<tbody>
										{clientDetails?.map((detail, index) =>
										(<tr key={index} className={styles.table_row}>

											<td className={styles.table_dataContents}>

												<div className={(clientDetails[index]?.company_address || clientDetailserrors[index]?.company_address) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="company_address"
														onChange={(e) => { inputChangeHandler1(e, 'company_address', index, setClientDetails, setClientDetailserrors); }}
														value={clientDetails[index]?.company_address}
														placeholder={'Enter Company Address'}
														errorMessage={clientDetailserrors[index]?.company_address}
														styles={FieldL} />
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(clientDetails[index]?.city || clientDetailserrors[index]?.city) ? styles.showfield : styles.hidefield} >
													{/* <TextField  type="text" 
																name="city" 
																onChange={(e)=>{inputChangeHandler1(e,'city',index,setClientDetails,setClientDetailserrors); }} 
																value = {clientDetails[index]?.city}
																placeholder={'Enter City'}
																errorMessage={clientDetailserrors[index]?.city} 
																styles={Field} /> */}

													<ComboBox
														type='text'
														name='city'
														index={index}
														inputChangeHandler={inputChangeHandler1}
														setInfo={setClientDetails}
														setInfoErrors={setClientDetailserrors}
														value={clientDetails[index]?.city}
														errorMessage={clientDetailserrors[index]?.city}
														dropdown={dropDownCities}
														placeholder={'Enter City'}
													/>
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(clientDetails[index]?.state || clientDetailserrors[index]?.state) ? styles.showfield : styles.hidefield} >
													{/* <TextField  type="text" 
																name="state" 
																onChange={(e)=>{inputChangeHandler1(e,'state',index,setClientDetails,setClientDetailserrors); }} 
																value = {clientDetails[index]?.state}
																placeholder={'Enter State'}
																errorMessage={clientDetailserrors[index]?.state} 
																styles={Field} /> */}

													<ComboBox
														type='text'
														name='state'
														index={index}
														inputChangeHandler={inputChangeHandler1}
														setInfo={setClientDetails}
														setInfoErrors={setClientDetailserrors}
														value={clientDetails[index]?.state}
														errorMessage={clientDetailserrors[index]?.state}
														dropdown={dropDownStates}
														placeholder={'Enter State'}
													/>
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(clientDetails[index]?.linkedin || clientDetailserrors[index]?.linkedin) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="linkedin"
														onChange={(e) => { inputChangeHandler1(e, 'linkedin', index, setClientDetails, setClientDetailserrors); }}
														value={clientDetails[index]?.linkedin}
														placeholder={'LinkedIn URL'}
														errorMessage={clientDetailserrors[index]?.linkedin}
														styles={Field} />
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(clientDetails[index]?.website || clientDetailserrors[index]?.website) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="website"
														onChange={(e) => { inputChangeHandler1(e, 'website', index, setClientDetails, setClientDetailserrors); }}
														value={clientDetails[index]?.website}
														placeholder={'Enter the URL'}
														errorMessage={clientDetailserrors[index]?.website}
														styles={Field} />
												</div>


											</td>

											<td className={styles.table_dataContents}>

												<div className={(clientDetails[index]?.location || clientDetailserrors[index]?.location) ? styles.showfield : styles.hidefield} >
													<TextField type="text"
														name="location"
														onChange={(e) => { inputChangeHandler1(e, 'location', index, setClientDetails, setClientDetailserrors); }}
														value={clientDetails[index]?.location}
														placeholder={'Enter the Location'}
														errorMessage={clientDetailserrors[index]?.location}
														styles={Field} />
												</div>


											</td>


											<td className={styles.table_dataContents}>
												<div className={(clientDetails[index]?.id || clientDetailserrors[index]?.id) ? styles.showfield : styles.hidefield} >
													<Icon key={index} iconName='ChromeClose' className={tableCloseIconClass} onClick={() => { if (clientDetails.length > 1) handleRemoveItem(index, setClientDetails, setClientDetailserrors) }} />
												</div>
											</td>

										</tr>))}
									</tbody>

								</table>
							</div>

						</div>



					</div>
					{/* Client Template */}


					<div className={styles.main_basic_information_container}>


						<div className={styles.main_basic_information_title2}>
							<div>CLIENT TEMPLATE</div>
						</div>

						<div className={styles.main_basic_information_content_container}>

							<div className={styles.table_container}>
								<table>
									<thead className={styles.table_header}>
										<tr className={styles.table_row1}>

											<th className={styles.table_headerContents12} >
												<div className={styles.table_heading}>
													<br />
													<div className={styles.resumeConsole}>
														<div className={styles.resume_conatiner} >
															<DefaultButton className={`${styles.resumeEl} ${basicInfoerrors.resume_url ? styles.errorBtn : styles.regularBtn}`}>
																<div className={styles.resumebtn}>
																	{/* <div className={styles.statusIcn} >
														<FontIcon className={styles.Icn} iconName={(basicInfo.documents.length) ? 'Accept': `${btnIcon}`}  />
													</div> */}

																	<div className={styles.statusIcn}>
																		{fileTitle === "uploading" ? (
																			<Spinner
																				className={styles.Icn1}
																				size={SpinnerSize.medium}
																			/>
																		) : null}
																		{fileTitle === "uploading" ? null : (
																			<FontIcon
																				className={styles.Icn}
																				iconName={
																					`${btnIcon}`
																				}
																			/>
																		)}
																	</div>
																	<div className={styles.statustxt}>
																		{basicInfoerrors.template
																			? basicInfoerrors.template === "Invalid"
																				? `Invalid Format`
																				: `Update Template`
																			: `Update Template`}
																	</div>
																</div>

															</DefaultButton>
															<input
																className={`${styles.resumeEl}`}
																style={{ opacity: "0" }}
																type="file"
																name="template"
																id="template-upload"
																onChange={(e) => uploadExcel(e)}
															/>
														</div>
														{/* {console.log(basicInfo?.template?.length, btnIcon, "lkk", basicInfo.template?.length ? "Accept" : `${btnIcon}`)} */}
														{/* {(basicInfo.template?.length) ? <Icon title='Delete Template' iconName='ChromeClose' className={tableCloseIconClass} onClick={() => deleteExcel()}/> : null}	 */}
													</div>

												</div>
											</th>
										</tr>
									</thead>

									<tbody>

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




export default AddCandidateModal;







