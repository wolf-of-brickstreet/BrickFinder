export default function ItemCardComponent(props){

    return (
        <div>
            { props.items?.map((item) => (
                <div>
                    <span>{item.name}</span>
                    <span> {item.color}</span>
                </div>
            ))}
        </div>
    );
}