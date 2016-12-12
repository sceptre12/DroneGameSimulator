import React , {Component,PropTypes} from 'react';
import './index.scss';

class Piece extends Component{
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



Piece.propTypes = {
    getPosition: PropTypes.func.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired
};

export default Piece;
