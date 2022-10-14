import React, { useState, useEffect } from 'react';
import EditableElement from './EditableElement';
import ContextMenu from './ContextMenu';

const CustomTable = () => {
    let [rows, setRows] = useState(20);
    let [columns, setColumns] = useState(20);
    let [data, setData] = useState([[]]);
    let [showContext, setShowContext] = useState('none');
    let [contextLocation, setContextLocation] = useState({x:0,y:0});
    let [activeCell, setActiveCell] = useState({x:-1,y:-1})

    const makeDefaultData = (r,c) =>{
        let data = new Array(r);
        for (let i = 0; i < r; i++) {
            data[i] = new Array(c).fill(null);
        };
        return data
    }

    const handleCellContextMenuClick = (e) =>{
        e.preventDefault();
        let location = {
            x: e.clientX,
            y: e.clientY
        }
        setContextLocation(location);
        setShowContext('block');
    };

    const handleContextClick = (value) =>{
        console.log(value);
        switch (value) {
            case "Add Column Left":
                changeColumns(activeCell.x, activeCell.y, 'left')
              break;
            case "Add Column Right":
                changeColumns(activeCell.x, activeCell.y, 'right')
              break;
            case "Add Row Top":
                changeRow(activeCell.x, activeCell.y, 'top')
              break;
            case "Add Row Bottom":
                changeRow(activeCell.x, activeCell.y, 'bottom')
              break;
            case "Sort Row wise":
                sortRows(activeCell.x, activeCell.y)
              break;
            case "Sort Column wise":
                sortColumns(activeCell.x, activeCell.y)
              break;
          }
        setShowContext('none')
    }

    const sortRows = (x,y) => {
        let newData = data.map((arr) => arr.slice());
        let currentRow = newData[x];
        currentRow.sort((x,y) =>x-y);
        newData[x] = currentRow;
        setData(newData);
    }

    const sortColumns = (x,y) => {
        let newData = data.map((arr) => arr.slice());
        let column = [];
        newData.map(row => {
            column.push(row[y])
        });
        column.sort((x,y)=>x-y);
        newData.map((item, index) => newData[index][y]= column[index]);
        setData(newData);
    }

    const changeRow = (x,y, type='') =>{
        let newData = data.map((arr) => arr.slice());
        if(type==='top'){
            if(x >= 0){
                newData = [
                    ...newData.slice(0, x-1),
                    new Array(rows).fill(null),
                    ...newData.slice(x-1)
                ]
            }
        } else if(type === 'bottom'){
            if(x >= 0){
                newData = [
                    ...newData.slice(0, x+1),
                    new Array(rows).fill(null),
                    ...newData.slice(x+1)
                ]
            }
        }
        setData(newData);
    }

    const changeColumns = (x ,y, type='') =>{
        let newData = data.map((arr) => arr.slice());
        if(type==='left'){
            if(y >= 0){
                newData = newData.map( (item,index)=>{
                        return [
                            ...item.slice(0, y-1),
                            null,
                            ...item.slice(y-1)
                        ]
                });
            }
        } else if(type === 'right'){
            if(y >= 0){
                newData = newData.map( (item , index)=>{
                        return [
                            ...item.slice(0, y+1),
                            null,
                            ...item.slice(y+1)
                        ]
                });
            }
        }
        setData(newData);
    } 

    const handleDataChange = (value, x, y) => {
        let newData = data.map((arr) => arr.slice());
        newData[x][y] = value;
        setData(newData);
    }

    const handleStructureChange = (x,y) =>{
        setActiveCell({x,y});
    }

    const renderTable = () => {
        console.log(data);
        return data.map((row, i) =>
            (<tr key={i}>
                {row.map((item, j) => <td key={`${i}-${j}`}>
                    <EditableElement onSelect={handleStructureChange} onChange={handleDataChange} x={i} y={j}>
                        <div className='cell' onContextMenu={handleCellContextMenuClick}  x={i} y={j}>
                            {item}
                        </div>
                    </EditableElement>
                </td>)}
            </tr>)
        )
    }

    useEffect(()=>{
        setData(makeDefaultData(rows, columns));
    }, []);
    
    return (
        <div className="container">
            <table id="customers">
                <tbody>
                    {renderTable()}
                </tbody>
            </table>
            <ContextMenu 
                x={contextLocation.x} 
                y={contextLocation.y} 
                showContext={showContext}
                contextClick={handleContextClick}
            />
        </div>
    );
} 

export default CustomTable;