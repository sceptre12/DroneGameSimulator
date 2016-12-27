// y is being subtract
function moveUp(distance,defaultCoordinates){
    Object.keys(defaultCoordinates).forEach((key)=>{
        defaultCoordinates[key].y = defaultCoordinates[key].y - distance;
    });
    return defaultCoordinates;
}

// y is being added
function moveDown(distance,defaultCoordinates){
    Object.keys(defaultCoordinates).forEach((key)=>{
        defaultCoordinates[key].y = defaultCoordinates[key].y + distance;
    });
    return defaultCoordinates;
}

// x is being substracted
function moveLeft(distance,defaultCoordinates){
    Object.keys(defaultCoordinates).forEach((key)=>{
        defaultCoordinates[key].x = defaultCoordinates[key].x - distance;
    });
    return defaultCoordinates;
}

// x is being added
function moveRight(distance,defaultCoordinates){
    Object.keys(defaultCoordinates).forEach((key)=>{
        defaultCoordinates[key].x = defaultCoordinates[key].x + distance;
    });
    return defaultCoordinates;
}

// constants
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

export default {
    listOfExecutionNum,
    listOfDistance,
    listOfCommands,
    listOfSpeeds,
    droneActions: {
        moveUp,
        moveDown,
        moveLeft,
        moveRight
    },
    getDefaultCoordinates: (x,y,width,height)=>{
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
    }
}
