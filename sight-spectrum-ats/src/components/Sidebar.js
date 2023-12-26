import React, { useState, useContext } from 'react'
import styles from './Sidebar.module.css'
import classNames from 'classnames/bind'
import Sidebaritem from './Sidebaritem'
import { DefaultButton, Callout, DirectionalHint } from '@fluentui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserProvider';

// hooks
import { useLocationPath } from '../hooks/useLocationPath';
import dashboardicon from '../assets/dashboard.svg';
import interviewIcon from '../assets/interviewIcon.png';
import bdedashboardicon from '../assets/bde1.png';
import candidateicon from '../assets/candidate.svg';
import demandreport from '../assets/demandreport.svg';
import masterpage from '../assets/masterpage.svg';
import reports from '../assets/reports.svg';
import submission from '../assets/submission.svg';
import teammanagement from '../assets/teammanagement.svg';
import collapseicon from '../assets/collapsebtn.svg';
import addcandidate from '../assets/addcandidate.svg';
import viewsubmission from '../assets/viewsubmission.svg';
import adddemands from '../assets/adddemand.svg';
import managedemands from '../assets/managedemand.svg';
import demandstatus from '../assets/demandstatus.svg';
import addskills from '../assets/addskill.svg';
import recruitersubmission from '../assets/recruitersubmission.svg';
import leaddemand from '../assets/leaddemand.png';
import accountmanager from '../assets/accountmanager.svg';
import clientreport from '../assets/clientreport.svg';
import subvendorsubmissions from '../assets/subvendorsubmission.svg';
import clientreportcount from '../assets/clientreportcount.svg';
import addemployee from '../assets/addemployee.svg';
import manageemployee from '../assets/manageemployee.svg';
import mydemands from '../assets/mydemands.svg';
import naukri from "../assets/naukri.png";
import monster from "../assets/monster.png";
import linkedin from "../assets/linkedin.png";
import teams from "../assets/Microsoft-Teams-Logo.png";
import gmail from "../assets/Gmail.png";
import hangouts from "../assets/Hangouts.png";
import portals from "../assets/portal.png";
import outlook from "../assets/outlook.jpeg";
import target from "../assets/Target.png";
import managetarget from "../assets/managetarget.png";
import mytarget from "../assets/mytarget.png";
import crm from "../assets/crm.png";
import managedeals from "../assets/managedeal.png"


const cx = classNames.bind(styles)

