import React, {Component} from 'react';
import update from 'immutability-helper';
import {Piece} from './components';
import './index.scss';

class Layout extends Component{
    constructor(props){
        super(props);
        this.init();
        this.getCoordinates = this.getCoordinates.bind(this);
    }

    init(){
        this.state={
            elementCount: 1,
            elementList: [],
            elementsPos:[]
        }
    }

    getCoordinates(index,state){
        console.log(state);
        this.setState({
            elementsPos: this.state.elementsPos.concat([{index,state.position}])
        });
        console.log(this.state);
    }

    render(){
        return (
            <div id="layout" className="container">
                <div className="btn-group" role="group" aria-label="...">
                  <button type="button" className="btn btn-success">Start </button>
                  <button type="button" className="btn btn-danger">Stop</button>
                </div>
                <Piece
                    getCoordinates={this.getCoordinates}
                    name="test"
                    index={0}
                    />
            </div>
        )
    }
}

export default Layout;
