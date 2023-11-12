import { useState, forwardRef, React } from 'react';
import styles from '../css/tooltip.module.css';
import componentStyles from '../css/componentTip.module.css';
import BackgroundColorIcon from '../icons/bgColor.jsx';
import BorderRadius from '../icons/borderRadius.jsx';
import HeightIcon from '../icons/height.jsx';
import WidthIcon from '../icons/width.jsx';
import LeftIcon from '../icons/left.jsx';
import RightIcon from '../icons/right.jsx';
import BottomIcon from '../icons/bottom.jsx';
import TopIcon from '../icons/top.jsx';
import TextColorIcon from '../icons/textColor.jsx';
import FontSizeIcon from '../icons/fontSize.jsx';
import CropIcon from '../icons/crop.jsx';
import { PositionType, shapeToStyles } from '../Utils/ConstUtils';
export default forwardRef(function ComponentTooltip({ width, style, componentType, positionType, onPositionChange, onStyleChange, onCompChange, compData }, ref) {
    const [focusOnColor, setFocusOnColor] = useState(false);
    const [focusOnBgColor, setFocusOnBgColor] = useState(false);

    const styleMapping = {
        height: style.height,
        width: style.width,
        color: style.color,
        bgColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        fontSize: style.fontSize,
        crop: style.objectFit,
        justifyContent: style.justifyContent,
        top: (positionType === PositionType.Stacked) ? style.marginTop : style.top,
        left: (positionType === PositionType.Stacked) ? style.marginLeft : style.left,
        right: (positionType === PositionType.Stacked) ? style.marginRight : style.right,
        bottom: (positionType === PositionType.Stacked) ? style.marginBottom : style.bottom
    }

    const compDataMapping = {
        text: compData.text,
        src: compData.src
    }

    const showComp = {
        image: {
            src: "src"
        },
        button: {
            text: "text"
        },
        text: {
            text: "text"
        }
    }

    const showStylesMapping = shapeToStyles[componentType] || {};
    const showCompMapping = showComp[componentType] || {};
    const rowOne = showStylesMapping.backgroundColor || showStylesMapping.color || showCompMapping.src;
    const rowTwo = showStylesMapping.borderRadius || showStylesMapping.fontSize;
    const rowThree = showStylesMapping.objectFit || showStylesMapping.justifyContent || showCompMapping.text;

    const getUpdatedValue = (value, delta) => {
        value = value || '0px';
        const valToNum = parseFloat(value);
        if (isNaN(valToNum)) return value;
        const updatedNum = valToNum + delta;
        const updatedValue = value.replace(valToNum.toString(), updatedNum.toString());
        return updatedValue;
    }

    const onKeyDown = (e, type, isCoordBased) => {
        if (e.target && e.target.value !== null) {
            if (e?.key?.toLowerCase() === 'arrowdown') {
                e.target.value = getUpdatedValue(e.target.value, -1);
                if (isCoordBased) {
                    onCoordsChange(type, e.target);
                } else {
                    onCssChange(type, e.target);
                }
                e.preventDefault();
                e.stopPropagation();
            } else if (e?.key?.toLowerCase() === 'arrowup') {
                e.target.value = getUpdatedValue(e.target.value, 1);
                if (isCoordBased) {
                    onCoordsChange(type, e.target);
                } else {
                    onCssChange(type, e.target);
                }
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

    const onCssChange = (key, target) => {
        if (target && target.value != null) {
            const value = target.value;
            const style = {}
            style[key] = value;
            onStyleChange(style);
        }
    }

    const onCompChangeEvent = (key, target) => {
        if (target && target.value != null) {
            onCompChange(key, target.value);
        }
    }

    const onCssChangeByValue = (key, value) => {
        const style = {}
        style[key] = value;
        onStyleChange(style);
    }

    const getAlternateType = (type) => {
        switch (type) {
            case "top": return "bottom";
            case "bottom": return "top";
            case "left": return "right";
            case "right": return "left";
            default: return "bottom";
        }
    }

    const onCoordsChange = (type, target) => {
        const alternateType = getAlternateType(type);
        if (positionType === PositionType.Stacked) {
            onCssChange(`margin${type.charAt(0).toUpperCase()}${type.slice(1)}`, target);
        } else {
            onCssChange(type, target);
            onCssChangeByValue(alternateType, undefined);
        }
    }

    return (
        <div ref={ref} className={`${styles.vwx_tooltip__container} ${componentStyles.vwx_tooltip__container}`} style={{ width: width }}>
            <div className={styles.vwx_tooltip__left}>
                <div className={styles.vwx__left_inputs}>
                    {showStylesMapping['height'] && <label title='Height' htmlFor='heightComponent'>
                        <HeightIcon color='#ffffff' />
                        <input onKeyDown={(e) => onKeyDown(e, 'height', false)} onInput={(e) => { onCssChange('height', e.target) }} id='heightComponent' type="text" className={styles.vwx_tooltip__input} placeholder='0px' value={styleMapping.height || 'auto'} />
                    </label>}
                    {showStylesMapping['width'] && <label title='Width' htmlFor='widthCompenent'>
                        <WidthIcon color='#ffffff' />
                        <input onKeyDown={(e) => onKeyDown(e, 'width', false)} onInput={(e) => { onCssChange('width', e.target) }} id='widthCompenent' type="text" className={styles.vwx_tooltip__input} placeholder='0px' value={styleMapping.width || 'auto'} />
                    </label>}
                </div>
                <div className={styles.vwx__left_inputs}>
                    {showStylesMapping['top'] && <label title='Top' htmlFor='top'>
                        <TopIcon color='#ffffff' />
                        <input onKeyDown={(e) => onKeyDown(e, 'top', true)} onInput={(e) => { onCoordsChange('top', e.target) }} id='top' type="text" className={styles.vwx_tooltip__input} placeholder='0px' value={styleMapping.top || ""} />
                    </label>}
                    {showStylesMapping['bottom'] && <label title='Bottom' htmlFor='bottom'>
                        <BottomIcon color='#ffffff' />
                        <input onKeyDown={(e) => onKeyDown(e, 'bottom', true)} onInput={(e) => { onCoordsChange('bottom', e.target) }} id='bottom' type="text" className={styles.vwx_tooltip__input} placeholder='0px' value={styleMapping.bottom || ""} />
                    </label>}
                </div>
                <div className={styles.vwx__left_inputs}>
                    {showStylesMapping['left'] && <label title='Left' htmlFor='left'>
                        <LeftIcon color='#ffffff' />
                        <input onKeyDown={(e) => onKeyDown(e, 'left', true)} onInput={(e) => { onCoordsChange('left', e.target) }} id='left' type="text" className={styles.vwx_tooltip__input} placeholder='0px' value={styleMapping.left || ""} />
                    </label>}
                    {showStylesMapping['right'] && <label title='Right' htmlFor='right'>
                        <RightIcon color='#ffffff' />
                        <input onKeyDown={(e) => onKeyDown(e, 'right', true)} onInput={(e) => { onCoordsChange('right', e.target) }} id='right' type="text" className={styles.vwx_tooltip__input} placeholder='0px' value={styleMapping.right || ""} />
                    </label>}
                </div>
            </div>
            <div className={styles.vwx_tooltip__right}>
                {rowOne && <div className={styles.vwx__left_inputs}>
                    {showStylesMapping['backgroundColor'] && <label title='Background Color' className={styles.vwx_style__container} htmlFor='bgColor'>
                        <BackgroundColorIcon color='#ffffff' />
                        <div className={`${styles.vwx_color__preview} ${focusOnBgColor ? styles.vwx_color__focus : ''} ${(!styleMapping.bgColor || styleMapping.bgColor === 'transparent') ? componentStyles.vwx_default__color : ''}`} style={{ backgroundColor: styleMapping.bgColor }}></div>
                        <input onFocus={() => setFocusOnBgColor(true)} onBlur={() => setFocusOnBgColor(false)} onInput={(e) => { onCssChange('backgroundColor', e.target) }} id='bgColor' type="color" className={styles.vwx_tooltip__input} value={((!styleMapping.bgColor || styleMapping.bgColor === 'transparent') ? '#ffffff' : styleMapping.bgColor)} />
                    </label>}
                    {showStylesMapping['color'] && <label title='Foreground Color' htmlFor='color'>
                        <TextColorIcon color='#ffffff' />
                        <div className={`${styles.vwx_color__preview} ${focusOnColor ? styles.vwx_color__focus : ''} ${(!styleMapping.color || styleMapping.color === 'transparent') ? componentStyles.vwx_default__color : ''}`} style={{ backgroundColor: styleMapping.color }}></div>
                        <input onFocus={() => setFocusOnColor(true)} onBlur={() => setFocusOnColor(false)} onInput={(e) => { onCssChange('color', e.target) }} id='color' type="color" className={styles.vwx_tooltip__input} value={((!styleMapping.color || styleMapping.color === 'transparent') ? '#ffffff' : styleMapping.color)} />
                    </label>}
                    {showCompMapping['src'] && <label title='Image source' htmlFor='imgsrc'>
                        <FontSizeIcon color='#ffffff' />
                        <input onInput={(e) => { onCompChangeEvent('src', e.target) }} id='imgsrc' type="text" className={`${styles.vwx_tooltip__input} ${styles.vwx_tooltip__max_inp}`} placeholder='Enter the src url' value={compDataMapping.src || ''} />
                    </label>}
                </div>}
                {rowTwo && <div className={styles.vwx__left_inputs}>
                    {showStylesMapping['borderRadius'] && <label title='Border Radius' htmlFor='borderRadius'>
                        <BorderRadius color='#ffffff' />
                        <input onKeyDown={(e) => onKeyDown(e, 'borderRadius', false)} onInput={(e) => { onCssChange('borderRadius', e.target) }} id='borderRadius' type="text" className={styles.vwx_tooltip__input} placeholder='0px' value={styleMapping.borderRadius || ''} />
                    </label>}
                    {showStylesMapping['fontSize'] && <label title='Font Size' htmlFor='fontSize'>
                        <FontSizeIcon color='#ffffff' />
                        <input onKeyDown={(e) => onKeyDown(e, 'fontSize', false)} onInput={(e) => { onCssChange('fontSize', e.target) }} id='fontSize' type="text" className={styles.vwx_tooltip__input} placeholder='0px' value={styleMapping.fontSize || ''} />
                    </label>}
                </div>}
                {rowThree && <div className={styles.vwx__left_inputs}>
                    {showStylesMapping['objectFit'] && <label title='Image Fit' htmlFor='imageFit'>
                        <CropIcon color='#ffffff' />
                        <select value={styleMapping.crop} onInput={(e) => { onCssChange('objectFit', e.target) }} id='imageFit' className={`${styles.vwx_tooltip__input} ${styles.vwx_tooltip__dropdown}`}>
                            <option value="cover">Center Crop</option>
                            <option value="fill">Fill</option>
                            <option value="contain">Contain</option>
                            <option value="scale-down">Scale Down</option>
                        </select>
                    </label>}
                    {showStylesMapping['justifyContent'] && <label title='Justify Row Content' htmlFor='justifyContent'>
                        <WidthIcon color='#ffffff' />
                        <select value={styleMapping.justifyContent} onInput={(e) => { onCssChange('justifyContent', e.target) }} id='justifyContent' className={`${styles.vwx_tooltip__input} ${styles.vwx_tooltip__dropdown}`}>
                            <option value="space-around">Space Around</option>
                            <option value="space-between">Space Between</option>
                            <option value="space-evenly">Space Evenly</option>
                            <option value="center">Center</option>
                            <option value="flex-start">Start</option>
                            <option value="flex-end">End</option>
                        </select>
                    </label>}
                    {showCompMapping['text'] && <label title='Text Content' htmlFor='textcontent'>
                        <FontSizeIcon color='#ffffff' />
                        <input onInput={(e) => { onCompChangeEvent('text', e.target) }} id='textcontent' type="text" className={`${styles.vwx_tooltip__input} ${styles.vwx_tooltip__max_inp}`} placeholder='Enter any text' value={compDataMapping.text || ''} />
                    </label>}
                </div>}
            </div>
        </div>
    )
})