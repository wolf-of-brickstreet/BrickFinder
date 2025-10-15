import './ItemCardStyles.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ItemCardComponent(props){
    async function deleteItem() {
        await fetch('https://raspberrypi.local/delete-item', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: props.item.id })
        }).then(() => window.location.reload());
    }

    return (
        <div className="card">
            <div className="closeButtonContainer">
                <FontAwesomeIcon icon={faXmark} onClick={() =>{if (window.confirm("Do you really want to delete " + props.item.name + "?")) {deleteItem()}} } className="closeButton"/>
            </div>
            <span className="nameField">{props.item.name}</span>
            <span> {props.item.color}</span>
            <span> {props.item.remark}</span>
            <img src={props.item.image} alt={props.item.name + " in " + props.item.color} />
        </div>
    );
}