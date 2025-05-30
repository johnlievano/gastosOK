import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles.css";
import { getGastos } from '../../utils/Request.api';
import Start from "../components/Start";
import ThemeToggle from "../components/ThemeToggle";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from "../components/ThemeContext";

console.log("Renderizando HOME");

export default function Home() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [texto, setTexto] = useState("");
    const [title, setTitle] = useState("GASTOSOK");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    // Cierre del sidebar al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        }

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        localStorage.setItem("isDarkmode", JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        const fakeData = "Aquí irían los gastos si tuviéramos backend.";
        setTexto(fakeData);
    }, []);

    const handleMouseEnter = () => setTitle("¡Haz crecer tus ahorros, controla tus gastos!");
    const handleMouseLeave = () => setTitle("GastosOK");

    const sampleData = [
        { name: 'Ene', gasto: 500 },
        { name: 'Feb', gasto: 400 },
        { name: 'Mar', gasto: 300 },
        { name: 'Abr', gasto: 700 },
        { name: 'May', gasto: 200 },
    ];

    return (
        <div className={`start-wrapper ${isDarkMode ? "dark-mode" : "light-mode"}`}>
            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        className="sidebar"
                        initial={{ x: -250, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -250, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        ref={sidebarRef}
                    >
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/" onClick={() => setIsSidebarOpen(false)}>Inicio</Link>
                                </li>
                                <li>
                                    <Link to="/expenses" onClick={() => setIsSidebarOpen(false)}>Gastos</Link>
                                </li>
                                <li>
                                    <Link to="/savings" onClick={() => setIsSidebarOpen(false)}>Ahorros</Link>
                                </li>
                                <li>
                                    <Link to="/calendar" onClick={() => setIsSidebarOpen(false)}>Calendario</Link>
                                </li>
                                <li>
                                    <Link to="/settings" onClick={() => setIsSidebarOpen(false)}>Configuración</Link>
                                </li>
                                <li>
                                    <button onClick={() => setIsSidebarOpen(false)}>Cerrar</button>
                                </li>
                            </ul>
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            <header className="start-header">
                <div className="header-left">
                    <Menu
                        className="menu-icon"
                        style={{ visibility: isSidebarOpen ? "hidden" : "visible" }}
                        onClick={() => setIsSidebarOpen(true)}
                    />
                    <h1
                        className="gastosOK-tittle"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                style={{ display: "inline-block" }}
                            >
                                {title}
                            </motion.span>
                        </AnimatePresence>
                    </h1>
                </div>

                <div className="auth-buttons">
                    <Link to="/login" className="btn-login">Iniciar sesión</Link>
                    <Link to="/register" className="btn-register">Registrarse</Link>
                </div>
            </header>

            <div className="overview-wrapper">
                <Start
                    title="Gastos"
                    value="$2000"
                    onClick={() => navigate("/expenses")}
                    style={{ cursor: 'pointer' }}
                />
                <Start
                    title="Ahorros"
                    value="$4000"
                    onClick={() => navigate("/savings")}
                    style={{ cursor: 'pointer' }}
                />
                <Start title="Capital" value="$20000" />
            </div>

            <div className="stats-section">
                <h2 className="stats-title">Estadísticas Mensuales</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sampleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="gasto" fill="#007b83" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
