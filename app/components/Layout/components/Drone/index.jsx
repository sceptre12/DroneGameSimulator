import React , {Component,PropTypes} from 'react';
import ReactStateAnimation from 'react-state-animation'
import './index.scss';

class Drone extends Component{
    constructor(props){
        super(props);
        this.init();
    }


    init(){
        const {posX,posY} = this.props;
        this.state={
            x: posX,
            y: posY
        }
        // react state animation wrapper
        this._animate = new ReactStateAnimation(this);
        this.getStyle = this.getStyle.bind(this);
    }


    start() {
        // start animation
        this._animate.linearInOut('x', 350/*end value*/, 1000/*duration(ms)*/);

    }

    stop() {
        this._animate.stop()
    }

    componentDidMount(){
        this.start();
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


    getStyle() {
        return {
            left: this.state.x + "px",
            width: 50,
            height: 50
        }
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
    getPosition: PropTypes.func.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired,
    parentConstraints: PropTypes.object.isRequired
};

export default Drone;
