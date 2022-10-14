import React, { useRef, useEffect } from "react";

const EditableElement = (props) => {
  const { onChange, onSelect, x, y } = props;
  const element = useRef();
  let elements = React.Children.toArray(props.children);
  if (elements.length > 1) {
    throw Error("Can't have more than one child");
  }

  const onBlur = () => {
    const value = element.current?.value || element.current?.innerText;
    if (onChange) {
        onChange(value, props.x, props.y);
    }
  };

  const onFocus = () =>{
    if (onChange) {
        onSelect(props.x, props.y);
    }
  }
  useEffect(() => {
    const value = element.current?.value || element.current?.innerText;
    if (onChange) {
      onChange(value, props.x, props.y);
    }
  }, []);
  elements = React.cloneElement(elements[0], {
    contentEditable: true,
    suppressContentEditableWarning: true,
    ref: element,
    onBlur,
    onFocus
  });
  return elements;
};

export default EditableElement;