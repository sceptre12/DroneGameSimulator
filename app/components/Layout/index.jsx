import React, {Component} from 'react';
import update from 'immutability-helper';
import series from 'async/series';
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
                executionNum: 4
            },
            drone: {
                element: {},
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
            listOfTimers: []
        }
        this.getPosition = this.getPosition.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.launchCommandModal = this.launchCommandModal.bind(this);
        this.stop = this.stop.bind(this);
        this.getContainerWidth = this.getContainerWidth.bind(this);
        this.closeCommandModal = this.closeCommandModal.bind(this);
        this.keyBoardListener = this.keyBoardListener.bind(this);
        this.automateDrones = this.automateDrones.bind(this);
    }

    getElementPos(el){
        return {
            x: (el.offsetLeft - el.scrollLeft + el.clientLeft),
            y: (el.offsetTop - el.scrollTop + el.clientTop)
        }
    }

    getPosition(el,cb){
        let element = el;
        const {x,y} = this.getElementPos(el);
        this.setState({
            drone: {
                element,
                x,
                y
            }
        },(something)=>{
            if(cb){
                cb(null,'success');
            }
        });
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
        window.onkeyup = null;
    }

    moveUp(distance,cb){
        let moveAmount = distance || 10;
        let topVal = parseInt(window.getComputedStyle(this.state.drone.element).top,10);
        if(topVal - moveAmount < 0 ) return ;
        this.state.drone.element.style.top =`${topVal - moveAmount}px`;
        this.getPosition(this.state.drone.element,cb);
    }

    moveLeft(distance,cb){
        let moveAmount = distance || 10;
        let leftVal = parseInt(window.getComputedStyle(this.state.drone.element).left,10);
        if(leftVal - moveAmount < 0 ) return ;
        this.state.drone.element.style.left =`${leftVal - moveAmount}px`;
        this.getPosition(this.state.drone.element,cb);
    }

    moveRight(distance,cb){

        let moveAmount = distance || 10;
        let leftVal = parseInt(window.getComputedStyle(this.state.drone.element).left, 10);
        let pieceWidth = parseInt(window.getComputedStyle(this.state.drone.element).width,10);
        if((leftVal + pieceWidth) + moveAmount > this.state.container.width ) return ;
        this.state.drone.element.style.left =`${leftVal + moveAmount}px`;
        this.getPosition(this.state.drone.element,cb);
    }

    moveDown(distance,cb){
        const {drone:{element} , container: {height}} = this.state;
        let moveAmount = distance || 10;
        let topVal = parseInt(window.getComputedStyle(element).top,10);
        let pieceHeight = parseInt(window.getComputedStyle(element).height,10);
        if((topVal + pieceHeight) + moveAmount > height ) return ;
        element.style.top =`${topVal + moveAmount}px`;
        this.getPosition(element,cb);
    }

    queueCommands(queue,executeTimes,action,distance,speed){
        while(executeTimes > 0){
            queue.push((cb)=>{
                let timer = window.setTimeout(action.bind(this,distance,cb),speed);
            });
            executeTimes --;
        }
    }

    runProgram(listOfCommands){
        let commandQueue = [];
        listOfCommands.forEach((commandOptions)=>{
            const {command, executionNum, distance, speed} = commandOptions;
            this.queueCommands(commandQueue,executionNum,this[`move${command}`],distance,speed);
        });

        // Executes the commands syncroniously
        series(commandQueue, (err,results)=>{
            console.log(results);
        });
    }

    automateDrones(CommandList){

        console.log(CommandList);
        this.setState({
            currentCommands: CommandList,
            showCommandModal: false
        });
        this.runProgram(CommandList);
        // TODO Insert Coundown Overlay code

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

    render(){
        const {defaultCommands, showCommandModal, drone} = this.state;
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
                  <button type="button" className="btn btn-success" onClick={this.launchCommandModal}>Start</button>
                  <button type="button" className="btn btn-danger" onClick={this.stop}>Stop</button>
                </div>
                <div id="playground" ref={this.getContainerWidth}>
                    <Drone getPosition={this.getPosition} posX={drone.x} posY={drone.y}/>
                </div>
            </div>
        )
    }
}
export default Layout;
