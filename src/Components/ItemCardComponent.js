import './ItemCardStyles.css'

export default function ItemCardComponent(props){

    return (
        <div className="card">
            <span>{props.item.name}</span>
            <span> {props.item.color}</span>
            <img src={props.item.image} alt={props.item.name + props.item.color} />
        </div>
    );
}