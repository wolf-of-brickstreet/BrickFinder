import './ItemCardStyles.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ItemCardComponent(props){
    async function deleteItem() {
        await fetch('http://localhost:3001/delete-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(props.item)
        });
    }

    return (
        <div className="card">
            <div className="closeButtonContainer">
                <FontAwesomeIcon icon={faXmark} onClick={() =>{deleteItem()} } className="closeButton"/>
            </div>
            <span className="nameField">{props.item.name}</span>
            <span> {props.item.color}</span>
            <span> {props.item.remark}</span>
            <img src={props.item.image} alt={props.item.name + " in " + props.item.color} />
        </div>
    );
}