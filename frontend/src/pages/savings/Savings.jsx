import React, { useState, useEffect, useRef } from "react";
import ListOfThings from "../components/ListOfThings";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import "../../styles.css";

export default function Savings() {
    const [categoriasAhorro, setCategoriasAhorro] = useState(() => {
        const saved = localStorage.getItem("categoriasAhorro");
        return saved ? JSON.parse(saved) : ["EMERGENCIA", "VIAJE", "INVERSIONES", "ALL"];
    });

    const [ahorrosPorCategoria, setAhorrosPorCategoria] = useState(() => {
        const saved = localStorage.getItem("ahorrosPorCategoria");
        return saved ? JSON.parse(saved) : {};
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formularioActivo, setFormularioActivo] = useState(false);
    const { isDarkMode } = useTheme();

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
        localStorage.setItem("categoriasAhorro", JSON.stringify(categoriasAhorro));
    }, [categoriasAhorro]);

    useEffect(() => {
        localStorage.setItem("ahorrosPorCategoria", JSON.stringify(ahorrosPorCategoria));
    }, [ahorrosPorCategoria]);

    const getAhorrosALL = () => {
        return categoriasAhorro
            .filter(cat => cat !== "ALL")
            .flatMap(cat => ahorrosPorCategoria[cat] || []);
    };

    const agregarCategoria = () => {
        const nuevaCat = nuevaCategoria.trim().toUpperCase();
        if (!nuevaCat || categoriasAhorro.includes(nuevaCat)) return;

        const nuevas = [...categoriasAhorro];
        const idx = nuevas.indexOf("ALL");
        nuevas.splice(idx, 0, nuevaCat);
        setCategoriasAhorro(nuevas);

        setAhorrosPorCategoria(prev => ({
            ...prev,
            [nuevaCat]: []
        }));

        setNuevaCategoria("");
        setMostrarFormulario(false);
    };

    const eliminarCategoria = (categoria) => {
        if (categoria === "ALL") return;
        if (!window.confirm(`¿Eliminar categoría "${categoria}"?`)) return;

        setCategoriasAhorro(categoriasAhorro.filter(c => c !== categoria));

        setAhorrosPorCategoria(prev => {
            const { [categoria]: _, ...rest } = prev;
            return rest;
        });

        if (selectedCategory === categoria) {
            setSelectedCategory(null);
        }
    };

    const agregarAhorro = (e) => {
        e.preventDefault();
        const nuevoAhorro = {
            nombre: e.target.nombre.value,
            monto: parseFloat(e.target.monto.value),
            fecha: e.target.fecha.value
        };

        if (isNaN(nuevoAhorro.monto) || nuevoAhorro.monto <= 0) {
            alert("Ingresa un monto válido.");
            return;
        }

        setAhorrosPorCategoria(prev => {
            const nuevos = [...(prev[selectedCategory] || []), nuevoAhorro];
            return {
                ...prev,
                [selectedCategory]: nuevos
            };
        });

        e.target.reset();
        setFormularioActivo(false);
    };

    const eliminarAhorro = (categoria, index) => {
        if (!window.confirm("¿Eliminar este ahorro?")) return;

        setAhorrosPorCategoria(prev => {
            const nuevos = [...prev[categoria]];
            nuevos.splice(index, 1);
            return {
                ...prev,
                [categoria]: nuevos
            };
        });
    };

    return (
        <div className={`expenses-wrapper ${isDarkMode ? "dark-mode" : "light-mode"}`}>
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
                                <li><Link to="/" onClick={() => setIsSidebarOpen(false)}>Inicio</Link></li>
                                <li><Link to="/expenses" onClick={() => setIsSidebarOpen(false)}>Gastos</Link></li>
                                <li><Link to="/calendar" onClick={() => setIsSidebarOpen(false)}>Calendario</Link></li>
                                <li><Link to="/settings" onClick={() => setIsSidebarOpen(false)}>Configuración</Link></li>
                                <li><button onClick={() => setIsSidebarOpen(false)}>Cerrar</button></li>
                            </ul>
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            <header className="start-header">
                <Menu
                    className="menu-icon"
                    style={{ visibility: isSidebarOpen ? "hidden" : "visible" }}
                    onClick={() => setIsSidebarOpen(true)}
                />
            </header>

            <div className="expenses-box expenses-box--left scroll-categorias">
                <ListOfThings
                    title="Categorías de Ahorro"
                    categories={categoriasAhorro}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                    onDelete={eliminarCategoria}
                />

                <div className="nueva-categoria-wrapper">
                    {!mostrarFormulario ? (
                        <button className="btn-agregar-categoria" onClick={() => setMostrarFormulario(true)}>
                            Añadir categoría
                        </button>
                    ) : (
                        <div className="nueva-categoria">
                            <input
                                type="text"
                                placeholder="Nueva categoría"
                                value={nuevaCategoria}
                                onChange={e => setNuevaCategoria(e.target.value.toUpperCase())}
                            />
                            <button onClick={agregarCategoria}>Añadir</button>
                            <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="expenses-box expenses-box--right">
                {formularioActivo && selectedCategory && selectedCategory !== "ALL" && (
                    <form className="gasto-form" onSubmit={agregarAhorro}>
                        <h4>Agregar ahorro a {selectedCategory}</h4>
                        <input name="nombre" placeholder="Nombre" required maxLength={30} />
                        <input name="monto" type="number" placeholder="Monto" required />
                        <input name="fecha" type="date" required />
                        <button type="submit">Agregar</button>
                        <button type="button" onClick={() => setFormularioActivo(false)}>Cerrar</button>
                    </form>
                )}

                {(selectedCategory === null || selectedCategory === "ALL"
                    ? categoriasAhorro.filter(c => c !== "ALL")
                    : [selectedCategory]
                ).map((cat, idx) => {
                    const ahorros = cat === "ALL" ? getAhorrosALL() : (ahorrosPorCategoria[cat] || []);
                    return (
                        <div key={idx} className="category-card">
                            <div className="category-header">
                                <h3 className="category-title">{cat}</h3>
                                {cat !== "ALL" && (
                                    <button
                                        className="btn-editar"
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setFormularioActivo(true);
                                        }}
                                    >
                                        Editar
                                    </button>
                                )}
                            </div>

                            {ahorros.map((ahorro, i) => (
                                <div key={i} className="gasto-item">
                                    <span className="gasto-nombre" title={ahorro.nombre}>
                                        {ahorro.nombre}
                                    </span>
                                    <span className="gasto-monto" style={{ color: "green" }}>
                                        +${ahorro.monto.toLocaleString()}
                                    </span>
                                    <div className="gasto-acciones">
                                        <span className="gasto-fecha">{ahorro.fecha}</span>
                                        {formularioActivo && selectedCategory === cat && (
                                            <>
                                                <button className="btn-editar-gasto" title="Editar ahorro">✏️</button>
                                                <button
                                                    className="btn-eliminar-gasto"
                                                    onClick={() => eliminarAhorro(cat, i)}
                                                    title="Eliminar ahorro"
                                                >
                                                    🗑️
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
