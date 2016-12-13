import React , {Component,PropTypes} from 'react';
import './index.scss';

class Drone extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {posX,posY, getPosition} = this.props;
        return (
                <div className="piece"ref={getPosition} >
                    <p>X:{posX}</p>
                    <p>Y:{posY}</p>
                </div>
        )
    }
}



Drone.propTypes = {
    getPosition: PropTypes.func.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired
};

export default Drone;
