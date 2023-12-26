import { useEffect } from "react";
import Login from "./Login";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import EmployeeListing from "./pages/ManageEmployee";
import SubmissionListing from "./pages/SubmissionListing";
import CandidateListing from "./pages/CandidateListing";
import EditEmployee from './pages/EditEmployee';
import EditCandidate from './pages/EditCandidate';
import EditDemand from './pages/EditDemand'
import EditClient from './pages/EditClient'
import UC from "./pages/UC";
import UC1 from "./pages/UC1";
import { ThemeProvider } from '@fluentui/react';
import { UserProvider } from './contexts/UserProvider'
import { darkTheme } from './themes'
import Layout from "./Layout";
import DemandListing from "./pages/DemandListing";
import MyDemands from './pages/MyDemands'
import MySubmissions from './pages/MySubmissions'
import TrackSubmission from "./pages/TrackSubmission";
import ClientListing from "./pages/ManageClient";
import SkillListing from "./pages/ManageSkill";
import EditSkill from './pages/EditSkill';
import VendorListing from "./pages/ManageVendor";
import EditVendor from './pages/EditVendor';
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview"
import LogReport from "./pages/LogReport";
import BdeDashboard from "./pages/BdeDashboard";



// hooks

import { useLocationPath } from '../src/hooks/useLocationPath'
import ViewSubmission from "./pages/ViewSubmission";
import Reset from "./ResetPassword";
import ManagePipeline from "./pages/ManagePipeline";
import EditPipeline from "./pages/EditPipeline";
import TargetListing from "./pages/TargetListing";
import MyTarget from "./pages/MyTarget";


import { SearchResultsProvider } from './components/SeachComponent/SearchResultsContext';
import InterviewRoom from "./pages/InterviewRoom";
import InterviewUserLobby from "./pages/InterviewUserLobby";


function App() {

  const location = useLocation();
  const navigateTo = useNavigate();
  const { path, mainPath, subPath } = useLocationPath();

  useEffect(() => {

    // if(!(mainPath=== 'login')){

    //   if(!localStorage.getItem('token')){
    //     navigateTo('/login')
    //   } 
    // }

  }, [location, mainPath])




  return (

  //   <div>
  //   <ThemeProvider>
  //     <UserProvider>
  //       <SearchResultsProvider> {/* Wrap the relevant components */}
  //         <Routes>
  //           {/* ... Your existing routes */}
  //         </Routes>
  //       </SearchResultsProvider>
  //     </UserProvider>
  //   </ThemeProvider>
  // </div>

    <div>
      <ThemeProvider >



        <UserProvider>
          <SearchResultsProvider> {/* Wrap the relevant components */}
          <Routes>

            <Route path='/' element={<Navigate to='/login' />} />

            <Route path='/login' element={<Login />} />
            <Route path='/resetpassword' element={<Reset />} />
            <Route path='bdedashboard' element={<Layout />} >
              <Route index element={<BdeDashboard />} />
            </Route>

            <Route path='dashboard' element={<Layout />} >
              <Route index element={<Dashboard />} />
            </Route>

            <Route path='target' element={<Layout />} >
              <Route path="managetarget" element={<TargetListing />} />
              <Route path="mytarget" element={<MyTarget />} />
            </Route>


            <Route path='demand' element={<Layout />}>
              <Route path='adddemand' element={<UC />} />
              <Route path='managedemands' element={<DemandListing />} />
              <Route path='mydemands' element={<MyDemands />} />
              <Route path='demandstatus' element={<UC />} />
              <Route path='editdemand' element={<EditDemand />} />
            </Route>

            <Route path='submission' element={<Layout />}>
              <Route index path='managesubmissions' element={<SubmissionListing />} />
              <Route path='addsubmission' element={<UC />} />
              <Route path='tracksubmission' element={<TrackSubmission />} />
              <Route path='mysubmissions' element={<MySubmissions />} />
              <Route path='viewsubmission' element={<ViewSubmission />} />

            </Route>

            <Route path='candidatelibrary' element={<Layout />}>
              <Route path='addcandidate' element={<UC />} />
              <Route index path='managecandidates' element={<CandidateListing />} />
              <Route path='editcandidate' element={<EditCandidate />} />
            </Route>

            <Route path='reports' element={<Layout />}>
              <Route path='recruitersubmission' element={<UC />} />
              <Route path='leaddemand' element={<UC />} />
              <Route path='accountmanager' element={<UC />} />
              <Route path='clientreport' element={<LogReport />} />
              <Route path='subvendorsubmission' element={<UC />} />
              <Route path='clientreportcount' element={<UC />} />
              <Route path='logreport' element={<LogReport />} />


            </Route>

            <Route path='masterlist' element={<Layout />}>
              <Route path='add' element={<UC />} />
              <Route path='manageclient' element={<ClientListing />} />
              <Route path='editclient' element={<EditClient />} />
              <Route path='manageskill' element={<SkillListing />} />
              <Route path='editskill' element={<EditSkill />} />
              <Route path='managevendor' element={<VendorListing />} />
              <Route path='editvendor' element={<EditVendor />} />
              {/* <Route path='addlocation' element={<UC/>}/>
                  <Route path='addclient' element={<UC/>}/>
                  <Route path='addsubmissionstatus' element={<UC/>}/>
                  <Route path='addsubvendor' element={<UC/>}/> */}
            </Route>
            
            <Route path='interview' element={<Layout />} >
              <Route index element={<Interview />} />
            </Route>

            <Route path="/interview/:roomId" element={<InterviewRoom/>}/>
            <Route path="/lobby" element={<InterviewUserLobby/>}/>

            <Route path='employee' element={<Layout />}>
              <Route path='addemployee' element={<UC />} />
              <Route path='Manageemployee' element={<EmployeeListing />} />
              <Route path='editemployee' element={<EditEmployee />} />
            </Route>

            <Route path='managedeals' element={<Layout />}>
              <Route path='managesalespipeline' element={<ManagePipeline />} />
              <Route path='editpipeline' element={<EditPipeline />} />

            </Route>
          </Routes>
          </SearchResultsProvider>

        </UserProvider>




      </ThemeProvider>





    </div>
  );
}

export default App;