const Sidebar = (props) => {

  const { isCollapsed, setCollapsed } = useUserContext();

  const token = localStorage.getItem('token');
  let base64Url = token.split('.')[1];
  let decodedValue = JSON.parse(window.atob(base64Url));

  let navigate = useNavigate();

  function handleNavigation(p) {
    navigate(`/${p}`);
  }


  const { path, mainPath, subPath } = useLocationPath();

  const [isCollapseIconCalloutOpen, setIsCollapseIconCalloutOpen] = useState(false);

  const [currentIconCallout, setCurrentIconCallout] = useState('');


  const clickCollapseHandler = () => {
    setCollapsed(!isCollapsed)
  }

  const collapseIconOverHandler = () => {
    setIsCollapseIconCalloutOpen(!isCollapseIconCalloutOpen)
  }

  const iconHoverHandler = (e, iconTitle) => {
    setCurrentIconCallout(iconTitle);
    // console.log(iconTitle)
  }


  return (

    <div className={`${styles.sidebar_container} ${isCollapsed ? styles.sidebar_container_collapsed : ''}`}>
      <div className={styles.sidebar_items_container}>

        {((decodedValue.user_role === 'admin')
          || (decodedValue.user_role === 'Report Admin')
          || (decodedValue.user_role === 'account_manager')
          || (decodedValue.user_role === 'team_lead')
          || (decodedValue.user_role === 'recruiter')
          || (decodedValue.user_role === 'HR')) ? (
          <Sidebaritem
            title={"Dashboard"}
            sideIcon={dashboardicon}
            isCollapsed={isCollapsed}
            handleNavigation={() => handleNavigation('dashboard')}
            isActive={mainPath === 'dashboard'}
            singleItem={true}
          />
        ) : null}

        {((decodedValue.user_role === 'bde')
          || (decodedValue.user_role === 'admin')
          || (decodedValue.user_role === 'account_manager')) && (
            <Sidebaritem
              title={"BDE Dashboard"}
              sideIcon={bdedashboardicon}
              isCollapsed={isCollapsed}
              handleNavigation={() => handleNavigation('bdedashboard')}
              isActive={mainPath === 'bdedashboard'}
              singleItem={true}
            />
          )}
        {
          ((decodedValue.user_role === 'admin')
            || (decodedValue.user_role === 'account_manager')
            || (decodedValue.user_role === 'team_lead')
            || (decodedValue.user_role === 'recruiter')

          ) ?

            (<Sidebaritem handleNavigation={() => handleNavigation('target/managetarget')} id="target"
              title={"Target"} isActive={mainPath === 'target'} sideIcon={target}
              onMouseEnter={(e) => iconHoverHandler(e, 'target')} onMouseLeave={(e) => iconHoverHandler(e, '')}

              callout={currentIconCallout === 'target' &&

                <Callout role='dialog' target={"#target"} isBeakVisible={false}
                  setInitialFocus directionalHint={DirectionalHint.rightTopEdge} calloutMaxWidth={200} >

                  <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "managetarget" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('target/managetarget')}>
                    <div className={cx('submenu-container')}>
                      <img className={cx('submenu-img')} src={managetarget} alt="" />
                      <div className={cx('submenu-title')}> Manage Target </div>
                    </div>
                  </DefaultButton>

                  {((decodedValue.user_role === 'admin')
                    || (decodedValue.user_role === 'account_manager')
                    || (decodedValue.user_role === 'team_lead')
                    || (decodedValue.user_role === 'recruiter')) ?
                    <DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath === "mytarget" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('target/mytarget')}>
                      <div className={cx('submenu-container')}>
                        <img className={cx('submenu-img')} src={mytarget} alt="" />
                        <div className={cx('submenu-title')}>  My Target </div>
                      </div>
                    </DefaultButton> : null}


                  {/* { ((decodedValue.user_role === 'admin') 
							// || (decodedValue.user_role === 'Report Admin') 
							|| (decodedValue.user_role === 'recruiter')
							|| (decodedValue.user_role === 'bde')) 
							?  
								<DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath==="demandstatus" ? styles.sidebar_sub_btn_active : '' }`}  onClick={() => handleNavigation('demand/demandstatus')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={demandstatus} alt="" />
									<div className={cx('submenu-title')}>  Demands Status </div>
								</div>
							</DefaultButton> : null} */}

                </Callout>}>

              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "managetarget" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('target/managetarget')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={managetarget} alt="" />
                  <div className={cx('submenu-title')}> Manage Target </div>
                </div>
              </DefaultButton>

              {/* { ((decodedValue.user_role === 'admin')
								|| (decodedValue.user_role === 'account_manager')
								|| (decodedValue.user_role === 'team_lead')
								|| (decodedValue.user_role === 'bde')) 
								? 
									<DefaultButton className={`${styles.sidebar_sub_btn} 
									${subPath==="adddemand" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('demand/adddemand')}>
										<div className={cx('submenu-container')}>
											<img className={cx('submenu-img')} src={adddemands} alt="" />
											<div className={cx('submenu-title')}> Add Demand </div>
										</div>
									</DefaultButton> : null } */}

              {((decodedValue.user_role === 'admin')
                || (decodedValue.user_role === 'account_manager')
                || (decodedValue.user_role === 'team_lead')
                || (decodedValue.user_role === 'recruiter'))
                ?
                <DefaultButton className={`${styles.sidebar_sub_btn} 
										${subPath === "mytarget" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('target/mytarget')}>
                  <div className={cx('submenu-container')}>
                    <img className={cx('submenu-img')} src={mytarget} alt="" />
                    <div className={cx('submenu-title')}> My Target </div>
                  </div>
                </DefaultButton> : null}

              {/* { ((decodedValue.user_role === 'admin') 
								// || (decodedValue.user_role === 'Report Admin') 
								|| (decodedValue.user_role === 'recruiter')
								|| (decodedValue.user_role === 'bde')) 
								? 
								<DefaultButton className={`${styles.sidebar_sub_btn} 
									${subPath==="demandstatus" ? styles.sidebar_sub_btn_active : '' }`}  onClick={() => handleNavigation('demand/demandstatus')}>
									<div className={cx('submenu-container')}>
										<img className={cx('submenu-img')} src={demandstatus} alt="" />
										<div className={cx('submenu-title')}>  Demands Status </div>
									</div>
								</DefaultButton> : null } */}

            </Sidebaritem>) : null}


        {
          ((decodedValue.user_role === 'admin')
            // || (decodedValue.user_role === 'Report Admin') 
            || (decodedValue.user_role === 'account_manager')
            || (decodedValue.user_role === 'team_lead')
            || (decodedValue.user_role === 'recruiter')
            || (decodedValue.user_role === 'bde')
          ) ?

            (<Sidebaritem handleNavigation={() => handleNavigation('demand/managedemands')} id="demand"
              title={"Demand"} isActive={mainPath === 'demand'} sideIcon={demandreport}
              onMouseEnter={(e) => iconHoverHandler(e, 'demand')} onMouseLeave={(e) => iconHoverHandler(e, '')}

              callout={currentIconCallout === 'demand' &&

                <Callout role='dialog' target={"#demand"} isBeakVisible={false}
                  setInitialFocus directionalHint={DirectionalHint.rightTopEdge} calloutMaxWidth={200} >

                  <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "managedemands" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('demand/managedemands')}>
                    <div className={cx('submenu-container')}>
                      <img className={cx('submenu-img')} src={managedemands} alt="" />
                      <div className={cx('submenu-title')}> Manage Demands </div>
                    </div>
                  </DefaultButton>


                  {/* { ((decodedValue.user_role === 'admin')
							|| (decodedValue.user_role === 'account_manager')
							|| (decodedValue.user_role === 'team_lead')
							|| (decodedValue.user_role === 'bde')) 
							?  
								<DefaultButton className={`${styles.sidebar_sub_btn} 
									${subPath==='adddemand' ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('demand/adddemand')}>
									<div className={cx('submenu-container')}>
										<img className={cx('submenu-img')} src={adddemands} alt="" />
										<div className={cx('submenu-title')}> Add Demand </div>
									</div>
								</DefaultButton> : null} */}

                  {((decodedValue.user_role === 'admin')
                    || (decodedValue.user_role === 'account_manager')
                    || (decodedValue.user_role === 'team_lead')
                    || (decodedValue.user_role === 'recruiter'))
                    ?
                    <DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath === "mydemands" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('demand/mydemands')}>
                      <div className={cx('submenu-container')}>
                        <img className={cx('submenu-img')} src={mydemands} alt="" />
                        <div className={cx('submenu-title')}>  My Demands </div>
                      </div>
                    </DefaultButton> : null}


                  {/* { ((decodedValue.user_role === 'admin') 
							// || (decodedValue.user_role === 'Report Admin') 
							|| (decodedValue.user_role === 'recruiter')
							|| (decodedValue.user_role === 'bde')) 
							?  
								<DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath==="demandstatus" ? styles.sidebar_sub_btn_active : '' }`}  onClick={() => handleNavigation('demand/demandstatus')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={demandstatus} alt="" />
									<div className={cx('submenu-title')}>  Demands Status </div>
								</div>
							</DefaultButton> : null} */}

                </Callout>}>

              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "managedemands" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('demand/managedemands')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={managedemands} alt="" />
                  <div className={cx('submenu-title')}> Manage Demands </div>
                </div>
              </DefaultButton>

              {/* { ((decodedValue.user_role === 'admin')
								|| (decodedValue.user_role === 'account_manager')
								|| (decodedValue.user_role === 'team_lead')
								|| (decodedValue.user_role === 'bde')) 
								? 
									<DefaultButton className={`${styles.sidebar_sub_btn} 
									${subPath==="adddemand" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('demand/adddemand')}>
										<div className={cx('submenu-container')}>
											<img className={cx('submenu-img')} src={adddemands} alt="" />
											<div className={cx('submenu-title')}> Add Demand </div>
										</div>
									</DefaultButton> : null } */}

              {((decodedValue.user_role === 'admin')
                || (decodedValue.user_role === 'account_manager')
                || (decodedValue.user_role === 'team_lead')
                || (decodedValue.user_role === 'recruiter'))
                ?
                <DefaultButton className={`${styles.sidebar_sub_btn} 
										${subPath === "mydemands" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('demand/mydemands')}>
                  <div className={cx('submenu-container')}>
                    <img className={cx('submenu-img')} src={mydemands} alt="" />
                    <div className={cx('submenu-title')}> My Demands </div>
                  </div>
                </DefaultButton> : null}

              {/* { ((decodedValue.user_role === 'admin') 
								// || (decodedValue.user_role === 'Report Admin') 
								|| (decodedValue.user_role === 'recruiter')
								|| (decodedValue.user_role === 'bde')) 
								? 
								<DefaultButton className={`${styles.sidebar_sub_btn} 
									${subPath==="demandstatus" ? styles.sidebar_sub_btn_active : '' }`}  onClick={() => handleNavigation('demand/demandstatus')}>
									<div className={cx('submenu-container')}>
										<img className={cx('submenu-img')} src={demandstatus} alt="" />
										<div className={cx('submenu-title')}>  Demands Status </div>
									</div>
								</DefaultButton> : null } */}

            </Sidebaritem>) : null}

        {((decodedValue.user_role === 'admin')
          // || (decodedValue.user_role === 'Report Admin') 
          || (decodedValue.user_role === 'account_manager')
          || (decodedValue.user_role === 'team_lead')
          || (decodedValue.user_role === 'recruiter'))
          ?
          (<Sidebaritem handleNavigation={() => handleNavigation('submission/managesubmissions')} title={"Submission Report"} sideIcon={submission}
            onMouseEnter={(e) => iconHoverHandler(e, 'submission')} onMouseLeave={(e) => iconHoverHandler(e, '')}
            isActive={mainPath === "submission"} id={'submission'} callout={currentIconCallout === 'submission' &&

              <Callout role='dialog' target={"#submission"} isBeakVisible={false}
                setInitialFocus directionalHint={DirectionalHint.rightTopEdge} calloutMaxWidth={200} >


                {((decodedValue.user_role === 'admin')
                  || (decodedValue.user_role === 'account_manager')
                  || (decodedValue.user_role === 'team_lead')
                  || (decodedValue.user_role === 'recruiter'))
                  ?
                  (<DefaultButton className={`${styles.sidebar_sub_btn} 
									${subPath === 'managesubmissions' ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('submission/managesubmissions')}>
                    <div className={cx('submenu-container')}>
                      <img className={cx('submenu-img')} src={adddemands} alt="" />
                      <div className={cx('submenu-title')}> Manage Submissions </div>
                    </div>
                  </DefaultButton>) : null}

                {/* {((decodedValue.user_role === 'admin') 
							|| (decodedValue.user_role === 'account_manager')
							|| (decodedValue.user_role === 'team_lead')
							|| (decodedValue.user_role === 'recruiter')) 
							?
								(<DefaultButton className={`${styles.sidebar_sub_btn} 
									${subPath==="addsubmission" ? styles.sidebar_sub_btn_active : '' }`}  onClick={() => handleNavigation('submission/addsubmission')}>
									<div className={cx('submenu-container')}>
										<img className={cx('submenu-img')} src={managedemands} alt="" />
										<div className={cx('submenu-title')}> Add Submission </div>
									</div>
								</DefaultButton>):null} */}

                <DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath === "mysubmissions" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('submission/mysubmissions')}>
                  <div className={cx('submenu-container')}>
                    <img className={cx('submenu-img')} src={demandstatus} alt="" />
                    <div className={cx('submenu-title')}>  My Submission</div>
                  </div>
                </DefaultButton>

              </Callout>}>

            {((decodedValue.user_role === 'admin')
              || (decodedValue.user_role === 'account_manager')
              || (decodedValue.user_role === 'team_lead')
              || (decodedValue.user_role === 'recruiter'))
              ?
              (<DefaultButton className={`${styles.sidebar_sub_btn} 
									${subPath === "managesubmissions" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('submission/managesubmissions')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={managedemands} alt="" />
                  <div className={cx('submenu-title')}> Manage Submissions </div>
                </div>
              </DefaultButton>) : null}

            {/* {((decodedValue.user_role === 'admin') 
							|| (decodedValue.user_role === 'account_manager')
							|| (decodedValue.user_role === 'team_lead')
							|| (decodedValue.user_role === 'recruiter')) 
							? 
								(<DefaultButton className={`${styles.sidebar_sub_btn} 
									${subPath==="addsubmission" ? styles.sidebar_sub_btn_active : '' }`}  onClick={() => handleNavigation('submission/addsubmission')}>
									<div className={cx('submenu-container')}>
										<img className={cx('submenu-img')} src={adddemands} alt="" />
										<div className={cx('submenu-title')}> Add Submission </div>
									</div>
								</DefaultButton>) : null} */}

            <DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath === "mysubmissions" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('submission/mysubmissions')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={managedemands} alt="" />
                <div className={cx('submenu-title')}> My Submission </div>
              </div>
            </DefaultButton>


          </Sidebaritem>) : null}


        {((decodedValue.user_role === 'admin')
          // || (decodedValue.user_role === 'Report Admin') 
          || (decodedValue.user_role === 'account_manager')
          || (decodedValue.user_role === 'team_lead')
          || (decodedValue.user_role === 'recruiter'))
          ?
          (<Sidebaritem title={"Candidate Library"} handleNavigation={() => handleNavigation('candidatelibrary/managecandidates')}
            sideIcon={candidateicon} isActive={mainPath === "candidatelibrary"} id={"Candidate"}
            onMouseEnter={(e) => iconHoverHandler(e, "candidate")} onMouseLeave={(e) => iconHoverHandler(e, '')}
            callout={currentIconCallout === "candidate" && <Callout role='dialog' calloutMaxWidth={200} gapSpace={0}
              setInitialFocus isBeakVisible={false} target={"#Candidate"} directionalHint={DirectionalHint.rightTopEdge}>

              {((decodedValue.user_role === 'admin')
                || (decodedValue.user_role === 'account_manager')
                || (decodedValue.user_role === 'team_lead')
                || (decodedValue.user_role === 'recruiter'))
                ?
                (<DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath === "managecandidates" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('candidatelibrary/managecandidates')}>
                  <div className={cx('submenu-container')}>
                    <img className={cx('submenu-img')} src={viewsubmission} alt="" />
                    <div className={cx('submenu-title')}> Manage Candidates</div>
                  </div>
                </DefaultButton>) : null}


              {/* {((decodedValue.user_role === 'admin') 
							|| (decodedValue.user_role === 'account_manager')
							|| (decodedValue.user_role === 'team_lead')
							|| (decodedValue.user_role === 'recruiter')) 
							? 
							(<DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath==="addcandidate" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('candidatelibrary/addcandidate')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addcandidate} alt="" />
									<div className={cx('submenu-title')}> Add Candidate</div>
								</div>
							</DefaultButton>) : null} */}

            </Callout>}>



            {((decodedValue.user_role === 'admin')
              || (decodedValue.user_role === 'account_manager')
              || (decodedValue.user_role === 'team_lead')
              || (decodedValue.user_role === 'recruiter'))
              ?
              (<DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "managecandidates" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('candidatelibrary/managecandidates')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={viewsubmission} alt="" />
                  <div className={cx('submenu-title')}> Manage Candidates </div>
                </div>
              </DefaultButton>) : null}

            {/* {((decodedValue.user_role === 'admin') 
							|| (decodedValue.user_role === 'account_manager')
							|| (decodedValue.user_role === 'team_lead')
							|| (decodedValue.user_role === 'recruiter')) 
							? 
							(<DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath==="addcandidate" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('candidatelibrary/addcandidate')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addcandidate} alt="" />
									<div className={cx('submenu-title')}> Add Candidate</div>
								</div>
							</DefaultButton>): null} */}





          </Sidebaritem>) : null}


        {((decodedValue.user_role === 'admin')
          // || (decodedValue.user_role === 'Report Admin')
          || (decodedValue.user_role === 'HR'))
          ?
          (<Sidebaritem title={"Employee"} sideIcon={teammanagement} handleNavigation={() => handleNavigation('employee/Manageemployee')}
            isActive={mainPath === 'employee'} id={'employee'}
            onMouseEnter={(e) => iconHoverHandler(e, 'employee')} onMouseLeave={(e) => iconHoverHandler(e, '')}
            callout={currentIconCallout === 'employee' && <Callout role='dialog' calloutMaxWidth={200} gapSpace={0}
              setInitialFocus isBeakVisible={false} target={'#employee'} directionalHint={DirectionalHint.rightTopEdge}>


              <DefaultButton className={`${styles.sidebar_sub_btn} 
						${subPath === "Manageemployee" ? styles.sidebar_sub_btn_active : ''}`}
                onClick={() => handleNavigation('employee/Manageemployee')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={manageemployee} alt="" />
                  <div className={cx('submenu-title')}>Manage Employee </div>
                </div>
              </DefaultButton>

              {/* {((decodedValue.user_role === 'admin') 
						|| (decodedValue.user_role === 'HR')) 
						? 
						(<DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="addemployee" ? styles.sidebar_sub_btn_active : '' }`}
							onClick={() => handleNavigation('employee/addemployee')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addemployee} alt="" />
									<div className={cx('submenu-title')}>Add Employee </div>
								</div>
						</DefaultButton>) : null} */}





              {/* <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="assignemployee" ? styles.sidebar_sub_btn_active : '' }`}
							onClick={() => handleNavigation('teammanagement/assignemployee')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={assignemployee} alt="" />
									<div className={cx('submenu-title')}>Assign Employee </div>
								</div>
							</DefaultButton>
						*/}


            </Callout>}>

            <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "Manageemployee" ? styles.sidebar_sub_btn_active : ''}`}
              onClick={() => handleNavigation('employee/Manageemployee')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={manageemployee} alt="" />
                <div className={cx('submenu-title')}>Manage Employee </div>
              </div>
            </DefaultButton>

            {/* {((decodedValue.user_role === 'admin') 
							|| (decodedValue.user_role === 'HR')) 
							? 
							(<DefaultButton className={`${styles.sidebar_sub_btn} 
								${subPath==="addemployee" ? styles.sidebar_sub_btn_active : '' }`}
								onClick={() => handleNavigation('employee/addemployee')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addemployee} alt="" />
									<div className={cx('submenu-title')}>Add Employee </div>
								</div>
							</DefaultButton>) : null} */}





            {/* <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="assignemployee" ? styles.sidebar_sub_btn_active : '' }`}
							onClick={() => handleNavigation('teammanagement/assignemployee')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={assignemployee} alt="" />
									<div className={cx('submenu-title')}>Assign Employee </div>
								</div>
							</DefaultButton> */}



          </Sidebaritem>) : null}

        {((decodedValue.user_role === 'admin')
          || (decodedValue.user_role === 'bde'))
          ?
          (<Sidebaritem title={"CRM"} sideIcon={crm} handleNavigation={() => handleNavigation('managedeals/managesalespipeline')}
            isActive={mainPath === 'managedeals'} id={'managedeals'}
            onMouseEnter={(e) => iconHoverHandler(e, 'managedeals')} onMouseLeave={(e) => iconHoverHandler(e, '')}
            callout={currentIconCallout === 'managedeals' && <Callout role='managedeals' calloutMaxWidth={200} gapSpace={0}
              setInitialFocus isBeakVisible={false} target={'#managedeals'} directionalHint={DirectionalHint.rightTopEdge}>


              <DefaultButton className={`${styles.sidebar_sub_btn} 
						${subPath === "managesalespipeline" ? styles.sidebar_sub_btn_active : ''}`}
                onClick={() => handleNavigation('managedeals/managesalespipeline')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={managedeals} alt="" />
                  <div className={cx('submenu-title')}>Manage Deals</div>
                </div>
              </DefaultButton>

            </Callout>}>

            <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "managesalespipeline" ? styles.sidebar_sub_btn_active : ''}`}
              onClick={() => handleNavigation('managedeals/managesalespipeline')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={managedeals} alt="" />
                <div className={cx('submenu-title')}>Manage Deals </div>
              </div>
            </DefaultButton>
          </Sidebaritem>) : null}


        {((decodedValue.user_role === 'admin')
          || (decodedValue.user_role === 'bde')
          || (decodedValue.user_role === 'account_manager')
          || (decodedValue.user_role === 'team_lead')
          || (decodedValue.user_role === 'recruiter'))
          ?
          (<Sidebaritem title={"Master List"} sideIcon={masterpage} handleNavigation={() => handleNavigation('masterlist/manageclient')}
            isActive={mainPath === 'masterlist'} id={'masterlist'}
            onMouseEnter={(e) => iconHoverHandler(e, 'masterlist')} onMouseLeave={(e) => iconHoverHandler(e, '')}
            callout={currentIconCallout === 'masterlist' && <Callout role='dialog' calloutWidth={200} gapSpace={0}
              setInitialFocus isBeakVisible={false} target={'#masterlist'} directionalHint={DirectionalHint.rightTopEdge}>

              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "manageclient" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('masterlist/manageclient')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={addskills} alt="" />
                  <div className={cx('submenu-title')}>  Manage Client </div>
                </div>
              </DefaultButton>

              {/* <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="add" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterlist/add')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addskills} alt="" />
									<div className={cx('submenu-title')}>  Manage Skillset </div>
								</div>
							</DefaultButton> */}


              {/* <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="addlocation" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterpage/addlocation')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addlocation} alt="" />
									<div className={cx('submenu-title')}>  Add Location </div>
								</div>
							</DefaultButton>
						
						
							<DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="addclient" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterpage/addclient')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addclient} alt="" />
									<div className={cx('submenu-title')}>  Add Client </div>
								</div>
							</DefaultButton>
						
						
							<DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="addsubmissionstatus" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterpage/addsubmissionstatus')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addsubmissionstatus} alt="" />
									<div className={cx('submenu-title')}>  Add Submission Status </div>
								</div>
							</DefaultButton>
						
						
							<DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="addsubvendor" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterpage/addsubvendor')}> 
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addsubvendor} alt="" />
									<div className={cx('submenu-title')}>  Add Sub Vendor</div>
								</div>
							</DefaultButton> */}


            </Callout>}>

            <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "manageclient" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('masterlist/manageclient')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={addskills} alt="" />
                <div className={cx('submenu-title')}>  Manage Client  </div>
              </div>
            </DefaultButton>

            {/* <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="add" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterlist/add')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addskills} alt="" />
									<div className={cx('submenu-title')}>  Manage Skillset  </div>
								</div>
							</DefaultButton>
						 */}

            {/* <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="addlocation" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterpage/addlocation')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addlocation} alt="" />
									<div className={cx('submenu-title')}>  Add Location </div>
								</div>
							</DefaultButton>
						
						
							<DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="addclient" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterpage/addclient')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addclient} alt="" />
									<div className={cx('submenu-title')}>  Add Client </div>
								</div>
							</DefaultButton>
						
						
							<DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="addsubmissionstatus" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterpage/addsubmissionstatus')}>
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addsubmissionstatus} alt="" />
									<div className={cx('submenu-title')}>  Add Submission Status </div>
								</div>
							</DefaultButton>
						
						
							<DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath==="addsubvendor" ? styles.sidebar_sub_btn_active : '' }`} onClick={() => handleNavigation('masterpage/addsubvendor')}> 
								<div className={cx('submenu-container')}>
									<img className={cx('submenu-img')} src={addsubvendor} alt="" />
									<div className={cx('submenu-title')}>  Add Sub Vendor</div>
								</div>
							</DefaultButton> */}


          </Sidebaritem>) : null}

          {((decodedValue.user_role === 'admin')
          || (decodedValue.user_role === 'Report Admin')
          || (decodedValue.user_role === 'account_manager')
          || (decodedValue.user_role === 'team_lead')
          || (decodedValue.user_role === 'recruiter')
          || (decodedValue.user_role === 'HR')) ? (
          <Sidebaritem
            title={"Interview"}
            sideIcon={interviewIcon}
            isCollapsed={isCollapsed}
            handleNavigation={() => handleNavigation('interview')}
            isActive={mainPath === 'interview'}
            singleItem={true}
          />
        ) : null}


        {((decodedValue.user_role === 'admin')
          || (decodedValue.user_role === 'bde')
          // || (decodedValue.user_role === 'Report Admin')
          || (decodedValue.user_role === 'account_manager'))
          ?
          (<Sidebaritem title={"Reports"} sideIcon={reports} handleNavigation={() => handleNavigation('reports/recruitersubmission')}
            isActive={mainPath === 'reports'} id={'reports'}
            onMouseEnter={(e) => iconHoverHandler(e, 'reports')} onMouseLeave={(e) => iconHoverHandler(e, '')}
            callout={currentIconCallout === 'reports' && <Callout role='dialog' calloutMaxWidth={240} gapSpace={0}
              setInitialFocus isBeakVisible={false} target={'#reports'} directionalHint={DirectionalHint.rightTopEdge}>


              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "recruitersubmission" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/recruitersubmission')} >
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={recruitersubmission} alt="" />
                  <div className={cx('submenu-title')}> Recruiter Submission </div>
                </div>
              </DefaultButton>


              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "leaddemand" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/leaddemand')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={leaddemand} alt="" />
                  <div className={cx('submenu-title')}>  Lead Demand </div>
                </div>
              </DefaultButton>


              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "accountmanager" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/accountmanager')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={accountmanager} alt="" />
                  <div className={cx('submenu-title')}>  Account Manager</div>
                </div>
              </DefaultButton>


              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "clientreport" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/clientreport')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={clientreport} alt="" />
                  <div className={cx('submenu-title')}> Client Report </div>
                </div>
              </DefaultButton>


              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "subvendorsubmission" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/subvendorsubmission')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={subvendorsubmissions} alt="" />
                  <div className={cx('submenu-title')}>Sub Vendor Submissions </div>
                </div>
              </DefaultButton>


              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "clientreportcount" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/clientreportcount')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={clientreportcount} alt="" />
                  <div className={cx('submenu-title')}>Client Report Count </div>
                </div>
              </DefaultButton>
              <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "managesalespipeline" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/managesalespipeline')}>
                <div className={cx('submenu-container')}>
                  <img className={cx('submenu-img')} src={clientreportcount} alt="" />
                  <div className={cx('submenu-title')}>Manage Sales Pipeline </div>
                </div>
              </DefaultButton>
            </Callout>}>

            <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "recruitersubmission" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/recruitersubmission')} >
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={recruitersubmission} alt="" />
                <div className={cx('submenu-title')}> Recruiter Submission </div>
              </div>
            </DefaultButton>


            <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "leaddemand" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/leaddemand')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={leaddemand} alt="" />
                <div className={cx('submenu-title')}>  Lead Demand </div>
              </div>
            </DefaultButton>


            <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "accountmanager" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/accountmanager')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={accountmanager} alt="" />
                <div className={cx('submenu-title')}>  Account Manager</div>
              </div>
            </DefaultButton>


            <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "clientreport" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/clientreport')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={clientreport} alt="" />
                <div className={cx('submenu-title')}> Client Report </div>
              </div>
            </DefaultButton>


            <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "subvendorsubmission" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/subvendorsubmission')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={subvendorsubmissions} alt="" />
                <div className={cx('submenu-title')}>Sub Vendor Submissions </div>
              </div>
            </DefaultButton>


            <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "clientreportcount" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/clientreportcount')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={clientreportcount} alt="" />
                <div className={cx('submenu-title')}>Client Report Count </div>
              </div>
            </DefaultButton>
            {/* <DefaultButton className={`${styles.sidebar_sub_btn} 
							${subPath === "managesalespipeline" ? styles.sidebar_sub_btn_active : ''}`} onClick={() => handleNavigation('reports/managesalespipeline')}>
              <div className={cx('submenu-container')}>
                <img className={cx('submenu-img')} src={clientreportcount} alt="" />
                <div className={cx('submenu-title')}>Manage Sales Pipeline </div>
              </div>
            </DefaultButton> */}
          </Sidebaritem>) : null}
        {decodedValue.user_role === "admin" ||
          // || (decodedValue.user_role === 'Report Admin')
          decodedValue.user_role === "account_manager" ||
          decodedValue.user_role === "team_lead" ||
          decodedValue.user_role === "recruiter" ? (
          <Sidebaritem
            title={"Portals"}
            sideIcon={portals}
            onMouseEnter={(e) => iconHoverHandler(e, "jobportal")}
            onMouseLeave={(e) => iconHoverHandler(e, "")}
            isActive={mainPath === "jobportal"}
            id={"jobportal"}
            callout={
              currentIconCallout === "jobportal" && (
                <Callout
                  role="dialog"
                  target={"#jobportal"}
                  isBeakVisible={false}
                  setInitialFocus
                  directionalHint={DirectionalHint.rightTopEdge}
                  calloutMaxWidth={200}
                >
                  {decodedValue.user_role === "admin" ||
                    decodedValue.user_role === "account_manager" ||
                    decodedValue.user_role === "team_lead" ||
                    decodedValue.user_role === "recruiter" ? (
                    <DefaultButton
                      className={`${styles.sidebar_sub_btn} 
									    ${subPath === "jobportal" ? styles.sidebar_sub_btn_active : ""}`}
                      onClick={() => {
                        window.open("https://www.naukri.com/recruit/login", "_blank");
                      }}
                    >
                      <div className={cx("submenu-container")}>
                        <img
                          className={cx("submenu-img")}
                          src={naukri}
                          alt="naukri"
                        />
                        <div className={cx("submenu-title")}>Naukri</div>
                      </div>
                    </DefaultButton>
                  ) : null}
                  <DefaultButton
                    className={`${styles.sidebar_sub_btn} 
								    ${subPath === "monstor" ? styles.sidebar_sub_btn_active : ""}`}
                    onClick={() => {
                      window.open("https://www.foundit.in/", "_blank");
                    }}
                  >
                    <div className={cx("submenu-container")}>
                      <img
                        className={cx("submenu-img")}
                        src={monster}
                        alt="monster"
                      />
                      <div className={cx("submenu-title")}>Monster</div>
                    </div>
                  </DefaultButton>
                  <DefaultButton
                    className={`${styles.sidebar_sub_btn} 
								    ${subPath === "linkedin" ? styles.sidebar_sub_btn_active : ""}`}
                    onClick={() => {
                      window.open("https://www.linkedin.com/", "_blank");
                    }}
                  >
                    <div className={cx("submenu-container")}>
                      <img
                        className={cx("submenu-img")}
                        src={linkedin}
                        alt="linkedin"
                      />
                      <div className={cx("submenu-title")}>LinkedIn</div>
                    </div>
                  </DefaultButton>
                  <DefaultButton
                    className={`${styles.sidebar_sub_btn} 
								    ${subPath === "teams" ? styles.sidebar_sub_btn_active : ""}`}
                    onClick={() => {
                      window.open(" https://teams.microsoft.com/", "_blank");
                    }}
                  >
                    <div className={cx("submenu-container")}>
                      <img
                        className={cx("submenu-img")}
                        src={teams}
                        alt="teams"
                      />
                      <div className={cx("submenu-title")}>Teams</div>
                    </div>
                  </DefaultButton>
                  <DefaultButton
                    className={`${styles.sidebar_sub_btn} 
								    ${subPath === "gmail" ? styles.sidebar_sub_btn_active : ""}`}
                    onClick={() => {
                      window.open("https://mail.google.com/", "_blank");
                    }}
                  >
                    <div className={cx("submenu-container")}>
                      <img
                        className={cx("submenu-img")}
                        src={gmail}
                        alt="gmail"
                      />
                      <div className={cx("submenu-title")}>Gmail</div>
                    </div>
                  </DefaultButton>
                  <DefaultButton
                    className={`${styles.sidebar_sub_btn} 
								    ${subPath === "hangouts" ? styles.sidebar_sub_btn_active : ""}`}
                    onClick={() => {
                      window.open("https://hangouts.google.com/", "_blank");
                    }}>
                    <div className={cx("submenu-container")}>
                      <img
                        className={cx("submenu-img")}
                        src={hangouts}
                        alt="hangouts"
                      />
                      <div className={cx("submenu-title")}>Hangouts</div>
                    </div>
                  </DefaultButton>
                  <DefaultButton
                    className={`${styles.sidebar_sub_btn} 
								    ${subPath === "outlook" ? styles.sidebar_sub_btn_active : ""}`}
                    onClick={() => {
                      window.open("https://outlook.live.com/", "_blank");
                    }}>
                    <div className={cx("submenu-container")}>
                      <img
                        className={cx("submenu-img")}
                        src={outlook}
                        alt="outlook"
                      />
                      <div className={cx("submenu-title")}>Outlook</div>
                    </div>
                  </DefaultButton>
                </Callout>
              )
            }
          >
          </Sidebaritem>
        ) : null}
      </div>
      <div className={styles.collapse_icon_separator_container}>
        <div className={styles.collapse_separator_container}>
          <div className={styles.collapse_separator}>
          </div>
        </div>
        <div id={'collapseId'} onClick={clickCollapseHandler} onMouseEnter={collapseIconOverHandler}
          onMouseLeave={collapseIconOverHandler} className={styles.collapse_icon_container} >
          {isCollapseIconCalloutOpen && isCollapsed &&
            <Callout target={'#collapseId'} isBeakVisible={false} popupProps={{ className: styles.collapse_icon_callout_container }} role='dialog'
              gapSpace={0} setInitialFocus directionalHint={DirectionalHint.topRightEdge}>
              Show more information
            </Callout>}
          <img className={cx('collapse-icon', { icon_collapsed: isCollapsed })} src={collapseicon} alt='collapse icon' />
        </div>
      </div>
    </div>
  )
}
export default Sidebar;
