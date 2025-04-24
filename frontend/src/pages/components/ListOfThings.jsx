import { useState } from "react"

export default function ListOfThings({title = "Sin título", width}){
    return (
        <>
        <div>
            <h2 className="list-of-things">{title}</h2>
            {/* ítems, botones, formularios, etc*/}
        </div>
        </>
    )
}