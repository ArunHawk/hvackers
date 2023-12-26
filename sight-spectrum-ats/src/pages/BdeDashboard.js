import React, { useState, useEffect } from "react";
import { FontIcon, mergeStyles, mergeStyleSets, initializeIcons } from "@fluentui/react";
import Carousel, { consts } from 'react-elastic-carousel';
import { CircularProgressbar } from 'react-circular-progressbar';
import { DatePicker } from "@fluentui/react";
import 'react-circular-progressbar/dist/styles.css';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import styles from "./BdeDashboard.module.css"
import empanelment from '../assets/empanelment.jpg'
import expansion from '../assets/expansion.jpg'
import activedemand from '../assets/activedemand.jpg'
import overalldemand from '../assets/overalldemand.jpg'
import HierarchyView from "./HierarchyView";
import { axiosPrivateCall } from "../constants";
import { get } from "draft-js/lib/DraftEntity";
import SubmissionHierarchyView from "./SubmissionHierarchyView";
import InterviewHierarchyView from "./InterviewHierarchyView"
import DemandHierarchyView from "./DemandHierarchyView";
import EmpanelmentHierarchyView from "./EmpanelmentHierarchyView";
import ExpansionHierarchyView from "./ExpansionHierarchyView";
import { debounce } from 'lodash';

const MyArrows = ({ type, onClick, isEdge }) => {
	return (
		<div className={styles.dashboard_carousel_arrows} onClick={onClick} disabled={isEdge}>
			{/* Remove the arrow symbols */}
		</div>
	);
};

const iconClass = mergeStyles({
	fontSize: 20,
	height: 10,
	width: 10,
	margin: '0 10px',
	color: '#999DA0',
	cursor: 'pointer',
	userSelect: 'none',
	marginBottom: '10px'
});
const iconClass1 = mergeStyles({
	fontSize: 20,
	height: 20,
	width: 20,
	margin: '0 300px',
	color: '#999DA0',
	cursor: 'pointer',
	userSelect: 'none',
});

const calendarClass = mergeStyleSets({
	root: {
		"*::placeholder": {
			fontWeight: "400",
		},
		"*": {
			minWidth: "100px",
			maxWidth: "120px",
			fontSize: 12,
			height: "22px !important",
			lineHeight: "20px !important",
			// display: "flex",
			fontWeight: "bold",
		},
	},
	icon: {
		height: "8px !important",
		width: "8px !important",
		top: "5%",
		left: "70%",
		padding: "0px 0px",
		scale: "90%",
	},
	statusMessage: { marginBottom: "-25px" },
});

