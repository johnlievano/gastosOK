import React, { useState, useEffect, useRef } from "react";
import ListOfThings from "../components/ListOfThings";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import "../../styles.css";

export default function Savings() {
    const [categorias, setCategorias] = useState(() => {
        const saved = localStorage.getItem("categoriasAhorro");
        return saved ? JSON.parse(saved) : ["EMERGENCIA", "VIAJE", "INVERSIONES", "ALL"];
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formularioActivo, setFormularioActivo] = useState(false);
    const [editandoAhorro, setEditandoAhorro] = useState(null);

    const [ahorrosPorCategoria, setAhorrosPorCategoria] = useState(() => {
        const saved = localStorage.getItem("ahorrosPorCategoria");
        return saved ? JSON.parse(saved) : { ALL: {} };
    });

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
        localStorage.setItem("categoriasAhorro", JSON.stringify(categorias));
    }, [categorias]);

    useEffect(() => {
        localStorage.setItem("ahorrosPorCategoria", JSON.stringify(ahorrosPorCategoria));
    }, [ahorrosPorCategoria]);

    useEffect(() => {
        setAhorrosPorCategoria(prev => ({
            ...prev,
            ALL: categorias
                .filter(cat => cat !== "ALL")
                .flatMap(cat => prev[cat] || [])
        }));
    }, [categorias]);

    const agregarCategoria = () => {
        const nuevaCatUpper = nuevaCategoria.trim().toUpperCase();
        if (!nuevaCatUpper || categorias.includes(nuevaCatUpper)) return;

        const nuevasCategorias = [...categorias];
        const indiceAll = nuevasCategorias.indexOf("ALL");
        nuevasCategorias.splice(indiceAll, 0, nuevaCatUpper);
        setCategorias(nuevasCategorias);

        setAhorrosPorCategoria(prev => ({
            ...prev,
            [nuevaCatUpper]: []
        }));

        setNuevaCategoria("");
        setMostrarFormulario(false);
    };

    const eliminarCategoria = (categoria) => {
        if (categoria === "ALL") return;

        const confirmacion = window.confirm(`¿Está seguro de eliminar la categoría "${categoria}"?`);
        if (!confirmacion) return;

        const nuevasCategorias = categorias.filter(c => c !== categoria);
        setCategorias(nuevasCategorias);

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
            alert("Por favor ingresa un monto válido.");
            return;
        }

        setAhorrosPorCategoria(prev => {
            const categoria = editandoAhorro ? editandoAhorro.categoria : selectedCategory;
            const ahorrosActuales = [...(prev[categoria] || [])];

            if (editandoAhorro) {
                ahorrosActuales[editandoAhorro.index] = nuevoAhorro;
            } else {
                ahorrosActuales.push(nuevoAhorro);
            }

            return {
                ...prev,
                [categoria]: ahorrosActuales
            };
        });

        e.target.reset();
        setFormularioActivo(false);
        setEditandoAhorro(null);
    };

    const eliminarAhorro = (categoria, index) => {
        const confirmacion = window.confirm("¿Estás seguro de eliminar este ahorro?");
        if (!confirmacion) return;

        setAhorrosPorCategoria(prev => {
            const nuevosAhorros = [...prev[categoria]];
            nuevosAhorros.splice(index, 1);
            return {
                ...prev,
                [categoria]: nuevosAhorros
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
                                <li>
                                    <Link to="/" onClick={() => setIsSidebarOpen(false)}>Inicio</Link>
                                </li>
                                <li>
                                    <Link to="/expenses" onClick={() => setIsSidebarOpen(false)}>Gastos</Link>
                                </li>
                                <li>
                                    <Link to="/calendar" onClick={() => setIsSidebarOpen(false)}>Calendario</Link>
                                </li>
                                <li>
                                    <Link to="/settings" onClick={() => setIsSidebarOpen(false)}>
                                        Configuración
                                    </Link>
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
                <Menu
                    className="menu-icon"
                    style={{ visibility: isSidebarOpen ? "hidden" : "visible" }}
                    onClick={() => setIsSidebarOpen(true)}
                />
            </header>

            <div className="expenses-box expenses-box--left scroll-categorias">
                <ListOfThings
                    title="Categorías de Ahorro"
                    categories={categorias}
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
                        <h4>{editandoAhorro ? `Editar ahorro en ${selectedCategory}` : `Agregar ahorro a ${selectedCategory}`}</h4>
                        <input 
                            name="nombre" 
                            placeholder="Nombre" 
                            required 
                            maxLength={30} 
                            defaultValue={editandoAhorro?.nombre || ""} 
                        />
                        <input 
                            name="monto" 
                            type="number" 
                            placeholder="Monto" 
                            required 
                            defaultValue={editandoAhorro?.monto || ""} 
                        />
                        <input 
                            name="fecha" 
                            type="date" 
                            required 
                            defaultValue={editandoAhorro?.fecha || ""} 
                        />
                        <button type="submit">{editandoAhorro ? "Guardar cambios" : "Agregar"}</button>
                        <button 
                            type="button" 
                            onClick={() => {
                                setFormularioActivo(false);
                                setEditandoAhorro(null);
                            }}
                        >
                            Cerrar
                        </button>
                    </form>
                )}

                {(selectedCategory === null || selectedCategory === "ALL"
                    ? categorias.filter(c => c !== "ALL")
                    : [selectedCategory]
                ).map((cat, idx) => (
                    <div key={idx} className="category-card">
                        <div className="category-header">
                            <h3 className="category-title">{cat}</h3>
                            {cat !== "ALL" && (
                                <button
                                    className="btn-agregar-gasto"
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setFormularioActivo(true);
                                        setEditandoAhorro(null);
                                    }}
                                >
                                    Añadir ahorro
                                </button>
                            )}
                        </div>

                        {ahorrosPorCategoria[cat]?.map((ahorro, i) => (
                            <div key={i} className="gasto-item">
                                <span className="gasto-nombre" title={ahorro.nombre}>
                                    {ahorro.nombre}
                                </span>
                                <span className="gasto-monto" style={{ color: "green" }}>
                                    +${ahorro.monto.toLocaleString()}
                                </span>
                                <div className="gasto-acciones">
                                    <span className="gasto-fecha">{ahorro.fecha}</span>

                                    <button
                                        className="btn-editar-gasto"
                                        title="Editar ahorro"
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setFormularioActivo(true);
                                            setEditandoAhorro({ 
                                                categoria: cat, 
                                                index: i, 
                                                ...ahorro 
                                            });
                                        }}
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        className="btn-eliminar-gasto"
                                        onClick={() => eliminarAhorro(cat, i)}
                                        title="Eliminar ahorro"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}