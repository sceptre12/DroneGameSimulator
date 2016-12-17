import React, {Component, PropTypes} from 'react';
import { Modal, Button, Table, Tooltip, OverlayTrigger, Collapse} from 'react-bootstrap';
import  Dropzone from 'react-dropzone';
import papaParse from 'papaparse';
import update from 'immutability-helper';
import CommandOption from './components/CommandOption';
import './index.scss';

class CommandInputModal extends Component{
    constructor(props){
        super(props);
        this.init();
    }

    init(){
        this.state = {
            CommandOptionList: [Object.assign({},this.props.defaultCommands)],
            showFileUpload: false
        }
        this.addCommands = this.addCommands.bind(this);
        this.removeCommand = this.removeCommand.bind(this);
        this.setCommand = this.setCommand.bind(this);
        this.setSpeed = this.setSpeed.bind(this);
        this.setExecutionNum = this.setExecutionNum.bind(this);
        this.setDistance = this.setDistance.bind(this);
        this.setDroneId = this.setDroneId.bind(this);
        this.start = this.start.bind(this);
        this.populateCommandOptionListFromFile = this.populateCommandOptionListFromFile.bind(this);
        this.createDroneId = this.createDroneId.bind(this);
    }

    addCommands(){
        this.setState({
            CommandOptionList: this.state.CommandOptionList.slice().concat([Object.assign({},this.props.defaultCommands)])
        });
    }

    removeCommand(index,event){
        this.setState({
            CommandOptionList: this.state.CommandOptionList.filter((item,pos)=>{
                return index !== pos;
            })
        });
    }

    setDistance(index,event){
        if(parseInt(event.target.value,10) < 0){
            event.target.value = 0;
        }
        this.setState({
            CommandOptionList: this.state.CommandOptionList.map((options,pos)=>{
                if(index === pos){
                    options.distance = parseInt(event.target.value,10)
                    return options;
                }
                return options;
            })
        });
    }

    createDroneId(){
        let droneId = [];
        var counter = 0;
        while(counter < this.props.droneListLength){
            droneId.push(counter);
            counter ++;
        }
        return droneId;
    }

    setDroneId(index,event){
        this.setState({
            CommandOptionList: this.state.CommandOptionList.map((options,pos)=>{
                if(index === pos){
                    options.droneId = parseInt(event.target.value,10);
                    return options;
                }
                return options;
            })
        })
    }

    setCommand(index,event){
        this.setState({
            CommandOptionList: this.state.CommandOptionList.map((options,pos)=>{
                if(index === pos){
                    options.command = event.target.value
                    return options;
                }
                return options;
            })
        });
    }

    setSpeed(index,event){
        this.setState({
            CommandOptionList: this.state.CommandOptionList.map((options,pos)=>{
                if(index === pos){
                    options.speed = parseInt(event.target.value,10);
                    return options;
                }
                return options;
            })
        });
    }

    setExecutionNum(index,event){
        if(parseInt(event.target.value,10) < 0){
            event.target.value = 0;
        }
        this.setState({
            CommandOptionList: this.state.CommandOptionList.map((options,pos)=>{
                if(index === pos){
                    options.executionNum = parseInt(event.target.value,10);
                    return options;
                }
                return options;
            })
        });
    }

    start(){
        this.props.automateDrones(this.state.CommandOptionList.slice());
        this.setState({
            CommandOptionList: [Object.assign({},this.props.defaultCommands)]
        });
    }

    populateCommandOptionListFromFile(data){
        this.setState({
            CommandOptionList: data.filter((a)=>{
                if(Object.keys(a).length !== 5){
                    return false;
                }
                return true;
            }).map((instructions)=>{
                const {listOfCommands, listOfDistance ,listOfExecutionNum, listOfSpeeds} = this.state.CommandOptionList[0];
                const {command,speed,distance,droneId,executionNum} = instructions;
                return {
                    listOfCommands,
                    listOfDistance,
                    listOfExecutionNum,
                    listOfSpeeds,
                    command,
                    speed: parseInt(speed,10),
                    distance: parseInt(distance, 10),
                    droneId: parseInt(droneId,10),
                    executionNum: parseInt(executionNum,10),
                    crashed: false
                }
            })
        });
    }

    fileUpload(acceptedFiles, rejectedFiles) {
        if(!rejectedFiles.length){
            papaParse.parse(acceptedFiles[0],{
                delimiter: ',',
                header: true,
                complete:(results)=>{
                    this.populateCommandOptionListFromFile(results.data);
                }
            });
        }else{
            console.log('File has been rejected');
        }
    }

    render(){
        const tooltip = (
          <Tooltip id="tooltip"><strong>Use the Keyboard to move the drone</strong></Tooltip>
        );
        return(
            <Modal
                show={this.props.showModal}
                onHide={this.props.close} id="CommandInputModal">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Command Input
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Dropzone onDrop={this.fileUpload.bind(this)} className="dropZone" >
                        <button type="button" className="btn btn-primary">Upload Commands (Csv Only)</button>
                    </Dropzone>
                    <hr/>
                    <Table responsive striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>
                                    Command Choices
                                </th>
                                <th>
                                    Execution Amount
                                </th>
                                <th>
                                    Drone Speed
                                </th>
                                <th>
                                    Distance
                                </th>
                                <th>
                                    Drone #
                                </th>
                                <th>
                                    Remove
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.CommandOptionList.map((option,index)=>{
                                    const {command, speed,distance, executionNum, listOfSpeeds,listOfDistance,listOfCommands, listOfExecutionNum, droneId} = option;
                                    return (
                                        <CommandOption
                                            key={index}
                                            index={index}
                                            command={command}
                                            speed={speed}
                                            distance={distance}
                                            droneId={droneId}
                                            droneIdList={this.createDroneId}
                                            listOfDistance={listOfDistance}
                                            lengthOfCommandOptionList={this.state.CommandOptionList.length}
                                            listOfCommands={listOfCommands}
                                            listOfExecutionNum={listOfExecutionNum}
                                            executionNum={executionNum}
                                            listOfSpeeds={listOfSpeeds}
                                            removeCommand={this.removeCommand}
                                            setCommand={this.setCommand}
                                            setSpeed={this.setSpeed}
                                            setExecutionNum={this.setExecutionNum}
                                            setDistance={this.setDistance}
                                            setDroneId={this.setDroneId}
                                             />
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <Button
                        bsStyle="primary"
                        bsSize="large"
                        block
                        onClick={this.addCommands}
                        >Add Command</Button>
                </Modal.Body>
                <Modal.Footer>

                    <Button onClick={this.start}>Start</Button>
                    <Button onClick={this.props.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

// <OverlayTrigger placement="bottom" overlay={tooltip}>
//     <Button onClick={this.props.keyBoardListener}>FreeControl</Button>
// </OverlayTrigger>
CommandInputModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    keyBoardListener: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    automateDrones: PropTypes.func.isRequired,
    defaultCommands: PropTypes.object.isRequired,
    droneListLength: PropTypes.number.isRequired
}

export default CommandInputModal;
