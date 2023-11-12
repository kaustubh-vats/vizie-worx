import React from "react";
export default function CropIcon({color}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 255.993 255.993" id="crop" height="24" width="24">
            <rect width="24" height="24" fill="none"/>
            <line x1="63.994" x2="24.002" y1="64" y2="64" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
            <polyline fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="24" points="64.002 24 64.002 192.001 232.002 192.001"/>
            <polyline fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="24" points="192.002 152.001 192.002 64 103.994 64"/>
            <line x1="192.002" x2="192.002" y1="232.001" y2="192.001" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
        </svg>
    )
}