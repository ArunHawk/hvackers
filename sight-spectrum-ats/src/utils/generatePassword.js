let chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let pwordLength = 10;


const generatePassword = () =>{
	let password = '';

	const array = new Uint32Array(chars.length);
	window.crypto.getRandomValues(array);
	
	for (let i = 0; i < pwordLength; i++) {
		password += chars[array[i] % chars.length];
	}
   
    console.log(password,"pas")
	return password;


}

export { generatePassword }



