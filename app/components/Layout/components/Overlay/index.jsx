import React, {Component} from 'react';
import {ScatterPlot} from './components';
import './index.scss';

const styles = {
    width: 500,
    height: 300,
    padding: 30
}

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
            ]
        };
        this.createPoints = this.createPoints.bind(this);
    }

    createPoints() {
        var points = [];
        const {currentCommands, droneList} = this.props;
        var droneListCommands = droneList.map((drone, index) => {
            return {
                droneInitalCoordinates: drone,
                currentCommands: currentCommands.filter((command) => {
                    return command.droneId === index
                })
            }
        })

        //TODO The concat isnt working because the current index is undefined
        // Need to fix 
        droneListCommands.forEach((operation,index) => {
            const {
                droneInitalCoordinates: {
                    x,
                    y
                }
            } = operation;
            points[index] = points[index].concat(operation.currentCommands.reduce((accumulator, currentCommand, currentIndex) => {
                /**
                        Gets the previous coordinates and based on the current command
                        calculates the new coordinates the drone is going to visit
                        accumulator[currentIndex] === index 0 = x index 1 = y
                    */
                accumulator.push(this[`move${currentCommand.command}`](currentCommand.distance, accumulator[currentIndex]));
                return accumulator;
            }, [
                {
                    x,
                    y
                }
            ]));
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

    randomizeData() {
        this.setState({data: this.createPoints()});
    }

    render() {
        return (
            <div id="droneOverlay">
                <ScatterPlot {...this.state} {...styles}/>
                <div className="controls">
                    <button className="btn randomize" onClick={() => this.randomizeData()}>
                        Randomize Data
                    </button>
                </div>
            </div>
        )
    }
}

export default Overlay;
