import { useEffect, useRef, useState } from 'react';

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