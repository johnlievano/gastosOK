import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Index from "./pages/index";
import Expenses from './pages/expenses/Expenses';

export default function App(){


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/index" />} />
        <Route path="/index" element={<Index />} />
        <Route path="/Expenses" element={<Expenses />} />
      </Routes>
    </BrowserRouter>
  )
}
