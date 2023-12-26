import React, { useRef, useState } from 'react';

import { Modal } from '@fluentui/react';

import { PrimaryButton } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import styles from './ModalTemplate.module.css'

// import 'draft-js/dist/Draft.css';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import './DraftEditorResetFix.css';



// API
import { mergeStyles } from '@fluentui/react';


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




const ModalTemplate = (props) => {
 
  const {isModalOpen,setIsModalOpen,showMessageBar,setShowMessageBar} = props;

	const [currentHover,setCurrentHover] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	
	const [isModalShrunk,setIsModalShrunk] = useState(true)



	const modalSizeHandler =()=>{
     setIsModalShrunk(!isModalShrunk)
	}

	



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
								

								<PrimaryButton  text="Assign Demand" iconProps={{iconName:"Save"}}/>



							</div>

						</div>
					</div>
				</div>
					<div className={styles.main_filter_options_container}>
					


					</div>

					<div className={styles.main_information_container}>

					</div>

				
       

			</Modal>

		</div>
		
	)
}


export default ModalTemplate;
