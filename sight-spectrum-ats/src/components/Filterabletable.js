import React from 'react'
import styles from './Filterabletable.module.css'

const table_headers = [{
	columnKey: 'Current',
	label: " "
},
{
columnKey: 'Employee ID',
label: 'Employee ID',
}, {
columnKey: 'Full Name',
label: 'Full Name',
}, {
columnKey: 'Designation',
label: 'Designation',
}, {
columnKey: 'Lead',
label: 'Lead'
},{
columnKey: 'Manager',
label: 'Manager'
},{
columnKey: 'Mobile',
label: 'Mobile'
},{
columnKey: 'Email ID',
label: 'Email ID'
},{
columnKey: 'Joining Date',
label: 'Joining Date',
},{
columnKey: 'More Options',
label: ' '
}];

const items = [{
	currentStatus:{
			status: 'available'
	},
	employeeID: {
			label: '450945'
	},
	fullName: {
			label: 'Carla Septimus'
	},
	designation: {
			label: 'Associate'
	},
	lead: {
			label: 'Craig Torff'
	},
	manager: {
			label: 'Justin Geidt'
	},
	mobile: {
			label: '9512345678'
	},
	emailID: {
			label: 'qgarcia@hotmail.com'
	},
	joiningDate: {
			label: '26 Dec 2021'
	},
},
{
	currentStatus:{
			status: 'available'
	},
	employeeID: {
			label: '450945'
	},
	fullName: {
			label: 'Carla Septimus'
	},
	designation: {
			label: 'Associate'
	},
	lead: {
			label: 'Craig Torff'
	},
	manager: {
			label: 'Justin Geidt'
	},
	mobile: {
			label: '9512345678'
	},
	emailID: {
			label: 'qgarcia@hotmail.com'
	},
	joiningDate: {
			label: '26 Dec 2021'
	},
	
},
{
	currentStatus:{
			status: 'available'
	},
	employeeID: {
			label: '450945'
	},
	fullName: {
			label: 'Carla Septimus'
	},
	designation: {
			label: 'Associate'
	},
	lead: {
			label: 'Craig Torff'
	},
	manager: {
			label: 'Justin Geidt'
	},
	mobile: {
			label: '9512345678'
	},
	emailID: {
			label: 'qgarcia@hotmail.com'
	},
	joiningDate: {
			label: '26 Dec 2021'
	},

},];


 const FilterableTable = () => {
	return (
		<div className={styles.filtertable_container}>
			<table className={styles.filtertable_container_table} >
				<thead>
					<tr>
						<th> </th>
						{
							table_headers.map((table_head)=>{
								
								return <th>{table_head.columnKey}</th>
 
							})
 						}
						<th> </th>
					
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>1</td>
						<td>1</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}


export default FilterableTable;