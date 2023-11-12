import React from "react";
import { ComponentType, PositionType, Properties } from "./ConstUtils";

export const generateId = (componentType) => {
    return `vwx_${componentType}_${Date.now()}`;
}

const generateMainStyles = (mainStyles) => {
    return `.vwx_mainContainer{background-color: ${mainStyles.backgroundColor};border-radius: ${mainStyles.cornerRadius}px;height: ${mainStyles.height}px;width: ${mainStyles.width}px;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);position: relative;overflow-x:hidden;}.vwx_static_content{position: relative;height: ${mainStyles.height}px;width: ${mainStyles.width}px; overflow-y: auto; ${mainStyles.padding ? `padding: ${mainStyles.padding};`: ''}}`;
}

const styleValue = (key, value) => {
    if(key === Properties.position) {
        if(value === PositionType.Stacked) {
            return "static";
        } else {
            return "absolute";
        }
    }
    return value;
}

const createStylesheet = (styles) => {
    let result = "";
    Object.keys(styles).forEach(key => {
        const value = styles[key];
        if(!value) return;
        result+=`.${key}{
            ${Object.keys(value).map(valKey => {
                const stylesValue = styleValue(valKey, value[valKey]);
                if(!stylesValue) return '';
                return `${Properties[valKey]}: ${stylesValue};`;
            }).join("")}}`
    });
    return result;
}

export const generateStyles = (mainStyles, componentStyles) => {
    let styles = generateMainStyles(mainStyles);
    styles += createStylesheet(componentStyles);
    return styles;
}

const getComponents = (componentList) => {
    return componentList.map(component => {
        let props = {
            "className": `vwx_comp ${component.vId}`,
        };
        let componentType = "div";
        let children = []
        if(component.componentType === ComponentType.Image) {
            componentType = "img"
            props.src = component.src;
        } else if(component.componentType === ComponentType.Text) {
            children = [component.text];
        } else if (component.componentType === ComponentType.Button) {
            componentType = "button";
            props.type = "button";
            children = [component.text];
        } else if (component.componentType === ComponentType.Row) {
            componentType = "div";
            children = [getComponents(component.children)]
        }
        return React.createElement(componentType, props, ...children);
    });
}

export const generateComponents = (componentList, staticContentIndex) => {
    const modifiedComponentList = getComponents(componentList);

    const staticContainer = React.createElement(
        "div",
        { className: "vwx_static_content" },
        ...modifiedComponentList.splice(staticContentIndex)
    )

    const container = React.createElement( 
        "div",
        {
            "className": "vwx_mainContainer",
        },
        ...modifiedComponentList.splice(0, staticContentIndex),
        staticContainer
    );
    return container;
}

export const styleNumParser = (styleNum, elem, type) => {
    try {
        if(styleNum.endsWith("px")) {
            const num = parseFloat(styleNum);
            return isNaN(num) ? 0 : num;
        } else {
            const currDimen = elem.getBoundingClientRect();
            return currDimen[type];
        }
    } catch(e) {
        return 0;
    }
} 

export const getComponentType = (elem) => {
    if(!elem) {
        return null;
    }
    const computedStyle = window.getComputedStyle(elem);
    if(computedStyle.display.toLowerCase() === 'flex') {
        return null;
    } else if(computedStyle.position.toLowerCase() === 'absolute') {
        return PositionType.Locked;
    } else {
        return PositionType.Stacked;
    }
}
