import React from 'react';
import DataCircles from './data-circles';

export default(props) => {
    const {data,padding,width,height} = props;
    return <svg width={width} height={height}>
        {
            data.map((coordinates,index)=>{
                return (
                    <DataCircles key={index} data={coordinates} padding={padding} width={width} height={height}/>
                )
            })
        }
    </svg>
}
