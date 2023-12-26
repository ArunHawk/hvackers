import React, {useState,useEffect} from 'react'
import { DefaultButton } from '@fluentui/react';
import styles from './Sidebaritem.module.css'
import { useUserContext } from '../contexts/UserProvider';



 const Sidebaritem = (props) => {



	const {title, sideIcon,children,isActive,handleNavigation,singleItem,callout} = props

	const {isCollapsed,setCollapsed} = useUserContext();

	
	const [isContentOpen,setIsContentOpen] = useState(isActive);

	useEffect(() => {
		
		setIsContentOpen(isActive)

	}, [isActive])
	

	const clickHandler= ()=>{
		setIsContentOpen(prev => !prev);
		handleNavigation()
	}

	return (
	  <div className={`${styles.sidebaritem_container}
		${isActive && !isCollapsed ? styles.sidebaritem_container_active: ''}`} onMouseEnter={props.onMouseEnter}
		onMouseLeave={props.onMouseLeave} id={props.id}>

			<DefaultButton  className={`${styles.sidebar_item_btn} 
			${isActive  && isCollapsed ? styles.sidebar_item_btn_active: ''}
			${isActive && (!isContentOpen || singleItem) ? styles.sidebar_item_btn_active:''}` }
				onClick={clickHandler} >

				<div className={styles.sideitem_container}> 
				<img className={styles.sideitem_img} src={sideIcon} alt="icon" />

				{!isCollapsed && <div className={styles.sideitem_title}>
				{ title}
				</div>}

				</div>
				
		    </DefaultButton>

			{isContentOpen && isActive && !isCollapsed &&
        <div className={styles.sideitem_content}>

					{children}

					







				</div>

			}
			{isCollapsed && callout}

	

		</div>

		


		
	)
}



export default Sidebaritem;