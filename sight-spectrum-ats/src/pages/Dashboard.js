import React, { useState, useEffect } from "react";
import styles from './Dashboard.module.css'
import { FontIcon, mergeStyleSets } from "@fluentui/react";
import Carousel, { consts } from 'react-elastic-carousel';
import { CircularProgressbar } from 'react-circular-progressbar';
import { DatePicker } from "@fluentui/react";
import 'react-circular-progressbar/dist/styles.css';
import { PrimaryButton } from '@fluentui/react/lib/Button';

import './Dashboard.css'


// svg icons

import activedemands from '../assets/activedemands.svg'
import demands from '../assets/demands.svg'
import submissions from '../assets/submissions.svg'
import interviews from '../assets/interviews.svg'
import offered from '../assets/offered.svg'
import joined from '../assets/joined.svg'
import HierarchyView from "./HierarchyView";
import HierarchyCard from "../components/HierarchyCard";
import HierarchyArrow from "../components/HieraryArrow";



//api
import { axiosPrivateCall } from "../constants";
import { get } from "draft-js/lib/DraftEntity";
import SubmissionHierarchyView from "./SubmissionHierarchyView";
import InterviewHierarchyView from "./InterviewHierarchyView"



const MyArrows = ({ type, onClick, isEdge }) => {

	const pointer = type === consts.PREV ? '<' : '>'
	return (
		<div className={styles.dashboard_carousel_arrows} onClick={onClick} disabled={isEdge}>
			{pointer}
		</div>
	)


}

