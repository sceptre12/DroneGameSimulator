import React from 'react';
import {scaleLinear, max} from 'd3';

// Returns the largest X coordinate from the data set
const xMax = (data) => max(data, (d) => d.x);

// Returns the highest Y coordinate from the data set
const yMax = (data) => max(data, (d) => d.y);

// Returns a function that "scales" X coordinates from the data to fit the chart
const xScale = (props) => {
    return scaleLinear().domain([
        0,
        xMax(props.data)
    ]).range([
        props.padding, props.width - props.padding * 2
    ]);
};

// Returns a function that "scales" Y coordinates from the data to fit the chart
const yScale = (props) => {
    return scaleLinear().domain([
        0,
        yMax(props.data)
    ]).range([
        props.padding,
        props.height - props.padding
    ]);
};

const renderCircles = (props) => {
  return (coords, index) => {
    const circleProps = {
      cx: xScale(props)(coords.x),
      cy: yScale(props)(coords.y),
      r: 5,
      key: index
    };
    const style= {
        fill: props.color
    }
    return <circle {...circleProps} style={style}/>;
  };
};

export default (props) => {
  return (
      <g>
          {
              props.data.map(renderCircles(props))
          }
      </g>
  )
}
