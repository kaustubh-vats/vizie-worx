import { useEffect, React } from "react"
import { ComponentType, ShapeType } from "../Utils/ConstUtils"
import styles from '../css/popup.module.css'
export default function AddComponentPopup({
    onSelect,
    onHidePopup,
    shouldCollapse
}) {
    useEffect (()=>{
        let timeout;

        if(shouldCollapse) {
            timeout = setTimeout(()=>{
                onHidePopup();
            },1000);
        }

        return () => {
            clearTimeout(timeout);
            timeout = null;
        }
    }, [shouldCollapse, onHidePopup])
    
    return (
        <div className={`${styles.vwx_popup__container} ${shouldCollapse ? styles.vwx_popup__hide: ""}`}>
            <div className={styles.vwx_all__components}>
                <button onClick={()=>onSelect(ComponentType.Text,null)} type="button" className={styles.vwx_popup_btn}>Text</button>
                <button onClick={()=>onSelect(ComponentType.Shape,ShapeType.Eclipse)} type="button" className={styles.vwx_popup_btn}>Eclipse</button>
                <button onClick={()=>onSelect(ComponentType.Shape,ShapeType.Rectangle)} type="button" className={styles.vwx_popup_btn}>Rectangle</button>
                <button onClick={()=>onSelect(ComponentType.Image,null)} type="button" className={styles.vwx_popup_btn}>Image</button>
                <button onClick={()=>onSelect(ComponentType.Button,null)} type="button" className={styles.vwx_popup_btn}>Button</button>
            </div>
        </div>
    )
}