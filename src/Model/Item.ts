export default class Item {
    id: string;
    partId: string;
    name: string;
    type: string;
    typeId: string;
    color: string;
    colorId: number;
    category: string;
    remark: string;
    image: string;

    constructor(id: string, partId:string, name: string, type: string, typeId: string, color: string, colorId: number, category: string, remark: string){
        this.id = id;
        this.partId = partId;
        this.name = name;
        this.type = type;
        this.typeId = typeId;
        this.color = color;
        this.colorId = colorId;
        this.category = category;
        this.remark = remark;
        this.image = this.getItemImageUrl();
    };

    getItemImageUrl() {
        var fileExt = "jpg";
        var tmpColorId = this.colorId;

        if (this.colorId === 0) {
            fileExt = "gif";
            tmpColorId = 1;
        }
        if (this.typeId === "P") {
            return `https://img.bricklink.com/ItemImage/PT/${tmpColorId}/${this.partId}.t1.png`;
        } else {
            return `https://img.bricklink.com/${this.typeId}/${this.partId}.jpg`
        }
    };
}