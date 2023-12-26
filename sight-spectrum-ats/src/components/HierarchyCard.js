import React from "react";
import styles from './HierarchyCard.module.css';
import avatarsample from '../assets/avatarsample.svg';
import { useNavigate } from "react-router-dom";

const HierarchyCard = ({ name, role, count, countName, type, userId, ActiveuserId, startDate, endDate }) => {
	const navigateTo = useNavigate();

	const formatDate = React.useMemo(() => {
		return (date) => {
			if (date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const formattedDate = `${year}-${month}-${day}`;
				return formattedDate;
			}
		};
	}, []);
	const constructURL = (params) => {
		const queryString = new URLSearchParams(params).toString();
		switch (type) {
			case 'demand':
				return `/demand/managedemands?${queryString}`;
			case 'activeDemand':
				return `/demand/mydemands?${queryString}`;
			case 'submission':
				return `/submission/managesubmissions?${queryString}`;
			case 'empanelment':
				return `/masterlist/manageclient?${queryString}`;
			case 'expansion':
				return `/masterlist/manageclient?${queryString}`;
			default:
				return "/";
		}
	};

	return (
		<div className={styles.hierarchy_container}>
			<div className={styles.hierarchy_card_container}>
				<div>
					<img className={styles.hierarchy_card_img} src={avatarsample} alt="profile pic" />
				</div>
				<div className={styles.hierarchy_card_content}>
					<div className={styles.hierarchy_card_name}>
						{name}
					</div>
					{role && <div className={styles.hierarchy_card_role}>
						{role}
					</div>}
					{!isNaN(count) && countName &&
						<div
							onClick={() => navigateTo(constructURL({
								user_id: type === 'expansion' ? ActiveuserId : userId,
								type,
								start_date: formatDate(startDate),
								end_date: formatDate(endDate),
							}))}
							className={styles.hierarchy_card_count}
						>
							{countName + " " + count}
						</div>}
				</div>
			</div>
		</div>
	);
}

export default HierarchyCard;