const calendarClass = mergeStyleSets({
	root: {
		"*::placeholder": {
			fontWeight: "400", // Change the fontWeight property to a lighter value, e.g., 400
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

const Dashboard = () => {

	const [isActiveHierarchyViewOpen, setIsActiveHierarchyViewOpen] = useState(false)
	const [isSubmissionHierarchyViewOpen, setIsSubmissionHierarchyViewOpen] = useState(false)

	const [isInterviewHierarchyViewOpen, setIsInterviewHierarchyViewOpen] = useState(false)

	const [dashboardDetails, setDashboardDetails] = useState();

	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('')

	const getDashBoardDetails = () => {

		if (startDate && endDate) {
			axiosPrivateCall.get(`/api/v1/aggregate/getDashboardAggregateData?start_date=${formateDate(startDate)}&end_date=${formateDate(endDate)}`).then(res => {
				setDashboardDetails(res.data)
			}).catch(e => console.log(e))

		}

		else {
			axiosPrivateCall.get('/api/v1/aggregate/getDashboardAggregateData').then(res => {
				setDashboardDetails(res.data)
			}).catch(e => console.log(e))
		}
	}

	const setDateHandler = () => {
		console.log(formateDate(startDate), formateDate(endDate))

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


	// const onParseDateFromString = React.useCallback(
	//    (date)=> {

	// 		console.log(date);
	//     const previousValue = date || new Date();
	//     const newValueParts = (date || '').trim().split('/');
	//     const day =
	//       newValueParts.length > 0 ? Math.max(1, Math.min(31, parseInt(newValueParts[0], 10))) : previousValue.getDate();
	//     const month =
	//       newValueParts.length > 1
	//         ? Math.max(1, Math.min(12, parseInt(newValueParts[1], 10))) - 1
	//         : previousValue.getMonth();
	//     let year = newValueParts.length > 2 ? parseInt(newValueParts[2], 10) : previousValue.getFullYear();
	//     if (year < 100) {
	//       year += previousValue.getFullYear() - (previousValue.getFullYear() % 100);
	//     }
	//     return new Date(year, month, day);
	//   },
	//   [],
	// );




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
			{isInterviewHierarchyViewOpen && <InterviewHierarchyView isModalOpen={isInterviewHierarchyViewOpen} setIsModalOpen={setIsInterviewHierarchyViewOpen} startDate={startDate} endDate={endDate} />}

			<div className={styles.container}>

				<div className={styles.dashboard_title_calendar_container}>

					<div className={styles.dashboard_title_container}>
						Dashboard
					</div>

					<div className={styles.dashboard_date_picker_container}>
						<DatePicker styles={calendarClass} placeholder="Start Date" formatDate={onFormatDate} value={startDate} onSelectDate={onStartDateChange} maxDate={new Date()}/>

						<DatePicker styles={calendarClass} placeholder="End Date" formatDate={onFormatDate} value={endDate} minDate={minEndDate} onSelectDate={(date) => setEndDate(date)} maxDate={new Date()} disabled={!startDate}/>

						<PrimaryButton text={'Set Date'} onClick={setDateHandler} />

					</div>


				</div>

				<div className={styles.dashboard_tiles_container}>
					<Carousel itemsToShow={5} renderArrow={MyArrows}>
						<div onClick={() => setIsActiveHierarchyViewOpen(true)} className={styles.dashboard_tile}>
							<div className={styles.dashboard_tile_img}>
								<img src={activedemands} alt='active demmands' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								ACTIVE DEMANDS

							</div>
							<div className={styles.dashboard_tile_count}>
								{dashboardDetails?.active_demands_count}
							</div>


						</div>
						<div className={styles.dashboard_tile}>

							<div className={styles.dashboard_tile_img}>
								<img src={demands} alt='active demmands' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								DEMANDS

							</div>
							<div className={styles.dashboard_tile_count}>
								{dashboardDetails?.total_demands}
							</div>

						</div>
						<div onClick={() => setIsSubmissionHierarchyViewOpen(true)} className={styles.dashboard_tile}>

							<div className={styles.dashboard_tile_img}>
								<img src={submissions} alt='active demmands' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								SUBMISSIONS

							</div>
							<div className={styles.dashboard_tile_count}>
								{dashboardDetails?.submissions_details?.submissions}
							</div>

						</div>
						<div onClick={() => setIsInterviewHierarchyViewOpen(true)} className={styles.dashboard_tile}>

							<div className={styles.dashboard_tile_img}>
								<img src={interviews} alt='active demmands' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								INTERVIEWS

							</div>
							<div className={styles.dashboard_tile_count}>
								{dashboardDetails?.submissions_details?.interview}
							</div>

						</div>
						<div className={styles.dashboard_tile}>

							<div className={styles.dashboard_tile_img}>
								<img src={offered} alt='active demmands' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								OFFERED

							</div>
							<div className={styles.dashboard_tile_count}>
								{dashboardDetails?.submissions_details?.offered}
							</div>


						</div>
						<div className={styles.dashboard_tile}>
							<div className={styles.dashboard_tile_img}>
								<img src={joined} alt='active demmands' className={styles.img} />

							</div>
							<div className={styles.dashboard_tile_title}>
								JOINED

							</div>
							<div className={styles.dashboard_tile_count}>
								{dashboardDetails?.submissions_details?.joined}
							</div>

						</div>
					</Carousel>
				</div>


				<div className={styles.dashboard_progress_bar_container}>

					<Carousel itemsToShow={3} renderArrow={MyArrows}>
						<div className={styles.dashboard_comparison_tile} >

							<div className={styles.dashboard_comparison_tile_title}>
								Demand vs Submission

							</div>

							<div className={styles.dashboard_circular_progress_bar_container}>

								<div style={{ width: 110, height: 110 }}  >

									<CircularProgressbar value={((dashboardDetails?.submissions_details?.submissions / dashboardDetails?.total_demands) * 100)} styles={
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
										DEMANDS
									</div>


									<div className={styles.dashboard_comparison_title_2_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.total_demands}
									</div>




								</div>

								<div className={styles.dashboard_comparison_title_2_container}>

									<div className={styles.dashboard_comparison_title_2_title} >
										SUBMISSIONS

									</div>

									<div className={styles.dashboard_comparison_title_1_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.submissions}
									</div>


								</div>







							</div>



						</div>
						<div className={styles.dashboard_comparison_tile} >

							<div className={styles.dashboard_comparison_tile_title}>
								Submission vs L1

							</div>

							<div className={styles.dashboard_circular_progress_bar_container}>

								<div style={{ width: 110, height: 110 }}  >

									<CircularProgressbar value={60} styles={
										{
											path: {
												// Path color
												stroke: `rgba(129, 205, 123, 1)`,
												// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
												strokeLinecap: 'butt'
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
										SUBMISSIONS
									</div>


									<div className={styles.dashboard_comparison_title_2_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.submissions}
									</div>




								</div>

								<div className={styles.dashboard_comparison_title_2_container}>

									<div className={styles.dashboard_comparison_title_2_title} >
										L1

									</div>

									<div className={styles.dashboard_comparison_title_1_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.l1}
									</div>


								</div>







							</div>



						</div>
						<div className={styles.dashboard_comparison_tile} >

							<div className={styles.dashboard_comparison_tile_title}>
								L1 vs L2

							</div>

							<div className={styles.dashboard_circular_progress_bar_container}>

								<div style={{ width: 110, height: 110 }}  >

									<CircularProgressbar value={60} styles={
										{
											path: {
												// Path color
												stroke: `rgba(129, 205, 123, 1)`,
												// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
												strokeLinecap: 'butt'
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
										L1
									</div>


									<div className={styles.dashboard_comparison_title_1_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.l1}
									</div>




								</div>

								<div className={styles.dashboard_comparison_title_2_container}>

									<div className={styles.dashboard_comparison_title_2_title} >
										L2

									</div>

									<div className={styles.dashboard_comparison_title_2_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.l2}
									</div>


								</div>







							</div>



						</div>
						<div className={styles.dashboard_comparison_tile} >

							<div className={styles.dashboard_comparison_tile_title}>
								L2 vs L3

							</div>

							<div className={styles.dashboard_circular_progress_bar_container}>

								<div style={{ width: 110, height: 110 }}  >

									<CircularProgressbar value={60} styles={
										{
											path: {
												// Path color
												stroke: `rgba(129, 205, 123, 1)`,
												// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
												strokeLinecap: 'butt'
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
										L2
									</div>


									<div className={styles.dashboard_comparison_title_1_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.l2}
									</div>




								</div>

								<div className={styles.dashboard_comparison_title_2_container}>

									<div className={styles.dashboard_comparison_title_2_title} >
										L3

									</div>

									<div className={styles.dashboard_comparison_title_2_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.l3}
									</div>


								</div>







							</div>



						</div>

						<div className={styles.dashboard_comparison_tile} >

							<div className={styles.dashboard_comparison_tile_title}>
								L3 vs Offer

							</div>

							<div className={styles.dashboard_circular_progress_bar_container}>

								<div style={{ width: 110, height: 110 }}  >

									<CircularProgressbar value={60} styles={
										{
											path: {
												// Path color
												stroke: `rgba(129, 205, 123, 1)`,
												// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
												strokeLinecap: 'butt'
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
										L3
									</div>


									<div className={styles.dashboard_comparison_title_1_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.l3}
									</div>




								</div>

								<div className={styles.dashboard_comparison_title_2_container}>

									<div className={styles.dashboard_comparison_title_2_title} >
										OFFER

									</div>

									<div className={styles.dashboard_comparison_title_2_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.offered}
									</div>


								</div>







							</div>



						</div>
						<div className={styles.dashboard_comparison_tile} >

							<div className={styles.dashboard_comparison_tile_title}>
								Offer vs Joined

							</div>

							<div className={styles.dashboard_circular_progress_bar_container}>

								<div style={{ width: 110, height: 110 }}  >

									<CircularProgressbar value={60} styles={
										{
											path: {
												// Path color
												stroke: `rgba(129, 205, 123, 1)`,
												// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
												strokeLinecap: 'butt'
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
										OFFER
									</div>


									<div className={styles.dashboard_comparison_title_1_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.offered}
									</div>




								</div>

								<div className={styles.dashboard_comparison_title_2_container}>

									<div className={styles.dashboard_comparison_title_2_title} >
										JOINT

									</div>

									<div className={styles.dashboard_comparison_title_2_color} >

									</div>

									<div className={styles.dashboard_comparison_title_count} >
										{dashboardDetails?.submissions_details?.joined}
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




export default Dashboard;