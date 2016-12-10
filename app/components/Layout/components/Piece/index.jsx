import React , {Component,PropTypes} from 'react';
import './index.scss';

class Piece extends Component{
    constructor(props){
        super(props);
    }


    render(){
        return (
            <div className="piece" ref={this.props.getPosition}>
                <p>X:{this.props.posX}</p>
                <p>Y:{this.props.posY}</p>
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
