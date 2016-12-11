import React, {PropTypes} from 'react';
import {Button,FormGroup, FormControl, FieldGroup} from 'react-bootstrap';

const CommandOption = ({listOfCommands, executionNum, listOfExecutionNum, listOfSpeeds,lengthOfCommandOptionList,
    index, removeCommand, setCommand,setSpeed,setExecutionNum, setDistance, distance, listOfDistance, command, speed}) => {

    return(
        <tr>
            <td>
                    {index + 1}
            </td>
            <td>
                <FormGroup controlId="commandlist">
                    <FormControl componentClass="select" placeholder="select" value={command} onChange={setCommand.bind(this,index)}>
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
                <FormGroup controlId="executionNumList">
                    <FormControl componentClass="select" placeholder="select" value={executionNum} onChange={setExecutionNum.bind(this,index)}>
                        {
                            listOfExecutionNum.map((executionNum,index)=>{
                                return (
                                    <option
                                        key={index}
                                        value={`${executionNum}`}
                                        >
                                        {executionNum}
                                    </option>
                                )
                            })
                        }
                    </FormControl>
                </FormGroup>
            </td>
            <td>
                <FormGroup controlId="speedList">
                    <FormControl componentClass="select" placeholder="select" value={speed} onChange={setSpeed.bind(this,index)}>
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
                <FormGroup controlId="distanceList">
                    <FormControl componentClass="select" placeholder="select" value={distance} onChange={setDistance.bind(this,index)}>
                        {
                            listOfDistance.map((distance,index)=>{
                                return (
                                    <option
                                        key={index}
                                        value={`${distance}`}
                                        >
                                        {distance}
                                    </option>
                                )
                            })
                        }
                    </FormControl>
                </FormGroup>
            </td>
            <td>
                1
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
    listOfExecutionNum: PropTypes.array.isRequired,
    listOfSpeeds: PropTypes.array.isRequired,
    lengthOfCommandOptionList: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    removeCommand: PropTypes.func.isRequired,
    setCommand: PropTypes.func.isRequired,
    setSpeed: PropTypes.func.isRequired,
    setExecutionNum: PropTypes.func.isRequired,
    setDistance: PropTypes.func.isRequired,
    distance: PropTypes.number.isRequired,
    listOfDistance: PropTypes.array.isRequired,
    command: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired
}

export default CommandOption;
