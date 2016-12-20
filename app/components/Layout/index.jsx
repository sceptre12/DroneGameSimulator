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
                crashed: false,
                droneId: 0
            },
            droneList: [
                {
                    x: 0,
                    y: 0,
                    element: {}
                }
            ],
            container:{
                height: 0,
                width: 0
            },
            droneAttributes: {
                width: 100,
                height: 100
            },
            showCommandModal: false,
            commandHistory: [],
            currentCommands: [],
            droneExecutableCommands: [
                []
            ],
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
        this.addDrone = this.addDrone.bind(this);
        this.getAllDroneCoordinates = this.getAllDroneCoordinates.bind(this);
        this.queueCommands = this.queueCommands.bind(this);
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
    
    
    queueCommands(command,droneCommandList,droneExecutables,executeTimes,action,distance,speed, droneId){
        
        // returns list of droneId's
        let droneRefs = Object.keys(this.refs).filter((key)=>{
            if(key.includes('drone')) return true;
            return false;
        });
        
        while(executeTimes > 0){
            // populates the drone command list with the specific instructions each drone gets
            let commandIndex = droneCommandList.push({
                distance,
                speed,
                command,
                crashed: false,
                droneId
            });
            console.log(droneId)
            // Creates an async wrapper which the drones can use to execute commands syncroniously 
            droneExecutables[droneId].push((cb)=>{
                /**
                 * passes the commands to the drones action methods 
                 */
                this.refs[droneRefs[droneId]][`move${action}`](distance,speed,cb,commandIndex - 1);
            });
            executeTimes --; 
        }
        console.log(droneCommandList);
    }


    automateDrones(CommandList){
        
        this.setState({
            showCommandModal: false
        },()=>{
            const {droneExecutableCommands, currentCommands} = this.state;
            
            let droneExecutables = droneExecutableCommands.slice();
            let droneCommandList = currentCommands.slice();
            
            // Loops through the general commands and breaks them down into something the drones can work with
            CommandList.forEach((commandOptions)=>{
                const {command, executionNum, distance, speed, droneId} = commandOptions;
                this.queueCommands(command,droneCommandList,droneExecutables,executionNum,command,distance,speed, droneId);
            });
            
            this.setState({
                currentCommands: droneCommandList,
                droneExecutableCommands: droneExecutables
            })
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
                    droneResults,
                    date: new Date()
                }
            }]),
            currentCommands: []
        },(cb)=>{
            console.log(this.state.commandHistory)
        });
    }

    addDrone(){
        const {droneList, droneExecutableCommands, droneAttributes:{width}} = this.state;
        this.setState({
            droneList: droneList.concat({
                x: 0,
                y: 0
            }).reduce((accumulator,droneObj,currentIndex)=>{
                if(!accumulator.length){
                    accumulator.push(droneObj);
                }else{
                    let {x} = accumulator[currentIndex - 1];
                    accumulator.push({
                        x: x + width + 10,
                        y: 0
                    })
                }
                return accumulator;
            },[]),
            droneExecutableCommands: droneExecutableCommands.concat([[]])
        })
    }


    getAllDroneCoordinates(){
        const {droneAttributes:{width,height}} = this.state;

        // returns list of droneId's
        let droneRefs = Object.keys(this.refs).filter((key)=>{
            if(key.includes('drone')) return true;
            return false;
        });

        return droneRefs.map((droneKey)=>{
            const {state:{x,y}} = this.refs[droneKey];
            return {
                topLeft: {
                    x,
                    y
                },
                topRight: {
                    x: x + width,
                    y
                },
                bottomLeft: {
                    x,
                    y: y + height
                },
                bottomRight: {
                    x: x + width,
                    y: y + height
                }
            }
        })
    }

    // TODO
    getDroneInfo(droneId){

    }

    // TODO
    removeDrone(droneId){

    }

    render(){
        const {defaultCommands, showCommandModal, container , currentCommands, stopAllDrones,droneList, droneAttributes, droneExecutableCommands} = this.state;
        return (
            <div id="layout" className="container">
                <CommandInputModal
                    defaultCommands={defaultCommands}
                    droneListLength={droneList.length}
                    showModal={showCommandModal}
                    close={this.closeCommandModal}
                    keyBoardListener={this.keyBoardListener}
                    automateDrones={this.automateDrones}
                    />
                <div className="btn-group" role="group" aria-label="...">
                  <button type="button" className="btn btn-success" onClick={this.addDrone}>Add Drone</button>
                  <button type="button" className="btn btn-success" onClick={this.launchCommandModal}>Launch Commands</button>
                  <button type="button" className="btn btn-danger" onClick={this.stop}>Stop All Drone Actions</button>
                </div>
                <div id="playground" ref={this.getContainerWidth}>
                    {
                        this.state.droneList.map((drone,index)=>{
                            return (
                                <Drone
                                    key={index}
                                    droneId={index}
                                    droneAttributes={droneAttributes}
                                    currentCommands={currentCommands}
                                    droneExecutableCommands={droneExecutableCommands[index]}
                                    parentConstraints={container}
                                    x={drone.x}
                                    y={drone.y}
                                    ref={`drone${index}`}
                                    allDroneCoordinates={this.getAllDroneCoordinates}
                                    droneFinished={this.droneFinished}
                                    stop={stopAllDrones}
                                    onClick={this.getDroneInfo}
                                    />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
export default Layout;
