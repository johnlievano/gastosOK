import { useState } from 'react'
import './App.css'
import {
  getGastos
} from './utils/Request.api'; 

function App() {
  const [texto,setTexto] = useState("");
  const views = async () =>{
    const newTexto = await getGastos();
    setTexto(newTexto);
  };

  return (
    <>
    <p>Hola Mundo :D</p>
    <p>{texto}</p>
    </>
  )
}

export default App
