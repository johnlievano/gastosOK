import React from 'react';
import './Sidebar.css'; // o inline si prefieres

export default function Sidebar({ onClose }) {
    return (
        <div className="sidebar">
            <button className="close-btn" onClick={onClose}>✕</button>
            <nav>
                <ul>
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Gastos</a></li>
                    <li><a href="#">Estadísticas</a></li>
                </ul>
            </nav>
        </div>
    );
}
