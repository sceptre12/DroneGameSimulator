import React from 'react';
import DataCircles from './data-circles';

const colorList= [
    'red',
    'blue',
    'orange',
    'yellow',
    'black'
];
export default(props) => {
    const {data,styles:{padding,width,height}} = props;
    console.log(props)
    return <svg width={width} height={height}>
        {
            data.map((coordinates,index)=>{
                return (
                    <DataCircles key={index} color={colorList[index]} data={coordinates} padding={padding} width={width} height={height}/>
                )
            })
        }
    </svg>
}
