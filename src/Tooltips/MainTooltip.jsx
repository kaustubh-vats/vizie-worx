import styles from '../css/tooltip.module.css'
import { useState, React } from 'react';
import BorderRadius from '../icons/borderRadius.jsx';
import HeightIcon from '../icons/height.jsx';
import WidthIcon from '../icons/width.jsx';
import BackgroundColorIcon from '../icons/bgColor.jsx';
import AddComponentPopup from '../Popups/AddComponentPopup.jsx';

export default function MainTooltip({
    width,
    backgroundColor,
    height,
    cornerRadius,
    onWidthChange,
    onHeightChange,
    onColorChange,
    onCornerRadiusChange,
    onAddComponent,
    onClick
}) {
    const [color, setColor] = useState(backgroundColor || '#ffffff');
    const [focusOnColor, setFocusOnColor] = useState(false);
    const [openPopup, setPopup] = useState(false);
    const [shouldCollapsePopup, setShouldCollapsePopup] = useState(false);
    const onColorChangeEvent = (event) => {
        let color = event?.target?.value;
        if (color) {
            setColor(color);
            onColorChange(color);
        }
    }
    const onHeightChangeEvent = (event) => {
        let height = event?.target?.value;
        if (height && !isNaN(parseInt(height,10))) {
            onHeightChange(parseInt(height,10));
        }
    }
    const onWidthChangeEvent = (event) => {
        let width = event?.target?.value;
        if (width && !isNaN(parseInt(width, 10))) {
            onWidthChange(parseInt(width, 10));
        }
    }
    const onCornerRadiusChangeEvent = (event) => {
        let radius = event?.target?.value;
        if (radius && !isNaN(parseInt(radius, 10))) {
            onCornerRadiusChange(parseInt(radius, 10));
        }
    }

    const onHidePopup = () => {
        setPopup(false);
        setShouldCollapsePopup(false);
    }

    const handlePopup = () => {
        if(openPopup) {
            setShouldCollapsePopup(true);
        } else {
            setPopup(true);
        }
    }

    const onAddComponentEvent = (componetType, shapeType) => {
        onAddComponent(componetType, shapeType);
        // setShouldCollapsePopup(true);
    }

    return (
        <div onClick={onClick}>
            <div className={styles.vwx_tooltip__container} style={{width: width}}>
                <div>
                    <label title='Width' htmlFor='width'>
                        <WidthIcon color="#ffffff" />
                        <input onInput={onWidthChangeEvent} id="width" type="number" className={styles.vwx_tooltip__input} placeholder='0' defaultValue={width} min={0} />
                    </label>
                    <label title='Height' htmlFor='height'>
                        <HeightIcon color='#ffffff' />
                        <input onInput={onHeightChangeEvent} id='height' type="number" className={styles.vwx_tooltip__input} placeholder='0' defaultValue={height} min={0} />
                    </label>

                </div>
                <div>
                    <button type="button" onClick={handlePopup} title='Add Components' className={`${styles.vwx_tooltip__add} ${openPopup ? styles.vwx_tooltip__rotated: ""}`}>+</button>
                </div>
                <div>
                    <label title='Corner Radius' className={styles.vwx_radius__container} htmlFor='radius'>
                        <BorderRadius color='#ffffff' />
                        <input onInput={onCornerRadiusChangeEvent} id="radius" type="number" className={styles.vwx_tooltip__input} placeholder='0' defaultValue={cornerRadius} min={0} />
                    </label>
                    <label title='Background Color' htmlFor='maincolor'>
                        <BackgroundColorIcon color="#ffffff" />
                        <div className={`${styles.vwx_color__preview} ${focusOnColor ? styles.vwx_color__focus :''}`} style={{ background: color }}></div>
                        <input onFocus={()=>setFocusOnColor(true)} onBlur={()=>setFocusOnColor(false)} onInput={onColorChangeEvent} id='maincolor' type="color" className={styles.vwx_tooltip__input} placeholder='0' defaultValue={color}/>
                    </label>
                </div>
            </div>
            {
                openPopup ? 
                <AddComponentPopup
                    onSelect={onAddComponentEvent}
                    onHidePopup={onHidePopup}
                    shouldCollapse={shouldCollapsePopup}
                /> : null
            }
        </div>
    )
}