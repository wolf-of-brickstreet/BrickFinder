import { useEffect, useRef, useState } from 'react';
import BrickDetailsComponent from './BrickDetailsComponent.js'

import './BrickResultComponentStyles.css'

export default function BrickResultComponent({ brick, onSelect  }) {

    return(
        <div className="brickContainer" onClick={onSelect}>
            <img src={brick.img_url} className="brickImage"/>
            <div className="brickInfo">
                <div className="brickNameField"><strong>Name:</strong> { brick.name }</div>
                <div className="brickInfoField">
                    <div><strong>Id:</strong> { brick.id }</div>
                    <div><strong>Score:</strong> { (brick.score * 100).toFixed(2)}%</div>
                </div>
            </div>
        </div>
    );
}