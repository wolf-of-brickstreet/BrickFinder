/* eslint-disable react-hooks/exhaustive-deps */
import XMLData from '../Data/TestBrickstore.bsx'
import axios from 'axios'
import Item from '../Model/Item.js'
import { useEffect, useState } from 'react';
import ItemCardComponent from './ItemCardComponent.js';

import './MainComponentStyles.css'

export default function MainComponent(){
    const [items, setItems] = useState();

    useEffect(() => {
        readXML();
    }, [])

    function xmlToJson(xml) {
        let obj = {};
        if (xml.nodeType === 1) { // Element node
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (let attr of xml.attributes) {
                    obj["@attributes"][attr.nodeName] = attr.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) { // Text node
            return xml.nodeValue.trim();
        }
        
        if (xml.hasChildNodes()) {
            for (let child of xml.childNodes) {
                let nodeName = child.nodeName;
                let value = xmlToJson(child);
        
                if (value) {
                    if (!obj[nodeName]) {
                        obj[nodeName] = value;
                    } else {
                        if (!Array.isArray(obj[nodeName])) {
                            obj[nodeName] = [obj[nodeName]];
                        }
                        obj[nodeName].push(value);
                    }
                }
            }
        }
        return obj;
    }
        
    function readXML() {
        console.log("halle xml");
        var xml;
        axios.get(XMLData, {
            "Content-Type": "application/xml; charset=utf-8"
        })
        .then((response) => {
            var parser = new DOMParser();
            xml = parser.parseFromString(response.data, "text/xml");
            var jsonObj = xmlToJson(xml.documentElement);
            var tmpItems = [];
            for (const entry of jsonObj.Inventory.Item) {
                // debugger;
                var item = new Item(
                    entry.ItemID["#text"],
                    entry.ItemName["#text"],
                    entry.ItemTypeName["#text"],
                    entry.ColorName["#text"],
                    entry.CategoryName["#text"],
                    entry.Remarks["#text"]
                );
                tmpItems.push(item);
            }
            setItems(tmpItems);
            console.log(tmpItems);
        });
    };

    return (
        <div className='cards'>
            { items?.map((item) => (
                <ItemCardComponent item={item} />
            ))}
        </div>
    );
}