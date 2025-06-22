/* eslint-disable react-hooks/exhaustive-deps */
import XMLData from '../Data/TestBrickstore.bsx'
import axios from 'axios'
import Item from '../Model/Item.ts'
import { useEffect, useState } from 'react';
import ItemCardComponent from './ItemCardComponent.js';
import CameraPopupComponent from './CameraPopupComponent.js';

import './MainComponentStyles.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'

export default function MainComponent(){
    const [items, setItems] = useState();
    const [itemsByStorage, setItemsByStorage] = useState([]);
    const [filteredItemsByStorage, setFilteredItemsByStorage] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const [cameraOpen, setCameraOpen] = useState(false);

    let inputTimer;

    useEffect(() => {
        readXML();
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedValue(inputValue);
        }, 500); // 500 ms warten nach letztem Input

        return () => clearTimeout(timer); // Timer abbrechen, wenn sich inputValue erneut ändert
    }, [inputValue]);

    useEffect(() => {
        if (debouncedValue) {
            console.log('Suche mit:', debouncedValue);
            var tmpItems = [];
            for (const storage of itemsByStorage) {
                var test = storage.filter(part => part.name.toLowerCase().includes(debouncedValue.toLowerCase()) || part.id.toLowerCase().includes(debouncedValue.toLowerCase()));
            tmpItems.push(test);
            }
            setFilteredItemsByStorage([...tmpItems]);
        } else {
            setFilteredItemsByStorage([...itemsByStorage]);
        }
    }, [debouncedValue]);

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
                var item = new Item(
                    entry.ItemID["#text"],
                    entry.ItemName["#text"],
                    entry.ItemTypeName["#text"],
                    entry.ItemTypeID["#text"],
                    entry.ColorName["#text"],
                    Number(entry.ColorID["#text"]),
                    entry.CategoryName["#text"],
                    entry.Remarks["#text"]
                );
                tmpItems.push(item);
                
            }
            sortItemsByStorage(tmpItems);
            setItems(tmpItems);
        });
    };

    function sortItemsByStorage(items) {
        var tmpItemsByStorage = [...itemsByStorage];
        for(const item of items) {
            if (tmpItemsByStorage.length > 0) {
                var itemStorage = item.remark.split(".")[0];
                var storageFound = false;
    
                for (const storage of tmpItemsByStorage) {
                    if (itemStorage === storage[0].remark.split(".")[0]) {
                        storage.push(item);
                        storageFound = true;
                        continue;
                    }
                }
                if (!storageFound) {
                    tmpItemsByStorage.push([item]);    
                }
            } else {
                tmpItemsByStorage.push([item]);
            }
        }
        setItemsByStorage([...tmpItemsByStorage]);
        setFilteredItemsByStorage([...tmpItemsByStorage]);
    }

    return (
        <div className="mainContainer">
            <div className="header">
                <span className="heading">BRICKSTORAGE</span>
            </div>
            <div className="filterDiv">
                <input className="searchInput" placeholder='Search...' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                <FontAwesomeIcon icon={faCamera} onClick={() => setCameraOpen(true)} />
            </div>

            <CameraPopupComponent
                isOpen={cameraOpen}
                onClose={() => setCameraOpen(false)}
            />
            <div>
                { filteredItemsByStorage?.map((storage, index) => (
                    <div key={ storage[0]?.remark.split('.')[0] }>
                        <div className="heading">{ storage[0]?.remark.split('.')[0] }</div>
                        <div className='cards'>
                            { storage?.map((item) => (
                                <ItemCardComponent key={item.id + item.color} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
    );
}