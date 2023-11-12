export const ComponentType = {
    Image: "image",
    Button: "button",
    Text: "text",
    Shape: "shape",
    Row: "row"
}

export const ShapeType = {
    Eclipse: "eclipse",
    Rectangle: "rectangle"
}

export const PositionType = {
    Locked: "locked",
    Stacked: "stacked",
}

export const Properties = {
    borderRadius: "border-radius",
    backgroundColor: "background-color",
    height: "height",
    width: "width",
    position: "position",
    top: "top",
    left: "left",
    bottom: "bottom",
    right: "right",
    marginLeft: "margin-left",
    marginTop: "margin-top",
    color: "color",
    marginBottom: "margin-bottom",
    marginRight: "margin-right",
    borderWidth: "border-width",
    padding: "padding",
    objectFit: "object-fit",
    zIndex: "z-index",
    cursor: "cursor",
    display: "display",
    justifyContent: "justify-content",
    fontSize: "font-size",
    objectPosition: "object-position"
}

export const shapeToStyles = {
    "rectangle": {
        backgroundColor: "background-color",
        top: "top",
        left: "left",
        bottom: "bottom",
        right: "right",
        position: "position",
        marginBottom: "margin-bottom",
        marginRight: "margin-right",
        marginLeft: "margin-left",
        marginTop: "margin-top",
        height: "height",
        width: "width",
        borderRadius: "border-radius",
    },
    "image": {
        top: "top",
        left: "left",
        bottom: "bottom",
        right: "right",
        position: "position",
        marginBottom: "margin-bottom",
        marginRight: "margin-right",
        marginLeft: "margin-left",
        marginTop: "margin-top",
        height: "height",
        width: "width",
        objectFit: "object-fit",
    },
    "button": {
        top: "top",
        left: "left",
        bottom: "bottom",
        right: "right",
        position: "position",
        marginBottom: "margin-bottom",
        marginRight: "margin-right",
        marginLeft: "margin-left",
        marginTop: "margin-top",
        height: "height",
        width: "width",
        backgroundColor: "background-color",
        color: "color",
        fontSize: "font-size"
    },
    "text": {
        top: "top",
        left: "left",
        bottom: "bottom",
        right: "right",
        position: "position",
        marginBottom: "margin-bottom",
        marginRight: "margin-right",
        marginLeft: "margin-left",
        marginTop: "margin-top",
        height: "height",
        width: "width",
        backgroundColor: "background-color",
        color: "color",
        fontSize: "font-size"
    },
    "eclipse": {
        backgroundColor: "background-color",
        top: "top",
        left: "left",
        bottom: "bottom",
        right: "right",
        position: "position",
        marginBottom: "margin-bottom",
        marginRight: "margin-right",
        marginLeft: "margin-left",
        marginTop: "margin-top",
        height: "height",
        width: "width",
    },
    "row": {
        backgroundColor: "background-color",
        top: "top",
        left: "left",
        bottom: "bottom",
        right: "right",
        position: "position",
        marginBottom: "margin-bottom",
        marginRight: "margin-right",
        marginLeft: "margin-left",
        marginTop: "margin-top",
        height: "height",
        width: "width",
        justifyContent: "justify-content"
    }
}

/*
 [                       ] 
            [t]         |
       [l]       [r]   [h]
            [b]         |
 -----------[w]---------
 
 [ obj ]    [[]]   [r] [f]
*/