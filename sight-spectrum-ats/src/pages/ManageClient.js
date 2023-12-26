import React, { useEffect, useState, useId } from "react";
import styles from "./ManageEmployee.module.css"
import { PrimaryButton, SearchBox, FontIcon, mergeStyles, mergeStyleSets, Dropdown } from '@fluentui/react';
import AddClientModal from "./AddClientModal";
import { DefaultButton, Callout, DirectionalHint } from '@fluentui/react';
import { Shimmer } from '@fluentui/react';
import { useNavigate, useSearchParams } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosPrivateCall } from "../constants";
import Nomatchimg from "../assets/no.png"
import { debounce } from 'lodash';


const addIcon = { iconName: 'Add' };
const searchIcon = { iconName: 'Search' };

const dropdownStyles = mergeStyles({
  dropdown: { width: '200' }
});

const iconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
  margin: '0 10px',
  color: '#999DA0',
  cursor: 'pointer'
});

const iconClass1 = mergeStyles({
  fontSize: 12,
  height: 12,
  width: 12,
  margin: '0 ',
  color: '#999DA0',
  cursor: 'pointer'
});

const iconClassToast = mergeStyles({
  fontSize: 24,
  height: 24,
  width: 24,
  color: '#107C10',
});

const searchFieldStyles = mergeStyleSets({
  root: { width: '185px' }
});


const calloutBtnStyles = {
  root: {
    border: 'none',
    padding: '0px 10px',
    textAlign: 'left',
    height: '20px'

  }
}

const CalloutNameStyles = {
  calloutMain: {
    background: '#EDF2F6',
    padding: '2',

  },

}
const dropdownOptions = [
  { key: 'company_name', text: 'Company Name' },
  { key: 'ClientId', text: 'Client Id' },
  { key: 'basic_details.primary_email', text: 'Email' },
  { key: 'basic_details.primary_mobile', text: 'Mobile' }
];



// let data = '[{"_id":"6369351bea7b50c2d86a6324","first_name":"first_name_test","last_name":"last_name_test","email":"testing@123.com","mobile_number":"9876543210","date_of_hire":"12/09/2020","date_of_joining":"18/09/2022","date_of_birth":"23/09/1997","gender":"male","address_line_1":"adresss_1","address_line_2":"address 2","city":"pondy","pincode":"605002","pan_number":"CFTR2345","aadhaar_number":"123458NF84203F23F3","password_hash":"$2b$10$DyHYHgvccS0HTBB94zQz/eOTz18675hjrYcYX5C23JA/4isEaUC6G","role":"founder","status":"ACTIVE","job_role":"CEO","location":"BALI","reports_to":{"_id":"6369351bea7b50c2d86a6324","name":"bruce"},"is_deleted":false,"createdAt":"2022-11-07T16:40:59.864Z","updatedAt":"2022-11-07T16:40:59.864Z","__v":0},{"_id":"6369f95011496caeb00c580e","first_name":"first_name_test","last_name":"last_name_test","email":"arijackson@123.com","mobile_number":"9876543210","date_of_hire":"12/09/2020","date_of_joining":"18/09/2022","date_of_birth":"23/09/1997","gender":"male","address_line_1":"adresss_1","address_line_2":"address 2","city":"pondy","pincode":"605002","pan_number":"CFTR2345","aadhaar_number":"123458NF84203F23F3","password_hash":"$2b$10$bMd4O0WFBM4lPkiD2jcH8ORpiGeAfxMIv/tnPmx1YOPZW2pbwqCRm","role":"founder","status":"ACTIVE","job_role":"CEO","location":"BALI","reports_to":{"_id":"6369351bea7b50c2d86a6324","name":"bruce"},"is_deleted":false,"createdAt":"2022-11-08T06:38:08.740Z","updatedAt":"2022-11-08T06:38:08.740Z","__v":0},{"_id":"636a117362c3cb62caf8df6b","first_name":"first_name_test","last_name":"last_name_test","email":"arijackson@123.com","mobile_number":"9876543210","date_of_hire":"12/09/2020","date_of_joining":"18/09/2022","date_of_birth":"23/09/1997","gender":"male","address_line_1":"adresss_1","address_line_2":"address 2","city":"pondy","pincode":"605002","pan_number":"CFTR2345","aadhaar_number":"123458NF84203F23F3","password_hash":"$2b$10$IirM1dltlYHyaNy/.dQzIOFhoKaJDGn/1q3r5IYaQFpM2BtC.phxy","role":"founder","status":"ACTIVE","job_role":"CEO","location":"BALI","reports_to":{"_id":"6369351bea7b50c2d86a6324","name":"bruce"},"is_deleted":false,"createdAt":"2022-11-08T08:21:07.054Z","updatedAt":"2022-11-08T08:21:07.054Z","__v":0}]';
// let items = JSON.parse(data);

