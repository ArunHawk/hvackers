import React, {useState, useRef, useEffect} from "react";
import Fuse from 'fuse.js';
import styles from './ComboBox.module.css'
import { TextField } from "@fluentui/react";


function ComboBox(props) {
    let dropdown = props.dropdown?.map((value) => {return {item: value}});
    const [isDroped, setIsDroped] = useState(false);
    const [options, setOptions] = useState([...dropdown]);
    const refDrop = useRef();
    const [value, setValue] = useState();
    const [currentHover, setCurrentHover] = useState("");

    let inputChangeHandler = props.inputChangeHandler;
    let name = props.name;
    let error = props.errorMessage;
    let setInfo = props.setInfo;
    let setInfoErrors = props.setInfoErrors;
    let index = props.index;
    let textfield = props.textfield;
   
    const textField = (props, currentHover, error, value) => {
        return {
          fieldGroup: {
            height: "22px",
            width: "100%",
            borderColor: error ? "#a80000" : "transparent",
            selectors: {
              ":focus": {
                borderColor: "rgb(96, 94, 92)",
              },
            },
          },
          field: { lineHeight: "24px", fontSize: 12 },
        };
      };


      const textFieldColored = (props, currentHover, error, value) => {
        return {
          fieldGroup: {
            width: "160px",
            height: "22px",
            backgroundColor: "#EDF2F6",
            borderColor: error ? "#a80000" : "transparent",
      
            selectors: {
              ":focus": {
                borderColor: "rgb(96, 94, 92)",
              },
            },
          },
          field: {
            fontSize: 12,
          },
        };
      };
    

    const fuse = new Fuse(props.dropdown, {
        keys: ['text',]
      })

    useEffect(() => {
        document.addEventListener ('click' , handleOutsideClick, true);
    }, [])

    useEffect(() => {}, [options])


    function handleOutsideClick(e) {
        if (!refDrop.current?.contains(e.target)) 
        {
            setIsDroped(false);
        }
    }

    function dropdownContents(event) {
        let data = event.target.value;
        let result = fuse.search(data);
        // data ? setOptions([...result]) : setOptions([...dropdown]) ;

        if(data)
        {
          setOptions([...result])
          
        } else {
          setOptions([...dropdown])
        }
    }

    function textValue(event) {
        let data = event.target.value;
        setValue(data);
    }

    function select(data, name, arr)
    {
        setValue(data);

        if (index == undefined)
        { setInfo((prevState) => {
            return { ...prevState, [name]: data };
          });
    
          setInfoErrors((prevState) => {
            return { ...prevState, [name]: null };
          });

        } else {

          if (props.skillArr)
          {
            const skillsetArr = arr;

            skillsetArr[index][name] = data;
            setInfo((prevData) => {
              return {
                ...prevData,
                skillset: skillsetArr,
              };
            });

             setInfoErrors((prevData) => {
              const skillsetArr = prevData["skillset"];
              skillsetArr[index][name] = "";
              return {
                ...prevData,
                skillset: skillsetArr,
              };
          });
          } else {
        
              setInfo((prevState) => {
                let update = [...prevState];
                update[index][name] = data;
        
                return update;
              });
        
              setInfoErrors((prevState) => {
                let errorupdate = [...prevState];
                errorupdate[index][name] = null;
        
                return errorupdate;
        });
        }

       }
        setIsDroped(false);
    }

     return(
        <div styles={{minWidth:props.width, height:'20px'}} className={styles.container}>
            {/* <label>{props.label}</label> */}

           
            <div className={styles.combo_container}>
                <div className={styles.input_container}
                onClick={() => setIsDroped(true)}>
                        <TextField
                          type="text"
                          name={props.name}
                          placeholder={props.placeholder}
                          value={props.value}
                          errorMessage={props.showError ? error : null}
                          styles={(props) => !(textfield == 'color') ?
                            textField(
                              props,
                              currentHover,
                              error,
                              name
                            ) : textFieldColored(
                              props,
                              currentHover,
                              error,
                              name
                            )
                          }
                          onChange={(event) => {
                            dropdownContents(event,setInfo); 
                            textValue(event); 
                            if (props.skillArr)
                            {
                              inputChangeHandler(event, name, index, props.arr)
                            } else {
                               index === undefined ? inputChangeHandler(event,name,setInfo,setInfoErrors) : inputChangeHandler(event,name,index,setInfo,setInfoErrors)
                            }}
                          }
                          
                        />  
                </div>

                {isDroped && <div className={styles.dropdown_container} ref={refDrop}>
                    {options.map((value) => <div key={value.item.key} onClick={() => {select(value.item.text, name, props.arr)}} className={styles.dropdown_option}>{value.item?.text}</div> )}
                </div>}
            </div>

                 
            
            
        </div>

    );
};

export default ComboBox;