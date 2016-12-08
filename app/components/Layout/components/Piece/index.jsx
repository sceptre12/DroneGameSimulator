import React , {Component,PropTypes} from 'react';
import './index.scss';

class Piece extends Component{
    constructor(props){
        super(props);
        this.init();
        this.getPosition = this.getPosition.bind(this);
    }

    init(){
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        }
    }

    getPosition(el){
        var xPos = 0;
        var yPos = 0;

        while (el) {
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            el = el.offsetParent;
        }
        this.setState({
            position: {
                x: xPos,
                y: yPos
            }
        });
        this.props.getCoordinates(this.props.index,this.state);
    }

    render(){
        return (
            <div className="piece" ref={this.getPosition}>
                <span>{this.state.position.x}</span>&nbsp;
                <span>{this.state.position.y}</span>
            </div>
        )
    }
}

Piece.propTypes = {
    getCoordinates: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    name: PropTypes.string
};

export default Piece;
