import { useLayoutEffect, useEffect, useRef, React } from "react";
import styles from '../css/playground.module.css';
import { getComponentType } from "../Utils/CommonUtils";
import { ComponentType } from "../Utils/ConstUtils";

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function PlayGround({
    children,
    selectedElem,
    setSelectedElem,
    onScale,
    onMouseUp,
    onMouseMove,
    onDragElemStart,
    setGroupList,
    groupList
}){
    const mainDiv = useRef(null);
    const mainOutlineRef = useRef(null);
    const outlineRef = useRef(null);
    const isScaling = useRef(false);
    const scaleStartCoords = useRef({x: 0, y: 0});
    const outlineSelectedRef = useRef(null);
    const handleClick = (event) => {
        const x = event.clientX;
        const y = event.clientY;
        const points = document.elementsFromPoint(x, y);
        if(points && points[0]) {
            let sz = points.length;
            let startIndex = -1;
            for(let i=0;i<sz;i++){
                if(points[i].parentElement 
                    && points[i].parentElement.classList 
                    && points[i].parentElement.classList.length > 0
                    && [...points[i].parentElement.classList].join('').includes(ComponentType.Row)){
                    continue;
                }
                if(points[i].classList && points[i].classList.contains("vwx_comp")){
                    startIndex = i;
                    break;
                }
                if(points[i].classList && points[i].classList.contains("vwx_outline")){
                    return;
                }
            }
            if(startIndex === -1){ 
                setSelectedElem(null);
                setGroupList([]);
                return;
            }
            let currBounds = points[startIndex].getBoundingClientRect();
            let minBounds = currBounds;
            let currSelectedElem = points[startIndex];
            for(let i=startIndex; i<sz; i++){
                let elem = points[i];
                if(elem.classList.contains("vwx_mainContainer") || elem.tagName.toLowerCase() === "body" || elem.classList.contains("vwx_outline")) {
                    break;
                }
                if(elem.classList.contains("vwx_static_content")) {
                    continue;
                }
                if(elem.parentElement 
                    && elem.parentElement.classList 
                    && elem.parentElement.classList.length > 0
                    && [...elem.parentElement.classList].join('').includes(ComponentType.Row)){
                    continue;
                }
                currBounds = elem.getBoundingClientRect();
                if(currBounds.left >= minBounds.left &&
                    currBounds.right <= minBounds.right &&
                    currBounds.top >= minBounds.top && 
                    currBounds.bottom <= minBounds.bottom) {
                    minBounds = currBounds;
                    currSelectedElem = elem;
                }
            }
            if(event.shiftKey) {
                let groupListType = null;
                let currElemType = getComponentType(currSelectedElem);
                if(groupList && groupList.length > 0){
                    groupListType = getComponentType(groupList[0]);
                }
                if(!currElemType) {
                    return;
                }
                if(selectedElem) {
                    let selectedElemType = getComponentType(selectedElem);
                    if(currElemType === selectedElemType) {
                        setGroupList([...groupList, selectedElem, currSelectedElem]);
                        setSelectedElem(null);
                        return;
                    } 
                }
                if(groupListType) {
                    if(groupListType === currElemType) {
                        setGroupList([...groupList, currSelectedElem]);
                    } else {
                        setGroupList([currSelectedElem]);
                    }
                } else {
                    setGroupList([...groupList, currSelectedElem]);
                }
                setSelectedElem(null);
            } else {
                setSelectedElem(currSelectedElem);
                setGroupList([]);
            }
        }
    }
    useIsomorphicLayoutEffect(() => {
        if(outlineRef.current && mainOutlineRef.current && mainDiv.current) {
            if(selectedElem) {
                const rect = selectedElem.getBoundingClientRect();
                const mainRect =  mainDiv.current.getBoundingClientRect();
                mainOutlineRef.current.style.setProperty('--outline-top', (rect.top - mainRect.top)+"px");
                mainOutlineRef.current.style.setProperty('--outline-left', (rect.left - mainRect.left)+"px");
                outlineRef.current.style.setProperty('--outline-height', rect.height+"px");
                outlineRef.current.style.setProperty('--outline-width', rect.width+"px");
                mainOutlineRef.current.style.setProperty('--outline-display', 'block');
            } else {
                mainOutlineRef.current.style.setProperty('--outline-display', 'none');
            }
        }
    }, [selectedElem,children]);

    const scaleStart = (e) => {
        isScaling.current = true;
        scaleStartCoords.current = {
            x: e.pageX,
            y: e.pageY
        }
    }

    const scaleEnd = (e) => {
        isScaling.current = false;
        scaleStartCoords.current = {
            x: 0,
            y: 0
        }
        onMouseUp(e);
    }

    const onScaleMove = (e) => {
        if(isScaling.current) {
            const xDelta = e.pageX - scaleStartCoords.current.x;
            const yDelta = e.pageY - scaleStartCoords.current.y;
            scaleStartCoords.current = {
                x: e.pageX,
                y: e.pageY
            }
            onScale(yDelta, xDelta);
        }
        onMouseMove(e);
    }

    const onOutlineMouseDown = (e) => {
        if(e.target !== outlineSelectedRef.current) {
            onDragElemStart(e);
        }
    }

    const outlineRender = () => {
        if(selectedElem) {
            return <div onMouseDown={onOutlineMouseDown} ref={mainOutlineRef} className={styles.vwx_outline_container}>
                <div ref={outlineRef} className={styles.vwx_outline}>
                    <div ref={outlineSelectedRef} className={styles.vwx_outline_selected}
                        onMouseDown={scaleStart}></div>
                </div>
            </div>
        } 
    }
    const groupOutline = () => {
        if(groupList && groupList.length > 0) {
            return groupList.map((item, index)=>{
                const rect = item.getBoundingClientRect();
                const mainRect =  mainDiv.current.getBoundingClientRect();
                if(rect) {
                    return <div key={`vwx_group_${index}`} style={{
                        height: rect.height + 'px',
                        width: rect.width + 'px',
                        top: (rect.top - mainRect.top) + 'px',
                        left: (rect.left - mainRect.left) + 'px'
                    }} className={styles.vwx__groupOutline}>
                    </div>
                }
                return null;
            })
        }
    }

    return (
        <div 
            onMouseMove={onScaleMove}
            onMouseUp={scaleEnd}
            ref={mainDiv} 
            onClick={handleClick} 
            className={styles.vwx_playground}
        >
            { children }
            { outlineRender() }
            { groupOutline() }
        </div>
    )
}