const BdeDashboard = () => {

	const [isActiveHierarchyViewOpen, setIsActiveHierarchyViewOpen] = useState(false)
	const [isSubmissionHierarchyViewOpen, setIsSubmissionHierarchyViewOpen] = useState(false)
	const [isEmpanelmentHierarchyViewOpen, setIsEmpanelmentHierarchyViewOpen] = useState(false)
	const [isDemandHierarchyViewOpen, setIsDemandHierarchyViewOpen] = useState(false)
	const [isExpansionHierarchyViewOpen, setIsExpansionHierarchyViewOpen] = useState(false)

	const [isInterviewHierarchyViewOpen, setIsInterviewHierarchyViewOpen] = useState(false)
	const [setDateClicked, setSetDateClicked] = useState(false);
	const [dashboardDetails, setDashboardDetails] = useState();
	console.log(dashboardDetails, "s")
	const [empanelmentCount, setEmpanelmentCount] = useState(null);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('')
	initializeIcons();
	const [loading, setLoading] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [fetchOptions, setFetchOptions] = useState({
		skip: 0,
		limit: 15,
		sort_field: 'updatedAt',
		sort_type: -1,
		search_field: ''
	})

	const handleRefreshClick = () => {
		// getDashBoardDetails();
		setStartDate('')
		setEndDate('')
		setSetDateClicked(false)

	};

	const getDashBoardDetails = debounce(() => {

		if (startDate && endDate) {
			axiosPrivateCall.get(`api/v1/BDE/aggregate_BDE_data?start_date=${formateDate(startDate)}&end_date=${formateDate(endDate)}`).then(res => {
				setDashboardDetails(res.data);
				setSetDateClicked(true);
			}).catch(e => console.log(e))
		}

		else {
			axiosPrivateCall.get('api/v1/BDE/aggregate_BDE_data').then(res => {
				setDashboardDetails(res.data);
				setSetDateClicked(false);
			}).catch(e => console.log(e))
		}
	}, 500)

	const setDateHandler = () => {
		if (endDate > startDate) {
			getDashBoardDetails();
		}
	}

	const onFormatDate = (date) => {
		if (!date) {
			return '';
		}
		return date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() % 100);
	};

	const formateDate = (date) => {

		if (date) {

			const year = date.getFullYear(); // Get the four-digit year
			const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (adding 1 since it's zero-based) and pad with leading zero if necessary
			const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if necessary

			const formattedDate = `${year}-${month}-${day}`;

			return formattedDate
		}

	}

	const downloadDemands = () => {
		setLoading(true);
		// setTimeout(() => {
		if (startDate && endDate) {
			axiosPrivateCall
				.get(`api/v1/BDE/downloadOverallPerformance?start_date=${formateDate(startDate)}&end_date=${formateDate(endDate)}`, {
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
			// }, 1000);
		} else {
			axiosPrivateCall
				.get(`api/v1/BDE/downloadOverallPerformance`, {
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

		}
	};


	useEffect(() => {

		getDashBoardDetails()

	}, [])

	const onStartDateChange = (date) => {
		setStartDate(date);
		setEndDate(null);
	}

	const minEndDate = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) : undefined;

	return (

		<div className={styles.page}>

			{isActiveHierarchyViewOpen && <HierarchyView isModalOpen={isActiveHierarchyViewOpen} setIsModalOpen={setIsActiveHierarchyViewOpen} startDate={startDate} endDate={endDate} />}
			{isSubmissionHierarchyViewOpen && <SubmissionHierarchyView isModalOpen={isSubmissionHierarchyViewOpen} setIsModalOpen={setIsSubmissionHierarchyViewOpen} startDate={startDate} endDate={endDate} />}
			{isDemandHierarchyViewOpen && <DemandHierarchyView isModalOpen={isDemandHierarchyViewOpen} setIsModalOpen={setIsDemandHierarchyViewOpen} startDate={startDate} endDate={endDate} />}
			{isEmpanelmentHierarchyViewOpen && <EmpanelmentHierarchyView isModalOpen={isEmpanelmentHierarchyViewOpen} setIsModalOpen={setIsEmpanelmentHierarchyViewOpen} startDate={startDate} endDate={endDate} />}
			{isExpansionHierarchyViewOpen && <ExpansionHierarchyView isModalOpen={isExpansionHierarchyViewOpen} setIsModalOpen={setIsExpansionHierarchyViewOpen} startDate={startDate} endDate={endDate} />}
			{isInterviewHierarchyViewOpen && <InterviewHierarchyView isModalOpen={isInterviewHierarchyViewOpen} setIsModalOpen={setIsInterviewHierarchyViewOpen} startDate={startDate} endDate={endDate} />}

			<div className={styles.container}>

				<div className={styles.dashboard_title_calendar_container}>

					<div className={styles.dashboard_title_container}>
						BDE Dashboard
					</div>

					<div className={styles.dashboard_date_picker_container}>
						<DatePicker styles={calendarClass} placeholder="Start Date" formatDate={onFormatDate} value={startDate} onSelectDate={onStartDateChange} maxDate={new Date()} />

						<DatePicker styles={calendarClass} placeholder="End Date" formatDate={onFormatDate} value={endDate} minDate={minEndDate} onSelectDate={(date) => setEndDate(date)} maxDate={new Date()} disabled={!startDate} />

						<PrimaryButton text={'Set Date'} onClick={setDateHandler} />
						<FontIcon iconName="refresh" className={iconClass}
							onClick={handleRefreshClick}
						/>

					</div>

				</div>

				<div className={styles.dashboard_tiles_container}>

					<Carousel itemsToShow={5} renderArrow={MyArrows}>
						<div onClick={() => setIsEmpanelmentHierarchyViewOpen(true)} className={styles.dashboard_tile}>
							<div className={styles.dashboard_tile_img}>
								<img src={empanelment} alt='EMPANELMENT' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								EMPANELMENT

							</div>
							<div className={styles.dashboard_tile_count}>
								{setDateClicked && dashboardDetails?.overallEmpanelment !== null ? (
									<div className={styles.itemContainer}>
										<div className={styles.setdatecount}>
											<span className={styles.number}>{dashboardDetails?.overallEmpanelment}</span>
										</div>
									</div>
								) : (
									<>
										<div className={styles.itemContainer}>
											<div>
												<span className={styles.number}>
													{dashboardDetails?.weekempanelmentCount}
												</span>
											</div>
											<div>
												<span className={styles.label}>WEEK</span>
											</div>
										</div>
										<div className={styles.itemContainer}>
											<div>
												<span className={styles.number}>
													{dashboardDetails?.monthEmpanelmentCount}
												</span>
											</div>
											<div>
												<span className={styles.label}>MONTH</span>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
						<div onClick={() => setIsExpansionHierarchyViewOpen(true)} className={styles.dashboard_tile}>

							<div className={styles.dashboard_tile_img}>
								<img src={expansion} alt='EXPANSION' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								EXPANSION

							</div>
							<div className={styles.dashboard_tile_count}>
								{setDateClicked && dashboardDetails?.overallExpansion !== null ? (
									<div className={styles.itemContainer}>
										<div className={styles.setdatecount}>
											<span className={styles.number}>{dashboardDetails?.overallExpansion}</span>
										</div>
									</div>
								) : (
									<>
										<div className={styles.itemContainer}>
											<div>
												<span className={styles.number}>
													{dashboardDetails?.weekexpansionCount}
												</span>
											</div>
											<div>
												<span className={styles.label}>WEEK</span>
											</div>
										</div>
										<div className={styles.itemContainer}>
											<div>
												<span className={styles.number}>
													{dashboardDetails?.monthExpansionCount}
												</span>
											</div>
											<div>
												<span className={styles.label}>MONTH</span>
											</div>
										</div>
									</>
								)}
							</div>						</div>
						<div onClick={() => setIsDemandHierarchyViewOpen(true)} className={styles.dashboard_tile}>

							<div className={styles.dashboard_tile_img}>
								<img src={activedemand} alt='Active Demand' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								ACTIVE DEMAND

							</div>
							<div className={styles.dashboard_tile_count}>
								{setDateClicked && dashboardDetails?.activeDemand !== null ? (
									<div className={styles.itemContainer}>
										<div className={styles.setdatecount}>
											<span className={styles.number}>{dashboardDetails?.activeDemand}</span>
										</div>
									</div>
								) : (
									<>
										<div className={styles.itemContainer}>
											<div>
												<span className={styles.number}>
													{dashboardDetails?.ActiveDemandWeeklyCount}
												</span>
											</div>
											<div>
												<span className={styles.label}>WEEK</span>
											</div>
										</div>
										<div className={styles.itemContainer}>
											<div>
												<span className={styles.number}>
													{dashboardDetails?.ActiveDemandMonthlyCount}
												</span>
											</div>
											<div>
												<span className={styles.label}>MONTH</span>
											</div>
										</div>
									</>
								)}
							</div>						</div>
						<div className={styles.dashboard_tile}>

							<div className={styles.dashboard_tile_img}>
								<img src={overalldemand} alt='Overall Demand' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								OVERALL DEMAND

							</div>
							<div className={styles.dashboard_tile_count}>
								{setDateClicked && dashboardDetails?.overallDemand !== null ? (
									<div className={styles.itemContainer}>
										<div className={styles.setdatecount}>
											<span className={styles.number}>{dashboardDetails?.overallDemand}</span>
										</div>
									</div>
								) : (
									<>
										<div className={styles.itemContainer}>
											<div>
												<span className={styles.number}>
													{dashboardDetails?.OverallDemandWeeklyCount}
												</span>
											</div>
											<div>
												<span className={styles.label}>WEEK</span>
											</div>
										</div>
										<div className={styles.itemContainer}>
											<div>
												<span className={styles.number}>
													{dashboardDetails?.OverallDemandMonthlyCount}
												</span>
											</div>
											<div>
												<span className={styles.label}>MONTH</span>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</Carousel>
				</div>

				<div className={styles.dashboard_progress_bar_container}>

					<Carousel itemsToShow={3} renderArrow={MyArrows}>
						<div className={styles.dashboard_comparison_tile} >

							<div className={styles.dashboard_comparison_tile_title}>
								Overall Performance
								<FontIcon iconName="Download" className={iconClass1} onClick={downloadDemands} />
							</div>
							<Carousel itemsToShow={2} renderArrow={MyArrows}>
								<div className={styles.dashboard_tile1}>
									<div className={styles.dashboard_tile_title1}>
										OVERALL DEMAND
									</div>
									<div className={styles.dashboard_tile_count1}>
										{dashboardDetails?.OverallDemandMonthlyCount}
									</div>
								</div>
								<div className={styles.dashboard_tile1}>
									<div className={styles.dashboard_tile_title1}>
										OVERALL EXPANSION
									</div>
									<div className={styles.dashboard_tile_count1}>
										{dashboardDetails?.overallExpansionCount}
									</div>
								</div>
							</Carousel>
							<div className={styles.dashboard_tile2} style={{ display: 'flex', alignItems: 'center', width: '420px' }}>
								<div className={styles.dashboard_tile_title2} style={{ flex: '1', width: '210px' }}>
									OVERALL EMPANELMENT
								</div>
								<div className={styles.dashboard_tile_count2} style={{ width: '210px' }}>
									{dashboardDetails?.overallEmpanelmentCount}
								</div>
							</div>

						</div>
						<div className={styles.dashboard_comparison_tile1} >

							<div className={styles.dashboard_comparison_tile_title}>
								Overall Demand vs Active Demand

							</div>

							<div className={styles.dashboard_circular_progress_bar_container}>

								<div style={{ width: 110, height: 110 }}  >

									<CircularProgressbar value={((dashboardDetails?.ActiveDemandMonthlyCount / dashboardDetails?.OverallDemandMonthlyCount) * 100)} styles={
										{
											path: {
												// Path color
												stroke: `rgba(129, 205, 123, 1)`,
												// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
												strokeLinecap: 'butt',
											},
											trail: {
												stroke: '#F27163',
												// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
												strokeLinecap: 'butt',
											},

											text: {
												// Text color
												fill: '#F27163',
												// Text size
												fontSize: '16px',
											},
										}} />
								</div>
							</div>
							<div className={styles.dashboard_comparison_titles_container}>

								<div className={styles.dashboard_comparison_title_1_container}>

									<div className={styles.dashboard_comparison_title_1_title} >
										OVERALL
										<br />
										DEMAND
									</div>

									<div className={styles.dashboard_comparison_title_2_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.OverallDemandMonthlyCount}
									</div>

								</div>

								<div className={styles.dashboard_comparison_title_2_container}>

									<div className={styles.dashboard_comparison_title_2_title} >
										ACTIVE
										<br />
										DEMAND
									</div>

									<div className={styles.dashboard_comparison_title_1_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.ActiveDemandMonthlyCount}

									</div>

								</div>

							</div>

						</div>

					</Carousel>

				</div>

			</div>
		</div>
	)
}

export default BdeDashboard;