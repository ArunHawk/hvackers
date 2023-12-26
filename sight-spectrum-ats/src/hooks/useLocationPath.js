
import { useLocation } from 'react-router-dom';


const useLocationPath = () =>{
	const location = useLocation().pathname;

	const path = location.split('/');
	const mainPath = path[1];
	const subPath = path[path.length - 1] 


	return { path, mainPath, subPath };


}

export {useLocationPath};