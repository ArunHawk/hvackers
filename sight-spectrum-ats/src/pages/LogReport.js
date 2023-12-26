
import styles from './LogReport.module.css'
import { FontIcon } from '@fluentui/react';


const LogReport = () =>{


	return(
		<div className={styles.page}>

				<div className={styles.log_report_title_calendar_container}>

					<div className={styles.log_report_title_container}>
						Log report
					</div>

					<div className={styles.log_report_calendar_icon_container}>

						<FontIcon iconName="Calendar"  />

					</div>	


				</div>


				<div className={styles.container}>

					<div className={styles.report_description_report_generate_container}>

						<div className={styles.report_description_title}>
							Click the below button to generate user login reports 

						</div>
						<div className={styles.report_generate_btn_wrapper}>

							<div className={styles.report_generate_btn}>
								Generate report
							</div>
						</div>


					</div>

				</div>



		</div>
	)
}

export default LogReport;
