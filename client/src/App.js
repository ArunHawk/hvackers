import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Home from './pages/Homepage/Home.js';
import Login from './pages/Homepage/Login.js';
import Layout from './component/layout/Layout.js';
import Register from './pages/Homepage/Register.js';
import Dropdown from './pages/Homepage/dropdown.js';

function App() {

  return (
   <Router>
    <Routes>
       <Route path='/' element={<Layout/>}>
        <Route index  element={<Home/>}/>
        <Route path='/login'  element={<Login/>}/>
        <Route path='/signup'  element={<Register/>}/>
        <Route path='/drop'  element={<Dropdown/>}/>
      </Route>
    </Routes>
   </Router>
  );
}

export default App;
