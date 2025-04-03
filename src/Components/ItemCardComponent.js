import './ItemCardStyles.css'
import { PrimaryButton } from '@fluentui/react/lib/Button';

export default function ItemCardComponent(props){

    return (
        <div className="card">
            <span>{props.item.name}</span>
            <span> {props.item.color}</span>
            {/* <PrimaryButton text="Standard" /> */}
        </div>
    );
}