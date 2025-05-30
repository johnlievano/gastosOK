import React from "react";
import "../../styles.css";

export default function Start({ title, value, onClick }) {
    return (
        <div
            className="overview-box"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <h2>{title}</h2>
            <p className="value">{value}</p>
        </div>
    );
}
