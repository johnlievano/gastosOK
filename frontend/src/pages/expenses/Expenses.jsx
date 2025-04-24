import React from "react";
import ListOfThings from "../components/ListOfThings";
import "../../styles.css";

export default function Expenses() {
    return (
        <div className="expenses-wrapper">
            <div className="expenses-box" style={{ width: "35%" }}>
                <ListOfThings title="Su" width={30} />
        </div>
            <div className="expenses-box" style={{ width: "60%" }}>
                <ListOfThings title="PutaMadre" width={60} />
            </div>
        </div>
    );
}


