import { useEffect, useRef, useState } from 'react';

import './BrickResultComponentStyles.css'

export default function BrickResultComponent({ brick }) {

    return(
        <div className="brickContainer">
            <img src={brick.img_url} className="brickImage"/>
            <div className="brickInfo">
                <div className="brickNameField"><strong>Name:</strong> { brick.name }</div>
                <div>Id: { brick.id }</div>
            </div>
        </div>
    );
}