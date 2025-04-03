import './ItemCardStyles.css'

export default function ItemCardComponent(props){

    return (
        <div className="card">
            <span>{props.item.name}</span>
            <span> {props.item.color}</span>
        </div>
    );
}