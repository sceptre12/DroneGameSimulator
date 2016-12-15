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
        // react state animation wrapper
        this._animate = new ReactStateAnimation(this);
        this.getStyle = this.getStyle.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.runDroneProgram = this.runDroneProgram.bind(this);
        this.xConstraints = this.xConstraints.bind(this);
        this.yConstraints = this.yConstraints.bind(this);
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

    xConstraints(distance,cb){
        var output = this.state.x - distance;
        if(output < 0 || output > this.props.parentConstraints.width ){
            cb(null,true);
            return true;
        }
    }

    yConstraints(distance,cb){
        var output = this.state.y - distance;
        if(output < 0 || output > this.props.parentConstraints.height ){
            cb(null,true);
            return true;
        }
    }

    moveUp(distance,speed,cb){
        this.yConstraints(distance,cb);
        this._animate.linearInOut('y', this.state.y - distance, speed).then(()=>{
             if(this.props.stop){
                 cb("Instructions Halted",null);
             }else{
                 cb(null,true);
             }
         }, (err)=>{
             cb(err,null);
         })
    }

    moveLeft(distance,speed,cb){
        this.xConstraints(distance,cb);
        this._animate.linearInOut('x', this.state.x - distance, speed).then(()=>{
             if(this.props.stop){
                 cb("Instructions Halted",null);
             }else{
                 cb(null,true);
             }
         }, (err)=>{
             cb(err,null);
         })
    }

    moveRight(distance,speed,cb){
        this.xConstraints(distance,cb);
        this._animate.linearInOut('x', this.state.x + distance, speed).then(()=>{
             if(this.props.stop){
                 cb("Instructions Halted",null);
             }else{
                 cb(null,true);
             }
         }, (err)=>{
             cb(err,null);
         })
    }

    moveDown(distance,speed,cb){
        this.yConstraints(distance,cb);
         this._animate.linearInOut('y', this.state.y + distance, speed).then(()=>{
             if(this.props.stop){
                 cb("Instructions Halted",null);
             }else{
                 cb(null,true);
             }
         }, (err)=>{
             cb(err,null);
         })
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

    queueCommands(queue,executeTimes,action,distance,speed){
        while(executeTimes > 0){
            queue.push((cb)=>{
                action(distance,speed,cb);
            });
            executeTimes --;
        }
    }

    runDroneProgram(listOfCommands){
        let commandQueue = [];
        listOfCommands.forEach((commandOptions)=>{
            const {command, executionNum, distance, speed} = commandOptions;
            this.queueCommands(commandQueue,executionNum,this[`move${command}`],distance,speed);
        });

        // Executes the commands syncroniously
        series(commandQueue, (err,results)=>{
            this.props.droneFinished();
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
