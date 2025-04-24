import React from "react";
import ListOfThings from "../components/ListOfThings";
import "../../styles.css";

export default function Capital(){
    return(
        <>
        <div className="expenses-wrapper">
                    <div className="expenses-box" style={{ width: "35%" }}>
                        <ListOfThings title="" width={30} />
                </div>
                    <div className="expenses-box" style={{ width: "60%" }}>
                        <ListOfThings title="" width={60} />
                    </div>
                </div>
        </>
    );
}