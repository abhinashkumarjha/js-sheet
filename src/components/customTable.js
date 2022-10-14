import React, { useState, useEffect } from 'react';
import EditableElement from './EditableElement';
import ContextMenu from './ContextMenu';

const CustomTable = () => {
    const rows = 20;
    const columns = 20;
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
            case "Sort Row wise(Left to Right, asc)":
                sortRows(activeCell.x, activeCell.y)
              break;
            case "Sort Column wise(Top to Bottom, asc)":
                sortColumns(activeCell.x, activeCell.y)
              break;
              case "Sort Row wise(Left to Right, dsc)":
                sortRows(activeCell.x, activeCell.y, 'dsc')
              break;
            case "Sort Column wise(Top to Bottom, dsc)":
                sortColumns(activeCell.x, activeCell.y, 'dsc')
              break;
            default: break;
          }
        setShowContext('none')
    }

    const sortRows = (x,y,type='asc') => {
        let newData = data.map((arr) => arr.slice());
        let currentRow = newData[x];
        if(type === 'dsc'){
            currentRow.sort((b, a) => (a===null)-(b===null) || +(a>b)||-(a<b));
        } else {
            currentRow.sort((a, b) => (a===null)-(b===null) || +(a>b)||-(a<b));
        }
        newData[x] = currentRow;
        setData(newData);
    }

    const sortColumns = (x,y, type='asc') => {
        let newData = data.map((arr) => arr.slice());
        let column = [];
        newData.map(row => {
            column.push(row[y]);
            return 0
        });
        if(type === 'dsc'){
            column.sort((b, a) => (a===null)-(b===null) || +(a>b)||-(a<b));
        } else {
            column.sort((a, b) => (a===null)-(b===null) || +(a>b)||-(a<b));
        }
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
                newData = newData.map( (item)=>{
                        return [
                            ...item.slice(0, y-1),
                            null,
                            ...item.slice(y-1)
                        ]
                });
            }
        } else if(type === 'right'){
            if(y >= 0){
                newData = newData.map( (item)=>{
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
        if(value){
            let newData = data.map((arr) => arr.slice());
            newData[x][y] = value;
            setData(newData);
        }
    }

    const handleStructureChange = (x,y) =>{
        setActiveCell({x,y});
        setShowContext('none');
    }

    const cleanFunctionItem = (item, functionType) =>{
        let t = item.split("{");
        let u = t[1].split("}")
        let exp =u[0];
        if(functionType === '+'){
            let arr = []
            let pos = exp.split('+');
            pos.map(item => {
                let a = item.split('(');
                let b = a[1].split(')');
                let [x,y] = b[0].split(',');
                arr.push({x,y});
                return 0;
            });
            return arr;
        }
    }

    const resolveFunctions = (item,functionType) =>{
        let functionItem = cleanFunctionItem(item, functionType);
        if(functionType === '+'){
            let sum = 0;
            functionItem.map(cell =>{ 
                sum = sum + parseInt(data[parseInt(cell.x)][parseInt(cell.y)])
                return 0
            });
            return sum
        }
        return item;
    }

    const renderTable = () => {
        return data.map((row, i) =>
            (<tr key={i}>
                {   
                    row.map((item, j) => {
                        let functionType = null;
                        if(item && 
                            (item.includes("sum") || item.includes("SUM")) && 
                            (item.includes("{") && item.includes("}")) && 
                            (item.includes('+') || item.includes(":"))
                        ){
                            functionType = '+'
                        }
                        return (<td key={`${i}-${j}`}>
                            <EditableElement onSelect={handleStructureChange} onChange={handleDataChange} x={i} y={j}>
                                <div className='cell' onContextMenu={handleCellContextMenuClick}  x={i} y={j}>
                                    {functionType ? resolveFunctions(item, functionType) :item}
                                </div>
                            </EditableElement>
                        </td>)
                    })
                }
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