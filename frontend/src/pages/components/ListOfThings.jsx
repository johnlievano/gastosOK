import React from "react";

export default function ListOfThings({
    title,
    categories,
    selected,
    onSelect,
    onDelete,
    onEdit
    }) {
    return (
        <div className="list-container">
        <h2 className="list-title">{title}</h2>
        <ul className="category-list">
            {categories.map((category) => (
            <li
                key={category}
                className={`category-item ${selected === category ? "active" : ""}`}
            >
                <span onClick={() => onSelect(category)} className="category-name">
                {category}
                </span>
                {category !== "ALL" && (
                <div className="category-actions">
                    <span className="edit-icon" onClick={() => onEdit(category)}></span>
                    <span
                    className="delete-icon"
                    onClick={() => {
                        if (window.confirm("¿Está seguro de eliminar esta categoría?")) {
                        onDelete(category);
                        }
                    }}
                    >
                    🗑️
                    </span>
                </div>
                )}
            </li>
            ))}
        </ul>
        </div>
    );
}
