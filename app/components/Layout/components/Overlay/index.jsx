import React, {Component} from 'react';
import {ScatterPlot} from './components';
import './index.scss';


// The number of data points for the chart.
const numDataPoints = 50;

// A function that returns a random number from 0 to 1000
const randomNum = () => Math.floor(Math.random() * 1000);

// A function that creates an array of 50 elements of (x, y) coordinates.
const randomDataSet = () => {
    return Array.apply(null, {length: numDataPoints}).map(() => {
        return {x: randomNum(), y: randomNum()}
    });
}

class Overlay extends Component {
    constructor(props) {
        super(props);
        this.init();
    }

    init() {
        this.state = {
            data: [
                [
                    {
                        x: 0,
                        y: 0
                    }
                ]
            ],
            styles: {
                width: 0,
                height: 0,
                padding: 30
            }
        };
        this.createPoints = this.createPoints.bind(this);
        this.getContainerWidth = this.getContainerWidth.bind(this);
    }

    createPoints() {
        var points = [];
        const {generatedCommands:{droneCommandList}, droneList} = this.props;
        var droneListCommands = droneList.map((drone, index) => {
            return {
                droneInitalCoordinates: drone,
                currentCommands: droneCommandList.filter((command) => {
                    return command.droneId === index
                })
            }
        });
        
        // Creates coordinate points for each drone
        droneListCommands.forEach((operation,index) => {
            const {
                droneInitalCoordinates: {
                    x,
                    y
                }
            } = operation;
            points[index] = [];
            points[index] = points[index].concat(operation.currentCommands.reduce((accumulator, currentCommand, currentIndex) => {
                /**
                        Gets the previous coordinates and based on the current command
                        calculates the new coordinates the drone is going to visit
                    */
                accumulator.push(this[`move${currentCommand.command}`](currentCommand.distance, accumulator[currentIndex]));
                return accumulator;
            }, [{x,y}]));
        });
        console.log(points)
        return points;
    }

    moveUp(distance, previousCoord) {
        const {x, y} = previousCoord;
        return {
            x,
            y: y - distance
        };
    }
    
    moveDown(distance, previousCoord) {
        const {x, y} = previousCoord;
        return {
            x,
            y: y + distance
        }
    }
    
    moveRight(distance, previousCoord) {
        const {x, y} = previousCoord;
        return {
            x: x + distance,
            y
        }
    }
    
    moveLeft(distance, previousCoord) {
        const {x, y} = previousCoord;
        return {
            x: x - distance,
            y
        }
    }

    generatePoints() {
        this.setState({data: this.createPoints()});
    }
    
    getContainerWidth(el){
        console.log(el)
        var styles = window.getComputedStyle(el);
        this.setState({
            styles: {
                height: parseInt(styles.height,10),
                width: parseInt(styles.width,10),
                padding: 30
            }
        });
    }

    render() {
        const {launchDroneCommands,generatedCommands:{droneCommandList}} = this.props;
        return (
            <div id="droneOverlay">
                <div className="contentArea" ref={this.getContainerWidth} >
                    <ScatterPlot {...this.state} {...this.state.styles}/>
                    {
                        droneCommandList.length?
                        <div className="controls">
                            <button className="btn" onClick={() => this.generatePoints()}>
                                Draw path 
                            </button>
                            <button className="btn" onClick={launchDroneCommands}>
                                Start Drones
                            </button>
                        </div>:
                        ''
                    }
                </div>
            </div>
        )
    }
}

export default Overlay;
