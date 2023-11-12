import React, { ReactNode } from "react"
import App from "./component/App.jsx"

type ComponentType = "shape"|"text"|"button"|"image"|"row"

type ComponentDataType = {
    vId: string,
    children: Array<ReactNode>,
    componentType: ComponentType,
    positionType: "locked"|"stacked",
    shapeType: "rectangle"|"eclipse",
    src: string,
    text: string
}

export default function VizieWorxWrapper({
    componentListDefault,
    componentStyleDefault,
    defaultText,
    defaultButtonText,
    containerPadding,
    defaultImageSrc,
    onUpdateCode
}: {
    componentListDefault?: Array<ComponentDataType>,
    componentStyleDefault?: any,
    defaultText?: string,
    defaultButtonText?: string,
    containerPadding?: string,
    defaultImageSrc?: string
    onUpdateCode?: Function
}) {
    return (
        <App
            componentListDefault={componentListDefault}
            componentStyleDefault={componentStyleDefault}
            defaultText={defaultText}
            defaultButtonText={defaultButtonText}
            containerPadding={containerPadding}
            defaulImageSrc={defaultImageSrc}
            onUpdateCode={onUpdateCode}
        />
    )
}