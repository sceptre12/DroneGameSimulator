import React, {PropTypes} from 'react';
import {Button,FormGroup, FormControl, FieldGroup} from 'react-bootstrap';

const CommandOption = ({listOfCommands, executionNum, listOfSpeeds,lengthOfCommandOptionList, index, removeCommand, setCommand,setSpeed,setExecutionNum}) => {
    const executionNumConstraint = (event)=>{
        if(event.target.value < 0){
            event.target.value = 0;
        }
    }

    return(
        <tr>
            <td>
                    {index + 1}
            </td>
            <td>
                <FormGroup controlId="formControlsSelect">
                    <FormControl componentClass="select" placeholder="select" onChange={setCommand.bind(this,index)}>
                        {
                            listOfCommands.map((command,index)=>{
                                return (
                                    <option
                                        key={index}
                                        value={`${command}`}
                                        >
                                        {command}
                                    </option>
                                )
                            })
                        }
                    </FormControl>
                </FormGroup>
            </td>
            <td>
                <FormControl type="number"
                    placeholder="Execution Number"
                    onChange={executionNumConstraint}
                    onBlur={setExecutionNum.bind(this,index)}
                    />
            </td>
            <td>
                <FormGroup controlId="formControlsSelect">
                    <FormControl componentClass="select" placeholder="select" onChange={setSpeed.bind(this,index)}>
                        {
                            listOfSpeeds.map((speed,index)=>{
                                return (
                                    <option
                                        key={index}
                                        value={`${speed}`}
                                        >
                                        {speed}
                                    </option>
                                )
                            })
                        }
                    </FormControl>
                </FormGroup>
            </td>
            <td>

            </td>
            <td>
                { lengthOfCommandOptionList === 1? '' : <Button onClick={removeCommand.bind(this,index)}>Delete</Button>}
            </td>
        </tr>
    )
}

CommandOption.propTypes = {
    listOfCommands: PropTypes.array.isRequired,
    executionNum: PropTypes.number.isRequired,
    listOfSpeeds: PropTypes.array.isRequired,
    lengthOfCommandOptionList: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    removeCommand: PropTypes.func.isRequired,
    setCommand: PropTypes.func.isRequired,
    setSpeed: PropTypes.func.isRequired,
    setExecutionNum: PropTypes.func.isRequired
}

export default CommandOption;
