import React from 'react';

const ContextMenu = (props) => {
    let menuItems = [
        'Add Column Left', 
        'Add Column Right', 
        'Add Row Top', 
        'Add Row Bottom', 
        'Sort Row wise(Left to Right, asc)',
        'Sort Row wise(Left to Right, dsc)', 
        'Sort Column wise(Top to Bottom, asc)',
        'Sort Column wise(Top to Bottom, dsc)'
    ]
    const handleContextItemClick = (e) => {
        e.preventDefault();
        if(props.contextClick){
            props.contextClick(e.target.innerHTML);
        }
    }
    return(
        <div className='context-menu-container' style={{top:props.y, left:props.x, display: props.showContext}}>
            {menuItems.map((i, j) =><div key={j} className='context-menu-item' onClick={handleContextItemClick}>{i}</div>)}
        </div>
    )
}

export default ContextMenu;