import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../components/ThemeContext";
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import "../../styles.css";


export default function Settings() {
    const { isDarkMode, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("perfil");
    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [username, setUsername] = useState("usuario123");
    const [email, setEmail] = useState("usuario@correo.com");
    const [password, setPassword] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);


    // Cerrar sidebar al hacer clic fuera
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

    const handleSave = (e) => {
        e.preventDefault();

        if (activeTab === "seguridad" && (!currentPassword || !password)) {
            setPasswordError("Debes completar ambos campos para cambiar la contraseña.");
            return;
        }

        setPasswordError("");
        alert("Cambios guardados (simulado)");
    };

    return (
        <div className={`settings-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
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

            {/* Menú (3 líneas) sin título */}
            <header className="start-header">
                <Menu
                    className="menu-icon"
                    style={{ visibility: isSidebarOpen ? "hidden" : "visible" }}
                    onClick={() => setIsSidebarOpen(true)}
                />
            </header>

            <h2>Configuración del perfil</h2>

            {/* Navegación tipo pestañas */}
            <div className="tab-nav">
                <span
                    className={activeTab === "perfil" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("perfil")}
                >
                    Perfil
                </span>
                <span
                    className={activeTab === "tema" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("tema")}
                >
                    Tema
                </span>
                <span
                    className={activeTab === "seguridad" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("seguridad")}
                >
                    Seguridad
                </span>
            </div>

            {/* Contenido de cada pestaña */}
            {activeTab === "perfil" && (
                <form onSubmit={handleSave} className="settings-form">
                    <label>
                        Nombre de usuario:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>

                    <label>
                        Correo electrónico:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <button type="submit">Guardar cambios</button>
                </form>
            )}

            {activeTab === "tema" && (
                <div className="settings-form">
                    <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                </div>
            )}

            {activeTab === "seguridad" && (
                <form onSubmit={handleSave} className="settings-form">
                    <label>
                        Contraseña actual:
                        <input
                            type="password"
                            placeholder="Ingresa tu contraseña actual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Nueva contraseña:
                        <input
                            type="password"
                            placeholder="Ingresa nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={!currentPassword}
                            required
                        />
                    </label>
                    {passwordError && <p className="error-text">{passwordError}</p>}
                    <button
                        type="submit"
                        disabled={!currentPassword || !password}
                    >
                        Guardar nueva contraseña
                    </button>
                </form>
            )}
        </div>
    );
}
