import { useEffect, useRef, useState } from 'react';

import XMLData from '../Data/TestBrickstore.bsx'
import axios from 'axios'

import './BrickDetailsComponentStyles.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function BrickDetailsComponent({ isOpen, onClose, brick, itemsByStorage }) {

    useEffect(() => {
        if (!isOpen) return;
    }, [isOpen]);

    function findItemInStorage(storage) {
      if (storage.length > 0) {
        const hits = storage.filter(item => item.id === brick.id);
        if (hits.length > 0) {
          return (
            <div key={storage[0].remark.split(".")[0]}>
              { hits.map((item) => <div key={item.id + '_' + item.remark}>{item.remark} ({item.color})</div>) }
            </div>
          )
        }
      }
    }

    function saveAsNewBrick() {
        var xml;
        axios.get(XMLData, {
            "Content-Type": "application/xml; charset=utf-8"
        })
        .then((response) => {
            var parser = new DOMParser();
            xml = parser.parseFromString(response.data, "text/xml");
            const inventory = xml.getElementsByTagName('Inventory')[0];

            if (!inventory) {
              console.error('Kein <Inventory>-Element gefunden!');
              return;
            }

            const item = xml.createElement('Item');

            const createElementWithText = (tag, text) => {
              const el = xml.createElement(tag);
              el.appendChild(xml.createTextNode(text));
              return el;
            };

            const typeId = brick.type === "part" ? "P" : "M";
            item.appendChild(createElementWithText('ItemID', brick.id));
            item.appendChild(createElementWithText('ItemName', brick.name));
            item.appendChild(createElementWithText('ItemTypeName', brick.type));
            item.appendChild(createElementWithText('ItemTypeID', typeId));
            item.appendChild(createElementWithText('ColorName', "(Not Applicable)")); // TODO dropdown
            item.appendChild(createElementWithText('ColorID', 0)); // TODO dropdown
            item.appendChild(createElementWithText('CategoryName', brick.category));
            item.appendChild(createElementWithText('CategoryID', 0)); // TODO ID rausfinden
            item.appendChild(createElementWithText('Status', "I"));
            item.appendChild(createElementWithText('Qty', 0)); // TODO input
            item.appendChild(createElementWithText('Price', 0.000));
            item.appendChild(createElementWithText('Condition', "N"));
            item.appendChild(createElementWithText('Remarks', "test")); // TODO input
            item.appendChild(createElementWithText('DateAdded', (new Date()).toISOString()));
            // <ItemID>sw1366</ItemID>
            // <ItemTypeID>M</ItemTypeID>
            // <ColorID>0</ColorID>
            // <ItemName>Darth Dev (Darth Devastator)</ItemName>
            // <ItemTypeName>Minifigure</ItemTypeName>
            // <ColorName>(Not Applicable)</ColorName>
            // <CategoryID>65</CategoryID>
            // <CategoryName>Star Wars</CategoryName>
            // <Status>I</Status>
            // <Qty>1</Qty>
            // <Price>0.000</Price>
            // <Condition>N</Condition>
            // <Remarks>L1.1</Remarks>
            // <DateAdded>2025-03-24T06:55:24Z</DateAdded>
            // <DifferenceBaseValues Remarks=""/>

            inventory.appendChild(item);

            const updatedXmlString = new XMLSerializer().serializeToString(xml);

            saveXmlToServer(updatedXmlString);
        });
    };

    async function saveXmlToServer(xmlString) {
      try {
        const response = await axios.post('http://localhost:3001/save-xml', xmlString, {
          headers: { 'Content-Type': 'application/xml' }
        });
        console.log(response.data);
      } catch (error) {
        console.error('Fehler beim Speichern:', error);
      }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <div className="detailsContainer">
                  <div className="closeButtonContainer">
                    <FontAwesomeIcon icon={faXmark} onClick={() =>{console.log("onclose"); onClose()} } className="closeButton"/>
                  </div>
                    <img src={brick.img_url} className="brickDetailsImage"/>
                    <div className="detailsRow"><strong>Name:</strong><div>{brick.name}</div></div>
                    <div className="detailsRow"><strong>Id:</strong><div>{brick.id}</div></div>
                    <div className="detailsRow"><strong>Type:</strong><div>{brick.type}</div></div>
                    { itemsByStorage.map((storage) => findItemInStorage(storage))}
                    <button onClick={()=> saveAsNewBrick()}>save</button>
                </div>
            </div>
        </div>
    )
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 1001,
  },
  popup: {
    background: 'white', borderRadius: '10px', width: '90%', maxWidth: 400,
    position: 'relative', height: `70%`
  },
  closeBtn: {
    marginTop: 10, padding: '8px 16px'
  }
};