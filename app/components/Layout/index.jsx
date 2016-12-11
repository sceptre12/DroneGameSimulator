import React, {Component} from 'react';
import update from 'immutability-helper';
import series from 'async/series';
import {Piece, CommandInputModal} from './components';
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
        let xPos = 0;
        let yPos = 0;
        let element = el;
        xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        return {
            x: xPos,
            y: yPos
        }
    }

    getPosition(el,cb){
        let element = el;
        let position = this.getElementPos(el);
        this.setState({
            drone: {
                element: element,
                x: position.x,
                y: position.y
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
        let moveAmount = distance || 10;
        let topVal = parseInt(window.getComputedStyle(this.state.drone.element).top,10);
        let pieceHeight = parseInt(window.getComputedStyle(this.state.drone.element).height,10);
        if((topVal + pieceHeight) + moveAmount > this.state.container.height ) return ;
        this.state.drone.element.style.top =`${topVal + moveAmount}px`;
        this.getPosition(this.state.drone.element,cb);
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
            switch(commandOptions.command){
                case 'Up':
                    this.queueCommands(commandQueue,commandOptions.executionNum,this.moveUp,commandOptions.distance,commandOptions.speed);
                    break;
                case 'Down':
                    this.queueCommands(commandQueue,commandOptions.executionNum,this.moveDown,commandOptions.distance,commandOptions.speed);
                    break;
                case 'Left':
                    this.queueCommands(commandQueue,commandOptions.executionNum,this.moveLeft,commandOptions.distance,commandOptions.speed);
                    break;
                case 'Right':
                    this.queueCommands(commandQueue,commandOptions.executionNum,this.moveRight,commandOptions.distance,commandOptions.speed);
                    break;
            }
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
        return (
            <div id="layout" className="container">
                <CommandInputModal
                    defaultCommands={this.state.defaultCommands}
                    showModal={this.state.showCommandModal}
                    close={this.closeCommandModal}
                    keyBoardListener={this.keyBoardListener}
                    automateDrones={this.automateDrones}
                    />
                <div className="btn-group" role="group" aria-label="...">
                  <button type="button" className="btn btn-success" onClick={this.launchCommandModal}>Start</button>
                  <button type="button" className="btn btn-danger" onClick={this.stop}>Stop</button>
                </div>
                <div id="playground" ref={this.getContainerWidth}>
                    <Piece getPosition={this.getPosition} posX={this.state.drone.x} posY={this.state.drone.y}/>
                </div>
            </div>
        )
    }
}

export default Layout;
