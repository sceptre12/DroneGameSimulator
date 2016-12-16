import React , {Component,PropTypes} from 'react';
import ReactStateAnimation from 'react-state-animation';
import series from 'async/series';
import './index.scss';

class Drone extends Component{
    constructor(props){
        super(props);
        this.init();
    }


    init(){
        const {x,y} = this.props;
        this.state={
            x,
            y
        }
        // private instance variable
        this.commandQueue = [];

        // react state animation wrapper
        this._animate = new ReactStateAnimation(this);

        // Function bindings
        this.getStyle = this.getStyle.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.runDroneProgram = this.runDroneProgram.bind(this);
        this.xConstraints = this.xConstraints.bind(this);
        this.yConstraints = this.yConstraints.bind(this);
        this.queueCommands = this.queueCommands.bind(this);
        this.logCrash = this.logCrash.bind(this);
    }

    stop() {
        this._animate.stop()
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.currentCommands.length){
            this.runDroneProgram(nextProps.currentCommands);
        }
        if(nextProps.stop){
            this.stop();
        }
    }

    xConstraints(distance,cb,commandIndex){
        if(distance < 0 || distance > this.props.parentConstraints.width ){
            this.logCrash(commandIndex,"containerCrash",distance,{x: true});
            cb(null,true);
            return true;
        }
        return false;

    }

    yConstraints(distance,cb,commandIndex){
        if(distance < 0 || distance > this.props.parentConstraints.height ){
            this.logCrash(commandIndex,"containerCrash",distance,{y: true});
            cb(null,true);
            return true;
        }
        return false;
    }

    logCrash(commandIndex,type,distance,axis){
        let crashOccurrence = {};
        if(axis.x){
            crashOccurrence = {
                x: distance,
                y: this.state.y
            }
        }else if (axis.y){
            crashOccurrence = {
                x: this.state.x,
                y: distance
            }
        }
        crashOccurrence.type = type;
        this.commandQueue[commandIndex].crashed = true;
        this.commandQueue[commandIndex].crashOccurrence = crashOccurrence;
    }

    moveUp(distance,speed,cb,commandIndex){
        var output = this.state.y - distance;
        if(!this.yConstraints(output,cb,commandIndex)){
           this._animate.linearInOut('y', output, speed).then(()=>{
            if(this.props.stop){
                cb("Instructions Halted",null);
            }else{
                cb(null,true);
            }
         }, (err)=>{
             cb(err,null);
         });
        }
    }

    moveLeft(distance,speed,cb,commandIndex){
        var output = this.state.x - distance;
        if(!this.xConstraints(output,cb,commandIndex)){
          this._animate.linearInOut('x', output, speed).then(()=>{
            if(this.props.stop){
                cb("Instructions Halted",null);
            }else{
                cb(null,true);
            }
         }, (err)=>{
             cb(err,null);
         });
        }
    }

    moveRight(distance,speed,cb,commandIndex){
        var output = this.state.x + distance;
        if(!this.xConstraints(output,cb,commandIndex)){
           this._animate.linearInOut('x', output, speed).then(()=>{
            if(this.props.stop){
                cb("Instructions Halted",null);
            }else{
                cb(null,true);
            }
         }, (err)=>{
             cb(err,null);
         });
        }
    }

    moveDown(distance,speed,cb,commandIndex){
        var output = this.state.y + distance;
        if(!this.yConstraints(output,cb,commandIndex)){
           this._animate.linearInOut('y',output, speed).then(()=>{
            if(this.props.stop){
                cb("Instructions Halted",null);
            }else{
                cb(null,true);
            }
         }, (err)=>{
             cb(err,null);
         });
        }
    }


    getStyle() {
        const {x,y} = this.state;
        return {
            top: `${y}px`,
            left: `${x}px`,
            width: 50,
            height: 50
        }
    }

    queueCommands(command,functionQueue,executeTimes,action,distance,speed){
        while(executeTimes > 0){
            let commandIndex = this.commandQueue.push({
                distance,
                speed,
                command
            });
            functionQueue.push((cb)=>{
                action(distance,speed,cb,commandIndex - 1);
            });
            executeTimes --;
        }
    }

    runDroneProgram(listOfCommands){
        let commandFunctionQueue = [];
        listOfCommands.forEach((commandOptions)=>{
            const {command, executionNum, distance, speed} = commandOptions;
            this.queueCommands(command,commandFunctionQueue,executionNum,this[`move${command}`],distance,speed);
        });

        // Executes the commands syncroniously
        series(commandFunctionQueue, (err,results)=>{
            this.props.droneFinished(this.commandQueue.slice());
            this.commandQueue = [];
        });
    }

    render(){
        const {posX,posY, getPosition} = this.props;
        return (
                <div className="drone" style={this.getStyle()} ref={getPosition}>
                    <p>X:{parseInt(this.state.x,10)}</p>
                    <p>Y:{parseInt(this.state.y,10)}</p>
                </div>
        )
    }
}



Drone.propTypes = {
    currentCommands: PropTypes.array.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    parentConstraints: PropTypes.object.isRequired,
    droneFinished: PropTypes.func.isRequired,
    stop: PropTypes.bool.isRequired
};

export default Drone;
