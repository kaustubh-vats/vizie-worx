import React from "react";
export default function TextColorIcon({color}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="30" height="24" fill={color}>
            <path d="M12,19H11V5h3V6a1,1,0,0,0,2,0V4a.99974.99974,0,0,0-1-1H5A.99974.99974,0,0,0,4,4V6A1,1,0,0,0,6,6V5H9V19H8a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Zm5.74316-8.99951a1.03261,1.03261,0,0,0-1.48632,0C15.72754,10.58838,14,12.61377,14,14a3,3,0,0,0,6,0C20,12.61377,18.27246,10.58838,17.74316,10.00049ZM17,15a.98928.98928,0,0,1-1-.99854,5.16021,5.16021,0,0,1,1-1.75781A5.14582,5.14582,0,0,1,18,14.001.98908.98908,0,0,1,17,15Z"/>
        </svg>
    )
}