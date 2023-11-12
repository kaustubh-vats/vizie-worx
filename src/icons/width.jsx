import React from "react";
export default function WidthIcon({ color }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="24" viewBox="0 0 24 24" width="24">
            <g stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="m21 12h-18" />
                <path d="m6 16-4-4 4-4" />
                <path d="m18 16 4-4-4-4" />
            </g>
        </svg>
    )
}