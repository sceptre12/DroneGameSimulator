import React, {Component} from 'react';
import update from 'immutability-helper';
import {Drone, CommandInputModal} from './components';
import './index.scss';


/**
    Todo Make it a list of Drones
*/
class Layout extends Component{
    constructor(props){
        super(props);
        this.init();

    }

    init(){
        const listOfCommands  = [
            'Up',
            'Down',
            'Right',
            'Left'
        ];
        const listOfSpeeds = [
            1000,
            500,
            250,
            125
        ];
        const listOfDistance = [
            50,
            40,
            30,
            20,
            10
        ];
        const listOfExecutionNum = [
            4,
            3,
            2,
            1
        ]
        this.state={
            defaultCommands: {
                listOfCommands,
                listOfSpeeds,
                listOfDistance,
                listOfExecutionNum,
                command: 'Up',
                speed: 1000,
                distance: 50,
                executionNum: 4,
                crashed: false
            },
            drone: {
                x: 0,
                y: 0
            },
            container:{
                height: 0,
                width: 0
            },
            showCommandModal: false,
            commandHistory: [],
            currentCommands: [],
            stopAllDrones: false
        }
        this.launchCommandModal = this.launchCommandModal.bind(this);
        this.stop = this.stop.bind(this);
        this.getContainerWidth = this.getContainerWidth.bind(this);
        this.closeCommandModal = this.closeCommandModal.bind(this);
        this.keyBoardListener = this.keyBoardListener.bind(this);
        this.automateDrones = this.automateDrones.bind(this);
        this.droneFinished = this.droneFinished.bind(this);
        this.removeDrone = this.removeDrone.bind(this);
        this.getDroneInfo = this.getDroneInfo.bind(this);
    }



    launchCommandModal(){
        this.setState({
            showCommandModal: true
        });
    }

    closeCommandModal(){
        this.setState({
            showCommandModal: false
        });
    }

    stop(){
        this.setState({
            stopAllDrones: true
        });
    }


    automateDrones(CommandList){
        this.setState({
            currentCommands: CommandList,
            showCommandModal: false
        });
    }

    keyBoardListener(){
        this.closeCommandModal();
            window.onkeyup = (e) =>{
                var key = e.keyCode ? e.keyCode : e.which;
                switch(key){
                    case 37: // left
                        this.moveLeft();
                        break;
                    case 38:  // Up
                        this.moveUp();
                        break;
                    case 39: // Right
                        this.moveRight();
                        break;
                    case 40: // Down
                        this.moveDown();
                        break;
                }
            }
    }

    getContainerWidth(el){
        var styles = window.getComputedStyle(el);
        this.setState({
            container: {
                height: parseInt(styles.height,10),
                width: parseInt(styles.width,10)
            }
        });
    }

    droneFinished(droneResults){
        const {currentCommands, commandHistory} = this.state;

        this.setState({
            commandHistory: commandHistory.concat([{
                currentCommands,
                results: {
                    droneResults
                }
            }]),
            currentCommands: []
        },(cb)=>{
            console.log(this.state.commandHistory)
        });
    }

    getDroneInfo(droneId){

    }

    removeDrone(droneId){

    }

    render(){
        const {defaultCommands, showCommandModal, drone, container , currentCommands, stopAllDrones} = this.state;
        return (
            <div id="layout" className="container">
                <CommandInputModal
                    defaultCommands={defaultCommands}
                    showModal={showCommandModal}
                    close={this.closeCommandModal}
                    keyBoardListener={this.keyBoardListener}
                    automateDrones={this.automateDrones}
                    />
                <div className="btn-group" role="group" aria-label="...">
                  <button type="button" className="btn btn-success" onClick={this.stop}>Add Drone</button>
                  <button type="button" className="btn btn-success" onClick={this.launchCommandModal}>Launch Commands</button>
                  <button type="button" className="btn btn-danger" onClick={this.stop}>Stop All Drone Actions</button>
                </div>
                <div id="playground" ref={this.getContainerWidth}>
                    <Drone
                        currentCommands={currentCommands}
                        parentConstraints={container}
                        x={drone.x}
                        y={drone.y}
                        droneFinished={this.droneFinished}
                        stop={stopAllDrones}
                        onClick={this.getDroneInfo}
                        />
                </div>
            </div>
        )
    }
}
export default Layout;
