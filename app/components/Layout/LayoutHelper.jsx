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

export default {
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
