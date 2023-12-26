const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const numRegex = /^\d+$/;
const alphaNumericRegex = /^([a-zA-Z0-9 ]+)$/;
const alphaNumericSpecialRegex = /^([a-zA-Z0-9.-_,@ ]+)$/;



export const isEmailValid = (value,setState)=>{

	if(value.length===0){
		setState((prevState)=>{
			return{
				...prevState,
				email: "Required"
			}
		})
		return false;
	}

	if(!String(value).toLowerCase().match(emailRegex)){
		setState((prevState)=>{
			return{
				...prevState,
				email: "Invalid Email"
			}
		})

		return false;
	}

	return true;
}	


export const isEmpty=(str)=> {
	return (str === null || str.length === 0 );
}


export const isNumOnly= (str) =>{
	return numRegex.test(str)
}


export const isAlphaNumeric = (str)=>{
	return alphaNumericRegex.test(str);
}

export const getNumberFromString = (str) =>{
	return str.replace(/[^0-9]/g,'')
}

export const isAlphaNumericSpecial = (str)=>{
	return alphaNumericSpecialRegex.test(str);
}

export const isObjectPropsEmpty = (obj) =>{
	return Object.values(obj).every(val => val === null || val === '' )
}