let items = Array(4).fill(null);




function ClientListing(props) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitSuccess, setSubmitSuccess] = useState(false);
  const [clientList, setClientList] = useState('');

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [rowId, setRowId] = useState('');
  const [hoverCallout, setHoverCallout] = useState('');
  const [updateCallout, setUpdateCallout] = useState(false);
  const [isUserSearching, setIsUserSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownSearch, setDropdownSearch] = useState('');

  const [fetchOptions, setFetchOptions] = useState({
    skip: 0,
    limit: 15,
    sort_field: 'createdAt',
    sort_type: -1,
    search_field: ''
  })

  const [hasMore, setHasMore] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = searchParams.get('user_id')
  const type = searchParams.get('type')

  const navigateTo = useNavigate();

  const columns = [
    {
      columnKey: 'client_id',
      label: 'Client ID',
    }, {
      columnKey: 'company_name',
      label: 'Company Name',
      icon: `${fetchOptions.sort_field === 'company_name' && fetchOptions.sort_type === 1 ? 'SortUp' : 'SortDown'}`
    }, {
      columnKey: 'contact_person',
      label: 'Contact Person',
    }, {
      columnKey: 'company_website',
      label: 'Company Website',
    }, {
      columnKey: 'team',
      label: 'Team'
    }, {
      columnKey: 'email',
      label: 'Email ID'
    }, {
      columnKey: 'mobile',
      label: 'Mobile',
    }, {
      columnKey: 'source_person',
      label: 'Source Person',
    }, {
      columnKey: 'passthrough',
      label: 'Passthrough Person',
    }, {
      columnKey: 'city',
      label: 'City',
    }, {
      columnKey: 'created_by',
      label: 'Created by',
    },
    {
      columnKey: 'Document',
      label: 'Document',
    },
    {
      columnKey: 'Template',
      label: 'Template',
    }, {
      columnKey: 'createdAt',
      icon: `${fetchOptions.sort_field === 'createdAt' && fetchOptions.sort_type === 1 ? 'SortUp' : 'SortDown'}`,
      label: 'Created on',
    }, {
      columnKey: 'More Options',
      label: ' '
    }];



  useEffect(() => {
    getClientData();
    setHasMore(true)
    setFetchOptions({ ...fetchOptions, skip: 0, limit: 15 })

  }, [isModalOpen, fetchOptions.sort_field, fetchOptions.sort_type])


  const handleSearchInputChange = (event) => {
    if (!event || !event.target) {
      setSearchTerm('');
      return;
    }
    const value = event.target.value;

    switch (dropdownSearch) {
      case 'company_name':
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          return;
        }
        break;
      case 'ClientId':
        if (value && !/^[0-9a-zA-Z]+$/.test(value)) {
          return;
        }
        break;
      case 'basic_details.primary_email':
        if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return;
        }
        break;
      case 'basic_details.primary_mobile':
        if (value && !/^[0-9]+$/.test(value)) {
          return;
        }
        break;
      default:
        break;
    }

    setSearchTerm(value);
  };

  const handleDropdownChange = (event, option) => {
    setDropdownSearch(option.key);
    setSearchTerm('');
  };


  const getClientData = debounce(() => {
    setIsDataLoaded(false);
    if (type === "expansion" && userId) {
      axiosPrivateCall
        .get(`/api/v1/BDE/listUserLevelExpansion?user_id=${userId}`)
        .then((res) => {
          const moreClients = res.data;
          setClientList(moreClients);
          setIsDataLoaded(true);
        })
        .catch((e) => {
          console.log(e);
          setIsDataLoaded(true);
        });
    } else if (type === "empanelment" && userId) {
      axiosPrivateCall
        .get(`/api/v1/BDE/listUserLevelEmpanelment?user_id=${userId}`)
        .then((res) => {
          setClientList(res.data);
          setIsDataLoaded(true);
        })
        .catch((e) => {
          console.log(e);
          setIsDataLoaded(true);
        });
    } else {
      axiosPrivateCall
        .get(
          `/api/v1/client/listClients?skip=0&limit=15&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`
        )
        .then((res) => {
          console.log(res.data);
          console.log("hi");
          setClientList(res.data);
          setIsDataLoaded(true);
        })
        .catch((e) => {
          console.log(e);
          setIsDataLoaded(true); // Set the flag to true even on error
        });
    }
  }
    , 500);


  const searchClientList = (e) => {
    const searchValue = e;

    if (searchValue === '') {
      getClientData();
      return;
    }

    setIsDataLoaded(false);
    setIsUserSearching(true);

    setFetchOptions((prevData) => {
      return {
        ...prevData,
        search_field: searchValue,
      };
    });

    axiosPrivateCall
      .get(`/api/v1/client/searchClients?field_name=${dropdownSearch}&field_value=${searchValue}`)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setClientList(res.data);
        setIsDataLoaded(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const clearSearchBox = () => {
    setIsUserSearching(false)

    setFetchOptions(prevData => {
      return {
        ...prevData,
        search_field: ''
      }
    })
  }

  const fetchMoreData = () => {
    if (isUserSearching) {
      axiosPrivateCall.get(`/api/v1/client/searchClient?skip=${fetchOptions.skip + fetchOptions.limit}&limit=${fetchOptions.limit}&field_name=email&field_value=${fetchOptions.search_field}`)
        .then(res => {
          const moreClients = res.data;
          setClientList([...clientList, ...moreClients])
          if (moreClients.length < 15 || moreClients.length === 0) {
            setHasMore(false)
          }
          setFetchOptions((prevState) => {
            return {
              ...prevState,
              skip: fetchOptions.skip + fetchOptions.limit,
            }

          })
        }).catch(e => {
          console.log(e)
        })
    } else if (type === "expansion" && userId) {
      axiosPrivateCall
        .get(`/api/v1/BDE/listUserLevelExpansion?user_id=${userId}&skip=${fetchOptions.skip + fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then((res) => {
          const moreClients = res.data;
          console.log(moreClients.length)
          console.log("hyy");
          setClientList([...clientList, ...moreClients])
          if (moreClients.length < 15 || moreClients.length === 0) {
            setHasMore(false)
          }
          setFetchOptions((prevState) => {
            return {
              ...prevState,
              skip: fetchOptions.skip + fetchOptions.limit,
            }

          })
        }).catch(e => {
          console.log(e)
        })

    }
    else if (type === "empanelment" && userId) {
      axiosPrivateCall
        .get(`/api/v1/BDE/listUserLevelEmpanelment?user_id=${userId}&skip=${fetchOptions.skip + fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then((res) => {
          const moreClients = res.data;
          console.log(moreClients.length)

          setClientList([...clientList, ...moreClients])
          if (moreClients.length < 15 || moreClients.length === 0) {
            setHasMore(false)
          }
          setFetchOptions((prevState) => {
            return {
              ...prevState,
              skip: fetchOptions.skip + fetchOptions.limit,
            }

          })
        }).catch(e => {
          console.log(e)
        })

    }




    else {

      axiosPrivateCall.get(`/api/v1/client/listClients?skip=${fetchOptions.skip + fetchOptions.limit}&limit=${fetchOptions.limit}&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`)
        .then(res => {
          const moreClients = res.data;
          console.log(moreClients.length)
          console.log("hy");
          setClientList([...clientList, ...moreClients])
          if (moreClients.length < 15 || moreClients.length === 0) {
            setHasMore(false)
          }

          setFetchOptions((prevState) => {

            return {

              ...prevState,
              skip: fetchOptions.skip + fetchOptions.limit,
            }

          })
        }).catch(e => {
          console.log(e)
        })

    }


    console.log('getting more data')
  }

  const clickSortHandler = (key) => {

    console.log(key)

    if (!isDataLoaded) return;

    if (key === 'company_name') {
      setFetchOptions(
        {
          ...fetchOptions,
          sort_field: key,
          sort_type: fetchOptions.sort_type === -1 ? 1 : -1,
        }
      )

    }

    if (key === 'createdAt') {
      setFetchOptions(
        {
          ...fetchOptions,
          sort_field: key,
          sort_type: fetchOptions.sort_type === -1 ? 1 : -1,
        }
      )

    }
  }



  const ISOdateToCustomDate = (value) => {
    const dateFormat = new Date(value);
    let year = dateFormat.getFullYear();
    let month = dateFormat.getMonth() + 1;
    let date = dateFormat.getDate();

    if (date < 10) {
      date = '0' + date;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return date + '/' + month + '/' + year;


  }


  const addEllipsisToName = (name) => {

    if (name.length > 13) {
      let new_name = name.substring(0, 13).padEnd(16, '.')



      return new_name
    }
    else return name

  }

  const updateClient = (_id, name, value, index) => {
    const updateObj = {}

    if (name === 'status') {
      updateObj['_id'] = _id

      if (value === false) {
        updateObj[name] = true
      }


      console.log(updateObj, _id)
      axiosPrivateCall.post('/api/v1/client/updateClient', updateObj).then(res => {
        const clientArrList = clientList;
        clientArrList[index][name] = updateObj[name]
        setClientList(clientArrList)
        setUpdateCallout(false)

      }).catch(e => {
        console.log(e)
        setUpdateCallout(false)
      })


    }

  }


  const deleteClient = (_id) => {
    const deleteObj = { "_id": _id }
    axiosPrivateCall.post('/api/v1/client/deleteClient', deleteObj).then(res => {
      const clientArrList = clientList;
      setClientList(clientArrList.filter(client => client._id !== _id))

    }).catch(e => {
      console.log(e)
      setUpdateCallout(false)
    })

  }

  const downloadClients = () => {

    // axiosPrivateCall.get(`/api/v1/client/downloadClient?&sort_field=${fetchOptions.sort_field}&sort_type=${fetchOptions.sort_type}`,{
    //   responseType: 'blob',
    // })
    // .then(response=>{
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', `${Date.now()}.xlsx`);
    //     document.body.appendChild(link);
    //     link.click();

    // }).catch(e=> console.log(e))
  }


  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {isModalOpen && <AddClientModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isSubmitSuccess={isSubmitSuccess}
          setSubmitSuccess={setSubmitSuccess} />}



        <div className={styles.nav_container}>
          <div className={styles.title}>Manage Clients</div>

          {isSubmitSuccess && (<div className={styles.toast}>
            <div className={styles.toast_title}>
              <FontIcon iconName="StatusCircleCheckmark" className={iconClassToast} />
              <div>Client Added Successfully!</div>
            </div>

            <FontIcon iconName="StatusCircleErrorX" className={iconClass} onClick={() => setSubmitSuccess(false)} />
          </div>)
          }

          <div className={styles.nav_items}>
            <Dropdown
              placeholder="Select Search Field"
              options={dropdownOptions}
              styles={dropdownStyles}
              onChange={handleDropdownChange}
              selectedKey={dropdownSearch}
              className={styles.customDropdown}
            />

            <SearchBox
              styles={searchFieldStyles}
              onChange={handleSearchInputChange}
              onSearch={(e) => searchClientList(e)}
              onClear={clearSearchBox}
              disabled={dropdownSearch === ""}
              placeholder=" "
              iconProps={searchIcon}
              className={styles.search}
              value={searchTerm}
              showIcon
            />




            <FontIcon iconName="Breadcrumb" className={iconClass} />
            <PrimaryButton text="Add Client" iconProps={addIcon}
              onClick={() => { setIsModalOpen(!isModalOpen); setSubmitSuccess(false); }} />
            <FontIcon onClick={downloadClients} iconName="Download" className={iconClass} />
          </div>
        </div>

        <div id="scrollableDiv" className={styles.table_container}>
          <InfiniteScroll style={{ overflow: 'visible', height: '100%' }} dataLength={clientList.length} loader={isDataLoaded && clientList.length >= 15 && <h4>Loading...</h4>}
            hasMore={hasMore} next={fetchMoreData} scrollableTarget="scrollableDiv">
            <table>
              <thead className={styles.table_header}>
                <tr className={styles.table_row}>
                  {columns.map((column) =>
                    <th onClick={() => clickSortHandler(column.columnKey)} className={styles.table_headerContents} key={column.columnKey}>
                      <div
                        className={styles.table_heading}>
                        <div>{column.label}</div>
                        {column?.icon ? <FontIcon iconName={column.icon} className={iconClass1} /> : null}
                      </div>
                    </th>)}
                </tr>
              </thead>


              <tbody>
                {isDataLoaded && clientList?.length === 0 ? (
                  <tr>
                    <td className={styles.table_dataContents1} colSpan="13" style={{ textAlign: "center" }}>
                      <img src={Nomatchimg} alt="image" width={"180px"} height={"200px"} />
                    </td>
                  </tr>
                ) : (
                  <>
                    {isDataLoaded && clientList?.map((client, client_index) => (
                      <tr className={client.status ? `${styles.table_row}` : `${styles.table_row_idle}`} key={client._id}>
                        {/* <td className={styles.table_dataContents}><div className={client.status === 'Active' ? styles.status : styles.status_inactive} ></div></td> */}
                        <td onClick={() => navigateTo(`/masterlist/editclient?client_id=${client._id}`)}
                          className={styles.table_dataContents}>
                          {client.ClientId}
                        </td>
                        <td onMouseEnter={() => setHoverCallout(client._id)} onMouseLeave={() => setHoverCallout('')}
                          id={`ME${client._id}`}
                          className={`${styles.table_dataContents} `}>

                          {addEllipsisToName(`${client.company_name} `)}

                          {(client.company_name).length >= 13 && hoverCallout === client._id &&
                            <Callout alignTargetEdge={true}
                              bounds={e => { console.log('log', e) }}
                              isBeakVisible={false} styles={CalloutNameStyles}
                              directionalHint={DirectionalHint.bottomLeftEdge}
                              target={`#ME${client._id}`}>

                              {`${client.company_name}`}
                            </Callout>
                          }
                        </td>

                        <td className={styles.table_dataContents}>{client.basic_details[0].contact_person ? client.basic_details[0].contact_person : "-"}</td>
                        <td className={styles.table_dataContents}>{client.client_details[0].website ? client.client_details[0].website : "-"}</td>
                        <td className={styles.table_dataContents}>{client.basic_details[0].team ? client.basic_details[0].team : "-"}</td>
                        <td className={styles.table_dataContents}>{client.basic_details[0].primary_email ? client.basic_details[0].primary_email : "-"}</td>
                        <td className={styles.table_dataContents}>{client.basic_details[0].primary_mobile ? client.basic_details[0].primary_mobile : "-"}</td>
                        <td className={styles.table_dataContents}>{client.source_person_name ? client.source_person_name : "-"}</td>
                        <td className={styles.table_dataContents}>{client.passthrough_company_name ? client.passthrough_company_name : "-"}</td>
                        <td className={styles.table_dataContents}>{client.client_details[0].city}</td>
                        {/* <td className={styles.table_dataContents}>{`${client.created_by?.first_name} ${client.created_by?.last_name}`}</td> */}
                        <td className={styles.table_dataContents}>{Array.isArray(client.created_by) ? client.created_by.map((user, index) => (
                          <span key={index}>{`${user.first_name} ${user.last_name}`} {index !== client.created_by.length - 1 && ', '}</span>
                        )) : `${client.created_by?.first_name} ${client.created_by?.last_name}`}
                        </td>
                        <td className={styles.table_dataContents}>
                          {client.documents.length > 0 ? (
                            <div>
                              <a
                                href="javascript:void(0);"
                                onClick={() => {
                                  const iframeHTML = client.documents.map((document) => (
                                    `<iframe src="${document.document}" style="width: 80%; height: 700px;"></iframe>`
                                  )).join('');
                                  const newWindow = window.open('', '_blank');
                                  newWindow.document.open();
                                  newWindow.document.write(iframeHTML);
                                  newWindow.document.close();
                                }}
                              >
                                Link
                              </a>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className={styles.table_dataContents}>  {client.template_url.length > 0 ? (
                          <div>
                            <a
                              href="javascript:void(0);"
                              onClick={() => {
                                const iframeHTML = client.template_url.map((document) => (
                                  `<iframe src="${document}" style="width: 80%; height: 700px;"></iframe>`
                                )).join('');
                                const newWindow = window.open('', '_blank');
                                newWindow.document.open();
                                newWindow.document.write(iframeHTML);
                                newWindow.document.close();
                              }}
                            >
                              Link
                            </a>
                          </div>
                        ) : (
                          '-'
                        )}</td>

                        <td className={styles.table_dataContents}>{ISOdateToCustomDate(client.createdAt)}</td>

                        <td className={styles.table_dataContents}>
                          <div id={`${client.pan_number}${client._id}`}
                            onClick={() => { setRowId(client._id); setUpdateCallout(true) }}
                            className={styles.moreOptions}>
                            <FontIcon iconName='MoreVertical' className={iconClass1} />
                            {rowId === client._id && updateCallout && <Callout gapSpace={0}
                              target={`#${client.pan_number}${client._id}`} onDismiss={() => setRowId('')}
                              isBeakVisible={false}
                              directionalHint={DirectionalHint.bottomCenter}>

                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <DefaultButton text="Edit" onClick={() => navigateTo(`/masterlist/editclient?client_id=${client._id}`)} styles={calloutBtnStyles} />
                                <DefaultButton onClick={() => updateClient(client._id, 'status', client.status, client_index)} text='Accept' styles={calloutBtnStyles} />
                                <DefaultButton onClick={() => { }} text='Reject' styles={calloutBtnStyles} />
                                <DefaultButton onClick={() => deleteClient(client._id)} text="Delete" styles={calloutBtnStyles} />
                              </div>
                            </Callout>
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!isDataLoaded && items.map(client => (
                      <tr className={styles.table_row}>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}><Shimmer /></td>
                        <td className={styles.table_dataContents}>
                          <div className={styles.moreOptions}>
                            <FontIcon iconName='MoreVertical' className={iconClass1} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>

            </table>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );

};

export default ClientListing;







