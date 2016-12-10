import React, {Component, PropTypes} from 'react';
import { Modal, Button, Table, Tooltip, OverlayTrigger} from 'react-bootstrap';
import update from 'immutability-helper';
import CommandOption from './components/CommandOption';

class CommandInputModal extends Component{
    constructor(props){
        super(props);
        this.init();
    }

    init(){
        this.CommandOptionList = [
            update(this.props.defaultCommands,{})
        ];
        this.state = {
            CommandOptionList: this.CommandOptionList
        }
        this.addCommands = this.addCommands.bind(this);
        this.removeCommand = this.removeCommand.bind(this);
        this.setCommand = this.setCommand.bind(this);
        this.setSpeed = this.setSpeed.bind(this);
        this.setExecutionNum = this.setExecutionNum.bind(this);
        this.start = this.start.bind(this);
    }

    addCommands(){
        this.setState({
            CommandOptionList: this.state.CommandOptionList.concat([update(this.props.defaultCommands,{})])
        });
    }

    removeCommand(index,event){
        this.setState({
            CommandOptionList: this.state.CommandOptionList.filter((item,pos)=>{
                return index !== pos;
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
        })
    }

    setExecutionNum(index,event){
        this.setState({
            CommandOptionList: this.state.CommandOptionList.map((options,pos)=>{
                if(index === pos){
                    options.executionNum = parseInt(event.target.value,10);
                    return options;
                }
                return options;
            })
        })
    }

    start(){
        console.log(this.state.CommandOptionList)
        // this.props.automateDrones(this.state.CommandOptionList.slice());
        // this.setState({
        //     CommandOptionList: this.CommandOptionList
        // });
    }

    render(){
        const tooltip = (
          <Tooltip id="tooltip"><strong>Use the Keyboard to move the drone</strong></Tooltip>
        );
        return(
            <Modal
                show={this.props.showModal}
                onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Command Input
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                                    return (
                                        <CommandOption
                                            key={index}
                                            index={index}
                                            lengthOfCommandOptionList={this.state.CommandOptionList.length}
                                            listOfCommands={option.listOfCommands}
                                            executionNum={option.executionNum}
                                            listOfSpeeds={option.listOfSpeeds}
                                            removeCommand={this.removeCommand}
                                            setCommand={this.setCommand}
                                            setSpeed={this.setSpeed}
                                            setExecutionNum={this.setExecutionNum}
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
                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                        <Button onClick={this.props.keyBoardListener}>FreeControl</Button>
                    </OverlayTrigger>
                    <Button onClick={this.start}>Start</Button>
                    <Button onClick={this.props.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

CommandInputModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    keyBoardListener: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    automateDrones: PropTypes.func.isRequired,
    defaultCommands: PropTypes.object.isRequired
}

export default CommandInputModal;
