import { useState, useEffect } from 'react';
import Buttom from "../components/Buttom";
import {
    getGastos
} from '../utils/Request.api'; 

export default function Index(){
    const [texto,setTexto] = useState("");
    useEffect(()=>{
        const views = async () =>{
        const newTexto = await getGastos();
        setTexto(newTexto);
        };
        views();
    },[]);
    return(
        <>
            <p>Hola Mundo</p>
            <p>{texto}</p>
            <Buttom text="Email" icon="CiMail" color="teal" variant="solid" size="lg" />
        </>
    );  
}
