import React,{createContext,useContext,useState} from 'react'

const UserContext = createContext(null);

export const useUserContext =() =>{
	return useContext(UserContext)
}

export const UserProvider = ({children}) => {

	const [isCollapsed, setCollapsed] = useState(true);
	
	// const token = localStorage.getItem('token');
	// let base64Url = token.split('.')[1];
	// let decodedValue = JSON.parse(window.atob(base64Url));

	return (
	   <UserContext.Provider value={{isCollapsed,setCollapsed}} >
			{children}
		 </UserContext.Provider>
	)
}
